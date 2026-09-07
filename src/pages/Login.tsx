import { faCircleExclamation, faSpinner, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLoginMutation } from "../store/authStore";
import toast from "react-hot-toast";
import { MESSAGES } from "../utils/constants";
import { errorCatch } from "../utils/errorHelpers";








export default function Login() {
    const [password, setPassword] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    

    const [Login] = useLoginMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);
         
        try {
              if(!password.trim()) return setErrorMessage("Please enter code");

            const response= await Login({password}).unwrap();

            if(response.status) {
                setIsSubmitting(false);
                toast.success(MESSAGES.SUCCESS_LOGIN);
            }

        }catch(error) {
            console.error(error);
            return setErrorMessage(errorCatch(error) || MESSAGES.ERROR_SERVER);
        }finally{
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-indigo-100 px-4">
            <div className="w-full max-w-md bg-gray-800/60 p-3 rounded-md">
                <div className="p-3">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600/70 mb-4">
                    <FontAwesomeIcon icon={faStethoscope} className="text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-100">Dental Clinic</h1>
                    { <div className={`flex items-center justify-center transform transition-all duration-100
                        ${errorMessage ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-5 scale-0"}`}>
                         <p className="text-white bg-red-500/40 py-2 w-[80%] rounded-sm p-1">
                             <FontAwesomeIcon className="text-xl" icon={faCircleExclamation} />
                           {errorMessage}
                        </p>
                    </div>}
                </div>


                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-group">
                    <label htmlFor="employeeCode" className="block text-sm font-medium text-gray-200 mb-2 required">
                       Employee Code
                    </label>
                    <input
                        id="employeeCode"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-white
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Please enter the code"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        autoFocus
                        required
                    />
                    </div>


                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className=" inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
                            transition-all duration-200 cursor-pointer disabled:cursor-not-allowed min-w-35
                            disabled:opacity-70 btn bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
                            disabled={isSubmitting}
                            >
                            {isSubmitting ? (
                                <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                <span>Logging in...</span>
                                </>
                            ) : (
                                'Entry'
                            )}
                        </button>
                    </div>
                </form>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg shadow-card border border-yellow-200">
                <p className="text-sm text-gray-600 text-center">
                    <strong className="block mb-1">⚠️ Safety:</strong>
                   You will need to login again after closing the site to protect your account.
                </p>
                </div>
            </div>
            </div>
        </>
    )
};