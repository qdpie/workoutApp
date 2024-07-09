import {
  ExerciseInstanceCreate,
  ExerciseInstanceOut,
  ExerciseInstanceUpdate,
  ExerciseOut,
} from "../generated";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Pressable } from "react-native";
import workoutCard from "../styles/workoutCard";
import appStyles from "../styles/appStyle";
import { Icon } from "@rneui/base";
import { COLORS } from "../constants";
import { instanceApi } from "../api";
import { useLocalSearchParams } from "expo-router";
import { useDebounce } from "../utils/debounce";

interface InstanceCardProps {
  data: ExerciseOut[];
}

interface ExerciseItemProps {
  item: ExerciseInstanceOut;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ item }) => {
  const initialSets = item.sets ? item.sets : 1;
  const initialInputValues: ExerciseInstanceUpdate = {
    sets: initialSets,
    reps: Array.isArray(item.reps) ? item.reps : [null],
    weight: Array.isArray(item.weight) ? item.weight : [null],
    distance: Array.isArray(item.distance) ? item.distance : [null],
    duration: Array.isArray(item.duration) ? item.duration : [null],
  };

  const [inputRows, setInputRows] = useState<number[]>(
    [...Array(initialSets).keys()].map((i) => i + 1)
  );
  const [inputValues, setInputValues] =
    useState<ExerciseInstanceUpdate>(initialInputValues);

  useDebounce(
    () => {
      saveRowInput();
    },
    1000,
    [inputValues]
  );

  const addInputRow = () => {
    setInputRows((prevRows) => [...prevRows, prevRows.length + 1]);
    setInputValues((prevValues) => ({
      sets: prevValues.sets + 1,
      reps: [...prevValues.reps, null],
      weight: [...prevValues.weight, null],
      distance: [...prevValues.distance, null],
      duration: [...prevValues.duration, null],
    }));
  };

  const removeInputRow = () => {
    setInputRows((prevRows) => prevRows.slice(0, -1));
    setInputValues((prevValues) => {
      const updatedValues = { ...prevValues };
      updatedValues.sets = prevValues.sets - 1;
      updatedValues.reps = prevValues.reps.slice(0, -1);
      updatedValues.weight = prevValues.weight.slice(0, -1);
      updatedValues.distance = prevValues.distance.slice(0, -1);
      updatedValues.duration = prevValues.duration.slice(0, -1);
      return updatedValues;
    });
  };

  const handleInputChange = (
    type: "reps" | "weight" | "distance" | "duration",
    row: number,
    value: number | string
  ) => {
    setInputValues((prevValues) => {
      const updatedArray = [...prevValues[type]];
      updatedArray[row - 1] = value;
      return { ...prevValues, [type]: updatedArray };
    });
  };

  const saveRowInput = async () => {
    try {
      const hasInput =
        inputValues.sets > 0 &&
        (inputValues.reps.some((value) => value !== null) ||
          inputValues.weight.some((value) => value !== null) ||
          inputValues.distance.some((value) => value !== null) ||
          inputValues.duration.some((value) => value !== null));
      if (hasInput) {
        const updatedInputValues = {
          ...inputValues,
          reps: inputValues.reps.map((value) => (value !== null ? value : 0)),
          weight: inputValues.weight.map((value) =>
            value !== null ? value : 0
          ),
          distance: inputValues.distance.map((value) =>
            value !== null ? value : 0
          ),
          duration: inputValues.duration.map((value) =>
            value !== null ? value : ""
          ),
        };
        await instanceApi.updateExerciseInstance(
          item.exercise_instance_id,
          updatedInputValues
        );
      }
    } catch (error) {
      console.error("Error saving exercise instance:", error);
    }
  };

  return (
    <View style={workoutCard.cardContainer}>
      <Text style={workoutCard.cardTitle}>{item.exercise.name}</Text>
      {inputRows.map((row, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={workoutCard.inputContainerTitle}>
            {index === 0 && <Text style={{ ...appStyles.text }}>Sets</Text>}
            <Text style={workoutCard.setNumber}>{row}</Text>
          </View>
          {item.exercise.track_reps && (
            <View style={workoutCard.inputContainer}>
              {index === 0 && <Text style={appStyles.text}>Reps</Text>}
              <TextInput
                placeholder="10"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
                style={workoutCard.input}
                defaultValue={
                  inputValues.reps[row - 1] !== null
                    ? inputValues.reps[row - 1]?.toString()
                    : null
                }
                onChangeText={(text) =>
                  handleInputChange("reps", row, parseInt(text, 10))
                }
              />
            </View>
          )}
          {item.exercise.track_weight && (
            <View style={workoutCard.inputContainer}>
              {index === 0 && <Text style={appStyles.text}>Weight</Text>}
              <TextInput
                placeholder="135"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
                style={workoutCard.input}
                defaultValue={
                  inputValues.weight[row - 1] !== null
                    ? inputValues.weight[row - 1]?.toString()
                    : null
                }
                onChangeText={(text) =>
                  handleInputChange("weight", row, parseInt(text, 10))
                }
              />
            </View>
          )}
          {item.exercise.track_distance && (
            <View style={workoutCard.inputContainer}>
              {index === 0 && <Text style={appStyles.text}>Distance</Text>}
              <TextInput
                placeholder="26.2"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
                style={workoutCard.input}
                defaultValue={
                  inputValues.distance[row - 1] !== null
                    ? inputValues.distance[row - 1]?.toString()
                    : null
                }
                onChangeText={(text) =>
                  handleInputChange("distance", row, parseInt(text, 10))
                }
              />
            </View>
          )}
          {item.exercise.track_duration && (
            <View style={workoutCard.inputContainer}>
              {index === 0 && <Text style={appStyles.text}>Duration</Text>}
              <TextInput
                placeholder="2:00:35"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
                style={workoutCard.input}
                defaultValue={
                  inputValues.duration[row - 1] !== null
                    ? inputValues.duration[row - 1]?.toString()
                    : ""
                }
                onChangeText={(text) =>
                  handleInputChange("duration", row, text)
                }
              />
            </View>
          )}
        </View>
      ))}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={removeInputRow}
          style={{ alignSelf: "center", marginTop: 10, marginHorizontal: 10 }}
        >
          <Icon
            name="minus"
            type="font-awesome"
            size={24}
            color={COLORS.text}
          />
        </Pressable>
        <Pressable
          onPress={addInputRow}
          style={{ alignSelf: "center", marginTop: 10, marginHorizontal: 10 }}
        >
          <Icon name="plus" type="font-awesome" size={24} color={COLORS.text} />
        </Pressable>
      </View>
    </View>
  );
};

