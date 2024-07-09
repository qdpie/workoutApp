import { Button, Text } from "@rneui/base";
import { exercisesApi, sessionsApi } from "../../api";
import { router, useLocalSearchParams } from "expo-router";
import { ExerciseOut, SessionUpdate } from "../../generated";
import { useEffect, useState } from "react";
import { View } from "react-native";
import InstanceCard from "../../components/instanceCard";
import { COLORS } from "../../constants";
import buttonStyles from "../../styles/buttonStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { set } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { Platform } from "react-native";

const SessionPage = () => {
  const { session_id, title, workout_id } = useLocalSearchParams<{
    session_id: string;
    title?: string;
    workout_id?: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<ExerciseOut[]>([]);

  const fetchExercises = async () => {
    setLoading(true);
    const response = await exercisesApi.getExercises(workout_id);
    setExercises(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <View
      style={{
        backgroundColor: COLORS.screen,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
      }}
    >
      {Platform.OS === "web" ? (
        // ScrollView only for web testing, not needed for flatlist on mobile
        <ScrollView>
          <InstanceCard data={exercises} />
        </ScrollView>
      ) : (
        <InstanceCard data={exercises} />
      )}
      <Button
        title="Finish Workout"
        buttonStyle={buttonStyles.activeWorkoutButton}
        containerStyle={{ ...buttonStyles.buttonContainer }}
        loading={loading}
        onPress={() => {
          router.push({
            pathname: "session/summary",
            params: { session_id, title },
          });
        }}
      />
    </View>
  );
};

export default SessionPage;
