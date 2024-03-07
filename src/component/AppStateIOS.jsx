import { AppState } from 'react-native';

const AppStateIOS = {
  addEventListener: (event, handler) => {
    if (event === 'change') {
      AppState.addEventListener('change', handler);
    }
  },
  removeEventListener: (event, handler) => {
    if (event === 'change') {
      AppState.removeEventListener('change', handler);
    }
  },
};

export default AppStateIOS;