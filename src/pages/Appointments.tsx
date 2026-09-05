import {  faBookMedical, faCalendar, faSpinner } from "@fortawesome/free-solid-svg-icons"
import Button from "../components/Button"
import Crads from "../components/Crads"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "../components/Modal"
import { useState } from "react"
import { useCreateAppoinmentAPIMutation, useGetAppointmentAPIQuery, useGetAppointmentTodayAPIQuery } from "../store/Appointment.Store"


import {format} from "date-fns"
import type { AppointmentForm, AppointmentProps } from "../types/Types"
import { PageSkeletonLoader } from "../components/Loading"
import { COLORS, MESSAGES, ROLES } from "../utils/constants"
import toast from "react-hot-toast"
import { useGetEmployeeAPIQuery } from "../store/authStore"
import { errorCatch } from "../utils/errorHelpers"
import { AppointmentStatusDropdown } from "../components/StatusDropdown"
import { getInitials } from "../utils/generators"
import { DataTable, type Column } from "../components/Table"



const columns: Column<AppointmentProps>[] = [
  {key: "patientCode", header: "ID", render: (apt) => (
    <>
       {apt.patientId.patientCode}
    </>
  )},
  {key: "appointmentDate", header: "Date", render: (apt) => (
    <>
      {format(apt.appointmentDate, "yyyy-MMM-dd")}
    </>
  )},
  {key: "appointmentTime", header: "Time", render: (apt) => (
    <>
      {format(apt.appointmentDate, "hh:mm a")}
    </>
  )},
  {key: "patient", header: "patient", render: (apt) => (
    <div className="py-1.5 pl-2 text-gray-700 font-semibold text-md flex items-center space-x-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
            {getInitials(apt.patientId.name)}
        </div>
        <span>{apt.patientId.name}</span>
    </div>
  )},
  {key: "doctor", header: "doctor", render: (apt) => (
    <>
        Dr. {apt.patientId.doctor}
    </>
  )},
  {key: "plannedProcedure", header: "Type"},
  {key: "durationMinutes", header: "Duration", render: (apt) => (
    <>
    {apt.durationMinutes} min
    </>
  )},
];


