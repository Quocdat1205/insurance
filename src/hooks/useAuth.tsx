import { useContext } from "react";
import { AuthContext } from "src/providers/AuthProvider";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context must be used within a AuthContextProvider");
  }

  return context;
};

export default useAuth;
