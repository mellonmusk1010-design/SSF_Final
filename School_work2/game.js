const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const moneyText = document.getElementById('moneyText');
const stageText = document.getElementById('stageText');
const timeText = document.getElementById('timeText');
const timeBar = document.getElementById('timeBar');
const tipText = document.getElementById('tipText');
const messageBox = document.getElementById('messageBox');
const battleButton = document.getElementById('battleButton');
const livesUi = document.getElementById('livesUi');
const heartIcons = [...document.querySelectorAll('.heart-icon')];
const weaponCards = [...document.querySelectorAll('.weapon-card')];
const speedButtons = [...document.querySelectorAll('.speed-button')];

const ROWS = 5;

const COLS = 8;
const START_MONEY = 400;
const MAX_LIVES = 3;
const ASSET_PATH = 'asset/';

/*
몬스터 능력치와 웨이브 배치 설정 설명서

WAVE_CONFIG 안의 중괄호 한 묶음이 한 웨이브임
prepTime은 전투 전 준비 시간, battleTime은 전투 시간 표시 기준이며 단위는 ms임

monsterStats에서 해당 웨이브의 몬스터 능력치를 직접 설정함
normal은 일반형, fast는 속도형, tank는 탱커형임
hp는 체력, speed는 이동 속도, damage는 공격력임
cool은 공격 간격(ms)이므로 값이 작을수록 빠르게 공격함
reward는 몬스터를 처치했을 때 받는 코인임
width와 height는 몬스터 크기이며 hard는 탱커 외형 사용 여부임

spawns에서 해당 웨이브의 출현 순서와 위치를 직접 설정함
at은 전투 시작 후 출현 시각임 ms단위
row는 출현 위치이며 0이 맨 위, 4가 맨 아래 줄임
type은 monsterStats에 있는 normal, fast, tank 중 하나를 적음
같은 at 값을 여러 개 사용하면 몬스터가 동시에 출현함
웨이브를 추가하려면 기존 웨이브 한 묶음을 복사해 배열 끝에 붙이면 됨
*/
const WAVE_CONFIG = [
    {
        prepTime: 24000,
        battleTime: 32000,
        monsterStats: {
            normal: { hp: 260, speed: 0.64, damage: 38, cool: 720, reward: 12, width: 60, height: 76, hard: false },
            fast: { hp: 175, speed: 0.92, damage: 20, cool: 400, reward: 14, width: 54, height: 70, hard: false },
            tank: { hp: 560, speed: 0.36, damage: 52, cool: 850, reward: 18, width: 72, height: 88, hard: true },
        },
        spawns: [
            { at: 1000, row: 2, type: 'normal' },
            { at: 6000, row: 0, type: 'normal' },
            { at: 11000, row: 4, type: 'normal' },
            { at: 16000, row: 1, type: 'normal' },
            { at: 21000, row: 3, type: 'normal' },
            { at: 26000, row: 2, type: 'normal' },
        ],
    },
    {
        prepTime: 22000,
        battleTime: 34000,
        monsterStats: {
            normal: { hp: 310, speed: 0.66, damage: 44, cool: 700, reward: 14, width: 60, height: 76, hard: false },
            fast: { hp: 205, speed: 0.96, damage: 24, cool: 390, reward: 16, width: 54, height: 70, hard: false },
            tank: { hp: 680, speed: 0.38, damage: 60, cool: 820, reward: 20, width: 72, height: 88, hard: true },
        },
        spawns: [
            { at: 1000, row: 1, type: 'normal' },
            { at: 5000, row: 3, type: 'normal' },
            { at: 9000, row: 0, type: 'fast' },
            { at: 13000, row: 4, type: 'normal' },
            { at: 17000, row: 2, type: 'normal' },
            { at: 21000, row: 1, type: 'fast' },
            { at: 25000, row: 3, type: 'normal' },
            { at: 29000, row: 2, type: 'normal' },
        ],
    },
    {
        prepTime: 22000,
        battleTime: 34000,
        monsterStats: {
            normal: { hp: 370, speed: 0.68, damage: 50, cool: 680, reward: 16, width: 60, height: 76, hard: false },
            fast: { hp: 245, speed: 1.00, damage: 28, cool: 370, reward: 18, width: 54, height: 70, hard: false },
            tank: { hp: 820, speed: 0.40, damage: 70, cool: 780, reward: 24, width: 72, height: 88, hard: true },
        },
        spawns: [
            { at: 1000, row: 2, type: 'tank' },
            { at: 4000, row: 0, type: 'normal' },
            { at: 7000, row: 4, type: 'fast' },
            { at: 10000, row: 1, type: 'normal' },
            { at: 13000, row: 3, type: 'normal' },
            { at: 16000, row: 2, type: 'fast' },
            { at: 19000, row: 0, type: 'normal' },
            { at: 22000, row: 4, type: 'tank' },
            { at: 25000, row: 1, type: 'fast' },
            { at: 28000, row: 3, type: 'normal' },
        ],
    },
    {
        prepTime: 20000,
        battleTime: 35000,
        monsterStats: {
            normal: { hp: 440, speed: 0.71, damage: 56, cool: 650, reward: 18, width: 60, height: 76, hard: false },
            fast: { hp: 290, speed: 1.04, damage: 32, cool: 360, reward: 20, width: 54, height: 70, hard: false },
            tank: { hp: 980, speed: 0.42, damage: 80, cool: 740, reward: 28, width: 72, height: 88, hard: true },
        },
        spawns: [
            { at: 1000, row: 0, type: 'fast' },
            { at: 3500, row: 4, type: 'fast' },
            { at: 6000, row: 2, type: 'tank' },
            { at: 8500, row: 1, type: 'normal' },
            { at: 11000, row: 3, type: 'normal' },
            { at: 13500, row: 0, type: 'tank' },
            { at: 16000, row: 4, type: 'normal' },
            { at: 18500, row: 2, type: 'fast' },
            { at: 21000, row: 1, type: 'fast' },
            { at: 23500, row: 3, type: 'tank' },
            { at: 26000, row: 0, type: 'normal' },
            { at: 28500, row: 4, type: 'fast' },
        ],
    },
    {
        prepTime: 20000,
        battleTime: 36000,
        monsterStats: {
            normal: { hp: 520, speed: 0.74, damage: 64, cool: 630, reward: 20, width: 60, height: 76, hard: false },
            fast: { hp: 340, speed: 1.08, damage: 38, cool: 340, reward: 22, width: 54, height: 70, hard: false },
            tank: { hp: 1180, speed: 0.44, damage: 92, cool: 700, reward: 32, width: 72, height: 88, hard: true },
        },
        spawns: [
            { at: 1000, row: 2, type: 'tank' },
            { at: 3000, row: 0, type: 'fast' },
            { at: 5000, row: 4, type: 'fast' },
            { at: 7000, row: 1, type: 'normal' },
            { at: 9000, row: 3, type: 'normal' },
            { at: 11000, row: 0, type: 'tank' },
            { at: 13000, row: 4, type: 'tank' },
            { at: 15000, row: 2, type: 'fast' },
            { at: 17000, row: 1, type: 'fast' },
            { at: 19000, row: 3, type: 'fast' },
            { at: 21000, row: 0, type: 'normal' },
            { at: 23000, row: 4, type: 'normal' },
            { at: 25000, row: 2, type: 'tank' },
            { at: 27000, row: 1, type: 'normal' },
            { at: 29000, row: 3, type: 'tank' },
        ],
    },
];

