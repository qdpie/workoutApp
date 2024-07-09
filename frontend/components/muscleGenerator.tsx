import { ButtonGroup } from "@rneui/themed";
import { View } from "react-native";
import React, { useState, useEffect } from "react";

import buttonStyles from "../styles/buttonStyle";
import { Muscle } from "../generated";
import { COLORS } from "../constants";

interface MuscleGeneratorProps {
  onSelectedMusclesChange: (selectedMuscles: Muscle[]) => void;
}

const MuscleGenerator = ({ onSelectedMusclesChange }: MuscleGeneratorProps) => {
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedIndexes, setSelectedIndexes] = useState<number[][]>([
    [], // selectedIndexes1
    [], // selectedIndexes2
    [], // selectedIndexes3
    [], // selectedIndexes4
    [], // selectedIndexes5
    [], // selectedIndexes6
  ]);

  const handleSelectedIndexesChange = (
    index: number,
    newSelectedIndexes: number[]
  ) => {
    setSelectedIndexes((prevSelectedIndexes) => {
      const newSelectedIndexesArray = [...prevSelectedIndexes];
      newSelectedIndexesArray[index] = newSelectedIndexes;
      return newSelectedIndexesArray;
    });
  };

  useEffect(() => {
    const selectedMuscles: Muscle[] = [];

    selectedIndexes[0].forEach((index) => {
      selectedMuscles.push(Object.values(Muscle)[index]);
    });

    selectedIndexes[1].forEach((index) => {
      selectedMuscles.push(Object.values(Muscle)[index + 3]);
    });

    selectedIndexes[2].forEach((index) => {
      selectedMuscles.push(Object.values(Muscle)[index + 6]);
    });

    selectedIndexes[3].forEach((index) => {
      selectedMuscles.push(Object.values(Muscle)[index + 9]);
    });

    selectedIndexes[4].forEach((index) => {
      selectedMuscles.push(Object.values(Muscle)[index + 12]);
    });

    selectedIndexes[5].forEach((index) => {
      selectedMuscles.push(Object.values(Muscle)[index + 15]);
    });

    onSelectedMusclesChange(selectedMuscles);
  }, [selectedIndexes, onSelectedMusclesChange]);

  return (
    <View
      style={{
        width: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      <ButtonGroup
        buttonStyle={buttonStyles.grouped4Button}
        selectedButtonStyle={buttonStyles.selectedButton}
        textStyle={{ color: COLORS.text }}
        buttons={["Push", "Pull", "Legs", "Custom"]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
          if (value === 0) {
            setSelectedIndexes([
              [], // selectedIndexes1
              [2], // selectedIndexes2
              [], // selectedIndexes3
              [0], // selectedIndexes4
              [], // selectedIndexes5
              [0], // selectedIndexes6
            ]);
          }
          if (value === 1) {
            setSelectedIndexes([
              [], // selectedIndexes1
              [0], // selectedIndexes2
              [0], // selectedIndexes3
              [1, 2], // selectedIndexes4
              [], // selectedIndexes5
              [], // selectedIndexes6
            ]);
          }
          if (value === 2) {
            setSelectedIndexes([
              [], // selectedIndexes1
              [1], // selectedIndexes2
              [1, 2], // selectedIndexes3
              [], // selectedIndexes4
              [1], // selectedIndexes5
              [], // selectedIndexes6
            ]);
          }
          if (value === 3) {
            setSelectedIndexes([
              [], // selectedIndexes1
              [], // selectedIndexes2
              [], // selectedIndexes3
              [], // selectedIndexes4
              [], // selectedIndexes5
              [], // selectedIndexes6
            ]);
          }
        }}
      />
      <ButtonGroup
        buttonStyle={buttonStyles.grouped3Button}
        selectedButtonStyle={buttonStyles.selectedButton}
        textStyle={{ color: COLORS.text }}
        buttons={["Abdominals", "Abductors", "Adductors"]}
        selectMultiple
        selectedIndexes={selectedIndexes[0]}
        onPress={(value) => {
          handleSelectedIndexesChange(0, value);
        }}
        // buttonContainerStyle={buttonStyles.buttonContainer}
        // buttonStyle={buttonStyles.selectButton}
      />
      <ButtonGroup
        buttonStyle={buttonStyles.grouped3Button}
        selectedButtonStyle={buttonStyles.selectedButton}
        textStyle={{ color: COLORS.text }}
        buttons={["Biceps", "Calves", "Chest"]}
        selectMultiple
        selectedIndexes={selectedIndexes[1]}
        onPress={(value) => {
          handleSelectedIndexesChange(1, value);
        }}
        // buttonContainerStyle={buttonStyles.buttonContainer}
        // buttonStyle={buttonStyles.selectButton}
        // containerStyle={{ marginTop: -5, paddingTop: 0 }}
      />
      <ButtonGroup
        buttonStyle={buttonStyles.grouped3Button}
        selectedButtonStyle={buttonStyles.selectedButton}
        textStyle={{ color: COLORS.text }}
        buttons={["Forearms", "Glutes", "Hamstrings"]}
        selectMultiple
        selectedIndexes={selectedIndexes[2]}
        onPress={(value) => {
          handleSelectedIndexesChange(2, value);
        }}
        // buttonContainerStyle={buttonStyles.buttonContainer}
        // buttonStyle={buttonStyles.selectButton}
        // containerStyle={{ marginTop: -5, paddingTop: 0 }}
      />
      <ButtonGroup
        buttonStyle={buttonStyles.grouped3Button}
        selectedButtonStyle={buttonStyles.selectedButton}
        textStyle={{ color: COLORS.text }}
        buttons={["Lats", "Lower Back", "Middle Back"]}
        selectMultiple
        selectedIndexes={selectedIndexes[3]}
        onPress={(value) => {
          handleSelectedIndexesChange(3, value);
        }}
        // buttonContainerStyle={buttonStyles.buttonContainer}
        // buttonStyle={buttonStyles.selectButton}
        // containerStyle={{ marginTop: -5, paddingTop: 0 }}
      />
      <ButtonGroup
        buttonStyle={buttonStyles.grouped3Button}
        selectedButtonStyle={buttonStyles.selectedButton}
        textStyle={{ color: COLORS.text }}
        buttons={["Neck", "Quadriceps", "Traps"]}
        selectMultiple
        selectedIndexes={selectedIndexes[4]}
        onPress={(value) => {
          handleSelectedIndexesChange(4, value);
        }}
        // buttonContainerStyle={buttonStyles.buttonContainer}
        // buttonStyle={buttonStyles.selectButton}
        // containerStyle={{ marginTop: -5, paddingTop: 0 }}
      />
      <ButtonGroup
        buttonStyle={buttonStyles.grouped1Button}
        selectedButtonStyle={buttonStyles.selectedButton}
        textStyle={{ color: COLORS.text }}
        buttons={["Triceps"]}
        selectMultiple
        selectedIndexes={selectedIndexes[5]}
        onPress={(value) => {
          handleSelectedIndexesChange(5, value);
        }}
        // buttonContainerStyle={buttonStyles.buttonContainer}
        // buttonStyle={buttonStyles.selectButton}
        // containerStyle={{ marginTop: -5, paddingTop: 0 }}
      />
    </View>
  );
};

export default MuscleGenerator;
