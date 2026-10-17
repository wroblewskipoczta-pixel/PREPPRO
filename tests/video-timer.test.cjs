// Testy zachowania aplikacji z symulowanym DOM i odtwarzaczem.
// Nie zastępują testów dekodowania i autoplay na fizycznym telefonie.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function app() {
  class Element {
    constructor() {
      this.attrs = {}; this.events = {}; this.style = {};
      this.paused = true; this.currentTime = 0; this.readyState = 1;
      this.hidden = false; this.textContent = ''; this.error = null;
      const classes = new Set();
      this.classList = {
        toggle: (k, v) => v ? classes.add(k) : classes.delete(k),
        add: k => classes.add(k), remove: k => classes.delete(k),
        contains: k => classes.has(k)
      };
    }
    set src(value) { this.attrs.src = value; }
    get src() { return this.attrs.src; }
    setAttribute(k, v) { this.attrs[k] = v; }
    getAttribute(k) { return this.attrs[k] || null; }
    removeAttribute(k) { delete this.attrs[k]; }
    addEventListener(k, fn) { this.events[k] = fn; }
    load() { this.error = null; this.currentTime = 0; this.paused = true; }
    pause() { this.paused = true; }
    play() { this.paused = false; return Promise.resolve(); }
    scrollIntoView() {}
  }
  const nodes = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m => [m[1], new Element()]));
  const intervals = new Map(); let serial = 0;
  const ctx = vm.createContext({
    document: { getElementById: id => nodes[id], querySelectorAll: () => [], createElement: () => new Element() },
    navigator: {}, window: { scrollTo() {} },
    localStorage: { getItem: () => null, setItem() {} },
    setTimeout, clearTimeout,
    setInterval: fn => { intervals.set(++serial, fn); return serial; },
    clearInterval: id => intervals.delete(id), confirm: () => true
  });
  vm.runInContext(code, ctx);
  return { nodes, run: text => vm.runInContext(text, ctx), tick: () => [...intervals.values()].forEach(fn => fn()) };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('wszystkie 20 ćwiczeń ma własny plik; brak przypisania nie blokuje timera', () => {
  const a = app();
  assert.equal(a.run('exercises.length'), 20);
  assert.equal(a.run('exercises.filter(e => e.video).length'), 20);
  assert.equal(a.run('new Set(exercises.map(e => e.video.src)).size'), 20);
  assert.equal(a.nodes.videoPanel.hidden, false);
  for (const media of a.run('Object.values(exerciseVideos)')) {
    for (const file of [media.src, media.poster]) assert.ok(fs.existsSync(path.join(__dirname, '..', file)));
  }
  a.run('exercises[1].video = null'); // Symulacja przyszłego ćwiczenia bez nagrania.
  const firstWithoutVideo = a.run('exercises.findIndex(e => !e.video)');
  assert.ok(firstWithoutVideo > 0);
  for (let i = 0; i < firstWithoutVideo; i++) a.nodes.nextBtn.onclick();
  assert.equal(a.nodes.videoPanel.hidden, true);
  assert.equal(a.nodes.exerciseVideo.getAttribute('src'), null);
  const initialSeconds = a.run('exercises[active].seconds');
  a.nodes.timerStart.onclick(); a.tick();
  assert.equal(a.run('remaining'), initialSeconds - 1);
});

test('start, pauza, wznowienie i reset sterują timerem i pokazem', async () => {
  const a = app(), n = a.nodes;
  n.timerStart.onclick(); await flush(); a.tick();
  assert.equal(n.exerciseVideo.paused, false);
  assert.equal(n.timerDisplay.textContent, '00:29');
  n.exerciseVideo.currentTime = 1.2;
  n.timerStart.onclick(); a.tick();
  assert.equal(n.exerciseVideo.paused, true);
  assert.equal(n.timerDisplay.textContent, '00:29');
  n.timerStart.onclick(); await flush();
  assert.equal(n.exerciseVideo.paused, false);
  assert.equal(n.exerciseVideo.currentTime, 1.2);
  n.timerReset.onclick();
  assert.equal(n.exerciseVideo.currentTime, 0);
  assert.equal(n.exerciseVideo.paused, true);
  assert.equal(n.timerDisplay.textContent, '00:30');
});

