'use strict';

const byId = id => document.getElementById(id);
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function externalLink(label, href) {
  const link = element('a', '', label);
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function readView() {
  const [slug, mode, left, right] = location.hash.slice(1).split(':');
  const task = benchmarks.find(item => item.id === slug) || benchmarks[0];
  const isSample = id => task.samples.some(sample => sample.id === id);
  const a = isSample(left) ? left : task.defaults[0];
  let b = isSample(right) && right !== a ? right : task.defaults[1];
  if (a === b) b = task.samples.find(sample => sample.id !== a).id;
  return { task, mode: mode === 'single' ? 'single' : 'split', ids: [a, b] };
}

let view = readView();
let clock = 0;
let playRequest = 0;
let noticeTimer;
const gameViewport = { width: 920, height: 740 };
const gameResizer = new ResizeObserver(entries => {
  for (const entry of entries) {
    const frame = entry.target.querySelector('iframe');
    if (!frame) continue;
    const {width, height} = entry.contentRect;
    const scale = Math.min(width / gameViewport.width, height / gameViewport.height);
    frame.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
  }
});
const videos = () => Array.from(byId('panels').querySelectorAll('video'));
const viewHash = () => '#' + [view.task.id, view.mode, ...view.ids].join(':');

function announce(message) {
  const notice = byId('notice');
  notice.textContent = message;
  notice.hidden = false;
  notice.classList.add('visible');
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    notice.textContent = '';
    notice.hidden = true;
    notice.classList.remove('visible');
  }, 3200);
}

function moveView(task, mode, ids) {
  view = { task, mode, ids };
  if (location.hash !== viewHash()) history.pushState(null, '', viewHash());
  render();
}

function chooseSample(side, id) {
  const ids = [...view.ids];
  if (ids[1 - side] === id) ids[1 - side] = ids[side];
  ids[side] = id;
  moveView(view.task, view.mode, ids);
  byId('panels').querySelectorAll('select')[side]?.focus();
}

function taskTabs() {
  const tabs = byId('tasks');
  tabs.replaceChildren(...benchmarks.map(task => {
    const button = element('button', 'task-tab');
    button.type = 'button';
    const active = task === view.task;
    button.setAttribute('aria-pressed', String(active));
    if (active) button.classList.add('active', 'is-active');
    const image = element('img');
    image.src = task.thumb;
    image.alt = '';
    const label = element('span');
    label.append(element('strong', '', task.name), element('small', '', task.category + ' · ' + task.samples.length + ' 份作品'));
    button.append(image, label);
    button.addEventListener('click', () => {
      if (!active) {
        moveView(task, view.mode, [...task.defaults]);
        byId('tasks').querySelector('[aria-pressed="true"]').focus({preventScroll:true});
      }
    });
    return button;
  }));
}

function gamePreview(sample, screen) {
  const image = element('img', 'game-poster');
  image.src = sample.poster;
  image.alt = sample.model + ' 的游戏实况截图';
  const button = element('button', 'launch', '开始试玩');
  button.type = 'button';
  button.setAttribute('aria-label', '试玩 ' + sample.model + ' 的作品');
  button.addEventListener('click', () => {
    const frame = element('iframe', 'game-frame');
    frame.title = sample.model + ' · Space Invaders';
    // The published games live on a separate origin. Two use storage for high scores.
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    frame.referrerPolicy = 'no-referrer';
    frame.src = sample.demo;
    frame.addEventListener('load', () => frame.focus(), {once:true});
    screen.replaceChildren(frame);
    frame.style.width = gameViewport.width + 'px';
    frame.style.height = gameViewport.height + 'px';
    gameResizer.observe(screen);
  });
  screen.append(image, button);
}

