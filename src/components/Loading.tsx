import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";











export default function Loading() {
     return (
        <div className="flex flex-col items-center justify-center h-screen space-y-5">
          <FontAwesomeIcon className=" text-7xl text-blue-600" icon={faSpinner} spin />
            <p className="text-xl">loading....</p>
        </div>
     )
};

export function LoadingTable() {
     return (
        <div className="flex flex-col items-center justify-center  space-y-2 py-3">
              <FontAwesomeIcon className=" text-4xl text-blue-600" icon={faSpinner} spin />
             <p className="text-xl">loading....</p>
        </div>
     )
};

export function PageSkeletonLoader() {
     return (
        <div className="flex  items-center w-full justify-center py-3">
              <div className="w-[95%] min-h-100 rounded-xl overflow-hidden shadow shadow-gray-700/50 flex flex-col items-center py-3 px-2 space-y-4">
                   <div className="w-[98%] h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                   {Array.from({length: 10}).map((_,i) => (
                         <div key={i} className="flex items-center space-x-1 w-full justify-center">
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                              <div className="w-30 h-10 bg-gray-600/20 rounded-sm animate-pulse"></div>
                         </div>
                   ))}

              </div>
        </div>
     )
};