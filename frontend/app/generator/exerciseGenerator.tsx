import { Text, SafeAreaView, View, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import MuscleGenerator from "../../components/muscleGenerator";
import { Button } from "@rneui/themed";
import { exercisesApi, generatorApi } from "../../api";
import buttonStyles from "../../styles/buttonStyle";
import { ButtonGroup } from "@rneui/base";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { COLORS } from "../../constants";
import { useGeneratedExercises } from "../../utils/providers/GeneratedExercisesContext";
import { Divider } from "@rneui/themed";
import appStyles from "../../styles/appStyle";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const ExerciseGenerator = () => {
  const { workout_id, title } = useLocalSearchParams<{
    workout_id: string;
    title?: string;
  }>();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const { exercises, setExercises } = useGeneratedExercises();

  // const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState(0);

  // const handleSelectedMusclesChange = useCallback((newSelectedMuscles) => {
  //   setSelectedMuscles(newSelectedMuscles);
  // }, []);

  // const handleGenerateExercises = async () => {
  //   setLoadingState(true);

  // setExercises([]);

  // if (selectedIndex === 0) {
  //   generatorApi
  //     .getExercisesByType("cardio")
  //     .then((response) => {
  //       setExercises((prevExercises) => [...prevExercises, ...response.data]);
  //       setLoadingState(false);
  //     })
  //     .catch((err) => console.log(err));
  //   return;
  // }
  // if (selectedIndex === 2) {
  //   generatorApi
  //     .getExercisesByType("stretching")
  //     .then((response) => {
  //       setExercises((prevExercises) => [...prevExercises, ...response.data]);
  //       setLoadingState(false);
  //     })
  //     .catch((err) => console.log(err));
  //   return;
  // }

  // if (selectedIndex === 3) {
  //   generatorApi
  //     .getExercisesByType("plyometrics")
  //     .then((response) => {
  //       setExercises((prevExercises) => [...prevExercises, ...response.data]);
  //       setLoadingState(false);
  //     })
  //     .catch((err) => console.log(err));
  //   return;
  // }

  // selectedMuscles.forEach((muscle) => {
  //   generatorApi
  //     .getExercisesByMuscle(muscle)
  //     .then((response) => {
  //       setExercises((prevExercises) => [...prevExercises, ...response.data]);
  //       setLoadingState(false);
  //     })
  //     .catch((err) => console.log(err));
  // });
  // };

  const setExistingExercises = async () => {
    setLoadingState(true);
    await exercisesApi
      .getAllExercises()
      .then((response) => {
        setExercises(response.data);
        setLoadingState(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingState(false);
        showError(`Failed to fetch exercises: ${err}`);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.screen,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Pressable
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            setExercises([]);
            router.push({
              pathname: "/generator/generateForm",
              params: { workout_id: workout_id, title: title },
            });
          }}
        >
          <Text style={appStyles.largeText}>
            Generate Exercises with FIT AI
          </Text>
        </Pressable>

        <Divider style={{ width: "100%" }} color="darkgrey" />

        <Pressable
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            setExercises([]);
            setExistingExercises();
            router.push({
              pathname: "/generator/exerciseList",
              params: { workout_id: workout_id, title: title },
            });
          }}
        >
          <Text style={appStyles.largeText}>Add Existing Exercises</Text>
        </Pressable>

        <Divider style={{ width: "100%" }} color="darkgrey" />

        <Pressable
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            router.push({
              pathname: "/generator/createExercise",
              params: { workout_id: workout_id, title: title },
            });
          }}
        >
          <Text style={appStyles.largeText}>Create New Exercise</Text>
        </Pressable>
      </View>
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </SafeAreaView>
  );
};

export default ExerciseGenerator;
