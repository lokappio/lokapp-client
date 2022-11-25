import axios, { AxiosResponse } from "axios";
import AuthService from "./AuthService";

export default class ApiService {
    public static async getAPI(urlToCall: string): Promise<AxiosResponse> {
      const token = await AuthService.getToken();

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      return await axios.get(urlToCall, config);
    }

    public static async postAPI(urlToCall: string, bodyParameters: any): Promise<AxiosResponse> {
      const token = await AuthService.getToken();

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      return await axios.post(urlToCall, bodyParameters, config);
    }

    public static async putAPI(urlToCall: string, bodyParameters: any): Promise<AxiosResponse> {
      const token = await AuthService.getToken();

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      return await axios.put(urlToCall, bodyParameters, config);
    }

    public static async delAPI(urlToCall: string, bodyParameters?: any): Promise<AxiosResponse> {
      const token = await AuthService.getToken();

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      } as any;

      if (bodyParameters) {
        config["data"] = bodyParameters;
      }

      return await axios.delete(urlToCall, config);
    }

    public static async patchAPI(urlToCall: string, bodyParameters: any): Promise<AxiosResponse> {
      const token = await AuthService.getToken()

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      return await axios.patch(urlToCall, bodyParameters, config);
    }
}
