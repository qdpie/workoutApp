import { Button, Icon, Switch, Text } from "@rneui/base";
import { router, useLocalSearchParams } from "expo-router";
import { ExerciseOut, ExerciseType, ExerciseUpdate } from "../../generated";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, View } from "react-native";
import { exercisesApi } from "../../api";
import appStyles from "../../styles/appStyle";
import { Input } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
import { Platform } from "react-native";
import buttonStyles from "../../styles/buttonStyle";
import { COLORS } from "../../constants";
import { ScrollView } from "react-native-gesture-handler";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const EditExercise = () => {
  const { exerciseId, title } = useLocalSearchParams<{
    exerciseId: string;
    title?: string;
  }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [loadingState, setLoadingState] = useState(true);
  const [exercise, setExercise] = useState<ExerciseOut>();
  const [selectedType, setSelectedType] = useState("cardio");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const Item: any = Picker.Item;
  const scrollViewRef = useRef(null);

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 0); // Adjust the delay as needed
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }; //TODO: add to utils to avoid repetition

  const fetchExercise = async () => {
    const response = await exercisesApi.getExercise(exerciseId);
    console.log(response.data);
    setExercise(response.data);
    setSelectedType(response.data.type);
    setLoadingState(false);
  };

  useEffect(() => {
    fetchExercise();
  }, []);

  const onSubmit = async (formdata: any) => {
    setLoadingState(true);
    const {
      name,
      type,
      muscle,
      equipment,
      description,
      track_reps,
      track_weight,
      track_distance,
      track_duration,
    } = formdata;

    const exerciseData: ExerciseUpdate = {
      name: name,
      type: selectedType as ExerciseType,
      muscle: muscle || exercise?.muscle,
      equipment: equipment,
      description: description,
      track_reps: track_reps || exercise?.track_reps,
      track_weight: track_weight || exercise?.track_weight,
      track_distance: track_distance || exercise?.track_distance,
      track_duration: track_duration || exercise?.track_duration,
    };

    exercisesApi
      .updateExercise(exerciseId, exerciseData)
      .then((response) => {
        setLoadingState(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingState(false);
        showError(`Failed to update exercise: ${error}`);
        return;
      });
    router.back();
  };

  if (loadingState) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <View style={appStyles.formContainer}>
        <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={appStyles.text}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                errorMessage={errors.name && `${errors.name.message}`}
                placeholder="Exercise Name"
              />
            )}
            name="name"
            rules={{
              required: "Name is required.",
            }}
            defaultValue={exercise?.name}
          />
          <Text style={{ ...appStyles.text }}>Exercise Type:</Text>
          <Picker
            style={{
              ...appStyles.picker,
              height: Platform.OS === "ios" ? 125 : 40,
              // backgroundColor: Platform.OS === "ios" ? COLORS.screen : "red",
              color: COLORS.text,
            }}
            itemStyle={{
              ...appStyles.picker,
              height: Platform.OS === "ios" ? 125 : 40,
              // backgroundColor: Platform.OS === "ios" ? COLORS.screen : "red",
            }}
            selectedValue={selectedType}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
            dropdownIconColor={Platform.OS === "android" ? COLORS.text : ""}
          >
            <Item style={appStyles.picker} label="Cardio" value="cardio" />
            <Item style={appStyles.picker} label="Strength" value="strength" />
            <Item
              style={appStyles.picker}
              label="Stretching"
              value="stretching"
            />
            <Item
              style={appStyles.picker}
              label="Plyometrics"
              value="plyometrics"
            />
          </Picker>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={appStyles.text}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                errorMessage={errors.muscle && `${errors.muscle.message}`}
                placeholder="Muscle"
              />
            )}
            name="muscle"
            defaultValue={exercise?.muscle}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={appStyles.text}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                errorMessage={errors.equipment && `${errors.equipment.message}`}
                placeholder="Equipment"
              />
            )}
            name="equipment"
            defaultValue={exercise?.equipment}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={appStyles.text}
                returnKeyType="done"
                inputStyle={{
                  height: 80, // Adjust the height to fit multiple lines
                  textAlignVertical: "top", // Only affects Android
                }}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                errorMessage={
                  errors.description && `${errors.description.message}`
                }
                placeholder="Enter Description"
                multiline={true}
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={true}
              />
            )}
            name="description"
            defaultValue={exercise?.description}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              marginBottom: 10,
              alignItems: "center",
            }}
            onStartShouldSetResponder={() => {
              toggleAdvancedOptions();
              return true; // Indicate that this View wants to become the responder
            }}
          >
            <Text
              style={{
                ...appStyles.text,
              }}
            >
              Advanced Options
            </Text>
            <Icon
              name={showAdvancedOptions ? "caret-down" : "caret-up"}
              type="ionicon"
              size={20}
              color={COLORS.text}
            />
          </View>
          {showAdvancedOptions && (
            <>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View style={appStyles.switch}>
                    <Text style={{ ...appStyles.text }}>Track Reps:</Text>
                    <Switch
                      color={COLORS.accent}
                      onValueChange={(value) => onChange(value)}
                      value={value}
                    />
                  </View>
                )}
                name="track_reps"
                defaultValue={exercise?.track_reps}
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View style={appStyles.switch}>
                    <Text style={{ ...appStyles.text }}>Track Weight:</Text>
                    <Switch
                      color={COLORS.accent}
                      onValueChange={(value) => onChange(value)}
                      value={value}
                    />
                  </View>
                )}
                name="track_weight"
                defaultValue={exercise?.track_weight}
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View style={appStyles.switch}>
                    <Text style={{ ...appStyles.text }}>Track Distance:</Text>
                    <Switch
                      color={COLORS.accent}
                      onValueChange={(value) => onChange(value)}
                      value={value}
                    />
                  </View>
                )}
                name="track_distance"
                defaultValue={exercise?.track_distance}
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View style={appStyles.switch}>
                    <Text style={{ ...appStyles.text }}>Track Duration:</Text>
                    <Switch
                      color={COLORS.accent}
                      onValueChange={(value) => onChange(value)}
                      value={value}
                    />
                  </View>
                )}
                name="track_duration"
                defaultValue={exercise?.track_duration}
              />
            </>
          )}
        </ScrollView>

        <Button
          buttonStyle={buttonStyles.primaryButton}
          title="Done"
          loading={loadingState}
          containerStyle={buttonStyles.buttonContainer}
          onPress={handleSubmit(onSubmit)}
        />
        <ErrorModal
          visible={errorVisible}
          errorMessage={errorMessage}
          onClose={closeError}
        />
      </View>
    );
  }
};

export default EditExercise;
