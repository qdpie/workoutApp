import { View, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "@rneui/themed";

import { usersApi } from "../api";
import buttonStyles from "../styles/buttonStyle";
import { UserAuth } from "../generated";
import appStyles from "../styles/appStyle";
import Validators from "../utils/validators";
import auth from "../auth/auth";
import ErrorModal from "../components/error";
import useErrorModal from "../utils/hooks/useErrorModal";

const RegisterModal = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const [loadingState, setLoadingState] = useState(false);

  const createNewUser = async (formData: any) => {
    const { email, username, password, confirmPassword } = formData;

    const userData: UserAuth = {
      username: username,
      password: password,
      email: email,
    };

    try {
      setLoadingState(true);
      const response = await usersApi.createUser(userData);
      setLoadingState(false);
      if (response.status === 200) {
        Alert.alert("User Created Successfully");
        await auth.login(email, password);
        if (auth.isAuthenticated()) {
          router.replace("user-setup-modal");
        } else {
          router.replace("login-modal");
        }
      } else {
        console.log(response);
        showError(`User Creation Failed: ${response}`);
        return;
      }
    } catch (error) {
      setLoadingState(false);
      console.error(error);
      const detail = error.response.data.detail;
      if (detail) {
        console.log(detail);
        showError(`User Creation Failed: ${detail}`);
      } else {
        // Fallback to displaying the error message if parsing fails
        showError(`User Creation Failed: ${detail}`);
      }
    }
  };

  return (
    <View style={appStyles.formContainer}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            autoCapitalize="none"
            inputMode="email"
            style={appStyles.text}
            label="Create New Account"
            labelStyle={{
              textAlign: "center",
              marginBottom: 20,
              fontSize: 24,
              fontWeight: "bold",
            }}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.email && `${errors.email.message}`}
            placeholder="Email"
          />
        )}
        name="email"
        rules={{
          required: "Email is required.",
          validate: (value) =>
            Validators.emailValidator(value) || "Invalid email address.",
        }}
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
            errorMessage={errors.username && `${errors.username.message}`}
            placeholder="Username"
          />
        )}
        name="username"
        rules={{
          required: "Username is required.",
          minLength: {
            value: 5,
            message: "Username must be at least 5 characters.",
          },
        }}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={appStyles.text}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.password && `${errors.password.message}`}
            placeholder="Password"
            secureTextEntry={true}
          />
        )}
        name="password"
        rules={{
          required: "Password is required.",
          minLength: {
            value: 5,
            message: "Password must be at least 5 characters.",
          },
        }}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={appStyles.text}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={
              (errors.confirmPassword && `${errors.confirmPassword.message}`) ||
              (errors.password && `${errors.password.message}`)
            }
            placeholder="Confirm Password"
            secureTextEntry={true}
          />
        )}
        name="confirmPassword"
        rules={{
          required: "Confirm Password is required.",
          validate: (value) =>
            value === getValues("password") || "The passwords do not match.",
        }}
        defaultValue=""
      />
      <Button
        title="Next"
        loading={loadingState}
        buttonStyle={buttonStyles.getStartedButton}
        containerStyle={buttonStyles.buttonContainer}
        onPress={handleSubmit(createNewUser)}
      />

      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default RegisterModal;
