"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import type { Dispatch, ReactNode } from "react";

import { toast } from "sonner";
import { initialState, mockReducer, workspaceCustomer, restoreWorkspace } from "@/lib/mock-data";
import { useParams } from "next/navigation";
import type { Action, MockState } from "@/lib/mock-data";

type Context = {
  state: MockState;
  dispatch: Dispatch<Action>;
  orgId: string;
  setOrgId: (id: string) => void;
  customerId: string;
  setCustomerId: (id: string) => void;
  ready: boolean;
  persistent: boolean;
};
const WorkspaceContext = createContext<Context | null>(null);
const STORAGE_KEY = "jmwired-mock-v1";
type InternalAction = Action | { type: "restore"; state: MockState };
function reducer(state: MockState, action: InternalAction) {
  return action.type === "restore" ? action.state : mockReducer(state, action);
}

export default function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedOrgId, updateOrgId] = useState("poblacion");
  const params = useParams();
  const orgId = typeof params.orgSlug === "string" ? params.orgSlug : selectedOrgId;
  const [selectedCustomerId, setCustomerId] = useState("JM-001");
  const customerId = workspaceCustomer(state, orgId, selectedCustomerId)?.id ?? "";
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MockState;
        if (
          [
            parsed.organizations,
            parsed.customers,
            parsed.payments,
            parsed.tickets,
            parsed.announcements,
          ].every(Array.isArray) &&
          parsed.organizations.length &&
          parsed.preferences &&
          parsed.userRoles
        ) {
          dispatch({ type: "restore", state: restoreWorkspace(parsed) });
          const selectedOrg = localStorage.getItem("jmwired-preview-org");
          const activeOrg = parsed.organizations.some((org) => org.id === selectedOrg)
            ? selectedOrg!
            : parsed.organizations[0]!.id;
          updateOrgId(activeOrg);
          const selectedCustomer = localStorage.getItem("jmwired-preview-customer");
          setCustomerId(workspaceCustomer(parsed, activeOrg, selectedCustomer ?? "")?.id ?? "");
        }
      }
    } catch {
      toast.info("Saved workspace could not be loaded. Starting with sample accounts.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (
      ready &&
      typeof params.orgSlug === "string" &&
      params.orgSlug !== selectedOrgId &&
      state.organizations.some((org) => org.id === params.orgSlug)
    ) {
      updateOrgId(params.orgSlug);
      setCustomerId(workspaceCustomer(state, params.orgSlug, selectedCustomerId)?.id ?? "");
    }
  }, [ready, params.orgSlug, selectedOrgId, selectedCustomerId, state]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setPersistent(true);
    } catch {
      setPersistent(false);
      toast.info("Browser storage is full. Changes are available for this session.");
    }
  }, [state, ready]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("jmwired-preview-org", orgId);
      localStorage.setItem("jmwired-preview-customer", customerId);
    } catch {
      /* Demo still works in memory. */
    }
  }, [orgId, customerId, ready]);
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const saved = JSON.parse(event.newValue) as MockState;
        if (
          !saved.organizations?.length ||
          !saved.customers ||
          !saved.payments ||
          !saved.tickets ||
          !saved.announcements ||
          !saved.preferences ||
          !saved.userRoles
        )
          return;
        dispatch({ type: "restore", state: restoreWorkspace(saved) });
        if (!saved.organizations.some((org) => org.id === orgId)) {
          updateOrgId(saved.organizations[0]!.id);
          setCustomerId(workspaceCustomer(saved, saved.organizations[0]!.id, "")?.id ?? "");
        }
      } catch {
        /* Ignore invalid storage updates. */
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [orgId]);
  function setOrgId(id: string) {
    updateOrgId(id);
    setCustomerId(workspaceCustomer(state, id, "")?.id ?? "");
  }
  return (
    <WorkspaceContext.Provider
      value={{ state, dispatch, orgId, setOrgId, customerId, setCustomerId, ready, persistent }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("WorkspaceProvider is required");
  return value;
}
