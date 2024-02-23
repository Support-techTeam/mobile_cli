import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  NativeModules,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getProfileDetails} from '../../../stores/ProfileStore';
import {useDispatch} from 'react-redux';
import {setProfile} from '../../../util/redux/userProfile/user.profile.slice';
import {getAccountWallet} from '../../../stores/WalletStore';
import RNRestart from 'react-native-restart';

const defaultInOnNext = 'fadeInLeft';
const defaultOutOnNext = 'fadeOutRight';
const defaultInOnBack = 'fadeInRight';
const defaultOutOnBack = 'fadeOutLeft';

const MultiForm = ({
  comeInOnNext = defaultInOnNext,
  steps = [],
  onNext,
  onBack,
  onFinish,
  duration = 300,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(steps.length - 1);
  const [userState, setUserState] = useState({});
  const [action, setAction] = useState(comeInOnNext);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const dispatch = useDispatch();

  useEffect(() => {
    setTotalSteps(steps.length - 1);
  }, [steps]);

  const next = () => {
    if (currentStep !== totalSteps) {
      if (onNext) onNext();
      setIsLoading(true); // Set loading to true before transition
      setAction(defaultOutOnNext);
      setAnimationFinished(false);
      if (duration > 0) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, duration);
      }
      setTimeout(() => {
        setIsLoading(false); // Set loading to false after transition
      }, duration); // Assuming duration is the same for both transitions
    } else if (!isLoading) {
      finish();
    }
  };

  const back = () => {
    if (currentStep !== 0) {
      if (onBack) onBack();
      setIsLoading(true); // Set loading to true before transition
      setAction(defaultOutOnBack);
      setAnimationFinished(false);
      if (duration > 0) {
        setTimeout(() => {
          setCurrentStep(currentStep - 1);
        }, duration);
      }
      setTimeout(() => {
        setIsLoading(false); // Set loading to false after transition
      }, duration); // Assuming duration is the same for both transitions
    }
  };

  const finish = () => {
    if (onFinish) onFinish(userState);
    fetchProfileState();
    fetchWalletState();
  };

  const cancel = () => {
    if (onCancel) onCancel();
    fetchProfileState();
    fetchWalletState();
  };

  const saveState = state => {
    if (typeof state !== 'object') {
      throw new Error('State must be an object');
    }
    setUserState({...userState, ...state});
  };

  const retrieveState = () => {
    return userState;
  };

  const getCurrentStep = () => {
    return currentStep + 1;
  };

  const getTotalSteps = () => {
    return totalSteps + 1;
  };

  const animationEnd = () => {
    if (!animationFinished) {
      setAction(prevState =>
        prevState === defaultOutOnBack ? defaultInOnBack : defaultInOnNext,
      );
      setAnimationFinished(true);
    }
  };

  const fetchProfileState = async () => {
    try {
      const res = await getProfileDetails();
      if (res?.data !== undefined) {
        if (res?.error) {
        } else {
          dispatch(setProfile(res?.data));
          setTimeout(() => {
            RNRestart.restart();
            // NativeModules.DevSettings.reload();
          }, 1000);
        }
      }
    } catch (error) {}
  };

  const fetchWalletState = async () => {
    try {
      const res = await getAccountWallet();
      if (res?.data !== undefined) {
        if (res?.error) {
        } else {
        }
      }
    } catch (error) {}
  };

  const Step = steps[currentStep].component;

  if (isLoading) {
    return (
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00ff00" animating />
          <Text style={{fontSize: 18, marginTop: 20, color: 'white'}}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animatable.View
      animation={action}
      onAnimationEnd={animationEnd}
      style={{flex: 1}}
      duration={duration}>
      <Step
        next={next}
        back={back}
        saveState={saveState}
        retrieveState={retrieveState}
        getCurrentStep={getCurrentStep}
        getTotalSteps={getTotalSteps}
        cancel={cancel}
        finish={finish}
      />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 75, 102, 0.8)',
  },
  loaderContainer: {
    padding: 20,
    marginTop: hp(10),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MultiForm;
