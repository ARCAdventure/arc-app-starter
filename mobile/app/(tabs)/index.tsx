import { View, Text, Button, FlatList } from "react-native";
import { Link } from "expo-router";
import { usePlans } from "../storage/usePlans";

export default function Dashboard() {
  const { plans } = usePlans();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>ARC Dashboard</Text>
      <Link href="/(tabs)/create" asChild><Button title="Create Plan" /></Link>
      <FlatList
        data={plans}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: "/plan/view", params: { id: item.id } }}
            asChild
          >
            <Button title={`${item.title || "Untitled"} · ${item.status}`} />
          </Link>
        )}
      />
    </View>
  );
}
