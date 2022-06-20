export type LogIntype = {
  walletAddress: string;
  signature: string | undefined;
};

export type BuyInsuranceType = {
  owner: string;
  current_price: number;
  liquidation_price: number;
  deposit: number;
  expired: number;
};
