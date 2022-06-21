import React, { useState } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import { formBuyInsurance } from "@constants/formBuyInsurance";
import { getPriceEth, buyInsurance } from "@api";
import { BuyInsuranceType } from "@types";
import useAuth from "@hooks/useAuth";
import {
  formatPriceToWeiValue,
  formatDate,
  formatWeiValueToPrice,
} from "@helpers/handler";

const FormBuyInsurance = () => {
  const { account, contractCaller } = useWeb3Wallet();
  const { accessToken, handleLogIn } = useAuth();
  const [input, setInput] = useState<any>();

  const handleBuyInsurance = async () => {
    const { data } = await getPriceEth();

    const dataPost: BuyInsuranceType = {
      owner: account as string,
      current_price: data[0].h.toFixed(),
      liquidation_price: formatPriceToWeiValue(input.liquidation_price),
      deposit: formatWeiValueToPrice(input.liquidation_price),
      expired: formatDate(input.expired),
    };

    console.log(
      await contractCaller.current?.insuranceContract.contract.buyInsurance(
        dataPost.deposit,
        dataPost.owner,
        dataPost.deposit,
        dataPost.current_price,
        dataPost.liquidation_price,
        dataPost.expired,
        { value: dataPost.deposit }
      )
    );

    // const response = await buyInsurance(dataPost, accessToken);
  };

  return (
    <Box marginTop="1rem">
      <Box>
        <Text
          as="h1"
          color="rgb(58, 138, 132)"
          fontWeight="bold"
          fontSize="2rem"
        >
          <Button onClick={() => handleLogIn()}>Sign</Button>
          Insurance App
        </Text>
        {account && <Text>Your Address: {account}</Text>}
      </Box>
      <Box marginTop="1rem">
        <Text color="rgb(58, 138, 132)" fontWeight="bold" fontSize="1.5rem">
          Buy Insurance
        </Text>
        <Box w="40%" margin="auto">
          {formBuyInsurance.map((value) => {
            return (
              <Box key={value.id}>
                {value.options ? (
                  <>
                    {value.options.map((v) => {
                      return (
                        <FormControl key={v.label}>
                          <FormLabel htmlFor="coint">Select coin: </FormLabel>
                          <Select
                            placeholder="Select coin"
                            name="coin"
                            id="coin"
                          >
                            <option value={v.value}>{v.label}</option>
                          </Select>
                        </FormControl>
                      );
                    })}
                  </>
                ) : (
                  <FormControl margin="1rem 0" overflow="hidden">
                    <FormLabel htmlFor={value.name}>{value.label}</FormLabel>
                    <Input
                      name={value.name}
                      type={value.type}
                      id={value.name}
                      onChange={(e: any) =>
                        setInput({ ...input, [e.target.name]: e.target.value })
                      }
                    />
                  </FormControl>
                )}
              </Box>
            );
          })}
        </Box>
        <Box>
          <Button onClick={() => handleBuyInsurance()}>Buy Insurance</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FormBuyInsurance;
