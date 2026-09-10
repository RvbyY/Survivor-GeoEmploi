CREATE DATABASE mydb;

\c mydb;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    account_type TEXT NOT NULL DEFAULT 'jobseeker',
    company_name TEXT
);

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    offer_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    address VARCHAR(255) NOT NULL,
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
    offer_id INTEGER REFERENCES offers(id),
    candidate_id INTEGER REFERENCES users(id)
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    offer_id INTEGER NOT NULL REFERENCES offers(id),
    candidate_id INTEGER NOT NULL REFERENCES users(id),
    reason VARCHAR(255) NOT NULL,
    message VARCHAR(255),
    date TIMESTAMP DEFAULT NOW()
);
