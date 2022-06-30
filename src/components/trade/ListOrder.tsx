import React, { useEffect, useState } from "react";
import { list_head_order } from "@constants/list_head_order";
import { Box, Table, Thead, Tr, Td, Tbody } from "@chakra-ui/react";
import { getOrderFutures } from "@api";

const ListOrder = () => {
  const [list_order, setListOrder] = useState([]);

  useEffect(() => {
    const GetOrderFuture = async () => {
      const list_order = await getOrderFutures({
        symbol: "ETHVNDC",
        pageSize: 10,
        page: 0,
      });

      setListOrder(list_order);
    };

    GetOrderFuture();
  }, []);

  return (
    <Box color="black" marginTop="1rem">
      <Table>
        <Thead>
          <Tr>
            {list_head_order.map((val) => {
              return <Td key={val.id}>{val.label}</Td>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {list_order.map((val: any) => {
            return (
              <Tr key={val.request_id.place}>
                <Td>{val.displaying_id}</Td>
                <Td>{val.opened_at.slice(0, 10)}</Td>
                <Td>{val.symbol}</Td>
                <Td>{val.type}</Td>
                <Td>{val.side}</Td>
                <Td>{val.price}</Td>
                <Td>{val.quantity}</Td>
                <Td>{val.open_price}</Td>
                <Td>{val.sl}</Td>
                <Td>{val.tp}</Td>
                <Td>{val.profit}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ListOrder;
