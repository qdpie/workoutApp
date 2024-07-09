import { Button } from "@rneui/base";
import { COLORS, SIZES } from "../../constants";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import buttonStyles from "../../styles/buttonStyle";
import { Text } from "react-native";
import { GeneratedExercisesProvider } from "../../utils/providers/GeneratedExercisesContext";

const GeneratorLayout = () => {
  const router = useRouter();

  return (
    <GeneratedExercisesProvider>
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
          name="exerciseGenerator"
          options={{
            title: "Exercise Generator",
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
          name="exerciseList"
          options={{
            headerTitle: "Exercises",
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
          name="createExercise"
          options={{
            headerTitle: "Create Exercise",
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
          name="generateForm"
          options={{
            headerTitle: "Fitness Intelligence Tool",
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
      </Stack>
    </GeneratedExercisesProvider>
  );
};

export default GeneratorLayout;
