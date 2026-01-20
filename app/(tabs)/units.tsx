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
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../src/store/store";
import { addUnit, removeUnit } from "../../src/store/slices/unitsSlice";

export default function Units() {
  const router = useRouter();
  const dispatch = useDispatch();
  const units = useSelector((s: RootState) => s.units.items);

  const [q, setQ] = useState("");

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return units;
    return units.filter((u) =>
      (u.name + " " + (u.location ?? "") + " " + (u.description ?? ""))
        .toLowerCase()
        .includes(t)
    );
  }, [q, units]);

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
      setError("Le nom de l’unité est obligatoire (ex: Entrepôt Laval).");
      return;
    }

    dispatch(
      addUnit({
        name: n,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      })
    );

    setIsAddOpen(false);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.h1}>Unités</Text>
      <Text style={styles.sub}>
        Gère tes sites (unités) avant d’ajouter ateliers et extincteurs.
      </Text>

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Rechercher (nom, ville...)"
        placeholderTextColor="#9aa3b2"
        style={styles.search}
      />

      <Pressable onPress={openAdd} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>+ Ajouter une unité</Text>
      </Pressable>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(tabs)/units/${item.id}`)}
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
                dispatch(removeUnit(item.id));
              }}
              style={styles.trashBtn}
            >
              <Text style={styles.trashText}>Suppr</Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucune unité</Text>
            <Text style={styles.emptyText}>Ajoute une première unité pour commencer.</Text>
          </View>
        }
      />

      {/* MODAL ADD UNIT */}
      <Modal visible={isAddOpen} transparent animationType="slide" onRequestClose={closeAdd}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ width: "100%" }}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Ajouter une unité</Text>
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
                  placeholder="Entrepôt Laval"
                  placeholderTextColor="#9aa3b2"
                  style={styles.input}
                />

                <Text style={styles.label}>Localisation</Text>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Laval, QC"
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
  h1: { color: "white", fontSize: 28, fontWeight: "900" },
  sub: { color: "#A7B0C0", marginTop: 6, marginBottom: 14, fontSize: 13 },

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
