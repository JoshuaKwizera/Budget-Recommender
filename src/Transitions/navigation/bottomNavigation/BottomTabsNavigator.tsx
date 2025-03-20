import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import HomeScreen from '../../../Screens/HomeScreen';
import SharesScreen from '../../../Screens/SharesScreen';
import ProfileScreen from '../../../Screens/ProfileScreen';
import BudgetOverview from '../../../Screens/BudgetOverview';
import { RouteProp } from '@react-navigation/native';
import { useIncome } from "../../../Storage";
import ChatScreen from '../../../Screens/ChatScreen';


const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => {

  const { hasBudget } = useIncome(); // Get hasBudget from context

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
        tabBarIcon: ({ size, color, focused }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = 'sparkles-outline';
          } else if (route.name === 'Budget') {
            iconName = 'wallet-outline';
          }

          return (
            <Icon
              name={iconName}
              size={focused ? 28 : 25}
              color={focused ? '#075E54' : 'black'}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          margin: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 4,
        },
        tabBarActiveTintColor: '#075E54',
        tabBarInactiveTintColor: 'black',
      })}
    >
      {/* Home Tab */}
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerShown: false,
          title: 'Home',
        }} 
      />

      {/* Floating Chat Tab */}
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          headerShown: false,
          title: 'Chat',
          tabBarButton: (props) => (
            <View style={styles.floatingButtonContainer}>
              <TouchableOpacity {...props} style={styles.floatingButton}>
                <Icon name="sparkles-outline" size={30} color="white" />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      {/* Budget Tab */}
      <Tab.Screen 
        name="Budget" 
        component={hasBudget ? BudgetOverview : ProfileScreen} 
        options={{ 
          headerShown: false,
          title: 'Budget',
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20, 
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    left: '50%',
    marginLeft: -35,
  },
  floatingButton: {
    backgroundColor: '#075E54',
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
});

export default BottomTabsNavigator;
