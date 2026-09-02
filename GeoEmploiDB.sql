CREATE DATABASE mydb;

\c mydb;

CREATE TABLE users {
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
};

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    offer_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL REFERENCES users(id),
    salary DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    date TIMESTAMP DEFAULT NOW(),
    max_distance DOUBLE PRECISION
);

CREATE TABLE candidacy (
    id SERIAL PRIMARY KEY,
    offer_id SERIAL PRIMARY KEY REFERENCES offers(id),
    candidate_id SERIAL PRIMARY KEY REFERENCES users(id)
);
