import { Stack } from "expo-router";
import ReduxProvider from "../src/store/Provider";

export default function RootLayout() {
  return (
    <ReduxProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ReduxProvider>
  );
}
