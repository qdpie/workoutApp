import React from "react";
import { Text, Pressable, View } from "react-native";
import { WorkoutOut } from "../generated";
import workoutCard from "../styles/workoutCard";
import { router } from "expo-router";
import { useFetchExercises } from "../utils/providers/FetchExercisesContext";

interface WorkoutCardProps extends WorkoutOut {
  setFetched: (fetched: boolean) => void;
}

// Card Component
const WorkoutCard = (props: WorkoutCardProps) => {
  const { workout_id, title, created_date, duration_mins, setFetched } = props;
  const { shouldFetch, setShouldFetch } = useFetchExercises();

  return (
    <>
      <Pressable
        onPress={() => {
          setFetched(false);
          setShouldFetch(true);
          router.push({
            pathname: `/workout/${workout_id}`,
            params: { title: title },
          });
        }}
      >
        <View style={workoutCard.cardContainer}>
          <Text style={workoutCard.cardTitle}>{title}</Text>
        </View>
      </Pressable>
    </>
  );
};

export default WorkoutCard;
