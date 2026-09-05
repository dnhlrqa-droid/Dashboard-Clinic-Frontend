import React, { useEffect } from 'react'
import {  Navigate, useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../store/authStore"
import Loading from './Loading';
import { ROUTES, ROUTES_ROLES } from '../utils/constants';
import { hasMessage } from '../utils/errorHelpers';



interface ProtectedRouteProps {
  requiredRole?: Array<'admin' | 'receptionist' | 'doctor'>;
  children: React.ReactNode;
}



export default function ProtectedRoute({requiredRole, children}: ProtectedRouteProps) {

    const {data: user, error, status} = useGetCurrentUserQuery();

    const navigate = useNavigate();
    useEffect(() => {
      const loadData  = async () => {
        if (error && 'status' in error) {

                const statusCode = error.status;
               
                if (!user || statusCode === 401 || !user.user.isActive) {
                  return navigate(ROUTES.LOGIN)
                }
                if (statusCode === 403) {
                  return navigate(ROUTES.DASHBOARD)
                }
                if (statusCode === 404) {
                  return navigate(ROUTES.LOGIN)
                }
                
              }
     };
     loadData();
  }, [navigate, error])

   if (status === "pending") {
  return <Loading />;
}

if (status === "rejected") {
  if (error && 'data' in error) {
    const err = error as { data?: unknown };
    
       if(hasMessage(err.data)){
           if("status" in err) {
             if(err.status === 401) {
                   return <Navigate to={ROUTES.LOGIN} replace />;
            }else if (error?.status === "FETCH_ERROR") {
                  return <Navigate to={ROUTES.ERROR_NETWORK} replace />;
              }
           }
        }
  }
}

  if (!user || !user.user || error ) {
    return <Navigate to={ROUTES.ERROR_NETWORK} replace />;
  }
  
  if (!user.user.isActive) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }


  if(user?.status && requiredRole && !requiredRole.includes(user.user.role)) {
      return <Navigate to={ROUTES_ROLES[user.user.role] || ROUTES.LOGIN} replace />
  }


  return <>{children}</>

}