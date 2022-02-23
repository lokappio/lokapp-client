import axios, { AxiosResponse } from "axios";
import AuthService from "./AuthService";

class ApiService {
    public static getAPI(urlToCall: string): Promise<AxiosResponse> {
        return AuthService.getToken()
        .then((idToken) => {
            const config = {
                headers: { Authorization: `Bearer ${idToken}` }
            };
            return axios.get(urlToCall, config);
        }).catch((error) => {
            throw (error);
        });
    }

    public static postAPI(urlToCall: string, bodyParameters: any): Promise<AxiosResponse> {
        return AuthService.getToken()
        .then((idToken) => {
            const config = {
                headers: { Authorization: `Bearer ${idToken}` }
            };
            return axios.post(urlToCall, bodyParameters, config);
        }).catch((error) => {
            throw (error);
        });
    }

    public static putAPI(urlToCall: string, bodyParameters: any): Promise<AxiosResponse> {
        return AuthService.getToken()
        .then((idToken) => {
            const config = {
                headers: { Authorization: `Bearer ${idToken}` }
            };
            return axios.put(urlToCall, bodyParameters, config);
        }).catch((error) => {
            throw (error);
        });
    }

    public static delAPI(urlToCall: string, bodyParameters?: any): Promise<AxiosResponse> {
        return AuthService.getToken()
        .then((idToken) => {
            let config: any = {};
            config = {
                headers: { Authorization: `Bearer ${idToken}` },
            };
            if (bodyParameters) {
                config["data"] = bodyParameters;
            }
            return axios.delete(urlToCall, config);
        }).catch((error) => {
            throw (error);
        });
    }

    public static patchAPI(urlToCall: string, bodyParameters: any): Promise<AxiosResponse> {
        return AuthService.getToken()
        .then((idToken) => {
            const config = {
                headers: { Authorization: `Bearer ${idToken}` }
            };
            return axios.patch(urlToCall, bodyParameters, config);
        }).catch((error) => {
            throw (error);
        });
    }
}

export default ApiService;