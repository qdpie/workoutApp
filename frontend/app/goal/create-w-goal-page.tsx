import React, { useState } from "react";
import { View, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import appStyles from "../../styles/appStyle";
import buttonStyles from "../../styles/buttonStyle";
import { Button, Input } from "@rneui/themed";
import { GoalCreate } from "../../generated";
import { goalsApi } from "../../api";
import { UserOut } from "../../generated";
import { usersApi } from "../../api";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const CreateGoalPage = () => {
  const [user, setUser] = useState<UserOut | null>(null);
  const [fetched, setFetched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const getUser = async () => {
    await usersApi
      .getCurrentUser()
      .then((response) => {
        setUser(response.data);
        setFetched(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        showError(`User Fetch Failed: ${error}`);
      });
  };

  useFocusEffect(() => {
    if (!fetched) {
      getUser().then(() => {
        setLoading(false);
      });
    }
  });

  // const isPresented = router.canGoBack();  Only need to use if we want to include a back button

  const createNewGoal = async (formData: any) => {
    const { goal } = formData;
    const goalData: GoalCreate = {
      category: "weight",
      goal: goal,
      track_type: null,
      exercise: null,
    };

    try {
      const response = await goalsApi.createGoal(goalData);
      if (response.status === 200) {
        Alert.alert("Goal Created Successfully");
        console.log("Goal Created Successfully");
        router.push({
          pathname: `/goals`,
          params: { goal: goal },
        });
      } else {
        console.log(response.status);
        Alert.alert(`Weight Goal Creation Failed: ${response.data}`);
        showError(`Workout Fetch Failed: ${response.data}`);
        return;
      }
    } catch (error) {
      console.error(error);
      Alert.alert(`Weight Goal Creation Failed: ${error}`);
      showError(`Weight Goal Creation Failed: ${error}`);
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
            errorMessage={errors.goal && `${errors.goal.message}`}
            placeholder="Goal Weight"
          />
        )}
        name="goal"
        rules={{
          required: "Goal Weight is required.",
          pattern: {
            value: /^\d*$/, // Regular expression to match numbers only
            message: "Please enter a valid number for the goal.",
          },
        }}
        defaultValue={""}
      />

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
