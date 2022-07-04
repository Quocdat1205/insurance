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
import { formatDateToTimestamp, formatDate } from "@helpers/format";
import { getDayFromInHistory } from "@helpers/handler";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { list_head_history } from "@constants/list_head_history";

const History = () => {
  const { account, contractCaller } = useWeb3Wallet();
  const [historyByAddress, setHistoryByAddress] = useState<any>(null);
  const [historyByDate, setHistoryByDate] = useState<any>(null);
  const [input, setInput] = useState<any>();
  const [optionFilterKindOfTime, setOptionFilterKindOfTime] =
    useState<any>("all");
  const [optionFilterAsset, setOptionFilterAsset] = useState<any>("ETH");
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
  }, [
    account,
    input,
    startDate,
    endDate,
    optionFilterKindOfTime,
    optionFilterAsset,
  ]);

  const getHistory = async () => {
    const history = await getInsurancByAddress(account as string);
    setHistoryByAddress(history);
  };

  const getHistoryByDate = async () => {
    const history = await getInsurancByDate(
      account as string,
      formatDateToTimestamp(startDate),
      formatDateToTimestamp(endDate),
      optionFilterKindOfTime,
      optionFilterAsset
    );
    setHistoryByDate(history);
  };

  const handleFilterKindOfTime = (e: any) => {
    setOptionFilterKindOfTime(e.target.value);
  };
  const handleFilterAsset = (e: any) => {
    setOptionFilterAsset(e.target.value);
  };

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
            <Select
              w="15%"
              id="token"
              marginRight={"10px"}
              onChange={handleFilterAsset}
            >
              <option value={"ETH"}>ETH</option>
              <option value={"BTC"}>BTC</option>
            </Select>
            <Select w="15%" id="date" onChange={handleFilterKindOfTime}>
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
              borderRadius="7px"
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
              {list_head_history.map((value, index) => {
                return <Th key={index}>{value.label}</Th>;
              })}
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
                    <Td>{value.asset}</Td>
                    <Td>{`${formatDate(
                      formatDateToTimestamp(value.createdAt)
                    )}`}</Td>
                    <Td>{`${formatDate(value.expired)}`}</Td>
                    <Td>
                      {value.deposit / 10 ** 18} {value.asset}
                    </Td>
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
                {list_head_history.map((value, index) => {
                  return <Td key={index}>???</Td>;
                })}
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
