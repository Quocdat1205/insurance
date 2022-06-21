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
import { formatTimestampToDate } from "@helpers/handler";
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
        <TableCaption>Buy history</TableCaption>
        <Thead>
          <Tr>
            <Th>Contract value</Th>
            <Th>Buy price</Th>
            <Th>Liquidation price</Th>
            <Th>Expire time</Th>
            <Th>State</Th>
            <Th isNumeric>Owner</Th>
          </Tr>
        </Thead>
        <Tbody>
          {historyByAddress ? (
            historyByAddress.map((value: any, index: number) => {
              return (
                <Tr key={index}>
                  <Td>{value.deposit}</Td>
                  <Td>{value.current_price}</Td>
                  <Td>{value.liquidation_price}</Td>
                  <Td>{`${formatTimestampToDate(value.expired)}`}</Td>
                  <Td>{value.state}</Td>
                  <Td isNumeric>
                    {value.owner.slice(0, 5)}
                    ...
                    {value.owner.slice(37, 42)}
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
        <Tfoot>
          <Tr>
            <Th>Contract value</Th>
            <Th>Buy price</Th>
            <Th>Liquidation price</Th>
            <Th>Expire time</Th>
            <Th>State</Th>
            <Th isNumeric>Owner</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default History;
