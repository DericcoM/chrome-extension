import React, { useState, useEffect } from "react";
import CalendarComponent from "../Calendar/CalendarComponent";
import DataAll from "../Calendar/DataAll";
import axios from "axios";
import "./home.css";
import EnglishWordsApp from "../test/EnglishWordApp";

const api = axios.create({
  baseURL: "http://localhost:4200/api",
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function Home({ onLogout }) {
  const [showCalendar, setShowCalendar] = useState(true);
  const [content, setContent] = useState({});
  const [newWord, setNewWord] = useState(false);
  const [word, setWord] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [wordAdded, setWordAdded] = useState(false);
  const [isValid, setIsValidWord] = useState();
  const [showEnglishWordsApp, setShowEnglishWordsApp] = useState(false);

  const handleShowCalendar = () => {
    setShowCalendar(true);
  };

  const handleShowAll = () => {
    setShowCalendar(false);
  };

  const accessToken = localStorage.getItem("accessToken");

  const fetchContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4200/api/users/profile`,
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

  const userId = content.id;
  localStorage.setItem("userId", userId)

  useEffect(() => {
    fetchContent();
  }, [userId]);

  const handleShowForm = () => {
    if (newWord === false) {
      setNewWord(true);
    } else {
      setNewWord(false);
    }
  };

  const handleSubmitWord = async (event) => {
    event.preventDefault();
    const isValid = await isValidWord(word);
    setIsValidWord(isValid);
    if (isValid) {
      await onSubmitWord(word.toString(), userId);
    } else {
      alert("Такого слова не существует или введены несколько слов");
    }
  };

  const isValidWord = (word) => {
    const regex = /^[a-zA-Z]+([\s-][a-zA-Z]+)*$/;
    if (!regex.test(word)) {
      alert("Введенное слово или словосочетание должно быть на английском");
    }

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`;
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          return false;
        } else {
          alert("Слово успешно добавлено");
        }
        return response.json().then((data) => {
          return !!data[0].meanings[0]?.definitions[0]?.definition;
        });
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  const onSubmitWord = async (word, userId) => {
    try {
      const response = await api.post("/entry/add", { content: word, userId });
      setNewWord(false);
      setWordAdded(!wordAdded);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowEnglishWordsApp = () => {
    setShowEnglishWordsApp(true);
  };

  const handleGoBack = () => {
    setShowEnglishWordsApp(false);
  };

  return (
    <div>
      <h1 className="title">Welcome to Diary</h1>
      <div className="user">
        <button className="logout" onClick={onLogout}>
          Logout
        </button>
      </div>
      <button className="button add" onClick={handleShowForm}>
        Добавить новое слово
      </button>
      {newWord && (
        <form className="addWord" onSubmit={handleSubmitWord}>
          <h3 style={{ fontSize: "16px" }}>
            Какое слово вы хотите добавить сегодня?
          </h3>
          <input
            className="input"
            type="text"
            id="word"
            placeholder="Введите слово"
            onChange={(event) => setWord(event.target.value)}
          />
          <button
            style={{ marginBottom: "5px" }}
            className="button"
            type="submit"
          >
            Добавить
          </button>
        </form>
      )}
      {showEnglishWordsApp ? (
        <div>
          <EnglishWordsApp />
          <button className="button" onClick={handleGoBack}>
            Вернуться назад
          </button>
        </div>
      ) : (
        <>
          <button className="button" onClick={handleShowEnglishWordsApp}>
            Пройти тест
          </button>
          {showCalendar ? (
            <>
              <button className="button" onClick={handleShowAll}>
                Показать всё
              </button>
              <CalendarComponent wordAdded={wordAdded} />
            </>
          ) : (
            <>
              <button className="button" onClick={handleShowCalendar}>
                Показать календарь
              </button>
              <DataAll wordAdded={wordAdded} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
