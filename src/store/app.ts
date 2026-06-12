import { create } from 'zustand';

export type TabId = 'inicio' | 'assistente' | 'verificar' | 'conhecimento' | 'sabias' | 'academia' | 'comunidade' | 'helpdesk';

interface PersistedState {
  points: number;
  level: number;
  badges: string[];
  quizzesCompleted: number;
  articlesRead: number;
}

const STORAGE_KEY = 'cidseguro_state';

function loadPersistedState(): Partial<PersistedState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function savePersistedState(state: Partial<PersistedState>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  points: number;
  level: number;
  addPoints: (pts: number) => void;
  badges: string[];
  addBadge: (badge: string) => void;
  quizzesCompleted: number;
  articlesRead: number;
  incrementQuizzes: () => void;
  incrementArticles: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const saved = loadPersistedState();

  return {
    activeTab: 'inicio',
    setActiveTab: (tab) => set({ activeTab: tab, mobileMenuOpen: false }),
    points: saved.points ?? 0,
    level: saved.level ?? 1,
    addPoints: (pts) => {
      const newPoints = get().points + pts;
      const newLevel = Math.floor(newPoints / 100) + 1;
      set({ points: newPoints, level: newLevel });
      savePersistedState({ points: newPoints, level: newLevel, badges: get().badges, quizzesCompleted: get().quizzesCompleted, articlesRead: get().articlesRead });
    },
    badges: saved.badges ?? [],
    addBadge: (badge) => {
      set((s) => {
        const newBadges = [...new Set([...s.badges, badge])];
        savePersistedState({ points: s.points, level: s.level, badges: newBadges, quizzesCompleted: s.quizzesCompleted, articlesRead: s.articlesRead });
        return { badges: newBadges };
      });
    },
    quizzesCompleted: saved.quizzesCompleted ?? 0,
    incrementQuizzes: () => {
      const newVal = get().quizzesCompleted + 1;
      set({ quizzesCompleted: newVal });
      savePersistedState({ points: get().points, level: get().level, badges: get().badges, quizzesCompleted: newVal, articlesRead: get().articlesRead });
    },
    articlesRead: saved.articlesRead ?? 0,
    incrementArticles: () => {
      const newVal = get().articlesRead + 1;
      set({ articlesRead: newVal });
      savePersistedState({ points: get().points, level: get().level, badges: get().badges, quizzesCompleted: get().quizzesCompleted, articlesRead: newVal });
    },
    mobileMenuOpen: false,
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  };
});