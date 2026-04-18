import { create } from "zustand";
import api from "../api/api";
import toast from "react-hot-toast";
import { FORM_IDS } from "../constants/formIds";
import { processRawSubmissions } from "../utils/dataProcessor";

const useAppStore = create((set) => ({
  events: [],
  people: [],
  locations: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const endpoints = Object.entries(FORM_IDS).map(([_, id]) =>
        api
          .get(`/form/${id}/submissions`)
          .catch(() => ({ data: { content: [] } })),
      );

      const results = await Promise.all(endpoints);
      const { events, people, locations } = processRawSubmissions(
        results,
        Object.keys(FORM_IDS),
      );

      set({ events, people, locations });
    } catch (err) {
      set({ error: err.message });
      toast.error("Data load failed");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAppStore;
