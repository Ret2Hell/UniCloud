import { createSlice } from "@reduxjs/toolkit";

interface InitialStateTypes {
  id: string | null;
}

const initialState: InitialStateTypes = {
  id: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    clearId: (state) => {
      state.id = null;
    },
  },
});

export const { setId, clearId } = globalSlice.actions;

export default globalSlice.reducer;
