import { View, Text, Platform } from "react-native";
import { ExerciseOut, SessionCreate, SessionOut } from "../../generated";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { workoutsApi, exercisesApi, sessionsApi } from "../../api";
import { SpeedDial } from "@rneui/themed";
import { COLORS, SIZES } from "../../constants";
import { router } from "expo-router";
import { Dialog } from "@rneui/themed";
import { Button } from "@rneui/themed";
import buttonStyles from "../../styles/buttonStyle";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import LoadingCard from "../../components/loadingCard";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseCard from "../../components/exerciseCard";
import { useFetchExercises } from "../../utils/providers/FetchExercisesContext";
import { set } from "react-hook-form";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

// Card Component
const WorkoutPage = () => {
  const { workout_id, title } = useLocalSearchParams<{
    workout_id: string;
    title?: string;
  }>();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const { shouldFetch, setShouldFetch } = useFetchExercises();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeSession, setActiveSession] = useState<Boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [exercises, setExercises] = useState<ExerciseOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkActive, setCheckActive] = useState(true);

  const toggleDialog = () => setVisible(!visible);

  const checkForActiveSession = async () => {
    const response = await sessionsApi.getActiveSessions();
    if (response.data.length > 0) {
      response.data.forEach((session: SessionOut) => {
        if (session.workout.workout_id === workout_id) {
          setActiveSession(true);
          setActiveSessionId(session.session_id);
        }
      });
    }
  };

  const fetchExercises = async () => {
    setLoading(true);
    const response = await exercisesApi.getExercises(workout_id);
    setExercises(response.data);
    setLoading(false);
  };

  const handleDelete = async () => {
    await workoutsApi.deleteWorkout(workout_id);
    router.push("/workouts");
  };

  const handleGenerateExercises = async () => {
    router.push({
      pathname: "/generator/exerciseGenerator",
      params: { workout_id: workout_id, title: title },
    });
  };

  const handleHistory = async () => {
    router.push({
      pathname: "/session/history",
      params: { workout_id: workout_id, title: title },
    });
  };

  const onEdit = (exercise: ExerciseOut) => {
    router.push({
      pathname: "/workout/editExercise",
      params: { exerciseId: exercise.exercise_id, title: exercise.name },
    });
  };

  const onDelete = async (id: string) => {
    await exercisesApi.deleteExercise(id);
    fetchExercises();
  };

  const startSession = async () => {
    const sessionCreate: SessionCreate = {
      date: new Date().toISOString(),
      active: true,
    };
    await sessionsApi
      .createSession(workout_id, sessionCreate)
      .then((result) => {
        setCheckActive(true);
        router.push({
          pathname: `/session/${result.data.session_id}`,
          params: { title: title, workout_id: workout_id },
        });
      })
      .catch((err) => {
        console.log(err);
        showError(`Failed to start session: ${err}`);
      });
  };

  useEffect(() => {
    if (checkActive) {
      checkForActiveSession();
      setCheckActive(false);
    }
  }, [checkActive]);

  useEffect(() => {
    fetchExercises();
    checkForActiveSession();
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchExercises();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.screen,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {exercises.length === 0 && (
        <View
          style={{
            flex: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "grey",
              fontSize: SIZES.large,
            }}
          >
            No Exercises Found. Create your own or use the generator.
          </Text>
          <Icon name="running" size={48} color={"grey"} />
        </View>
      )}

      <ExerciseCard
        data={exercises}
        onEdit={onEdit}
        onDelete={onDelete}
        display={true}
      />

      {activeSession && (
        <Button
          title="Resume Workout"
          buttonStyle={buttonStyles.activeWorkoutButton}
          containerStyle={{
            ...buttonStyles.buttonContainer,
            marginBottom: Platform.OS === "ios" ? 30 : 10,
            paddingBottom: Platform.OS === "ios" ? 20 : 10,
          }}
          onPress={() => {
            setCheckActive(true);
            router.push({
              pathname: `/session/${activeSessionId}`,
              params: { title: title, workout_id: workout_id },
            });
          }}
        />
      )}
      {!activeSession && (
        <Button
          disabled={exercises.length === 0}
          disabledStyle={{ backgroundColor: "grey" }}
          title="Start Workout"
          buttonStyle={buttonStyles.workoutButton}
          containerStyle={{
            ...buttonStyles.buttonContainer,
            marginBottom: Platform.OS === "ios" ? 30 : 10,
            paddingBottom: Platform.OS === "ios" ? 20 : 10,
          }}
          onPress={() => startSession()}
        />
      )}

      <SpeedDial
        style={{ zIndex: 1 }}
        color={COLORS.primary}
        isOpen={open}
        icon={<Ionicons name="ellipsis-vertical" size={24} color="white" />}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Add Exercises"
          titleStyle={{ color: COLORS.text, backgroundColor: COLORS.screen }}
          color={COLORS.primary}
          onPress={() => handleGenerateExercises()}
        />
        <SpeedDial.Action
          icon={{ name: "history", color: "#fff" }}
          title="Workout History"
          titleStyle={{ color: COLORS.text, backgroundColor: COLORS.screen }}
          color={COLORS.primary}
          onPress={() => handleHistory()}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          title="Delete Workout"
          titleStyle={{ color: COLORS.text, backgroundColor: COLORS.screen }}
          color={"red"}
          onPress={() => toggleDialog()}
        />
      </SpeedDial>
      <Dialog
        overlayStyle={{ backgroundColor: COLORS.background }}
        isVisible={visible}
        onBackdropPress={toggleDialog}
      >
        <Dialog.Title
          titleStyle={{ color: COLORS.text }}
          title="Delete Workout?"
        />
        <Text style={{ color: COLORS.text }}>
          This action cannot be undone.
        </Text>
        <Button
          containerStyle={buttonStyles.buttonContainer}
          color={"red"}
          title={"Delete"}
          onPress={() => handleDelete()}
        />
      </Dialog>
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default WorkoutPage;
