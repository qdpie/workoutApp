import { Button, ButtonGroup, Text } from "@rneui/base";
import { COLORS } from "../../constants";
import { Keyboard, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import { ExerciseGPTData, UserOut } from "../../generated";
import { generateApi, usersApi } from "../../api";
import { Controller, set, useForm } from "react-hook-form";
import buttonStyles from "../../styles/buttonStyle";
import appStyles from "../../styles/appStyle";
import { Input } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { useGeneratedExercises } from "../../utils/providers/GeneratedExercisesContext";
import LoadingGif from "../../components/loadingGif";
import DropDownPicker from "react-native-dropdown-picker";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const GenerateForm = () => {
  const { workout_id, title } = useLocalSearchParams<{
    workout_id: string;
    title?: string;
  }>();
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const [user, setUser] = useState<UserOut>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const { exercises, setExercises } = useGeneratedExercises();
  const [section, setSection] = useState(0);
  const [skillLevelOpen, setSkillLevelOpen] = useState(false);
  const [bodyPartOpen, setBodyPartOpen] = useState(false);
  const [exerciseTypeOpen, setExerciseTypeOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);

  const [skillLevelValue, setSkillLevelValue] = useState(null);
  const [bodyPartValue, setBodyPartValue] = useState(null);
  const [exerciseTypeValue, setExerciseTypeValue] = useState(null);
  const [durationValue, setDurationValue] = useState(null);
  const [equipmentValue, setEquipmentValue] = useState(null);

  const [skillLevelItems, setSkillLevelItems] = useState([
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ]);

  const [bodyPartItems, setBodyPartItems] = useState([
    { label: "Abs", value: "abs" },
    { label: "Arms", value: "arms" },
    { label: "Back", value: "back" },
    { label: "Chest", value: "chest" },
    { label: "Core", value: "core" },
    { label: "Full Body", value: "full body" },
    { label: "Glutes", value: "glutes" },
    { label: "Legs", value: "legs" },
    { label: "Shoulders", value: "shoulders" },
    { label: "Upper Body", value: "upper body" },
  ]);

  const [exerciseTypeItems, setExerciseTypeItems] = useState([
    { label: "Bodyweight", value: "bodyweight" },
    { label: "Cardio", value: "cardio" },
    { label: "Free Weights", value: "free weights" },
    { label: "Functional", value: "functional" },
    { label: "Mobility", value: "mobility" },
    { label: "Resistance", value: "resistance" },
  ]);

  const [durationItems, setDurationItems] = useState([
    { label: "15 mins", value: "15 mins" },
    { label: "30 mins", value: "30 mins" },
    { label: "45 mins", value: "45 mins" },
    { label: "60 mins", value: "60 mins" },
    { label: "90 mins +", value: "90 mins +" },
  ]);

  const [equipmentItems, setEquipmentItems] = useState([
    { label: "Barbell", value: "barbell" },
    { label: "Dumbbell", value: "dumbbell" },
    { label: "Kettlebell", value: "kettlebell" },
    { label: "Full Gym", value: "full gym" },
    { label: "Resistance Band", value: "resistance band" },
    { label: "None", value: "none" },
  ]);

  const onSkillLevelOpen = useCallback(() => {
    setBodyPartOpen(false);
    setExerciseTypeOpen(false);
    setDurationOpen(false);
    setEquipmentOpen(false);
  }, []);

  const onBodyPartOpen = useCallback(() => {
    setSkillLevelOpen(false);
    setExerciseTypeOpen(false);
    setDurationOpen(false);
    setEquipmentOpen(false);
  }, []);

  const onExerciseTypeOpen = useCallback(() => {
    setSkillLevelOpen(false);
    setBodyPartOpen(false);
    setDurationOpen(false);
    setEquipmentOpen(false);
  }, []);

  const onDurationOpen = useCallback(() => {
    setSkillLevelOpen(false);
    setBodyPartOpen(false);
    setExerciseTypeOpen(false);
    setEquipmentOpen(false);
  }, []);

  const onEquipmentOpen = useCallback(() => {
    setSkillLevelOpen(false);
    setBodyPartOpen(false);
    setExerciseTypeOpen(false);
    setDurationOpen(false);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  useEffect(() => {
    // fetch user
    usersApi
      .getCurrentUser()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
        showError(`User Fetch Failed: ${error}`);
      });
  }, []);

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();
    if (
      month < 0 ||
      (month === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const onSubmit = async (data: any) => {
    setLoadingState(true);
    setAILoading(true);
    const gptData: ExerciseGPTData = {
      workout_name: title || "",
      age: getAge(data.birthDate) || 0,
      gender: data.gender || "other",
      weight: data.weight || 0,
      height: data.height || 0,
      goal: data.goal || "",
      experience: skillLevelValue || "N/A",
      time: durationValue || "N/A",
      target_muscle: bodyPartValue || ["N/A"],
      equipment: equipmentValue || ["N/A"],
      exercise_type: exerciseTypeValue || ["N/A"],
    };
    generateApi
      .generateWorkoutPlan(gptData)
      .then((response) => {
        setLoadingState(false);
        setAILoading(false);
        setExercises(response.data.exercises);
        console.log(response.data);
        router.push({
          pathname: "/generator/exerciseList",
          params: { workout_id: workout_id, title: title },
        });
      })
      .catch((err) => {
        console.log(err);
        setLoadingState(false);
        setAILoading(false);
        showError(`Exercise Generation Failed: ${err}`);
      });
  };

  const form = () => {
    return (
      <View style={appStyles.formContainer}>
        {/* {section === 0 && (
          <>
            // User Info Section
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  // keyboardType="numeric"
                  label="Birth Date"
                  returnKeyType="done"
                  style={appStyles.text}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  errorMessage={
                    errors.birthDate && `${errors.birthDate.message}`
                  }
                  placeholder="Birth Date"
                />
              )}
              name="birthDate"
              defaultValue={user?.birth_date}
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Height (in)"
                  keyboardType="numeric"
                  returnKeyType="done"
                  style={appStyles.text}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  errorMessage={errors.height && `${errors.height.message}`}
                  placeholder="Height"
                />
              )}
              name="height"
              defaultValue={user?.height_in ? user.height_in.toString() : ""}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Weight (lb)"
                  keyboardType="numeric"
                  returnKeyType="done"
                  style={appStyles.text}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  errorMessage={errors.weight && `${errors.weight.message}`}
                  placeholder="Weight"
                />
              )}
              name="weight"
              defaultValue={user?.weight ? user.weight.toString() : ""}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <ButtonGroup
                  selectedButtonStyle={buttonStyles.grouped3Button}
                  buttons={["male", "female", "other"]}
                  selectedIndex={
                    value === "male" ? 0 : value === "female" ? 1 : 2
                  }
                  onPress={(index) => {
                    const gender =
                      index === 0 ? "male" : index === 1 ? "female" : "other";
                    onChange(gender);
                  }}
                />
              )}
              name="gender"
              defaultValue={user?.gender}
            />
          </>
        )} */}

        {section === 0 && (
          <>
            {/* Skill Level Section */}
            <DropDownPicker
              open={skillLevelOpen}
              onOpen={onSkillLevelOpen}
              value={skillLevelValue}
              items={skillLevelItems}
              setOpen={setSkillLevelOpen}
              setValue={setSkillLevelValue}
              setItems={setSkillLevelItems}
              placeholder="Skill Level"
              zIndex={5000}
              zIndexInverse={1000}
            />
            <DropDownPicker
              multiple={true}
              open={bodyPartOpen}
              onOpen={onBodyPartOpen}
              value={bodyPartValue}
              items={bodyPartItems}
              setOpen={setBodyPartOpen}
              setValue={setBodyPartValue}
              setItems={setBodyPartItems}
              placeholder="Body Part"
              zIndex={4000}
              zIndexInverse={2000}
            />
            <DropDownPicker
              multiple={true}
              open={exerciseTypeOpen}
              onOpen={onExerciseTypeOpen}
              value={exerciseTypeValue}
              items={exerciseTypeItems}
              setOpen={setExerciseTypeOpen}
              setValue={setExerciseTypeValue}
              setItems={setExerciseTypeItems}
              placeholder="Exercise Type"
              zIndex={3000}
              zIndexInverse={3000}
            />
            <DropDownPicker
              open={durationOpen}
              onOpen={onDurationOpen}
              value={durationValue}
              items={durationItems}
              setOpen={setDurationOpen}
              setValue={setDurationValue}
              setItems={setDurationItems}
              placeholder="Duration"
              zIndex={2000}
              zIndexInverse={4000}
            />
            <DropDownPicker
              multiple={true}
              open={equipmentOpen}
              onOpen={onEquipmentOpen}
              value={equipmentValue}
              items={equipmentItems}
              setOpen={setEquipmentOpen}
              setValue={setEquipmentValue}
              setItems={setEquipmentItems}
              placeholder="Equipment"
              zIndex={1000}
              zIndexInverse={5000}
            />
          </>
        )}

        {section === 1 && (
          <>
            {/* Goal Section */}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Additional Context"
                  returnKeyType="done"
                  style={appStyles.text}
                  inputStyle={{
                    height: 200, // Adjust the height to fit multiple lines
                    textAlignVertical: "top", // Only affects Android
                  }}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  errorMessage={errors.goal && `${errors.goal.message}`}
                  placeholder="Limitations, goals, exercises, or any other context you wish to provide..."
                  multiline={true}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={true}
                />
              )}
              name="goal"
              defaultValue={""}
            />
          </>
        )}

        {section > 0 && (
          <Button
            title="Back"
            containerStyle={buttonStyles.buttonContainer}
            buttonStyle={buttonStyles.getStartedButton}
            onPress={() => setSection((prevSection) => prevSection - 1)}
          />
        )}

        {section < 1 && (
          <Button
            buttonStyle={buttonStyles.getStartedButton}
            containerStyle={buttonStyles.buttonContainer}
            title="Next"
            onPress={() => setSection((prevSection) => prevSection + 1)}
          />
        )}

        {section === 1 && (
          <Button
            title="Submit"
            loading={aiLoading}
            buttonStyle={buttonStyles.getStartedButton}
            containerStyle={buttonStyles.buttonContainer}
            onPress={handleSubmit(onSubmit)}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.screen,
      }}
    >
      <View style={{ margin: 10 }}>
        <Text style={appStyles.largeText}>Generate Exercises</Text>
        <Text style={appStyles.text}>
          The fitness inelegance tool will help you generate tailored exercises
          for your workout. The more detail you provide, the better your results
          will be.
        </Text>
      </View>
      {/* add loading state with gif */}
      {aiLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingGif />
        </View>
      ) : (
        user && form()
      )}
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </SafeAreaView>
  );
};

export default GenerateForm;
