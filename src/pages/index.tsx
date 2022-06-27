import React, { useEffect } from "react";
import type { NextPage } from "next";
import { Box, Button } from "@chakra-ui/react";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import Header from "@components/utils/Header";
import FormBuyInsuranceNew from "@components/home/FormBuyInsuranceNew";
import History from "@components/home/History";

const Home: NextPage = () => {
  const {
    account,
    activate,
    deactivate,
    chain,
    switchNetwork,
    contractCaller,
  } = useWeb3Wallet();

  const handleSignMessage = async () => {
    console.log(
      await contractCaller.current?.insuranceContract.contract.getAllInsurance()
    );
  };

  useEffect(() => {
    handleSignMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Header title="Insurance" image="favicon.ico" />
      {account ? (
        <Box color="black" textAlign="center">
          <FormBuyInsuranceNew />

          <History />
        </Box>
      ) : (
        <Button onClick={() => activate("metaMask")}>Connect Wallet</Button>
      )}
    </Box>
  );
};

export default Home;
