CREATE DATABASE footballApp;

CREATE TABLE joueur(
    joueur_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    pays VARCHAR(255),
    club VARCHAR(255),
    poste VARCHAR(255),
    image VARCHAR(255),
)

CREATE TABLE user(
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    joueur_id FOREIGN KEY REFERENCES joueur(joueur_id),
)