export default function Appointments() {
    const [appointment, setAppointment] = useState<AppointmentForm>({
      doctorId: "",
      patientCode: "",
      durationMinutes: "",
      appointmentDate: "",
      plannedProcedure: "",
      notes: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toggleButtonColor, setToggleButtonColor] = useState("");
    const [isAppointmentToday, setIsAppointmentToday] = useState(false);



    const {data, isLoading, isError, refetch, isFetching} = useGetAppointmentAPIQuery({status: toggleButtonColor});
    const [createAppointment, {isLoading: createIsLoading, isError: createIsError}] = useCreateAppoinmentAPIMutation();
    const {data: dataEmployee} = useGetEmployeeAPIQuery();
    const {data: dataAppointmentToday} = useGetAppointmentTodayAPIQuery();

    const handleOpenModal = () => {
       setIsModalOpen(true);
    };

    const handleCloseModal = () => {
       setIsModalOpen(false);
       setAppointment({
        doctorId: "",
        patientCode: "",
        durationMinutes: "",
        appointmentDate: "",
        plannedProcedure: "",
        notes: ""
    });
    };


    const handleCreateAppointment = async () => {
         if(appointment.patientCode === "" || appointment.doctorId === "" || appointment.durationMinutes === "" || 
          appointment.plannedProcedure === "" || appointment.appointmentDate === ""
         )return toast.error(MESSAGES.ERROR_ENTER_INPUTS);
       
         try {
              const response = await createAppointment(appointment).unwrap();
              if(response.status){
                toast.success(MESSAGES.SUCCESS_CREATE_APPOINTMENT);
                setIsModalOpen(false);
                 setAppointment({
                    doctorId: "",
                    patientCode: "",
                    durationMinutes: "",
                    appointmentDate: "",
                    plannedProcedure: "",
                    notes: ""
               })
              }
         }catch(error) {
          return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
         }
    };



  const displayAppointment = isAppointmentToday ? dataAppointmentToday?.data : data?.data || [];
  const filteredAppointment  = displayAppointment ?  displayAppointment : [];

    return (
        <>
           <div className=" fixed top-30 right-10 z-50">
               <Button
                 text="Create Appointments"
                 onClick={() => handleOpenModal()}
           
                />
           </div>


            <Modal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Register new employees"
                text="Fill in the details to add a employees to the directory."
                footer={
                         <div className="flex items-center justify-end space-x-4 ">
                                      <button type="button" onClick={handleCloseModal}
                                        className="text-md shadow-sm shadow-gray-600 text-gray-800  py-1.5 px-3 cursor-pointer hover:bg-gray-600 rounded-sm 
                                        hover:text-white
                                      ">
                                          Cancel
                                      </button>
                                          <button disabled={createIsLoading || createIsError} onClick={() => handleCreateAppointment()}
                                            type="button" className={` ${createIsLoading  || createIsError ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}
                                            text-sm text-white bg-gray-800 py-1.5 px-3  hover:bg-gray-600 rounded-sm`}>
                                            {createIsLoading ? 
                                            <span><FontAwesomeIcon icon={faSpinner} spin /> create...</span>
                                            :
                                                "Register Appointment"
                                            }
                                          </button>                       
                         </div>
                        }
                            >
                        <form>
                              <div className="mb-4 flex items-center justifu-center">
                                            <label className="w-full" htmlFor="patientCode">
                                                  Patient Code
                                                <input value={appointment?.patientCode} 
                                                  onChange={(e) => setAppointment({ ...appointment, patientCode: e.target.value })}
                  
                                                    className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                                  type="text" id="patientCode" placeholder="Patient Code" required/>
                                            </label>
                              </div>
                              <div className="mb-3 flex items-center space-x-4">
                                           <label className="flex flex-col w-full" htmlFor="doctor">
                                              doctor
                                                  <select value={appointment?.doctorId} 
                                                  onChange={(e) => setAppointment({ ...appointment, doctorId: e.target.value })}
                                                    className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full "
                                                        name="doctor" id="doctor">
                                                        <option value="">doctor?</option>
                                                        {dataEmployee?.data.filter((e) => e.role === ROLES.DOCTOR).map((e) => (
                                                          <option key={e._id} value={e._id}>Dr. {e.name}</option>
                                                        ))}
                                                  </select>
                                            </label>
                                            <label className="flex flex-col w-full" htmlFor="Date">
                                              Date
                                                  <input value={appointment?.appointmentDate} 
                                                  onChange={(e) => setAppointment({ ...appointment, appointmentDate: e.target.value })}
                                                    className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                                  type="datetime-local" id="Date" placeholder="Date" required/>
                                              </label>
                              </div>
                              <div className="mb-4 flex items-center justifu-center space-x-4">
                                            <label className="flex flex-col w-full" htmlFor="Type">
                                                Type
                                                  <select value={appointment?.plannedProcedure} 
                                                  onChange={(e) => setAppointment({ ...appointment, plannedProcedure: e.target.value })}
                                                    className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full "
                                                    name="Type" id="Type">
                                                    <option value="">Type?</option>
                                                    <option value="Consultation">Consultation</option>
                                                    <option value="Cleaning">Cleaning</option>
                                                    <option value="Filling">Filling</option>
                                                    <option value="Root-Canal-Session">Root-Canal-Session</option>
                                                    <option value="Extraction">Extraction</option>
                                                  </select>
                                            </label>
                                              <label className="flex flex-col w-full" htmlFor="Time">
                                                  Time
                                                  <div className="flex items-center rounded-sm shadow-sm shadow-gray-600 
                                                      
                                                  ">
                                                    <select value={appointment?.durationMinutes} 
                                                       onChange={(e) => setAppointment({ ...appointment, durationMinutes: e.target.value })}
                                                        className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full "
                                                        name="Time" id="Time">
                                                        <option value="">Time?</option>
                                                        <option value="30">30</option>
                                                        <option value="20">20</option>
                                                        <option value="15">15</option>
                                                  </select>
                                                  </div>
                                            </label>
                              </div>
                              <div className="mb-4">
                                            <label className="flex flex-col w-full" htmlFor="notes">
                                              Notes
                                                  <input value={appointment?.notes} 
                                                  onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })}
                                                    className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                                  type="text" id="notes" placeholder="notes" required/>
                                              </label>
                              </div>
                        </form>
           </Modal>

      <div className="min-h-full py-8 px-10 mt-11 animate-[fadeInUp_0.4s_ease-out_forwards]">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800/20 text-blue-700 shadow-sm">
                  <FontAwesomeIcon className="text-xl" icon={faCalendar} />
              </div>
              <div>
                 <h1 className="text-3xl text-gray-900">Appointments</h1>
                  <p className="text-md text-gray-800 mt-3">Manage upcoming and past visits across your clinic.</p>
              </div>
          </div>

          <div className="my-8 flex items-center">
              <Crads 
                title="Total"
                icon={faBookMedical}
                count={filteredAppointment.length || 0}
                lable="Total Appointments"
                color={COLORS.DARK}
              />
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
                          <div className="w-[95%] overflow-hidden rounded-xl border border-gray-200 bg-white shadow shadow-gray-700
                             max-h-150  overflow-y-scroll">
                             <div className="py-3 flex items-center justify-between px-5">
                            <div>
                                <button title="Appointments for today" onClick={() => {setIsAppointmentToday((prev) => !prev)}}
                                  className="text-md text-blue-700 bg-blue-800/20 py-1 px-4 rounded-md cursor-pointer hover:bg-blue-700/50
                                  transition-all duration-100 active:scale-90 font-semibold
                                ">
                                  Today
                                </button>
                            </div>
                            <div className=" flex items-center justify-around rounded-md shadow-sm shadow-gray-500 py-.5 px-2 w-[50%]">
                                 <button onClick={() => setToggleButtonColor("")}
                                  className={`text-md text-blue-700 ${toggleButtonColor === "" ? "bg-blue-800/30" : ""} rounded-md
                                   py-1 px-5 my-1 cursor-pointer font-semibold hover:bg-blue-800/30`}>
                                    All
                                 </button>
                                 <button onClick={() => setToggleButtonColor("Pending")}
                                  className={`text-md text-blue-700 ${toggleButtonColor === "Pending" ? "bg-blue-800/30" : ""} rounded-md
                                   py-1 px-5 my-1 cursor-pointer font-semibold hover:bg-blue-800/30`}>
                                    Pending
                                 </button>
                                 <button onClick={() => setToggleButtonColor("Completed")}
                                  className={`text-md text-blue-700 ${toggleButtonColor === "Completed" ? "bg-blue-800/30" : ""} rounded-md
                                   py-1 px-5 my-1 cursor-pointer font-semibold hover:bg-blue-800/30`}>
                                    Completed
                                </button>
                                 <button onClick={() => setToggleButtonColor("Cancelled")}
                                  className={`text-md text-blue-700 ${toggleButtonColor === "Cancelled" ? "bg-blue-800/30" : ""}
                                   rounded-md py-1 px-5 my-1 cursor-pointer font-semibold hover:bg-blue-800/30`}>
                                    Cancelled
                                 </button>
                                 <button onClick={() => setToggleButtonColor("no-show")}
                                  className={`text-md text-blue-700 ${toggleButtonColor === "no-show" ? "bg-blue-800/30" : ""}
                                   rounded-md py-1 px-5 my-1 cursor-pointer font-semibold min-w-30 hover:bg-blue-800/30`}>
                                    No Show
                                 </button>
                            </div>
                             </div>
                            <DataTable<AppointmentProps>
                              emptyMessage="there are no appointments to display."
                              data={filteredAppointment}
                              columns={columns}
                              keyExtractor={(apt) => apt._id}
                              renderActions={(apt) => (
                                <AppointmentStatusDropdown appointmentId={apt._id} currentStatus={apt.status} />
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
}