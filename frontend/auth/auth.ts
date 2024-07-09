import AsyncStorage from "@react-native-async-storage/async-storage";
import { configuration } from "../api";
import { authApi } from "../api";

class Auth {
  authenticated: boolean = false;

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await authApi.login(username, password);
      if (response.status === 200) {
        this.authenticated = true;
        configuration.username = username;
        configuration.password = password;
        configuration.accessToken = response.data.access_token;
        await AsyncStorage.setItem("accessToken", response.data.access_token);
        await AsyncStorage.setItem("refreshToken", response.data.refresh_token);
        return null;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async refresh(): Promise<void> {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        const response = await authApi.refreshToken(refreshToken);
        if (response.status === 200) {
          configuration.accessToken = response.data.access_token;
          await AsyncStorage.setItem("accessToken", response.data.access_token);
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  logout() {
    this.authenticated = false;
    configuration.accessToken = null;
    configuration.username = null;
    configuration.password = null;
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("refreshToken");
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

const auth = new Auth();
export default auth;
