import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  content: null,
  title: "",
  openModal: (title, content) => set({ isOpen: true, title, content }),
  closeModal: () => set({ isOpen: false, content: null, title: "" }),
}));

export default useModalStore;
