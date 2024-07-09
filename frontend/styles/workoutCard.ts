import { COLORS, SCREENSIZE } from "../constants";
import { StyleSheet } from "react-native";

const workoutCard = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    minHeight: 100,
    backgroundColor: COLORS.secondary,
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
    width: SCREENSIZE.width90,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: COLORS.text,
  },
  inputContainer: {
    padding: 0,
    marginBottom: 0,
    flex: 1, // This makes each input flexibly expand to fill the available space
    marginHorizontal: 10, // Adds a little space between each input
  },
  inputContainerTitle: {
    padding: 0,
    marginBottom: 0,
    marginHorizontal: 10, // Adds a little space between each input
  },
  input: {
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  setNumber: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 10,
    color: COLORS.text,
    paddingTop: 11,
    marginHorizontal: 10, // Adds a little space between each input
    marginBottom: 10,

  },
});

export default workoutCard;
