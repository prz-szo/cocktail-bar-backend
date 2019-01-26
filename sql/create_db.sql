DROP SCHEMA koktajl_bar CASCADE;
CREATE SCHEMA koktajl_bar;

CREATE DOMAIN koktajl_bar.ocena AS NUMERIC(1) CONSTRAINT check_sign CHECK (VALUE >= 0);
COMMENT ON DOMAIN koktajl_bar.ocena IS 'Ocena koktajlu';

CREATE DOMAIN koktajl_bar.ilosc AS NUMERIC(6,2) CONSTRAINT check_sign CHECK (VALUE > 0);
COMMENT ON DOMAIN koktajl_bar.ilosc IS 'Ilość składnika';

CREATE DOMAIN koktajl_bar.email VARCHAR(100)
    CONSTRAINT valid_value CHECK (VALUE ~ '^[a-zA-Z0-9.!#$%&''*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$')
;


CREATE SEQUENCE koktajl_bar.miary_id_miary_seq;
CREATE TABLE koktajl_bar.Miary (
                id_miary SMALLINT NOT NULL DEFAULT nextval('koktajl_bar.miary_id_miary_seq'),
                nazwa VARCHAR(20) NOT NULL UNIQUE,
                CONSTRAINT miary_pk PRIMARY KEY (id_miary),
                CONSTRAINT nazwa_miary CHECK (char_length(nazwa) >= 1)
);
ALTER SEQUENCE koktajl_bar.miary_id_miary_seq OWNED BY koktajl_bar.Miary.id_miary;


CREATE SEQUENCE koktajl_bar.koktajle_id_koktajlu_seq;
CREATE TABLE koktajl_bar.Koktajle (
                id_koktajlu INTEGER NOT NULL DEFAULT nextval('koktajl_bar.koktajle_id_koktajlu_seq'),
                nazwa VARCHAR(120) NOT NULL UNIQUE,
                tresc_instrukcji VARCHAR(1500) NOT NULL,
                CONSTRAINT koktajle_pk PRIMARY KEY (id_koktajlu)
);
ALTER SEQUENCE koktajl_bar.koktajle_id_koktajlu_seq OWNED BY koktajl_bar.Koktajle.id_koktajlu;


CREATE SEQUENCE koktajl_bar.skladniki_id_skladnika_seq;
CREATE TABLE koktajl_bar.Skladniki (
                id_skladnika INTEGER NOT NULL DEFAULT nextval('koktajl_bar.skladniki_id_skladnika_seq'),
                nazwa VARCHAR(100) NOT NULL UNIQUE,
                CONSTRAINT skladniki_pk PRIMARY KEY (id_skladnika),
                CONSTRAINT nazwa_skladniku CHECK (char_length(nazwa) > 2)
);
ALTER SEQUENCE koktajl_bar.skladniki_id_skladnika_seq OWNED BY koktajl_bar.Skladniki.id_skladnika;


CREATE TABLE koktajl_bar.Koktajle_Skladniki (
                id_koktajlu INTEGER NOT NULL,
                id_skladnika INTEGER NOT NULL,
                ilosc koktajl_bar.ilosc NOT NULL,
                id_miary SMALLINT NOT NULL,
                CONSTRAINT koktajle_skladniki_pk PRIMARY KEY (id_skladnika, id_koktajlu)
);


CREATE SEQUENCE koktajl_bar.uzytkownik_id_uzytkownika_seq;
CREATE TABLE koktajl_bar.Uzytkownik (
                id_uzytkownika INTEGER NOT NULL DEFAULT nextval('koktajl_bar.uzytkownik_id_uzytkownika_seq'),
                email koktajl_bar.email NOT NULL UNIQUE,
                haslo VARCHAR NOT NULL,
                CONSTRAINT uzytkownik_pk PRIMARY KEY (id_uzytkownika)
);
ALTER SEQUENCE koktajl_bar.uzytkownik_id_uzytkownika_seq OWNED BY koktajl_bar.Uzytkownik.id_uzytkownika;

CREATE TABLE koktajl_bar.Skladniki_uzytkownicy (
                id_skladnika INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                CONSTRAINT skladniki_uzytkownicy_pk PRIMARY KEY (id_skladnika, id_uzytkownika)
);


CREATE TABLE koktajl_bar.Koktajle_uzytkownicy (
                id_koktajlu INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                CONSTRAINT koktajle_uzytkownicy_pk PRIMARY KEY (id_koktajlu, id_uzytkownika)
);

CREATE TABLE koktajl_bar.Barek (
                id_uzytkownika INTEGER NOT NULL,
                id_skladnika INTEGER NOT NULL,
                ilosc koktajl_bar.ilosc NOT NULL,
                id_miary SMALLINT NOT NULL,
                CONSTRAINT barek_pk PRIMARY KEY (id_uzytkownika, id_skladnika)
);


