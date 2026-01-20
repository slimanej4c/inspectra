import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type Workshop = {
  id: string;
  unitId: string;
  name: string;
  location?: string;
  description?: string;
  createdAt: number;
};

type WorkshopsState = {
  items: Workshop[];
};

const initialState: WorkshopsState = {
  items: [
    {
      id: "ws-1",
      unitId: "unit-1",
      name: "Atelier 1",
      location: "Zone production",
      description: "Accès staff",
      createdAt: Date.now() - 5000000,
    },
    {
      id: "ws-2",
      unitId: "unit-1",
      name: "Atelier 2",
      location: "Stockage",
      description: "Rayonnages",
      createdAt: Date.now() - 3000000,
    },
    {
      id: "ws-3",
      unitId: "unit-2",
      name: "Réception",
      location: "Quai",
      description: "Entrée principale",
      createdAt: Date.now() - 2000000,
    },
  ],
};

const workshopsSlice = createSlice({
  name: "workshops",
  initialState,
  reducers: {
    addWorkshop: {
      reducer(state, action: PayloadAction<Workshop>) {
        state.items.unshift(action.payload);
      },
      prepare(payload: { unitId: string; name: string; location?: string; description?: string }) {
        return {
          payload: {
            id: nanoid(),
            unitId: payload.unitId,
            name: payload.name.trim(),
            location: payload.location?.trim() || undefined,
            description: payload.description?.trim() || undefined,
            createdAt: Date.now(),
          } satisfies Workshop,
        };
      },
    },

    removeWorkshop(state, action: PayloadAction<string>) {
      state.items = state.items.filter((w) => w.id !== action.payload);
    },
  },
});

export const { addWorkshop, removeWorkshop } = workshopsSlice.actions;
export default workshopsSlice.reducer;
