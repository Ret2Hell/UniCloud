import { createSlice } from "@reduxjs/toolkit";

interface InitialStateTypes {
  id: string;
}

const initialState: InitialStateTypes = {
  id: "",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {},
});

export const {} = globalSlice.actions;

export default globalSlice.reducer;
