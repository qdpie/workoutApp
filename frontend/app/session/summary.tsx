import { router, useLocalSearchParams } from "expo-router";
import {
  ExerciseInstanceOut,
  ExerciseInstancesApi,
  SessionUpdate,
} from "../../generated";
import { useEffect, useState } from "react";
import { instanceApi, sessionsApi } from "../../api";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, ListItem, Text } from "@rneui/base";
import ExerciseTable from "../../components/exerciseTable";
import { COLORS } from "../../constants";
import buttonStyles from "../../styles/buttonStyle";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const Summary = () => {
  const { session_id, title, historical } = useLocalSearchParams<{
    session_id: string;
    title?: string;
    historical?: string;
  }>();
  const [exercises, setExercises] = useState<ExerciseInstanceOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState<number>(0);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const fetchExerciseInstances = async () => {
    setLoading(true);
    console.log("getting here...");
    await instanceApi
      .getExerciseInstances(session_id)
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.error(error);
        showError(`Exercise Fetch Failed: ${error}`);
      });
    setLoading(false);
  };

  useEffect(() => {
    console.log("getting here");
    fetchExerciseInstances();
  }, []);

  const endSession = async () => {
    await sessionsApi.getSession(session_id).then((response) => {
      const start_date_string = response.data.date;
      const start_date = new Date(start_date_string);
      const duration = new Date().getTime() - start_date.getTime();
      setDuration(duration);
    });
    const sessionUpdate: SessionUpdate = {
      active: false,
      duration_mins: duration,
    };
    await sessionsApi
      .updateSession(session_id, sessionUpdate)
      .then((response) => {
        setLoading(false);
        router.push({
          pathname: "workouts",
        });
      })
      .catch((error) => {
        console.error(error);
        showError(`Session Update Failed: ${error}`);
      });
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.screen,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <FlatList
        style={{ width: "100%", backgroundColor: COLORS.screen }} // Ensure FlatList matches the background
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <ListItem
              bottomDivider
              containerStyle={{
                backgroundColor: COLORS.screen, // Set ListItem background
              }}
            >
              <ListItem.Content>
                <ListItem.Title style={{ color: COLORS.text }}>
                  {item.exercise.name}
                </ListItem.Title>
                <ExerciseTable exercise={item} />
              </ListItem.Content>
            </ListItem>
          </View>
        )}
      />
      <Button
        title="Done"
        buttonStyle={buttonStyles.activeWorkoutButton}
        containerStyle={{ ...buttonStyles.buttonContainer }}
        loading={loading}
        onPress={() => {
          setLoading(true);
          if (historical === "true") {
            router.back();
          } else {
            endSession();
          }
        }}
      />
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default Summary;
