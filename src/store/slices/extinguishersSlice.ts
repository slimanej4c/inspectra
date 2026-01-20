import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type ExtinguisherStatus = "OK" | "A_VERIFIER" | "EXPIRE";

export type Extinguisher = {
  id: string;
  workshopId: string;
  code: string;          // ex: EXT-001
  type?: string;         // ex: ABC, CO2
  location?: string;     // ex: entrée, couloir
  nextInspection?: string; // YYYY-MM-DD
  status: ExtinguisherStatus;
  createdAt: number;
};

type State = {
  items: Extinguisher[];
};

const initialState: State = {
  items: [
    { id: "ex-1", workshopId: "ws-1", code: "EXT-001", type: "ABC", location: "Entrée", nextInspection: "2026-02-10", status: "OK", createdAt: Date.now() - 999999 },
    { id: "ex-2", workshopId: "ws-1", code: "EXT-002", type: "CO2", location: "Couloir", nextInspection: "2026-01-15", status: "A_VERIFIER", createdAt: Date.now() - 888888 },
    { id: "ex-3", workshopId: "ws-3", code: "EXT-010", type: "ABC", location: "Quai", nextInspection: "2025-12-01", status: "EXPIRE", createdAt: Date.now() - 777777 },
    { id: "ex-4", workshopId: "ws-1", code: "EXT-001", type: "ABC", location: "Entrée", nextInspection: "2026-02-10", status: "OK", createdAt: Date.now() - 999999 },
    { id: "ex-5", workshopId: "ws-1", code: "EXT-002", type: "CO2", location: "Couloir", nextInspection: "2026-01-15", status: "A_VERIFIER", createdAt: Date.now() - 888888 },
    { id: "ex-6", workshopId: "ws-3", code: "EXT-010", type: "ABC", location: "Quai", nextInspection: "2025-12-01", status: "EXPIRE", createdAt: Date.now() - 777777 },
    { id: "ex-7", workshopId: "ws-1", code: "EXT-001", type: "ABC", location: "Entrée", nextInspection: "2026-02-10", status: "OK", createdAt: Date.now() - 999999 },
    { id: "ex-8", workshopId: "ws-1", code: "EXT-002", type: "CO2", location: "Couloir", nextInspection: "2026-01-15", status: "A_VERIFIER", createdAt: Date.now() - 888888 },
    { id: "ex-33", workshopId: "ws-3", code: "EXT-010", type: "ABC", location: "Quai", nextInspection: "2025-12-01", status: "EXPIRE", createdAt: Date.now() - 777777 },
    { id: "ex-13", workshopId: "ws-1", code: "EXT-001", type: "ABC", location: "Entrée", nextInspection: "2026-02-10", status: "OK", createdAt: Date.now() - 999999 },
    { id: "ex-23", workshopId: "ws-1", code: "EXT-002", type: "CO2", location: "Couloir", nextInspection: "2026-01-15", status: "A_VERIFIER", createdAt: Date.now() - 888888 },
    { id: "ex-33", workshopId: "ws-3", code: "EXT-010", type: "ABC", location: "Quai", nextInspection: "2025-12-01", status: "EXPIRE", createdAt: Date.now() - 777777 },
    { id: "ex-14", workshopId: "ws-1", code: "EXT-001", type: "ABC", location: "Entrée", nextInspection: "2026-02-10", status: "OK", createdAt: Date.now() - 999999 },
    { id: "ex-24", workshopId: "ws-1", code: "EXT-002", type: "CO2", location: "Couloir", nextInspection: "2026-01-15", status: "A_VERIFIER", createdAt: Date.now() - 888888 },
    { id: "ex-34", workshopId: "ws-3", code: "EXT-010", type: "ABC", location: "Quai", nextInspection: "2025-12-01", status: "EXPIRE", createdAt: Date.now() - 777777 },
    { id: "ex-15", workshopId: "ws-1", code: "EXT-001", type: "ABC", location: "Entrée", nextInspection: "2026-02-10", status: "OK", createdAt: Date.now() - 999999 },
    { id: "ex-25", workshopId: "ws-1", code: "EXT-002", type: "CO2", location: "Couloir", nextInspection: "2026-01-15", status: "A_VERIFIER", createdAt: Date.now() - 888888 },
    { id: "ex-35", workshopId: "ws-3", code: "EXT-010", type: "ABC", location: "Quai", nextInspection: "2025-12-01", status: "EXPIRE", createdAt: Date.now() - 777777 },
    
],
};

const slice = createSlice({
  name: "extinguishers",
  initialState,
  reducers: {
    addExtinguisher: {
        reducer(state, action: PayloadAction<Extinguisher>) {
          state.items.unshift(action.payload);
        },
        prepare(payload: {
          workshopId: string;
          code: string;
          type?: string;
          location?: string;
          nextInspection?: string; // YYYY-MM-DD
        }) {
          const today = new Date();
          const parse = (s?: string) => {
            if (!s) return null;
            const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
            if (!m) return null;
            const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
            return Number.isNaN(d.getTime()) ? null : d;
          };
      
          const insp = parse(payload.nextInspection);
          let status: ExtinguisherStatus = "OK";
      
          if (insp) {
            const diffDays = Math.floor((insp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) status = "EXPIRE";
            else if (diffDays <= 30) status = "A_VERIFIER";
            else status = "OK";
          }
      
          return {
            payload: {
              id: nanoid(),
              workshopId: payload.workshopId,
              code: payload.code.trim(),
              type: payload.type?.trim() || undefined,
              location: payload.location?.trim() || undefined,
              nextInspection: payload.nextInspection?.trim() || undefined,
              status,
              createdAt: Date.now(),
            } satisfies Extinguisher,
          };
        },
      },
    removeExtinguisher(state, action: PayloadAction<string>) {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
    updateExtinguisher(
        state,
        action: PayloadAction<{ id: string; changes: Partial<Omit<Extinguisher, "id" | "createdAt">> }>
      ) {
        const ex = state.items.find((e) => e.id === action.payload.id);
        if (!ex) return;
        Object.assign(ex, action.payload.changes);
      },
  },
});

export const { addExtinguisher, removeExtinguisher, updateExtinguisher } = slice.actions;

export default slice.reducer;
