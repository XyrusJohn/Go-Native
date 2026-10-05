import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const jar = new CookieJar();

export const axiosInstance = wrapper(
  axios.create({
    baseURL: process.env.EXPO_PUBLIC_APP_URL,
    withCredentials: true,
    jar,
    timeout: 5000,
  }),
);
