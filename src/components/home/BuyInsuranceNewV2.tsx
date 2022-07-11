import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
} from "@chakra-ui/react";
import { PriceClaim } from "@types";
import useAuth from "@hooks/useAuth";
import { formatDate, formatDateToTimestamp } from "@helpers/format";
import {
  getExpiredDay,
  priceClaim,
  checkNullValueInObject,
  getCurrentPrice,
  getCurrentPriceToken,
} from "@helpers/handler";

import SummaryNew from "./SummaryNew";

import { list_assets } from "@constants/list_assets";

const BuyInsuranceNewV2 = () => {
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
  const [currentPrice, setCurrentPrice] = useState<any>({});
  const [symbol, setSymbol] = useState<any>("assets");
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
            accessToken,
            symbol,
            currentPrice
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

  const handleSymbol = (e: any) => {
    setSymbol(e.target.value);
  };

  useEffect(() => {
    const price = async () => {
      const p = await getCurrentPrice();
      setCurrentPrice(p);
    };
    price();
    checkInputFullFill(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);
  useEffect(() => {
    setCurrentDay(formatDate(formatDateToTimestamp(new Date())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box marginTop="1rem">
      <Text color="rgb(58, 138, 132)" fontWeight="bold" fontSize="1.5rem">
        Buy Insurance
      </Text>
      <Box marginTop="1rem" display={"flex"} justifyContent="space-between">
        <Box
          className="test"
          w={"60%"}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          padding={"20px"}
        >
          <Box className="tab1" display={"flex"} justifyContent="space-between">
            <FormControl margin={"10px"} w="200px">
              <FormLabel htmlFor="currency"></FormLabel>
              <Select id="currency">
                <option defaultValue={"init"}>Cover Unit</option>
                <option value={currency}>{currency}</option>
              </Select>
            </FormControl>

            <FormControl margin={"10px"} w="200px">
              <FormLabel htmlFor="assets"></FormLabel>
              <Select
                name="assets"
                id="assets"
                fontSize={"16px"}
                onChange={(e: any) => {
                  handleSymbol(e);
                  checkInputFullFill(e);
                }}
                placeholder="Assets"
              >
                {list_assets.map((val, index) => {
                  return (
                    <option key={val.id} value={val.symbol}>
                      {val.name}
                    </option>
                  );
                })}

                {/* <option value={"BTCUSDT"}>BTC</option> */}
              </Select>
              <Box fontSize={"12px"} marginTop="10px" textAlign={"start"}>
                Current price: $
                {getCurrentPriceToken(currentPrice, symbol)
                  .toString()
                  .slice(0, 6) &&
                  getCurrentPriceToken(currentPrice, symbol)
                    .toString()
                    .slice(0, 6)}
              </Box>
            </FormControl>
            <FormControl margin={"10px"} w="200px"></FormControl>
          </Box>

          {/* tab 2 */}
          <Box className="tab2" display={"flex"} justifyContent="space-between">
            <FormControl margin={"10px"} w="200px">
              <FormLabel htmlFor="currency">Amount</FormLabel>
              <NumberInput
                placeholder="0"
                max={10000}
                min={0.1}
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
            </FormControl>
            <FormControl className="percentage" margin={"10px"} w="200px">
              <FormLabel htmlFor="">Percentage</FormLabel>
              <InputGroup>
                <NumberInput
                  max={100}
                  min={0.1}
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
                        cover_value: Number((input.amount * e) / 100).toFixed(
                          3
                        ),
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
                    justifyContent="center"
                    alignItems={"center"}
                    marginRight="15px"
                  >
                    %
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            </FormControl>
            <FormControl className="escrow" margin={"10px"} w="200px">
              <FormLabel htmlFor="">Escrow</FormLabel>
              <NumberInput
                max={10000}
                min={0.0001}
                value={
                  input.percent && input.amount
                    ? Number((input.amount * input.percent) / 100).toFixed(3)
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
                <NumberInputStepper
                  display={"flex"}
                  justifyContent="center"
                  alignItems={"center"}
                  marginRight="20px"
                >
                  {currency}
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Box>
          <Box className="tab3" display={"flex"} justifyContent="space-between">
            <FormControl margin={"10px"} w="200px">
              <Box>
                <FormLabel htmlFor="">Cover Price</FormLabel>
                <NumberInput
                  max={10000}
                  min={0.0001}
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
                  <NumberInputStepper
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"center"}
                    marginRight="20px"
                  >
                    USDT
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </FormControl>
            <FormControl margin={"10px"} w="200px">
              <Box>
                <FormLabel htmlFor="">Cover Period</FormLabel>
                <NumberInput
                  max={365}
                  min={7}
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
                  <NumberInputStepper
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"center"}
                    marginRight="20px"
                  >
                    Days
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </FormControl>
            <FormControl margin={"10px"} w="200px"></FormControl>
          </Box>
        </Box>
        <SummaryNew
          input={input}
          input2={input2}
          expiredDay={expiredDay}
          coverPayout={coverPayout}
          currency={currency}
          currentDay={currentDay}
          symbol={symbol}
          currentPrice={getCurrentPriceToken(currentPrice, symbol)}
        />
      </Box>
    </Box>
  );
};

export default BuyInsuranceNewV2;
