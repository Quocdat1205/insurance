export type FormBuyInsuranceType = {
  id: number;
  label: string;
  placeHolder: string;
  name: string;
  type: string;
  options?: Array<ObjectType>;
};

export type FormBuyInsuranceTypeNew = {
  id: number;
  name: string;
  label: string;
  max: number;
  min: number;
  isDay: boolean;
  options?: Array<ObjectType>;
};

export type ObjectType = {
  label: string;
  value: any;
};
