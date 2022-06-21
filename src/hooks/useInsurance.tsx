import { useContext } from "react";
import { InsuranceContext } from "src/providers/InsuranceProvider";

const useInsurance = () => {
  const context = useContext(InsuranceContext);

  if (!context) {
    throw new Error("Auth context must be used within a AuthContextProvider");
  }

  return context;
};

export default useInsurance;
