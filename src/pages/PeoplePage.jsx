import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import useUrlSearch from "../hooks/useUrlSearch";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SearchBar from "../components/ui/SearchBar";
import Select from "../components/ui/Select";
import EmptyState from "../components/ui/EmptyState";

const SORT_OPTIONS = [
  { label: "Alfabetik (A-Z)", value: "alpha" },
  { label: "En Çok Kayıt", value: "activity" },
];

export default function PeoplePage() {
  const { people, events, isLoading, error, fetchData } = useAppStore();
  const [sortBy, setSortBy] = useState("alpha");
  const navigate = useNavigate();

  const { searchValue, debouncedValue, handleSearchChange } = useUrlSearch(
    "q",
    300,
  );

  useEffect(() => {
    if (people.length === 0) fetchData();
  }, [fetchData, people.length]);

  const processedPeople = useMemo(() => {
    let result = [...people];

    if (debouncedValue) {
      result = result.filter((p) =>
        p.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
    }

    if (sortBy === "activity") {
      result.sort((a, b) => {
        const aCount = events.filter((ev) =>
          JSON.stringify(ev).includes(a),
        ).length;
        const bCount = events.filter((ev) =>
          JSON.stringify(ev).includes(b),
        ).length;
        return bCount - aCount;
      });
    } else {
      result.sort((a, b) => a.localeCompare(b));
    }

    return result;
  }, [people, events, debouncedValue, sortBy]);

  return (
    <PageLayout
      title="Şüpheliler & Kişiler"
      description="Soruşturma ağındaki tüm aktörler ve faaliyet yoğunlukları."
      loading={isLoading}
      error={error}
      onRetry={fetchData}
      actions={
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Select options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          <SearchBar
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="İsim ara..."
          />
        </div>
      }
    >
      {processedPeople.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedPeople.map((person, idx) => {
            const activityCount = events.filter((ev) =>
              JSON.stringify(ev).includes(person),
            ).length;
            return (
              <Card
                key={idx}
                title={person}
                description={`${activityCount} adet soruşturma kaydı bulundu.`}
                image={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person}`}
                buttonText="İncele"
                onButtonClick={() =>
                  navigate(`/person/${encodeURIComponent(person)}`)
                }
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Sonuç Yok"
          message={`"${debouncedValue}" aramasıyla eşleşen bir kayıt bulunamadı.`}
        />
      )}
    </PageLayout>
  );
}
