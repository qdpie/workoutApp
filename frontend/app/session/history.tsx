import { Text } from "@rneui/base";
import { SessionWorkoutOut } from "../../generated";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { sessionsApi } from "../../api";
import { useLocalSearchParams } from "expo-router";
import SessionCard from "../../components/sessionCard";
import { COLORS } from "../../constants";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const History = () => {
  const [sessions, setSessions] = useState<SessionWorkoutOut[]>([]);
  const { session_id, title, workout_id } = useLocalSearchParams<{
    session_id: string;
    title?: string;
    workout_id?: string;
  }>();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const fetchSessions = async () => {
    await sessionsApi
      .getWorkoutSessions(workout_id)
      .then((response) => {
        console.log(response.data);
        setSessions(response.data);
      })
      .catch((error) => {
        console.error(error);
        showError(`Session Fetch Failed: ${error}`);
      });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const onDelete = async (id: string) => {
    await sessionsApi.deleteSession(id);
    fetchSessions();
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.screen,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SessionCard data={sessions} title={title} onDelete={onDelete} />
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default History;
