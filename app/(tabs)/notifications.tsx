import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../../src/store/store";

export default function NotificationsScreen() {
  const units = useSelector((s: RootState) => s.units.items);
  const workshops = useSelector((s: RootState) => s.workshops.items);
  const extinguishers = useSelector((s: RootState) => s.extinguishers.items);

  const notifications = useMemo(() => {
    const now = new Date();

    const items = extinguishers
      .filter((e) => !!e.nextInspection)
      .map((e) => {
        const d = new Date(e.nextInspection as string);
        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        const workshop = workshops.find((w) => w.id === e.workshopId);
        const unit = units.find((u) => u.id === workshop?.unitId);

        return {
          id: e.id,
          code: e.code,
          when: e.nextInspection as string,
          diffDays,
          workshopName: workshop?.name ?? "—",
          unitName: unit?.name ?? "—",
        };
      })
      .filter((x) => x.diffDays <= 30) // dans 30 jours
      .sort((a, b) => a.diffDays - b.diffDays);

    return items;
  }, [extinguishers, workshops, units]);

  return (
    <View style={styles.screen}>
      <Text style={styles.h1}>Notifications</Text>
      <Text style={styles.sub}>Inspections à venir (30 jours).</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.code}</Text>
            <Text style={styles.meta}>
              {item.unitName} • {item.workshopName}
            </Text>
            <Text style={styles.desc}>
              Prochaine inspection : {item.when} ({item.diffDays} j)
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyText}>Aucune inspection prévue dans les 30 jours.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1220", padding: 16 },
  h1: { color: "white", fontSize: 28, fontWeight: "900" },
  sub: { color: "#A7B0C0", marginTop: 6, marginBottom: 14, fontSize: 13 },

  card: {
    backgroundColor: "#111A2D",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  title: { color: "white", fontWeight: "900", fontSize: 16 },
  meta: { color: "#A7B0C0", marginTop: 4, fontSize: 12 },
  desc: { color: "#C9D2E3", marginTop: 8, fontSize: 12 },

  empty: { marginTop: 30, padding: 16, borderRadius: 16, backgroundColor: "#111A2D" },
  emptyTitle: { color: "white", fontWeight: "900", fontSize: 16 },
  emptyText: { color: "#A7B0C0", marginTop: 6, fontSize: 12 },
});
