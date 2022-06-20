import axios from "axios";
import { baseURL } from "@constants/endpoint";

export const fetcher = axios.create({ baseURL, withCredentials: true });

export * from "./insurance";
