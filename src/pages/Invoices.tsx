import { faCircleCheck, faCircleChevronLeft, faCircleChevronRight, faCreditCard, faEye, faSpinner, faUsers } from "@fortawesome/free-solid-svg-icons";
import Crads from "../components/Crads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLORS, MESSAGES, STATUS_INVOICES } from "../utils/constants";
import { useCreateTransictionInvoicAPIMutation, useGetInvocesAPIQuery } from "../store/invoices.Store";
import { format } from "date-fns";
import { getInitials } from "../utils/generators";
import {  useState } from "react";
import { RightBar } from "../components/RightBar";
import SearchInput from "../components/Search";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import type { CreateTransaction } from "../types/Types";
import { errorCatch } from "../utils/errorHelpers";
import { DataTable, type Column } from "../components/Table";
import type {InvoicesData} from "../types/Types"
import { PageSkeletonLoader } from "../components/Loading";

const columns: Column<InvoicesData>[] = [
   {key: "patientCode", header: "ID", render: (invoice) => (
    <>
      <span className="pl-2 py-3 font-semibold text-gray-700/70">{invoice.patientId.patientCode}</span>
    </>
   )},
   {key: "name", header: "Name", render: (invoice) => (
    <>
       <div className="flex items-center">
            <span className="bg-blue-700/20 text-blue-700/80 rounded-full py-1.5 px-2 mr-1"
            >{getInitials(invoice.patientId.name)}</span>
            {invoice.patientId.name}
        </div>
    </>
   )},
   {key: "service", header: "Service", render: (invoice) => (
    <>
      <span className="pl-2 py-3 font-semibold text-gray-700/70">{invoice.appointmentId.plannedProcedure}</span>
    </>
   )},
   {key: "date", header: "Date", render: (invoice) => (
    <>
      <span className="pl-2 py-3 font-semibold text-gray-700/70">{format(invoice.createdAt, "yyyy-MM-dd")}</span>
    </>
   )},
   {key: "amount", header: "Amount", render: (invoice) => (
    <>
      <div className="pl-2 py-3 font-bold text-green-700/80 ">
            <span className="bg-green-600/10 rounded-full py-1 px-1.5">{invoice.totalAmount}$</span>
      </div>
    </>
   )},
   {key: "status", header: "Status", render: (invoice) => (
    <>
      <div className={`pl-2 py-3`}>
         <span className={`${STATUS_INVOICES[invoice.paymentStatus]} py-1 px-2 rounded-full`}>{invoice.paymentStatus}</span>
     </div>
    </>
   )},
];




