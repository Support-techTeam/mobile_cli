import { DefaultTheme } from 'react-native-paper';

const customTheme = {
  ...DefaultTheme,
  // Add your customizations here
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db', // Change primary color
    accent: '#f39c12', // Change accent color
  },
};

export default customTheme;