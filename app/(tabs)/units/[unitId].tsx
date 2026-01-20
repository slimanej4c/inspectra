import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../../src/store/store";
import { addWorkshop, removeWorkshop } from "../../../src/store/slices/workshopsSlice";

export default function UnitWorkshops() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { unitId } = useLocalSearchParams<{ unitId: string }>();

  const unit = useSelector((s: RootState) => s.units.items.find((u) => u.id === unitId));
  const all = useSelector((s: RootState) => s.workshops.items);

  const [q, setQ] = useState("");

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const list = useMemo(() => {
    const base = all.filter((w) => w.unitId === unitId);
    const t = q.trim().toLowerCase();
    if (!t) return base;
    return base.filter((w) =>
      (w.name + " " + (w.location ?? "") + " " + (w.description ?? ""))
        .toLowerCase()
        .includes(t)
    );
  }, [all, unitId, q]);

  const openAdd = () => {
    setError(null);
    setName("");
    setLocation("");
    setDescription("");
    setIsAddOpen(true);
  };

  const closeAdd = () => setIsAddOpen(false);

  const onAdd = () => {
    setError(null);

    const n = name.trim();
    if (!n) {
      setError("Le nom de l’atelier est obligatoire (ex: Atelier A).");
      return;
    }
    if (!unitId) return;

    dispatch(
      addWorkshop({
        unitId,
        name: n,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      })
    );

    setIsAddOpen(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Ateliers</Text>
          <Text style={styles.sub}>{unit?.name ?? ""}</Text>
        </View>
      </View>

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Rechercher (nom, lieu...)"
        placeholderTextColor="#9aa3b2"
        style={styles.search}
      />

      <Pressable onPress={openAdd} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>+ Ajouter un atelier</Text>
      </Pressable>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(tabs)/workshops/${item.id}`)}
            style={styles.card}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.location ? <Text style={styles.cardMeta}>{item.location}</Text> : null}
              {item.description ? <Text style={styles.cardDesc}>{item.description}</Text> : null}
            </View>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                dispatch(removeWorkshop(item.id));
              }}
              style={styles.trashBtn}
            >
              <Text style={styles.trashText}>Suppr</Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucun atelier</Text>
            <Text style={styles.emptyText}>Ajoute un atelier pour commencer.</Text>
          </View>
        }
      />

      {/* MODAL ADD WORKSHOP */}
      <Modal visible={isAddOpen} transparent animationType="slide" onRequestClose={closeAdd}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ width: "100%" }}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Ajouter un atelier</Text>
                <Pressable onPress={closeAdd} style={styles.closeBtn}>
                  <Text style={styles.closeText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled">
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Text style={styles.label}>Nom *</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Atelier A"
                  placeholderTextColor="#9aa3b2"
                  style={styles.input}
                />

                <Text style={styles.label}>Localisation</Text>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="2e étage / Zone B..."
                  placeholderTextColor="#9aa3b2"
                  style={styles.input}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Notes / infos..."
                  placeholderTextColor="#9aa3b2"
                  style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
                  multiline
                />

                <View style={styles.modalActions}>
                  <Pressable onPress={closeAdd} style={styles.secondaryBtn}>
                    <Text style={styles.secondaryBtnText}>Annuler</Text>
                  </Pressable>
                  <Pressable onPress={onAdd} style={styles.primaryBtnModal}>
                    <Text style={styles.primaryBtnText}>Enregistrer</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1220", padding: 16 },

  topRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#111A2D",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  backText: { color: "white", fontSize: 18, fontWeight: "900" },

  h1: { color: "white", fontSize: 22, fontWeight: "900" },
  sub: { color: "#A7B0C0", marginTop: 4, fontSize: 12 },

  search: {
    backgroundColor: "#0E1628",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  primaryBtn: {
    marginTop: 10,
    backgroundColor: "#4F7CFF",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnModal: {
    flex: 1,
    backgroundColor: "#4F7CFF",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "900" },

  card: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#111A2D",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  cardTitle: { color: "white", fontWeight: "900", fontSize: 16 },
  cardMeta: { color: "#A7B0C0", marginTop: 4, fontSize: 12 },
  cardDesc: { color: "#C9D2E3", marginTop: 6, fontSize: 12 },

  trashBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,80,80,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,80,80,0.25)",
  },
  trashText: { color: "#FFB4B4", fontWeight: "900", fontSize: 12 },

  empty: { marginTop: 30, padding: 16, borderRadius: 16, backgroundColor: "#111A2D" },
  emptyTitle: { color: "white", fontWeight: "900", fontSize: 16 },
  emptyText: { color: "#A7B0C0", marginTop: 6, fontSize: 12 },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#0B1220",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: { color: "white", fontSize: 16, fontWeight: "900" },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#111A2D",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  closeText: { color: "white", fontWeight: "900" },

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

  error: { color: "#FFB4B4", fontWeight: "800", marginTop: 6 },

  modalActions: { flexDirection: "row", gap: 10, marginTop: 14, marginBottom: 6 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#111A2D",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  secondaryBtnText: { color: "white", fontWeight: "900" },
});
