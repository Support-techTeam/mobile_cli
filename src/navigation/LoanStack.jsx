import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Guarantor, Loanscreen } from '../screens/LoanScreens';
const Stack = createNativeStackNavigator();

const LoanStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoanHome" component={Loanscreen} />
      <Stack.Screen name="Guarantor" component={Guarantor} />
    </Stack.Navigator>
  );
};

export default LoanStack;
