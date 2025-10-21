import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Location from "expo-location";

const TASK = "ARC_BREADCRUMB_TASK";

TaskManager.defineTask(TASK, async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return BackgroundFetch.Result.NoData;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    // TODO: persist locally and enqueue for sync
    console.log("Breadcrumb", loc.coords.latitude, loc.coords.longitude, loc.coords.accuracy);
    return BackgroundFetch.Result.NewData;
  } catch (e) {
    console.log("Breadcrumb error", e);
    return BackgroundFetch.Result.Failed;
  }
});

export async function startBackgroundTracking() {
  await BackgroundFetch.registerTaskAsync(TASK, {
    minimumInterval: 5 * 60,
    stopOnTerminate: false,
    startOnBoot: true
  });
}

export async function stopBackgroundTracking() {
  const tasks = await TaskManager.getRegisteredTasksAsync();
  const exists = tasks.find(t => t.taskName === TASK);
  if (exists) await BackgroundFetch.unregisterTaskAsync(TASK);
}
