import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import workoutCard from "../styles/workoutCard";
import { ExerciseResponse } from "../api/generatorApi";
import { COLORS } from "../constants";
import Icon from "react-native-vector-icons/Feather";
import appStyles from "../styles/appStyle";
import { ExerciseOut } from "../generated";

interface ExerciseCardProps {
  data: ExerciseResponse[] | ExerciseOut[];
  onAdd?: (exercise: ExerciseResponse) => void;
  onEdit?: (exercise: ExerciseOut) => void;
  onDelete?: (id: string) => void;
  display?: boolean;
  hidden?: boolean;
}

const ExerciseCard = React.forwardRef(
  (
    { data, onAdd, onEdit, onDelete, display = false }: ExerciseCardProps,
    ref
  ) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSwiped, setIsSwiped] = useState(false);
    const rightOpenValue = display ? -120 : -60;

    const toggleSelection = (key: string) => {
      setSelectedIds((prevSelectedIds) => {
        const newSelectedIds = new Set(prevSelectedIds);
        if (newSelectedIds.has(key)) {
          newSelectedIds.delete(key);
        } else {
          newSelectedIds.add(key);
        }
        return newSelectedIds;
      });
    };

    const exerciseData = () => {
      const transformedData = data.map((item, index) => {
        if (!("exercise_id" in item)) {
          return { ...item, key: index.toString() };
        } else {
          return { ...item, difficulty: "NA", key: item.exercise_id };
        }
      });
      return transformedData;
    };

    const renderItem = (data, rowMap) => {
      return (
        <Pressable
          onPress={() => {
            if (data.item.key === expandedId) {
              setExpandedId(null); // Collapse if it's already expanded
            } else {
              setExpandedId(data.item.key); // Expand this item
            }
          }}
        >
          <View
            style={[
              workoutCard.cardContainer,
              selectedIds.has(data.item.key) && {
                borderColor: "green",
                borderWidth: 1,
              },
            ]}
          >
            <Text style={workoutCard.cardTitle}>{data.item.name} </Text>
            {data.item.key === expandedId && (
              <View>
                <Text style={appStyles.titleText}>Exercise Type:</Text>
                <Text style={appStyles.text}>{data.item.type}</Text>
                <Text style={appStyles.titleText}>Equipment:</Text>
                <Text style={appStyles.text}>{data.item.equipment}</Text>
                <Text style={appStyles.titleText}>Description:</Text>
                <Text style={appStyles.text}>{data.item.description}</Text>
              </View>
            )}
          </View>
        </Pressable>
      );
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
          {onDelete && onEdit && (
            <>
              <Pressable
                onPress={() => {
                  rowMap[data.item.key].closeRow();
                  onEdit(data.item);
                }}
                style={{
                  backgroundColor: "green",
                  width: 60,
                  height: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="edit" size={24} color="white" />
              </Pressable>
              <Pressable
                onPress={() => {
                  onDelete(data.item.key);
                }}
                style={{
                  backgroundColor: COLORS.danger,
                  width: 60,
                  height: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <Icon name="trash-2" size={24} color="black" />
              </Pressable>
            </>
          )}
          {onAdd && (
            <Pressable
              onPress={() => {
                toggleSelection(data.item.key);
                if (onAdd) {
                  onAdd(data.item);
                }
              }}
              style={{
                backgroundColor: selectedIds.has(data.item.key)
                  ? "green"
                  : COLORS.secondary,
                width: 65,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                zIndex: 1,
              }}
            >
              <Icon
                name={selectedIds.has(data.item.key) ? "minus" : "plus"}
                size={24}
                color="white"
              />
            </Pressable>
          )}
        </View>
      );
    };

    return (
      <SwipeListView
        style={{ marginBottom: 10 }}
        data={exerciseData()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={rightOpenValue}
        disableRightSwipe={true}
        disableLeftSwipe={expandedId !== null}
        closeOnScroll={true}
        closeOnRowOpen={true}
        closeOnRowBeginSwipe={true}
      />
    );
  }
);

export default ExerciseCard;
