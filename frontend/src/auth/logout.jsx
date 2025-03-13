

const logout = () => {
    // Clear token from localStorage or cookies
    localStorage.removeItem("token");  // Assuming you're using localStorage
    // Or if using cookies
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    // Call the backend to invalidate the session if needed
    fetch("/logout", {
        method: "POST",
        credentials: "include", // For cookies, include credentials
    })
        .then((response) => response.json())
        .then((data) => {
            // Redirect user to the login page after logout
            window.location.href = "/login";  // Or use React Router to redirect
        })
        .catch((error) => {
            console.error("Error during logout:", error);
        });
};

export default Logout;