const MAX_STAGE = WAVE_CONFIG.length;

WAVE_CONFIG.forEach(wave => {
    wave.spawns.sort((a, b) => a.at - b.at);
});

const WAVE_STORY = {
    prep: ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4', 'Wave 5'],
    battle: ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4', 'Wave 5'],
    clear: ['Wave 1 클리어', 'Wave 2 클리어', 'Wave 3 클리어', 'Wave 4 클리어'],
};

const weapons = {
    gun: { name: '총', cost: 75, hp: 150, range: 500, damage: 40, cool: 900, desc: '원거리 공격' },
    sword: { name: '검', cost: 50, hp: 290, range: 110, damage: 54, cool: 640, desc: '근거리 공격' },
    shield: { name: '방패', cost: 40, hp: 820, range: 0, damage: 0, cool: 0, desc: '방어 담당' },
};

const images = {
    bg: loadImage(ASSET_PATH + '최종 배경.png'),
    panda: loadImage(ASSET_PATH + '레서판다.png'),
    monster: loadImage(ASSET_PATH + '몬스터.png'),
};

let w = 0;
let h = 0;
let uiHeight = 136;
let gridY = 0;
let cellH = 0;
let mode = 'prep';
let stage = 1;
let money = START_MONEY;
let lives = MAX_LIVES;
let timer = WAVE_CONFIG[0].prepTime;
let battleElapsed = 0;
let spawnIndex = 0;
let selected = 'gun';
let lastTime = 0;
let messageTime = 0;
let gameOver = false;
let gameSpeed = 1;
let running = false;
let listenersBound = false;
let rafId = 0;

