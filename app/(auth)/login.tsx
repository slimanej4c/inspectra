import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../src/store/store";
import { clearError, login } from "../../src/store/slices/authSlice";
import { Button, Card, ErrorBox, Input, Label, Screen, Subtitle, Title } from "../../src/components/Ui";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const error = useSelector((s: RootState) => s.auth.error);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [email, setEmail] = useState("admin@inspectra.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 3 && password.length > 0 && !loading,
    [email, password, loading]
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/units");
    }
  }, [isAuthenticated, router]);

  const onLogin = async () => {
    dispatch(clearError());
    setLoading(true);

    await new Promise((r) => setTimeout(r, 250));

    dispatch(login({ email, password }));

    setLoading(false);
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Card>
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: "rgba(79,70,229,0.18)",
                borderWidth: 1,
                borderColor: "rgba(79,70,229,0.35)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>I</Text>
            </View>

            <Title>Inspectra</Title>
            <Subtitle>Connexion à votre espace de gestion sécurité & inspections.</Subtitle>
          </View>

          <Label>Email</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="ex: admin@inspectra.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />

          <Label>Mot de passe</Label>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            secureTextEntry
            textContentType="password"
          />

          <ErrorBox message={error} />

          <Button title={loading ? "Connexion..." : "Se connecter"} onPress={onLogin} disabled={!canSubmit} />

          <Pressable
            onPress={() => {
              dispatch(clearError());
              router.push("/(auth)/register");
            }}
            style={{ marginTop: 12, alignItems: "center" }}
          >
            <Text style={{ color: "#A5B4FC", fontWeight: "800" }}>Créer un compte</Text>
          </Pressable>

          <View style={{ marginTop: 14, alignItems: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              Test : admin@inspectra.com / 123456
            </Text>

            <Pressable onPress={() => { setEmail("tech@inspectra.com"); setPassword("123456"); }}>
              <Text style={{ color: "#A5B4FC", marginTop: 10, fontWeight: "600" }}>
                Utiliser compte technicien
              </Text>
            </Pressable>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
}
