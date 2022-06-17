import React, { useState } from "react";
import { MetaMastProviderType, PropType } from "src/types";
import { useWeb3React } from "@web3-react/core";

const initValue: MetaMastProviderType = {
  account: "",
  handleConnectMetaMask: () => {},
};

export const MetaMaskContext =
  React.createContext<MetaMastProviderType>(initValue);

const MetaMaskProvider = ({ children }: PropType) => {
  const {
    account,
    activate,
    active,
    chainId,
    connector,
    deactivate,
    error,
    setError,
  } = useWeb3React();

  const handleConnectMetaMask = () => {};

  const handleDisConnectMetaMask = () => {};

  const value: MetaMastProviderType = {
    account,
    handleConnectMetaMask,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export default MetaMaskProvider;
