import {
  PingApi,
  AuthApi,
  UsersApi,
  Configuration,
  WorkoutsApi,
  ExercisesApi,
  SessionsApi,
  GoalsApi,
  ExerciseInstancesApi,
  GenerateApi
} from "../generated";

import GeneratorApi from "./generatorApi";
import { InterceptorConfig } from "./interceptorConfig";

const interceptorConfig = new InterceptorConfig();
export const configuration = new Configuration();

export const pingApi = new PingApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const authApi = new AuthApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const workoutsApi = new WorkoutsApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const goalsApi = new GoalsApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const usersApi = new UsersApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const exercisesApi = new ExercisesApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const sessionsApi = new SessionsApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const instanceApi = new ExerciseInstancesApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const generateApi = new GenerateApi(
  configuration,
  undefined,
  interceptorConfig.axiosInstance
);
export const generatorApi = new GeneratorApi();
