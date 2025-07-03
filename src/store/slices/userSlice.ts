import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedCourse, User, UserState } from "@/types/userstate";

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
    },

    setCourse: (state, action: PayloadAction<string>) => {
      state.selectedCourse = { courseId: action.payload };
    },
  },
});

export const { setUser, logout, selectCourse, setCourse } = userSlice.actions;
export default userSlice.reducer;