import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { workoutsApi } from "../../api";
import { WorkoutOut } from "../../generated";
import WorkoutCard from "../../components/WorkoutCard";
import { COLORS, SIZES } from "../../constants";
import { useFocusEffect } from "expo-router";
import { usersApi } from "../../api";
import { UserOut } from "../../generated";
import appStyles from "../../styles/appStyle";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const HomePage = () => {
  const [user, setUser] = useState<UserOut | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutOut[]>([]);
  const [fetched, setFetched] = useState<boolean>(false);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const getWorkouts = async () => {
    await workoutsApi
      .getWorkouts()
      .then((response) => {
        const today = new Date().getDay();
        const filteredWorkouts = response.data.filter((workout) =>
          workout.day_of_week.includes(today)
        );
        setWorkouts(filteredWorkouts);
        setFetched(true);
      })
      .catch((error) => {
        console.error(error);
        showError(`Workout Fetch Failed: ${error}`);
      });
  };

  const getUser = async () => {
    await usersApi
      .getCurrentUser()
      .then((response) => {
        setUser(response.data);
        setFetched(true);
      })
      .catch((error) => {
        console.error(error);
        showError(`User Fetch Failed: ${error}`);
      });
  };

  useFocusEffect(() => {
    if (!fetched) {
      getWorkouts();
      getUser();
    }
  });

  const getUserName = () => {
    if (fetched && user) {
      return user.first_name;
    }
    return null;
  };

  return (
    <SafeAreaView style={appStyles.screenContainer}>
      <ScrollView>
        <Text style={appStyles.screenText}>Welcome {getUserName()}! </Text>
        <Text style={appStyles.subtitleText}>Todays Workout:</Text>

        {workouts.length === 0 && (
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
              No Workouts Today. Rest Day!
            </Text>
            <Icon name="weight-lifter" size={48} color={"grey"} />
          </View>
        )}

        {workouts.map((workout, index) => (
          <WorkoutCard key={index} {...workout} setFetched={setFetched} />
        ))}
      </ScrollView>
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </SafeAreaView>
  );
};

export default HomePage;
