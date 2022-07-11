import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import useAuth from "@hooks/useAuth";

import Link from "next/link";

const Header = () => {
  const { account } = useWeb3Wallet();

  return (
    <Box marginTop="1rem">
      <Box marginBottom={"2rem"} position="relative">
        <Text
          as="h1"
          color="rgb(58, 138, 132)"
          fontWeight="bold"
          fontSize="2rem"
        >
          Insurance App
        </Text>
        {account && <Text>Your Address: {account}</Text>}
        {/* <Link href="/trade-future">
          <Button position="absolute" right="0" bg="wheat">
            View History Trading
          </Button>
        </Link> */}
      </Box>
    </Box>
  );
};

export default Header;
