import axios from "axios";
import { RegisterInput } from "../../pages/Signup";
import Endpoints from "../Endpoints";
import { LoginInput } from "../../pages/Login";

export const createAccountFn = async (user: RegisterInput) => {
  const response = await axios.post(Endpoints.register, user);
  return response.data;
};

export const loginFn = async (user:LoginInput) => {
  const response = await axios.post(Endpoints.login, user);
  return response.data;
};
