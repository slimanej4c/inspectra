import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="units"
        options={{
          title: "Unités",
          tabBarIcon: ({ color, size }) => <Ionicons name="business" color={color} size={size} />,
        }}
      />


      {/* ✅ MASQUER ces routes du menu */}
      <Tabs.Screen name="workshops/[workshopId]" options={{ href: null }} />
<Tabs.Screen name="extinguishers/[extinguisherId]" options={{ href: null }} />
<Tabs.Screen name="units/[unitId]" options={{ href: null }} />


      {/* (Optionnel) au cas où tu as aussi un fichier workshops.tsx/extinguishers.tsx */}
     
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
  name="notifications"
  options={{
    title: "Notif",
    tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size} />,
  }}
/>
    </Tabs>
  );
}
