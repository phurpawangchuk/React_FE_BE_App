import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

// const useAuth = () => {
//     const auth = useContext(AuthContext);
//     useDebugValue(auth, auth => auth && auth.username ? "Logged In" : "Logged Out");
//     return auth;
// };

const useAuth = () => {
    const { auth } = useContext(AuthContext);

    console.log("auth.token==", auth.token);

    const { token, username, userId } = auth || {}; // Destructure token, username, userId
    useDebugValue(auth, auth => auth ? "Authenticated" : "Not Authenticated");
    return { token, username, userId }; // Return token along with other authentication information
}

export default useAuth;