let pandas = [];
let monsters = [];
let bullets = [];
let effects = [];

function loadImage(src) {
    const img = new Image();
    img.loaded = false;
    img.onload = () => {
        img.loaded = true;
    };
    img.onerror = () => {
        img.loaded = false;
        console.warn('이미지 로드 실패:', src);
    };
    img.src = encodeURI(src);
    return img;
}

function resize() { 
    if (window.innerWidth <= 620) {
        uiHeight = 128;
    } else if (window.innerWidth <= 980) {
        uiHeight = 102;
    } else {
        uiHeight = 104;
    }
    w = Math.max(900, window.innerWidth);
    h = Math.max(560, window.innerHeight);
    canvas.width = w;
    canvas.height = h;
    gridY = uiHeight + 100;
    cellH = Math.max(40, Math.floor((h - gridY - 46) / ROWS));

    pandas.forEach(p => {
        p.x = cellX(p.col, p.row);
        p.y = cellY(p.row);
    });
    monsters.forEach(m => {
        m.y = cellY(m.row);
    });
}
function gridLeft() {

    return Math.max(300, w * 0.30); 
}

function gridWidth() {

    return Math.min(1100, w * 0.65); 
}

function rowX() {
    return gridLeft();
}

function cellW() {
    return gridWidth() / COLS;
}

function cellX(col) {
    return gridLeft() + col * cellW() + cellW() / 2;
}

function cellY(row) {
    return gridY + row * cellH + cellH / 2;
}

function bindListeners() {
    if (listenersBound) return;
    listenersBound = true;
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointerdown', onCanvasClick);
    battleButton.addEventListener('click', beginBattle);

    weaponCards.forEach(card => {
        card.addEventListener('click', () => {
            selected = card.dataset.weapon;
            updateUi();
        });
    });

    speedButtons.forEach(button => {
        button.addEventListener('click', () => {
            gameSpeed = Number(button.dataset.speed);
            updateUi();
        });
    });
}

function resetState() {
    mode = 'prep';
    stage = 1;
    money = START_MONEY;
    lives = MAX_LIVES;
    timer = WAVE_CONFIG[0].prepTime;
    battleElapsed = 0;
    spawnIndex = 0;
    selected = 'gun';
    lastTime = 0;
    messageTime = 0;
    gameOver = false;
    gameSpeed = 1;
    pandas = [];
    monsters = [];
    bullets = [];
    effects = [];
}

function startGame() {
    stopGame();
    resetState();
    bindListeners();
    resize();
    running = true;
    showMessage(WAVE_STORY.prep[0] || '준비 시간입니다. 래서판다를 배치하세요.');
    updateUi();
    rafId = requestAnimationFrame(loop);
}

function stopGame() {
    running = false;
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
    }
}

function beginBattle() {
    if (mode !== 'prep' || gameOver || !running) return;
    mode = 'battle';
    timer = currentWave().battleTime;
    battleElapsed = 0;
    spawnIndex = 0;
    bullets = [];
    effects = [];
    showMessage(WAVE_STORY.battle[stage - 1] || `Wave ${stage}`);
    updateUi();
}

function currentWave() {
    const index = Math.max(0, Math.min(MAX_STAGE - 1, stage - 1));
    return WAVE_CONFIG[index];
}

