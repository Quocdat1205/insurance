import { fetcher } from ".";
import { LogIntype, BuyInsuranceType, PriceClaim } from "src/types/insurance";
import { parseNumber } from "@helpers/handler";

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

    const price = JSON.stringify(deposit, (_, v) =>
      typeof v === "bigint" ? `${v}n` : v
    ).replace(/"(-?\d+)n"/g, (_, a) => a);

    const { data } = await fetcher.post(
      "/buy-insurance",
      {
        owner,
        current_price: parseNumber(current_price as unknown as string),
        liquidation_price: parseNumber(liquidation_price),
        deposit: parseNumber(price),
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
    console.error(error);

    return false;
  }
};

export const getPriceClaim = async (
  props: PriceClaim,
  accessToken: string
) => {
  try {
    const {current_price, liquidation_price, deposit } = props;

    // const price = JSON.stringify(deposit, (_, v) =>
    //   typeof v === "bigint" ? `${v}n` : v
    // ).replace(/"(-?\d+)n"/g, (_, a) => a);

    const { data } = await fetcher.post(
      "/get-price-claim",
      {
        value: parseNumber(deposit),
        p_start: parseNumber(current_price as unknown as string),
        p_stop: parseNumber(liquidation_price),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(error);

    return false;
  }
};
