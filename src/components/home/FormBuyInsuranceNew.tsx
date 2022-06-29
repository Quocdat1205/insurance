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
  const { account, contractCaller, getBalance } = useWeb3Wallet();
  const { accessToken, handleLogIn } = useAuth();
  const [input, setInput] = useState<any>();
  const [currentDay, setCurrentDay] = useState<string>();
  const [expiredDay, setExpiredDay] = useState<any>();
  const [currency, setCurrency] = useState<any>("ETH");
  const [coverValue, setCoverValue] = useState<any>(null);
  const [pClaim, setPClaim] = useState<any>();

  const [input2, setInput2] = useState<any>({
    cover_value: null,
    p_claim: null,
  });
  const [priceEth, setPriceEth] = useState<any>();
  const [balance, setBalance] = useState<any>();

  const [checkedItems, setCheckedItems] = useState<any>(false);

  useEffect(() => {
    setCurrentDay(new Date().toLocaleDateString());
    getCurrentPrice();
    getBalanceAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //buy insurance
  const handleBuyInsurance = async () => {
    if (!accessToken) return swal("Please sign metamask!");

    // const { data } = await getPriceEth();
    const price = await getCurrentPrice();
    const dataPost: BuyInsuranceType = {
      owner: account as string,
      current_price: price,
      liquidation_price: input.p_claim,
      deposit: formatPriceToWeiValue(input.cover_value),
      expired: expiredDay.toFixed(),
      id_transaction: input.hash,
      asset: "ETH",
      amount: input.amount,
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

    console.log(buy);
    setInput({
      ...input,
      hash: buy.hash,
    });
    if (buy) {
      console.log(input);
      try {
        await buyInsurance(dataPost, accessToken);
      } catch (error) {
        console.log(error);
      }

      swal(`Buy success 🎉🎉🎉
            Cover payout: ${pClaim} ${currency}
            Cover refund amount: ${coverValue * 0.95} ${currency}         
      `);
    } else {
      console.error("Error submitting transaction");

      swal("Error submitting transaction");
    }
  };

  const checkInputFullFill = async (e: any) => {
    const dataPost: PriceClaim = {
      deposit: e.cover_value ? e.cover_value : input2.cover_value,
      current_price: 1,
      liquidation_price: e.p_claim ? e.p_claim : input2.p_claim,
    };

    if (checkNullValueInObject(dataPost)) {
      setPClaim(
        await priceClaim(
          dataPost.deposit,
          dataPost.liquidation_price,
          accessToken
        )
      );
    } else {
      setPClaim(0);
    }
  };

  const getCurrentPrice = async () => {
    let price;
    try {
      const { data } = await getPriceEth();
      price = data[0].h.toFixed();
      if (data) {
        setPriceEth(data[0].h.toFixed());
      }
    } catch (error) {
      setPriceEth(1200);
      price = 1200;
    }
    return price;
  };

  const getBalanceAccount = async () => {
    const bal = await getBalance();
    setBalance(bal);
  };

  return (
    <Box marginTop="1rem">
      <Box marginBottom={"30px"}>
        <Text
          as="h1"
          color="rgb(58, 138, 132)"
          fontWeight="bold"
          fontSize="2rem"
        >
          Insurance App
        </Text>
        {account && <Text>Your Address: {account}</Text>}
        {/* <Button
          onClick={() => handleLogIn()}
          margin="0.5rem"
          background="#76c376"
        >
          Sign
        </Button> */}
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
          <Box w="80%">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {/* <Th></Th> */}
                    <Th>asset</Th>
                    <Th>amount</Th>
                    <Th>cover value ㅤ</Th>
                    <Th>p-claimㅤㅤㅤㅤㅤㅤ</Th>
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
                    {/* <Td>
                      <Checkbox colorScheme="green"></Checkbox>
                    </Td> */}
                    {/* COVER VALUE */}
                    {formBuyInsuranceNew.map((value) => {
                      return (
                        <Td key={value.id}>
                          {value.options ? (
                            <>
                              {value.options.map((v) => {
                                return (
                                  <Box key={v.label}>
                                    <FormControl key={v.label} marginTop="10px">
                                      {/* <FormLabel htmlFor="coint"></FormLabel> */}
                                      <Select
                                        w="80%"
                                        name="coin"
                                        id="coin"
                                        fontSize={"12px"}
                                        // onChange={() => {
                                        //   setTest(value);
                                        // }}
                                      >
                                        <option value={v.value}>
                                          {v.label}
                                        </option>
                                      </Select>
                                      <Box fontSize={"10px"} paddingTop="10px">
                                        Current price:{" "}
                                        {v.value === "eth" && ` ${priceEth}$`}
                                      </Box>
                                    </FormControl>
                                  </Box>
                                );
                              })}
                            </>
                          ) : (
                            <Box display={"flex"} alignItems="center">
                              <NumberInput
                                max={value.max}
                                min={value.min}
                                w="65%"
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
                                        {
                                          setInput2({
                                            ...input2,
                                            [value.name]: e,
                                          });
                                        }

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
                              <FormLabel
                                htmlFor="amount"
                                marginLeft={"10px"}
                                fontSize="12px"
                              >
                                {value.label === currency
                                  ? currency
                                  : value.label}
                              </FormLabel>
                            </Box>
                          )}

                          <Box marginTop={"10px"}>
                            {value.name === "cover_period" ? (
                              <Box fontSize={"10px"}>
                                {/* display day in cover period */}
                                {currentDay} -{" "}
                                {expiredDay
                                  ? new Date(
                                      expiredDay * 1000
                                    ).toLocaleDateString()
                                  : currentDay}
                              </Box>
                            ) : value.name === "p_claim" ? (
                              <Box fontSize={"10px"}>
                                Cover Payout:{" "}
                                {pClaim ? pClaim.toString().slice(0, 7) : 0} ETH
                              </Box>
                            ) : value.name === "asset" ? (
                              <Box fontSize={"10px"}></Box>
                            ) : (
                              <Box>ㅤ</Box>
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
            <Text
              color="rgb(58, 138, 132)"
              fontWeight="bold"
              fontSize="1.5rem"
              padding={"10px 0"}
            >
              Summary Order
            </Text>
            <Box>
              <Stat>
                <Box
                  display="flex"
                  alignItems="center"
                  margin="auto"
                  width="75%"
                  justifyContent="space-between"
                  borderBottom="1px solid #ddd9d9"
                  marginBottom="0.7rem"
                >
                  <StatLabel>Available:</StatLabel>
                  <StatNumber
                    color={"teal"}
                    fontWeight="bold"
                    fontSize={"18px"}
                  >
                    {balance && balance.toString().slice(0, 7)} ETH
                  </StatNumber>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  margin="auto"
                  width="75%"
                  justifyContent="space-between"
                  borderBottom="1px solid #ddd9d9"
                  marginBottom="0.7rem"
                >
                  <StatLabel>{`You'll pay:`}</StatLabel>
                  <StatNumber
                    color={"teal"}
                    fontWeight="bold"
                    fontSize={"18px"}
                  >
                    {coverValue ? coverValue : 0} ETH
                  </StatNumber>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  margin="auto"
                  width="75%"
                  justifyContent="space-between"
                  borderBottom="1px solid #ddd9d9"
                  marginBottom="0.7rem"
                >
                  <StatLabel>{`Cover refund amount:`}</StatLabel>
                  <StatNumber
                    color={"teal"}
                    fontWeight="bold"
                    fontSize={"18px"}
                  >
                    {coverValue ? coverValue * 0.95 : 0} ETH
                  </StatNumber>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  margin="auto"
                  width="75%"
                  justifyContent="space-between"
                  borderBottom="1px solid #ddd9d9"
                  marginBottom="0.7rem"
                >
                  <StatLabel>Total cover payout:</StatLabel>
                  <StatNumber color={"teal"} fontWeight="bold">
                    {pClaim ? pClaim.toString().slice(0, 7) : 0} ETH
                  </StatNumber>
                </Box>

                <Box>
                  <StatHelpText>
                    {currentDay} -{" "}
                    {expiredDay
                      ? new Date(expiredDay * 1000).toLocaleDateString()
                      : currentDay}
                  </StatHelpText>
                  <Checkbox
                    colorScheme="teal"
                    onChange={(e: any) => {
                      setCheckedItems(e.target.checked);
                      if (!checkedItems) {
                        handleLogIn();
                      }
                    }}
                  >
                    I agree to the terms and conditions.
                  </Checkbox>
                </Box>
              </Stat>

              <Button
                colorScheme="teal"
                size="md"
                margin={"20px 0"}
                isDisabled={!checkedItems}
                onClick={() => handleBuyInsurance()}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormBuyInsurance;
