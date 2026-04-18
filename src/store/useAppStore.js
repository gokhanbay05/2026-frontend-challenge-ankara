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
  if (!name || typeof name !== "string") return "";
  return name
    .trim()
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const getSimilarity = (s1, s2) => {
  if (s1 === s2) return 1;
  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0;

  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);

  let matches = 0;
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, len2);
    for (let k = start; k < end; k++) {
      if (!s2Matches[k] && s1[i] === s2[k]) {
        s1Matches[i] = true;
        s2Matches[k] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) return 0;

  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (s1Matches[i]) {
      while (!s2Matches[k]) k++;
      if (s1[i] !== s2[k]) transpositions++;
      k++;
    }
  }

  return (
    (matches / len1 +
      matches / len2 +
      (matches - transpositions / 2) / matches) /
    3
  );
};

const splitAndCleanNames = (nameString) => {
  if (!nameString || typeof nameString !== "string") return [];
  return nameString
    .split(",")
    .map((n) => normalizeName(n))
    .filter((n) => n.length > 0);
};

const extractAnswers = (data, type) => {
  if (!data?.content) return [];
  return data.content.map((item) => {
    const answers = item.answers || {};
    const parsed = { id: item.id, type };
    Object.values(answers).forEach((ans) => {
      if (ans.name && ans.answer) {
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
    set({ isLoading: true, error: null });
    try {
      const endpoints = Object.entries(FORM_IDS).map(([key, id]) =>
        api
          .get(`/form/${id}/submissions`)
          .catch(() => ({ data: { content: [] } })),
      );

      const results = await Promise.all(endpoints);
      const types = Object.keys(FORM_IDS);
      let allEvents = [];

      results.forEach((res, index) => {
        const parsedData = extractAnswers(res.data, types[index]);
        allEvents = [...allEvents, ...parsedData];
      });

      const sortedEvents = allEvents.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        const dateA =
          a.timestamp.split(" ")[0].split("-").reverse().join("-") +
          "T" +
          a.timestamp.split(" ")[1];
        const dateB =
          b.timestamp.split(" ")[0].split("-").reverse().join("-") +
          "T" +
          b.timestamp.split(" ")[1];
        return new Date(dateA) - new Date(dateB);
      });

      const rawPeopleSet = new Set();
      const locationsSet = new Set();

      sortedEvents.forEach((ev) => {
        if (ev.location) locationsSet.add(ev.location.trim());
        const nameFields = [
          ev.personName,
          ev.senderName,
          ev.recipientName,
          ev.seenWith,
          ev.authorName,
          ev.mentionedPeople,
          ev.suspectName,
        ];
        nameFields.forEach((field) => {
          splitAndCleanNames(field).forEach((name) => rawPeopleSet.add(name));
        });
      });

      const consolidatedPeople = [];
      const rawPeopleArray = Array.from(rawPeopleSet);

      rawPeopleArray.forEach((name) => {
        let isMatchFound = false;
        for (let i = 0; i < consolidatedPeople.length; i++) {
          if (
            getSimilarity(
              name.toLowerCase(),
              consolidatedPeople[i].toLowerCase(),
            ) > 0.85
          ) {
            isMatchFound = true;
            if (name.length < consolidatedPeople[i].length) {
              consolidatedPeople[i] = name;
            }
            break;
          }
        }
        if (!isMatchFound) consolidatedPeople.push(name);
      });

      set({
        events: sortedEvents,
        people: consolidatedPeople.sort(),
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
