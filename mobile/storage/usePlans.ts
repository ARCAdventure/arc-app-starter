import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { nanoid } from "./util";

type Plan = {
  id: string;
  title: string;
  trail_name?: string;
  eta_at?: string;
  status: "draft" | "active" | "completed" | "overdue";
};

const db = SQLite.openDatabase("arc.db");

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`create table if not exists plans (id text primary key not null, title text, trail_name text, eta_at text, status text);`);
    });
    refresh();
  }, []);

  function refresh() {
    db.transaction(tx => {
      tx.executeSql("select * from plans", [], (_, { rows }) => setPlans(rows._array as Plan[]));
    });
  }

  function createPlan(p: Partial<Plan>) {
    const id = nanoid();
    db.transaction(tx => {
      tx.executeSql("insert into plans (id, title, trail_name, eta_at, status) values (?, ?, ?, ?, ?);",
        [id, p.title || "", p.trail_name || "", p.eta_at || "", "active"]);
    }, undefined, refresh);
    return id;
  }

  function startPlan(id: string) {
    return new Promise<void>((resolve) => {
      db.transaction(tx => {
        tx.executeSql("update plans set status = ? where id = ?;", ["active", id]);
      }, undefined, () => { refresh(); resolve(); });
    });
  }

  function markSafe(id: string) {
    return new Promise<void>((resolve) => {
      db.transaction(tx => {
        tx.executeSql("update plans set status = ? where id = ?;", ["completed", id]);
      }, undefined, () => { refresh(); resolve(); });
    });
  }

  function completePlan(id: string) {
    return markSafe(id);
  }

  function getPlan(id?: string) {
    return plans.find(p => p.id === id);
  }

  return { plans, createPlan, getPlan, startPlan, markSafe, completePlan };
}
