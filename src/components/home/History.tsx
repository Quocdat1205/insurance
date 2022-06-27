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
} from "@chakra-ui/react";
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
    console.log(history);

    setHistoryByAddress(history);
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>{account}</TableCaption>
        <Thead>
          <Tr>
            <Th>Token name</Th>
            <Th>Buy time</Th>
            <Th>Expire time</Th>
            <Th>cover value</Th>

            <Th>p claim</Th>

            <Th>Status</Th>
            <Th isNumeric>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {historyByAddress ? (
            historyByAddress.map((value: any, index: number) => {
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
                  <Td isNumeric>
                    {/* {value.owner.slice(0, 4)}
                    ...
                    {value.owner.slice(38, 42)} */}
                    ...
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
