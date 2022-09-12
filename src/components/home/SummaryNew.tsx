import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Checkbox,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import useAuth from "@hooks/useAuth";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import swal from "sweetalert";
import { buyInsurance } from "@api";
import { BuyInsuranceType } from "@types";
import { formatPriceToWeiValue, formatDate } from "@helpers/format";
import {
  getExpiredDayFrom,
  calculateIncrease,
  calculateDecrease,
  calculatePercentRoi,
  getRoi,
} from "@helpers/handler";
import styled from "@emotion/styled";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Summary = (props: any) => {
  const { accessToken, handleLogIn } = useAuth();
  const { account, contractCaller, getBalance } = useWeb3Wallet();
  const {
    input,
    input2,
    expiredDay,
    coverPayout,
    currency,
    currentDay,
    symbol,
    currentPrice,
  } = props;
  const [balance, setBalance] = useState<any>();
  const [checkedItems, setCheckedItems] = useState<any>(false);
  const [isPaymentWithNain, setIsPaymentWithNain] = useState<any>(false);
  const [newInput, setNewInput] = useState<any>({});

  //buy insurance
  const handleBuyInsurance = async () => {
    if (!accessToken) return swal("Please sign metamask!");
    const price = currentPrice;

    const dataPost: BuyInsuranceType = {
      owner: account as string,
      current_price: Number(price.toFixed()),
      liquidation_price: newInput.p_claim,
      deposit: formatPriceToWeiValue(newInput.cover_value),
      expired: newInput.expired_day,
      id_transaction: input.hash,
      asset: symbol.toString().slice(0, 3),
      amount: input.amount,
      id_sc: input.id_sc,
    };

    console.log(dataPost);

    const buy =
      await contractCaller.current?.insuranceContract.contract.buyInsurance(
        0xc5f6ecadb23545500300ed265602736b8c0908e5,
        formatPriceToWeiValue(1000),
        1400,
        1000,
        1665812473,
        { value: formatPriceToWeiValue(1000) }
      );

    console.log(buy);

    // const idSC =
    //   Number(
    //     await contractCaller.current?.insuranceContract.contract.totalInsurance()
    //   ) + 1;

    // if (buy) {
    //   const newDataPost = {
    //     ...dataPost,
    //     id_transaction: buy.hash,
    //     id_sc: idSC,
    //   };
    //   try {
    //     await buyInsurance(newDataPost, accessToken);
    //   } catch (error) {
    //     console.log(error);
    //   }

    //   swal(`Successfully Purchased !
    //         Total Refund: ${(isPaymentWithNain
    //           ? input2.cover_value * 0.95 + input2.cover_value * 0.95 * 0.05
    //           : input2.cover_value * 0.95
    //         )
    //           .toString()
    //           .slice(0, 7)} ${isPaymentWithNain ? "NAIN" : currency}
    //         Cover Payout: ${(isPaymentWithNain
    //           ? newInput.cover_payout
    //           : coverPayout
    //         )
    //           .toString()
    //           .slice(0, 7)} ${isPaymentWithNain ? "NAIN" : currency}

    //   `);
    // } else {
    //   console.error("Error submitting transaction");

    //   swal("Error submitting transaction");
    // }
  };

  const getBalanceAccount = async () => {
    const bal = await getBalance();
    setBalance(bal);
  };

  const paymentWithNain = (
    value: any,
    percent: any,
    type: string,
    isRoi: boolean,
    isPrice: boolean
  ) => {
    return (
      <Box display={"flex"} alignItems="center">
        <ArrowForwardIcon
          fontSize={"20px"}
          display={"flex"}
          alignItems="center"
          opacity={"0.7"}
          margin="0 5px"
        />

        <StatNumber color={"teal"} fontWeight="bold" fontSize={"16px"}>
          {isRoi
            ? calculateIncrease(value, 0).toString().slice(0, 7)
            : type === "increase"
            ? value
              ? calculateIncrease(value, percent).toString().slice(0, 7)
              : 0
            : value
            ? calculateDecrease(value, percent).toString().slice(0, 7)
            : 0}{" "}
          {isRoi ? `%` : isPrice ? `USDT` : isPaymentWithNain ? "NAIN" : "ETH"}{" "}
        </StatNumber>
        <StatHelpText marginLeft="5px" fontSize="10px">
          <StatArrow type={type === "increase" ? "increase" : "decrease"} />
          {percent}%
        </StatHelpText>
      </Box>
    );
  };

  //style component
  const PropsSummary = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    width: 75%;
    border-bottom: 1px solid #ddd9d9;
    margin-bottom: 0.7rem;
  `;

  const summaryItem = (
    value: any,
    label: string,
    type: string,
    isRoi: boolean,
    isPrice: boolean
  ) => {
    return (
      <PropsSummary>
        <StatLabel>{`${label}`}</StatLabel>
        <Box textAlign={"end"} display="flex" alignItems={"center"}>
          {isPaymentWithNain ? (
            <StatNumber
              color={"teal"}
              fontWeight="bold"
              fontSize={"16px"}
              textDecoration="line-through"
              opacity="0.7"
            >
              {value ? value.toString().slice(0, 7) : 0} ETH
            </StatNumber>
          ) : (
            <StatNumber color={"teal"} fontWeight="bold" fontSize={"16px"}>
              {value ? value.toString().slice(0, 7) : 0} ETH
            </StatNumber>
          )}

          {isPaymentWithNain ? (
            paymentWithNain(value, 5, type, isRoi, isPrice)
          ) : (
            <Box></Box>
          )}
        </Box>
      </PropsSummary>
    );
  };

  const createNewInput = () => {
    if (Number(input2.p_claim) < currentPrice) {
      setNewInput({
        ...newInput,
        p_claim: parseInt(String(calculateDecrease(input2.p_claim, 5))), //5%
        cover_value: String(calculateDecrease(input2.cover_value, 5)), //5%
        expired_day: Number(getExpiredDayFrom(expiredDay, 2)).toFixed(),
        cover_payout: calculateIncrease(coverPayout, 5),
      });
    } else {
      setNewInput({
        ...newInput,
        p_claim: calculateIncrease(input2.p_claim, 5), //5%
        cover_value: calculateDecrease(input2.cover_value, 5), //5%
        expired_day: getExpiredDayFrom(expiredDay, 2).toFixed(),
        cover_payout: calculateIncrease(coverPayout, 5),
      });
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    getBalanceAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, checkedItems]);
  useEffect(() => {
    if (isPaymentWithNain) {
      createNewInput();
    } else {
      setNewInput({
        ...newInput,
        p_claim: input2.p_claim,
        cover_value: input2.cover_value,
        expired_day: Number(expiredDay).toFixed(),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentWithNain, coverPayout, props]);

  return (
    <Box
      w="40%"
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
        Insurance Contract
      </Text>
      <Box display={"flex"}>
        <Stat>
          <PropsSummary>
            <StatLabel>Available:</StatLabel>
            <Box textAlign={"end"}>
              <StatNumber color={"teal"} fontWeight="bold" fontSize={"16px"}>
                {balance && balance.toString().slice(0, 7)} ETH
              </StatNumber>
            </Box>
          </PropsSummary>

          <Box>
            {summaryItem(
              input2.cover_value,
              "You'll Pay:",
              "decrease",
              false,
              false
            )}
          </Box>

          <Box>
            <PropsSummary>
              <StatLabel>{`Price`}</StatLabel>
              <Box display={"flex"} alignItems="center" textAlign={"end"}>
                {isPaymentWithNain ? (
                  <StatNumber
                    color={"teal"}
                    fontWeight="bold"
                    fontSize={"16px"}
                    textDecoration="line-through"
                    opacity="0.7"
                  >
                    {input2.p_claim ? input2.p_claim.toString().slice(0, 7) : 0}{" "}
                    USDT
                  </StatNumber>
                ) : (
                  <StatNumber
                    color={"teal"}
                    fontWeight="bold"
                    fontSize={"16px"}
                  >
                    {input2.p_claim ? input2.p_claim.toString().slice(0, 7) : 0}{" "}
                    USDT
                  </StatNumber>
                )}

                {input2.p_claim < currentPrice ? (
                  isPaymentWithNain ? (
                    paymentWithNain(input2.p_claim, 5, "decrease", false, true)
                  ) : (
                    <Box></Box>
                  )
                ) : isPaymentWithNain ? (
                  paymentWithNain(input2.p_claim, 5, "increase", false, true)
                ) : (
                  <Box></Box>
                )}
              </Box>
            </PropsSummary>
          </Box>

          <Box>
            {summaryItem(
              input2.cover_value * 0.95,
              "Total Refund:",
              "increase",
              false,
              false
            )}
          </Box>
          <Box>
            {summaryItem(
              coverPayout,
              "Cover Payout:",
              "increase",
              false,
              false
            )}
          </Box>

          <PropsSummary>
            <StatLabel>Roi:</StatLabel>
            <Box display={"flex"} alignItems="center" textAlign={"end"}>
              {isPaymentWithNain ? (
                <StatNumber
                  color={"teal"}
                  fontWeight="bold"
                  fontSize={"16px"}
                  textDecoration="line-through"
                  opacity="0.7"
                >
                  {coverPayout
                    ? getRoi(input2.cover_value, coverPayout)
                        .toFixed(2)
                        .toString()
                        .slice(0, 4)
                    : 0}{" "}
                  %
                </StatNumber>
              ) : (
                <StatNumber color={"teal"} fontWeight="bold" fontSize={"16px"}>
                  {coverPayout
                    ? getRoi(input2.cover_value, coverPayout)
                        .toFixed(2)
                        .toString()
                        .slice(0, 4)
                    : 0}{" "}
                  %
                </StatNumber>
              )}

              {isPaymentWithNain ? (
                paymentWithNain(
                  getRoi(input2.cover_value, newInput.cover_payout).toFixed(2),
                  coverPayout
                    ? calculatePercentRoi(
                        getRoi(input2.cover_value, coverPayout), //old roi
                        getRoi(input2.cover_value, newInput.cover_payout) // new roi
                      ).toFixed()
                    : 0,
                  "increase",
                  true,
                  false
                )
              ) : (
                <Box></Box>
              )}
            </Box>
          </PropsSummary>

          <Box>
            {isPaymentWithNain ? (
              <Box
                display={"flex"}
                justifyContent="center"
                alignItems={"start"}
              >
                <StatHelpText>{currentDay}</StatHelpText>

                <StatHelpText margin={"0 8px"}> - </StatHelpText>

                <StatHelpText textDecoration="line-through" opacity="0.7">
                  {expiredDay ? formatDate(expiredDay) : currentDay}
                </StatHelpText>

                <StatHelpText marginLeft={"3px"}>
                  {expiredDay
                    ? formatDate(getExpiredDayFrom(expiredDay, 2))
                    : currentDay}
                </StatHelpText>
              </Box>
            ) : (
              <StatHelpText>
                {currentDay} -{" "}
                {expiredDay ? formatDate(expiredDay) : currentDay}
              </StatHelpText>
            )}
          </Box>
        </Stat>

        {/* <Divider orientation="horizontal" /> */}
      </Box>
      <Box display={"flex"} justifyContent="center">
        <Box>
          <Box display={"flex"} justifyContent="start" marginBottom={"3px"}>
            <Checkbox
              colorScheme="teal"
              onChange={async (e: any) => {
                if (e.target.checked) {
                  setIsPaymentWithNain(true);
                } else {
                  setIsPaymentWithNain(false);
                }
              }}
            >
              Payment with NAIN
            </Checkbox>
          </Box>
          <Box display={"flex"} justifyContent="start">
            <Checkbox
              colorScheme="teal"
              onChange={async (e: any) => {
                if (e.target.checked) {
                  setCheckedItems(true);
                  if (await handleLogIn()) {
                    setCheckedItems(e.target.checked);
                  } else {
                    setCheckedItems(false);
                  }
                } else {
                  setCheckedItems(false);
                }
              }}
              isChecked={checkedItems}
            >
              I agree to the terms and conditions.
            </Checkbox>
          </Box>
        </Box>
      </Box>

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
  );
};

export default Summary;