function onCanvasClick(event) {
    if (!running || gameOver) return;
    if (mode !== 'prep') {
        showMessage('전투 중에는 배치할 수 없습니다.');
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const mx = (event.clientX - rect.left) * (canvas.width / rect.width);
    const my = (event.clientY - rect.top) * (canvas.height / rect.height);
    const cell = getCell(mx, my);
    if (!cell) return;

    const old = pandas.find(p => p.row === cell.row && p.col === cell.col);
    if (old) {
        upgradePanda(old);
    } else {
        addPanda(cell);
    }
    updateUi();
}

function getCell(mx, my) {
    if (!cellH || cellH <= 0) return null;

    const row = Math.floor((my - gridY) / cellH);
    if (row < 0 || row >= ROWS) return null;

    const width = cellW(row);
    if (!width || width <= 0) return null;

    const col = Math.floor((mx - rowX(row)) / width);
    if (col < 0 || col >= COLS) return null;
    return { row, col };
}

function addPanda(cell) {
    const data = weapons[selected];
    if (!data) return;

    if (pandas.some(p => !p.dead && p.row === cell.row && p.col === cell.col)) {
        return;
    }

    if (money < data.cost) {
        showMessage('코인이 부족합니다.');
        return;
    }

    money -= data.cost;
    pandas.push({
        type: selected,
        name: data.name,
        row: cell.row,
        col: cell.col,
        x: cellX(cell.col, cell.row),
        y: cellY(cell.row),
        hp: data.hp,
        maxHp: data.hp,
        range: data.range,
        damage: data.damage,
        cool: data.cool,
        wait: 250,
        anim: 0,
        level: 1,
        dead: false,
    });
}

function upgradePanda(panda) {
    const cost = 55 + panda.level * 35;
    if (money < cost) {
        showMessage('강화할 코인이 부족합니다.');
        return;
    }
    money -= cost;
    panda.level += 1;
    panda.maxHp += 40;
    panda.hp = panda.maxHp;
    if (panda.type !== 'shield') {
        panda.damage = Math.round(panda.damage * 1.10 + 3);
    }
    showMessage(`${panda.name} 강화 완료 (Lv.${panda.level})`);
}

function loop(now) {
    if (!running) return;

    let realDt = lastTime ? now - lastTime : 16;
    if (!Number.isFinite(realDt) || realDt <= 0) realDt = 16;
    realDt = Math.min(40, realDt);

    const dt = realDt * gameSpeed;
    lastTime = now;
    update(dt, realDt);
    draw();

    if (running) {
        rafId = requestAnimationFrame(loop);
    } else {
        rafId = 0;
    }
}

function update(dt, realDt) {
    if (messageTime > 0) {
        messageTime -= realDt;
        if (messageTime <= 0) {
            messageTime = 0;
            messageBox.classList.add('hidden');
        }
    }
    if (gameOver || !running) return;

    if (mode === 'prep') {
        timer -= realDt;
        if (timer <= 0) beginBattle();
    } else if (mode === 'battle' && !gameOver) {
        timer -= dt;
        updateBattle(dt);
    }
    updateEffects(mode === 'prep' ? realDt : dt);
    updateUi();
}

function updateBattle(dt) {
    battleElapsed += dt;
    const spawns = currentWave().spawns;
    while (spawnIndex < spawns.length && battleElapsed >= spawns[spawnIndex].at) {
        addMonster(spawns[spawnIndex]);
        spawnIndex += 1;
    }

    pandas.forEach(p => {
        if (!p.dead && p.hp > 0) attackMonster(p, dt);
    });
    moveBullets(dt);
    moveMonsters(dt);

    pandas = pandas.filter(p => !p.dead && p.hp > 0);
    monsters = monsters.filter(m => !m.dead);

    if (!gameOver && spawnIndex >= spawns.length && monsters.length === 0) {
        nextStage();
    }
}

function attackMonster(panda, dt) {
    if (panda.dead || panda.hp <= 0) return;

    panda.wait -= dt;
    panda.anim = Math.max(0, panda.anim - dt / 180);
    if (panda.type === 'shield') return;

    const target = monsters
        .filter(m => !m.dead && m.row === panda.row && m.x > panda.x - 20 && m.x - panda.x <= panda.range)
        .sort((a, b) => a.x - b.x)[0];

    if (!target || panda.wait > 0) return;

    if (panda.type === 'gun') {
        bullets.push({ x: panda.x + 88, y: panda.y - 40, row: panda.row, damage: panda.damage });
        effects.push({ type: 'flash', x: panda.x + 92, y: panda.y - 40, life: 130 });
    } else {
        target.hp -= panda.damage;
        panda.anim = 1;
        effects.push({ type: 'slash', x: panda.x + 52, y: panda.y - 35, life: 190 });
        if (target.hp <= 0) killMonster(target);
    }
    panda.wait = Math.max(380, panda.cool - panda.level * 18);
}

function moveBullets(dt) {
    bullets.forEach(b => {
        if (b.dead) return;
        b.x += 10 * (dt / 16);

        let hit = null;
        let hitDist = Infinity;
        for (const m of monsters) {
            if (m.dead || m.row !== b.row) continue;
            const half = Math.max(16, m.w * 0.45);
            if (b.x < m.x - half || b.x > m.x + half) continue;
            const dist = Math.abs(m.x - b.x);
            if (dist < hitDist) {
                hit = m;
                hitDist = dist;
            }
        }
        if (!hit) return;

        hit.hp -= b.damage;
        b.dead = true;
        effects.push({ type: 'hit', x: b.x, y: b.y, life: 160 });
        if (hit.hp <= 0) killMonster(hit);
    });
    bullets = bullets.filter(b => !b.dead && b.x < w + 40);
}

function moveMonsters(dt) {
    for (const m of monsters) {
        if (m.dead || gameOver) continue;

        const target = pandas
            .filter(p => !p.dead && p.hp > 0 && p.row === m.row && Math.abs(m.x - p.x) < 50)
            .sort((a, b) => b.col - a.col)[0];

        if (target) {
            m.wait -= dt;
            m.anim = Math.max(0, m.anim - dt / 160);
            if (m.wait <= 0) {
                target.hp -= m.damage;
                if (target.hp <= 0) {
                    target.hp = 0;
                    target.dead = true;
                }
                m.wait = m.cool;
                m.anim = 1;
            }
        } else {
            m.x -= m.speed * (dt / 16);
        }

        if (!m.dead && m.x < rowX(m.row) - 70) {
            loseLife(m);
            if (gameOver) break;
        }
    }
}

function addMonster(spawn) {
    if (!spawn) return;
    const row = Math.max(0, Math.min(ROWS - 1, spawn.row | 0));
    const stats = currentWave().monsterStats[spawn.type];
    if (!stats) {
        console.warn(`알 수 없는 몬스터 타입: ${spawn.type}`);
        return;
    }

    monsters.push({
        row,
        x: w + 40,
        y: cellY(row),
        w: stats.width,
        h: stats.height,
        hp: stats.hp,
        maxHp: stats.hp,
        speed: stats.speed,
        damage: stats.damage,
        cool: stats.cool,
        wait: 350,
        reward: stats.reward,
        hard: stats.hard,
        anim: 0,
        dead: false,
    });
}

function loseLife(monster) {
    if (!monster || monster.dead || gameOver) return;
    monster.dead = true;
    lives = Math.max(0, lives - 1);
    updateUi();

    if (lives <= 0) {
        finish(false);
        return;
    }

    showMessage('HP -1');
}

function killMonster(monster) {
    if (!monster || monster.dead) return;
    monster.dead = true;
    monster.hp = 0;
    const gain = monster.reward || 0;
    money += gain;
    effects.push({ type: 'coin', x: monster.x, y: monster.y - 30, text: `+${gain}`, life: 700 });
}

function nextStage() {
    if (gameOver) return;

    if (stage >= MAX_STAGE) {
        finish(true);
        return;
    }

    stage += 1;
    mode = 'prep';
    timer = currentWave().prepTime;
    battleElapsed = 0;
    spawnIndex = 0;
    money += 90 + stage * 25;
    monsters = [];
    bullets = [];
    effects = [];
    const clearLine = WAVE_STORY.clear[stage - 2];
    const prepLine = WAVE_STORY.prep[stage - 1];
    showMessage(clearLine ? `${clearLine} → ${prepLine || ''}` : (prepLine || `Wave ${stage}`));
    updateUi();
}

function finish(win) {
    if (gameOver) return;
    gameOver = true;
    running = false;
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
    }
    if (typeof window.showEnding === 'function') {
        window.showEnding(win);
    }
}

