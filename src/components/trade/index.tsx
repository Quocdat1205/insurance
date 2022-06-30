import React from "react";
import { Box } from "@chakra-ui/react";
import Overview from "./Overview";
import ListOrder from "./ListOrder";

const TradingFutures = () => {
  return (
    <Box margin="1rem">
      <Overview />
      <ListOrder />
    </Box>
  );
};

export default TradingFutures;
