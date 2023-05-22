import React, { useState, useEffect } from "react";
import axios from "axios";
import './test.css';

const api = axios.create({
  baseURL: "http://localhost:4200/api",
});

function EnglishWordsApp() {
  const [words, setWords] = useState([]);
  const [translations, setTranslations] = useState({});
  const [isCorrect, setIsCorrect] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get(`http://localhost:4200/api/entry/data`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Remove duplicate words from the response
      const uniqueWords = removeDuplicates(response.data);
  
      // Shuffle the unique words
      const shuffledWords = shuffle(uniqueWords);
  
      setWords(shuffledWords);
      initializeTranslations(shuffledWords);
    } catch (error) {
      console.error(error);
    }
  };

  const removeDuplicates = (array) => {
    const uniqueWords = [];
    const seenWords = new Set();
  
    for (let i = 0; i < array.length; i++) {
      const word = array[i];
      if (!seenWords.has(word.content)) {
        uniqueWords.push(word);
        seenWords.add(word.content);
      }
    }
  
    return uniqueWords;
  };
  

  const initializeTranslations = (data) => {
    const initialTranslations = {};
    const initialIsCorrect = {};
    data.forEach((word) => {
      initialTranslations[word.id] = "";
      initialIsCorrect[word.id] = null;
    });
    setTranslations(initialTranslations);
    setIsCorrect(initialIsCorrect);
  };

  const handleTranslationChange = (event, wordId) => {
    const newTranslations = { ...translations };
    newTranslations[wordId] = event.target.value;
    setTranslations(newTranslations);
  };

  const handleSubmit = (wordId) => {
    const translation = translations[wordId].toLowerCase();
    const word = words.find((word) => word.id === wordId);
  
    if (word && word.russianContent.toLowerCase() === translation) { 
      setIsCorrect((prevIsCorrect) => ({
        ...prevIsCorrect,
        [wordId]: true,
      }));
      handleNextQuestion();
    } else {
      setIsCorrect((prevIsCorrect) => ({
        ...prevIsCorrect,
        [wordId]: false,
      }));
    }
  };
  

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  return (
    <div>
      <h1>Переведите слова</h1>
      {words.length > 0 ? (
        <div>
          {currentQuestionIndex < words.length ? (
            <div key={words[currentQuestionIndex].id}>
              <h2>{words[currentQuestionIndex].content}</h2>
              <input
                type="text"
                className="myInput"
                value={translations[words[currentQuestionIndex].id]}
                onChange={(event) =>
                  handleTranslationChange(event, words[currentQuestionIndex].id)
                }
              />
              <button className="myButton" onClick={() => handleSubmit(words[currentQuestionIndex].id)}>
                Submit
              </button>
              {isCorrect[words[currentQuestionIndex].id] !== null && (
                <p>
                  {isCorrect[words[currentQuestionIndex].id] ? (
                    <span>&#10004; Correct!</span>
                  ) : (
                    <span>&#10008; Incorrect!</span>
                  )}
                </p>
              )}
            </div>
          ) : (
            <p>Test completed!</p>
          )}
        </div>
      ) : (
        <p>Loading words...</p>
      )}
    </div>
  );
}

export default EnglishWordsApp;