function updateEffects(dt) {
    effects.forEach(e => {
        e.life -= dt;
    });
    effects = effects.filter(e => e.life > 0);
}

function showMessage(text) {
    messageBox.textContent = text;
    messageBox.classList.remove('hidden');
    messageTime = 2400;
}

function updateUi() {
    moneyText.textContent = `코인 ${money}`;
    stageText.textContent = `Wave ${stage}/${MAX_STAGE}`;
    livesUi.setAttribute('aria-label', `남은 생명 ${lives}개`);
    heartIcons.forEach((heart, index) => {
        const active = index < lives;
        heart.classList.toggle('fa-solid', active);
        heart.classList.toggle('fa-regular', !active);
        heart.classList.toggle('lost', !active);
    });

    const wave = currentWave();
    const maxTime = Math.max(1, mode === 'prep' ? wave.prepTime : wave.battleTime);
    const clampedTimer = Math.max(0, timer);
    const seconds = Math.ceil(clampedTimer / 1000);
    const percent = Math.max(0, Math.min(100, (clampedTimer / maxTime) * 100));
    timeText.textContent = `${mode === 'prep' ? '준비' : '전투'} ${seconds}`;
    timeBar.style.width = `${percent}%`;

    const weapon = weapons[selected] || weapons.gun;
    tipText.textContent = `${weapon.desc} / 배치한 칸을 누르면 강화`;
    battleButton.disabled = mode !== 'prep' || gameOver || !running;
    weaponCards.forEach(card => card.classList.toggle('active', card.dataset.weapon === selected));
    speedButtons.forEach(button => cardToggle(button, Number(button.dataset.speed) === gameSpeed));
}

