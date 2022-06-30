import React from "react";
import { Box, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";

const Overview = () => {
  return (
    <Box textAlign="center" position="relative">
      <Heading color="black">Order History</Heading>
      <Link href="/">
        <Button position="absolute" top="0" right="0" color="black" bg="wheat">
          Go Back Home
        </Button>
      </Link>
    </Box>
  );
};

export default Overview;
