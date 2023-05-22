import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

function CalendarComponent({ wordAdded }) {
  const [date, setDate] = useState(new Date());
  const [content, setContent] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const formattedDate = date
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");

  const fetchContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4200/api/entry/date-entries?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setContent(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [formattedDate, wordAdded]);

  const onChange = (date) => {
    setDate(date);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const getUniqueEntriesWithCount = () => {
    const entryCountMap = new Map();

    content.forEach((item) => {
      const entry = `${item.content} - ${item.russianContent}`;
      if (entryCountMap.has(entry)) {
        entryCountMap.set(entry, entryCountMap.get(entry) + 1);
      } else {
        entryCountMap.set(entry, 1);
      }
    });

    const uniqueEntriesWithCount = [];

    entryCountMap.forEach((count, entry) => {
      if (count > 1) {
        uniqueEntriesWithCount.push({ entry, count });
      } else {
        uniqueEntriesWithCount.push({ entry, count: null });
      }
    });

    return uniqueEntriesWithCount;
  };

  const tileDisabled = ({ date, view }) => {
    // Disable dates that have not yet occurred
    const today = new Date();
    return view === "month" && date > today;
  };

  return (
    <div className="calendarComponent">
      <div className="checkBox">
        <div className="checkMenu">
          <label>
            <input
              type="checkbox"
              checked={showCalendar}
              onChange={toggleCalendar}
            />
            Show Calendar
          </label>
        </div>
      </div>

      {showCalendar && (
        <div>
        <Calendar
          onChange={onChange}
          value={date}
          locale="en-GB"
          tileDisabled={tileDisabled} // Set the tileDisabled property
        />
      </div>
      )}
      <p>Дата: {formattedDate}</p>
      {content.length > 0 ? (
        <div>
          <h2>Содержимое:</h2>
          <div className="dictionary">
            {getUniqueEntriesWithCount().map((entryObj, index) => {
              const { entry, count } = entryObj;
              const [word, translation] = entry.split(" - ");
              return (
                <p key={index}>
                  <span className="enWord">{word}</span> -{" "}
                  <span className="ruWord">{translation}</span>
                  {count && <span className="count"> ({count})</span>}
                </p>
              );
            })}
          </div>
        </div>
      ) : (
        <h3>В этот день ничего не добавлено</h3>
      )}
    </div>
  );
}

export default CalendarComponent;
