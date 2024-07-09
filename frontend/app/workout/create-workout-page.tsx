import { View, Alert } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "@rneui/themed";

import { WorkoutCreate } from "../../generated";
import { workoutsApi } from "../../api";
import appStyles from "../../styles/appStyle";
import buttonStyles from "../../styles/buttonStyle";
import { ButtonGroup, Text } from "@rneui/base";
import { COLORS } from "../../constants";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

//TODO - add button group for days of the week, add days of the week to workoutData when submitting,  should be a list [0,1,2,3,4,5,6] for each day of the week, only has number if it is selected

// Card Component
const CreateWorkoutPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const [selectedDays, setSelectedDays] = React.useState<number[]>([]);
  // const isPresented = router.canGoBack();  Only need to use if we want to include a back button

  const createNewWorkout = async (formData: any) => {
    const { title } = formData;

    const workoutData: WorkoutCreate = {
      title: title,
      day_of_week: selectedDays,
    };

    try {
      const response = await workoutsApi.createWorkout(workoutData);
      if (response.status === 200) {
        Alert.alert("Workout Created Successfully");
        let workoutId = response.data.workout_id;
        router.push({
          pathname: `/workout/${workoutId}`,
          params: { title: title },
        });
      } else {
        console.log(response.status);
        Alert.alert(`Workout Creation Failed: ${response.data}`);
        showError(`Workout Fetch Failed: ${response.data}`);

        return;
      }
    } catch (error) {
      console.error(error);
      Alert.alert(`Workout Creation Failed: ${error}`);
      showError(`Workout Fetch Failed: ${error}`);
    }
  };

  return (
    <View style={appStyles.formContainer}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={appStyles.text}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.title && `${errors.title.message}`}
            placeholder="Title"
          />
        )}
        name="title"
        rules={{
          required: "Title is required.",
        }}
        defaultValue={""}
      />
      <Text style={appStyles.text}>Days of the Week</Text>
      <ButtonGroup
        buttonStyle={buttonStyles.grouped7Button}
        selectedButtonStyle={buttonStyles.selectedButton}
        textStyle={{ color: COLORS.text }}
        buttons={["S", "M", "T", "W", "T", "F", "S"]}
        selectMultiple
        selectedIndexes={selectedDays}
        onPress={(value) => {
          setSelectedDays(value);
        }}
      />

      <Button
        title="Next"
        buttonStyle={buttonStyles.getStartedButton}
        containerStyle={buttonStyles.buttonContainer}
        onPress={handleSubmit(createNewWorkout)}
      />
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default CreateWorkoutPage;
