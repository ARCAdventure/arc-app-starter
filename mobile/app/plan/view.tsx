import { View, Text, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePlans } from "../storage/usePlans";
import { startBackgroundTracking, stopBackgroundTracking } from "../services/tracking";

export default function PlanView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlan, markSafe, startPlan, completePlan } = usePlans();
  const router = useRouter();
  const plan = getPlan(id);

  if (!plan) return <Text>Plan not found</Text>;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>{plan.title}</Text>
      <Text>Trail: {plan.trail_name}</Text>
      <Text>ETA: {plan.eta_at}</Text>
      <Text>Status: {plan.status}</Text>
      {plan.status !== "active" ? (
        <Button title="Start Adventure" onPress={async () => {
          await startPlan(plan.id);
          await startBackgroundTracking();
          Alert.alert("Started", "Safety timer running; breadcrumbs active.");
        }} />
      ) : (
        <Button title="I'm Safe" onPress={async () => {
          await markSafe(plan.id);
          await stopBackgroundTracking();
          Alert.alert("Logged", "Marked safe and closed plan.");
          router.replace("/(tabs)/index");
        }} />
      )}
    </View>
  );
}
