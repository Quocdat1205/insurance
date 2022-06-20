import { FormBuyInsuranceType } from "src/types/formBuyInsurance";

export const formBuyInsurance: Array<FormBuyInsuranceType> = [
  {
    id: 1,
    label: "Insurance value: ",
    placeHolder: "Input value insurance",
    name: "deposit",
    type: "number",
  },
  {
    id: 2,
    label: "Coin/token: ",
    placeHolder: "Choose token",
    name: "token",
    type: "number",
    options: [
      {
        label: "ETH",
        value: "eth",
      },
    ],
  },
  {
    id: 3,
    label: "Liquidation price ",
    placeHolder: "Input liquidation price",
    name: "liquidation_price",
    type: "number",
  },
  {
    id: 4,
    label: "Expired: ",
    placeHolder: "Input expired",
    name: "expired",
    type: "date",
  },
];
