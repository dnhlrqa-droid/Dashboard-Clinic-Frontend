
import { faCircle, faCircleCheck, faCircleXmark, faEye, faEyeSlash, faLock, faLockOpen, faPen, faSpinner, faUserDoctor, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchInput from "../components/Search";
import { useGetEmployeeAPIQuery, useRegisterEmployeeAPIMutation, useToggleStatusEmployeeAPIMutation, useUpdateEmployeeAPIMutation } from "../store/authStore";
import { COLORS, MESSAGES, ROLE_LABEL, ROLE_STYLES, type Role } from "../utils/constants";
import Crads from "../components/Crads";
import Button from "../components/Button";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { errorCatch } from "../utils/errorHelpers";
import { useState } from "react";
import { getInitials } from "../utils/generators";
import type { employee, EmployeeData } from "../types/Types";
import { DataTable, type Column } from "../components/Table";
import { PageSkeletonLoader } from "../components/Loading";




export function PasswordCell({ password }: { password: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex items-center gap-2 font-mono text-md text-slate-600">
      <span className="min-w-[9ch] tracking-wide">
        {revealed ? password : "•".repeat(Math.min(password.length, 10))}
      </span>
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className="text-slate-400 hover:text-slate-700 transition-colors duration-150 cursor-pointer"
        aria-label={revealed ? "Hide password" : "Show password"}
      >
        <FontAwesomeIcon className="text-xs" icon={revealed ? faEyeSlash : faEye} />
      </button>
    </div>
  );
};

const columns: Column<employee>[] = [
  {key: "name", header: "Name", render: (emp) => (
     <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-blue-500">
           {getInitials(emp.name)}
        </div>
      <span className="font-medium text-slate-800">{emp.name}</span>
    </div>
  )},
  {key: "email", header: "Email", render: (emp) => (
    <>
      <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${ROLE_STYLES[emp.role as Role]}`}
        >
          {emp.email}
      </span>
    </>
  )},
  {key: "phone", header: "Phone", render: (emp) => (
    <>
    <span
       className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${ROLE_STYLES[emp.role as Role]}`}
         >
       +{emp.phone}
      </span>
    </>
  )},
  {key: "role", header: "Role", render: (emp) => (
    <>
    <span
         className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${ROLE_STYLES[emp.role as Role]}`}
        >
      {ROLE_LABEL[emp.role as Role]}
     </span>
    </>
  )},
  {key: "password", header: "Password", render: (emp) => (
    <>
       <PasswordCell password={emp.password } />
    </>
  )},
  {key: "status", header: "Status", render: (emp) => (
    <>
    <span
         className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${
              !emp.isActive
                 ? "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200"
                : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
         }`}
         >
           <FontAwesomeIcon className="text-[11px]" icon={!emp.isActive ? faCircleXmark : faCircleCheck} />
       {!emp.isActive ? "Disabled" : "Active"}
   </span>
    </>
  )},
];

