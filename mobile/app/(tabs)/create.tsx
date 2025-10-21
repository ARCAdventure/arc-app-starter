import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { usePlans } from "../storage/usePlans";

export default function CreatePlan() {
  const [title, setTitle] = useState("");
  const [trail, setTrail] = useState("");
  const [eta, setEta] = useState("");
  const router = useRouter();
  const { createPlan } = usePlans();

  return (
    <View style={{ flex: 1, gap: 12, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>New Plan</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Trail / Route" value={trail} onChangeText={setTrail} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="ETA (e.g., 2025-10-21T18:30:00Z)" value={eta} onChangeText={setEta} style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Save & Start" onPress={() => {
        const id = createPlan({ title, trail_name: trail, eta_at: eta });
        router.replace({ pathname: "/plan/view", params: { id } });
      }} />
    </View>
  );
}
