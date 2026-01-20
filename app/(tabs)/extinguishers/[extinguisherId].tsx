import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../../src/store/store";
import { updateExtinguisher } from "../../../src/store/slices/extinguishersSlice";

const STATUSES = [
  { key: "OK", label: "OK" },
  { key: "A_VERIFIER", label: "À vérifier" },
  { key: "EXPIRE", label: "Expiré" },
] as const;

export default function ExtinguisherDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { extinguisherId } = useLocalSearchParams<{ extinguisherId: string }>();

  const ex = useSelector((s: RootState) =>
    s.extinguishers.items.find((e) => e.id === extinguisherId)
  );

  const workshop = useSelector((s: RootState) =>
    s.workshops.items.find((w) => w.id === ex?.workshopId)
  );

  const unit = useSelector((s: RootState) =>
    s.units.items.find((u) => u.id === workshop?.unitId)
  );

  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [nextInspection, setNextInspection] = useState("");
  const [status, setStatus] = useState<"OK" | "A_VERIFIER" | "EXPIRE">("OK");

  useEffect(() => {
    if (!ex) return;
    setCode(ex.code ?? "");
    setType(ex.type ?? "");
    setLocation(ex.location ?? "");
    setNextInspection(ex.nextInspection ?? "");
    setStatus(ex.status);
  }, [ex]);

  const headerLine = useMemo(() => {
    const a = unit?.name ? unit.name : "";
    const b = workshop?.name ? workshop.name : "";
    return [a, b].filter(Boolean).join(" • ");
  }, [unit?.name, workshop?.name]);

  if (!ex) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: "white" }}>Extincteur introuvable.</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const onSave = () => {
    dispatch(
      updateExtinguisher({
        id: ex.id,
        changes: {
          code: code.trim(),
          type: type.trim() || undefined,
          location: location.trim() || undefined,
          nextInspection: nextInspection.trim() || undefined,
          status,
        },
      })
    );
    router.back();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Text style={styles.iconBtnText}>←</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>{ex.code}</Text>
          <Text style={styles.sub}>{headerLine || "Détails"}</Text>
        </View>

        <Pressable onPress={onSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Code</Text>
        <TextInput value={code} onChangeText={setCode} style={styles.input} placeholder="EXT-001" placeholderTextColor="#9aa3b2" />

        <Text style={styles.label}>Type</Text>
        <TextInput value={type} onChangeText={setType} style={styles.input} placeholder="ABC / CO2 ..." placeholderTextColor="#9aa3b2" />

        <Text style={styles.label}>Emplacement</Text>
        <TextInput value={location} onChangeText={setLocation} style={styles.input} placeholder="Entrée, couloir..." placeholderTextColor="#9aa3b2" />

        <Text style={styles.label}>Prochaine inspection (YYYY-MM-DD)</Text>
        <TextInput value={nextInspection} onChangeText={setNextInspection} style={styles.input} placeholder="2026-02-10" placeholderTextColor="#9aa3b2" />
      </View>

      <Text style={[styles.label, { marginTop: 14 }]}>Statut</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((s) => {
          const active = status === s.key;
          return (
            <Pressable
              key={s.key}
              onPress={() => setStatus(s.key)}
              style={[styles.statusBtn, active && styles.statusBtnActive]}
            >
              <Text style={[styles.statusText, active && styles.statusTextActive]}>{s.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1220", padding: 16 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },

  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "#111A2D",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  iconBtnText: { color: "white", fontSize: 18, fontWeight: "900" },

  h1: { color: "white", fontSize: 20, fontWeight: "900" },
  sub: { color: "#A7B0C0", marginTop: 4, fontSize: 12 },

  saveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#4F7CFF",
  },
  saveText: { color: "white", fontWeight: "900" },

  card: {
    backgroundColor: "#111A2D",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  label: { color: "#A7B0C0", fontSize: 12, marginBottom: 6, marginTop: 10, fontWeight: "800" },
  input: {
    backgroundColor: "#0E1628",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  statusRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  statusBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#111A2D",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statusBtnActive: {
    backgroundColor: "rgba(79,124,255,0.25)",
    borderColor: "rgba(79,124,255,0.45)",
  },
  statusText: { color: "#A7B0C0", fontWeight: "900", fontSize: 12 },
  statusTextActive: { color: "white" },

  backBtn: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: "#111A2D" },
  backText: { color: "white", fontWeight: "900" },
});
