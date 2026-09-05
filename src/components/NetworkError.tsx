import {  faExclamationCircle, faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetCurrentUserQuery } from "../store/authStore";
import { MESSAGES, ROUTES } from "../utils/constants";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";




function NetworkError() {
  const {data,isFetching, refetch} = useGetCurrentUserQuery();

 if(data) return <Navigate to={ROUTES.DASHBOARD} />
 if(!data) return <Navigate to={ROUTES.LOGIN} />
  return (
      <div className="flex items-center justify-center h-screen w-full ">
        {isFetching ? 
            <Loading />
           :
         <div className="min-w-[20%] p-8 rounded-xl  flex flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-5">
                    <FontAwesomeIcon className="text-8xl text-gray-800" icon={faFaceFrown} />
                    <div className="flex items-center space-x-5">
                      <FontAwesomeIcon className="text-6xl text-red-900" icon={faExclamationCircle} />
                      <p className="text-2xl text-red-700 my-3">{MESSAGES.ERROR_NETWORK}</p>
                    </div>
                </div>
            <button onClick={() => refetch()}
              className="py-1 px-2 w-30 text-md cursor-pointer rounded-md my-3 bg-blue-700 hover:bg-blue-500 transition-all duration-300
              text-white active:scale-90
              ">
               Reload
            </button>
        </div>
    }
      </div>
  );
}

export default NetworkError;
