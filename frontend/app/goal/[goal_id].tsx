import { View, Text, Dimensions } from "react-native";
import { GoalOut } from "../../generated";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { goalsApi } from "../../api";
import { SpeedDial } from "@rneui/themed";
import { COLORS, SIZES } from "../../constants";
import { router } from "expo-router";
import { Dialog } from "@rneui/themed";
import { Button } from "@rneui/themed";
import buttonStyles from "../../styles/buttonStyle";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import LoadingCard from "../../components/loadingCard";
import { SafeAreaView } from "react-native-safe-area-context";
import workoutCard from "../../styles/workoutCard";
import { LineChart } from "react-native-chart-kit";
import { instanceApi } from '../../api';

interface MyLineChartProps {
  exerciseId: string;
  exerciseType: string;
  goalValue: number;
  setMaxValue: React.Dispatch<React.SetStateAction<number | null>>; // Define setMaxValue prop
}

const MyLineChart: React.FC<MyLineChartProps> = ({ exerciseId, exerciseType, goalValue, setMaxValue }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      },
      {
        data: [],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      },
    ],
  });

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchExerciseInstances = async () => {
      try {
        const response = await instanceApi.getExerciseInstancesByExercise(exerciseId);
        const data = response.data;
  
        const dates = data.map((instance) => {
          const date = new Date(instance.session.date);
          return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
        });
  
        const values = data.map((instance) => {
          switch (exerciseType) {
            case 'reps':
              return instance.reps.length > 0 ? Math.max(...instance.reps.filter(val => typeof val === 'number' && isFinite(val))) : 0;
            case 'weight':
              return instance.weight.length > 0 ? Math.max(...instance.weight.filter(val => typeof val === 'number' && isFinite(val))) : 0;
            case 'distance':
              return instance.distance.length > 0 ? Math.max(...instance.distance.filter(val => typeof val === 'number' && isFinite(val))) : 0;
            case 'duration':
              return instance.duration.length > 0 ? parseFloat(instance.duration[0]) : 0;
            default:
              return 0;
          }
        });
  
        // Filter out "Infinity" values from the values array
        const filteredValues = values.filter(val => isFinite(val) && !isNaN(val));
  
        let max = Math.max(...filteredValues); // Compute the maximum value
  
        if (!isFinite(max) || isNaN(max)) {
          max = 0; // Set max to 0 if it's infinity or NaN
        }
  
        setMaxValue(max); // Set the maximum value to state
  
        const goalValues = Array(dates.length).fill(goalValue);
  
        setChartData({
          labels: dates,
          datasets: [
            {
              data: values,
              strokeWidth: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            },
            {
              data: goalValues,
              strokeWidth: 2,
              color: () => 'limegreen',
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercise instances:', error);
      }
    };
    
    fetchExerciseInstances();
  }, [exerciseId, exerciseType, goalValue]);

  if (loading) {
    return <LoadingCard />; // Render loading indicator while data is loading
  }

  if (chartData.datasets[0].data.length === 0 || chartData.datasets[0].data.every(value => isNaN(value))) {
    return <Text
    style={{
      textAlign: "center",
      color: "grey",
      fontSize: SIZES.large,
    }}
  >No data available for Progress Chart</Text>;
  }

  return (
    <>
      <Text style={workoutCard.cardTitle}>Progress Chart</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ width: 20, height: 20, backgroundColor: 'rgba(50, 205, 50, 1)', marginRight: 10, marginTop:10 }}></View>
        <Text style={{ color: 'white', marginTop: 10 }}>Goal</Text>
      </View>
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: chartData.datasets,
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: COLORS.secondary,
          backgroundGradientFrom: COLORS.secondary,
          backgroundGradientTo: COLORS.secondary,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        yLabelsOffset={20}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // Set based on your data range
        verticalLabelRotation={0}
      />
    </>
  );
};

const GoalPage = () => {
  const { goal_id } = useLocalSearchParams<{ goal_id: string; }>();

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [goal, setGoal] = useState<GoalOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [maxValue, setMaxValue] = useState<number | null>(null); // Initialize maxValue state

  const toggleDialog = () => setVisible(!visible);

  const fetchGoal = async () => {
    const response = await goalsApi.getGoal(goal_id);
    setGoal(response.data);
    setLoading(false);
  };


  const handleDelete = async () => {
    const response = await goalsApi.deleteGoal(goal_id);
    console.log(response.data);
    router.push("/goals");
  };

  useEffect(() => {
    fetchGoal();
  }, []);


  if (loading) {
    return <LoadingCard />;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.screen,
        flex: 1,
        justifyContent: "center",
      }}
    >
      {goal ? (
        <>
          <View>
            <Text style={workoutCard.cardTitle}>Goal: {goal.goal} {goal.track_type === 'weight' ? "lbs" : goal.track_type === 'reps' ? "reps" : goal.track_type === 'distance' ? "miles" : "mins"}</Text>
            <Text style={workoutCard.cardTitle}>Goal Type: {goal.track_type}</Text>
            <Text style={workoutCard.cardTitle}>Current Best: {maxValue !== null ? maxValue : "N/A"} {goal.track_type === 'weight' ? "lbs" : goal.track_type === 'reps' ? "reps" : goal.track_type === 'distance' ? "miles" : "mins"}</Text>
            
          </View>
          <View
            style={{
              flex: 1,
              margin: SIZES.medium,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <MyLineChart 
              exerciseId={goal.exercise} 
              exerciseType={goal.track_type} 
              goalValue={goal.goal} 
              setMaxValue={setMaxValue} // Pass setMaxValue function as prop
            />
          </View>
        </>
      ) : (
        <View
          style={{
            flex: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "grey",
              fontSize: SIZES.large,
            }}
          >
            No Goal Found.
          </Text>
          <Icon name="running" size={48} color={"grey"} />
        </View>
      )}
  
      <SpeedDial
        style={{ zIndex: 1 }}
        color={COLORS.primary}
        isOpen={open}
        icon={<Ionicons name="ellipsis-vertical" size={24} color="white" />}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
        <SpeedDial.Action
          color={COLORS.screen}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          title="Delete Goal"
          titleStyle={{ color: COLORS.text, backgroundColor: COLORS.screen }}
          color={"red"}
          onPress={toggleDialog}
        />
      </SpeedDial>
      <Dialog
        overlayStyle={{ backgroundColor: COLORS.background }}
        isVisible={visible}
        onBackdropPress={toggleDialog}
      >
        <Dialog.Title
          titleStyle={{ color: COLORS.text }}
          title="Delete Goal?"
        />
        <Text style={{ color: COLORS.text }}>
          This action cannot be undone.
        </Text>
        <Button
          containerStyle={buttonStyles.buttonContainer}
          color={"red"}
          title={"Delete"}
          onPress={handleDelete}
        />
      </Dialog>
    </SafeAreaView>
  );
};

export default GoalPage;
