import React from "react";
import { Box } from "@chakra-ui/react";
import Header from "@components/utils/Header";
import TradingFutures from "@components/trade";

const TradeFutures = () => {
  return (
    <Box>
      <Header title="Trading futures" />
      <TradingFutures />
    </Box>
  );
};

export default TradeFutures;
