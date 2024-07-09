import React, { useEffect, useState } from "react";
import { Text, Pressable, View } from "react-native";
import workoutCard from "../styles/workoutCard";
import { GoalOut, ExerciseOut } from "../generated";
import { router, useFocusEffect } from "expo-router";
import { exercisesApi} from "../api"
import { instanceApi } from "../api";
import { GoalUpdate } from "../generated";
import { goalsApi } from "../api";
import { Ionicons } from "@expo/vector-icons";


interface GoalCardProps extends GoalOut {
    setFetched: (fetched: boolean) => void;
}


const GoalCard = (props: GoalCardProps) => {
  let { goal_id, category, track_type, goal, exercise, owner, setFetched } = props;
  const [exerciseName, setExerciseName] = useState<string>("");
  const [currentBest, setCurrentBest] = useState<number>(0);

  const fetchExerciseName = async () => {
    try {
      const response = await exercisesApi.getExercise(exercise); // Replace with your API method to get exercise by ID or name
      if (response.data) {
        setExerciseName(response.data.name);
      }
    } catch (error) {
      console.error("Error fetching exercise:", error);
    }
  };

  const fetchExerciseInstances = async () => {
    try {
      const response = await instanceApi.getExerciseInstancesByExercise(exercise);
      const data = response.data;

      const values = data.map((instance) => {
        switch (track_type) {
          case 'reps':
            return instance.reps.length > 0 ? Math.max(...instance.reps.filter(val => typeof val === 'number' && isFinite(val))) : 0;
          case 'weight':
            return instance.weight.length > 0 ? Math.max(...instance.weight.filter(val => typeof val === 'number' && isFinite(val))) : 0;
          case 'distance':
            return instance.distance.length > 0 ? Math.max(...instance.distance.filter(val => typeof val === 'number' && isFinite(val))) : 0;
          case 'duration':
            return instance.duration.length > 0 ? parseFloat(instance.duration[0]) : 0;
          default:
            return 0;
        }
      });

      let max = Math.max(...values.filter(val => isFinite(val))); // Compute the maximum value
      if (!isFinite(max) || isNaN(max)) {
        max = 0; // Set max to 0 if it's infinity or NaN
      }
      setCurrentBest(max)
    
    }catch (error) {
      console.error('Error fetching exercise instances:', error);
    }};
    
    const isGoalCompleted = currentBest >= goal;

    // Update the category to "completed" if the goal is completed
    const updatedCategory = isGoalCompleted ? "completed" : category;

      

  useEffect(() => {
    if (exercise) {
      fetchExerciseName();
      fetchExerciseInstances();
    }
  }, [exercise]);

  useEffect(() => {
    if (isGoalCompleted && category !== "completed") {
      // Construct data to update the goal category to "completed"
      const data: GoalUpdate = {
        category: "completed",
        goal: goal,
        exercise: exercise
      };

      // API call to update the goal
      const updateGoal = async () => {
        try {
          const updatedGoal = await goalsApi.updateGoals(goal_id, data) // Replace with your API call
          console.log("Goal is updated:", updatedGoal);
        } catch (error) {
          console.error("Error updating goal:", error);
        }
      };

      updateGoal();
    }
  }, [isGoalCompleted, category]);

  useFocusEffect(() => {
    // Fetch data again when the screen comes into focus
    fetchExerciseName();
    fetchExerciseInstances();
  });

  if (category == 'completed'){
    return (
      <>
        <Pressable
          onPress={() => {
            setFetched(false);
            router.push({
              pathname: `/goal/${goal_id}`,
              params: { title: exerciseName },
            });
          }}
        >
          <View style={[workoutCard.cardContainer, { borderColor: 'limegreen', borderWidth: 4, borderStyle: 'solid', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View>
              <Text style={workoutCard.cardTitle}>Exercise: {exerciseName}</Text>
              <Text style={workoutCard.cardTitle}>Goal: {goal} {track_type === 'weight' ? "lbs" : track_type === 'reps' ? "reps" : track_type === 'distance' ? "miles" : "mins"}</Text>
              <Text style={workoutCard.cardTitle}>Current Best: {currentBest} {track_type === 'weight' ? "lbs" : track_type === 'reps' ? "reps" : track_type === 'distance' ? "miles" : "mins"}</Text>
            </View>
            <Ionicons name="checkmark" size={35} color="limegreen" style={{ marginRight: 10 }} />
          </View>
        </Pressable>
      </>
    );
  }
  return (
    <>
      <Pressable
        onPress={() => {
          setFetched(false);
          router.push({
            pathname: `/goal/${goal_id}`,
            params: { title: exerciseName },
          });
        }}
      >
        <View style={workoutCard.cardContainer}>
          <Text style={workoutCard.cardTitle}>Exercise: {exerciseName}</Text>
          <Text style={workoutCard.cardTitle}>Goal: {goal} {track_type === 'weight' ? "lbs" : track_type === 'reps' ? "reps" : track_type === 'distance' ? "miles" : "mins"}</Text>
          <Text style={workoutCard.cardTitle}>Current Best: {currentBest} {track_type === 'weight' ? "lbs" : track_type === 'reps' ? "reps" : track_type === 'distance' ? "miles" : "mins"}</Text>
        </View>
      </Pressable>
    </>
  );
};

export default GoalCard;