import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type Unit = {
  id: string;
  name: string;
  location?: string;
  description?: string;
  createdAt: number;
};

type UnitsState = {
  items: Unit[];
};

const initialState: UnitsState = {
  items: [
    { id: "unit-1", name: "Unité A", location: "Montréal", description: "Site principal", createdAt: Date.now() - 86400000 },
    { id: "unit-2", name: "Unité B", location: "Laval", description: "Entrepôt", createdAt: Date.now() - 3600000 },
  ],
};

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    addUnit: {
      reducer(state, action: PayloadAction<Unit>) {
        state.items.unshift(action.payload);
      },
      prepare(payload: { name: string; location?: string; description?: string }) {
        return {
          payload: {
            id: nanoid(),
            name: payload.name.trim(),
            location: payload.location?.trim(),
            description: payload.description?.trim(),
            createdAt: Date.now(),
          } satisfies Unit,
        };
      },
    },
    removeUnit(state, action: PayloadAction<string>) {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
  },
});

export const { addUnit, removeUnit } = unitsSlice.actions;
export default unitsSlice.reducer;
