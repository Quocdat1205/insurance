import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  Box,
  Link,
  FormControl,
  FormLabel,
  Select,
  Input,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import useWeb3Wallet from "@hooks/useWeb3Wallet";
import { getInsurancByAddress } from "@api";
import { formatTimestampToDate, formatDateToTimestamp } from "@helpers/format";
import { getDayFromInHistory } from "@helpers/handler";
import useAuth from "@hooks/useAuth";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { AnyPointerEvent } from "framer-motion/types/gestures/PanSession";

const History = () => {
  const { account, contractCaller } = useWeb3Wallet();
  const { accessToken, handleLogIn } = useAuth();
  const [historyByAddress, setHistoryByAddress] = useState<any>(null);
  const [days, setDays] = useState<any>();
  const [input, setInput] = useState<any>();

  //date picker
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());

  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    getHistory();
    console.log(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(
      `startDate: ${formatDateToTimestamp(
        startDate
      )}, endDate: ${formatDateToTimestamp(endDate)}`
    );
  }, [account, input, startDate, endDate]);

  const getHistory = async () => {
    const history = await getInsurancByAddress(account as string);
    setHistoryByAddress(history);
  };

  const handleDays = (e: any) => {
    setInput({
      ...input,
      days_to: formatDateToTimestamp(new Date()).toFixed(),
      days_from: getDayFromInHistory(e.target.value).toFixed(),
    });

    console.log(input);
  };

  // const onChange = (dates: any) => {
  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  // };

  return (
    <>
      <Text
        as="h1"
        color="rgb(58, 138, 132)"
        fontWeight="bold"
        fontSize="2rem"
        textAlign={"center"}
        margin={"20px"}
      >
        History
      </Text>
      <Box textAlign={"center"}>
        <DatePicker
          dateFormat="dd/MM/yyyy"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update: any) => {
            setDateRange(update);
          }}
          withPortal
        />
      </Box>
      <TableContainer>
        <FormControl display={"flex"} alignItems={"center"}>
          <FormLabel htmlFor="date">Date</FormLabel>
          <Select w="10%" id="date" onChange={handleDays}>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={"custom"}>Customize</option>
          </Select>
        </FormControl>

        <Table variant="simple">
          <TableCaption>{account}</TableCaption>
          <Thead>
            <Tr>
              <Th>asset</Th>
              <Th>Buy time</Th>
              <Th>Expired time</Th>
              <Th>cover value</Th>

              <Th>p-claim</Th>

              <Th>Status</Th>
              <Th>Contract</Th>
              <Th isNumeric>Hash ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {historyByAddress ? (
              historyByAddress.list_insurance.map(
                (value: any, index: number) => {
                  return (
                    <Tr key={index}>
                      <Td>ETH</Td>
                      <Td>{`${formatTimestampToDate(
                        formatDateToTimestamp(value.createdAt)
                      )}`}</Td>
                      <Td>{`${formatTimestampToDate(value.expired)}`}</Td>
                      <Td>{value.deposit / 10 ** 18} ETH</Td>

                      <Td>{value.liquidation_price} USDT</Td>

                      <Td>{value.state}</Td>
                      <Td>
                        {" "}
                        <Link
                          href={`https://kovan.etherscan.io/tx/${value.id_transaction}`}
                          isExternal
                        >
                          View contract <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Td>

                      <Td isNumeric>
                        {value._id.slice(0, 6)}
                        ...
                        {value._id.slice(18, 24)}
                      </Td>
                    </Tr>
                  );
                }
              )
            ) : (
              <Tr>
                <Td>???</Td>
                <Td>???</Td>
                <Td>???</Td>
                <Td>???</Td>
                <Td>???</Td>
                <Td isNumeric>???</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default History;
