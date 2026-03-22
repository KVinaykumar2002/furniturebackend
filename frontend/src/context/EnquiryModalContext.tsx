import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

type EnquiryModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openEnquiry: () => void;
};

const EnquiryModalContext = createContext<EnquiryModalContextValue | null>(null);

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openEnquiry = useCallback(() => setOpen(true), []);
  const value = useMemo(
    () => ({ open, setOpen, openEnquiry }),
    [open, openEnquiry]
  );
  return (
    <EnquiryModalContext.Provider value={value}>
      {children}
    </EnquiryModalContext.Provider>
  );
}

export function useEnquiryModal() {
  const ctx = useContext(EnquiryModalContext);
  if (!ctx) {
    throw new Error("useEnquiryModal must be used within EnquiryModalProvider");
  }
  return ctx;
}
