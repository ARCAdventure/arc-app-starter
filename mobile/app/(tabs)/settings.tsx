import { View, Text, Switch } from "react-native";
import { useSettings } from "../storage/useSettings";

export default function Settings() {
  const { breadcrumbsEnabled, setBreadcrumbsEnabled, pingMinutes, setPingMinutes } = useSettings();
  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Settings</Text>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text>Live Breadcrumbs</Text>
        <Switch value={breadcrumbsEnabled} onValueChange={setBreadcrumbsEnabled} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text>Ping Interval (mins)</Text>
        <Text>{pingMinutes}</Text>
      </View>
    </View>
  );
}
