import { createContext, ReactNode, useEffect, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { ethers, providers } from "ethers";
import { ContractCaller } from "@contract/index";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import {
  initializeConnector,
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";

import { CHAINS, getAddChainParameters } from "../helpers/handler";

export type Connectors = [
  MetaMask | WalletConnect | CoinbaseWallet,
  Web3ReactHooks
][];

export type ConnectorId = "metaMask" | "walletConnect" | "coinbaseWallet";

export type ConnectorInfo = {
  id: ConnectorId;
  name: string;
  connector: Connector;
};

export type ConnectorsData = Record<ConnectorId, ConnectorInfo>;

const getConnectorInfo = (connector: Connector): ConnectorInfo => {
  if (connector instanceof MetaMask) {
    return {
      id: "metaMask",
      name: "MetaMask",
      connector,
    };
  } else if (connector instanceof WalletConnect) {
    return {
      id: "walletConnect",
      name: "WalletConnect",
      connector,
    };
  } else {
    return {
      id: "coinbaseWallet",
      name: "Coinbase Wallet",
      connector,
    };
  }
};

const useWeb3WalletState = (
  connectorsData: Record<
    ConnectorId,
    { id: ConnectorId; name: string; connector: Connector }
  >
) => {
  const { connector, account, chainId, isActive, error, provider } =
    useWeb3React();
  const contractCaller = useRef<ContractCaller | null>(null);

  const activate = async (connectorId: ConnectorId, chainId?: number) => {
    const connector = connectorsData[connectorId].connector;
    connector.deactivate();
    connector instanceof WalletConnect
      ? await connector.activate(chainId)
      : await connector.activate(
          !chainId ? undefined : getAddChainParameters(chainId)
        );
  };

  const deactivate = () => {
    connector.deactivate();
  };

  useEffect(() => {
    connector.connectEagerly && connector.connectEagerly();
  }, [connector]);

  useEffect(() => {
    if (provider) {
      contractCaller.current = new ContractCaller(
        provider as providers.Web3Provider
      );
    }
  }, [provider]);

  const { data: balance } = useQuery(
    "balance",
    () =>
      provider!
        .getBalance(account!)
        .then((res) => parseFloat(ethers.utils.formatEther(res))),
    {
      enabled: !!provider && !!account,
      initialData: 0,
    }
  );

  const switchNetwork = async (chainId: number) => {
    activate(getConnectorInfo(connector).id, chainId);
  };

  const getBalance = async () => {
    const balance =
      provider &&
      (await provider!
        .getBalance(account!)
        .then((res) => parseFloat(ethers.utils.formatEther(res))));
    console.log(balance);
    return balance;
  };

  useEffect(() => {
    if (error) {
      if (error.message.includes("Disconnected from chain")) {
        activate(getConnectorInfo(connector).id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error?.message]);

  return {
    account: account?.toLowerCase(),
    switchNetwork,
    chain: chainId ? { ...CHAINS[chainId], id: chainId } : undefined,
    activate,
    deactivate,
    isActive,
    error,
    connector: getConnectorInfo(connector),
    provider,
    balance,
    contractCaller,
    getBalance,
  };
};

export const Web3WalletContext = createContext<ReturnType<
  typeof useWeb3WalletState
> | null>(null);

export interface Web3WalletProviderProps {
  children: ReactNode;
  config: {
    walletConnect: ConstructorParameters<typeof WalletConnect>["1"];
    coinbaseWallet: ConstructorParameters<typeof CoinbaseWallet>["1"];
  };
}

const Web3WalletStateProvider = ({
  children,
  connectorsData,
}: {
  children: ReactNode;
  connectorsData: ConnectorsData;
}) => {
  const state = useWeb3WalletState(connectorsData);

  return (
    <Web3WalletContext.Provider value={state}>
      {children}
    </Web3WalletContext.Provider>
  );
};

export const Web3WalletProvider = ({
  children,
  config,
}: Web3WalletProviderProps) => {
  const [metaMask, metaMaskHooks] = useMemo(
    () => initializeConnector<MetaMask>((actions) => new MetaMask(actions)),
    []
  );

  const [walletConnect, walletConnectHooks] = useMemo(
    () =>
      initializeConnector<WalletConnect>(
        (actions) =>
          new WalletConnect(actions, config.walletConnect, false, false),
        [1, 4]
      ),
    [config.walletConnect]
  );

  const [coinbaseWallet, coinbaseHooks] = useMemo(
    () =>
      initializeConnector<CoinbaseWallet>(
        (actions) => new CoinbaseWallet(actions, config.coinbaseWallet)
      ),
    [config.coinbaseWallet]
  );

  const connectors: [
    MetaMask | WalletConnect | CoinbaseWallet,
    Web3ReactHooks
  ][] = useMemo(
    () => [
      [metaMask, metaMaskHooks],
      [walletConnect, walletConnectHooks],
      [coinbaseWallet, coinbaseHooks],
    ],
    [
      metaMask,
      metaMaskHooks,
      walletConnect,
      walletConnectHooks,
      coinbaseWallet,
      coinbaseHooks,
    ]
  );

  const connectorsData = {
    metaMask: getConnectorInfo(metaMask),
    walletConnect: getConnectorInfo(walletConnect),
    coinbaseWallet: getConnectorInfo(coinbaseWallet),
  };

  return (
    <Web3ReactProvider connectors={connectors}>
      <Web3WalletStateProvider connectorsData={connectorsData}>
        {children}
      </Web3WalletStateProvider>
    </Web3ReactProvider>
  );
};
