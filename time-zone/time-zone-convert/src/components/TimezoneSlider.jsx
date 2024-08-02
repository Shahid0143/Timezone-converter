import React from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import moment from "moment-timezone";
import { AiOutlineClose } from "react-icons/ai";
import "./TimezoneSlider.scss";
import { RxBorderDotted } from "react-icons/rx";

const TimezoneSlider = ({ timezone, baseTime, onChange, onRemove }) => {
  const handleSliderChange = (value) => {
    // Clamp value to between 0 and 24 hours
    const clampedValue = Math.min(Math.max(value, 0), 24);

    let newTime = moment(baseTime).startOf("day").add(clampedValue, "hours");

    // Check if the slider is at the end of the day and set the time to 24:00 if needed
    if (clampedValue === 24) {
      newTime = moment(baseTime).endOf("day");
    }

    onChange(newTime);
  };

  const timeInZone = moment(baseTime).tz(timezone);

  return (
    <div className="timezone-slider">
      <div className="timezone-box">
        <RxBorderDotted />
        <RxBorderDotted />
        <RxBorderDotted />
        <br />
        <RxBorderDotted />
        <RxBorderDotted />
        <br />
        <h3>{timezone}</h3>
        <button
          className="remove-btn"
          onClick={onRemove}
          aria-label={`Remove ${timezone}`}
        >
          <AiOutlineClose />
        </button>
        <Slider
          min={0}
          max={24}
          step={0.25}
          value={baseTime.hours() + baseTime.minutes() / 60}
          onChange={handleSliderChange}
          marks={{
            0: "12am",
            3: "3am",
            6: "6am",
            9: "9am",
            12: "12pm",
            15: "3pm",
            18: "6pm",
            21: "9pm",
            24: "12am",
          }}
          style={{ width: "100%" }}
          included={false}
        />
        <p>{timeInZone.format("h:mm A, dddd, MMM D")}</p>
      </div>
    </div>
  );
};

TimezoneSlider.propTypes = {
  timezone: PropTypes.string.isRequired,
  baseTime: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default TimezoneSlider;
