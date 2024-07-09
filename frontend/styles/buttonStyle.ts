import { StyleSheet } from "react-native";

import {
  COLORS,
  FONT,
  SIZES,
  SCREENSIZE,
  BORDERRADIUS,
  MARGINS,
} from "../constants/theme";
// import { BORDERRADIUS } from "../constants/theme";

const buttonStyles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: COLORS.primary,
    borderLeftWidth: SIZES.small,
    borderRightWidth: SIZES.small,
    borderColor: "transparent",
    borderRadius: 10,
  },
  workoutButton: {
    backgroundColor: COLORS.primary,
    borderLeftWidth: SIZES.small,
    borderRightWidth: SIZES.small,
    borderColor: "transparent",
    borderRadius: 10,
    height: 50,
  },
  activeWorkoutButton: {
    backgroundColor: COLORS.accent,
    borderLeftWidth: SIZES.small,
    borderRightWidth: SIZES.small,
    borderColor: "transparent",
    borderRadius: 10,
    height: 50,
  },
  headerButton: {
    backgroundColor: COLORS.primary,
  },
  headerButtonAccent: {
    backgroundColor: COLORS.accent,
  },
  linkButton: {
    color: COLORS.secondary,
    textDecorationLine: "underline",
  },
  signInButton: {
    color: COLORS.accent,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    padding: SIZES.small,
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.xSmall,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.text,
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: BORDERRADIUS.regular,
  },
  backButton: {
    backgroundColor: "purple",
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  dialogButton: {
    backgroundColor: COLORS.primary,
    marginBottom: 5,
  },
  buttonGroup: {
    backgroundColor: COLORS.tertiary,
  },
  // buttonContainer: {
  //   width: SCREENSIZE.width * 0.95,
  //   marginHorizontal: 50,
  //   marginVertical: 10,
  // },
  grouped7Button: {
    width: SCREENSIZE.width90 / 7,
    backgroundColor: COLORS.secondary,
  },
  grouped4Button: {
    width: SCREENSIZE.width90 / 4,
    backgroundColor: COLORS.secondary,
  },
  grouped3Button: {
    width: SCREENSIZE.width90 / 3,
    backgroundColor: COLORS.secondary,
  },
  grouped1Button: {
    backgroundColor: COLORS.secondary,
    width: SCREENSIZE.width90,
  },
});

export default buttonStyles;
