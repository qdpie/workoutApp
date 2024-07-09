import { Tabs } from "expo-router/tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import appStyles from "../../styles/appStyle";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        // headerShown: false,
        headerStyle: {
          backgroundColor: COLORS.screen,
          shadowColor: "transparent",
        },
        headerTitleStyle: appStyles.screenText,
        tabBarActiveTintColor: COLORS.accent,
        tabBarStyle: { backgroundColor: "black" },
      }}
    >
      <Tabs.Screen
        name="homepage"
        options={{
          headerShown: false,
          tabBarLabel: "",
          headerTitle: "",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              name="home"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="workouts"
        options={{
          tabBarLabel: "",
          headerTitle: "Workouts",

          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              name="dumbbell"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="exerciseGenerator"
        options={{
          tabBarLabel: "Generator",
          headerTitle: "Generator",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              name="plus-square"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="goals"
        options={{
          tabBarLabel: "",
          headerTitle: "Goals",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              name="bullseye"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "",
          headerTitle: "Settings",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              name="cogs"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