export function InvoicesPage() {
    const [openRightBar, setOpenRightBar] = useState(false);
    const [transactionId, setTransactionId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState(1);
    const [toggleButtonColor, setToggleButtonColor] = useState("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<CreateTransaction>({
        invoiceId: '',
        patientId: '',
        paymentMethod: '',
        amountPaid: 0,
        notes: ''
    });
    
    const {data, isLoading, isFetching, isError, refetch} = useGetInvocesAPIQuery({search: searchTerm, page: page, paymentStatus: toggleButtonColor});
    const [createTransaction, {isLoading: isLoadingCreate, isError: isErrorCreate}] = useCreateTransictionInvoicAPIMutation();

    const invoices = data?.data || [];
    const isLastPage = page * 20 >= invoices.length;

    const handleOpenRightBar = (id: string) => {
       setOpenRightBar(true);
       setTransactionId(id);
    };


    const handleCloasRightBar = () => {
       setOpenRightBar(false);
    };

    const handleNextPage = () => {
      if(isLastPage) {
        setPage(priv => priv + 1);
      };
    };
    const handleBackPage = () => {
      if(page > 1) {
        setPage(priv => priv - 1); 
      }
    };

    const handleOpenModal = ({id, patientId}: {id: string, patientId: string}) => {
      setIsModalOpen(true);
      setTransaction((prev) => ({
        ...prev,
        invoiceId: id,
        patientId: patientId
      }));
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setTransaction({
            invoiceId: '',
            patientId: '',
            paymentMethod: '',
            amountPaid: 0,
            notes: ''
       });
    };


    const handleCreateTransaction = async () => {
        if(transaction.amountPaid === 0 || transaction.paymentMethod === "") return toast.error(MESSAGES.ERROR_ENTER_INPUTS);
      try {
         const response = await createTransaction(transaction).unwrap();
         if(response.status){
            toast.success("create transaction successfully.");
            setIsModalOpen(false);
         }
      }catch(error) {
         return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
      }finally {
        setTransaction({
            invoiceId: '',
            patientId: '',
            paymentMethod: '',
            amountPaid: 0,
            notes: ''
       });
      }
    };
    

    return (
        <>
       
          <RightBar isOpen={openRightBar} onCloas={handleCloasRightBar} id={transactionId} />
           <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              title="Pay the invoice"
              text="Create in invoice"
              footer={
                <div className="flex items-center justify-end space-x-4 ">
                        <button type="button" onClick={handleCloseModal}
                             className="text-md shadow-sm shadow-gray-600 text-gray-800  py-1 px-3 cursor-pointer hover:bg-gray-600 rounded-sm 
                             hover:text-white
                            ">
                            Cancel
                        </button>
                        <button disabled={isLoadingCreate || isErrorCreate} onClick={() => handleCreateTransaction()}
                                type="button" className={` ${isLoadingCreate  || isErrorCreate ? "opacity-50 cursor-not-allowed" : "cursor-pointer opacity-100"}
                                    text-sm text-white bg-gray-800 py-1.5 px-3  hover:bg-gray-600 rounded-sm`}>
                                    {isLoadingCreate ? 
                                <span><FontAwesomeIcon icon={faSpinner} spin /> create...</span>
                                    :
                                 "Pay"
                                }
                        </button>
                </div>
              }
             >
              <form className="grid grid-cols-1 gap-3 my-5">
                    <div className="flex items-center justifu-center space-x-3">
                        <label className="w-full" htmlFor="Pay">
                        Pay
                        <input value={transaction.amountPaid} onChange={(e) => setTransaction({ ...transaction, amountPaid:  Number(e.target.value)})}
                        className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                        type="number" id="Pay" placeholder="enter Pay" required name="pay"/>
                    </label>
                    <label className="w-full" htmlFor="paymentMethod">
                        PaymentMethod
                        <select value={transaction.paymentMethod} onChange={(e) => setTransaction({...transaction, paymentMethod: e.target.value})}
                            className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full "
                                name="paymentMethod" id="paymentMethod">
                                <option value="">Method?</option>
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                        </select>
                    </label>
                    </div>
                    <label className="w-full" htmlFor="nots">
                        Nots
                        <input value={transaction.notes} onChange={(e) => setTransaction({...transaction, notes: e.target.value})}
                        className="p-2 rounded-sm shadow-sm shadow-gray-600 w-full outline-gray-300 outline-1 focus:outline-gray-500"
                        type="nots" id="nots" placeholder="nots" required/>
                    </label>
              </form>
           </Modal>

          <div className="min-h-full px-6 py-8  mt-11 animate-[fadeInUp_0.35s_ease-out_forwards]">
               <div className="flex items-center  px-5">
                <div className="bg-blue-800/20 text-blue-700 p-2 rounded-md">
                     <FontAwesomeIcon className="text-2xl" icon={faCreditCard} />
               </div>
                <div className="ml-2">
                   <h1 className="text-2xl text-gray-800 font-semibold">Billing</h1>
                    <p className="text-lg">Track invoices, payments, and outstanding balances.</p>
                </div>
               </div>

               <div className="my-10 grid grid-cols-4 gap-4">
                  <Crads 
                    title="Number of invoices"
                    lable=""
                    icon={faUsers}
                    count={data?.count || 0}
                    color={COLORS.DARK}
                   />
               </div>

                    <div className="flex items-center justify-center mb-3">
                        <div className="flex items-center justify-end w-[95%]">
                            <div className="w-80">
                            <SearchInput onChange={setSearchTerm} />
                            </div>
                        </div>
                    </div>             
                         {isError ? 
                                  <div>
                                     <div  className="px-4 py-10 text-center text-gray-700">
                                         <h1 className="text-2xl">Network Error</h1>
                                         <p className="text-lg">Make sure you are connected for the network.</p>
                                         <button onClick={() => refetch()}
                                          className="text-xl rounded-md cursor-pointer bg-blue-600 text-white hover:bg-blue-500
                                           transition-all duration-300 active:scale-90 mt-5 w-25 py-1
                                         "
                                         >
                                            Reload
                                         </button>
                                      </div>
                                   </div>
                                  :
                                  <>
                                   { isLoading || isFetching  ?
                                        <div>
                                          <div >
                                              <PageSkeletonLoader />
                                          </div>
                                        </div>
                                      :
                <div className="flex items-center justify-center">
                    <div className="w-[95%] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm max-h-150 overflow-y-scroll ">
                            <div className="flex items-center justify-between p-4">
                                    <div className=" flex items-center space-x-10">
                                        <button disabled={page === 1} onClick={() => handleBackPage()}
                                        title="back" 
                                            className={`text-gray-800 text-3xl  hover:text-gray-600 active:scale-90 transition-all
                                            duration-100 ${page > 1 ? " opacity-100 cursor-pointer" : " opacity-50 cursor-not-allowed"}`}>
                                        <FontAwesomeIcon icon={faCircleChevronLeft} />
                                        </button>
                                        <button disabled={isLastPage} onClick={() => handleNextPage()}
                                        title="next" className={`text-gray-800 text-3xl hover:text-gray-600 active:scale-90 transition-all
                                            duration-100 ${!isLastPage ?
                                            "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
                                        <FontAwesomeIcon icon={faCircleChevronRight} />
                                        </button>
                                    </div>
                                <div className=" flex items-center justify-around rounded-md shadow-sm shadow-gray-500 py-.5 px-2 w-[35%]">
                                            <button onClick={() => setToggleButtonColor("")}
                                            className={`text-md text-blue-700 ${toggleButtonColor === "" ? "bg-blue-800/30" : ""} rounded-md
                                            py-1 px-5 my-1 cursor-pointer font-semibold hover:bg-blue-800/30 transition-all duration-100 active:scale-90`}>
                                                All
                                            </button>
                                            <button onClick={() => setToggleButtonColor("Paid")}
                                            className={`text-md text-blue-700 ${toggleButtonColor === "Paid" ? "bg-blue-800/30" : ""} rounded-md
                                            py-1 px-5 my-1 cursor-pointer font-semibold hover:bg-blue-800/30  transition-all duration-100 active:scale-90`}>
                                                Paid
                                            </button>
                                            <button onClick={() => setToggleButtonColor("Partially Paid")}
                                            className={`text-md text-blue-700 ${toggleButtonColor === "Partially Paid" ? "bg-blue-800/30" : ""} rounded-md
                                            py-1 px-5 my-1 cursor-pointer font-semibold hover:bg-blue-800/30  transition-all duration-100 active:scale-90`}>
                                                Partially Paid
                                            </button>
                                            <button onClick={() => setToggleButtonColor("Unpaid")}
                                            className={`text-md text-blue-700 ${toggleButtonColor === "Unpaid" ? "bg-blue-800/30" : ""}
                                            rounded-md py-1 px-5 my-1 cursor-pointer font-semibold hover:bg-blue-800/30  transition-all duration-100 active:scale-90`}>
                                                Unpaid
                                            </button>
                               </div>
                        </div>
                                   <DataTable<InvoicesData> 
                                    emptyMessage="There are no patients to display."
                                     data={invoices}
                                     columns={columns} 
                                     keyExtractor={(invoice) => invoice._id}
                                     renderActions={(invoice) => (
                                       <div className={`pl-2 py-3 flex items-center space-x-2 `}>
                                            <button disabled={invoice.balance === 0 ? true : false} 
                                             title="Payment" onClick={() => {handleOpenModal({id: invoice._id, patientId: invoice.patientId._id})}}
                                              className={` py-1 px-2 rounded-md z-50 font-semibold transition-all duration-100 active:scale-90
                                                  ${invoice.balance === 0 ?
                                                 "opacity-50 cursor-not-allowed text-green-700 bg-green-500/20 hover:bg-green-600/40" 
                                                : "opacity-100 cursor-pointer text-blue-700 bg-blue-500/20 hover:bg-blue-600/40"
                                               }`}>
                                                Pay 
                                                {invoice.balance === 0 ?
                                                 <FontAwesomeIcon className="ml-1" icon={faCircleCheck} />
                                                 :
                                                <FontAwesomeIcon className="ml-1" icon={faCreditCard} />
                                                 }
                                            </button>
                                            <button title="Veiw ditails" onClick={() => handleOpenRightBar(invoice._id)}
                                              className="text-blue-700 bg-blue-700/10 py-1 px-2 rounded-sm z-50 cursor-pointer transition-all duration-150 
                                               active:scale-90 hover:bg-blue-700/50">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </div>
                                     )}
                                   />
                    </div>
                </div>
                            }
                        </>
                        }
                    
        </div>
    </>
    )
} 