import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import workoutCard from "../styles/workoutCard";
import { COLORS } from "../constants";
import Icon from "react-native-vector-icons/Feather";
import { SessionWorkoutOut } from "../generated";
import { router } from "expo-router";

interface SessionCardProps {
  data: SessionWorkoutOut[];
  title: string;
  onDelete?: (id: string) => void;
}

const SessionCard = React.forwardRef(
  ({ data, title, onDelete }: SessionCardProps, ref) => {
    const rightOpenValue = -80;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
      }).format(date);

      return `${formattedDate}`;
    };

    const formatTime = (dateString) => {
      const date = new Date(dateString);
      let formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);

      formattedTime = formattedTime.replace(/AM$/, " AM").replace(/PM$/, " PM");

      return formattedTime;
    };

    // const preprocessDataWithYearAndMonthTitles = (data) => {
    //   // Ensure data is sorted by date
    //   const sortedData = data.sort(
    //     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    //   );

    //   const processedData = [];
    //   let lastYear = null;
    //   let lastMonth = null;

    //   sortedData.forEach((session) => {
    //     const sessionDate = new Date(session.date);
    //     const sessionYear = sessionDate.getFullYear();
    //     const sessionMonth = sessionDate.getMonth(); // getMonth() returns 0-11

    //     if (sessionYear !== lastYear) {
    //       // Insert a year title item
    //       processedData.push({
    //         isYearTitle: true,
    //         title: sessionYear.toString(),
    //         key: `year-${sessionYear}`,
    //       });
    //       lastYear = sessionYear;
    //       lastMonth = null; // Reset lastMonth for the new year
    //     }

    //     if (sessionMonth !== lastMonth) {
    //       // Insert a month title item
    //       const monthName = sessionDate.toLocaleString("default", {
    //         month: "long",
    //       });
    //       processedData.push({
    //         isMonthTitle: true,
    //         title: `${monthName}`,
    //         key: `month-${sessionYear}-${sessionMonth}`,
    //       });
    //       lastMonth = sessionMonth;
    //     }

    //     // Insert the regular session item
    //     processedData.push({
    //       ...session,
    //       isYearTitle: false,
    //       isMonthTitle: false,
    //     });
    //   });

    //   return processedData;
    // };

    const renderItem = ({ item }, rowMap) => {
      //   if (item.isYearTitle) {
      //     // Render year title
      //     return (
      //       <View style={{ padding: 10, backgroundColor: "lightgrey" }}>
      //         <Text style={{ fontWeight: "bold", fontSize: 18 }}>
      //           {item.title}
      //         </Text>
      //       </View>
      //     );
      //   } else if (item.isMonthTitle) {
      //     // Render month title
      //     return (
      //       <View style={{ padding: 10, backgroundColor: "lightblue" }}>
      //         <Text style={{ fontWeight: "bold", fontSize: 16 }}>
      //           {item.title}
      //         </Text>
      //       </View>
      //     );
      //   } else {
      // Render regular session item
      return (
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/session/summary",
              params: {
                session_id: item.session_id,
                historical: "true",
                title: title,
              },
            });
          }}
        >
          <View style={workoutCard.cardContainer}>
            <Text style={workoutCard.cardTitle}>{formatDate(item.date)}</Text>
            <Text style={workoutCard.cardDescription}>
              {formatTime(item.date)}
            </Text>
            <Text style={workoutCard.cardDescription}>
              {item.duration_mins} minutes
            </Text>
          </View>
        </Pressable>
      );
      //   }
    };

    const renderHiddenItem = (data, rowMap) => {
      return (
        <View
          style={{
            ...workoutCard.cardContainer,
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 0,
          }}
        >
          <>
            <Pressable
              onPress={() => {
                onDelete(data.item.session_id);
              }}
              style={{
                backgroundColor: COLORS.danger,
                width: 80,
                justifyContent: "center",
                alignItems: "center",
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <Icon name="trash-2" size={24} color="black" />
            </Pressable>
          </>
        </View>
      );
    };

    return (
      <SwipeListView
        style={{ marginBottom: 10 }}
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={rightOpenValue}
        disableRightSwipe={true}
        closeOnScroll={true}
        closeOnRowOpen={true}
        closeOnRowBeginSwipe={true}
      />
    );
  }
);

export default SessionCard;