export default function Doctors() {
  const [toggleButton, setToggleButton] = useState(true);
  const [revealedSearch, setRevealedSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [createEmployee, setCreateEmployee] = useState<EmployeeData>({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  });


  const {data: user, isFetching, isLoading, isError, refetch} = useGetEmployeeAPIQuery({search: searchValue});
  const [registerEmployeeAPI, { isLoading: registerIsLoading}] = useRegisterEmployeeAPIMutation();
  const [updateEmployeeAPI] = useUpdateEmployeeAPIMutation();
  const [toggleStatusEmployeeAPI, {isLoading: toggleIsLoading }] = useToggleStatusEmployeeAPIMutation();

  const employees =  user?.data || [];
  const employeesIsActive = employees.filter((e) => e.isActive === true);


  const handleOpenModal = () => {
     setIsModalOpen(true);
     setToggleButton(true);
  };

  const handleCloseModal = () => {
     setIsModalOpen(false);
     setToggleButton(true);
     setCreateEmployee({
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
    });
  };

  const handleCreateEmployee = async () => {
     if(createEmployee.name === "" || createEmployee.email === "" || createEmployee.password === "" || createEmployee.role === "" || 
      createEmployee.phone === ""
     ) return toast.error(MESSAGES.ERROR_ENTER_INPUTS);
     try {
         const response = await registerEmployeeAPI(createEmployee).unwrap();
         if(response.status) {
            toast.success(MESSAGES.SUCCESS_CREATE_EMPLOYEE);
            setIsModalOpen(false);
          setCreateEmployee({
              name: "",
              email: "",
              password: "",
              role: "",
              phone: "",
          });
         }
 
     }catch(error) {
        return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
     }finally{
      setIsModalOpen(false);
      setCreateEmployee({
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
      });
     }
  };


  const handleOpenModalCreateEmployee = (id: string) => {
    const dataEmployee = employees.find((e) => String(e._id) === String(id));

    if(!dataEmployee)return;
    setIsModalOpen(true);
    setToggleButton(false);
    setCreateEmployee({
      _id: dataEmployee?._id,
      name: dataEmployee?.name,
      email: dataEmployee?.email,
      password: dataEmployee?.password,
      role: dataEmployee?.role,
      phone: dataEmployee?.phone,
    });
  };

  const handleUpdateEmployee = async (employeeId: string) => {
     if(createEmployee.name === "" || createEmployee.email === "" || createEmployee.password === "" || createEmployee.role === "" || 
      createEmployee.phone === ""
     ) return toast.error(MESSAGES.ERROR_ENTER_INPUTS);
     try {
         const response = await updateEmployeeAPI({employeeId, createEmployee}).unwrap();
         if(response.status) {
            toast.success(MESSAGES.SUCCESS_CREATE_EMPLOYEE);
            setIsModalOpen(false);
          setCreateEmployee({
              name: "",
              email: "",
              password: "",
              role: "",
              phone: "",
          });
         }
 
     }catch(error) {
        return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
     }finally{
      setIsModalOpen(false);
      setCreateEmployee({
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
      });
     }
  };


  const handleToggleStatusEmployee = async (employeeId: string) => {
     try {
         const response = await toggleStatusEmployeeAPI(employeeId).unwrap();

         if(response.status) {
            toast.success(MESSAGES.SUCCESS_UPDATE_EMPLOYEE);  
         }
 
     }catch(error) {
        return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
     }
  }



  return (
    <>
      <div className=" fixed top-30 right-10 z-50">
           <Button 
            text="Add Employees"
            onClick={handleOpenModal}
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
                             {toggleButton ?
                                <button disabled={registerIsLoading || isError} onClick={() => handleCreateEmployee()}
                                  type="button" className={` ${registerIsLoading  || isError ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}
                                  text-sm text-white bg-gray-800 py-1.5 px-3  hover:bg-gray-600 rounded-sm`}>
                                  {registerIsLoading ? 
                                  <span><FontAwesomeIcon icon={faSpinner} spin /> create...</span>
                                  :
                                      "Register Employee"
                                  }
                                </button>
                                  :
                                <button disabled={registerIsLoading || isError} onClick={() => handleUpdateEmployee(createEmployee._id || "")}
                                  type="button" className={` ${registerIsLoading  || isError ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}
                                  text-sm text-white bg-gray-800 py-1.5 px-3  hover:bg-gray-600 rounded-sm`}>
                                  {registerIsLoading ? 
                                  <span><FontAwesomeIcon icon={faSpinner} spin /> updated...</span>
                                  :
                                      "Update Employee"
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
                                      <input value={createEmployee?.name} 
                                        onChange={(e) => setCreateEmployee({ ...createEmployee, name: e.target.value })}
        
                                          className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                        type="text" id="name" placeholder="Name" required/>
                                  </label>
                              </div>
                              <div className="mb-3">
                                 <label className="flex flex-col w-full" htmlFor="email">
                                    Email
                                        <input value={createEmployee?.email} 
                                        onChange={(e) => setCreateEmployee({ ...createEmployee, email: e.target.value })}
                                          className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                        type="email" id="email" placeholder="email" required/>
                                  </label>
                              </div>
                              <div className="mb-4 flex items-center justifu-center space-x-4">
                                  <label className="flex flex-col w-full" htmlFor="role">
                                      Role
                                        <select value={createEmployee?.role} 
                                        onChange={(e) => setCreateEmployee({ ...createEmployee, role: e.target.value })}
                                          className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full "
                                          name="role" id="role">
                                          <option value="">Role?</option>
                                          <option value="admin">Admin</option>
                                          <option value="doctor">Doctor</option>
                                          <option value="receptionist">Receptionist</option>
                                        </select>
                                  </label>
                                    <label className="flex flex-col w-full" htmlFor="Password">
                                        Password
                                        <div className="flex items-center rounded-sm shadow-sm shadow-gray-600 
                                            
                                        ">
                                          <input  value={createEmployee?.password} 
                                            onChange={(e) => setCreateEmployee({ ...createEmployee, password: e.target.value })}
                                            className="p-2  w-full outline-none"
                                          type={!revealedSearch ? "password" : "text" } id="Password" placeholder="Password" required/>
                                          <button
                                                type="button"
                                                onClick={() => setRevealedSearch((r) => !r)}
                                                className="text-slate-400 hover:text-slate-700 transition-colors duration-150 cursor-pointer mx-2"
                                                aria-label={!revealedSearch ? "Hide password" : "Show password"}
                                              >
                                                <FontAwesomeIcon className="text-lg" icon={!revealedSearch ? faEyeSlash : faEye} />
                                         </button>
                                        </div>
                                  </label>
                              </div>
                              <div className="mb-4 ">
                                  <label className="flex flex-col w-full" htmlFor="phoneNumber">
                                    Phone Number
                                        <input value={createEmployee?.phone} 
                                        onChange={(e) => setCreateEmployee({ ...createEmployee, phone: e.target.value })}
                                          className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                                        type="text" id="phoneNumber" placeholder="Phone Number" required/>
                                    </label>
                              </div>
                        </form>
      </Modal>
      <div className="min-h-full py-8 px-10 mt-11 animate-[fadeInUp_0.4s_ease-out_forwards]">

        <div
          className="flex flex-col gap-1"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800/20 text-blue-700 shadow-sm">
              <FontAwesomeIcon className="text-xl" icon={faUserDoctor} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Employees</h1>
              <p className="text-md text-slate-500">Add, review, and manage clinic staff accounts</p>
            </div>
          </div>
        </div>

        <div className=" w-full  flex  py-5 ">
            <Crads 
            title="Total Patients"
            icon={faUsers}
            count={user?.count || 0}
              lable="in diractory" 
              color={COLORS.DARK}
            />
        </div>
        <div
          className="my-6 flex flex-col gap-4 opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards] sm:flex-row sm:items-center sm:justify-between"
          style={{ animationDelay: "60ms" }}
        >

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <FontAwesomeIcon className="text-lg " icon={faUsers} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">All employees</p>
              <p className="text-2xl font-semibold text-slate-900">
                {employeesIsActive.length}
                <span className="ml-2 align-middle text-xs font-normal text-emerald-600">
                  <FontAwesomeIcon className="text-[6px] align-middle mr-1" icon={faCircle} />
                  {employeesIsActive.length} active
                </span>
              </p>
            </div>
          </div>


          <div className="relative w-full sm:w-80">
            <SearchInput 
              onChange={setSearchValue}
            />
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
                        <div className="w-[95%] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm max-h-150 overflow-y-scroll">
                          <DataTable<employee>
                              emptyMessage="there are no appointments to display."
                              data={employees}
                            columns={columns}
                              keyExtractor={(emp) => emp._id}
                              renderActions={(emp) => (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button disabled={toggleIsLoading ? true : false} onClick={() => handleToggleStatusEmployee(emp._id)}
                                      type="button"
                                      title="Reset password"
                                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-50 transition-all duration-100
                                        cursor-pointer active:scale-90 ${emp.isActive ? "hover:bg-emerald-600 bg-emerald-700 " : 
                                          "hover:bg-rose-500 bg-rose-800 "} ${toggleIsLoading ? "bg-gray-800/60 hover:bg-gray-500 " : ""}`} 
                                    >
                                      {toggleIsLoading ? 
                                        <FontAwesomeIcon className="text-sm text-blue-700" icon={faSpinner} spin />
                                      :
                                        <FontAwesomeIcon className="text-sm" icon={emp.isActive ? faLockOpen : faLock} />
                                      }
                                    </button>
                                    <button onClick={() => handleOpenModalCreateEmployee(emp._id)}
                                      type="button"
                                      title="Edit employee"
                                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-50 transition-all duration-150 hover:bg-sky-600
                                        bg-gray-400 cursor-pointer active:scale-90"
                                    >
                                      <FontAwesomeIcon className="text-sm" icon={faPen} />
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
  );
}
