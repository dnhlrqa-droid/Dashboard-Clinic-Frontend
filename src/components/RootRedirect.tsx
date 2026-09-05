import { Navigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../store/authStore";
import { ROUTES, ROUTES_ROLES } from "../utils/constants";
import Loading from "./Loading";




export function RootRedirect() {
    const { data: user, status } = useGetCurrentUserQuery();

    if (status === "pending") {
        return <Loading />;
    }

    if (user) {
        return <Navigate to={ROUTES_ROLES[user.user.role]} replace />;
    }

    return <Navigate to={ROUTES.LOGIN} replace />;
}