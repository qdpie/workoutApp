import { Button } from "@rneui/base";
import { COLORS, SIZES } from "../../constants";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import buttonStyles from "../../styles/buttonStyle";
import { Text } from "react-native";

const GoalLayout = () => {
  const router = useRouter();

  return (
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
        name="create-goal-page"
        options={{
          title: "Create PR Goal",
          presentation: "modal",
          headerLeft: () => (
            <Button
              buttonStyle={buttonStyles.headerButton}
              onPress={() => router.push("/goals")}
            >
              Close
            </Button>
          ),
        }}
      />

      <Stack.Screen
        name="create-w-goal-page"
        options={{
          title: "Create Weight Goal",
          presentation: "modal",
          headerLeft: () => (
            <Button
              buttonStyle={buttonStyles.headerButton}
              onPress={() => router.push("/goals")}
            >
              Close
            </Button>
          ),
        }}
      />

      <Stack.Screen
        name="[goal_id]"
        options={{
          headerBackVisible: false,
          headerTitle: (): React.ReactNode => {
            const { title } = useLocalSearchParams<{ title?: string }>();
            if (!title) return "Goal";
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
              buttonStyle={buttonStyles.headerButton}
              onPress={() => router.push("/goals")}
            >
              Close
            </Button>
          ),
        }}
      />
    </Stack>
  );
};

export default GoalLayout;
