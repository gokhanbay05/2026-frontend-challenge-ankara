import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import useUrlSearch from "../hooks/useUrlSearch";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SearchBar from "../components/ui/SearchBar";
import EmptyState from "../components/ui/EmptyState";

export default function LocationsPage() {
  const { locations, isLoading, error, fetchData } = useAppStore();
  const navigate = useNavigate();

  const { searchValue, debouncedValue, handleSearchChange } = useUrlSearch(
    "q",
    300,
  );

  useEffect(() => {
    if (locations.length === 0) fetchData();
  }, [fetchData, locations.length]);

  const filteredLocations = useMemo(() => {
    if (!debouncedValue) return locations;
    return locations.filter((location) =>
      location.toLowerCase().includes(debouncedValue.toLowerCase()),
    );
  }, [locations, debouncedValue]);

  return (
    <PageLayout
      title="Locations & Crime Scenes"
      description="Inspect all locations mentioned in the investigation file before mapping."
      loading={isLoading}
      error={error}
      onRetry={fetchData}
      actions={
        <SearchBar
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search location..."
        />
      }
    >
      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLocations.map((location, idx) => (
            <Card
              key={idx}
              title={location}
              description="At least one event (check-in, message, sighting) was recorded at this location."
              image={`https://placehold.co/600x400/1e1e2e/a6adc8/png?text=${encodeURIComponent(location)}`}
              buttonText="Inspect Location"
              bVariant="secondary"
              onButtonClick={() =>
                navigate(`/location/${encodeURIComponent(location)}`)
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Location not found"
          message={`No location record matching "${debouncedValue}" was found.`}
        />
      )}
    </PageLayout>
  );
}
