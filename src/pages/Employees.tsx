import { faCalendar, faChartLine, faCreditCard, faDollarSign, faMoneyBills, faMoneyBillTrendUp, faMoneyCheckDollar, faUsers } from "@fortawesome/free-solid-svg-icons";
import Crads from "../components/Crads";
import { useAnalyticsAPIQuery, useAnalyticsHistoryAPIQuery } from "../store/analytics.Store";
import Loading from "../components/Loading";
import { COLORS } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import { getAvailableYears, getDaysInMonth, transformAnalyticsToChartData } from "../utils/generators";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chart } from "../components/Chart";




interface date {
  year: number,
  month: number,
  day: number,
}


export default function Dashboard() {
  
  const [select, setSelect] = useState<date>({
    year: 0,
    month: 0,
    day: 0,
  });
  const [openSelect, setOpenSelect] = useState("");
 const [dateRange, setDateRange] = useState(''); 
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickSelect(e: MouseEvent){
      if(selectRef.current && !selectRef.current.contains(e.target as Node)) {
         setOpenSelect('');
       }
    };
    document.addEventListener("mousedown", handleClickSelect);
    return () => document.removeEventListener("mousedown", handleClickSelect);
  }, []);

  const Day: number[] = [];
  for(let i = 1; i <= getDaysInMonth(select.year, select.month); i++){
    Day.push(i);
  }
  const {data, isFetching, isError, refetch, isLoading} = useAnalyticsAPIQuery({year: select.year, month: select.month, day: select.day, range: dateRange});
  const {data: ChartData} = useAnalyticsHistoryAPIQuery();
  const analyticsChart = ChartData?.data;
 
  const chartData  = analyticsChart ? transformAnalyticsToChartData(analyticsChart) : [];

  const analytics = data?.data;

    return (
        <>
          <div className="min-h-full py-8 px-10 mt-11 animate-[fadeInUp_0.4s_ease-out_forwards]">
            {!analytics ?
               <Loading />
              :
              <>
              <div>
                  <span className="bg-blue-700/10 rounded-md p-1 text-3xl">
                    <FontAwesomeIcon className="text-blue-700/90" icon={faChartLine} />
                  </span>
                  <div>
                    <h1 className="text-3xl text-gray-900 font-bold"> Good morning, <span>Dr. Ali Omar</span></h1>
                    <p className="text-lg text-gray-700 font-semibold">Here's what's happening at your clinic.</p>
                  </div>
              </div>
              <div>
                  <div className="my-6 ">
                      <div className=" flex  items-center justify-between w-[32%]">
                          <div className="mb-2 shadow shadow-gray-700/40 rounded-md w-50 flex items-center justify-around py-1">
                            <button onClick={() => {setSelect({year: 0, month: 0, day: 0}); setDateRange('');}}
                              className="bg-gray-700/90 text-gray-100 font-semibold rounded-md px-2 cursor-pointer transition-all duration-200
                            hover:bg-gray-700/70 active:scale-90
                            ">Restart</button>
                            <div>
                              {select.year != 0 && select.month != 0 && select.day != 0 ? 
                                <>
                                  <span className="">{select.year}</span>
                                  <span className="">-{select.month}</span>
                                  <span className="">-{select.day}</span>
                                </>
                                :
                                <p>{format(new Date(), "yyyy-MM-dd")}</p>
                              }
                            </div>
                         </div>
                         <div className="mb-2 flex items-center justify-between">
                            <button onClick={() => setDateRange("today")}
                             className={`shadow shadow-gray-700/60 rounded-md p-1 cursor-pointer transition-all duration-100
                            hover:bg-gray-300 active:scale-90 mx-2 ${dateRange === "today" ? "bg-gray-300" : "" }
                            `}>today</button>
                            <button onClick={() => setDateRange("yesterday")} 
                            className={`shadow shadow-gray-700/60 rounded-md p-1 cursor-pointer transition-all duration-100
                            hover:bg-gray-300 active:scale-90 mx-2 ${dateRange === "yesterday" ? "bg-gray-300" : "" }
                            `}>yesterday</button>
                            <button onClick={() => setDateRange("week")} 
                            className={`shadow shadow-gray-700/60 rounded-md p-1 cursor-pointer transition-all duration-100
                            hover:bg-gray-300 active:scale-90 mx-2 ${dateRange === "week" ? "bg-gray-300" : "" }
                            `}>week</button>
                          </div>
                     </div>
                      <div ref={selectRef} className="w-[20%] flex items-center space-x-6 ">
                        <div className="relative">
                            <button onClick={() => setOpenSelect("year")} className="text-gray-800 font-semibold cursor-pointer shadow shadow-gray-700/50 rounded-md transition-all
                             duration-100 hover:bg-gray-300 py-1 px-2 active:scale-90
                            ">Year</button>
                           <ul onClick={() => setOpenSelect("")} className={`shadow shadow-gray-700/50 rounded-md  absolute top-10 -left-2 overflow-hidden z-50 bg-gray-50
                              transform transition-all duration-150 ${openSelect === "year" ? "max-h-10" : "h-0"}
                             `}>
                              {getAvailableYears().years.map((y, indx) => (
                                <li key={indx} onClick={() => setSelect({...select, year: y})} className="p-1 transition-all duration-100 cursor-pointer
                                 hover:bg-gray-300 px-4">{y}</li>
                              ))}
                          </ul>
                        </div>
                        <div className="relative">
                            <button onClick={() => setOpenSelect("month")} className="text-gray-800 font-semibold cursor-pointer shadow shadow-gray-700/50 rounded-md transition-all
                             duration-100 hover:bg-gray-300 py-1 px-2 active:scale-90
                            ">Month</button>
                           <ul onClick={() => setOpenSelect("")} className={`shadow shadow-gray-700/50 rounded-md  absolute top-10 left-0 overflow-y-scroll  z-50 bg-gray-50
                             transition-all duration-150  ${openSelect === "month" ? "max-h-40" : "h-0"}
                            `}>
                           {getAvailableYears().month.map((m, indx) => (
                                <li key={indx} onClick={() => setSelect({...select, month: m})} className="p-1 transition-all duration-100 cursor-pointer
                                 hover:bg-gray-300 px-4">{m}</li>
                              ))}
                          </ul>
                        </div>
                        <div className="relative">
                            <button onClick={() => setOpenSelect("day")} className="text-gray-800 font-semibold cursor-pointer shadow shadow-gray-700/50 rounded-md transition-all
                             duration-100 hover:bg-gray-300 py-1 px-2 active:scale-90 
                            ">Day</button>
                           <ul onClick={() => setOpenSelect("")} className={`shadow shadow-gray-700/50 rounded-md  absolute top-10 left-0  z-50 bg-gray-50 overflow-y-scroll 
                              transition-all duration-150  ${openSelect === "day" ? "max-h-40" : "h-0"}
                            `}>
                             {Day.map((d, indx) => (
                                <li key={indx} onClick={() => setSelect({...select, day: d})} className="p-1 transition-all duration-100 cursor-pointer
                                 hover:bg-gray-300 px-4">{d}</li>
                              ))}
                          </ul>
                        </div>
                      </div>
                  </div>
                  <div></div>
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
              {isFetching || isLoading ?
                <div>
                  <div className="my-10 grid grid-cols-4 gap-5">
                      {Array.from({length: 8}).map((_,i) => (
                        <div key={i} className="w-75 h-40 rounded-lg shadow shadow-gray-700/50 animate-pulse bg-gray-300/10"></div>
                      ))}
                  </div>
                  <div className="flex items-center justify-center">
                     <div className="w-full h-screen rounded-2xl bg-gray-300/40 shadow shadow-gray-700/50 animate-pulse"></div>
                  </div>
                </div>
               :
               <>
              <div className="my-10 grid grid-cols-4 z-40">
                  <Crads 
                    title="Total Doctors"
                    lable=""
                    count={analytics.doctors}
                    icon={faUsers}
                    color={COLORS.DARK}
                  />
                  <Crads 
                    title="Total Patients"
                    lable=""
                    count={analytics.patients}
                    icon={faUsers}
                    color={COLORS.DARK}
                  />
                  <Crads 
                    title="Appointments Today"
                    lable={`Today ${analytics.appointmentToday.length}`}
                    count={analytics.appointments}
                    icon={faCalendar}
                    color={COLORS.DARK}
                  />
                    <Crads 
                      title="Total Transactions"
                      lable=""
                      count={analytics.totalTransactionsCount}
                      icon={faCreditCard}
                      color={COLORS.DARK}
                    />
                    <Crads 
                      title="Total InvoicesCount"
                      lable=""
                      count={analytics.totalInvoicesCount}
                      icon={faMoneyCheckDollar}
                      color={COLORS.DARK}
                    />
                  <Crads 
                    title="Revenue"
                    lable=""
                    count={`$${analytics.totalRevenue}`}
                    icon={faMoneyBillTrendUp}
                    color={COLORS.GREEN}
                  />
                  <Crads 
                    title="Total Collectrd"
                    lable=""
                    count={`$${analytics.totalCollected}`}
                    icon={faMoneyBills}
                    color={COLORS.GREEN}
                  />
                  <Crads 
                    title="Total Outstanding"
                    lable=""
                    count={`$${analytics.totalOutstanding}`}
                    icon={faDollarSign}
                    color={COLORS.GREEN}
                    />
              </div>
              <div>
                <Chart chartData={chartData}/>
              </div>
              </>
               }
              </>
             }
            </>
            }
          </div>
        </>
    )
}