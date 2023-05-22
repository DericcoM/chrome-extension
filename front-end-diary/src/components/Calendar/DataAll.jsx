import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DataAll({ wordAdded }) {
  const [content, setContent] = useState([]);

  const accessToken = localStorage.getItem("accessToken");

  const fetchContent = async () => {
    try {
      const response = await axios.get(`http://localhost:4200/api/entry/data`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setContent(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [wordAdded]);

  const getUniqueWordsWithCount = () => {
    const wordCountMap = new Map();

    content.forEach((item) => {
      const word = item.content;
      const translation = item.russianContent;
      if (wordCountMap.has(word)) {
        const count = wordCountMap.get(word).count;
        wordCountMap.set(word, { count: count + 1, translation });
      } else {
        wordCountMap.set(word, { count: 1, translation });
      }
    });

    const uniqueWordsWithCount = [];

    wordCountMap.forEach(({ count, translation }, word) => {
      if (count > 1) {
        uniqueWordsWithCount.push(
          <p key={word}>
            <span className="enWord">{word}</span> -{" "}
            <span className="ruWord">{translation}</span> ({count})
          </p>
        );
      } else {
        uniqueWordsWithCount.push(
          <p key={word}>
            <span className="enWord">{word}</span> -{" "}
            <span className="ruWord">{translation}</span>
          </p>
        );
      }
    });

    return uniqueWordsWithCount;
  };

  return (
    <div>
      {content.length > 0 ? (
        <div>
          <h2>Содержимое:</h2>
          <div className="dictionary">{getUniqueWordsWithCount()}</div>
        </div>
      ) : (
        <h3>У вас еще не было записей</h3>
      )}
    </div>
  );
}
