import type { HealthCondition } from "./types";

// Simple in-memory store for conditions data
let conditionsData: HealthCondition[] = [];

export function setConditions(conditions: HealthCondition[]) {
  conditionsData = conditions;
  // Also persist to sessionStorage for page refreshes
  if (typeof window !== "undefined") {
    sessionStorage.setItem("conditions", JSON.stringify(conditions));
  }
}

export function getConditions(): HealthCondition[] {
  if (conditionsData.length > 0) {
    return conditionsData;
  }
  // Try to restore from sessionStorage
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("conditions");
    if (stored) {
      conditionsData = JSON.parse(stored);
      return conditionsData;
    }
  }
  return [];
}

export function getConditionByName(name: string): HealthCondition | undefined {
  const conditions = getConditions();
  return conditions.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}
