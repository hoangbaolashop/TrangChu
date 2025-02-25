import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import NotPermitted from "./NotPermitted";
import { useEffect } from "react";

const RoleBaseRoute = (props) => {
    const isAuthenticated = useSelector((state) => state.accountKH.isAuthenticated);
    const currentPath = window.location.pathname;
    console.log("currentPath: ", currentPath);    

    if (isAuthenticated && (currentPath === '/login-web' || currentPath === '/register-web')) {
        return <Navigate to="/" replace />;
    }

    if (isAuthenticated) {
        return <>{props.children}</>;
    }

    return <Navigate to='/login-web' replace />;
};

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.accountKH.isAuthenticated)
    console.log("isAuthenticated: ",isAuthenticated);        
    
    if (isAuthenticated === true) {
        return (
            <RoleBaseRoute>
                {props.children}
            </RoleBaseRoute>
        );
    } else {
        return <Navigate to='/login-web' replace />;
    }
}

export default ProtectedRoute;

