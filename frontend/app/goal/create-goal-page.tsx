import { Button, Text } from "@rneui/base";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Alert } from "react-native";
import appStyles from "../../styles/appStyle";
import { Input } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
import { Platform } from "react-native";
import buttonStyles from "../../styles/buttonStyle";
import { COLORS } from "../../constants";
import { ScrollView } from "react-native-gesture-handler";
import { exercisesApi } from "../../api";
import { GoalCreate, TrackType } from "../../generated";
import { goalsApi } from "../../api";
import { ExerciseOut } from "../../generated";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const CreateGoalPage = () => {
  const { title } = useLocalSearchParams<{
    title?: string;
  }>();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({ mode: "onChange" });

  const [loadingState, setLoadingState] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [selectedGoalOption, setSelectedGoalOption] =
    useState<TrackType | null>("reps");
  const scrollViewRef = useRef(null);

  const fetchExercises = async () => {
    try {
      const response = await exercisesApi.getAllExercises();
      const fetchedExercises = response.data;
      setExercises(fetchedExercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      showError(`Error fetching exercises: ${error}`);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (exercises[0]) {
      setSelectedExercise(exercises[0].exercise_id);
    }
  }, [exercises]);

  const createNewGoal = async (formData: any) => {
    setLoadingState(true);
    const { goal } = formData;

    if (!selectedExercise || !selectedGoalOption || !goal) {
      Alert.alert(
        "Please select Exercise, Goal Option, and Goal before proceeding."
      );
      return;
    }

    const goalData: GoalCreate = {
      category: "pr",
      goal: goal,
      track_type: selectedGoalOption,
      exercise: selectedExercise,
    };

    try {
      const response = await goalsApi.createGoal(goalData);
      if (response.status === 200) {
        Alert.alert("Goal Created Successfully");
        console.log("Goal Created Successfully");
        router.push({
          pathname: `/goals`,
        });
      } else {
        console.log(response.status);
        showError(`Error fetching exercises: ${response.data}`);

        Alert.alert(`PR Goal Creation Failed: ${response.data}`);
      }
    } catch (error) {
      console.error(error);
      showError(`Error fetching exercises: ${error}`);
      Alert.alert(`PR Goal Creation Failed: ${error}`);
    }
  };

  return (
    <View style={appStyles.formContainer}>
      <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
        <Text style={{ ...appStyles.titleText, color: "white" }}>
          Exercise:
        </Text>
        <Picker
          style={{
            ...appStyles.picker,
            height: Platform.OS === "ios" ? 125 : 40,
            color: "white",
          }}
          itemStyle={{
            ...appStyles.picker,
            height: Platform.OS === "ios" ? 125 : 40,
          }}
          dropdownIconColor={Platform.OS === "android" ? COLORS.accent : ""}
          selectedValue={selectedExercise}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedExercise(itemValue);
          }}
        >
          {exercises.map((exercise) => (
            <Picker.Item
              key={exercise.exercise_id}
              label={exercise.name}
              value={exercise.exercise_id}
            />
          ))}
        </Picker>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...appStyles.titleText,
              color: "white",
            }}
          >
            Goal Options:
          </Text>
        </View>

        <Picker
          style={{
            ...appStyles.picker,
            height: Platform.OS === "ios" ? 125 : 40,
            color: "white",
          }}
          itemStyle={{
            ...appStyles.picker,
            height: Platform.OS === "ios" ? 125 : 40,
          }}
          dropdownIconColor={Platform.OS === "android" ? COLORS.accent : ""}
          selectedValue={selectedGoalOption}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedGoalOption(itemValue);
          }}
        >
          <Picker.Item label="Reps" value="reps" />
          <Picker.Item label="Weight" value="weight" />
          <Picker.Item label="Duration (mins)" value="duration" />
          <Picker.Item label="Distance (miles)" value="distance" />
        </Picker>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              style={appStyles.text}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              errorMessage={errors.goal && `${errors.goal.message}`}
              placeholder="Goal"
            />
          )}
          name="goal"
          rules={{
            required: "Goal is required.",
            pattern: {
              value: /^\d*$/, // Regular expression to match numbers only
              message: "Please enter a valid number for the goal.",
            },
          }}
          defaultValue=""
        />

        <Text
          style={{
            ...appStyles.text,
            color: "white",
          }}
        >
          *If the 'Exercise' picker is empty, it means you have not saved any
          exercises. A PR goal can only be created if you have generated a
          workout with exercises in it. If you have not done so, please navigate
          to the 'Workout' tab and create a workout.
        </Text>
      </ScrollView>

      <Button
        title="Next"
        buttonStyle={buttonStyles.getStartedButton}
        containerStyle={buttonStyles.buttonContainer}
        onPress={handleSubmit(createNewGoal)}
      />
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default CreateGoalPage;
