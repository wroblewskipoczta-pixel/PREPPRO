# Filmy instruktażowe PREP PRO

Gotowy komplet **20 z 20 filmów**. Etap 1: 5 filmów; Etapy 2–4: po 4 filmy; Etap 5: 3 filmy.

Aktualny pakiet: `PREPPRO-komplet-20-filmow-v2.zip`. Otwórz `index.html`, aby
korzystać z aplikacji, albo `podglad-filmow.html`, aby przejrzeć filmy etapami.
Adres aplikacji: https://wroblewskipoczta-pixel.github.io/PREPPRO/
GitHub Pages publikuje zawartość głównej gałęzi `main`.
Testy logiki i plików mediów zakończyły się poprawnie. Pozostaje sprawdzenie
na fizycznych telefonach (Safari/iPhone i Chrome/Android). Próba automatycznego
podglądu przeglądarkowego była zablokowana przez niedostępną weryfikację polityki.
Poniższe sekcje opisują też wcześniejsze, lokalne etapy przygotowania.

Pierwszy pokaz: **Marsz z pracą ramion lub trucht w miejscu**.

- Źródło: `IMG_6360.MOV`, 7,3 s, pionowe 1080 × 1920, HEVC/HDR.
- Wybrany odcinek: klatki 90–175, od 3,000 do 5,867 s (koniec wyłączny).
- Wynik: 86 klatek, około 2,87 s, naturalne tempo 30 kl./s.
- MP4: H.264, 720 × 1280, yuv420p, BT.709/SDR, bez audio, faststart.
- Zachowana cała sylwetka, bez zmiany proporcji i bez odtwarzania od tyłu.
- Osobna miniatura (w wersji v2: 720 × 1280). Oryginału nie umieszczamy w repozytorium.

## Zachowanie

Miniatura jest widoczna przy wejściu w ćwiczenie. Przycisk „Odtwórz pokaz”
pozwala obejrzeć ruch przed startem. Start timera uruchamia film w pętli,
pauza go zatrzymuje, wznowienie kontynuuje, reset i koniec czasu zatrzymują
i przewijają do początku. Zmiana ćwiczenia zatrzymuje poprzedni film.
Odtwarzanie jest wyciszone i pozostaje wewnątrz strony (`playsinline`).

Błąd filmu lub blokada odtwarzania nie zatrzymuje timera. Zawodnik może
korzystać z opisu i ponowić odtwarzanie. Ćwiczenia bez przypisanego filmu
zachowują tekst i timer, bez pustej ramki odtwarzacza.

Bieżący film ma `preload="metadata"`. Następny film, jeśli istnieje, jest
przygotowywany po starcie timera; pomijamy to przy zgłoszonym oszczędzaniu
danych lub połączeniu 2G. Tryb offline nie jest częścią tego wdrożenia.

## Dodawanie lub wymiana filmów

1. Przypisz plik do dokładnej nazwy ćwiczenia z aplikacji.
2. Wybierz pełne cykle ruchu i możliwie podobne fazy na łączeniu pętli.
3. Zapisz plik w `assets/videos/`, miniaturę w `assets/posters/`.
4. Dodaj wpis `src` i `poster` do `exerciseVideos` w `index.html`.
5. Dopisz klucz wpisu jako piąte pole danego ćwiczenia.
6. Przy wymianie pliku zwiększ wersję w jego nazwie, np. `-v2`.

Pliki są pod ścieżkami względnymi, więc działają w GitHub Pages pod `/PREPPRO/`.
Publikacja wymaga dostarczenia `index.html` i katalogu `assets` razem.

## Sprawdzenie

Testy logiki: `node --test tests/video-timer.test.cjs`.
Testy korzystają z symulowanego DOM i odtwarzacza, nie z prawdziwej przeglądarki.

Przed publikacją należy sprawdzić na iPhonie/Safari i Androidzie/Chrome:
czytelność sylwetki i timera obok siebie, płynność łączenia pętli,
start/pauzę/reset, powrót do ćwiczenia, brak filmu, wolne połączenie,
blokadę odtwarzania oraz zachowanie po przejściu aplikacji w tło.
Podgląd przeglądarkowy w środowisku przygotowania był zablokowany przez
niedostępną weryfikację polityki bezpieczeństwa; testów na telefonach nie wykonano.

## Kolejna partia — pierwszy etap kompletny

| Źródło | Ćwiczenie | Zakres klatek (koniec wyłączny) | Długość |
|---|---|---|---|
| IMG_6366.MOV | Mobilizacja stawu skokowego w wykroku | 49–192 | 4,77 s |
| IMG_6369.MOV | Wykrok z rotacją tułowia | 47–258 | 7,03 s |
| IMG_6372.MOV | Mobilizacja bioder 90/90 | 0–174 | 5,80 s |
| IMG_6373.MOV | Wspięcia na palce | 42–140 | 3,27 s |

Wariant bez ściany w IMG_6366 został potwierdzony przez użytkownika. Zmieniono
nazwę i instrukcję drugiego ćwiczenia oraz sprzęt pierwszego etapu na „Bez sprzętu”.
Dawkowanie i kolejność pozostały bez zmian. Pozostałe opisy zachowano.

