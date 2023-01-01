import { createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";
import { User } from "../models/userModel";

export enum Type {
  user = "user",
  owner = "owner",
  guest = "guest",
}

export interface Auth {
  user: User;
  type: Type | null;
  isAuthenticated: boolean;
}
const initialAuthState: Auth = {
  user: { id: "", name: "", email: "" },
  type: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (action.payload.isOwner) {
        state.type = Type.owner;
      } else {
        state.type = Type.user;
      }
    },
    setGuest(state, action) {
      state.type = action.payload;
    },
    updateCart(state, action) {
      state.user.cart = action.payload;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.type = Type.guest;
      state.user = { id: "", name: "", email: "" };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
