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
} from "@chakra-ui/react";

import useAuth from "@hooks/useAuth";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import swal from "sweetalert";
import { buyInsurance, getPriceEthNew } from "@api";
import { BuyInsuranceType } from "@types";
import { formatPriceToWeiValue, formatDate } from "@helpers/format";
import { getCurrentPrice } from "@helpers/handler";

import styled from "@emotion/styled";

const Summary = (props: any) => {
  const { accessToken, handleLogIn } = useAuth();
  const [checkedItems, setCheckedItems] = useState<any>(false);
  const { account, contractCaller, getBalance } = useWeb3Wallet();
  const { input, expiredDay, coverPayout, currency, currentDay } = props;
  const [balance, setBalance] = useState<any>();

  //buy insurance
  const handleBuyInsurance = async () => {
    if (!accessToken) return swal("Please sign metamask!");

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

    if (buy) {
      const newDataPost = { ...dataPost, id_transaction: buy.hash };
      try {
        await buyInsurance(newDataPost, accessToken);
      } catch (error) {
        console.log(error);
      }

      swal(`Buy success 🎉🎉🎉
            Cover payout: ${coverPayout.toString().slice(0, 7)} ${currency}
            Cover refund amount: ${input.cover_value * 0.95} ${currency}
      `);
    } else {
      console.error("Error submitting transaction");

      swal("Error submitting transaction");
    }
  };

  const getBalanceAccount = async () => {
    const bal = await getBalance();
    setBalance(bal);
  };

  //style component
  const PropsSummary = styled.div`
    display: flex;
    align-items: center;
    margin: auto;
    width: 75%;
    justify-content: space-between;
    border-bottom: 1px solid #ddd9d9;
    margin-bottom: 0.7rem;
  `;

  useEffect(() => {
    getBalanceAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
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
          <PropsSummary>
            <StatLabel>Available:</StatLabel>
            <StatNumber color={"teal"} fontWeight="bold" fontSize={"18px"}>
              {balance && balance.toString().slice(0, 7)} ETH
            </StatNumber>
          </PropsSummary>

          <PropsSummary>
            <StatLabel>{`You'll pay:`}</StatLabel>
            <StatNumber color={"teal"} fontWeight="bold" fontSize={"18px"}>
              {input.cover_value ? input.cover_value : 0} ETH
            </StatNumber>
          </PropsSummary>

          <PropsSummary>
            <StatLabel>{`Cover refund amount:`}</StatLabel>
            <StatNumber color={"teal"} fontWeight="bold" fontSize={"18px"}>
              {input.cover_value ? input.cover_value * 0.95 : 0} ETH
            </StatNumber>
          </PropsSummary>

          <PropsSummary>
            <StatLabel>Total cover payout:</StatLabel>
            <StatNumber color={"teal"} fontWeight="bold">
              {coverPayout ? coverPayout.toString().slice(0, 7) : 0} ETH
            </StatNumber>
          </PropsSummary>

          <Box>
            <StatHelpText>
              {currentDay} - {expiredDay ? formatDate(expiredDay) : currentDay}
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
  );
};

export default Summary;
