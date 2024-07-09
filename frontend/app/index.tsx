import React from "react";
import { View, Text, ImageBackground, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button, Icon } from "@rneui/base";
import { Image } from "@rneui/themed";

import buttonStyles from "../styles/buttonStyle";
import appStyles from "../styles/appStyle";

const GetStartedPage = () => {
  const router = useRouter();
  const image = require("../assets/dumbbell2.png");
  const logo = require("../assets/logo-no-background.png");

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={image}
        style={{ flex: 1, justifyContent: "center", overflow: "hidden" }}
        resizeMode="cover"
      >
        <View style={appStyles.pageContainer}>
          <Image
            source={logo}
            style={{ width: 200, height: 100, marginBottom: 25 }} // Example style, adjust as needed
          />
          <Pressable
            style={[
              buttonStyles.getStartedButton,
              buttonStyles.buttonContainer,
            ]}
            onPress={() => router.push("/register-modal")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 24, color: "white" }}
                >
                  Get Started
                </Text>
                <Text
                  style={{ fontStyle: "italic", fontSize: 14, color: "white" }}
                >
                  Create a new account
                </Text>
              </View>
              <Icon
                style={{ marginLeft: 15 }}
                name="arrow-right"
                type="font-awesome"
                size={24}
                color="white"
              />
            </View>
          </Pressable>
          <View
            style={{
              marginTop: 10,
            }}
          >
            <Text style={appStyles.titleText}>
              Already have an account?
              <Link href={"/login-modal"}>
                <Text style={buttonStyles.signInButton}> Sign In</Text>
              </Link>
            </Text>
          </View>
        </View>
        {/* </View> */}
      </ImageBackground>
    </View>
  );
};

export default GetStartedPage;
