import React from "react";
import { Box, Image } from "@chakra-ui/react";
import useWeb3Wallet from "@hooks/useWeb3Wallet";

const ConnectMetamask = () => {
  const { activate } = useWeb3Wallet();

  return (
    <Box
      textAlign="center"
      margin="auto"
      border="1px solid rgba(195, 195, 195, 0.14)"
      padding="1rem"
      cursor="pointer"
      onClick={() => activate("metaMask")}
    >
      <Image
        src="/images/metamask.svg/"
        alt="Metamask icon"
        w="20%"
        margin="auto"
      />
      <Box color="rgb(12, 12, 13)" fontWeight="700" margin="0.5rem">
        MetaMask
      </Box>
      <Box color="rgb(169, 169, 188)">Connect to your MetaMask wallet!</Box>
    </Box>
  );
};

export default ConnectMetamask;
