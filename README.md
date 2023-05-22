# chrome-extension
nest-react-extension

In this work, an implementation of an extension will be presented that will allow the user to enter the words that he wants to learn. The developed extension is an innovative tool for people who are looking to improve their language skills and achieve more in their careers and personal lives. It allows users to easily add new words to their vocabulary list and easily learn them in context. Thanks to automatic translation, users can quickly and accurately understand the meanings of words, which greatly speeds up the process of learning a language.

## Tech Stack

**Client:** React, Axios, React-Calendar

**REST API:** NestJS, TypeScript, Prisma, PostgreSQL, Yandex-Cloud API


## Run Locally

Clone the project

```bash
  git clone https://github.com/DericcoM/chrome-extension
```

Go to the REST API directory

```bash
  cd back-end-diary
```

Install dependencies

```bash
  npm install
```

Install tables to database

```bash
  npx prisma db push
```

Start the REST API server

```bash
  npm run start:dev
```

