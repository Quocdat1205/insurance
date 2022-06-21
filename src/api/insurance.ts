import { fetcher } from ".";
import { LogIntype, BuyInsuranceType } from "src/types/insurance";

export const logIn = async (props: LogIntype) => {
  try {
    const { walletAddress, signature } = props;

    const { data } = await fetcher.post(
      "/user/log-in",
      {
        walletAddress,
        signature,
      },
      { withCredentials: false }
    );

    return data;
  } catch (error) {
    return false;
  }
};

export const checkExpiredCookie = async () => {
  try {
    const { data } = await fetcher.get("/user/check-expire");

    return data;
  } catch (error) {
    return false;
  }
};

export const getInsurancByAddress = async (walletAddress: string) => {
  try {
    const { data } = await fetcher.get(
      `/get-insurance-by-address?owner=${walletAddress.toUpperCase()}`
    );

    return data;
  } catch (error) {
    return false;
  }
};

export const getInsuranceById = async (_id: string) => {
  try {
    const { data } = await fetcher.get(`/get-insurance-by-id?_id=${_id}`);

    return data;
  } catch (error) {
    return false;
  }
};

export const buyInsurance = async (
  props: BuyInsuranceType,
  accessToken: string
) => {
  try {
    const { owner, current_price, liquidation_price, deposit, expired } = props;

    const { data } = await fetcher.post(
      "/buy-insurance",
      {
        owner,
        current_price,
        liquidation_price,
        deposit,
        expired,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    return false;
  }
};
