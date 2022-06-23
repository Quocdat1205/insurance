import type { NextPage } from "next";
import { Box, Button, Text } from "@chakra-ui/react";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import Header from "@components/utils/Header";
import useEffect from "react";
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
    // const signature = await contractCaller.current?.sign("hello");

    // console.log(signature);
    console.log(
      await contractCaller.current?.insuranceContract.contract.getAllInsurance()
    );
  };

  return (
    <Box>
      <Header title="Insurance" image="favicon.ico" />
      {account ? (
        <Box color="black" textAlign="center">
          <FormBuyInsuranceNew />
          {/* <History /> */}
        </Box>
      ) : (
        <Button onClick={() => activate("metaMask")}>Connect Wallet</Button>
      )}
    </Box>
  );
};

export default Home;
