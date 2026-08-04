const startScreen = document.getElementById('start_screen');
const gameplayScreen = document.getElementById('gameplay_screen');
const endingScreen = document.getElementById('ending_screen');
const endingSuccess = document.getElementById('ending_success');
const endingFailed = document.getElementById('ending_failed');
const endingSuccessText = document.getElementById('ending_success_text');
const endingFailedText = document.getElementById('ending_failed_text');
const startButton = document.getElementById('start_button');
const restartSuccess = document.getElementById('restart_success');
const restartFailed = document.getElementById('restart_failed');
const storyText = document.getElementById('story_text');
const storyHint = document.getElementById('story_hint');

const ENDING_SUCCESS =
    '';

const ENDING_FAILED =
    '.';

function showScreen(name) {
    startScreen.classList.toggle('hidden', name !== 'start');
    gameplayScreen.classList.toggle('hidden', name !== 'gameplay');
    endingScreen.classList.toggle('hidden', name !== 'ending');
}

function goStart() {
    if (window.DefenseGame) {
        window.DefenseGame.stop();
    }
    endingSuccess.classList.add('hidden');
    endingFailed.classList.add('hidden');
    if (window.Story) {
        window.Story.reset();
    }
    showScreen('start');
}

function goGameplay() {
    if (!window.DefenseGame) {
        console.error('DefenseGame 이 로드되지 않았습니다.');
        return;
    }
    endingSuccess.classList.add('hidden');
    endingFailed.classList.add('hidden');
    showScreen('gameplay');
    window.DefenseGame.start();
}

function goEnding(win) {
    if (window.DefenseGame) {
        window.DefenseGame.stop();
    }
    endingSuccess.classList.add('hidden');
    endingFailed.classList.add('hidden');
    if (win) {
        endingSuccessText.innerHTML = ENDING_SUCCESS;
        endingSuccess.classList.remove('hidden');
    } else {
        endingFailedText.innerHTML = ENDING_FAILED;
        endingFailed.classList.remove('hidden');
    }
    showScreen('ending');
}

// 스토리 모듈 연동 (story.js)
if (window.Story) {
    window.Story.init({
        textEl: storyText,
        hintEl: storyHint,
        buttonEl: startButton,
        onComplete: goGameplay,
    });
} else {
    console.error('Story 모듈(story.js)이 로드되지 않았습니다.');
    startButton.addEventListener('click', goGameplay);
}

restartSuccess.addEventListener('click', goStart);
restartFailed.addEventListener('click', goStart);

window.showEnding = goEnding;
showScreen('start');
