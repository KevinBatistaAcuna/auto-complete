import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useCallback,
  useMemo,
} from "react";
import "./AutoComplete.css";

import { Suggestion, User } from "../../interfaces/types";

const AutoComplete = () => {
  // State variables for managing user input and suggestions
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [cache, setCache] = useState<Record<string, Suggestion[]>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to highlight matching text in suggestions
  const highlightMatch = useCallback((text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} className="highlight">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  }, []);

  // Function to filter data asynchronously based on user input
  const filterData = useCallback(
    async (input: string) => {
      // Return cached suggestions if available
      if (cache[input]) {
        setSuggestions(cache[input]);
        setIsOpen(true);
        return;
      }

      setIsLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data: User[] = await response.json();
      const filtered = data
        .filter((user) => user.name.toLowerCase().includes(input.toLowerCase()))
        .map((user) => ({
          text: user.name,
          highlightedText: highlightMatch(user.name, input),
        }));

      // Cache the filtered suggestions for future use
      setCache((prevCache) => ({ ...prevCache, [input]: filtered }));
      setSuggestions(filtered);
      setIsOpen(true);
      setIsLoading(false);
    },
    [cache, highlightMatch]
  );

  // Handle input changes and debounce requests
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Reset suggestions if input is less than 2 characters
    if (input.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Set debounce timer for filtering data
    debounceRef.current = setTimeout(() => {
      filterData(input);
    }, 300);
  };

  // Handle selection of a suggestion
  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    setIsOpen(false);
    setSuggestions([]);
  };

  // Memoize suggestions for performance optimization
  const memoizedSuggestions = useMemo(() => {
    return suggestions;
  }, [suggestions]);

  // Handle clicks outside the component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="auto-complete-container" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="auto-complete-input"
      />
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {isOpen && memoizedSuggestions.length > 0 && (
        <ul className="suggestions-container">
          {memoizedSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion.text)}
            >
              {suggestion.highlightedText}
            </li>
          ))}
        </ul>
      )}
      {isOpen && memoizedSuggestions.length === 0 && !isLoading && (
        <div className="no-results">No results found.</div>
      )}
    </div>
  );
};

export default AutoComplete;
