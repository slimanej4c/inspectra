import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

export function Screen({ children }: { children: React.ReactNode }) {
  return <View style={s.screen}>{children}</View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={s.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={s.subtitle}>{children}</Text>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}

export function Input(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput placeholderTextColor="#9CA3AF" style={s.input} {...props} />;
}

export function Button({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [s.btn, pressed && { opacity: 0.9 }, disabled && { opacity: 0.5 }]}>
      <Text style={s.btnText}>{title}</Text>
    </Pressable>
  );
}

export function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View style={s.errorBox}>
      <Text style={s.errorText}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1220", padding: 18, justifyContent: "center" },
  card: {
    backgroundColor: "#111A2E",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  title: { color: "#fff", fontSize: 28, fontWeight: "800", letterSpacing: 0.2 },
  subtitle: { color: "rgba(255,255,255,0.72)", marginTop: 6, marginBottom: 18, lineHeight: 20 },
  label: { color: "rgba(255,255,255,0.75)", marginBottom: 6, marginTop: 10, fontSize: 12 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    color: "#fff",
  },
  btn: {
    marginTop: 14,
    backgroundColor: "#4F46E5",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  errorBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(239,68,68,0.15)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
  },
  errorText: { color: "#FCA5A5", fontSize: 13 },
});
