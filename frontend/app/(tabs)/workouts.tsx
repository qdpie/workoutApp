import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB } from "@rneui/themed";
import { workoutsApi } from "../../api";
import { WorkoutOut } from "../../generated";
import WorkoutCard from "../../components/WorkoutCard";
import { COLORS, SIZES } from "../../constants";
import { router, useFocusEffect } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LoadingCard from "../../components/loadingCard";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const Workouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutOut[]>([]);
  const [fetched, setFetched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const getWorkouts = async () => {
    await workoutsApi
      .getWorkouts()
      .then((response) => {
        setWorkouts(response.data);
        setFetched(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        showError(`Workout Fetch Failed: ${error}`);
      });
  };

  useFocusEffect(() => {
    if (!fetched) {
      getWorkouts();
    }
  });

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.screen,
      }}
    >
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
            No Workouts Found. Get started by hitting the plus button
          </Text>
          <Icon name="weight-lifter" size={48} color={"grey"} />
        </View>
      )}
      <FAB
        style={{
          zIndex: 1,
        }}
        placement="right"
        onPress={() => {
          setFetched(false);
          router.push("/workout/create-workout-page");
        }}
        icon={{ name: "add", color: COLORS.text }}
        color={COLORS.primary}
      />
      <View
        style={{
          flex: 1,
          margin: SIZES.medium,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <ScrollView>
          {workouts.map((workout, index) => (
            <WorkoutCard key={index} {...workout} setFetched={setFetched} />
          ))}
        </ScrollView>
      </View>
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default Workouts;
