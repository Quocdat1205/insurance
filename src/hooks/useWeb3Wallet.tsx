import { useContext } from "react";
import { Web3WalletContext } from "src/providers/MetaMaskProvider";

const useWeb3Wallet = () => {
  const context = useContext(Web3WalletContext);

  if (!context) {
    throw new Error("useWeb3Wallet must be used within a Web3WalletProvider");
  }

  return context;
};

export default useWeb3Wallet;
