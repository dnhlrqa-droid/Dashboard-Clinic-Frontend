import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faPrint, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useGetInvoicePatientAPIQuery, useGetTransactionPatientAPIQuery } from "../store/invoices.Store"
import { format } from "date-fns";
import { STATUS_INVOICES } from "../utils/constants";
import { getInitials } from "../utils/generators";
import Loading from "./Loading";
import { useEffect, useRef } from "react";




interface RightBarProps {
    id: string,
    isOpen: boolean,
    onCloas: () => void
};


export function RightBar({isOpen, onCloas, id}: RightBarProps) {
        const {data, isFetching} = useGetTransactionPatientAPIQuery({id: id});
        const {data: invoiceData, isFetching: isFetchingInvoice} = useGetInvoicePatientAPIQuery({id: id});
  
        const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
         function handleClickOutside(e:MouseEvent){
             if(containerRef.current && !containerRef.current.contains(e.target as Node)){
              onCloas()
           }
         }
             document.addEventListener("mousedown", handleClickOutside);

         return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
         
        const transaction = data?.data || [];
        const invoice = invoiceData?.data ;


    return (
        <>
         <div  className={`z-50 fixed top-0 left-0 ${isOpen ? "w-full h-screen bg-gray-800/70" : ""} `}>
            <div ref={containerRef}
            className={`fixed right-0 top-0  h-screen ${isOpen ? "w-[38%]" : "w-[0%]"} bg-white  shadow-sm shadow-gray-900 rounded-bl-md
            overflow-hidden transition-all duration-300 rounded-tl-md z-40 `}>
                {isFetchingInvoice || isFetching || !invoice ? 
                <div className="flex items-center justify-center h-screen">
                    <Loading />
                </div>
                   :
                <div className="p-6 overflow-y-scroll">

                    <button onClick={() => onCloas()}
                    className=" absolute top-4 right-6 border-2 border-gray-900/40 p-1 rounded-xl flex items-center justify-center
                    cursor-pointer transition-all duration-100 active:scale-90
                    ">
                        <FontAwesomeIcon className="text-xl  text-gray-800" icon={faXmark} />
                    </button>

                    <div className="flex items-center justify-between mt-8">
                        <div>
                            <h1 className=" font-semibold text-gray-800 text-lg">{invoice?.patientId.patientCode}</h1>
                        <p  className="text-gray-800">{invoice?.appointmentId.plannedProcedure}
                         <span> {format(invoice?.appointmentId.createdAt || "", "MMM-MM")}</span></p>
                        </div>
                        <div>
                            <span className={`text-lg font-semibold ${STATUS_INVOICES[invoice.paymentStatus]} rounded-xl px-2 p-1.5`}>
                              {invoice.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="p-3 my-8 rounded-md shadow shadow-gray-700/20 flex items-center justify-between bg-gray-400/10">
                        <div className="flex items-center space-x-2">  
                                <span className="bg-blue-700/20 text-blue-700 py-1.5 px-2 rounded-full ">{getInitials(invoice?.patientId.name)}</span> 
                                <p className="text-gray-800 font-semibold">{invoice?.patientId.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold text-lg">Total</p>
                            <p className="text-green-700 bg-green-700/10 py-1 px-2 rounded-md font-semibold">${invoice?.totalAmount}</p>
                        </div>
                    </div>

                    <div>
                    <p className="text-gray-800 font-semibold ml-5">Line Items</p>
                    <div className="w-full flex items-center justify-center">
                        <table className="w-[95%] shadow shadow-gray-500/30 rounded-md overflow-hidden">
                            <thead className="bg-gray-500/10">
                                <tr>
                                    <th className="text-start text-gray-800 font-semibold px-2">Description</th>
                                    <th className="text-start text-gray-800 font-semibold px-2">Method</th>
                                    <th className="text-start text-gray-800 font-semibold px-2">Price</th>
                                    <th className="text-start text-gray-800 font-semibold px-2">Date</th>
                                    <th className="text-start text-gray-800 font-semibold px-2">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.length === 0 ?
                                   <tr className="text-center ">
                                      <td className="py-1" colSpan={6}>No payment has been made yet.</td>
                                   </tr>
                                 :
                                transaction.map((t) => (
                                    <tr key={t._id} className=" border-b border-gray-400">
                                    <td className="pl-3 py-1">Information</td>
                                    <td className="pl-4 py-1">{t.paymentMethod}</td>
                                    <td className="pl-3 py-1 text-green-700 font-semibold">${t.amountPaid}</td>
                                    <td className="pl-3 py-1 text-gray-800 font-semibold">{format(t.createdAt, "yyyy-MM-dd")}</td>
                                    <td className="pl-3 py-1 text-gray-800 font-semibold">{format(t.createdAt, "hh:mm a")}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                    </div>

                    <div className="flex flex-col items-end justify-end my-5">
                        <div className="flex items-center justify-between w-[35%] border-t border-gray-600/40 p-1">
                            <p className="text-gray-800 font-semibold text-lg">Balance</p>
                            <p className="text-green-700  py-1 px-2 rounded-md font-semibold">${invoice.balance}</p>
                        </div>
                        <div className="flex items-center justify-between w-[35%] border-t border-gray-600/40 p-1">
                            <p className="text-gray-800 font-semibold text-lg">Total</p>
                            <p className="text-green-700  py-1 px-2 rounded-md font-semibold">${invoice.totalAmount}</p>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-lg text-gray-900 font-semibold">Billing history</h1>
                        <div className="mt-1.5">
                            <div className="">
                                <p className="text-md text-gray-900 font-semibold">Invoice created</p>
                                <span className="text-md text-gray-800/80 font-semibold">{format(invoice.createdAt, "yyyy-MM-dd, hh:mm a")}</span>
                            </div>
                        </div>
                    </div>

                    <div className=" relative -bottom-8 left-10 w-[50%] flex items-center space-x-3 mb-8">
                        <button className="shadow shadow-gray-800 rounded-md py-1.5 px-3 cursor-pointer transition-all duration-100 active:scale-90
                        hover:bg-gray-500/20 
                        ">
                            <FontAwesomeIcon icon={faPrint} />
                            Print
                        </button>
                        <button className="shadow shadow-gray-800 rounded-md py-1.5 px-3 cursor-pointer transition-all duration-100 active:scale-90
                        hover:bg-gray-500/20 
                        ">
                            <FontAwesomeIcon icon={faDownload} />
                            Dwonload PDF
                        </button>
                    </div>
                </div>
        }
            </div>
         </div>
        </>
    )
};