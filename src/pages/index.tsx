import type { NextPage } from "next";
import { Box, Button, Text } from "@chakra-ui/react";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import Header from "@components/utils/Header";

const Home: NextPage = () => {
  const { account, activate, deactivate, chain, switchNetwork } =
    useWeb3Wallet();
  console.log(chain);

  return (
    <Box>
      <Header title="Insurance" image="favicon.ico" />
      {account ? (
        <>
          <Text>Connect successfully</Text>
          <Button onClick={() => deactivate()}>Disconnect</Button>
          <Button onClick={() => switchNetwork(42)}>Switch Network</Button>
        </>
      ) : (
        <Button onClick={() => activate("metaMask")}>Connect Wallet</Button>
      )}
    </Box>
  );
};

export default Home;
