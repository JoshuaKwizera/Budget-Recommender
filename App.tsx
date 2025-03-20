import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { EmailProvider } from './src/utilityFunctions/EmailContext';
import StackNavigator from './src/Transitions/navigation/stackNavigation/StackNavigator';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
import { IncomeProvider } from './src/Storage';

// Create a QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <IncomeProvider>
    <EmailProvider>
      {/* Wrap the app with QueryClientProvider to provide React Query context */}
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </EmailProvider>
    </IncomeProvider>
  );
};

export default App;
