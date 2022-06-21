import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import { PropType } from "@types";
import ConnectMetamask from "./ConnectMetamask";
import useWeb3Wallet from "@hooks/useWeb3Wallet";

const Layout = ({ children }: PropType) => {
  const { account } = useWeb3Wallet();

  return (
    <Flex
      h="100vh"
      w="full"
      direction="column"
      overflow="hidden"
      color="whiteAlpha.900"
    >
      {account ? (
        <Flex overflow="hidden" flex={1} overflowY="scroll" display="flex">
          <Box width="100%" boxSizing="border-box">
            <Box width="95%" margin="auto">
              {children}
            </Box>
          </Box>
        </Flex>
      ) : (
        <Flex flex={1} bg="background.secondary" w="full" justify="center">
          <ConnectMetamask />
        </Flex>
      )}
    </Flex>
  );
};

export default Layout;
