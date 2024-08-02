import React, { useState, useRef, useEffect } from "react";
import { ImPlus } from "react-icons/im";
import { MdOutlineDateRange } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { IoSwapVerticalSharp } from "react-icons/io5";
import { CiLink, CiSun } from "react-icons/ci";
import { LuSunMoon } from "react-icons/lu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.scss";
import TimezoneConverter from "./components/TimezoneConverter";
import moment from "moment-timezone";

const App = () => {
  const [newTimezone, setNewTimezone] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isValidTimezone, setIsValidTimezone] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [timezones, setTimezones] = useState(["UTC", "Asia/Kolkata"]);
  const [shareableLink, setShareableLink] = useState("");
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const inputRef = useRef(null);
  const datePickerRef = useRef(null);

  const handleAddTimezone = () => {
    if (isValidTimezone) {
      setTimezones((prev) => [...prev, inputValue]);
      setNewTimezone(inputValue);
      setInputValue("");
      setSuggestions([]);
      setIsValidTimezone(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const matches = moment.tz
        .names()
        .filter((tz) => tz.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(matches.slice(0, 10));
      setIsValidTimezone(matches.includes(value));
    } else {
      setSuggestions([]);
      setIsValidTimezone(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setIsValidTimezone(true);
  };

  const handleDateRangeClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleReverseOrder = () => {
    setReverseOrder((prev) => !prev);
  };

  const createShareableLink = () => {
    const dateStr = moment(selectedDate).format("YYYY-MM-DDTHH:mm:ss");
    const url = `${window.location.origin}?date=${encodeURIComponent(
      dateStr
    )}&timezones=${encodeURIComponent(
      JSON.stringify(timezones)
    )}&reverseOrder=${reverseOrder}`;
    setShareableLink(url);
    setShowLinkDropdown(true);
  };

  const handleRemoveLink = () => {
    setShareableLink("");
    setShowLinkDropdown(false);
  };

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <div className="input-btn-box">
        <div className="child-box">
          <div className="autocomplete flex-input">
            <input
              type="text"
              placeholder="Add Time Zone, City or Town"
              value={inputValue}
              onChange={handleInputChange}
              ref={inputRef}
            />
            <button
              title="Add City"
              onClick={handleAddTimezone}
              disabled={!isValidTimezone}
            >
              <ImPlus />
            </button>
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="child-box">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            ref={datePickerRef}
          />
          <button title="Change Date" onClick={handleDateRangeClick}>
            <MdOutlineDateRange />
          </button>
        </div>

        <div className="child-box">
          <button title="Schedule Meet">
            <SlCalender />
          </button>
          <button title="Change Order" onClick={handleReverseOrder}>
            <IoSwapVerticalSharp />
          </button>
          <button title="Create link" onClick={createShareableLink}>
            <CiLink />
          </button>
          <button title="Toggle(day/night)" onClick={toggleDarkMode}>
            {isDarkMode ? <LuSunMoon /> : <CiSun />}
          </button>
        </div>
      </div>

      <div id="root">
        <TimezoneConverter
          newTimezone={newTimezone}
          selectedDate={selectedDate}
          reverseOrder={reverseOrder}
          timezones={timezones}
        />
      </div>

      {showLinkDropdown && (
        <div className="dropdown">
          <button className="remove-link-btn" onClick={handleRemoveLink}>
            &times;
          </button>
          <div className="box-anchor">
            <a href={shareableLink} target="_blank" rel="noopener noreferrer">
              {shareableLink}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