test('koniec czasu zatrzymuje pokaz; ponowny start odnawia czas', async () => {
  const a = app(), n = a.nodes;
  n.timerStart.onclick(); await flush();
  for (let i = 0; i < 30; i++) a.tick();
  assert.equal(n.timerDisplay.textContent, '00:00');
  assert.equal(n.exerciseVideo.paused, true);
  n.timerStart.onclick(); await flush();
  assert.equal(n.timerDisplay.textContent, '00:30');
  assert.equal(n.exerciseVideo.paused, false);
});

test('zablokowane odtwarzanie i błąd pliku nie blokują treningu; można ponowić', async () => {
  const a = app(), n = a.nodes;
  n.exerciseVideo.play = () => Promise.reject({ name: 'NotAllowedError' });
  n.timerStart.onclick(); await flush(); a.tick();
  assert.match(n.videoStatus.textContent, /Dotknij/);
  assert.equal(n.timerDisplay.textContent, '00:29');
  n.exerciseVideo.error = { code: 2 };
  n.exerciseVideo.events.error(); a.tick();
  assert.match(n.videoStatus.textContent, /Film niedostępny/);
  assert.equal(n.timerDisplay.textContent, '00:28');
  n.exerciseVideo.play = () => { n.exerciseVideo.paused = false; return Promise.resolve(); };
  n.videoToggle.onclick(); await flush();
  assert.equal(n.exerciseVideo.paused, false);
  assert.match(n.videoStatus.textContent, /w pętli/);
});

test('spóźniony błąd starego odtwarzania nie zmienia następnego ćwiczenia', async () => {
  const a = app(), n = a.nodes; let reject;
  n.exerciseVideo.play = () => new Promise((_, fail) => { reject = fail; });
  n.timerStart.onclick();
  a.run('exercises[1].video = null');
  const firstWithoutVideo = a.run('exercises.findIndex(e => !e.video)');
  for (let i = 0; i < firstWithoutVideo; i++) n.nextBtn.onclick();
  const initialDisplay = n.timerDisplay.textContent;
  reject({ name: 'NotAllowedError' }); await flush();
  assert.equal(n.videoPanel.hidden, true);
  assert.equal(n.timerDisplay.textContent, initialDisplay);
  assert.equal(n.exerciseVideo.paused, true);
  assert.doesNotMatch(n.videoStatus.textContent, /Dotknij/);
  n.prevBtn.onclick();
  assert.equal(n.videoPanel.hidden, false);
  assert.equal(n.exerciseVideo.currentTime, 0);
});

test('podgląd przed treningiem nie uruchamia timera', async () => {
  const a = app(), n = a.nodes;
  n.videoToggle.onclick(); await flush(); a.tick();
  assert.equal(n.exerciseVideo.paused, false);
  assert.equal(n.timerDisplay.textContent, '00:30');
  n.videoToggle.onclick();
  assert.equal(n.exerciseVideo.paused, true);
});

test('kolejny film ładuje się dopiero po starcie, z pominięciem oszczędzania danych', () => {
  const a = app();
  a.run("exercises[1].video = {src:'next.mp4', poster:'next.jpg'}");
  assert.equal(a.run("nextVideo.getAttribute('src')"), null);
  a.run('navigator.connection = {saveData: true}');
  a.nodes.timerStart.onclick();
  assert.equal(a.run("nextVideo.getAttribute('src')"), null);
  a.nodes.timerStart.onclick();
  a.run('navigator.connection = {saveData: false, effectiveType: "4g"}');
  a.nodes.timerStart.onclick();
  assert.equal(a.run("nextVideo.getAttribute('src')"), 'next.mp4');
});

