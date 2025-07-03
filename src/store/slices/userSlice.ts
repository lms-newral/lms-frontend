import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedCourse, User, UserState } from "@/types/userstate";

// Safe localStorage utility
const safeLocalStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set localStorage item ${key}:`, error);
      return false;
    }
  },

  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error);
      return null;
    }
  },
};

const initialState: UserState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  selectedCourse: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    selectCourse: (
      state,
      action: PayloadAction<{ selectedCourse: SelectedCourse }>
    ) => {
      state.selectedCourse = action.payload.selectedCourse;
      if (action.payload.selectedCourse.courseId) {
        safeLocalStorage.setItem(
          "courseId",
          action.payload.selectedCourse.courseId
        );
      }
    },

    setCourse: (state, action: PayloadAction<string>) => {
      state.selectedCourse = { courseId: action.payload };
    },
    setCourseWithPersistence: (state, action: PayloadAction<string>) => {
      state.selectedCourse = { courseId: action.payload };
      // Try to persist to localStorage but it doesn't fail if it doesn't work
      safeLocalStorage.setItem("courseId", action.payload);
      console.log("Course set in Redux:", action.payload);
    },
  },
});

export const {
  setUser,
  logout,
  selectCourse,
  setCourse,
  setCourseWithPersistence,
} = userSlice.actions;
export default userSlice.reducer;
