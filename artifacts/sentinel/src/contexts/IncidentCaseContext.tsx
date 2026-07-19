import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  FEATURED_INCIDENT,
  type IncidentCase,
  type IncidentSource,
} from "@/data/incidentCases";

interface IncidentCaseContextValue {
  incident: IncidentCase;
  source: IncidentSource;
  isOpen: boolean;
  openIncident: (source: IncidentSource, incident?: IncidentCase) => void;
  setIsOpen: (open: boolean) => void;
}

const IncidentCaseContext = createContext<IncidentCaseContextValue | undefined>(
  undefined,
);

export function IncidentCaseProvider({ children }: { children: ReactNode }) {
  const [incident, setIncident] = useState<IncidentCase>(FEATURED_INCIDENT);
  const [source, setSource] = useState<IncidentSource>("command-center");
  const [isOpen, setIsOpen] = useState(false);

  const openIncident = useCallback(
    (nextSource: IncidentSource, nextIncident?: IncidentCase) => {
      if (nextIncident) setIncident(nextIncident);
      setSource(nextSource);
      setIsOpen(true);
    },
    [],
  );

  const value = useMemo(
    () => ({
      incident,
      source,
      isOpen,
      openIncident,
      setIsOpen,
    }),
    [incident, source, isOpen, openIncident],
  );

  return (
    <IncidentCaseContext.Provider value={value}>
      {children}
    </IncidentCaseContext.Provider>
  );
}

export function useIncidentCase() {
  const context = useContext(IncidentCaseContext);
  if (!context) {
    throw new Error("useIncidentCase must be used within IncidentCaseProvider");
  }
  return context;
}
