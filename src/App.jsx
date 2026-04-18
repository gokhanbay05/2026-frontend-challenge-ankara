import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = "ad39735f1449a6dc28d60e0921352665";
  const FORM_IDS = {
    checkins: "261065067494966",
    messages: "261065765723966",
    sightings: "261065244786967",
    personalNotes: "261065509008958",
    anonymousTips: "261065875889981",
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const endpoints = Object.entries(FORM_IDS).map(([id]) =>
          axios.get(
            `https://api.jotform.com/form/${id}/submissions?apiKey=${API_KEY}`,
          ),
        );

        const results = await Promise.all(endpoints);
        const mappedData = {};

        Object.keys(FORM_IDS).forEach((key, index) => {
          // Sadece ilk kaydı (örnek olması için) ve içindeki cevapları alalım
          mappedData[key] =
            results[index].data.content[0]?.answers || "No data";
        });

        setData(mappedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAll();
  }, []);

  if (error) return <div style={{ color: "red" }}>Hata: {error}</div>;
  if (!data) return <div>Veriler yükleniyor...</div>;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "monospace",
        backgroundColor: "#1a1a1a",
        color: "#00ff00",
      }}
    >
      <h1>🔍 JOTFORM DATA EXPLORER</h1>
      <hr />
      {Object.entries(data).map(([formName, answers]) => (
        <section key={formName} style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#ff00ff" }}>📂 {formName.toUpperCase()}</h2>
          <pre
            style={{
              backgroundColor: "#000",
              padding: "10px",
              borderRadius: "5px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(answers, null, 2)}
          </pre>
        </section>
      ))}
    </div>
  );
}
