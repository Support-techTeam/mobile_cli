import React, { useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";

const defaultInOnNext = "fadeInLeft";
const defaultOutOnNext = "fadeOutRight";
const defaultInOnBack = "fadeInRight";
const defaultOutOnBack = "fadeOutLeft";

const MultiForm = ({ comeInOnNext = defaultInOnNext, steps = [], onNext, onBack, onFinish, duration = 300 }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(steps.length - 1);
  const [userState, setUserState] = useState({});
  const [action, setAction] = useState(comeInOnNext);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    setTotalSteps(steps.length - 1);
  }, [steps]);

  const next = () => {
    if (currentStep !== totalSteps) {
      if (onNext) onNext();
      setAction(defaultOutOnNext);
      setAnimationFinished(false);
      if (duration > 0) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, duration);
      }
    } else {
      finish();
    }
  };

  const back = () => {
    if (currentStep !== 0) {
      if (onBack) onBack();
      setAction(defaultOutOnBack);
      setAnimationFinished(false);
      if (duration > 0) {
        setTimeout(() => {
          setCurrentStep(currentStep - 1);
        }, duration);
      }
    }
  };

  const finish = () => {
    if (onFinish) onFinish(userState);
  };

  const saveState = (state) => {
    if (typeof state !== "object") {
      throw new Error("State must be an object");
    }
    setUserState({ ...userState, ...state });
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
      setAction((prevState) =>
        prevState === defaultOutOnBack ? defaultInOnBack : defaultInOnNext
      );
      setAnimationFinished(true);
    }
  };

  const Step = steps[currentStep].component;

  return (
    <Animatable.View
      animation={action}
      onAnimationEnd={animationEnd}
      style={{ flex: 1 }}
      duration={duration}
    >
      <Step
        next={next}
        back={back}
        saveState={saveState}
        retrieveState={retrieveState}
        getCurrentStep={getCurrentStep}
        getTotalSteps={getTotalSteps}
      />
    </Animatable.View>
  );
};

export default MultiForm;
