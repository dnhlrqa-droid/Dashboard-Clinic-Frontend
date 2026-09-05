
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



interface PropsCrad {
    title: string,
    icon: IconProp ,
    count: number | string,
    lable: string,
    color: string,
};




export default function Crads({ title, icon, count, lable, color}: PropsCrad) {
    return (
        <>
           <div className="p-5 rounded-xl shadow-gray-500 shadow-sm m-5  w-75">
               <div className="flex items-center justify-between mb-3">
                    <p className="text-xl">{title}</p>
                     <div className="bg-sky-50 text-sky-600 py-1 px-2 rounded-md ml-3">
                         <FontAwesomeIcon className="text-lg " icon={icon} />
                     </div>
               </div>
               <div>
                   <p><span className={`text-xl font-bold ${color}`}>{count}</span></p>
                     <div>
                         <p className="text-md">{lable}</p>
                     </div>
               </div>
           </div>
        </>
    )
};