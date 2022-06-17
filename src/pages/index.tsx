import type { NextPage } from "next";
import Header from "@components/utils/Header";
import { Box } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Box>
      <Header title="Insurance" image="favicon.ico" />
    </Box>
  );
};

export default Home;
