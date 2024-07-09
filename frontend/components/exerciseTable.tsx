import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { ExerciseInstanceOut } from "../generated"; // Adjust the import path as necessary
import { COLORS } from "../constants";

interface ExerciseTableProps {
  exercise: ExerciseInstanceOut;
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({ exercise }) => {
  const tableHeaders = ["Set"];
  const tableData = [];

  // Calculate the maximum length of the arrays
  const maxLength = Math.max(
    exercise.reps.length,
    exercise.weight.length,
    exercise.distance.length,
    exercise.duration.length
  );

  // Dynamically add headers based on the exercise tracking flags
  if (exercise.exercise.track_reps) tableHeaders.push("Reps");
  if (exercise.exercise.track_weight) tableHeaders.push("Weight");
  if (exercise.exercise.track_distance) tableHeaders.push("Distance");
  if (exercise.exercise.track_duration) tableHeaders.push("Duration");

  // Construct the table data based on the maximum length
  for (let i = 0; i < maxLength; i++) {
    const rowData = [(i + 1).toString()]; // Set number

    if (exercise.exercise.track_reps)
      rowData.push(exercise.reps[i] > 0 ? exercise.reps[i].toString() : "N/A");
    if (exercise.exercise.track_weight)
      rowData.push(
        exercise.weight[i] > 0 ? exercise.weight[i].toString() : "N/A"
      );
    if (exercise.exercise.track_distance)
      rowData.push(
        exercise.distance[i] > 0 ? exercise.distance[i].toString() : "N/A"
      );
    if (exercise.exercise.track_duration)
      rowData.push(exercise.duration[i] !== "" ? exercise.duration[i] : "N/A");

    tableData.push(rowData);
  }

  // Conditionally render the table or "N/A"
  if (maxLength === 0) {
    return <Text style={styles.text}>N/A</Text>;
  } else {
    return (
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 0 }}>
          <Row
            data={tableHeaders}
            style={styles.header}
            textStyle={styles.text}
          />
          <Rows data={tableData} style={styles.row} textStyle={styles.text} />
        </Table>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.screen
  },
  header: { height: 30},
  text: { textAlign: "left", paddingTop: 5, fontWeight: "normal", color: COLORS.text},
  row: { height: 25, color: COLORS.text},
});

export default ExerciseTable;
