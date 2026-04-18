export const normalizeName = (name) => {
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

export const getSimilarity = (s1, s2) => {
  let m = 0;
  if (s1.length === 0 || s2.length === 0) return 0;
  if (s1 === s2) return 1;

  let range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
  let s1Matches = new Array(s1.length);
  let s2Matches = new Array(s2.length);

  for (let i = 0; i < s1.length; i++) {
    let low = Math.max(0, i - range);
    let high = Math.min(i + range + 1, s2.length);
    for (let j = low; j < high; j++) {
      if (!s2Matches[j] && s1[i] === s2[j]) {
        s1Matches[i] = true;
        s2Matches[j] = true;
        m++;
        break;
      }
    }
  }

  if (m === 0) return 0;
  return m / Math.max(s1.length, s2.length);
};