test('pierwszy etap zmienia pięć filmów i miniaturek wraz z ćwiczeniami', async () => {
  const a = app(), n = a.nodes;
  const expected = ['marsz-praca-ramion', 'mobilizacja-skokowego-wykrok', 'wykrok-rotacja', 'biodra-90-90', 'wspiecia-palce'];
  const seconds = ['00:30', '00:40', '00:40', '00:40', '00:30'];
  for (let i = 0; i < expected.length; i++) {
    assert.equal(n.exerciseVideo.src, `assets/videos/${expected[i]}-v2.mp4`);
    assert.equal(n.exerciseVideo.poster, `assets/posters/${expected[i]}-v2.jpg`);
    assert.equal(n.timerDisplay.textContent, seconds[i]);
    assert.equal(n.videoPanel.hidden, false);
    n.timerStart.onclick(); await flush();
    assert.equal(n.exerciseVideo.paused, false);
    n.nextBtn.onclick();
    assert.equal(n.exerciseVideo.paused, true);
  }
  assert.equal(n.videoPanel.hidden, false);
  assert.equal(n.exerciseVideo.getAttribute('src'), 'assets/videos/chod-bokiem-guma-v2.mp4');
});

test('drugi etap przełącza cztery pokazy i przechodzi do filmu trzeciego etapu', async () => {
  const a = app(), n = a.nodes;
  for (let i = 0; i < 5; i++) n.nextBtn.onclick();
  const expected = ['chod-bokiem-guma', 'most-biodrowy', 'odwodzenie-biodra-guma', 'dead-bug'];
  const times = ['00:40', '00:40', '00:40', '00:45'];
  for (let i = 0; i < expected.length; i++) {
    assert.equal(n.exerciseVideo.src, `assets/videos/${expected[i]}-v2.mp4`);
    assert.equal(n.exerciseVideo.poster, `assets/posters/${expected[i]}-v2.jpg`);
    assert.equal(n.timerDisplay.textContent, times[i]);
    n.timerStart.onclick(); await flush(); a.tick();
    assert.equal(n.exerciseVideo.paused, false);
    n.timerStart.onclick();
    assert.equal(n.exerciseVideo.paused, true);
    n.nextBtn.onclick();
  }
  assert.equal(n.videoPanel.hidden, false);
  assert.equal(n.exerciseVideo.getAttribute('src'), 'assets/videos/przysiad-masa-ciala-v2.mp4');
  n.prevBtn.onclick();
  assert.equal(n.exerciseVideo.src, 'assets/videos/dead-bug-v2.mp4');
  assert.equal(n.exerciseVideo.currentTime, 0);
  assert.equal(n.timerDisplay.textContent, '00:45');
});

test('etap trzeci zmienia cztery filmy, zachowuje dawkę pompki i przechodzi do etapu czwartego', async () => {
  const a = app(), n = a.nodes;
  for (let i = 0; i < 9; i++) n.nextBtn.onclick();
  const expected = ['przysiad-masa-ciala', 'rdl-jedna-noga', 'wspiecie-ugiete-kolano', 'pompka-klasyczna'];
  const times = ['00:40', '00:45', '00:40', '00:40'];
  for (let i = 0; i < expected.length; i++) {
    assert.equal(n.exerciseVideo.src, `assets/videos/${expected[i]}-v2.mp4`);
    assert.equal(n.exerciseVideo.poster, `assets/posters/${expected[i]}-v2.jpg`);
    assert.equal(n.timerDisplay.textContent, times[i]);
    if (i === 3) {
      assert.equal(n.exerciseName.textContent, 'Pompka klasyczna');
      assert.equal(n.exerciseDose.textContent, '8 powt.');
      assert.match(n.exerciseHow.textContent, /Ugnij łokcie/);
    }
    n.timerStart.onclick(); await flush(); a.tick();
    assert.equal(n.exerciseVideo.paused, false);
    n.timerReset.onclick();
    assert.equal(n.exerciseVideo.paused, true);
    assert.equal(n.exerciseVideo.currentTime, 0);
    assert.equal(n.timerDisplay.textContent, times[i]);
    n.nextBtn.onclick();
  }
  assert.equal(n.videoPanel.hidden, false);
  assert.equal(n.exerciseVideo.getAttribute('src'), 'assets/videos/pogo-obunoz-v2.mp4');
  n.prevBtn.onclick();
  assert.equal(n.exerciseVideo.src, 'assets/videos/pompka-klasyczna-v2.mp4');
});

