import { normalizeName, getSimilarity } from "./stringHelpers";
import { extractAnswers, parseTimestamp } from "./apiHelpers";
import { NAME_FIELDS } from "../constants/formIds";

export const processRawSubmissions = (results, types) => {
  let allEvents = [];
  results.forEach((res, index) => {
    allEvents = [...allEvents, ...extractAnswers(res.data, types[index])];
  });

  const rawPeopleSet = new Set();
  allEvents.forEach((ev) => {
    NAME_FIELDS.forEach((f) => {
      if (ev[f])
        ev[f].split(",").forEach((n) => rawPeopleSet.add(normalizeName(n)));
    });
  });

  const consolidatedPeople = [];
  const nameMap = {};
  Array.from(rawPeopleSet).forEach((raw) => {
    let match = consolidatedPeople.find(
      (cp) => getSimilarity(raw.toLowerCase(), cp.toLowerCase()) > 0.85,
    );
    if (match) nameMap[raw] = match;
    else {
      consolidatedPeople.push(raw);
      nameMap[raw] = raw;
    }
  });

  const cleanedEvents = allEvents.map((ev) => {
    const newEv = { ...ev };
    NAME_FIELDS.forEach((f) => {
      if (newEv[f]) {
        newEv[f] = newEv[f]
          .split(",")
          .map((p) => nameMap[normalizeName(p)] || normalizeName(p))
          .join(", ");
      }
    });
    return newEv;
  });

  return {
    events: cleanedEvents.sort(
      (a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp),
    ),
    people: consolidatedPeople.sort(),
    locations: Array.from(
      new Set(cleanedEvents.map((e) => e.location?.trim()).filter(Boolean)),
    ).sort(),
  };
};