CREATE TABLE koktajl_bar.Oceny (
                id_koktajlu INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                ocena koktajl_bar.ocena NOT NULL,
                CONSTRAINT oceny_pk PRIMARY KEY (id_koktajlu, id_uzytkownika)
);


ALTER TABLE koktajl_bar.Barek ADD CONSTRAINT miary_barek_fk
FOREIGN KEY (id_miary)
REFERENCES koktajl_bar.Miary (id_miary)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Koktajle_Skladniki ADD CONSTRAINT miary_koktajle_produkty_fk
FOREIGN KEY (id_miary)
REFERENCES koktajl_bar.Miary (id_miary)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Koktajle_Skladniki ADD CONSTRAINT koktajle_koktajle_produkty_fk
FOREIGN KEY (id_koktajlu)
REFERENCES koktajl_bar.Koktajle (id_koktajlu)
ON DELETE CASCADE
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Oceny ADD CONSTRAINT koktajle_oceny_fk
FOREIGN KEY (id_koktajlu)
REFERENCES koktajl_bar.Koktajle (id_koktajlu)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Koktajle_Skladniki ADD CONSTRAINT produkty_koktajle_produkty_fk
FOREIGN KEY (id_skladnika)
REFERENCES koktajl_bar.Skladniki (id_skladnika)
ON DELETE CASCADE
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Barek ADD CONSTRAINT produkty_barek_fk
FOREIGN KEY (id_skladnika)
REFERENCES koktajl_bar.Skladniki (id_skladnika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Oceny ADD CONSTRAINT user_oceny_fk
FOREIGN KEY (id_uzytkownika)
REFERENCES koktajl_bar.Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Barek ADD CONSTRAINT uzytkownik_barek_fk
FOREIGN KEY (id_uzytkownika)
REFERENCES koktajl_bar.Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Koktajle_uzytkownicy ADD CONSTRAINT uzytkownik_koktajle_uzytkownicy_fk
FOREIGN KEY (id_uzytkownika)
REFERENCES koktajl_bar.Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE koktajl_bar.Skladniki_uzytkownicy ADD CONSTRAINT uzytkownik_skladniki_uzytkownicy_fk
FOREIGN KEY (id_uzytkownika)
REFERENCES koktajl_bar.Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

CREATE VIEW koktajl_bar.Przepisy AS
    SELECT k_s.id_koktajlu, k.nazwa AS koktajl, s.nazwa AS skladnik, k_s.ilosc, m.nazwa AS miara, k.tresc_instrukcji FROM koktajl_bar.koktajle_skladniki k_s
        INNER JOIN koktajl_bar.koktajle k USING(id_koktajlu)
        INNER JOIN koktajl_bar.skladniki s USING(id_skladnika)
        INNER JOIN koktajl_bar.miary m USING(id_miary);

CREATE VIEW koktajl_bar.przepisy_po_ilosci_skladnikow AS
    SELECT k.id_koktajlu, k.nazwa AS koktajl, COUNT(*) AS ilosc_skladnikow FROM koktajl_bar.koktajle_skladniki k_s
        INNER JOIN koktajl_bar.koktajle k USING(id_koktajlu)
        GROUP BY (k.id_koktajlu, k.nazwa)
        ORDER BY ilosc_skladnikow DESC, k.nazwa ASC;

CREATE VIEW koktajl_bar.nazwy_po_ocenach as
    select id_koktajlu, nazwa, AVG(ocena) as srednia_ocen from koktajl_bar.oceny
    INNER JOIN koktajl_bar.koktajle k USING(id_koktajlu)
    GROUP BY (id_koktajlu, nazwa)
    ORDER BY AVG(ocena) DESC;


CREATE OR REPLACE FUNCTION koktajl_bar.losowy_koktajl() RETURNS TABLE (
 id INTEGER,
 koktajl VARCHAR(120),
 skladnik VARCHAR(100),
 ilosc koktajl_bar.ilosc,
 miara VARCHAR(20),
 instrukcja VARCHAR(1500)
) AS $$
DECLARE
    high integer;
    random_id integer;
BEGIN
    SELECT count(*)::integer INTO high FROM koktajl_bar.koktajle;
    random_id := floor(random() * high) + 1;
    RETURN QUERY SELECT * FROM koktajl_bar.przepisy WHERE id_koktajlu = random_id;
END; $$
language PLPGSQL;


CREATE OR REPLACE FUNCTION koktajl_bar.usun_koktajl_uzytkownika(id_do_usuniecia INTEGER) RETURNS BIGINT AS $$
    DELETE FROM koktajl_bar.oceny WHERE id_koktajlu = id_do_usuniecia;
    WITH deleted as (
        DELETE FROM koktajl_bar.koktajle WHERE id_koktajlu = id_do_usuniecia RETURNING *
       ) SELECT COUNT(*) FROM deleted;
$$ LANGUAGE SQL;


CREATE OR REPLACE FUNCTION koktajl_bar.dodaj_koktajl_uzytkownika(
    id_usera INTEGER,
    _nazwa VARCHAR(120),
    _tresc_instrukcji VARCHAR(1500),
    _skladniki JSON
    ) RETURNS INTEGER AS $$
DECLARE
    _id_koktajlu INTEGER;

    _id_skladnika INTEGER;
    _id_miary SMALLINT;

    skladnik record;
BEGIN
    IF EXISTS (SELECT * FROM koktajl_bar.koktajle k WHERE k.nazwa = _nazwa) THEN
        RAISE EXCEPTION 'There is already existing cocktail with the provided name'
            USING HINT = 'Please provide another name';
    END IF;

    IF json_array_length(_skladniki) = 0 THEN
        RAISE EXCEPTION 'There is no ingredients in the providing recipe'
            USING HINT = 'There is no ingredients in the providing recipe. Please provide at least one ingredient.';
    END IF;


    INSERT INTO koktajl_bar.koktajle(nazwa, tresc_instrukcji) VALUES(_nazwa, _tresc_instrukcji) RETURNING id_koktajlu INTO _id_koktajlu;
    INSERT INTO koktajl_bar.koktajle_uzytkownicy VALUES(_id_koktajlu, id_usera);

    FOR skladnik IN (SELECT * FROM json_to_recordset(_skladniki) AS skladnik(name VARCHAR(100), amount NUMERIC(6,2), measure VARCHAR(20)))
    LOOP
        select id_skladnika from koktajl_bar.skladniki where nazwa = skladnik.name INTO _id_skladnika;
        select id_miary from koktajl_bar.miary where nazwa = skladnik.measure INTO _id_miary;

        INSERT INTO koktajl_bar.koktajle_skladniki VALUES(_id_koktajlu, _id_skladnika, skladnik.amount, _id_miary);
    END LOOP;

    RETURN _id_koktajlu;
END; $$
language PLPGSQL;


CREATE OR REPLACE FUNCTION koktajl_bar.aktualizuj_koktajl(
    _id_koktajlu INTEGER,
    _nazwa VARCHAR(120),
    _tresc_instrukcji VARCHAR(1500),
    _skladniki JSON
    ) RETURNS INTEGER AS $$
DECLARE
    _id_skladnika INTEGER;
    _id_miary SMALLINT;

    skladnik record;
BEGIN
    IF char_length(_nazwa) = 0 THEN
        RAISE EXCEPTION 'Provided name is empty'
            USING HINT = 'Provided name is empty.';
    END IF;

    IF char_length(_tresc_instrukcji) = 0 THEN
        RAISE EXCEPTION 'Provided recipe is empty'
            USING HINT = 'Provided recipe is empty.';
    END IF;

    IF json_array_length(_skladniki) = 0 THEN
        RAISE EXCEPTION 'There is no ingredients in the providing recipe'
            USING HINT = 'There is no ingredients in the providing recipe. Please provide at least one ingredient.';
    END IF;

    IF NOT EXISTS (SELECT * FROM koktajl_bar.koktajle k WHERE k.id_koktajlu = _id_koktajlu) THEN
        RAISE EXCEPTION 'Cocktail with provided id does not exist'
            USING HINT = 'Cocktail with provided id does not exist.';
    END IF;

    IF EXISTS (SELECT * FROM koktajl_bar.koktajle k WHERE k.nazwa = _nazwa AND k.id_koktajlu != _id_koktajlu) THEN
        RAISE EXCEPTION 'There is already existing cocktail with the provided name'
            USING HINT = 'Please provide another name';
    END IF;

    IF (SELECT nazwa FROM koktajl_bar.koktajle k WHERE k.id_koktajlu = _id_koktajlu) != _nazwa THEN
        UPDATE koktajl_bar.koktajle k
            SET (nazwa, tresc_instrukcji) = (_nazwa, _tresc_instrukcji)
            WHERE k.id_koktajlu = _id_koktajlu;
    END IF;

    DELETE FROM koktajl_bar.koktajle_skladniki WHERE id_koktajlu = _id_koktajlu;

    FOR skladnik IN (SELECT * FROM json_to_recordset(_skladniki) AS skladnik(name VARCHAR(100), amount NUMERIC(6,2), measure VARCHAR(20)))
    LOOP
        select id_skladnika from koktajl_bar.skladniki where nazwa = skladnik.name INTO _id_skladnika;
        select id_miary from koktajl_bar.miary where nazwa = skladnik.measure INTO _id_miary;

        INSERT INTO koktajl_bar.koktajle_skladniki VALUES(_id_koktajlu, _id_skladnika, skladnik.amount, _id_miary);
    END LOOP;

    RETURN _id_koktajlu;
END; $$
language PLPGSQL;
