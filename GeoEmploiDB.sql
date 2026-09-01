CREATE DATABASE mydb;

\c mydb;

CREATE TABLE users {
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
};
