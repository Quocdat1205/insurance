import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  Box,
  Link,
  FormControl,
  Select,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import useWeb3Wallet from "@hooks/useWeb3Wallet";
import { getInsurancByAddress, getInsurancByDate } from "@api";
import {
  formatTimestampToDate,
  formatDateToTimestamp,
  formatDate,
} from "@helpers/format";
import { getDayFromInHistory } from "@helpers/handler";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const History = () => {
  const { account, contractCaller } = useWeb3Wallet();

  const [historyByAddress, setHistoryByAddress] = useState<any>(null);
  const [historyByDate, setHistoryByDate] = useState<any>(null);
  const [days, setDays] = useState<any>();
  const [input, setInput] = useState<any>();
  const [optionFilter, setOptionFilter] = useState<any>("all");

  const [statusDayPicker, setStatusDayPicker] = useState<any>();

  //date picker

  const [dateRange, setDateRange] = useState([
    new Date(getDayFromInHistory(30) * 1000),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    getHistory();
    getHistoryByDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(getDayFromInHistory(30));
  }, [account, input, startDate, endDate, optionFilter]);

  const getHistory = async () => {
    const history = await getInsurancByAddress(account as string);
    setHistoryByAddress(history);
  };

  const getHistoryByDate = async () => {
    const history = await getInsurancByDate(
      account as string,
      formatDateToTimestamp(startDate),
      formatDateToTimestamp(endDate),
      optionFilter
    );
    setHistoryByDate(history);
  };

  const handleOptionFilter = (e: any) => {
    setOptionFilter(e.target.value);
  };

  const ExampleCustomInput = ({ value, onClick }: any, ref: any) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  );
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
        My Insurance
      </Text>

      <TableContainer>
        <Box>
          <FormControl display={"flex"} alignItems={"center"}>
            <Select w="15%" id="date" onChange={handleOptionFilter}>
              <option value={"buy"}>Buy date</option>
              <option value={"expired"}>Expired date</option>
            </Select>
            <Box
              marginLeft={"10px"}
              w={"120px"}
              fontSize="14px"
              padding="20px"
              width="15%"
              height={"19px"}
              borderRadius="5px"
              display={"flex"}
              alignItems="center"
              outline="none"
              border={"1px solid #0000001a"}
            >
              <DatePicker
                dateFormat="dd.MM.yyyy"
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update: any) => {
                  setDateRange(update);
                }}
                withPortal
              />
            </Box>
          </FormControl>
        </Box>

        <Table variant="simple">
          <TableCaption>{account}</TableCaption>
          <Thead>
            <Tr>
              <Th>asset</Th>
              <Th>Buy time</Th>
              <Th>Expired time</Th>
              <Th>cover value</Th>
              <Th>Cover price</Th>
              <Th>Status</Th>
              <Th>Contract</Th>
              <Th isNumeric>Hash ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {historyByAddress ? (
              (historyByDate
                ? historyByDate
                : historyByAddress.list_insurance
              ).map((value: any, index: number) => {
                return (
                  <Tr key={index}>
                    <Td>ETH</Td>
                    <Td>{`${formatDate(
                      formatDateToTimestamp(value.createdAt)
                    )}`}</Td>
                    <Td>{`${formatDate(value.expired)}`}</Td>
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
              })
            ) : (
              <Tr>
                <Td>???</Td>
                <Td>???</Td>
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
