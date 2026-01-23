// app/_layout.tsx 
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLastActivity, logoutUser } from "./slices/authSlice";
import { RootState } from "./store";
import { useRouter } from "expo-router";
import {
  AppState,
  AppStateStatus,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const ActivityTracker: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { lastActivity, expires } = useSelector(
    (state: RootState) => state.auth
  );
  const storedUser = useSelector((state: RootState) => state.user.user);

  // Convert expires (in seconds) to milliseconds
  const INACTIVITY_THRESHOLD = parseInt(expires || "900") * 1000;

  const handleActivity = useCallback(() => {
    dispatch(updateLastActivity());
  }, [dispatch]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          handleActivity();
        }
      }
    );

    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - lastActivity;

      if (timeDiff >= INACTIVITY_THRESHOLD) {
        dispatch(logoutUser());

        router.replace("/auth/login");

        clearInterval(interval);
      }
    }, 1000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [lastActivity, handleActivity, INACTIVITY_THRESHOLD, dispatch, router]);

  // Catch all user interactions in the app
  return (
    <TouchableWithoutFeedback onPress={handleActivity}>
      <View onResponderMove={handleActivity}>
        {/* Pass through children if you're embedding this at app level */}
        <></>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ActivityTracker;
