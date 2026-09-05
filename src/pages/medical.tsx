import { faCircleChevronLeft, faCircleChevronRight, faNotesMedical, faSpinner, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Crads from "../components/Crads";
import { useCreateMedicalRecordMutation, useGetMedicalRecordAPIQuery } from "../store/Medical.Record.Store";
import { format } from "date-fns";
import { useState } from "react";
import { PageSkeletonLoader } from "../components/Loading";
import { getInitials } from "../utils/generators";
import { COLORS, MESSAGES } from "../utils/constants";
import { DataTable, type Column } from "../components/Table";
import type { AppointmentProps, createMedicalRecord, MedicalRecord, teethTreated } from "../types/Types";
import { useGetAppointmentTodayAPIQuery } from "../store/Appointment.Store";
import { errorCatch, validateTeethTreated } from "../utils/errorHelpers";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import SearchInput from "../components/Search";


const columns: Column<MedicalRecord>[] = [
  {key: "patientCode", header: 'ID', render: (record) => (
    <>
       <p className="px-3 py-2 text-md font-semibold">{record.patientId.patientCode}</p>
    </>
  )},
  {key: "name", header: 'Name', render: (record) => (
    <>
       <div className="px-3 py-2 text-md font-semibold flex items-center space-x-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                {getInitials(record.patientId.name)}
           </div>
          <span>{record.patientId.name}</span>
      </div>
    </>
  )},
  {key: "gender", header: 'Gender', render: (record) => (
    <>
        <span className={`text-gray-800 p-1 rounded-xl ${record.patientId.gender === "Male" ?
             "bg-blue-500/40" : "bg-pink-500/40"}`}>
             {record.patientId.gender}
        </span>
    </>
  )},
  {key: "date", header: 'Date', render: (record) => (
    <>
    <p className="px-3 py-2 text-md font-semibold">{format(record.createdAt, "yyyy-MM-dd")}</p>
    </>
  )},
  {key: "procedure", header: 'procedure', render: (record) => (
    <>
    {record.teethTreated.map((tooth, index) => (
        <div key={index} className="px-3 py-2 text-md font-semibold">
            <span className="text-gray-600 p-1 rounded-xl">{tooth.procedure}</span>
        </div>
    ))}
    </>
  )},
  {key: "toothNumber", header: 'toothNumber', render: (record) => (
    <>
    {record.teethTreated.map((tooth, index) => (
        <div key={index} className="px-3 py-2 text-md font-semibold ml-10">
            <span className=" bg-blue-500/30 p-1.5 rounded-xl">{tooth.toothNumber}</span>
        </div>
    ))}
    </>
  )},
  {key: "newToothCondition", header: 'ToothCondition', render: (record) => (
    <>
    {record.teethTreated.map((tooth, index) => (
        <div key={index} className="px-3 py-2 text-md font-semibold ml-10">
            <span className=" text-gray-600 p-1.5 rounded-xl">{tooth.newToothCondition}</span>
        </div>
    ))}
    </>
  )},
  {key: "cast", header: 'Cast', render: (record) => (
    <>
       <div className="px-3 py-2 text-md font-semibold text-emerald-900 ">
           <span className="bg-green-500/50 p-1 rounded-xl">${record.totalCost}</span>
       </div>
    </>
  )},
];

const columnsToday: Column<AppointmentProps>[] = [
 { key: "patientCode", header: "ID", render: (app) => (
  <>
    {app.patientId.patientCode}
  </>
 )},
 { key: "name", header: "Patient", render: (app) => (
  <>
   <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
          {getInitials(app.patientId.name)}
      </div>
      <span>{app.patientId.name}</span>
   </div>
  </>
 )},
 { key: "gender", header: "Gender", render: (app) => (
  <>
    <span className={`text-gray-100 p-1 rounded-xl ${app.patientId.gender === "Male" ?
             "bg-blue-700/80" : "bg-pink-700/80"}`}>
       {app.patientId.gender}
    </span>
  </>
 )},
 { key: "planned", header: "Planned", render: (app) => (
  <>
   <span className="ml-4">{app.plannedProcedure}</span>
  </>
 )},
];

export function MedicalRecords() {
    const [page, setPage] = useState(1);
    const [isOpenTableToday, setIsOpenTableToday] = useState(false);
    const [searchHandler, setSearchHandler] = useState('');

    const {data, refetch, isFetching,isLoading, isError} = useGetMedicalRecordAPIQuery({page: page, search: searchHandler});
    const {data: dataToday, refetch: refetchAppointmentToday} = useGetAppointmentTodayAPIQuery();
    const [createMedicalRecords, {isLoading:isLoadingCreate}] = useCreateMedicalRecordMutation();
    
     const medicalRecords = data?.data || [];
     const appointmentsToday = dataToday?.data || [];
     const isLastPage = page * 20 >= medicalRecords.length;

      const [medicalRecord, setMedicalRecord] = useState<createMedicalRecord>({
        patientId: "",
        appointmentId: "",
        treatmentStatus: "",
        nextSessionTimeframe: '',
        notes: "",
      });
      const [teethTreated, setTeethTreated] = useState<teethTreated[]>([{
         toothNumber: 0,
         procedure: '',
         newToothCondition: '',
         cost: 0,
      }]);
      const [isModalOpen, setIsModalOpen] = useState(false);


    const handleNextPage = () => {
      if(isLastPage) {
        setPage(priv => priv + 1);
      };
    };
    const handleBackPage = () => {
      if(page > 1) {
        setPage(priv => priv - 1); 
      }
    };

    const handleDisplayTable = () => {
         setIsOpenTableToday((prev) => !prev);
    };

    // ================================= //

    const handleCloseModal = () => {
         setIsModalOpen(false);
        setMedicalRecord({
          patientId: "",
          appointmentId: "",
          treatmentStatus: "",
          nextSessionTimeframe: '',
          notes: "",
        });
      };
    
      const handleOpenModal = (app: AppointmentProps) => {
         setIsModalOpen(true);
         setMedicalRecord((prev) => ({
          ...prev,
          patientId: app.patientId._id, 
          appointmentId: app._id, 
         }))
        };
    
      const handleAddTooth = () => {
        setTeethTreated(prev => [
          ...prev,
          { toothNumber: 0, procedure: "", newToothCondition: "", cost: 0 }
        ]);
      };
    
      const handleToothFieldChange = (index: number, field: keyof teethTreated, value: string | number) => {
        setTeethTreated(prev => 
          prev.map((tooth, i) => 
            i === index ? { ...tooth, [field]: value } : tooth
          )
        );
      };
    
      const handleRemoveTooth = (index: number) => {
        setTeethTreated(prev => prev.filter((_, i) => i !== index));
      };
    
    
      const  handleCreateMedicalRecords = async () => {
    
        if(medicalRecord.treatmentStatus.trim() === "" || medicalRecord.nextSessionTimeframe.trim() === "")return toast.error(MESSAGES.ERROR_ENTER_INPUTS);
     
        const isValid = validateTeethTreated(teethTreated);
        if(isValid) return toast.error(isValid);
        const newMedicalRecord = {
          patientId: medicalRecord.patientId,
          appointmentId: medicalRecord.appointmentId,
          treatmentStatus: medicalRecord.treatmentStatus,
          nextSessionTimeframe: medicalRecord.nextSessionTimeframe,
          teethTreated: teethTreated,
          notes: medicalRecord.notes,
        };
        try {
              const respons = await createMedicalRecords(newMedicalRecord).unwrap();
              if(respons) {
                toast.success(MESSAGES.SUCCESS_CREATE_MEDICAL_RECORD);
                setIsModalOpen(false);
                setTeethTreated([]);
                setMedicalRecord({
                  patientId: "",
                  appointmentId: "",
                  treatmentStatus: "",
                  nextSessionTimeframe: '',
                  notes: "",
                });
                refetchAppointmentToday();
              }
        }catch(error) {
            return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
        }
      }

    // ================================= //


     
    return (
        <>
          <Modal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Register new medical records"
                text="Fill in the details to add a medical record to the directory."
                footer={
                    <div className="flex items-center justify-end space-x-4 ">
                        <button type="button" onClick={handleCloseModal}
                           className="text-md shadow-sm shadow-gray-600 text-gray-800  py-1.5 px-3 cursor-pointer hover:bg-gray-600 rounded-sm 
                          hover:text-white
                        ">
                            Cancel
                        </button>
                              <button disabled={isLoadingCreate} onClick={() => handleCreateMedicalRecords()}
                                      type="button" className={` ${isLoadingCreate  ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}
                                      text-sm text-white bg-gray-800 py-1.5 px-3  hover:bg-gray-600 rounded-sm`}>
                                      {isLoadingCreate ? 
                                      <span><FontAwesomeIcon icon={faSpinner} spin /> create...</span>
                                      :
                                          "Register Patient"
                                      }
                              </button>
                    </div>
                  }
                         >
                              <form className=" overflow-y-scroll h-150 px-1 ">
                                     <div className="mb-4 ">
                                         <label className="flex flex-col w-full" htmlFor="treatmentStatus">
                                            Treatment Status
                                              <select value={medicalRecord?.treatmentStatus} 
                                              onChange={(e) => setMedicalRecord({ ...medicalRecord,  
                                                treatmentStatus: e.target.value as "No-Action" | "In-Progress" | "Completed" })}
                                                className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full "
                                                 name="treatmentStatus" id="treatmentStatus">
                                                 <option value="">Treatment Status?</option>
                                                 <option value="No-Action">No-Action</option>
                                                 <option value="Completed">Completed</option>
                                                 <option value="In-Progress">In-Progress</option>
                                              </select>
                                         </label>
                                     </div>
                                     <div className="">
                                       {teethTreated.map((tooth, index) => (
                                            <div key={index} className=" grid grid-cols-2 gap-3 shadow-sm shadow-gray-950 my-2 p-3 rounded-md">
                                              <label htmlFor="toothNumber">
                                                 ToothNumber
                                                <input
                                                  name="toothNumber"
                                                  type="number"
                                                  placeholder="toothNumber"
                                                  value={tooth.toothNumber}
                                                  onChange={(e) => handleToothFieldChange(index, "toothNumber", Number(e.target.value))}
                                                  className="shadow-gray-800 shadow-sm rounded-sm p-1 w-full "
                                                />
                                              </label>
                                              <label htmlFor="procedure">
                                                Procedure
                                                <select
                                                  name="procedure"
                                                  value={tooth.procedure}
                                                  onChange={(e) => handleToothFieldChange(index, "procedure", e.target.value)}
                                                  className="shadow-gray-800 shadow-sm rounded-sm p-1 w-full "
                                                >
                                                  <option value="">Procedure</option>
                                                  <option value="Filling">Filling</option>
                                                  <option value="Extraction">Extraction</option>
                                                  <option value="Consultation">Consultation</option>
                                                  <option value="Cleaning">Cleaning</option>
                                                  <option value="Root-Canal-Session">Root-Canal-Session</option>
                                                </select>
                                              </label>
                                              <label htmlFor="newToothCondition">
                                                ToothCondition
                                                <select
                                                  name="newToothCondition"
                                                  value={tooth.newToothCondition}
                                                  onChange={(e) => handleToothFieldChange(index, "newToothCondition", e.target.value)}
                                                  className="shadow-gray-800 shadow-sm rounded-sm p-1 w-full "
                                                >
                                                  <option value="">ToothCondition?</option>
                                                  <option value="Healthy">Healthy</option>
                                                  <option value="Caries">Caries</option>
                                                  <option value="Filled">Filled</option>
                                                  <option value="Missing">Missing</option>
                                                  <option value="Crown">Crown</option>
                                                  <option value="Root-Canal">Root-Canal</option>
                                                </select>
                                              </label>
                                              <label htmlFor="Cost">
                                                Cost
                                                <input
                                                  name="Cost"
                                                  type="number"
                                                  placeholder="Cost"
                                                  value={tooth.cost}
                                                  onChange={(e) => handleToothFieldChange(index, "cost", Number(e.target.value))}
                                                  className="shadow-gray-800 shadow-sm rounded-sm p-1 w-full"
                                                />
                                              </label>
                                              {teethTreated.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveTooth(index)}
                                                 className="text-md py-1 px-2 rounded-sm bg-rose-800/70 text-white my-3 transition-all duration-100 
                                                hover:bg-rose-600 active:scale-90 cursor-pointer
                                                "
                                                >
                                                  Delete
                                                </button>
                                              )}
                                            </div>
                                          ))}
                                          <div className="flex items-center justify-end">
                                            <button type="button" onClick={handleAddTooth}
                                              className="text-md py-1 px-2 rounded-sm bg-blue-800/70 text-white my-3 transition-all duration-100 
                                               hover:bg-blue-600 active:scale-90 cursor-pointer
                                              "
                                             >Adding a tooth+
                                            </button>
                                          </div>
                                     </div>
                                     <div className="mb-4 f">
                                         <label className="flex flex-col w-full"
                                           htmlFor="SessionTimeframe">
                                             SessionTimeframe
                                                  <select value={medicalRecord?.nextSessionTimeframe} 
                                                     onChange={(e) => setMedicalRecord({ ...medicalRecord, nextSessionTimeframe: e.target.value as
                                                      'ASAP' | 'Within-1-Week' | 'Within-2-Weeks' | 'Within-1-Month' | 'Not-Required' 
                                                      })}
                                                     name="SessionTimeframe" id="SessionTimeframe" className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full ">
                                                      <option  value="">SessionTimeframe?</option>
                                                      <option value="ASAP">ASAP</option>
                                                      <option value="Within-1-Week">Within-1-Week</option>
                                                      <option value="Within-2-Weeks">Within-2-Weeks</option>
                                                      <option value="Within-1-Month">Within-1-Month</option>
                                                      <option value="Not-Required">Not-Required</option>
                                                  </select>
                                          </label>
                                     </div>
                                          <div className="mb-4 flex items-center space-x-2">
                                            <label className="flex flex-col w-full" htmlFor="otherNotes">
                                                Notes
                                                  <input value={medicalRecord?.notes} 
                                                  onChange={(e) => setMedicalRecord({ ...medicalRecord, notes: e.target.value })}
                                                    className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                                  type="text" id="otherNotes" placeholder="other notes" required/>
                                              </label>
                                          </div>
                              </form>
          </Modal>

              
           <div className="min-h-full  py-8 px-10 mt-11 animate-[fadeInUp_0.4s_ease-out_forwards]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-800/20 text-blue-700 p-2 rounded-md">
                      <FontAwesomeIcon className="text-2xl" icon={faStethoscope} />
                    </div>
                   <div >
                       <h1 className="text-2xl font-semibold">
                        Medical Record
                       </h1>
                      <p className="text-gray-700 text-md">Welcome to your medical records.</p>
                   </div>
                </div>
            </div>

              <div className="grid grid-cols-1 gap-4 my-10">
                  <Crads 
                    title="Medical Records"
                    icon={faStethoscope}
                    count={medicalRecords.length || 0}
                    lable="View and manage your medical records securely."
                    color={COLORS.DARK}
                  />
              </div>

              <div className=" flex items-center justify-between px-10 my-2">
                <div className="flex items-center space-x-6">
                  <div className=" flex items-center space-x-10 ">
                      <button onClick={() => handleBackPage()}
                        title="back" 
                          className={` text-3xl  hover:text-gray-600 active:scale-90 transition-all
                          duration-100 ${page > 1 ? " opacity-100 cursor-pointer text-gray-800" : " text-gray-800/40 cursor-not-allowed"}`}>
                        <FontAwesomeIcon icon={faCircleChevronLeft} />
                      </button>
                      <button disabled={isLastPage} onClick={() => handleNextPage()}
                        title="next" className={`text-3xl hover:text-gray-600 active:scale-90 transition-all
                          duration-100 ${!isLastPage ? "opacity-100 cursor-pointer text-gray-800" : " cursor-not-allowed text-gray-800/40 "}`}>
                        <FontAwesomeIcon icon={faCircleChevronRight} />
                      </button>
                  </div>
                  <div className="">
                      <button title="get today's appointments" onClick={() => handleDisplayTable()}
                        className="bg-blue-700/70 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-800/50 transition duration-300 cursor-pointer
                        active:scale-90 font-semibold
                        ">
                          Today
                      </button>
                  </div>
                </div>

                 <div className="w-[30%]">
                  <SearchInput onChange={setSearchHandler} />
                 </div>
              </div>

              {isError ? 
                      <div>
                        <div  className="px-4 py-10 text-center text-gray-700">
                           <h1 className="text-2xl">Network Error</h1>
                         <p className="text-lg">Make sure you are connected for the network.</p>
                             <button onClick={() => refetch()}
                              className="text-xl rounded-md cursor-pointer bg-blue-600 text-white hover:bg-blue-500
                               transition-all duration-300 active:scale-90 mt-5 w-25 py-1
                                 "
                                   >
                                     Reload
                               </button>
                          </div>
                       </div>
                                   :
                                    <>
                          { isLoading || isFetching  ?
                                  <div >
                                      <PageSkeletonLoader />
                                  </div>
                                             :
                                    <div className="flex items-center justify-center">
                                        <div className="w-[95%] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm 
                                          max-h-150 overflow-y-scroll">
                                          {isOpenTableToday ?

                                           <DataTable<AppointmentProps>
                                            emptyMessage="there are no appointments to display."
                                            data={appointmentsToday}
                                            columns={columnsToday}
                                            keyExtractor={(app) => app._id}
                                            renderActions={(app) => (
                                              <button onClick={() => handleOpenModal(app)}
                                              className="rounded-sm bg-blue-500/20 cursor-pointer hover:bg-blue-500/40 text-blue-600 text-lg p-1
                                               hover:scale-95 transition-all duration-150 active:scale-95
                                              ">
                                                <FontAwesomeIcon icon={faNotesMedical} />
                                              </button>
                                            )}
                                          />
                                          :
                                          <DataTable<MedicalRecord>
                                            emptyMessage="there are no medical records to display."
                                            data={medicalRecords}
                                            columns={columns}
                                            keyExtractor={(record) => record._id}
                                            />
                                          }
                                        </div>
                                    </div>
                                    }
                                </>
                              }
           </div>
        </>
    )
}