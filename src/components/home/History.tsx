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
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import useWeb3Wallet from "@hooks/useWeb3Wallet";
import { getInsurancByAddress } from "@api";
import { formatTimestampToDate, formatDateToTimestamp } from "@helpers/format";
import useAuth from "@hooks/useAuth";

const History = () => {
  const { account, contractCaller } = useWeb3Wallet();
  const { accessToken, handleLogIn } = useAuth();
  const [historyByAddress, setHistoryByAddress] = useState<any>(null);
  const [input, setInput] = useState<any>();

  useEffect(() => {
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const getHistory = async () => {
    const history = await getInsurancByAddress(account as string);
    setHistoryByAddress(history);
    console.log(history);
  };

  return (
    <TableContainer>
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
            historyByAddress.list_insurance.map((value: any, index: number) => {
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
            })
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
  );
};

export default History;
