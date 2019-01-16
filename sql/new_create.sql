




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
                ilosc NUMERIC(7,2) NOT NULL,
                id_miary SMALLINT NOT NULL,
                CONSTRAINT barek_pk PRIMARY KEY (id_uzytkownika, id_skladnika)
);


CREATE TABLE koktajl_bar.Oceny (
                id_koktajlu INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                ocena NUMERIC(1) NOT NULL,
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

ALTER TABLE koktajl_bar.Koktajle_uzytkownicy ADD CONSTRAINT koktajle_koktajle_uzytkownicy_fk
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

ALTER TABLE koktajl_bar.Skladniki_uzytkownicy ADD CONSTRAINT skladniki_skladniki_uzytkownicy_fk
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