import { View } from "react-native";
import { COLORS, SIZES, SCREENSIZE } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "@rneui/themed";

const LoadingCard = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.screen,
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
        <Skeleton
          // LinearGradientComponent={CustomLinearGradient({
          //   colors: [COLORS.secondary, "lightgrey", "white"],
          // })}
          animation="pulse"
          style={{ backgroundColor: COLORS.secondary, marginTop: 10 }}
          skeletonStyle={{ backgroundColor: "lightgrey" }}
          width={SCREENSIZE.width90}
          height={100}
        />
        <Skeleton
          // LinearGradientComponent={CustomLinearGradient({
          //   colors: ["lightgrey", "white"],
          // })}
          animation="pulse"
          style={{ backgroundColor: COLORS.secondary, marginTop: 10 }}
          skeletonStyle={{ backgroundColor: "lightgrey" }}
          width={SCREENSIZE.width90}
          height={100}
        />
        <Skeleton
          // LinearGradientComponent={CustomLinearGradient({
          //   colors: ["lightgrey", "white"],
          // })}
          animation="pulse"
          style={{ backgroundColor: COLORS.secondary, marginTop: 10 }}
          skeletonStyle={{ backgroundColor: "lightgrey" }}
          width={SCREENSIZE.width90}
          height={100}
        />
        <Skeleton
          circle
          animation="pulse"
          style={{
            backgroundColor: COLORS.secondary,
            marginTop: 10,
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          skeletonStyle={{ backgroundColor: "lightgrey" }}
          height={60}
          width={60}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoadingCard;
