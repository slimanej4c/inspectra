import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../../src/store/store";

export default function Home() {
  const units = useSelector((s: RootState) => s.units.items);
  const workshops = useSelector((s: RootState) => s.workshops.items);
  const extinguishers = useSelector((s: RootState) => s.extinguishers.items);

  const stats = useMemo(() => {
    const totalUnits = units.length;
    const totalWorkshops = workshops.length;
    const totalExtinguishers = extinguishers.length;

    const dueSoon = extinguishers.filter((e) => {
      if (!e.nextInspection) return false;
      // simple: compare string YYYY-MM-DD
      const today = new Date();
      const d = new Date(e.nextInspection);
      const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    }).length;

    return { totalUnits, totalWorkshops, totalExtinguishers, dueSoon };
  }, [units, workshops, extinguishers]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.h1}>Accueil</Text>
      <Text style={styles.sub}>Récap rapide des unités, ateliers et extincteurs.</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Unités</Text>
          <Text style={styles.cardValue}>{stats.totalUnits}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ateliers</Text>
          <Text style={styles.cardValue}>{stats.totalWorkshops}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Extincteurs</Text>
          <Text style={styles.cardValue}>{stats.totalExtinguishers}</Text>
        </View>

        <View style={styles.cardWarn}>
          <Text style={styles.cardLabel}>À inspecter (30j)</Text>
          <Text style={styles.cardValue}>{stats.dueSoon}</Text>
        </View>
      </View>

      <View style={styles.bigCard}>
        <Text style={styles.bigTitle}>Prochaines actions</Text>
        <Text style={styles.bigText}>• Ajouter une unité</Text>
        <Text style={styles.bigText}>• Ajouter des ateliers</Text>
        <Text style={styles.bigText}>• Planifier les inspections</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1220", padding: 16 },
  h1: { color: "white", fontSize: 28, fontWeight: "900" },
  sub: { color: "#A7B0C0", marginTop: 6, marginBottom: 14, fontSize: 13 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    width: "48%",
    backgroundColor: "#111A2D",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardWarn: {
    width: "48%",
    backgroundColor: "rgba(255,180,60,0.10)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,180,60,0.25)",
  },
  cardLabel: { color: "#A7B0C0", fontSize: 12, fontWeight: "800" },
  cardValue: { color: "white", fontSize: 24, fontWeight: "900", marginTop: 6 },

  bigCard: {
    marginTop: 14,
    backgroundColor: "#111A2D",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  bigTitle: { color: "white", fontWeight: "900", fontSize: 14, marginBottom: 10 },
  bigText: { color: "#C9D2E3", fontSize: 12, marginTop: 6 },
});
