import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";

import useWeb3Wallet from "@hooks/useWeb3Wallet";
import {
  formBuyInsurance,
  formBuyInsuranceNew,
} from "@constants/formBuyInsurance";
import { buyInsurance, getPriceEth, getPriceClaim } from "@api";
import { BuyInsuranceType, PriceClaim } from "@types";
import useAuth from "@hooks/useAuth";
import { formatPriceToWeiValue, formatDate } from "@helpers/handler";
import swal from "sweetalert";

const FormBuyInsurance = () => {
  const { account, contractCaller } = useWeb3Wallet();
  const { accessToken, handleLogIn } = useAuth();
  const [input, setInput] = useState<any>();
  const [currentDay, setCurrentDay] = useState<any>();
  const [expiredDay, setExpiredDay] = useState<any>();
  const [currency, setCurrency] = useState<any>("DAI");

  const [coverValue, setCoverValue] = useState<any>(null);
  const [pClaim, setPClaim] = useState<any>(null);

  const [price, setPrice] = useState<any>();

  const [input2, setInput2] = useState<any>({
    cover_value: null,
    p_claim: null,
  });

  //buy insurance
  const handleBuyInsurance = async () => {
    const { data } = await getPriceEth();

    if (!accessToken) return swal("Please sign metamask!");

    const dataPost: BuyInsuranceType = {
      owner: account as string,
      deposit: formatPriceToWeiValue(input.cover_value),
      current_price: data[0].h.toFixed(),
      liquidation_price: input.p_claim,
      expired: expiredDay.toFixed(),
    };

    const buy =
      await contractCaller.current?.insuranceContract.contract.buyInsurance(
        dataPost.owner,
        dataPost.deposit,
        dataPost.current_price,
        dataPost.liquidation_price,
        dataPost.expired,
        { value: dataPost.deposit }
      );

    if (buy) {
      await buyInsurance(dataPost, accessToken);

      swal("Buy success!");
    } else {
      console.log("Error submitting transaction");
      swal("Error submitting transaction");
    }
  };

  //get date to display in cover period
  const getDate = () => {
    const date = new Date();
    setCurrentDay(date.toLocaleDateString());
    // new Date(date.setDate(date.getDate() + 7));
    // return date.toLocaleDateString();
  };
  //get expired date to display in cover period
  const getExpiredDay = (value: number) => {
    const date1 = new Date();
    let newDate = new Date(date1.setDate(date1.getDate() + value));
    return newDate.getTime() / 1000;
  };
  //api get p-claim
  const priceClaim = async () => {
    const { data } = await getPriceEth();

    const dataPost: PriceClaim = {
      // deposit: input.cover_value,
      deposit: 1,
      current_price: data[0].h.toFixed(),
      liquidation_price: input.p_claim,
    };
    const price = await getPriceClaim(dataPost, accessToken);
    console.log(price);
    setPrice(price);
  };
  //event check when cover value or p claim change
  const check = () => {
    const dataPost: PriceClaim = {
      // deposit: input.cover_value,
      deposit: input2.cover_value,
      current_price: 1,
      liquidation_price: input2.p_claim,
    };
    if (dataPost.deposit !== null && dataPost.liquidation_price !== null) {
      console.log(`dataPost.deposit: ${dataPost.deposit}`);
      console.log(`dataPost.liquidation_price: ${dataPost.liquidation_price}`);
      priceClaim();
    }
    // console.log(`coverValue: ${coverValue}`);
    // console.log(`pClaim: ${pClaim}`);
  };

  useEffect(() => {
    getDate();
    console.log(accessToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box marginTop="1rem">
      <Box>
        <Text
          as="h1"
          color="rgb(58, 138, 132)"
          fontWeight="bold"
          fontSize="2rem"
        >
          Insurance App
        </Text>
        {account && <Text>Your Address: {account}</Text>}
        <Button
          onClick={() => handleLogIn()}
          margin="0.5rem"
          background="#76c376"
        >
          Sign
        </Button>
      </Box>
      <Box marginTop="1rem">
        <Text color="rgb(58, 138, 132)" fontWeight="bold" fontSize="1.5rem">
          Buy Insurance
        </Text>
        <FormControl display={"flex"} alignItems={"center"}>
          <FormLabel htmlFor="currency">Cover Currency</FormLabel>
          <Select w="10%" id="currency" defaultValue={currency}>
            <option value={currency}>{currency}</option>
          </Select>
        </FormControl>
        <Box
          w="100%"
          margin="auto"
          display={"flex"}
          justifyContent="space-between"
        >
          <Box w="70%">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    {/* <Th>asset</Th> */}
                    <Th>cover value</Th>
                    <Th>p-claim</Th>
                    <Th>cover period</Th>
                    <Th isNumeric>
                      <IconButton
                        aria-label="Call Segun"
                        size={"xs"}
                        icon={<AddIcon />}
                      />
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      <Checkbox colorScheme="green"></Checkbox>
                    </Td>
                    {/* COVER VALUE */}
                    {formBuyInsuranceNew.map((value) => {
                      return (
                        <Td key={value.id}>
                          {value.options ? (
                            <>
                              {value.options.map((v) => {
                                return (
                                  <FormControl key={v.label}>
                                    <FormLabel htmlFor="coint"></FormLabel>
                                    <Select
                                      w={"100%"}
                                      // placeholder="Select coin"
                                      name="coin"
                                      id="coin"
                                      fontSize={"12px"}
                                    >
                                      <option value={v.value}>{v.label}</option>
                                    </Select>
                                  </FormControl>
                                );
                              })}
                            </>
                          ) : (
                            <Box display={"flex"} alignItems="center">
                              <NumberInput
                                max={value.max}
                                min={value.min}
                                w="50%"
                                className={`${value.name}`}
                                onChange={
                                  value.isDay
                                    ? (e) => {
                                        setExpiredDay(getExpiredDay(Number(e)));
                                        setInput({
                                          ...input,
                                          [value.name]: e,
                                        });
                                        check();
                                      }
                                    : (e) => {
                                        setInput({
                                          ...input,
                                          [value.name]: e,
                                        });
                                        setInput2({
                                          ...input2,
                                          [value.name]: e,
                                        });
                                        {
                                          value.name === "cover_value"
                                            ? setCoverValue(e)
                                            : setPClaim(e);
                                        }
                                        check();
                                      }
                                }
                              >
                                <NumberInputField id="amount" placeholder="0" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper fontSize={"7px"} />
                                  <NumberDecrementStepper fontSize={"7px"} />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormLabel htmlFor="amount" marginLeft={"10px"}>
                                {value.label === currency
                                  ? currency
                                  : value.label}
                              </FormLabel>
                            </Box>
                          )}

                          <Box marginTop={"10px"}>
                            {value.name === "cover_period" ? (
                              <Box fontSize={"12px"}>
                                {/* display day in cover period */}
                                {currentDay} -{" "}
                                {expiredDay
                                  ? new Date(
                                      expiredDay * 1000
                                    ).toLocaleDateString()
                                  : currentDay}
                              </Box>
                            ) : value.name === "p_claim" ? (
                              <Box fontSize={"12px"}>
                                {/* display Expected value */}
                                Expected value: {price}
                              </Box>
                            ) : (
                              <Box>not ok</Box>
                            )}
                          </Box>
                        </Td>
                      );
                    })}

                    {/* ADD ICON */}
                    <Td isNumeric>
                      <IconButton
                        aria-label="Call Segun"
                        size={"xs"}
                        icon={<CloseIcon />}
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Box
            w="30%"
            marginLeft={"20px"}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Text color="rgb(58, 138, 132)" fontWeight="bold" fontSize="1.5rem">
              Summary Order
            </Text>
            <Box>
              <Stat>
                <StatLabel>Price Claim</StatLabel>
                <StatNumber>0 {currency}</StatNumber>
                <StatHelpText>
                  {currentDay} -{" "}
                  {expiredDay
                    ? new Date(expiredDay * 1000).toLocaleDateString()
                    : currentDay}
                </StatHelpText>
              </Stat>
              <Button
                colorScheme="teal"
                size="md"
                margin={"20px 0"}
                onClick={() => handleBuyInsurance()}
              >
                Confirm
              </Button>
              {/* <Button
                colorScheme="teal"
                size="md"
                margin={"20px 0"}
                onClick={() => priceClaim()}
              >
                Test
              </Button> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormBuyInsurance;
