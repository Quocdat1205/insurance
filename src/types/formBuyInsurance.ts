export type FormBuyInsuranceType = {
  id: number;
  label: string;
  placeHolder: string;
  name: string;
  type: string;
  options?: Array<ObjectType>;
};

export type ObjectType = {
  label: string;
  value: any;
};
