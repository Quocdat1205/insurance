import React, { useState, useEffect } from "react";
import { AuthType, PropType, LogIntype } from "@types";
import { logIn } from "@api";
import useWeb3Wallet from "@hooks/useWeb3Wallet";

const initValue: AuthType = {
  accessToken: "",
  handleLogIn: () => {},
};

export const AuthContext = React.createContext<AuthType>(initValue);

const AuthProvider = ({ children }: PropType) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const { account, contractCaller } = useWeb3Wallet();

  const handleLogIn = async () => {
    try {
      const signature = await contractCaller.current?.sign(
        "Sign this message!"
      );

      const data: LogIntype = {
        walletAddress: account as string,
        signature,
      };

      const response = await logIn(data);

      if (!response) {
        return false;
      } else {
        setAccessToken(response);
        localStorage.setItem("accessToken", response);
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken as string);
  }, [account]);

  const value = {
    accessToken,
    handleLogIn,
  };

  return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
};

export default AuthProvider;
