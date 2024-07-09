import { View } from "react-native";
import React, { useState } from "react";
import { Button, Input } from "@rneui/themed";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";

import buttonStyles from "../styles/buttonStyle";
import auth from "../auth/auth";
import appStyles from "../styles/appStyle";
import useErrorModal from "../utils/hooks/useErrorModal";
import ErrorModal from "../components/error";

const LoginModal = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const [loadingState, setLoadingState] = useState(false);

  const onSignIn = async (formData: any) => {
    const { email, password } = formData;

    try {
      setLoadingState(true);
      const response = await auth.login(email, password);
      setLoadingState(false);
      if (auth.isAuthenticated()) router.replace("homepage");
      else showError(`Login Failed, try again: ${response}`);
    } catch {
      console.log("Login Failed");
      setLoadingState(false);
      showError("Login Failed");
    }
  };

  return (
    <View style={appStyles.formContainer}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            autoCapitalize="none"
            style={appStyles.text}
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.email && `${errors.email.message}`}
          />
        )}
        name="email"
        rules={{
          required: "Email is required.",
        }}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={appStyles.text}
            placeholder="Password"
            secureTextEntry={true}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            errorMessage={errors.password && `${errors.password.message}`}
          />
        )}
        name="password"
        rules={{
          required: "Password is required.",
        }}
        defaultValue=""
      />
      <Button
        title="Next"
        loading={loadingState}
        buttonStyle={buttonStyles.getStartedButton}
        containerStyle={buttonStyles.buttonContainer}
        onPress={handleSubmit(onSignIn)}
      />
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

export default LoginModal;
