import { Button, ButtonGroup, Input, Text } from "@rneui/base";
import { Pressable, StyleSheet, View } from "react-native";
import appStyles from "../styles/appStyle";
import { Controller, set, useForm } from "react-hook-form";
import buttonStyles from "../styles/buttonStyle";
import { usersApi } from "../api";
import { useEffect, useState } from "react";
import { UserOut, UserUpdate } from "../generated";
import { router } from "expo-router";
import DatePicker from "react-native-modal-datetime-picker";
import ErrorModal from "../components/error";
import useErrorModal from "../utils/hooks/useErrorModal";

const UserSetupModal = () => {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const user = await usersApi
      .getCurrentUser()
      .then((res) => setUser(res.data))
      .catch((error) => {
        console.error(error);
        showError(`User Fetch Failed: ${error}`);
      });
  };

  const updateUserData = async (formData: any) => {
    setLoadingState(true);
    const { firstName, lastName, gender, height, weight } = formData;

    const updatedUser: UserUpdate = {
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      birth_date: null, // readd from form when implementing birthdate picker
      gender: gender,
      height_in: height,
      weight: weight,
    };

    await usersApi
      .updateCurrentUser(updatedUser)
      .then((res) => {
        setLoadingState(false);
        console.log("getting here");
        router.replace("homepage");
      })
      .catch((error) => {
        setLoadingState(false);
        console.error(error);
        showError(`User Creation Failed: ${error}`);
      });
  };

  return (
    <View style={appStyles.formContainer}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={appStyles.text}
            label="Additional User Setup (Optional)"
            labelStyle={{
              textAlign: "center",
              marginBottom: 20,
              fontSize: 24,
              fontWeight: "bold",
            }}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.firstName && `${errors.firstName.message}`}
            placeholder="First Name"
          />
        )}
        name="firstName"
        defaultValue={""}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={appStyles.text}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.lastName && `${errors.lastName.message}`}
            placeholder="Last Name"
          />
        )}
        name="lastName"
        defaultValue=""
      />
      {/* Commenting out birthdate for now to allow running on web */}
      {/*
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Button
              buttonStyle={{}}
              title={value ? value.toDateString() : "Select Birth Date"}
              type="clear"
              onPress={() => setIsDatePickerVisible(true)}
            />
            <Input
              style={appStyles.text}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              errorMessage={errors.birthDate && `${errors.birthDate.message}`}
              placeholder="Birth Date"
            />
            <DatePicker
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => {
                setIsDatePickerVisible(false);
                onChange(date);
              }}
              onCancel={() => setIsDatePickerVisible(false)}
            />
          </View>
        )}
        name="birthDate"
        defaultValue={null}
      />

      */}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Height (in)"
            keyboardType="numeric"
            returnKeyType="done"
            style={appStyles.text}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.height && `${errors.height.message}`}
            placeholder="Height"
          />
        )}
        name="height"
        defaultValue={0}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Weight (lb)"
            keyboardType="numeric"
            returnKeyType="done"
            style={appStyles.text}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.weight && `${errors.weight.message}`}
            placeholder="Weight"
          />
        )}
        name="weight"
        defaultValue={0}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <ButtonGroup
            selectedButtonStyle={buttonStyles.grouped3Button}
            buttons={["male", "female", "other"]}
            selectedIndex={value === "male" ? 0 : value === "female" ? 1 : 2}
            onPress={(index) => {
              const gender =
                index === 0 ? "male" : index === 1 ? "female" : "other";
              onChange(gender);
            }}
          />
        )}
        name="gender"
        defaultValue="other"
      />
      {/* TODO -- add weight and height to this form with number pickers */}
      <Button
        title="Next"
        loading={loadingState}
        buttonStyle={buttonStyles.getStartedButton}
        containerStyle={buttonStyles.buttonContainer}
        onPress={handleSubmit(updateUserData)}
      />
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default UserSetupModal;

const styles = StyleSheet.create({
  datePickerText: {
    marginBottom: 10,
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
