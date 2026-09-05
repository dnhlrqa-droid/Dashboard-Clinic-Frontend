import { Navigate, Outlet } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../store/authStore';
import { ROUTES_ROLES } from '../utils/constants';



export default function PublicRoute() {
    const { data: user } = useGetCurrentUserQuery();




    if(user) {
        return <Navigate to={ROUTES_ROLES[user?.user.role]} replace />
    }

    return <> <Outlet /> </>
};