const InstanceCard: React.FC<InstanceCardProps> = ({ data }) => {
  const { session_id } = useLocalSearchParams<{
    session_id: string;
  }>();
  const [instances, setInstances] = useState<ExerciseInstanceOut[]>([]);
  const [exercises, setExercises] = useState<ExerciseOut[]>(data);

  const createInstances = async (exercise_id) => {
    const createInstanceValues: ExerciseInstanceCreate = {
      exercise_id: exercise_id,
    };
    const result = await instanceApi.createExerciseInstance(
      session_id,
      createInstanceValues
    );
    return result.data;
  };

  const fetchInstances = async () => {
    const response = await instanceApi.getExerciseInstances(session_id);
    if (response.data.length === 0) {
      // No existing instances, create new instances for all exercises
      for (const exercise of exercises) {
        const instance = await createInstances(exercise.exercise_id);
        setInstances((prevInstances) => [
          ...prevInstances,
          instance as unknown as ExerciseInstanceOut,
        ]);
      }
    } else {
      // Existing instances found, process them
      for (const exercise of exercises) {
        const instance = response.data.find(
          (instance) => instance.exercise.exercise_id === exercise.exercise_id
        );
        if (instance) {
          setInstances((prevInstances) => [...prevInstances, instance]);
        } else {
          const newInstance = await createInstances(exercise.exercise_id);
          setInstances((prevInstances) => [
            ...prevInstances,
            newInstance as unknown as ExerciseInstanceOut,
          ]);
        }
      }
    }
  };

  useEffect(() => {
    setExercises(data);
  }, [data]);

  useEffect(() => {
    fetchInstances();
  }, [exercises]);

  useEffect(() => {}, [instances]);

  const renderItem = ({ item }: { item: ExerciseInstanceOut }) => (
    <ExerciseItem item={item} />
  );

  return (
    <FlatList
      data={instances}
      renderItem={renderItem}
      keyExtractor={(item) => item.exercise_instance_id}
    />
  );
};

export default InstanceCard;
