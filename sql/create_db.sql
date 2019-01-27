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
    SELECT k_s.id_koktajlu AS id, k.nazwa AS name, s.nazwa AS ingredient, k_s.ilosc::numeric as amount, m.nazwa AS measure, k.tresc_instrukcji AS recipe FROM koktajl_bar.koktajle_skladniki k_s
        INNER JOIN koktajl_bar.koktajle k USING(id_koktajlu)
        INNER JOIN koktajl_bar.skladniki s USING(id_skladnika)
        INNER JOIN koktajl_bar.miary m USING(id_miary);

CREATE VIEW koktajl_bar.przepisy_po_ilosci_skladnikow AS
    SELECT k.id_koktajlu AS id, k.nazwa AS name, COUNT(*) AS ingredients_number FROM koktajl_bar.koktajle_skladniki k_s
        INNER JOIN koktajl_bar.koktajle k USING(id_koktajlu)
        GROUP BY (k.id_koktajlu, k.nazwa)
        ORDER BY ingredients_number DESC, k.nazwa ASC;

CREATE VIEW koktajl_bar.nazwy_po_ocenach as
    select id_koktajlu AS id , nazwa AS name, CAST(AVG(ocena) + 1 AS NUMERIC(4,2)) as avg_mark from koktajl_bar.oceny
    INNER JOIN koktajl_bar.koktajle k USING(id_koktajlu)
    GROUP BY (id_koktajlu, nazwa)
    ORDER BY AVG(ocena) DESC;

--- Losowy koktaj

CREATE OR REPLACE FUNCTION koktajl_bar.losowy_koktajl() RETURNS TABLE (
 id INTEGER,
 name VARCHAR(120),
 ingredient VARCHAR(100),
 amount NUMERIC(6,2),
 measure VARCHAR(20),
 recipe VARCHAR(1500)
) AS $$
DECLARE
    high integer;
    random_id integer;
BEGIN
    SELECT count(*)::integer INTO high FROM koktajl_bar.koktajle;
    random_id := floor(random() * high) + 1;
    RETURN QUERY SELECT * FROM koktajl_bar.przepisy p WHERE p.id = random_id;
END; $$
language PLPGSQL;

--- Usun koktajl

CREATE OR REPLACE FUNCTION koktajl_bar.usun_koktajl_uzytkownika(id_do_usuniecia INTEGER) RETURNS BOOLEAN AS $$
DECLARE
    flag BOOLEAN;
begin
    DELETE FROM koktajl_bar.oceny WHERE id_koktajlu = id_do_usuniecia;
    WITH deleted as (
        DELETE FROM koktajl_bar.koktajle WHERE id_koktajlu = id_do_usuniecia RETURNING *
       ) SELECT COUNT(*) > 0 FROM deleted into flag;
    RETURN flag;
end;
$$ LANGUAGE PLPGSQL;

--- Dodaj koktajl uzytkownika

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

--- Aktualizuj koktajl

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

-- barek uzytkownika

