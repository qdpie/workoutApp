import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS, SIZES } from "../../constants";
import { GoalOut } from "../../generated";
import GoalCard from "../../components/goalCard";
import { goalsApi } from "../../api";
import { router, useFocusEffect } from "expo-router";
import LoadingCard from "../../components/loadingCard";
import { FAB } from "@rneui/themed";
import { userInfo } from "os";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const WeightGoals = () => {
  const [goals, setGoals] = React.useState<GoalOut[]>([]);
  const [category, setCategory] = React.useState("weight");
  const [fetched, setFetched] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getGoals = async () => {
    await goalsApi.getGoals().then((response) => {
      setGoals(response.data);
      console.log(response.data);
      setFetched(true);
      setLoading(false);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true); // Reset loading state
      getGoals();
    }, [])
  );

  if (loading) {
    return <LoadingCard />;
  }

  if (goals.filter((goal) => goal.category === "weight").length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.screen,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "grey",
            fontSize: SIZES.large,
          }}
        >
          No Weight Goal Found. Hit the "+" button to create one
        </Text>
        <Icon name="bullseye" size={48} color={"grey"} />
        <FAB
          style={{
            zIndex: 1,
          }}
          placement="right"
          onPress={() => {
            setFetched(false);
            router.push("/goal/create-w-goal-page");
          }}
          icon={{ name: "add", color: COLORS.text }}
          color={COLORS.primary}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.screen,
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          margin: SIZES.medium,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <ScrollView>
          {goals
            .filter((goal) => goal.category === "weight")
            .map((goal, index) => (
              <GoalCard key={index} {...goal} setFetched={setFetched} />
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

const PRGoals = () => {
  const [goals, setGoals] = React.useState<GoalOut[]>([]);
  const [category, setCategory] = React.useState("weight");
  const [fetched, setFetched] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const getGoals = async () => {
    await goalsApi
      .getGoals()
      .then((response) => {
        setGoals(response.data);
        setFetched(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showError(`Failed to fetch goals: ${error}`);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true); // Reset loading state
      getGoals();
    }, [])
  );

  if (loading) {
    return <LoadingCard />;
  }

  if (goals.filter((goal) => goal.category === "pr").length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.screen,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "grey",
            fontSize: SIZES.large,
          }}
        >
          No Progress Goals Found. Hit the "+" button to create one
        </Text>
        <Icon name="bullseye" size={48} color={"grey"} />
        <FAB
          style={{
            zIndex: 1,
          }}
          placement="right"
          onPress={() => {
            setFetched(false);
            router.push("/goal/create-goal-page");
          }}
          icon={{ name: "add", color: COLORS.text }}
          color={COLORS.primary}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: COLORS.screen,
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          margin: SIZES.medium,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <ScrollView>
          {goals
            .filter((goal) => goal.category === "pr")
            .map((goal, index) => (
              <GoalCard key={index} {...goal} setFetched={setFetched} />
            ))}
        </ScrollView>
      </View>
      <FAB
        style={{
          zIndex: 1,
        }}
        placement="right"
        onPress={() => {
          setFetched(false);
          router.push("/goal/create-goal-page");
        }}
        icon={{ name: "add", color: COLORS.text }}
        color={COLORS.primary}
      />
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};

const CompletedGoals = () => {
  const [goals, setGoals] = React.useState<GoalOut[]>([]);
  const [category, setCategory] = React.useState("weight");
  const [fetched, setFetched] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const getGoals = async () => {
    await goalsApi
      .getGoals()
      .then((response) => {
        setGoals(response.data);
        setFetched(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showError(`Failed to fetch goals: ${error}`);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true); // Reset loading state
      getGoals();
    }, [])
  );

  if (loading) {
    return <LoadingCard />;
  }

  if (goals.filter((goal) => goal.category === "completed").length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.screen,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "grey",
            fontSize: SIZES.large,
          }}
        >
          No Completed Goals
        </Text>
        <Icon name="bullseye" size={48} color={"grey"} />
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: COLORS.screen,
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          margin: SIZES.medium,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <ScrollView>
          {goals
            .filter((goal) => goal.category === "completed")
            .map((goal, index) => (
              <GoalCard key={index} {...goal} setFetched={setFetched} />
            ))}
        </ScrollView>
        <ErrorModal
          visible={errorVisible}
          errorMessage={errorMessage}
          onClose={closeError}
        />
      </View>
    </View>
  );
};

const Goals = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    //{ key: 'weight', title: 'Body Weight' },
    { key: "pr", title: "Progress" },
    { key: "completed", title: "Completed" },
  ]);

  const renderScene = SceneMap({
    //weight: WeightGoals,
    pr: PRGoals,
    completed: CompletedGoals,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.accent }}
      style={{ backgroundColor: COLORS.screen }}
      activeColor={COLORS.accent}
      inactiveColor="white"
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
    />
  );
};

export default Goals;
