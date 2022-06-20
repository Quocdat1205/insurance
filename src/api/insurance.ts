import { fetcher } from ".";
import { LogIntype } from "src/types/login";

export const logIn = async (props: LogIntype) => {
  try {
    const { walletAddress, signature } = props;

    const { data } = await fetcher.post("/user/log-in", {
      walletAddress,
      signature,
    });

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
      `/get-insurance-by-address?owner=${walletAddress}`
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
