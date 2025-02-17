import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import SearchIcon from "../../../icons/search";
import AnimatedWidth from "../../ui/Animated/Width";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const filters = [
  { title: "All Transactions", value: "all" },
  { title: "Device Zero-Knowledge Proofs", value: "zkp" },
  { title: "Devices", value: "device" },
  { title: "Services", value: "service" },
  { title: "Device Commitments", value: "commitment" },
  { title: "Fund Transfer", value: "transaction" },
];


export default function SearchBar({ initialValue = "" }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [selectedFilter, setSelectedFilter] = useState(filters[0].value);
  const inputRef = useRef(null);
  const navigateTo = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchFilterString = params.get("filter");

  useEffect(() => {
    filters.forEach((item) => {
      if (item.value == searchFilterString) {
        setSelectedFilter(item.value);
      }
    });
  }, [searchFilterString]);

  async function handleSearch(string) {
    navigateTo(
      `/search?text=${encodeURIComponent(
        string
      )}&page=1&filter=${selectedFilter}`
    );
    /* if (String(string).trim().length === 0) {
      return false;
    } else {
      navigateTo(
        `/search?text=${encodeURIComponent(
          string
        )}&page=1&filter=${selectedFilter}`
      );
    } */
  }

  // Handler for dropdown filter change
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <AnimatedWidth duration={1} className="custom-input">
      {/* Dropdown for filters */}
      <FormControl className="custom-drop-down" variant="outlined">
        <Select
          size="small"
          labelId="filter-dropdown-label"
          id="filter-dropdown"
          value={selectedFilter}
          onChange={handleFilterChange}
          hiddenLabel={true}
        >
          {filters.map((item) => (
            <MenuItem value={item.value}>{item.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Search input */}
      <input
        ref={inputRef}
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch(inputValue);
          }
        }}
        placeholder="Search by IoT Server Id / Service Contract Name / Service Contract Id / Device Name / Device Id"
      />

      {/* Search button */}
      <Button
        onClick={() => handleSearch(inputValue)}
        className="icon-holder"
        variant="contained"
      >
        <SearchIcon className="icon" />
      </Button>
    </AnimatedWidth>
  );
}
