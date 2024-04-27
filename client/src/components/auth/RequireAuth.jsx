import { Navigate, Outlet, useLocation } from "react-router-dom"
import useUser from '../../hooks/useUser'

const RequireAuth = ({ allowedRoles }) => {
    const { user } = useUser();
    const location = useLocation();

    // here we can also check for the user token, and redirect if not set

    return (
        allowedRoles.includes(user.role)
        ?
        <Outlet/>
        : user 
            ?
            <Navigate state={{from: location}} replace to="/unauthorized"/>
            :
            <Navigate state={{from: location}} replace to="/login"/>
    )
}

export default RequireAuth