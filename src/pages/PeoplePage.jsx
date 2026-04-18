import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import useUrlSearch from "../hooks/useUrlSearch";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SearchBar from "../components/ui/SearchBar";
import EmptyState from "../components/ui/EmptyState";

export default function PeoplePage() {
  const { people, isLoading, error, fetchData } = useAppStore();
  const navigate = useNavigate();

  const { searchValue, debouncedValue, handleSearchChange } = useUrlSearch(
    "q",
    300,
  );

  useEffect(() => {
    if (people.length === 0) fetchData();
  }, [fetchData, people.length]);

  const filteredPeople = useMemo(() => {
    if (!debouncedValue) return people;
    return people.filter((person) =>
      person.toLowerCase().includes(debouncedValue.toLowerCase()),
    );
  }, [people, debouncedValue]);

  return (
    <PageLayout
      title="Şüpheliler & Kişiler"
      description="Soruşturmada adı geçen tüm kişileri inceleyin."
      loading={isLoading}
      error={error}
      onRetry={fetchData}
      actions={
        <SearchBar
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="İsim ara..."
        />
      }
    >
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPeople.map((person, idx) => (
            <Card
              key={idx}
              title={person}
              description="Soruşturma Kaydı Mevcut"
              image={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person}`}
              buttonText="Profili İncele"
              onButtonClick={() =>
                navigate(`/person/${encodeURIComponent(person)}`)
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Kişi bulunamadı"
          message={`"${debouncedValue}" aramasıyla eşleşen bir kayıt yok.`}
        />
      )}
    </PageLayout>
  );
}
