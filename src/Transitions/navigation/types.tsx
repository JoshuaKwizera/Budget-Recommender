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
    HomeScreen: undefined;
    BankScreen: undefined;
    LoginScreen: undefined;
    SignUpScreen: undefined;
    MobileMoneyScreen: undefined;
    ManualSpendingScreen: undefined;
    SelectMobileProviderScreen: undefined;
    SelectBankProviderScreen: undefined;
    BottomTabsNavigator: NavigatorScreenParams<BottomTabsParamList>;
    // Add other screens as needed
    BudgetScreen: undefined;
    BudgetShow: undefined;
    BudgetShows: undefined;
    ExpenseScreen: undefined;
    FinalSummary: undefined;
    BudgetOverview:undefined;
  };
  