import { create } from "zustand";
import api from "../api/api";
import toast from "react-hot-toast";

const FORM_IDS = {
  checkins: "261065067494966",
  messages: "261065765723966",
  sightings: "261065244786967",
  notes: "261065509008958",
  tips: "261065875889981",
};

const normalizeName = (name) => {
  if (!name) return "";
  return name
    .trim()
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const splitAndCleanNames = (nameString) => {
  if (!nameString) return [];
  return nameString
    .split(",")
    .map((n) => normalizeName(n))
    .filter((n) => n.length > 0);
};

const extractAnswers = (res, type) => {
  if (!res?.data || !Array.isArray(res.data.content)) return [];

  return res.data.content.map((item) => {
    const answers = item.answers || {};
    const parsed = { id: item.id, type, createdAt: item.created_at };
    Object.values(answers).forEach((ans) => {
      if (ans.name && ans.answer !== undefined) {
        parsed[ans.name] = ans.answer;
      }
    });
    return parsed;
  });
};

const useAppStore = create((set) => ({
  events: [],
  people: [],
  locations: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const endpoints = Object.entries(FORM_IDS).map(([id]) =>
        api
          .get(`/form/${id}/submissions`)
          .catch(() => ({ data: { content: [] } })),
      );

      const results = await Promise.all(endpoints);
      const types = Object.keys(FORM_IDS);
      let allEvents = [];

      results.forEach((res, index) => {
        allEvents = [...allEvents, ...extractAnswers(res, types[index])];
      });

      const sortedEvents = allEvents.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        const [date, time] = a.timestamp.split(" ");
        const [day, month, year] = date.split("-");
        const [bDate, bTime] = b.timestamp.split(" ");
        const [bDay, bMonth, bYear] = bDate.split("-");
        return (
          new Date(`${year}-${month}-${day}T${time}`) -
          new Date(`${bYear}-${bMonth}-${bDay}T${bTime}`)
        );
      });

      const peopleSet = new Set();
      const locationsSet = new Set();

      sortedEvents.forEach((ev) => {
        if (ev.location) locationsSet.add(ev.location.trim());

        const possibleNameFields = [
          ev.personName,
          ev.senderName,
          ev.recipientName,
          ev.seenWith,
          ev.authorName,
          ev.mentionedPeople,
          ev.suspectName,
        ];

        possibleNameFields.forEach((field) => {
          splitAndCleanNames(field).forEach((name) => peopleSet.add(name));
        });
      });

      set({
        events: sortedEvents,
        people: Array.from(peopleSet).sort(),
        locations: Array.from(locationsSet).sort(),
      });
    } catch (err) {
      set({ error: err.message });
      toast.error("Data load failed");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAppStore;
