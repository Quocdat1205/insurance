import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Select,
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
} from "@chakra-ui/react";
import { PriceClaim } from "@types";
import useAuth from "@hooks/useAuth";
import { formatDate, formatDateToTimestamp } from "@helpers/format";
import {
  getExpiredDay,
  priceClaim,
  checkNullValueInObject,
  getCurrentPrice,
} from "@helpers/handler";
import Summary from "./Summary";
import { list_head_formbuy } from "@constants/list_head_formbuy";

const BuyInsurance = () => {
  const { accessToken } = useAuth();
  const [input, setInput] = useState<any>({});
  const [currentDay, setCurrentDay] = useState<any>();
  const [expiredDay, setExpiredDay] = useState<any>();
  const [currency, setCurrency] = useState<any>("ETH");

  const [coverPayout, setCoverPayout] = useState<any>();
  const [input2, setInput2] = useState<any>({
    cover_value: null,
    p_claim: null,
  });
  const [priceEth, setPriceEth] = useState<any>();
  const [validateForAmount, setValidateForAmount] = useState<any>();

  const checkInputFullFill = async (e: any) => {
    try {
      const dataPost: PriceClaim = {
        deposit: e.cover_value ? e.cover_value : input2.cover_value,
        current_price: 1, //not use
        liquidation_price: e.p_claim ? e.p_claim : input2.p_claim,
      };

      if (checkNullValueInObject(dataPost)) {
        setCoverPayout(
          await priceClaim(
            dataPost.deposit,
            dataPost.liquidation_price,
            accessToken
          )
        );
      } else {
        setCoverPayout(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleValidateAmount = () => {
    setValidateForAmount(`Amount not empty`);
  };

  useEffect(() => {
    setCurrentDay(formatDate(formatDateToTimestamp(new Date())));
    const price = async () => {
      const p = await getCurrentPrice();
      setPriceEth(p);
    };
    price();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box marginTop="1rem">
      <Box marginTop="1rem">
        <Text color="rgb(58, 138, 132)" fontWeight="bold" fontSize="1.5rem">
          Buy Insurance
        </Text>
        <FormControl display={"flex"} alignItems={"center"}>
          <FormLabel htmlFor="currency">Cover Unit</FormLabel>
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
          <Box w="100%">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {list_head_formbuy.map((value, index) => {
                      return <Th key={index}>{value.label}</Th>;
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td className="asset">
                      <Box>
                        <FormControl>
                          <Select
                            w="80%"
                            name="coin"
                            id="coin"
                            fontSize={"12px"}
                          >
                            <option>ETH</option>
                          </Select>
                          <Box fontSize={"10px"} marginTop="10px">
                            Current price: {priceEth && priceEth}$
                          </Box>
                          <Box>ㅤ</Box>
                        </FormControl>
                      </Box>
                    </Td>
                    <Td className="amount" w={"15%"}>
                      <NumberInput
                        max={10000}
                        min={0.1}
                        w="75%"
                        onChange={(e: any) => {
                          setInput({
                            ...input,
                            amount: e,
                          });
                          setValidateForAmount(null);
                        }}
                      >
                        <NumberInputField id="amount" placeholder="0" />
                        <NumberInputStepper>
                          <NumberIncrementStepper fontSize={"7px"} />
                          <NumberDecrementStepper fontSize={"7px"} />
                        </NumberInputStepper>
                      </NumberInput>
                      <Box>
                        {validateForAmount ? (
                          <Box fontSize={"10px"} marginTop="10px" color={"red"}>
                            {validateForAmount}
                          </Box>
                        ) : (
                          <Box marginTop="10px">ㅤ</Box>
                        )}
                      </Box>
                      <Box>ㅤ</Box>
                    </Td>

                    <Td className="percent">
                      <NumberInput
                        max={100}
                        min={0.1}
                        w="75%"
                        value={
                          input.cover_value && input.amount
                            ? Number(
                                (input.cover_value / input.amount) * 100
                              ).toFixed(1)
                            : input.percent
                        }
                        onChange={(e: any) => {
                          setInput({
                            ...input,
                            percent: e,
                            cover_value: 0,
                          });
                          if (e && input.amount) {
                            setInput2({
                              ...input2,
                              cover_value: Number(
                                (input.amount * e) / 100
                              ).toFixed(3),
                            });
                          }
                          if (!input.amount) {
                            handleValidateAmount();
                          }
                          checkInputFullFill({
                            cover_value: input2.cover_value,
                          });
                        }}
                      >
                        <NumberInputField id="amount" placeholder="0" />
                        <NumberInputStepper
                          display={"flex"}
                          alignItems={"start"}
                          justifyContent="center"
                        >
                          %
                        </NumberInputStepper>
                      </NumberInput>
                      <Box marginTop="10px">ㅤ</Box>
                      <Box>ㅤ</Box>
                    </Td>

                    <Td className="cover_value" w={"18%"}>
                      <Box display={"flex"} alignItems="center">
                        <NumberInput
                          max={10000}
                          min={0.0001}
                          w="75%"
                          value={
                            input.percent && input.amount
                              ? Number(
                                  (input.amount * input.percent) / 100
                                ).toFixed(3)
                              : input.cover_value
                          }
                          onChange={(e: any) => {
                            setInput({
                              ...input,
                              cover_value: e,
                              percent: 0,
                            });
                            setInput2({
                              ...input2,
                              cover_value: e,
                            });
                            if (!input.amount) {
                              handleValidateAmount();
                            }
                            checkInputFullFill({ cover_value: e });
                          }}
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
                          {currency}
                        </FormLabel>
                      </Box>
                      <Box marginTop="10px">ㅤ</Box>
                      <Box>ㅤ</Box>
                    </Td>

                    <Td className="cover_price">
                      <Box display={"flex"} alignItems="center">
                        <NumberInput
                          max={10000}
                          min={0.0001}
                          w="75%"
                          onChange={(e: any) => {
                            setInput({
                              ...input,
                              p_claim: e,
                            });
                            setInput2({
                              ...input2,
                              p_claim: e,
                            });

                            checkInputFullFill({ p_claim: e });
                          }}
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
                          USDT
                        </FormLabel>
                      </Box>
                      <Box fontSize={"10px"} paddingTop="10px">
                        Cover Payout:{" "}
                        <Box fontWeight={"bold"} fontSize={"12px"}>
                          {coverPayout ? coverPayout.toString().slice(0, 7) : 0}{" "}
                          ETH
                        </Box>
                      </Box>
                    </Td>

                    <Td className="cover_period" w={"18%"}>
                      <Box display={"flex"} alignItems="center">
                        <NumberInput
                          max={365}
                          min={7}
                          w="75%"
                          onChange={(e: any) => {
                            setInput({
                              ...input,
                              cover_period: e,
                            });

                            setExpiredDay(getExpiredDay(Number(e)));
                            checkInputFullFill({ cover_period: e });
                          }}
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
                          Days
                        </FormLabel>
                      </Box>
                      <Box fontSize={"10px"} paddingTop="10px">
                        {currentDay}
                        <br />
                        {expiredDay ? formatDate(expiredDay) : currentDay}
                      </Box>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Summary
            input={input}
            input2={input2}
            expiredDay={expiredDay}
            coverPayout={coverPayout}
            currency={currency}
            currentDay={currentDay}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BuyInsurance;