CREATE OR REPLACE FUNCTION koktajl_bar.barek_uzytkownika(_id_uzytkownika INTEGER) RETURNS TABLE (
 id INTEGER,
 ingredient VARCHAR(100),
 amount NUMERIC(6,2),
 measure VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY SELECT s.id_skladnika, s.nazwa, b.ilosc::numeric(6,2), m.nazwa from koktajl_bar.barek b
        JOIN koktajl_bar.skladniki s USING (id_skladnika)
        JOIN koktajl_bar.miary m USING (id_miary)
        WHERE b.id_uzytkownika = _id_uzytkownika
        ORDER BY s.nazwa;
END;
$$ LANGUAGE PLPGSQL;

--- Dodaj do barku

CREATE OR REPLACE FUNCTION koktajl_bar.dodaj_do_barku(_id_uzytkownika INTEGER, _skladnik VARCHAR(100), _ilosc koktajl_bar.ilosc, _miara VARCHAR(20))
RETURNS TABLE (
 id INTEGER,
 ingredient VARCHAR(100),
 amount NUMERIC(6,2),
 measure VARCHAR(20)
) AS $$
DECLARE
    _id_skladnika INTEGER;
    _id_miary SMALLINT;
BEGIN

    IF char_length(_skladnik) = 0 THEN
        RAISE EXCEPTION 'Provided ingredient name is empty'
            USING HINT = 'Provided ingredient name is empty.';
    END IF;

    IF _ilosc = 0 THEN
        RAISE EXCEPTION 'Provided ingredient amount is equal to 0'
            USING HINT = 'Provided ingredient amount is equal to 0.';
    END IF;

    IF NOT EXISTS (SELECT * FROM koktajl_bar.uzytkownik u WHERE u.id_uzytkownika = _id_uzytkownika) THEN
        RAISE EXCEPTION 'User with provided id does not exist'
            USING HINT = 'User with provided id does not exist.';
    END IF;

    select id_skladnika from koktajl_bar.skladniki where nazwa = _skladnik INTO _id_skladnika;
    select id_miary from koktajl_bar.miary where nazwa = _miara INTO _id_miary;

    INSERT INTO koktajl_bar.barek VALUES (_id_uzytkownika, _id_skladnika, _ilosc, _id_miary);

    RETURN QUERY SELECT *
        FROM koktajl_bar.barek_uzytkownika(_id_uzytkownika);
END;
$$ LANGUAGE PLPGSQL;

-- Usun z barku

CREATE OR REPLACE FUNCTION koktajl_bar.usun_z_barku(_id_uzytkownika INTEGER, _id_skladnika INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    flag BOOLEAN;
BEGIN

    IF NOT EXISTS (select * from koktajl_bar.skladniki where id_skladnika = _id_skladnika) THEN
        RAISE EXCEPTION 'Provided ingredient name is empty'
            USING HINT = 'Provided ingredient name is empty.';
    END IF;

    IF NOT EXISTS (SELECT * FROM koktajl_bar.uzytkownik u WHERE u.id_uzytkownika = _id_uzytkownika) THEN
        RAISE EXCEPTION 'User with provided id does not exist'
            USING HINT = 'User with provided id does not exist.';
    END IF;


    WITH deleted as (
        DELETE FROM koktajl_bar.barek b
        WHERE b.id_uzytkownika = _id_uzytkownika AND b.id_skladnika = _id_skladnika
        RETURNING *
       )  SELECT COUNT(*) > 0 FROM deleted INTO flag;
    RETURN flag;
END;
$$ LANGUAGE PLPGSQL;

--- Aktualizuj barek

CREATE OR REPLACE FUNCTION koktajl_bar.aktualizuj_barek(
    _id_uzytkownika INTEGER,
    _id_skladnika INTEGER,
    _amount NUMERIC(6,2),
    _measure VARCHAR(20))
RETURNS TABLE (
 id INTEGER,
 ingredient VARCHAR(100),
 amount NUMERIC(6,2),
 measure VARCHAR(20)
) AS $$
DECLARE
    _measure_id SMALLINT;
BEGIN
    IF _amount = 0 THEN
        RAISE EXCEPTION 'Provided ingredient amount is equal to 0'
            USING HINT = 'Provided ingredient amount is equal to 0.';
    END IF;

    IF NOT EXISTS (SELECT * FROM koktajl_bar.uzytkownik u WHERE u.id_uzytkownika = _id_uzytkownika) THEN
        RAISE EXCEPTION 'User with provided id does not exist'
            USING HINT = 'User with provided id does not exist.';
    END IF;

    IF NOT EXISTS (select * from koktajl_bar.barek
               where id_skladnika = _id_skladnika and id_uzytkownika = _id_uzytkownika) THEN
        RAISE EXCEPTION 'Provided user does not have provided ingredient'
            USING HINT = 'Provided user does not have provided ingredient.';
    END IF;

    select id_miary from koktajl_bar.miary where nazwa = _measure INTO _measure_id;

    update koktajl_bar.barek set (ilosc,id_miary) = (_amount, _measure_id)
        where id_uzytkownika = _id_uzytkownika and id_skladnika = _id_skladnika;

    RETURN QUERY SELECT *
        FROM koktajl_bar.barek_uzytkownika(_id_uzytkownika);
END;
$$ LANGUAGE PLPGSQL;
