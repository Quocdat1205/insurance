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
  etherToWei,
  weiToEther
} from "@helpers/handler";
import swal from "sweetalert";
import { parse } from "path";

const FormBuyInsurance = () => {
  const { account, contractCaller } = useWeb3Wallet();
  const { accessToken, handleLogIn } = useAuth();
  const [input, setInput] = useState<any>();

  const handleBuyInsurance = async () => {
    const { data } = await getPriceEth();
    //validate
    if (!validateValueInsurance(input.deposit)) return;
    if (!validateLiquidationPrice(input.liquidation_price)) return;
    if (!validateExpired(formatDate(input.expired))) return;
  
    const dataPost: BuyInsuranceType = {
      owner: account as string,
      deposit: formatPriceToWeiValue(input.deposit),
      current_price: data[0].h.toFixed(),
      liquidation_price: input.liquidation_price,
      expired: formatDate(input.expired),
    };

    const buy = await contractCaller.current?.insuranceContract.contract.buyInsurance(
      dataPost.owner,
      dataPost.deposit,
      dataPost.current_price,
      dataPost.liquidation_price,
      dataPost.expired,
      { value: dataPost.deposit }  
    )

    if (buy) {
      // const {data} = await buyInsurance(dataPost, accessToken);
      // if (data) {
      //   console.log("save data be success") 
      // } else {
      //   console.log("save data be err") 
      // }
      swal("Buy success!")
    } else {
      console.log("Error submitting transaction");
      swal("Error submitting transaction");
    }
    // const response = await buyInsurance(dataPost, accessToken);
  };

  const validateValueInsurance = (value: number) => {
    let status: Boolean | undefined = undefined;
    switch(true) {
      case (value > 100):
        status = false;
        swal("Value Insurance must be less than 100 ETH")        
        break;
      case (value <= 0):
        status = false;
        swal("Value Insurance must be more than number 0 ETH")       
        break;
      default:
        status = true
    }
    return status;
  }
  const validateLiquidationPrice = (value: number) => {
    let status: Boolean | undefined = undefined;
    switch(true) {
      case (value <= 0):
        status = false;
        swal("Value Insurance must be more than number 0 ETH")       
        break;
      default:
        status = true
    }
    return status;
  }
  const validateExpired = (value: number) => {
    let status: Boolean | undefined = undefined;
    let date = new Date()
    let date7 = date.setDate(date.getDate() + 7)/1000; 
    switch(true) {
      case (value <= date7):
        status = false;
        swal("Date expired must be 7 days from the current time")       
        break;
      default:
        status = true
    }
    return status;
  }

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
