import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "../../src/store/slices/authSlice";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text>Profil</Text>

      <Pressable
        onPress={() => router.push("/(tabs)/units")}
        style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: "#4F7CFF" }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>Voir les unités</Text>
      </Pressable>

      <Pressable
        onPress={() => dispatch(logout())}
        style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: "#111" }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}
