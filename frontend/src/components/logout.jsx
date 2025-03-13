import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the session storage
        sessionStorage.removeItem("user");

        // Redirect to the login page
        navigate("/login");
    }, [navigate]);

    return null; // You can return null because the user will be immediately redirected
};

export default Logout;
