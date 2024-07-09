import { Dimensions } from "react-native";

const COLORS = {
  primary: "#6B2085",
  secondary: "#343338",
  tertiary: "#29715F",
  text: "#EEEEEE",
  placeholderText: "#999999",
  // secondary: "#706C6C",
  accent: "#00D20B",

  screen: "#161616",

  background: "#343434",

  gray: "#83829A",
  gray2: "#C1C0C8",
  lightGray: "#dcdce5",

  white: "#F3F4F8",
  lightWhite: "#FAFAFC",
  warning: "#FFD166",
  danger: "#EF476F",
};

const FONT = {
  regular: "Roboto",
  medium: "RobotoMedium",
  bold: "RobotoBold",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 6,
  },
};

const { width, height } = Dimensions.get("window");
const SCREENSIZE = {
  width: width,
  height: height,
  width90: width * 0.9,
  width80: width * 0.8,
  width70: width * 0.7,
  width60: width * 0.6,
  width50: width * 0.5,
  width40: width * 0.4,
  width30: width * 0.3,
  width20: width * 0.2,
  width10: width * 0.1,
};
// export { COLORS, FONT, SIZES, SHADOWS, WIDTH };

const BORDERRADIUS = {
  regular: 10,
};

const MARGINS = {
  small: 10,
  medium: 15,
  large: 20,
  xlarge: 30,
  xxlarge: 40,
};

export { COLORS, FONT, SIZES, SHADOWS, SCREENSIZE, BORDERRADIUS, MARGINS };
