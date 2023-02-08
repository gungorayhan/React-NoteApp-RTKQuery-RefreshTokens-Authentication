import {useLocation, Navigate,Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({allowedRoles})=>{
    const location=useLocation();
    const {roles}= useAuth();
// console.log(roles);
// console.log(allowedRoles);
    const content = (
        roles.some(role=>allowedRoles.includes(role))
        ? <Navigate to="/login" state={{from:location}} replace/>
        :<Outlet/>

    )

    return content
}

export default RequireAuth;