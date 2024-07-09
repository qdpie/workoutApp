import { router } from "expo-router";
import {
  Configuration as BaseConfiguration,
  ConfigurationParameters,
} from "../generated/configuration";
import { AxiosInstance } from "axios";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "../auth/auth";

export class InterceptorConfig extends BaseConfiguration {
  constructor(param: ConfigurationParameters = {}) {
    super(param);

    // Initialize Axios instance with base options
    this.axiosInstance = axios.create(this.baseOptions);

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response, // Simply return the response if it's successful
      async (error) => {
        const originalRequest = error.config;
        // Check if the error is a 401 or 403 Unauthorized error
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // If we haven't already retried this request
          if (!originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as retried
            try {
              await auth.refresh(); // Attempt to refresh the token
              // If refresh was successful, update the Authorization header and retry the original request
              const token = await AsyncStorage.getItem("accessToken");
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return this.axiosInstance(originalRequest);
            } catch (refreshError) {
              // If the refresh attempt fails, log the error
              console.log("Failed to refresh token", refreshError);
            }
          }
          // If the request was already retried or refresh failed, redirect to login
          console.log(
            "Redirecting to login due to 401/403 error after refresh attempt"
          );
          router.replace("/login-modal");
        }
        // For all other errors or if the redirect has been initiated, reject the promise
        return Promise.reject(error);
      }
    );
  }

  // Override the axiosInstance property to use the custom instance
  public axiosInstance: AxiosInstance;
}