function cardToggle(button, active) {
    button.classList.toggle('active', active);
}

function draw() {
    ctx.clearRect(0, 0, w, h);
    drawBg();
    drawGrid();
    drawPandas();
    drawMonsters();
    drawBullets();
    drawEffects();
}

function drawBg() {
    if (images.bg.loaded) {
        ctx.drawImage(images.bg, 0, 0, w, h);
        ctx.fillStyle = 'rgba(255, 248, 220, 0.08)';
        ctx.fillRect(0, uiHeight, w, h - uiHeight);
    } else {
        ctx.fillStyle = '#487a39';
        ctx.fillRect(0, 0, w, h);
    }
}

function drawGrid() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cw = cellW(r);
            const x = rowX(r) + c * cw;
            const y = gridY + r * cellH;
            ctx.fillStyle = (r + c) % 2 ? 'rgba(30, 69, 43, 0.22)' : 'rgba(44, 91, 55, 0.28)';
            round(x + 4, y + 4, cw - 8, cellH - 8, 8, true);
            ctx.strokeStyle = 'rgba(237, 224, 174, 0.22)';
            round(x + 4, y + 4, cw - 8, cellH - 8, 8, false);
        }
    }
}

function drawPandas() {
    [...pandas].sort((a, b) => a.y - b.y).forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y + Math.sin(performance.now() * 0.004 + p.col) * 2);
        drawPandaImage(p);
        if (p.type === 'gun') drawGun(p);
        if (p.type === 'sword') drawSword(p);
        if (p.type === 'shield') drawShield(p);
        ctx.restore();
        // 커진 유닛 머리 위에 HP 바가 오도록 위치 조정
        drawHp(p.x - 34, p.y - 72, 68, p.hp / p.maxHp);
    });
}

function drawPandaImage(panda) {
    if (images.panda.loaded) {
        const size = panda.type === 'shield' ? 112 : 102;
        // 발 쪽이 셀 바닥에 가깝게 보이도록 세로 오프셋 조정
        ctx.drawImage(images.panda, -size / 2, -size / 2 - 18, size, size * 1.28);
        return;
    }
    ctx.fillStyle = '#d86d3b';
    ctx.beginPath();
    ctx.arc(0, -10, 28, 0, Math.PI * 2);
    ctx.fill();
}

