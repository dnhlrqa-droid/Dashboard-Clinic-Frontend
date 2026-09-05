
import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import { useToggleAppointmentAPIMutation } from "../store/Appointment.Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { ALLOWED_TRANSITIONS, MESSAGES, STATUS_LABEL, STATUS_STYLES } from "../utils/constants";
import type { AppointmentStatus, AppointmentStatusDropdownProps } from "../types/Types";
import { errorCatch } from "../utils/errorHelpers";






export  function AppointmentStatusDropdown({
  appointmentId,
  currentStatus,
}: AppointmentStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [toggleStatus, { isLoading }] = useToggleAppointmentAPIMutation();

  const availableTransitions = ALLOWED_TRANSITIONS[currentStatus] || [];


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitStatusChange = async (newStatus: AppointmentStatus) => {
    
    try {
      const response = await toggleStatus({ appointmentId, status: newStatus }).unwrap();
      if (response.status) {
        toast.success(MESSAGES.SUCCESS_UPDATE_APPOINTMENT_STATUS);
      }
    } catch (error) {
      return toast.error(errorCatch(error) || MESSAGES.ERROR_SERVER);
    } finally {
      setIsOpen(false);
    }
  };


  return (
    <div className="relative inline-block " ref={containerRef}>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 -z-10 rounded-full px-2.5 py-1 text-xs font-medium transition-opacity duration-150
           hover:opacity-100 disabled:opacity-50 ${STATUS_STYLES[currentStatus]} cursor-pointer`}
      >
        {STATUS_LABEL[currentStatus]}
        <FontAwesomeIcon icon={faChevronDown} className={`text-[9px] transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}/>
      </button>

      {isOpen && (
        <div className={`absolute -left-10 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg 
        animate-[fadeInUp_0.15s_ease-out_forwards] ${availableTransitions.length === 0 ? "hidden" : ""}`}>
          {availableTransitions.map((statusOption) => (
            <button
              key={statusOption}
              type="button"
              onClick={() => commitStatusChange(statusOption)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-100 hover:bg-slate-200
               cursor-pointer
              "
            >
              <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[statusOption].split(" ")[0]}`} />
              {STATUS_LABEL[statusOption]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
