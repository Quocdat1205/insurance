import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
import { formBuyInsuranceNew } from "@constants/formBuyInsurance";
import { buyInsurance, getPriceEth, getPriceClaim } from "@api";
import { BuyInsuranceType, PriceClaim } from "@types";
import useAuth from "@hooks/useAuth";
import { formatPriceToWeiValue } from "@helpers/format";
import swal from "sweetalert";
import {
  getExpiredDay,
  priceClaim,
  checkNullValueInObject,
} from "@helpers/handler";

const FormBuyInsurance = () => {
  const { account, contractCaller } = useWeb3Wallet();
  const { accessToken, handleLogIn } = useAuth();
  const [input, setInput] = useState<any>();
  const [currentDay, setCurrentDay] = useState<string>();
  const [expiredDay, setExpiredDay] = useState<any>();
  const [currency, setCurrency] = useState<any>("DAI");
  const [coverValue, setCoverValue] = useState<any>(null);
  const [pClaim, setPClaim] = useState<any>(null);
  const [price, setPrice] = useState<any>();
  const [input2, setInput2] = useState<any>({
    cover_value: null,
    p_claim: null,
  });

  useEffect(() => {
    setCurrentDay(new Date().toLocaleDateString());
  }, []);

  //buy insurance
  const handleBuyInsurance = async () => {
    if (!accessToken) return swal("Please sign metamask!");

    const { data } = await getPriceEth();
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
      console.error("Error submitting transaction");

      swal("Error submitting transaction");
    }
  };

  const checkInputFullFill = (e: any) => {
    const dataPost: PriceClaim = {
      deposit: input2.cover_value,
      current_price: 1,
      liquidation_price: e.p_claim ? e.p_claim : input2.p_claim,
    };

    if (checkNullValueInObject(dataPost)) {
      setPClaim(
        priceClaim(dataPost.deposit, dataPost.liquidation_price, accessToken)
      );
    }
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
                                    ? (e: any) => {
                                        setExpiredDay(getExpiredDay(Number(e)));
                                        setInput({
                                          ...input,
                                          [value.name]: e,
                                        });
                                        checkInputFullFill({ [value.name]: e });
                                      }
                                    : (e: any) => {
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
                                        checkInputFullFill({ [value.name]: e });
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
