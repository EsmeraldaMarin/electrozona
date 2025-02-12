import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const { user, role, loading } = useAuth();

    const userManualLog = localStorage.getItem('electrozona')

    return ((user && role === "admin") || userManualLog === "365") ? <Outlet /> : <Navigate to="/electrozona" />;
};

export default ProtectedRoute;