Biodra 90/90 pokazują przejście na obie strony i powrót do ustawienia środkowego.
Wykrok zachowuje wejście, rotację i wyjście; na łączeniu pętli może być widoczna
niewielka zmiana ustawienia stóp i tułowia obecna w oryginalnym nagraniu.
Nie użyto odtwarzania od tyłu ani zmiany tempa.

Podgląd wszystkich filmów: `podglad-filmow.html`. Pełna aplikacja: `index.html`.
Osiem testów logiki przechodzi, w tym przełączanie pięciu filmów pierwszego etapu.
Materiały przygotowano lokalnie; nie opublikowano zmian na GitHub Pages.

## Etap 2 — aktywacja pośladków i stabilizacji

Nagrania przypisano w kolejności wskazanej przez użytkownika. Nazwy, instrukcje,
dawkowanie i czasy timera pozostają bez zmian. Ostatni film pokazuje wariant dead bug.

| Źródło | Ćwiczenie | Zakres klatek (koniec wyłączny) | Długość |
|---|---|---|---|
| IMG_6375.MOV | Chód bokiem z gumą nad kolanami | 40–179 | 4,63 s |
| IMG_6377.MOV | Most biodrowy | 24–162 | 4,60 s |
| IMG_6378.MOV | Odwodzenie biodra z gumą | 25–193 | 5,60 s |
| IMG_6381.MOV | Marsz w podporze lub dead bug — wariant dead bug | 14–179 | 5,50 s |

Chód pokazuje kroki w obie strony; dead bug pracę na obie strony. Most i odwodzenie
zawierają pełne uniesienie oraz powrót. Naturalne tempo, bez odwracania ruchu.
W IMG_6378 końcówka stopy przy opuszczaniu nogi jest miejscami poza krawędzią
oryginalnego nagrania. Zachowano cały kadr; nie zastosowano dodatkowego kadrowania.

Sprawdzono klatki gotowych filmów, dekodowanie MP4, liczbę klatek, brak audio,
720 × 1280 / 30 kl./s i faststart. Dziewięć testów logiki przechodzi; nowy test
obejmuje cztery filmy Etapu 2, sterowanie timerem, wyjście do Etapu 3 i powrót.
To nie zastępuje testu przeglądarkowego i na telefonach, którego nadal nie wykonano.

Pakiet `PREPPRO-etapy-1-2-komplet.zip` zawiera wszystkie 9 filmów, aplikację,
podgląd i dokumentację. Zmiany są lokalne, bez publikacji na GitHub Pages.

## Etap 3 — przygotowanie siłowe i kontrola jednonóż

| Źródło | Ćwiczenie | Zakres klatek (koniec wyłączny) | Długość |
|---|---|---|---|
| IMG_6384.MOV | Przysiad z masą ciała | 23–96 | 2,43 s |
| IMG_6386.MOV | RDL na jednej nodze bez obciążenia | 41–169 | 4,27 s |
| IMG_6393.MOV | Wspięcie na palce z ugiętym kolanem | 15–116 | 3,37 s |
| IMG_6395.MOV | Pompka klasyczna | 27–107 | 2,67 s |

Użytkownik potwierdził zamianę pompki łopatkowej na klasyczną: film pokazuje
uginanie łokci. Zmieniono nazwę i opis; zachowano 8 powtórzeń oraz 40 s timera.
Pozostałe nazwy i instrukcje, wszystkie dawki i czasy pozostały bez zmian.

Każdy film pokazuje pełne powtórzenie, w naturalnym tempie. RDL i wspięcie
pokazują jedną stronę. Zachowano cały oryginalny kadr, usunięto dźwięk oraz
fragmenty przygotowania lub wychodzenia z ćwiczenia. Bez odwracania ruchu.

Sprawdzono klatki gotowych filmów, pełne dekodowanie, liczbę klatek, brak audio,
720 × 1280 / 30 kl./s i faststart. Dziesięć testów logiki przechodzi, w tym
zmiany filmów Etapu 3, reset, przejście do ćwiczenia bez filmu oraz powrót.
Testów przeglądarkowych i na telefonach nadal nie wykonano.

Pakiet `PREPPRO-etapy-1-3-komplet.zip` zawiera aplikację, wszystkie 13 filmów,
miniatury, podgląd i dokumentację. Zmiany są lokalne, bez publikacji.

## Etap 4 — sprężystość, lądowanie i hamowanie

| Źródło | Ćwiczenie | Zakres klatek (koniec wyłączny) | Długość |
|---|---|---|---|
| IMG_6396.MOV | Niskie podskoki obunóż (pogo) | 23–82 | 1,97 s |
| IMG_6400.MOV | Snap-down | 35–188 | 5,10 s |
| IMG_6402.MOV | Podskoki obunóż z unoszeniem kolan | 35–95 | 2,00 s |
| IMG_6403.MOV | Przeskoki z nogi na nogę | 15–172 | 5,23 s |

