
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser} from "@fortawesome/free-solid-svg-icons"
import { useGetCurrentUserQuery } from '../store/authStore';
import { getInitials } from '../utils/generators';



export default function Navbar() {
    const {data, status,  error} = useGetCurrentUserQuery();

     if(!data) return;
     const isAvailable = status !== "pending" && status !== "rejected" && !data.status && !error;
   return (
    <>
       <header className="flex items-center justify-end ">
           <nav className="flex items-center justify-start px-3 py-3 border-b-2 border-gray-200
               w-[84%] fixed top-0 right-0 bg-[#ffffff] z-30">
               <ul className="flex items-center justify-center space-x-3 w-[20%]">
                <li className=" text-gray-700 font-bold flex  items-center justify-center shadow shadow-gray-700/70 rounded-md p-2 relative">
                    <span className=' absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-green-500 animate-pulse '></span>
                    { !isAvailable ?
                     <>
                     <span className="text-blue-600 bg-blue-700/20 py-1 px-2 rounded-full ml-1 mx-1.5 text-md">
                     {getInitials(data.user.name)}</span>
                     {data.user.name}
                     </>
                       :
                     <>
                     <span className='w-20 h-5 rounded-md bg-gray-400 animate-pulse'></span>
                      <FontAwesomeIcon className="text-white bg-gray-700 py-1.5 px-1 rounded-full ml-1 animate-pulse" icon={faUser} />
                     </>
                    }
                </li>
               </ul>
               
            
           </nav>
       </header>
    </>
   )
};