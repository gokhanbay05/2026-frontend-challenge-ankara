export const extractAnswers = (data, type) => {
  if (!data?.content) return [];
  return data.content.map((item) => {
    const answers = item.answers || {};
    const parsed = { id: item.id, type };
    Object.values(answers).forEach((ans) => {
      if (ans.name && ans.answer) parsed[ans.name] = ans.answer;
    });
    return parsed;
  });
};

export const parseTimestamp = (ts) => {
  if (!ts) return 0;
  const [date, time] = ts.split(" ");
  const [day, month, year] = date.split("-");
  return new Date(`${year}-${month}-${day}T${time}`).getTime();
};
