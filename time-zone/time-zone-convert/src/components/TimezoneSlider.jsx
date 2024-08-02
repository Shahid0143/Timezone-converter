import React from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import moment from "moment-timezone";
import { AiOutlineClose } from "react-icons/ai";
import "./TimezoneSlider.scss";

const TimezoneSlider = ({ timezone, baseTime, onChange, onRemove }) => {
  const handleSliderChange = (value) => {
    const newTime = moment(baseTime).startOf("day").add(value, "hours");
    onChange(newTime);
  };

  const timeInZone = moment(baseTime).tz(timezone);

  return (
    <div className="timezone-slider">
      <div className="timezone-box">
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
