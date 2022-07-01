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
import { formBuyInsuranceNew } from "@constants/formBuyInsurance";
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
  const [coverValue, setCoverValue] = useState<any>(null);
  const [coverPayout, setCoverPayout] = useState<any>();
  const [input2, setInput2] = useState<any>({
    cover_value: null,
    p_claim: null,
  });
  const [priceEth, setPriceEth] = useState<any>();
  const [percent, setPercent] = useState<any>();
  const [amount, setAmount] = useState<any>();

  useEffect(() => {
    setCurrentDay(formatDate(formatDateToTimestamp(new Date())));
    const price = async () => {
      const p = await getCurrentPrice();
      setPriceEth(p);
    };
    price();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkInputFullFill = async (e: any) => {
    try {
      const dataPost: PriceClaim = {
        deposit: e.cover_value ? e.cover_value : input2.cover_value,
        current_price: 1,
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

  return (
    <Box marginTop="1rem">
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
                    {formBuyInsuranceNew.map((value) => {
                      return (
                        <Td key={value.id}>
                          {value.options ? (
                            <>
                              {value.options.map((v) => {
                                return (
                                  <Box key={v.label}>
                                    <FormControl key={v.label} marginTop="10px">
                                      <Select
                                        w="80%"
                                        name="coin"
                                        id="coin"
                                        fontSize={"12px"}
                                      >
                                        <option value={v.value}>
                                          {v.label}
                                        </option>
                                      </Select>
                                      <Box fontSize={"10px"} paddingTop="10px">
                                        Current price:{" "}
                                        {v.value === "eth" &&
                                          ` ${priceEth && priceEth}$`}
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
                                w="75%"
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
                                            : setCoverPayout(e);
                                        }
                                        {
                                          value.name === "amount";
                                          setAmount(e);
                                        }
                                        {
                                          value.name === "percent";
                                          setPercent(e);
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
                                {currentDay}
                                <br />
                                {expiredDay
                                  ? formatDate(expiredDay)
                                  : currentDay}
                              </Box>
                            ) : value.name === "p_claim" ? (
                              <Box fontSize={"10px"}>
                                Cover Payout:{" "}
                                {coverPayout
                                  ? coverPayout.toString().slice(0, 7)
                                  : 0}{" "}
                                ETH
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
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Summary
            input={input}
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
