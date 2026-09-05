import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useDebouncedValue from "../hooks/useSearch";





export default function SearchInput({onChange}: {onChange: (value: string) => void}) {
    const [inputValue, setInputValue] = useState<string>("")
    const debouncedValue  = useDebouncedValue(inputValue, 500);

    useEffect(() => {
       onChange(debouncedValue)
    }, [debouncedValue])
   return (
    <>
          <div className=" shadow-gray-400 shadow-sm w-full rounded-md overflow-hidden flex items-center justify-around">
                     <div className="bg-gray-300 w-[15%] h-full py-3 flex items-center justify-center">
                        <FontAwesomeIcon className='text-white text-xl' icon={faMagnifyingGlass} />
                     </div>

                    <input className="w-[90%] rounded-sm p-2 h-10 outline-0"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                     type="text" 
                     placeholder="Search..." />
        </div>
    </>
   )
};