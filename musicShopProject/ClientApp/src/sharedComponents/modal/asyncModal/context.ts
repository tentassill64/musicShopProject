import { createContext } from "react";

const AsyncModalContext = createContext<{
    addModal: (id: number, modal: React.ReactNode) => void;
    deleteModal: (id: number) => void;
} | null>(null);

export default AsyncModalContext;
