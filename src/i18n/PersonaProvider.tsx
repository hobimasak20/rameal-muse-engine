import { createContext, useContext, useState, useCallback, useEffect } from "react";

type Ctx = {
  name: string;
  setName: (n: string) => void;
};

const PersonaContext = createContext<Ctx | undefined>(undefined);
const DEFAULT_NAME = "Wandy POV";
const STORAGE_KEY = "rameai_persona";

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).name || DEFAULT_NAME : DEFAULT_NAME;
    } catch {
      return DEFAULT_NAME;
    }
  });

  const setName = useCallback((n: string) => {
    const newName = n || DEFAULT_NAME;
    setNameState(newName);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: newName }));
  }, []);

  return (
    <PersonaContext.Provider value={{ name, setName }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona(): Ctx {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used inside <PersonaProvider>");
  return ctx;
}
