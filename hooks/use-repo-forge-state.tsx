"use client";

import { createContext, useContext, useReducer, useEffect, type Dispatch } from "react";
import { loadState, saveState } from "@/lib/state-persistence";

// --- Types ---

export interface RepoEntry {
  url: string;
  owner: string;
  repo: string;
  userNotes: string;
}

export type Audience = "saas" | "internal" | "personal";
export type Commercial = "subscription" | "opensource" | "selfhosted";
export type LicenseChoice = "strict" | "permissive" | "whatever";
export type Step = 1 | 2 | 3 | 4;
export type WorkspaceTab = "architecture" | "gaps" | "harmony" | "claude" | "v2backlog";

export interface RepoForgeState {
  step: Step;
  githubUrlInput: string;
  urlError: string;
  repos: RepoEntry[];
  githubPat: string;
  showSettings: boolean;
  audience: Audience;
  commercial: Commercial;
  licenseChoice: LicenseChoice;
  techPreference: string;
  targetGoal: string;
  smeltingLogs: string[];
  smeltingProgress: number;
  apiError: string | null;
  blueprintResult: any;
  copiedPrompt: boolean;
  activeWorkspaceTab: WorkspaceTab;
}

// --- Actions ---

export type RepoForgeAction =
  | { type: "SET_STEP"; payload: Step }
  | { type: "SET_GITHUB_URL_INPUT"; payload: string }
  | { type: "SET_URL_ERROR"; payload: string }
  | { type: "SET_REPOS"; payload: RepoEntry[] }
  | { type: "SET_GITHUB_PAT"; payload: string }
  | { type: "SET_SHOW_SETTINGS"; payload: boolean }
  | { type: "SET_AUDIENCE"; payload: Audience }
  | { type: "SET_COMMERCIAL"; payload: Commercial }
  | { type: "SET_LICENSE_CHOICE"; payload: LicenseChoice }
  | { type: "SET_TECH_PREFERENCE"; payload: string }
  | { type: "SET_TARGET_GOAL"; payload: string }
  | { type: "APPEND_SMELTING_LOG"; payload: string }
  | { type: "SET_SMELTING_PROGRESS"; payload: number }
  | { type: "SET_API_ERROR"; payload: string | null }
  | { type: "SET_BLUEPRINT_RESULT"; payload: any }
  | { type: "SET_COPIED_PROMPT"; payload: boolean }
  | { type: "SET_WORKSPACE_TAB"; payload: WorkspaceTab }
  | { type: "RESET_SMELTING" }
  | { type: "RESTORE_STATE"; payload: Partial<RepoForgeState> };

// --- Initial state ---

const initialState: RepoForgeState = {
  step: 1,
  githubUrlInput: "",
  urlError: "",
  repos: [
    { url: "https://github.com/vercel/ai", owner: "vercel", repo: "ai", userNotes: "核心 AI 大模型流式渲染引擎" },
    { url: "https://github.com/shadcn-ui/ui", owner: "shadcn-ui", repo: "ui", userNotes: "精美前端 UI 及基本组件原语" },
  ],
  githubPat: "",
  showSettings: false,
  audience: "saas",
  commercial: "subscription",
  licenseChoice: "strict",
  techPreference: "typescript-next",
  targetGoal: "构建一个支持 AI 交互、基于 Stripe 订阅、具备高阶仪表盘统计的现代化全栈 SaaS 平台。",
  smeltingLogs: [],
  smeltingProgress: 0,
  apiError: null,
  blueprintResult: null,
  copiedPrompt: false,
  activeWorkspaceTab: "architecture",
};

// --- Reducer ---

function reducer(state: RepoForgeState, action: RepoForgeAction): RepoForgeState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_GITHUB_URL_INPUT":
      return { ...state, githubUrlInput: action.payload };
    case "SET_URL_ERROR":
      return { ...state, urlError: action.payload };
    case "SET_REPOS":
      return { ...state, repos: action.payload };
    case "SET_GITHUB_PAT":
      return { ...state, githubPat: action.payload };
    case "SET_SHOW_SETTINGS":
      return { ...state, showSettings: action.payload };
    case "SET_AUDIENCE":
      return { ...state, audience: action.payload };
    case "SET_COMMERCIAL":
      return { ...state, commercial: action.payload };
    case "SET_LICENSE_CHOICE":
      return { ...state, licenseChoice: action.payload };
    case "SET_TECH_PREFERENCE":
      return { ...state, techPreference: action.payload };
    case "SET_TARGET_GOAL":
      return { ...state, targetGoal: action.payload };
    case "APPEND_SMELTING_LOG":
      return { ...state, smeltingLogs: [...state.smeltingLogs, action.payload] };
    case "SET_SMELTING_PROGRESS":
      return { ...state, smeltingProgress: action.payload };
    case "SET_API_ERROR":
      return { ...state, apiError: action.payload };
    case "SET_BLUEPRINT_RESULT":
      return { ...state, blueprintResult: action.payload };
    case "SET_COPIED_PROMPT":
      return { ...state, copiedPrompt: action.payload };
    case "SET_WORKSPACE_TAB":
      return { ...state, activeWorkspaceTab: action.payload };
    case "RESET_SMELTING":
      return { ...state, smeltingLogs: [], smeltingProgress: 0, apiError: null };
    case "RESTORE_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// --- Context ---

const StateContext = createContext<RepoForgeState>(initialState);
const DispatchContext = createContext<Dispatch<RepoForgeAction>>(() => {});

export function RepoForgeStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore persisted state on mount
  useEffect(() => {
    const saved = loadState<Partial<RepoForgeState>>();
    if (saved) {
      dispatch({ type: "RESTORE_STATE", payload: saved });
    }
  }, []);

  // Persist state on every change (debounced implicitly by React batching)
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useRepoForgeState() {
  return useContext(StateContext);
}

export function useRepoForgeDispatch() {
  return useContext(DispatchContext);
}
