import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "../src/store/store";

export default function Index() {
  const status = useSelector((s: RootState) => s.auth.status);
  return status === "authenticated" ? <Redirect href="/(tabs)/units" /> : <Redirect href="/(auth)/login" />;
}
