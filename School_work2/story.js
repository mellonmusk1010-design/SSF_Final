/*
TEAMLOG 스토리 모듈
- 스토리 텍스트 / 힌트 / 버튼 문구
- 페이지 넘김 및 완료 콜백
- app.js 와 연동: Story.init → Story.reset / 버튼 클릭
*/

const STORY_PAGES = [
    {
        text:
            '당신은 지금 학교 앞 방어선에 서 있습니다.<br>' +
            '5번의 습격을 모두 막아내면  아침이 옵니다.<br>' +
            '<br>' +
            '<strong>레서판다를 지키려면 버튼을 눌러주세요!</strong>',
        hint:
            '준비 시간에 유닛을 배치합니다.<br>' +
            '배치한 칸을 다시 누르면 강화됩니다.<br>' +
            '생명 3개 · 총 5 웨이브',
        button: '시작',
    },
];

const Story = (function () {
    let storyIndex = 0;
    let textEl = null;
    let hintEl = null;
    let buttonEl = null;
    let onComplete = null;

    function render() {
        const page = STORY_PAGES[storyIndex];
        if (!page || !textEl || !buttonEl) return;

        textEl.innerHTML = page.text;

        if (hintEl) {
            if (page.hint) {
                hintEl.innerHTML = page.hint;
                hintEl.classList.remove('hidden');
            } else {
                hintEl.innerHTML = '';
                hintEl.classList.add('hidden');
            }
        }

        buttonEl.textContent = page.button || '다음';
    }

    function next() {
        if (storyIndex < STORY_PAGES.length - 1) {
            storyIndex += 1;
            render();
            return false;
        }
        if (typeof onComplete === 'function') {
            onComplete();
        }
        return true;
    }

    function reset() {
        storyIndex = 0;
        render();
    }

    function onButtonClick() {
        next();
    }

    /**
     * @param {object} options
     * @param {HTMLElement} options.textEl   - 스토리 본문
     * @param {HTMLElement} [options.hintEl] - 힌트 영역
     * @param {HTMLElement} options.buttonEl - 다음/시작 버튼
     * @param {function} options.onComplete  - 마지막 페이지 후 호출 (게임 시작 등)
     */
    function init(options) {
        textEl = options.textEl;
        hintEl = options.hintEl || null;
        buttonEl = options.buttonEl;
        onComplete = options.onComplete || null;

        if (buttonEl) {
            buttonEl.removeEventListener('click', onButtonClick);
            buttonEl.addEventListener('click', onButtonClick);
        }

        reset();
    }

    function getIndex() {
        return storyIndex;
    }

    function getPageCount() {
        return STORY_PAGES.length;
    }

    return {
        init,
        reset,
        render,
        next,
        getIndex,
        getPageCount,
        pages: STORY_PAGES,
    };
})();

window.Story = Story;
