import { faCalendar, faChartLine, faCodeFork, faCreditCard, faStethoscope, faUserDoctor, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import { ROLES, ROUTES, ROUTES_ROLES_PATH_LINKS } from '../utils/constants';
import { useGetCurrentUserQuery } from '../store/authStore';

const minuOun = [
    {id: 1, lable: "Dashboard", role: ['admin'], icon: faChartLine, link: ROUTES.DASHBOARD},
    {id: 2, lable: "Appointments", role: ['admin', 'receptionist'], icon: faCalendar, link: ROUTES.APPOINTMENTS},
    {id: 3, lable: "Patients", role: ['admin', 'receptionist'], icon: faUserGroup, link: ROUTES.PATIENTS},
    {id: 4, lable: "Doctors", role: ['admin'], icon: faUserDoctor, link: ROUTES.DOCTORS},
    {id: 5, lable: "Medical Records", role: ['admin', 'doctor'], icon: faStethoscope, link: ROUTES.MEDICAL_RECORDS},
];
const minutwo = [
    {id: 1, lable: "Billing", role: ['admin', 'receptionist'], icon: faCreditCard, link: ROUTES.BILLING},
];



export default function Sidebar() {
   const {data: data} = useGetCurrentUserQuery();
  const location = useLocation().pathname;
  
  
  if(!data) return;

   return (
    <>
        <main className=' relative top-0  z-40  w-[18.5%] '>
          <div className='fixed top-0 bg-gray-100 w-80 h-screen '>
               <div className='border-b-2 border-gray-300 flex items-center justify-center space-x-4  p-1.5 '>
                 <div className='bg-blue-800/10 p-3 rounded-lg'>
                    <FontAwesomeIcon className='text-4xl text-blue-600/80' icon={faStethoscope} />
                 </div>
                 <div>
                     <p className='text-gray-900 text-lg font-black'>Medi<span className='text-blue-700/80 text-2xl'>Care</span></p>
                     <p>Clinic Suite</p>
                 </div>
             </div>
             <div className='mt-5 p-3'>
                <ul className=''> 
                    <li className='font-semibold text-gray-700 mb-2'>Main</li>
                       { 
                        minuOun.filter((l) => l.role.includes(data.user.role)).map((item) => (
                                <Link to={item.link} key={item.id}>
                                        <li className={`text-lg my-3 py-2 px-1 hover:bg-blue-600/80 hover:text-gray-100 cursor-pointer rounded-sm font-semibold
                                            ${location ===  ROUTES_ROLES_PATH_LINKS[data.user.role] + item.link ? "bg-blue-500 text-gray-100" : "text-gray-800"}`}>
                                            <FontAwesomeIcon className={`text-lg  mr-2 
                                                ${location ===  ROUTES_ROLES_PATH_LINKS[data.user.role] + item.link ? "text-blue-200" : "text-blue-700"}
                                            `} icon={item.icon} />
                                            {item.lable}
                                        </li>
                                </Link>
                            ))
                        }
                </ul>
                {data.user.role != ROLES.DOCTOR && (
                    <ul className='mt-10'> 
                        <li className='font-semibold text-gray-700 mb-2'>Workspace</li>
                        { 
                            minutwo.filter((l) => l.role.includes(data.user.role)).map((item) => (
                                    <Link to={item.link} key={item.id}>
                                            <li className={`text-lg my-3 py-2 px-1 hover:bg-blue-600/80 hover:text-gray-100 cursor-pointer rounded-sm font-semibold
                                            ${location ===  ROUTES_ROLES_PATH_LINKS[data.user.role] + item.link ? "bg-blue-500 text-gray-100" : "text-gray-800"}`}>
                                                <FontAwesomeIcon className={`text-lg  mr-2 
                                                ${location ===  ROUTES_ROLES_PATH_LINKS[data.user.role] + item.link ? "text-blue-200" : "text-blue-700"}
                                               `} icon={item.icon} />
                                                {item.lable}
                                            </li>
                                    </Link>
                                ))
                            }
                    </ul>
                )}
             </div>
             <div className=' absolute bottom-4 w-full flex flex-col items-center justify-center border-t-2 border-gray-300'>
                <p className='text-lg font-semibold text-gray-700'>{import.meta.env.VITE_APP_NAME}</p>
                <p className='text-md font-bold text-blue-700/80'><FontAwesomeIcon icon={faCodeFork} /> v.{import.meta.env.VITE_APP_VERSION}</p>
             </div>
          </div>
        </main>
    </>
   )
};