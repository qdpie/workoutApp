import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Overlay } from "@rneui/base";
import { COLORS } from "../constants/theme";
import { Button } from "@rneui/base";
import Icon from "react-native-vector-icons/FontAwesome";

interface ErrorModalProps {
  visible: boolean;
  onClose: () => void;
  errorMessage: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  onClose,
  errorMessage,
}) => {
  return (
    <Overlay isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name="exclamation-triangle" size={24} color={COLORS.danger} />
        </View>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <Button
          title="Close"
          onPress={onClose}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default ErrorModal;
