import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../src/store/store";
import { clearError, register } from "../../src/store/slices/authSlice";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();

  const error = useSelector((s: RootState) => s.auth.error);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    dispatch(clearError());
    dispatch(register({ fullName, email, password }));
    // Si register réussit -> isAuthenticated devient true et ton layout redirect normalement
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.card}>
        <Text style={styles.h1}>Créer un compte</Text>
        <Text style={styles.sub}>Inscris-toi pour commencer à gérer tes unités.</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Nom complet</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Ex: Manon Slimane"
          placeholderTextColor="#9aa3b2"
          style={styles.input}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="ex: demo@inspectra.app"
          placeholderTextColor="#9aa3b2"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="min 6 caractères"
          placeholderTextColor="#9aa3b2"
          style={styles.input}
          secureTextEntry
        />

        <Pressable onPress={onSubmit} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>S’inscrire</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            dispatch(clearError());
            router.replace("/(auth)/login");
          }}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1220", padding: 16, justifyContent: "center" },
  card: {
    backgroundColor: "#111A2D",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  h1: { color: "white", fontSize: 22, fontWeight: "900" },
  sub: { color: "#A7B0C0", marginTop: 6, marginBottom: 14, fontSize: 12 },

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

  primaryBtn: {
    marginTop: 14,
    backgroundColor: "#4F7CFF",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "white", fontWeight: "900" },

  linkBtn: { marginTop: 12, alignItems: "center" },
  linkText: { color: "#A7B0C0", fontWeight: "800" },

  error: { color: "#FFB4B4", fontWeight: "800", marginTop: 8 },
});
