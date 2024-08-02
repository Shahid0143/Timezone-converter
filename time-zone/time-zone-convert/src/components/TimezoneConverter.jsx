import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TimezoneSlider from "./TimezoneSlider";
import moment from "moment-timezone";
import "./TimezoneConverter.scss";

const TimezoneConverter = ({ newTimezone, selectedDate, reverseOrder }) => {
  const [timezones, setTimezones] = useState(["UTC", "Asia/Kolkata"]);
  const [baseTime, setBaseTime] = useState(moment.utc(selectedDate));
  const [draggingIndex, setDraggingIndex] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const dateParam = query.get("date");
    const timezonesParam = query.get("timezones");
    const reverseOrderParam = query.get("reverseOrder");

    if (dateParam) {
      setBaseTime(moment(dateParam));
    }

    if (timezonesParam) {
      setTimezones(JSON.parse(timezonesParam));
    }

    if (reverseOrderParam) {
      reverseOrder = reverseOrderParam === "true";
    }
  }, []);

  useEffect(() => {
    setBaseTime(moment.utc(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    if (newTimezone && !timezones.includes(newTimezone)) {
      setTimezones((prevTimezones) => [...prevTimezones, newTimezone]);
    }
  }, [newTimezone]);

  const displayedTimezones = reverseOrder
    ? [...timezones].reverse()
    : timezones;

  const handleBaseTimeChange = (newTime) => {
    setBaseTime(newTime);
  };

  const handleRemoveTimezone = (timezone) => {
    setTimezones((prevTimezones) =>
      prevTimezones.filter((tz) => tz !== timezone)
    );
  };

  const handleDragStart = (e, index) => {
    setDraggingIndex(index);
    e.dataTransfer.setData("text/plain", index);
    e.currentTarget.classList.add("dragging");
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const fromIndex = e.dataTransfer.getData("text/plain");
    const toIndex = index;

    if (fromIndex !== toIndex) {
      const updatedTimezones = [...timezones];
      const [movedTimezone] = updatedTimezones.splice(fromIndex, 1);
      updatedTimezones.splice(toIndex, 0, movedTimezone);
      setTimezones(updatedTimezones);
    }

    setDraggingIndex(null);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div id="sliders-root">
      {displayedTimezones.map((timezone, index) => (
        <div
          key={timezone}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          className={`draggable-item ${
            draggingIndex === index ? "dragging" : ""
          }`}
        >
          <TimezoneSlider
            timezone={timezone}
            baseTime={baseTime}
            onChange={handleBaseTimeChange}
            onRemove={() => handleRemoveTimezone(timezone)}
          />
        </div>
      ))}
    </div>
  );
};

TimezoneConverter.propTypes = {
  newTimezone: PropTypes.string,
  selectedDate: PropTypes.string.isRequired,
  reverseOrder: PropTypes.bool,
};

export default TimezoneConverter;
