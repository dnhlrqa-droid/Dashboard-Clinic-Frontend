import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PropsButton } from "../types/Types";





export default function Button({text, onClick}: PropsButton) {
     return (
        <>
           <button onClick={onClick}
              title={text}
              className="text-md bg-blue-800/60 text-white px-3 py-2 rounded-md cursor-pointer hover:bg-blue-700/80 min-w-40 flex items-center
             justify-center  transition-all duration-300 active:scale-90
              ">
              <FontAwesomeIcon className="text-white text-lg" icon={faPlus} />
                {text}
           </button>
        </>
     )
};