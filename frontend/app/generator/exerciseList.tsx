import React, { useState } from "react";
import ExerciseCard from "../../components/exerciseCard";
import { useGeneratedExercises } from "../../utils/providers/GeneratedExercisesContext";
import { Button } from "@rneui/base";
import buttonStyles from "../../styles/buttonStyle";
import { ExerciseResponse } from "../../api/generatorApi";
import { ExerciseCreate } from "../../generated";
import { ExerciseType } from "../../generated";
import { exercisesApi } from "../../api";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import { useFetchExercises } from "../../utils/providers/FetchExercisesContext";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const ExerciseList = () => {
  const { workout_id, title } = useLocalSearchParams<{
    workout_id: string;
    title?: string;
  }>();
  const { exercises } = useGeneratedExercises();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const [loadingState, setLoadingState] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseResponse[]
  >([]);
  const { setShouldFetch } = useFetchExercises();

  const addSelectedExercise = (exercise: ExerciseResponse) => {
    setSelectedExercises((prevExercises) => {
      const exists = prevExercises.some((ex) => ex.name === exercise.name);
      if (exists) {
        return prevExercises.filter((ex) => ex.name !== exercise.name);
      } else {
        return [...prevExercises, exercise];
      }
    });
  };

  const handleAddExercisesToWorkout = async () => {
    setLoadingState(true);
    selectedExercises.forEach((exercise) => {
      let apiExercise: ExerciseCreate = {
        name: exercise.name,
        type: exercise.type as ExerciseType,
        muscle: exercise.muscle,
        equipment: exercise.equipment,
        description: exercise.description,
      };
      exercisesApi
        .createExercise(workout_id, apiExercise)
        .then((response) => {
          setLoadingState(false);
          setShouldFetch(true);
        })
        .catch((err) => {
          console.log(err);
          setLoadingState(false);
          showError(`Exercise Creation Failed: ${err}`);
        });
    });
    router.push({
      pathname: `/workout/${workout_id}`,
      params: { title: title },
    });
  };

  if (!exercises) {
    return null; // or return a loading spinner, or some other placeholder component
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.screen,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ExerciseCard data={exercises} onAdd={addSelectedExercise} />
      <Button
        buttonStyle={buttonStyles.primaryButton}
        title="Add Selected Exercises"
        loading={loadingState}
        containerStyle={buttonStyles.buttonContainer}
        onPress={() => {
          handleAddExercisesToWorkout();
        }}
      />
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </SafeAreaView>
  );
};

export default ExerciseList;