function makePanel(side) {
  const task = view.task;
  const sample = task.samples.find(item => item.id === view.ids[side]);
  const panel = element('article', 'panel');
  const header = element('div', 'panel-head');
  const slot = side === 0 ? 'A' : 'B';
  const select = element('select', 'panel-model');
  select.setAttribute('aria-label', slot + ' 栏模型');
  for (const s of task.samples) {
    const repeated = task.samples.some(other => other !== s && other.model === s.model);
    select.add(new Option(s.model + (repeated ? ' · 样本 ' + s.id : ''), s.id));
  }
  select.value = sample.id;
  select.addEventListener('change', () => chooseSample(side, select.value));
  header.append(element('span', 'slot', slot), select, element('span', 'meta', '样本 ' + sample.id));
  const screen = element('div', 'screen' + (task.type === 'game' ? ' is-game' : ''));
  if (task.type === 'video') {
    const video = element('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = sample.poster;
    video.src = sample.video;
    video.setAttribute('aria-label', sample.model + ' 转笔录像');
    video.addEventListener('error', () => announce('这段录像未载入，可在来源页查看。'));
    screen.append(video);
  } else {
    gamePreview(sample, screen);
  }
  const footer = element('div', 'panel-foot');
  if (task.type === 'video') {
    footer.append(element('span', '', sample.runner + ' · ' + sample.elapsed), element('span', '', '技术检查 ' + sample.checks));
    footer.title = sample.condition;
    if (sample.condition !== '完整运行，自行结束') {
      const status = element('small', 'sample-condition', sample.condition);
      footer.firstChild.append(document.createElement('br'), status);
    }
  } else {
    footer.append(element('span', '', '方向键移动 · 空格射击'), externalLink('独立试玩', sample.demo));
  }
  panel.append(header, screen, footer);
  return panel;
}

function setPlayLabel(playing) {
  const play = byId('play');
  const label = playing ? '暂停' : (clock >= 7.99 ? '重播' : (view.mode === 'split' ? '同步播放' : '播放'));
  const text = play.querySelector('[data-play-label]');
  if (text) text.textContent = label;
  else play.textContent = (playing ? 'Ⅱ ' : '▶ ') + label;
  play.setAttribute('aria-pressed', String(playing));
  play.setAttribute('aria-label', label + (view.mode === 'split' ? '两段录像' : '录像'));
}

function showTime(value) {
  clock = Math.min(8, Math.max(0, value));
  byId('timeline').value = clock;
  byId('timeline').style.setProperty('--progress', (clock / 8 * 100) + '%');
  byId('time').textContent = clock.toFixed(1) + ' / 8.0 s';
}

function seek(value) {
  showTime(value);
  for (const player of videos()) {
    if (player.readyState >= 1) player.currentTime = clock;
    else player.addEventListener('loadedmetadata', () => { player.currentTime = clock; }, {once:true});
  }
}

function stopPlayers() {
  playRequest += 1;
  for (const player of videos()) player.pause();
  setPlayLabel(false);
}

async function togglePlay() {
  const players = videos();
  if (!players.length) return;
  if (players.some(player => !player.paused)) { stopPlayers(); return; }
  if (clock >= 7.95) seek(0);
  else seek(clock);
  const request = ++playRequest;
  try {
    await Promise.all(players.map(player => player.play()));
    if (request === playRequest) setPlayLabel(true);
  } catch {
    if (request === playRequest) { stopPlayers(); announce('播放未开始，请再点一次播放。'); }
  }
}

function render() {
  stopPlayers();
  gameResizer.disconnect();
  taskTabs();
  const { task, mode } = view;
  byId('task-title').textContent = task.name;
  byId('task-desc').textContent = task.description;
  const panels = byId('panels');
  panels.dataset.mode = mode;
  panels.classList.toggle('single', mode === 'single');
  panels.replaceChildren(...(mode === 'split' ? [makePanel(0),makePanel(1)] : [makePanel(0)]));
  for (const m of ['split','single']) {
    const control = byId(m);
    control.setAttribute('aria-pressed', String(m === mode));
    control.classList.toggle('active', m === mode);
  }
  const videoMode = task.type === 'video';
  for (const id of ['play','timeline','time']) byId(id).hidden = !videoMode;
  if (byId('playback')) byId('playback').hidden = !videoMode;
  showTime(0);
  setPlayLabel(false);
  if (videoMode) {
    const players = videos();
    players[0].addEventListener('timeupdate', () => {
      if (!players[0].paused) {
        showTime(players[0].currentTime);
        for (const follower of players.slice(1)) {
          if (!follower.seeking && Math.abs(follower.currentTime-clock) > 0.12) follower.currentTime = clock;
        }
      }
    });
    players[0].addEventListener('ended', () => { seek(8); stopPlayers(); });
  }
  document.title = task.name + ' · 模型作品对照室';
}

function openMethod() {
  const task = view.task;
  const body = byId('method-body');
  const group = (title, text) => {
    const section = element('section');
    section.append(element('h3','',title),element('p','',text));
    return section;
  };
  byId('method-title').textContent = task.name + ' · 评测方法';
  if (task.type === 'video') {
    body.replaceChildren(group('任务与条件','用 Sharpa Wave 官方右手资产，在 20 分钟内用 Three.js 做一次绕拇指转笔。11 份作业来自 9 个型号，包含同型号的独立运行，部分运行提前截断。'),
      group('如何比较','每份作品用同一流程重录为 8 秒视频。26 项技术检查衡量可运行性。原项目另有基于 16 张静帧的两轮匿名视觉评审。'),
      group('素材署名','录像与原海报来自李韭二（@li9292），使用 CC BY 4.0 许可。本站将海报转换为 WebP，并增加双栏同步播放器。'));
  } else {
    body.replaceChildren(group('原始提示词','Write an HTML and JavaScript page implementing space invaders'),
      group('如何比较','Simon Willison 的公开单题。六个模型各运行一次，保留第一份成品。点击画面开始试玩，按作品内提示操作。独立试玩可打开原始尺寸。'),
      group('素材署名','游戏来自 toby-bridges 的六模型对照项目，MIT 许可。本站海报截自对应游戏的实际画面，试玩从原项目加载。'));
  }
  const links = element('div','source-links');
  const license = element('a','', '许可文本');
  license.href = task.type === 'video' ? 'licenses/pen-spinning.txt' : 'licenses/invaders.txt';
  license.target = '_blank';
  license.rel = 'noopener';
  links.append(externalLink('原始画廊', task.source), externalLink('固定版本源码', task.repo), license);
  if (task.type === 'game') links.append(externalLink('题目来源','https://space-invaders.simonwillison.net/'));
  body.append(links);
  const dialog = byId('method');
  if (!dialog.open) dialog.showModal();
}

async function shareView() {
  const url = new URL(location.href);
  url.hash = viewHash();
  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(url.href);
    announce('已复制当前对照链接');
  } catch {
    const box = element('input','share-fallback');
    box.type = 'text';
    box.readOnly = true;
    box.value = url.href;
    box.setAttribute('aria-label','当前对照链接');
    byId('method-title').textContent = '复制对照链接';
    byId('method-body').replaceChildren(box);
    byId('method').showModal();
    box.select();
  }
}

byId('play').addEventListener('click', togglePlay);
byId('timeline').min = 0;
byId('timeline').max = 8;
byId('timeline').step = 0.01;
byId('timeline').addEventListener('input', e => seek(Number(e.target.value)));
for (const mode of ['split','single']) byId(mode).addEventListener('click', () => {
  if (view.mode !== mode) moveView(view.task, mode, [...view.ids]);
});
for (const id of ['task-method','method-open']) byId(id).addEventListener('click', openMethod);
byId('method-close').addEventListener('click', () => byId('method').close());
byId('method').addEventListener('click', e => { if(e.target === e.currentTarget) e.currentTarget.close(); });
byId('share').addEventListener('click', shareView);
window.addEventListener('hashchange', () => {
  if (location.hash === '#archive') return;
  view = readView();
  render();
});
for (const link of document.querySelectorAll('a[href="#archive"]')) {
  link.addEventListener('click', e => {
    e.preventDefault();
    byId('archive')?.scrollIntoView({behavior:'smooth'});
  });
}
render();
