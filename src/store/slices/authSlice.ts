import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import { MOCK_USERS, normalizeEmail, type MockUser } from "../../mock/users";

type AuthState = {
  isAuthenticated: boolean;
  currentUser: { id: string; email: string; fullName: string } | null;
  users: MockUser[];
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  users: [...MOCK_USERS],
  error: null,
};

type LoginPayload = { email: string; password: string };
type RegisterPayload = { fullName: string; email: string; password: string };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },

    login(state, action: PayloadAction<LoginPayload>) {
      state.error = null;

      const email = normalizeEmail(action.payload.email);
      const password = action.payload.password;

      const found = state.users.find((u) => normalizeEmail(u.email) === email);

      if (!found || found.password !== password) {
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = "Email ou mot de passe incorrect.";
        return;
      }

      state.isAuthenticated = true;
      state.currentUser = { id: found.id, email: found.email, fullName: found.fullName };
    },

    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;
    },

    register(state, action: PayloadAction<RegisterPayload>) {
      state.error = null;
    
      const fullName = action.payload.fullName.trim();
      const email = normalizeEmail(action.payload.email);
      const password = action.payload.password;
    
      if (!fullName) {
        state.error = "Le nom est obligatoire.";
        return;
      }
      if (!email.includes("@")) {
        state.error = "Email invalide.";
        return;
      }
      if (password.length < 6) {
        state.error = "Mot de passe trop court (min 6 caractères).";
        return;
      }
    
      const exists = state.users.some(
        (u) => normalizeEmail(u.email) === email
      );
      if (exists) {
        state.error = "Cet email est déjà utilisé.";
        return;
      }
    
      const newUser: MockUser = {
        id: nanoid(),
        email,
        password,
        fullName,
        name: fullName.split(" ")[0], // 👈 simple et logique
        role: "editor",               // 👈 rôle par défaut V1
      };
    
      state.users.unshift(newUser);
    
      // auto-login
      state.isAuthenticated = true;
      state.currentUser = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
      };
    }
  },
});

export const { clearError, login, logout, register } = authSlice.actions;
export default authSlice.reducer;
