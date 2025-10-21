import { useState } from "react";

export function useSettings() {
  const [breadcrumbsEnabled, setBreadcrumbsEnabled] = useState(true);
  const [pingMinutes, setPingMinutes] = useState(10);
  return { breadcrumbsEnabled, setBreadcrumbsEnabled, pingMinutes, setPingMinutes };
}