function drawGun(p) {
    const fireWindow = Math.max(80, (p.cool || 900) * 0.15);
    const kick = p.wait > (p.cool || 900) - fireWindow ? -6 : 0;
    ctx.fillStyle = '#15191f';
    round(26 + kick, -46, 68, 12, 5, true);
    ctx.fillStyle = '#3a424c';
    round(28 + kick, -48, 14, 6, 2, true);
    ctx.fillStyle = '#795a35';
    round(30 + kick, -34, 13, 20, 3, true);
}

function drawSword(p) {
    ctx.save();
    ctx.translate(28, -29);
    ctx.rotate(-0.95 - p.anim * 1.25);
    ctx.fillStyle = '#eef5ff';
    round(-3, -54, 7, 56, 3, true);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    round(-1, -52, 3, 40, 2, true);
    ctx.fillStyle = '#c9a227';
    round(-11, -2, 22, 6, 2, true);
    ctx.fillStyle = '#5a4030';
    round(-3, 3, 7, 16, 2, true);
    ctx.fillStyle = '#c9a227';
    round(-4, 18, 9, 7, 3, true);
    ctx.restore();
}

function drawShield(p) {
    const hp = p.hp / p.maxHp;
    // 몸 앞·오른쪽을 가리는 방패
    ctx.fillStyle = '#3e4b55';
    round(18, -40, 44, 72, 11, true);
    ctx.fillStyle = '#8caa64';
    round(24, -32, 32, 56, 9, true);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    round(28, -28, 10, 48, 4, true);
    if (hp < 0.7) crack(36, -18);
    if (hp < 0.45) crack(48, 4);
    if (hp < 0.25) crack(32, 16);
}

function crack(x, y) {
    ctx.strokeStyle = '#1f272c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y + 6);
    ctx.lineTo(x - 2, y + 13);
    ctx.lineTo(x + 6, y + 19);
    ctx.stroke();
}

function drawMonsters() {
    monsters.forEach(m => {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.anim * 0.15);
        if (images.monster.loaded) {
            const size = m.hard ? 96 : 82;
            ctx.drawImage(images.monster, -size / 2, -size / 2 - 18, size * 0.62, size * 1.35);
        } else {
            ctx.fillStyle = '#5c4638';
            ctx.beginPath();
            ctx.ellipse(0, 8, 26, 38, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        drawHp(m.x - 30, m.y - 58, 58, m.hp / m.maxHp);
    });
}

function drawBullets() {
    bullets.forEach(b => {
        ctx.fillStyle = '#ffe07a';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawEffects() {
    effects.forEach(e => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, e.life / 700);
        if (e.type === 'coin') {
            ctx.fillStyle = '#ffd15a';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(e.text, e.x, e.y);
        } else {
            ctx.strokeStyle = e.type === 'slash' ? '#ddebff' : '#ffe07a';
            ctx.lineWidth = e.type === 'slash' ? 6 : 3;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.type === 'slash' ? 34 : 18, -1.2, 0.9);
            ctx.stroke();
        }
        ctx.restore();
    });
}

function drawHp(x, y, width, pct) {
    const p = Math.max(0, Math.min(1, Number.isFinite(pct) ? pct : 0));
    const barW = Math.max(0, width);
    if (barW <= 0) return;
    ctx.fillStyle = 'rgba(30, 20, 20, 0.75)';
    round(x, y, barW, 7, 4, true);
    const fillW = barW * p;
    if (fillW > 0) {
        ctx.fillStyle = p > 0.55 ? '#6fe06f' : p > 0.28 ? '#ffd15a' : '#ff655c';
        round(x, y, fillW, 7, 4, true);
    }
}

function round(x, y, width, height, radius, fill) {
    if (width <= 0 || height <= 0) return;
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    if (fill) ctx.fill();
    else ctx.stroke();
}

window.DefenseGame = {
    start: startGame,
    stop: stopGame,
};