test('etap czwarty pokazuje zatwierdzone warianty i zachowuje dawki oraz czasy', async () => {
  const a = app(), n = a.nodes;
  for (let i = 0; i < 13; i++) n.nextBtn.onclick();
  const keys = ['pogo-obunoz', 'snap-down', 'podskoki-unoszenie-kolan', 'przeskoki-noga-noga'];
  const times = ['00:30', '00:35', '00:40', '00:45'];
  const doses = ['10 powt.', '4 powt.', '2 × 8', '3 / strona'];
  for (let i = 0; i < keys.length; i++) {
    assert.equal(n.exerciseVideo.src, `assets/videos/${keys[i]}-v2.mp4`);
    assert.equal(n.exerciseVideo.poster, `assets/posters/${keys[i]}-v2.jpg`);
    assert.equal(n.timerDisplay.textContent, times[i]);
    assert.equal(n.exerciseDose.textContent, doses[i]);
    if (i === 0) assert.equal(n.exerciseName.textContent, 'Niskie podskoki obunóż (pogo)');
    if (i === 2) assert.equal(n.exerciseName.textContent, 'Podskoki obunóż z unoszeniem kolan');
    if (i === 3) {
      assert.equal(n.exerciseName.textContent, 'Przeskoki z nogi na nogę');
      assert.doesNotMatch(n.exerciseHow.textContent, /2–3 sekundy/);
    }
    n.timerStart.onclick(); await flush(); a.tick();
    assert.equal(n.exerciseVideo.paused, false);
    n.timerStart.onclick();
    assert.equal(n.exerciseVideo.paused, true);
    n.nextBtn.onclick();
  }
  assert.equal(n.videoPanel.hidden, false);
  assert.equal(n.exerciseVideo.getAttribute('src'), 'assets/videos/szybkie-stopy-v2.mp4');
  n.prevBtn.onclick();
  assert.equal(n.exerciseVideo.src, 'assets/videos/przeskoki-noga-noga-v2.mp4');
  assert.equal(n.timerDisplay.textContent, '00:45');
});

test('ostatni etap ma trzy filmy z zachowanymi dawkami i czasami', () => {
  const a = app(), n = a.nodes;
  for (let i = 0; i < 17; i++) n.nextBtn.onclick();
  const keys = ['szybkie-stopy', 'start-atletyczny', 'hamowania'];
  const times = ['00:20', '00:35', '00:40'];
  const doses = ['2 × 5 s', '3 × 5–10 m', '2 hamowania'];
  for (let i = 0; i < keys.length; i++) {
    assert.equal(n.exerciseVideo.src, `assets/videos/${keys[i]}-v2.mp4`);
    assert.equal(n.exerciseVideo.poster, `assets/posters/${keys[i]}-v2.jpg`);
    assert.equal(n.timerDisplay.textContent, times[i]);
    assert.equal(n.exerciseDose.textContent, doses[i]);
    if (i < keys.length - 1) n.nextBtn.onclick();
  }
  assert.equal(n.nextBtn.textContent, 'Zakończ plan →');
});

test('cały plan: 20 filmów, zapis postępu, zatrzymanie na końcu i ponowny start', async () => {
  const a = app(), n = a.nodes;
  for (let i = 0; i < 20; i++) {
    assert.equal(n.videoPanel.hidden, false);
    n.doneCheck.onchange({ target: { checked: true } });
    n.timerStart.onclick(); await flush(); a.tick();
    assert.equal(n.exerciseVideo.paused, false);
    n.nextBtn.onclick();
    assert.equal(n.exerciseVideo.paused, true);
    assert.equal(a.run('interval'), null);
  }
  assert.equal(n.heroDone.textContent, '20/20');
  assert.equal(n.progressText.textContent, '100%');
  assert.equal(n.finishBox.classList.contains('show'), true);
  const lastTime = n.timerDisplay.textContent;
  a.tick(); assert.equal(n.timerDisplay.textContent, lastTime);
  n.restartBtn.onclick();
  assert.equal(n.exerciseVideo.src, 'assets/videos/marsz-praca-ramion-v2.mp4');
  assert.equal(n.timerDisplay.textContent, '00:30');
  assert.equal(n.exerciseVideo.paused, true);
});
