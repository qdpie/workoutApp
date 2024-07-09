import { StyleSheet } from "react-native";

import {
  COLORS,
  FONT,
  SIZES,
  SHADOWS,
  SCREENSIZE,
  BORDERRADIUS,
  MARGINS,
} from "../constants/theme";

const appStyles = StyleSheet.create({
  container: {
    width: SCREENSIZE.width90,
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDERRADIUS.regular,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    fontColor: COLORS.white,
    textAlign: "center",
    shadow: SHADOWS.medium,
  },
  buttonContainer: {
    borderRadius: BORDERRADIUS.regular,
    backgroundColor: COLORS.primary,
    height: SCREENSIZE.height * 0.05,
    width: SCREENSIZE.width90,
    alignItems: "center",
    justifyContent: "center",
    margin: MARGINS.small,
    shadowOffset: SHADOWS.medium.shadowOffset,
    shadowColor: SHADOWS.medium.shadowColor,
    shadowRadius: SHADOWS.medium.shadowRadius,
    shadowOpacity: SHADOWS.medium.shadowOpacity,
    elevation: SHADOWS.medium.elevation,
    pressedColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.white,
    fontStyle: "normal",
    fontSize: SIZES.xLarge,
    textAlign: "center",
    verticalAlign: "middle",
  },
  screenContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.screen,
    justifyContent: "center",
  },
  screenText: {
    color: COLORS.white,
    fontStyle: "normal",
    fontSize: SIZES.xLarge,
    verticalAlign: "middle",
    marginTop: MARGINS.small,
    marginBottom: MARGINS.small,
  },

  headerContainer: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.screen,
    padding: SIZES.medium,
  },
  goalCard: {
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
    marginVertical: SIZES.small,
    borderRadius: SIZES.xSmall,
  },
  goalTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  goalDescription: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: SIZES.medium,
  },
  categoryButton: {
    backgroundColor: COLORS.secondary,
    padding: SIZES.small,
    borderRadius: SIZES.xSmall,
    marginHorizontal: SIZES.small,
  },
  activeCategory: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xSmall,
    borderRadius: SIZES.xSmall,
    marginVertical: SIZES.small,
    height: SCREENSIZE.height * 0.05,
    borderColor: "black",
  },

  addButton: {
    backgroundColor: COLORS.accent,
    padding: SIZES.medium,
    borderRadius: SIZES.xSmall,
    alignItems: "center",
  },
  addButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  pageContainer: {
    width: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.large,
  },
  formContainer: {
    backgroundColor: COLORS.screen,
    flex: 1,
    justifyContent: "center",
    padding: SIZES.large,
  },
  // bottomContainer: {
  //   top: "35%",
  // },
  text: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    marginTop: SIZES.xSmall,
    marginBottom: SIZES.xSmall,
  },
  largeText: {
    color: COLORS.text,
    fontSize: SIZES.large,
    marginTop: SIZES.xSmall,
  },
  titleText: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
  subtitleText: {
    color: COLORS.text,
    fontSize: SIZES.xLarge,
    fontStyle: "normal",
  },
  listItemContainer: {
    // width: SCREENSIZE.width90,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.secondary,
  },
  overlayStyle: {
    backgroundColor: COLORS.secondary,
  },
  picker: {
    width: "100%",
    fontSize: SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    backgroundColor: COLORS.screen,
    marginTop: SIZES.small,
  },
  switch: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.small,
  },
});

export default appStyles;
