import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { AlertProps } from "../types/Types";






export default function Alert({title, confirm, onClose}: AlertProps) {
    return (
        <div className=" w-full flex items-center justify-center fixed top-0 left-0 z-50 h-screen bg-[#000000be] ">
           <div className="flex flex-col items-center justify-center p-5 w-[35%] rounded-xl bg-white relative">
                <div className=" absolute top-2 left-2">
                    <FontAwesomeIcon className="text-5xl text-red-800" icon={faCircleExclamation} />
                </div>
                <p className="text-xl my-5">{title}?</p>
                <div className="flex items-end justify-end space-x-5 w-full mt-5">
                    <button onClick={confirm}
                      className="text-md text-white bg-green-600 py-1 px-2 rounded-sm cursor-pointer
                      hover:bg-green-500 active:scale-95 transition-all duration-300
                    ">confirm
                    </button>
                    <button onClick={onClose}
                      className="text-md text-white bg-red-600 py-1 px-2 rounded-sm cursor-pointer
                      hover:bg-red-300 active:scale-95 transition-all duration-300
                    ">close
                    </button>
                </div>
           </div>
        </div>
    )
}