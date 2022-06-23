import { FormBuyInsuranceType, FormBuyInsuranceTypeNew } from "src/types/formBuyInsurance";
export const formBuyInsuranceNew: Array<FormBuyInsuranceTypeNew> = [
  // {
  //   id: 0,
  //   name: "asset",
  //   label: "ETH",
  //   max: 100,
  //   min: 0.00001,
  //   isDay: false,
  //   options: [
  //     {
  //       label: "ETH",
  //       value: "eth",
  //     },
  //   ],
  // },
  {
    id: 1,
    name: "cover_value",
    label: "ETH",
    max: 100000,
    min: 0.0001,
    isDay: false
  },
  {
    id: 2,
    name: "p_claim",
    label: "USDT",
    max: 100000,
    min: 0.00001,
    isDay: false
  },
  {
    id: 3,
    name: "cover_period",
    label: "Days",
    max: 365,
    min: 7,
    isDay: true
  },
  
];


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
