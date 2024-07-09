import { Button } from "@rneui/base";
import { COLORS } from "../constants";
import { Stack, useRouter } from "expo-router";
import buttonStyles from "../styles/buttonStyle";
import { FetchExercisesProvider } from "../utils/providers/FetchExercisesContext";
import DropDownPicker from "react-native-dropdown-picker";
import { LogBox } from "react-native";

const Layout = () => {
  const router = useRouter();
  DropDownPicker.setTheme("DARK");
  DropDownPicker.setMode("BADGE");
  LogBox.ignoreAllLogs(); // for demo purposes, reenable after demos finish
  return (
    <FetchExercisesProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "", // Left blank to hide the title
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login-modal"
          options={{
            headerTitle: "Sign In",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="register-modal"
          options={{
            headerTitle: "Sign Up",
            presentation: "modal",
            headerLeft: () => (
              <Button
                buttonStyle={buttonStyles.headerButton}
                onPress={() => router.back()}
              >
                Close
              </Button>
            ),
          }}
        />
        <Stack.Screen
          name="user-setup-modal"
          options={{
            headerTitle: "Setup",
            presentation: "modal",
            headerLeft: () => (
              <Button
                buttonStyle={buttonStyles.headerButton}
                onPress={() => router.back()}
              >
                Close
              </Button>
            ),
          }}
        />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="workout" options={{ headerShown: false }} />
        <Stack.Screen name="generator" options={{ headerShown: false }} />
        <Stack.Screen name="goal" options={{ headerShown: false }} />
        <Stack.Screen name="session" options={{ headerShown: false }} />
      </Stack>
    </FetchExercisesProvider>
  );
};

export default Layout;
