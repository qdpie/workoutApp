import { Button, Text } from "@rneui/base";
import { COLORS, SIZES } from "../../constants";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import buttonStyles from "../../styles/buttonStyle";

const SessionLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.accent,
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
        name="[session_id]"
        options={{
          headerBackVisible: false,
          headerTitle: (): React.ReactNode => {
            const { title } = useLocalSearchParams<{ title?: string }>();
            if (!title) return "Workout Session";
            return (
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "bold",
                  fontSize: SIZES.large,
                }}
              >
                {title}
              </Text>
            );
          },
          headerLeft: () => (
            <Button
              buttonStyle={buttonStyles.headerButtonAccent}
              onPress={() => router.back()}
            >
              Close
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="summary"
        options={{
          headerBackVisible: false,
          presentation: "modal",
          headerTitle: (): React.ReactNode => {
            const { title } = useLocalSearchParams<{ title?: string }>();
            if (!title) return <Text>"Workout Summary"</Text>;
            return (
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "bold",
                  fontSize: SIZES.large,
                }}
              >
                {title} Summary
              </Text>
            );
          },
          headerLeft: () => (
            <Button
              buttonStyle={buttonStyles.headerButtonAccent}
              onPress={() => router.back()}
            >
              Close
            </Button>
          ),
        }}
      />

      <Stack.Screen
        name="history"
        options={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          title: "Workout History",
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
    </Stack>
  );
};

export default SessionLayout;
