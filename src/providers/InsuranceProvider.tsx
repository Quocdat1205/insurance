import React, { useEffect, useState } from "react";
import { getInsurancByAddress } from "@api";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import { InsuranceType, InsuranceProvider, PropType } from "@types";

const initValue: InsuranceProvider = {
  insurance: [],
};

export const InsuranceContext =
  React.createContext<InsuranceProvider>(initValue);

const InsuranceProvider = ({ children }: PropType) => {
  const { account } = useWeb3Wallet();
  const [list_insurance, setListInsurance] = useState<Array<InsuranceType>>();

  const getInsurance = async (walletAddress: string) => {
    const res = await getInsurancByAddress(walletAddress);

    setListInsurance(res);
  };

  useEffect(() => {
    getInsurance(account as string);
  }, [account]);

  const value: InsuranceProvider = {
    insurance: list_insurance,
  };

  return (
    <InsuranceContext.Provider value={value}>
      {children}
    </InsuranceContext.Provider>
  );
};

export default InsuranceProvider;
