import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ModalProps } from "../types/Types";




export default function Modal({
    isOpen,
    onClose,
    title,
    text,
    children,
    footer
}: ModalProps) {


 if(!isOpen) return null;

  return (
    <>
       <main className={`w-full flex items-center justify-center fixed top-0 left-0 h-screen bg-[#000000be] z-40 `}>
            <div className="shadow-gray-800 shadow-md rounded-2xl px-4 py-2 w-[35%] bg-gray-100">
                <div className="flex items-center justify-between mb-5">
                     <div>
                         <p className="text-xl ">{title}</p>
                         <p>{text}</p>
                     </div>
                       <button onClick={onClose}
                         className="text-gray-900 text-xl cursor-pointer rounded-2xl p-1 hover:bg-gray-300">
                             <FontAwesomeIcon icon={faXmark} />
                       </button>
                </div>
                <div>
                    {children}
                </div>

                <footer>
                    {footer}
                </footer>
            </div>
       </main>
    </>
  )
};