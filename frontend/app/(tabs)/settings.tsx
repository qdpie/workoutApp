import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View, ScrollView } from "react-native";
import { Button, ListItem, Dialog, ButtonGroup } from "@rneui/themed";
import auth from "../../auth/auth";
import { router, useFocusEffect } from "expo-router";
import appStyles from "../../styles/appStyle";
import buttonStyles from "../../styles/buttonStyle";
import { Divider } from "@rneui/themed";
import { TextInput } from "react-native-gesture-handler";
import { ListItemTitle } from "@rneui/base/dist/ListItem/ListItem.Title";
import { ListItemChevron } from "@rneui/base/dist/ListItem/ListItem.Chevron";
import { Gender, UserOut } from "../../generated";
import { usersApi } from "../../api";
import LoadingCard from "../../components/loadingCard";
import ErrorModal from "../../components/error";
import useErrorModal from "../../utils/hooks/useErrorModal";

const Settings = () => {
  const [user, setUser] = useState<UserOut | null>(null);
  const [fetched, setFetched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatedUser, setUpdatedUser] = useState<boolean>(false);
  const { errorVisible, errorMessage, showError, closeError } = useErrorModal();

  const [newWeight, setNewWeight] = useState<string>("");
  const [newHeightFeet, setNewHeightFeet] = useState<string>("");
  const [newHeightInches, setNewHeightInches] = useState<string>("");
  // const [newBirthDate, setNewBirthDate] = useState<string>("");
  const [newFirstName, setNewFirstName] = useState<string>("");
  const [newLastName, setNewLastName] = useState<string>("");

  const getUser = async () => {
    await usersApi
      .getCurrentUser()
      .then((response) => {
        setUser(response.data);
        setFetched(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        showError(`User Fetch Failed: ${error}`);
      });
  };

  const updateUser = async () => {
    await usersApi
      .updateCurrentUser(user)
      .then((response) => {})
      .catch((error) => {
        console.error(error);
        setLoading(false);
        showError(`User Update Failed: ${error}`);
      });
  };

  useFocusEffect(() => {
    if (!fetched) {
      getUser().then(() => {
        setLoading(false);
      });
    }
  });

  useEffect(() => {
    if (updatedUser) {
      updateUser();
      setUpdatedUser(false);
    }
  }, [user]);

  const [visibleWeight, setVisibleWeight] = useState(false);
  const [visibleHeight, setVisibleHeight] = useState(false);
  // const [visibleUnit, setVisibleUnit] = useState(false);
  // const [visibleBirthDate, setVisibleBirthDate] = useState(false);
  const [visibleGender, setVisibleGender] = useState(false);
  const [visibleName, setVisibleName] = useState(false);

  // const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(0);

  const toggleDialogWeight = () => {
    setNewWeight(user.weight + "");
    setVisibleWeight(!visibleWeight);
  };
  const toggleDialogHeight = () => {
    setNewHeightFeet(Math.floor(user.height_in / 12) + "");
    setNewHeightInches((user.height_in % 12) + "");
    setVisibleHeight(!visibleHeight);
  };

  // const toggleDialogUnit = () => {
  //   setVisibleUnit(!visibleUnit);
  // };

  // const toggleDialogBirthDate = () => {
  //   setNewBirthDate(user.birth_date);
  //   setVisibleBirthDate(!visibleBirthDate);
  // };

  const toggleDialogGender = () => {
    setVisibleGender(!visibleGender);
  };

  const toggleDialogName = () => {
    setNewFirstName(user.first_name);
    setNewLastName(user.last_name);
    setVisibleName(!visibleName);
  };

  const GetUserWeight = () => {
    if (fetched && user) {
      return user.weight;
    }
    return null;
  };

  const GetUserName = () => {
    if (fetched && user) {
      return user.first_name + " " + user.last_name;
    }
    return null;
  };

  // const GetUserBirthDate = () => {
  //   if (fetched && user) {
  //     return user.birth_date;
  //   }
  //   return null;
  // };

  const GetUserGender = () => {
    if (fetched && user) {
      return user.gender;
    }
    return null;
  };

  const GetUserEmail = () => {
    if (fetched && user) {
      return user.email;
    }
    return null;
  };

  const GetUserHeight = () => {
    if (fetched && user) {
      return user.height_in;
    }
    return null;
  };

  // const GetUserUnit = () => {
  //   return "lbs";
  // };

  const SetUserWeight = () => {
    setUser((user) => ({
      ...user,
      weight: parseInt(newWeight),
    }));
    setUpdatedUser(true);
    setVisibleWeight(false);
  };

  // const SetUserBirthDate = () => {
  //   setUser((user) => ({
  //     ...user,
  //     birth_date: newBirthDate,
  //   }));
  //   setUpdatedUser(true);
  //   setVisibleBirthDate(false);
  // };

  const SetUserHeight = () => {
    var newHeight = parseInt(newHeightFeet) * 12 + parseInt(newHeightInches);
    setUser((user) => ({
      ...user,
      height_in: newHeight,
    }));
    setUpdatedUser(true);
    setVisibleHeight(false);
  };

  const SetUserName = () => {
    setUser((user) => ({
      ...user,
      first_name: newFirstName,
      last_name: newLastName,
    }));
    setUpdatedUser(true);
    setVisibleName(false);
  };

  const SetUserGender = (num) => {
    let gender;
    if (num == 0) {
      gender = Gender.Male;
    } else if (num == 1) {
      gender = Gender.Female;
    } else {
      gender = Gender.Other;
    }
    setUser((user) => ({
      ...user,
      gender: gender,
    }));
    setUpdatedUser(true);
    setVisibleGender(false);
  };

  const GetGenderSelection = () => {
    if (user.gender == Gender.Male) {
      return 0;
    } else if (user.gender == Gender.Female) {
      return 1;
    }
    return 2;
  };

  // const SetUserUnits = () => {
  //   setUser(user => ({
  //     ...user,
  //     weight: parseInt(newWeight)
  //   }))
  //   setUpdatedUser(true);
  //   setVisible1(false);
  // }

  return (
    <View style={appStyles.screenContainer}>
      {loading ? (
        <View style={appStyles.screenContainer}>
          <LoadingCard />
        </View>
      ) : (
        <View style={appStyles.screenContainer}>
          <ScrollView>
            <View>
              <ListItem containerStyle={appStyles.listItemContainer}>
                <ListItemTitle style={appStyles.text}>Email</ListItemTitle>
                <ListItemTitle style={appStyles.text}>
                  {GetUserEmail()}
                </ListItemTitle>
              </ListItem>
              <Divider></Divider>

              <Pressable onPress={toggleDialogName}>
                <ListItem containerStyle={appStyles.listItemContainer}>
                  <ListItemTitle style={appStyles.text}>Name</ListItemTitle>
                  <ListItemTitle style={appStyles.text}>
                    {GetUserName()}
                    <ListItemChevron style={{ paddingLeft: 10 }} />
                  </ListItemTitle>
                </ListItem>
              </Pressable>
              <Divider></Divider>

              {/* <Pressable onPress={toggleDialogBirthDate}>
                <ListItem containerStyle={appStyles.listItemContainer}>
                  <ListItemTitle style={appStyles.text}>
                    Birth Date
                  </ListItemTitle>
                  <ListItemTitle style={appStyles.text}>
                    {GetUserBirthDate()}
                    <ListItemChevron style={{ paddingLeft: 10 }} />
                  </ListItemTitle>
                </ListItem>
              </Pressable>
              <Divider></Divider> */}

              <Pressable onPress={toggleDialogGender}>
                <ListItem containerStyle={appStyles.listItemContainer}>
                  <ListItemTitle style={appStyles.text}>Gender</ListItemTitle>
                  <ListItemTitle style={appStyles.text}>
                    {GetUserGender()}
                    <ListItemChevron style={{ paddingLeft: 10 }} />
                  </ListItemTitle>
                </ListItem>
              </Pressable>
              <Divider></Divider>

              <Pressable onPress={toggleDialogWeight}>
                <ListItem containerStyle={appStyles.listItemContainer}>
                  <ListItemTitle style={appStyles.text}>Weight</ListItemTitle>
                  <ListItemTitle style={appStyles.text}>
                    {GetUserWeight()}
                    <ListItemTitle style={appStyles.text}> lbs</ListItemTitle>
                    <ListItemChevron style={{ paddingLeft: 10 }} />
                  </ListItemTitle>
                </ListItem>
              </Pressable>
              <Divider></Divider>

              <Pressable onPress={toggleDialogHeight}>
                <ListItem containerStyle={appStyles.listItemContainer}>
                  <ListItemTitle style={appStyles.text}>Height</ListItemTitle>
                  <ListItemTitle style={appStyles.text}>
                    {GetUserHeight()}
                    <ListItemTitle style={appStyles.text}>
                      {" "}
                      inches{" "}
                    </ListItemTitle>
                    <ListItemChevron style={{ paddingLeft: 10 }} />
                  </ListItemTitle>
                </ListItem>
              </Pressable>
              <Divider></Divider>

              {/* <Pressable onPress={toggleDialogUnit}>
            <ListItem containerStyle={appStyles.listItemContainer}>
              <ListItemTitle style={appStyles.text}>Units</ListItemTitle>
              <ListItemTitle style={appStyles.text}>
                {GetUserUnit()}
                <ListItemChevron style={{paddingLeft:10}}/>
              </ListItemTitle>
            </ListItem>
          </Pressable> */}
            </View>
            <Button
              buttonStyle={buttonStyles.primaryButton}
              containerStyle={appStyles.buttonContainer}
              title="Sign Out"
              onPress={() => {
                auth.logout();
                router.replace("login-modal");
              }}
            />
          </ScrollView>
          <Dialog
            isVisible={visibleWeight}
            onBackdropPress={toggleDialogWeight}
            overlayStyle={appStyles.overlayStyle}
          >
            <Dialog.Title titleStyle={appStyles.text} title="Edit weight" />
            <Text style={appStyles.text}>Enter new weight (in lbs)</Text>
            <TextInput
              style={appStyles.input}
              keyboardType="numeric"
              onChangeText={setNewWeight}
              placeholder={newWeight}
            ></TextInput>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => SetUserWeight()}
            >
              Save
            </Button>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => setVisibleWeight(false)}
            >
              Cancel
            </Button>
          </Dialog>
          <Dialog
            isVisible={visibleHeight}
            onBackdropPress={toggleDialogHeight}
            overlayStyle={appStyles.overlayStyle}
          >
            <Dialog.Title titleStyle={appStyles.text} title="Edit Height" />
            <Text style={appStyles.text}>Feet</Text>
            <TextInput
              style={appStyles.input}
              keyboardType="numeric"
              onChangeText={setNewHeightFeet}
              placeholder={newHeightFeet}
            ></TextInput>
            <Text style={appStyles.text}>Inches</Text>
            <TextInput
              style={appStyles.input}
              keyboardType="numeric"
              onChangeText={setNewHeightInches}
              placeholder={newHeightInches}
            ></TextInput>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => SetUserHeight()}
            >
              Save
            </Button>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => setVisibleHeight(false)}
            >
              Cancel
            </Button>
          </Dialog>
          {/* <Dialog
        isVisible={visibleUnit}
        onBackdropPress={toggleDialogUnit}
        overlayStyle={appStyles.overlayStyle}
      >
        <Dialog.Title
          titleStyle={appStyles.text}
          title="Edit unit preference"
        />
        <Text style={appStyles.text}>Select One</Text>
        <ButtonGroup
          selectedButtonStyle={buttonStyles.buttonGroup}
          buttons={["lbs", "kg"]}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
          }}
        ></ButtonGroup>
        <Button buttonStyle={buttonStyles.dialogButton}>Save</Button>
        <Button buttonStyle={buttonStyles.dialogButton} onPress={() => setVisibleUnit(false)}>Cancel</Button>
      </Dialog> */}

          <Dialog
            isVisible={visibleName}
            onBackdropPress={toggleDialogName}
            overlayStyle={appStyles.overlayStyle}
          >
            <Dialog.Title titleStyle={appStyles.text} title="Edit name" />
            <Text style={appStyles.text}>First name</Text>
            <TextInput
              style={appStyles.input}
              onChangeText={setNewFirstName}
              placeholder={user.first_name}
            ></TextInput>
            <Text style={appStyles.text}>Last name</Text>
            <TextInput
              style={appStyles.input}
              onChangeText={setNewLastName}
              placeholder={user.last_name}
            ></TextInput>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => SetUserName()}
            >
              Save
            </Button>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => setVisibleName(false)}
            >
              Cancel
            </Button>
          </Dialog>

          {/* <Dialog
            isVisible={visibleBirthDate}
            onBackdropPress={toggleDialogBirthDate}
            overlayStyle={appStyles.overlayStyle}
          >
            <Dialog.Title titleStyle={appStyles.text} title="Edit birth date" />
            <Text style={appStyles.text}>Enter new Birth Date</Text>
            <TextInput
              style={appStyles.input}
              onChangeText={setNewBirthDate}
              placeholder={newBirthDate}
            ></TextInput>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => SetUserBirthDate()}
            >
              Save
            </Button>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => setVisibleBirthDate(false)}
            >
              Cancel
            </Button>
          </Dialog> */}

          <Dialog
            isVisible={visibleGender}
            onBackdropPress={toggleDialogGender}
            overlayStyle={appStyles.overlayStyle}
          >
            <Dialog.Title titleStyle={appStyles.text} title="Choose gender" />
            <ButtonGroup
              selectedButtonStyle={buttonStyles.buttonGroup}
              buttons={["male", "female", "other"]}
              selectedIndex={GetGenderSelection()}
              onPress={(value) => {
                SetUserGender(value);
              }}
            ></ButtonGroup>
            <Button
              buttonStyle={buttonStyles.dialogButton}
              onPress={() => setVisibleGender(false)}
            >
              Cancel
            </Button>
          </Dialog>
        </View>
      )}
      <ErrorModal
        visible={errorVisible}
        errorMessage={errorMessage}
        onClose={closeError}
      />
    </View>
  );
};
export default Settings;