Użytkownik zatwierdził trzy zmiany nazw i opisów: wspięcia zastąpiono pogo,
małe podskoki podskokami z unoszeniem kolan, a lądowanie z zatrzymaniem
przeskokami z nogi na nogę. Dawkowanie i czas wszystkich ćwiczeń zachowano.
Snap-down zachowuje przygotowanie, szybkie zejście, rzeczywiste zatrzymanie
oraz powrót. Przeskoki pokazują ruch w obie strony; na połączeniu końca
z początkiem widać zmianę miejsca zawodnika. Nie odwracano nagrania,
nie zmieniano tempa i nie dodawano sztucznego zatrzymania.

Sprawdzono klatki, pełne dekodowanie, liczbę klatek, brak audio, 720 × 1280,
30 kl./s i faststart. Jedenaście testów logiki przechodzi, w tym powiązania
czterech filmów Etapu 4, zatwierdzone nazwy, dawki oraz sterowanie timerem.
Testów przeglądarkowych i na telefonach nadal nie wykonano.

Pakiet `PREPPRO-etapy-1-4-komplet.zip` zawiera wszystkie 17 filmów, aplikację,
miniatury, podgląd i dokumentację. Wersja lokalna, bez publikacji.

## Etap 5 — aktywacja szybkościowa

| Źródło | Ćwiczenie | Zakres klatek (koniec wyłączny) | Długość |
|---|---|---|---|
| IMG_6404.MOV | Szybkie stopy w miejscu | 34–83 | 1,63 s |
| IMG_6406.MOV | Starty z pozycji atletycznej | 33–138 | 3,50 s |
| IMG_6407.MOV | Dwa kontrolowane hamowania po krótkim przyspieszeniu | 4–103 | 3,30 s |

Zachowano nazwy, opisy, dawkowanie i czas. Start pokazuje przygotowanie
oraz przyspieszenie; po zakończeniu klipu odtwarzacz wraca do pozycji startowej.
Hamowania pokazano w wariancie z nawrotem, z dwoma zmianami kierunku w klipie.
Nie odwracano ruchu ani nie zmieniano tempa. Naturalne zmiany miejsca zawodnika
pozostają widoczne na łączeniu pętli. Filmy startu i hamowania zachowują szeroki
kadr źródłowy, więc zawodnik w oddaleniu jest niewielki na ekranie telefonu.

Sprawdzono wszystkie pliki i powiązania. Trzynaście testów logiki przechodzi,
w tym pełny przebieg 20 ćwiczeń, postęp, zatrzymanie po „Zakończ plan” i ponowny
start. Przycisk zakończenia zatrzymuje teraz również timer oraz ostatni film.

## Prawidłowy herb — pierwsza wersja

Zastąpiono poprzedni uproszczony herb SVG dostarczonym plikiem
`420646369_999336865265153_4525234259521568133_n.jpg`.
Kopia `assets/branding/olimpia-grudziadz.jpg` jest identyczna bajtowo z oryginałem.
CSS ogranicza widok do herbu z niewielkim białym marginesem; nie przerabiano
znaku, tekstu ani kolorów. Ten sam herb jest w aplikacji i w podglądzie filmów.

## Korekta końcowa v2 — tło herbu i jasność filmów

Aktualna aplikacja i podgląd używają pliku
`assets/branding/olimpia-grudziadz-transparent-v2.png` z rzeczywistym kanałem
przezroczystości. Białe pola wewnątrz herbu pozostają widoczne. Usunięto białe
tło kontenera w obu stronach. Plik przygotowano wbudowanym narzędziem imagegen;
pełne polecenie znajduje się w `assets/branding/IMAGEGEN.md`.

Wszystkie 20 filmów v2 zakodowano ponownie z oryginalnych MOV, z korektą
ekspozycji −0,4 EV w liniowej przestrzeni koloru, przed konwersją HDR do SDR.
Przycięcia, liczba klatek, tempo i dawkowanie pozostają takie jak w wersji v1.
Jest to delikatne przyciemnienie; szczegółów już utraconych w prześwietlonym
źródle nie można w ten sposób odtworzyć. Miniatury pochodzą z poprawionych filmów.

Nowe nazwy `-v2` rozróżniają pliki od wcześniejszych kopii w pamięci przeglądarki.
Parametry każdego klipu zapisano w `assets/videos/color-v2-edit-log.json`.
Poprzednie pliki v1 pozostają lokalnie do porównania; pakiet v2 zawiera tylko
aktualne filmy i miniatury. Wcześniejsze sekcje dokumentu opisują historię prac.

Weryfikacja v2: 13/13 testów logiki aplikacji; wszystkie 20 MP4 poprawnie
dekoduje się w całości, ma oczekiwaną liczbę klatek, 720 × 1280, 30 kl./s,
bez audio i z faststart. Sprawdzono odnośniki obu stron oraz przezroczystość
PNG. Wizualnie porównano jasność trzech reprezentatywnych nagrań i ich
miniatur. Testów na fizycznych telefonach jeszcze nie wykonano.
