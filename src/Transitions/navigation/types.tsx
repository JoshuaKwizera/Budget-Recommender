import { NavigatorScreenParams } from "@react-navigation/native";

// BottomTabsParamList.ts (or another file where you keep your navigation types)
export type BottomTabsParamList = {
  Home: undefined;
  Shares: undefined;
  Send: undefined;
  Loans: undefined;
  Profile: undefined;
  // Add other tabs if necessary
};
// types.ts or somewhere appropriate
export type RootStackParamList = {
    SplashScreen: undefined;
    LoginScreen: undefined;
    SignUpScreen: undefined;
    BottomTabsNavigator: NavigatorScreenParams<BottomTabsParamList>;
    // Add other screens as needed
  };
  