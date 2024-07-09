import { Button } from "@rneui/base";
import { COLORS, SIZES } from "../../constants";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import buttonStyles from "../../styles/buttonStyle";
import { Text } from "react-native";

const WorkoutLayout = () => {
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
        name="create-workout-page"
        options={{
          title: "Create New Workout",
          presentation: "modal",
          headerLeft: () => (
            <Button
              buttonStyle={buttonStyles.headerButton}
              onPress={() => router.push("/workouts")}
            >
              Close
            </Button>
          ),
        }}
      />

      <Stack.Screen
        name="editExercise"
        options={{
          title: "Create New Workout",
          presentation: "modal",
          headerBackVisible: false,
          headerLeft: () => (
            <Button
              buttonStyle={buttonStyles.headerButton}
              onPress={() => router.back()}
            >
              Close
            </Button>
          ),
          headerTitle: (): React.ReactNode => {
            const { title } = useLocalSearchParams<{ title?: string }>();
            if (!title) return "Edit Exercise";
            return (
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "bold",
                  fontSize: SIZES.large,
                }}
              >
                Edit {title}
              </Text>
            );
          },
        }}
      />

      <Stack.Screen
        name="[workout_id]"
        options={{
          headerBackVisible: false,
          headerTitle: (): React.ReactNode => {
            const { title } = useLocalSearchParams<{ title?: string }>();
            if (!title) return "Workout";
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
              onPress={() => router.push("/workouts")}
            >
              Close
            </Button>
          ),
        }}
      />
    </Stack>
  );
};

export default WorkoutLayout;
