import React from "react";
import { Image } from "react-native";

const LoadingGif = () => {
  return (
    <Image
      source={require("../assets/lifting.gif")}
      style={{ width: 150, height: 150, alignSelf: "center" }}
      resizeMode="contain"
    />
  );
};

export default LoadingGif;
