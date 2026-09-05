import { useState } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Crads from "../components/Crads";
import { faCircle, faCircleChevronLeft, faCircleChevronRight, faLock, faLockOpen, faPen, faSpinner, faUserDoctor, faUserGroup, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useCreatePatientAPIMutation, useGetPatientsAPIQuery, useToggleStatusAPIMutation, useUpdatePatientAPIMutation } from "../store/PatientSrore";
import { PageSkeletonLoader } from "../components/Loading";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { errorCatch } from "../utils/errorHelpers";
import { COLORS, MESSAGES, ROLES } from "../utils/constants";
import type { createPatientProps, DataPatient } from "../types/Types";
import SearchInput from "../components/Search";
import { useGetCurrentUserQuery, useGetEmployeeAPIQuery } from "../store/authStore";
import { getConditionTags, getInitials } from "../utils/generators";
import { format } from "date-fns";
import { DataTable, type Column } from "../components/Table";


  const columns: Column<DataPatient>[] = [
    { key: "patientCode", header: "ID" },
    { key: "name", header: "Name", render: (patient) => (
      <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
           {getInitials(patient.name)}
          </div>
           <p className="text-sm font-medium text-gray-800">{patient.name}</p>
      </div>
    )},
    { key: "phone", header: "Phone", render: (patient) => (
      <>
        <p className='bg-blue-400 rounded-2xl text-center text-white'>
          +{patient.phone}
        </p>
      </>
    ) },
    { key: "gender", header: "Gender", render: (patient) => (
      <>
        <p className={`text-white rounded-2xl text-center ${patient.gender === "Male" ? "bg-blue-600/70" : "bg-pink-600/70"}`}>
           {patient.gender}
        </p>
      </>
    ) },
    { key: "condition", header: "Gender", render: (patient) =>{
          const conditionTags = getConditionTags(patient.medicalHistory);
          return (
            <>
               {conditionTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {conditionTags.map((tag) => (
                      <span key={tag} className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600 ring-1 ring-rose-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Nothing</span>
                )}
            </>
          )
    }},
    { key: "status", header: "Status", render: (patient) => (
      <>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
          patient.isActive ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
          'bg-gray-500 text-gray-50 ring-1 ring-gray-200'
        }`}>
          {patient.isActive ? 'Active' : 'Inactive'}
        </span>
      </>
    )},
    { key: "createdAt", header: "List Visit", render: (patient) => (
         <>
           {format(patient.updatedAt, "MMM-yyyy-MM")}
         </>
    )},
  ];


export default function Patients() {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const { data, refetch, isError, isFetching, isLoading} = useGetPatientsAPIQuery({search: searchTerm, page: page});

    const [createPatientAPI, {isLoading: isLoadingCreate, isError: isErrorCreate}] = useCreatePatientAPIMutation();
    const [updatePatientAPI, {isLoading: isLoadingUpdate, isError: isErrorUpdate}] = useUpdatePatientAPIMutation();
    const [toggleStatusAPI, {isLoading: toggleIsLoading}] = useToggleStatusAPIMutation();
    const {data: user} = useGetCurrentUserQuery();
    const {data: employeesData} = useGetEmployeeAPIQuery();

    const patients = data?.data.patients || [];
    const isLastPage = page * 20 >= patients.length;


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


    const [toggleButton, setToggleButton] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [createPatient, setCreatePatient] = useState<createPatientProps>({
      name: "" ,
      doctor: "", 
      phone: "", 
      gender: "", 
      patientCode: "",
      hasDiabetes: false,
      hasBloodPressure: false,
      hasSensitive: false,
      otherNotes: ""
    });

    const handleOpenModal = () => {
      setIsModalOpen(true);
      setToggleButton(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setCreatePatient({
              name: "" ,
              doctor: "", 
              phone: "", 
              gender: "", 
              patientCode: "",
              otherNotes: "",
              hasDiabetes: false,
              hasBloodPressure: false,
              hasSensitive: false,
      });
    };

  const handleCreatePatient = async () => {

         if(createPatient.name === "" || createPatient.patientCode === "" || createPatient.phone === "" || createPatient.doctor === ""
            || createPatient.gender === ""
         ) {
           return toast.error(MESSAGES.ERROR_ENTER_INPUTS);
         };
           
        try {
          const response = await createPatientAPI(createPatient).unwrap();
          if(response.status) {
            toast.success(MESSAGES.SUCCESS_CREATE_PATIENT);
            setIsModalOpen(false);
          }
           
        }catch(error) {
          return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
        }finally{
          setIsModalOpen(false);
          setCreatePatient({
              name: "" ,
              doctor: "", 
              phone: "", 
              gender: "", 
              patientCode: "",
              otherNotes: "",
              hasDiabetes: false,
              hasBloodPressure: false,
              hasSensitive: false,
            });
        }
  };
 //  ========================================================= //
 const handleOpenModalUpdatePatient = (patient: string) => {
         const updated = patients.find((p) => String(p._id) === String(patient));
         if(!updated)return
         setToggleButton(false);
       setCreatePatient({
         _id: updated._id,
         name: updated?.name,
         doctor: updated?.doctor, 
         phone: updated?.phone, 
         gender: updated?.gender, 
         otherNotes: updated.medicalHistory.otherNotes, 
         hasDiabetes: updated.medicalHistory.hasDiabetes,
         hasBloodPressure: updated.medicalHistory.hasBloodPressure,
         hasSensitive: updated.medicalHistory.hasSensitive,
       });
         setIsModalOpen(true);
  };

 const handleUpdatedPatient = async () => {
    if(createPatient.name === "" || createPatient.patientCode === "" || createPatient.phone === "" || createPatient.doctor === ""
       || createPatient.gender === "") {
          return toast.error(MESSAGES.ERROR_ENTER_INPUTS);
    };
     try {
           const response = await updatePatientAPI({patientId: createPatient._id,createPatient}).unwrap();
           if(response.status) {
             toast.success(MESSAGES.SUCCESS_CREATE_PATIENT);
             setIsModalOpen(false);
           }
       }catch(error) {
            return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
        }finally {
          setCreatePatient({
               name: "",
               doctor: "", 
               phone: "", 
               gender: "", 
               otherNotes: "", 
               hasDiabetes: false,
               hasBloodPressure: false,
               hasSensitive: false,
            });
         }
   };
 
   const handleToggleStatus = async (patient: string) => {
      try {
           const response = await toggleStatusAPI(patient).unwrap();
           if(response.status) {
             toast.success(MESSAGES.SUCCESS_UPDATE_PATIENT);
           }
       }catch(error) {
          return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
         }
   };
 //  ========================================================= //

  if(!user)return;
  const employees = employeesData?.data || [];

    return (
      <>
         
         <div className=" fixed top-30 right-10 z-40">
            <Button 
              text="Add Patient"
              onClick={handleOpenModal}
            />
          </div>
              <Modal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Register new patient"
            text="Fill in the details to add a patient to the directory."
            footer={
                <div className="flex items-center justify-end space-x-4 ">
                    <button type="button" onClick={handleCloseModal}
                       className="text-md shadow-sm shadow-gray-600 text-gray-800  py-1.5 px-3 cursor-pointer hover:bg-gray-600 rounded-sm 
                      hover:text-white
                    ">
                        Cancel
                    </button>
                    {toggleButton ?
                          <button disabled={isLoadingCreate || isErrorCreate} onClick={() => handleCreatePatient()}
                                  type="button" className={` ${isLoadingCreate  || isErrorCreate ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}
                                  text-sm text-white bg-gray-800 py-1.5 px-3  hover:bg-gray-600 rounded-sm`}>
                                  {isLoadingCreate ? 
                                  <span><FontAwesomeIcon icon={faSpinner} spin /> create...</span>
                                  :
                                      "Register Patient"
                                  }
                          </button>
                                  :
                          <button disabled={isLoadingUpdate || isErrorUpdate} onClick={() => handleUpdatedPatient()}
                                  type="button" className={` ${isErrorUpdate ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}
                                  text-sm text-white bg-gray-800 py-1.5 px-3  hover:bg-gray-600 rounded-sm`}>
                                  {isLoadingUpdate ? 
                                  <span><FontAwesomeIcon icon={faSpinner} spin /> updated...</span>
                                  :
                                      "Update Patient"
                                  }
                        </button>
                    }
                </div>
            }
           >
                <form>
                       <div className="mb-4 flex items-center justifu-center">
                           <label className="w-full" htmlFor="name">
                                 Name
                               <input value={createPatient?.name} 
                                onChange={(e) => setCreatePatient({ ...createPatient, name: e.target.value })}

                                  className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                 type="text" id="name" placeholder="Name" required/>
                           </label>
                       </div>
                       <div className="mb-4 flex items-center justifu-center space-x-4">
                           <label className="flex flex-col w-full" htmlFor="name">
                              Gender
                                <select value={createPatient?.gender} 
                                onChange={(e) => setCreatePatient({ ...createPatient, gender: e.target.value })}
                                  className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full "
                                   name="doctor" id="doctor">
                                   <option value="">gender?</option>
                                   <option value="Male">Male</option>
                                   <option value="Female">Female</option>
                                </select>
                           </label>
                            {!toggleButton ? "" :
                              <label className="flex flex-col w-full" htmlFor="Code">
                                 Code
                               <input  value={createPatient?.patientCode} 
                                 onChange={(e) => setCreatePatient({ ...createPatient, patientCode: e.target.value })}
                                className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                               type="text" id="Code" placeholder="Code" required/>
                           </label>}
                       </div>
                       <div className="mb-4 ">
                           <label className="flex flex-col w-full" htmlFor="phoneNumber">
                             Phone Number
                                <input value={createPatient?.phone} 
                                 onChange={(e) => setCreatePatient({ ...createPatient, phone: e.target.value })}
                                  className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                type="text" id="phoneNumber" placeholder="Phone Number" required/>
                            </label>
                       </div>
                       <div className="mb-4 flex items-center space-x-4">
                           <label className="flex flex-col w-[40%]"
                             htmlFor="doctor">
                               Doctors
                                    <select value={createPatient?.doctor} 
                                       onChange={(e) => setCreatePatient({ ...createPatient, doctor: e.target.value })}
                                       name="doctor" id="doctor" className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full ">
                                        <option  value="">doctor?</option>
                                        {employees.filter((em) => em.role === ROLES.DOCTOR).map((e) => (
                                          <option key={e._id} value={e.name}>Dr. {e.name}</option>
                                        ))}
                                    </select>
                             </label>
                            <div className=" w-[60%] grid grid-cols-2 ">
                                <label className="flex items-center justify-center " htmlFor="Diabetes">
                                    Diabetes
                                    <input checked={createPatient?.hasDiabetes} 
                                       onChange={(e) => setCreatePatient({ ...createPatient, hasDiabetes: e.target.checked })}
                                      className="mx-2 scale-120 cursor-pointer"
                                    type="checkbox" id="Diabetes" required/>
                                </label>
                                <label className="flex items-center justify-center " htmlFor="BloodPressure">
                                    Blood Pressure
                                    <input checked={createPatient?.hasBloodPressure}
                                       onChange={(e) => setCreatePatient({ ...createPatient, hasBloodPressure: e.target.checked })}
                                       className="mx-2 scale-120 cursor-pointer"
                                    type="checkbox" id="BloodPressure" required/>
                                </label>
                                <label className="flex items-center justify-center " htmlFor="Sensitive">
                                    Sensitive
                                    <input checked={createPatient?.hasSensitive}
                                       onChange={(e) => setCreatePatient({ ...createPatient, hasSensitive: e.target.checked })}
                                       className="mx-2 scale-120 cursor-pointer"
                                    type="checkbox" id="Sensitive" required/>
                                </label>
                            </div>
                       </div>
                            <div className="mb-4 ">
                              <label className="flex flex-col w-full" htmlFor="otherNotes">
                                  otherNotes
                                    <input value={createPatient?.otherNotes} 
                                    onChange={(e) => setCreatePatient({ ...createPatient, otherNotes: e.target.value })}
                                      className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                    type="text" id="otherNotes" placeholder="other notes" required/>
                                </label>
                            </div>
                </form>
              </Modal>
             
        
          <div className=" min-h-full px-6 py-8  mt-11 animate-[fadeInUp_0.35s_ease-out_forwards]">
                <div
                    className="flex flex-col gap-1 opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]"
                          style={{ animationDelay: "0ms" }}
                        >
                          <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800/30 text-blue-700 shadow-sm">
                                <FontAwesomeIcon className="text-xl" icon={faUserDoctor} />
                              </div>
                              <div>
                                <h1 className="text-xl font-semibold text-slate-900">Patients</h1>
                                <p className="text-md text-slate-500">Adding, reviewing, and managing clinic patient data.</p>
                              </div>
                          </div>
                </div>
                <div className=" w-full  flex  py-5 ">
                   <Crads 
                     title="Total Patients"
                     icon={faUsers}
                     count={data?.data.count || 0}
                     lable="in diractory" 
                     color={COLORS.DARK}
                  />
                </div>
                   <div className="flex items-center justify-center">
                      <div className="flex items-center justify-between w-[95%] mb-4 ">
                          <div className=" flex items-center justify-between space-x-4 w-[30%]">
                                  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                              <FontAwesomeIcon className="text-lg " icon={faUserGroup} />
                                            </div>
                                            <div>
                                              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">All Patients</p>
                                              <p className="text-2xl font-semibold text-slate-900">
                                                {data?.data.patients.length}
                                                <span className="ml-2 align-middle text-xs font-normal text-emerald-600">
                                                  <FontAwesomeIcon className="text-[6px] align-middle mr-1" icon={faCircle} />
                                                  {data?.data.patients.length} active
                                                </span>
                                              </p>
                                            </div>
                                  </div>
                                  <div className=" flex items-center space-x-10">
                                      <button disabled={page === 1} onClick={() => handleBackPage()}
                                        title="back" 
                                         className={`text-gray-800 text-3xl  hover:text-gray-600 active:scale-90 transition-all
                                          duration-100 ${page > 1 ? " opacity-100 cursor-pointer" : " opacity-50 cursor-not-allowed"}`}>
                                        <FontAwesomeIcon icon={faCircleChevronLeft} />
                                      </button>
                                      <button disabled={isLastPage} onClick={() => handleNextPage()}
                                        title="next" className={`text-gray-800 text-3xl hover:text-gray-600 active:scale-90 transition-all
                                         duration-100 ${!isLastPage ?
                                           "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
                                        <FontAwesomeIcon icon={faCircleChevronRight} />
                                      </button>
                                  </div>
                            </div>
                            <div className="w-[30%]">
                              <SearchInput onChange={setSearchTerm}/>
                            </div>
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
                                        <div>
                                          <div >
                                              <PageSkeletonLoader />
                                          </div>
                                        </div>
                                      :
                         <div className="flex items-center justify-center">
                              <div className="w-[95%] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm max-h-150 overflow-y-scroll">
                                      <DataTable<DataPatient> 
                                       emptyMessage="There are no patients to display."
                                        data={patients}
                                        columns={columns} 
                                        keyExtractor={(patient) => patient._id}
                                        renderActions={(patient) => (
                                          <div className="flex items-center justify-end gap-2">
                                             <button onClick={() => handleOpenModalUpdatePatient(patient._id)}
                                               className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors
                                                hover:bg-blue-700/50 text-blue-600 cursor-pointer bg-blue-700/20" title="edit">
                                               <FontAwesomeIcon icon={faPen} className="text-sm" />
                                            </button>
                                             <button disabled={toggleIsLoading} onClick={() => handleToggleStatus(patient._id)}
                                                type="button"
                                                title="Reset password"
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-50 transition-all duration-100
                                                  cursor-pointer active:scale-90 ${patient.isActive ? "hover:bg-emerald-600 bg-emerald-700 " : 
                                                    "hover:bg-red-500 bg-red-700 "}`} 
                                              >
                                                  <FontAwesomeIcon className="text-sm" icon={patient.isActive ? faLockOpen : faLock} />
                                            </button>
                                         </div>
                                        )}
                                      />
                                
                            </div>
                        </div>
                                  }
                                </>
              }
        </div>
      </> 
    )
};