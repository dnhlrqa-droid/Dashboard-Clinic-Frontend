import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetCurrentUserQuery } from "../store/authStore";
import { faRotate, faSpinner, faWifi } from "@fortawesome/free-solid-svg-icons";
import { ROUTES_ROLES } from "../utils/constants";
import { Navigate } from "react-router-dom";



export default function NetworkError() {

   const {data: user, isFetching, refetch, isError} = useGetCurrentUserQuery();

   if(user) {
       return <Navigate to={ROUTES_ROLES[user?.user.role]} replace />
    }
   
  return (
    <div className="flex min-h-120 w-full flex-col items-center justify-center p-6 text-center animate-fade-in">
  
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
        <div className="absolute inset-0 rounded-full bg-red-200 dark:bg-red-700/60 animate-ping opacity-75 max-h-24 max-w-24"></div>
        
        <FontAwesomeIcon className="text-4xl text-red-500/40" icon={faWifi} />
        <p className=" absolute top-4 left-11.5 h-16 w-1 bg-red-500/50 transform -rotate-45 rounded-2xl"></p>
      </div>

      <h3 className="mb-2 text-3xl font-bold tracking-tight text-slate-800 ">
         Network connection error
      </h3>
      <p className="mb-8 max-w-md text-sm text-slate-500 dark:text-slate-400 sm:text-base leading-relaxed">
        It seems you're offline. Please check your router or try again."
      </p>

      <button
        onClick={refetch}
        disabled={isFetching}
        className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 cursor-pointer
        text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-95 disabled:pointer-events-none disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
         {
          isFetching ?
          <FontAwesomeIcon className="text-lg" spin icon={faSpinner} />
          :
          <FontAwesomeIcon className="text-lg group-hover:rotate-180 transform transition-all duration-500" icon={faRotate} />
         }
        <span>{isFetching ? 'Connecting...' : 'Refreshing Page'}</span>
      </button>
      {
        isError && (
         <>
           <h4 className="text-red-500 py-2">Failed to connect to the network.</h4>
           <h3 className="text-red-500">Please check your internet connection and try again.</h3>
         </>
        )
      }
    </div>
  );
}
