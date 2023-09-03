import React, {createContext, useContext, useState} from 'react';
import {store} from '../util/redux/store';
import {auth} from '../util/firebase/firebaseConfig';

// Create a context
const UserContext = createContext();

// const userData = store.getState().userAuth.user;
// const isVerified = JSON.parse(userData)?.emailVerified
//   ? JSON.parse(userData)?.emailVerified
//   : JSON.parse(userData)?.user?.emailVerified;
// const userProfileData = useSelector(state => state.userProfile.profile);

// Create a context provider
export const UserProvider = ({children}) => {
  const [userStatus, setUserStatus] = useState({
    verified: false, // Set to true if the user is verified
    hasProfile: false, // Set to true if the user has a profile
    waitingForData: false, // Set to true if the user is waiting for data
  });

  // Define functions to update user status
  const setVerified = () =>
    setUserStatus({...userStatus, verified: auth.currentUser.emailVerified});
  const setHasProfile = () =>
    setUserStatus({
      ...userStatus,
      hasProfile: store.getState().userProfile.profile !== null ? true : false,
    });
  const setWaitingForData = () =>
    setUserStatus({...userStatus, waitingForData: true});

  return (
    <UserContext.Provider
      value={{userStatus, setVerified, setHasProfile, setWaitingForData}}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to access the user status and update functions
export const useUser = () => {
  return useContext(UserContext);
};
