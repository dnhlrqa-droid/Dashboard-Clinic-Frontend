import { Navigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../store/authStore";
import Loading from "./Loading";
import { ROUTES, ROUTES_ROLES } from "../utils/constants";
import { isNetworkError, isUnauthorized } from "../utils/generators";



interface ProtectedRouteProps {
  requiredRole?: Array<'admin' | 'receptionist' | 'doctor'>;
  children: React.ReactNode;
}




export function UseAuthState({requiredRole, children}: ProtectedRouteProps) {
    const {data: user, error, status, isError} = useGetCurrentUserQuery();


    if (status === "pending") {
       return <Loading />;
    }


   if(isError) {
       if(isNetworkError(error)) return <Navigate to={ROUTES.ERROR_NETWORK} replace />;
       if(!user) return <Navigate to={ROUTES.ERROR_NETWORK} replace /> ;
       if(isUnauthorized(error)) return <Navigate to={ROUTES.LOGIN} replace />;
   }


    if(!user?.user.isActive) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if(user?.status && requiredRole && !requiredRole.includes(user.user.role)) {
          return <Navigate to={ROUTES_ROLES[user.user.role] || ROUTES.LOGIN} replace />
      }

    return (
        <>{children}</>
    )
};