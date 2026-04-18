import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function useUrlSearch(paramName = "q", defaultDelay = 300) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(paramName) || "";

  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (value) {
      setSearchParams({ [paramName]: value });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, defaultDelay);

    return () => clearTimeout(handler);
  }, [searchValue, defaultDelay]);

  return {
    searchValue,
    debouncedValue,
    handleSearchChange,
  };
}
