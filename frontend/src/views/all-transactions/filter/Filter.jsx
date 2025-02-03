import React, { useState } from "react";
import "./style.css"; // Import the CSS file for styling

const FilterComponent = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle checkbox selection
  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div className="filter-component">
      {/* Display selected items count */}
      <div className="selected-count">{selectedItems.length} Selected</div>

      {/* Dropdown toggle button */}
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {isOpen ? "▲" : "▼"}
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div className="dropdown-content">
          {items.map((item, index) => (
            <label key={index} className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
