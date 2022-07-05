import React, { useEffect, useState } from "react";
import { list_head_order } from "@constants/list_head_order";
import {
  Box,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { getOrderFuturesSuccess, getOrderFuturesAvailable } from "@api";

const ListOrder = () => {
  const [list_order_success, setListOrderSuccess] = useState([]);
  const [list_order_available, setListOrderAvailable] = useState([]);

  useEffect(() => {
    const GetOrderFutureSuccess = async () => {
      const list_order = await getOrderFuturesSuccess({
        symbol: "ETHVNDC",
        pageSize: 10,
        page: 0,
      });

      setListOrderSuccess(list_order);
    };
    const GetOrderFutureAvailable = async () => {
      const list_order = await getOrderFuturesAvailable({
        symbol: "ETHVNDC",
        pageSize: 10,
        page: 0,
      });

      setListOrderAvailable(list_order);
    };

    GetOrderFutureSuccess();
    GetOrderFutureAvailable();
  }, []);

  return (
    <Box color="black" marginTop="1rem">
      <Tabs isManual variant="enclosed">
        <TabList>
          <Tab>Available</Tab>
          <Tab>Success</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Table>
              <Thead>
                <Tr>
                  {list_head_order.map((val) => {
                    return <Td key={val.id}>{val.label}</Td>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {list_order_available.map((val: any) => {
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
          </TabPanel>
          <TabPanel>
            <Table>
              <Thead>
                <Tr>
                  {list_head_order.map((val) => {
                    return <Td key={val.id}>{val.label}</Td>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {list_order_success.map((val: any) => {
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ListOrder;
