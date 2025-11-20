/* coding_script.js */

/**
 * CONFIGURATION
 */
const API_URL = "https://script.google.com/macros/s/AKfycbwncHoEB3fddqLW5Ac6T465-BHHODvBBISSDZqobvCzFRywIUDdTRi2O21A4-N8mj0Q/exec"; 

const DEFAULT_DATA = {
    "1": {
        ko: {
            headerTitle: "1. 첫 번째 에러 수정하기",
            panelTitle: "첫 번째 에러 수정하기",
            labelGoals: "목표",
            goalsContent: `<p>이 코드는 잘못되었으며 실행 시 에러가 발생합니다.</p><p class="mt-2">코드는 <code>this_code_is_wrong</code>이라는 빈 함수를 정의합니다.</p><p class="mt-2">작동하려면 함수는 <code>return</code> 키워드를 사용해야 합니다. 하지만 현재 이 키워드는 주석 안에 있어 컴퓨터가 무시합니다.</p><p class="mt-2">현재 코드를 <i>Run</i> 버튼을 눌러 테스트해보세요.</p><p class="mt-2">그 후, 주석 기호(#)를 제거하여 코드를 올바르게 만드세요.</p>`,
            labelHints: "힌트",
            hintsContent: "주석 기호(#)를 제거하세요.",
            labelChecks: "체크리스트",
            checksContent: "에러가 수정되었습니까?",
            btnList: "연습 목록 열기",
            btnRun: "실행",
            btnReset: "초기화",
            btnSolution: "정답",
            btnOutput: "출력",
            txtSuggested: "제안된 정답",
            btnUseSolution: "정답 사용",
            errTitle: "들여쓰기 블록이 예상됩니다...",
            whyHappens: "왜 이런 일이 발생하나요",
            errDesc1: "코드의 들여쓰기(줄 시작 부분의 탭 문자 수)가 잘못되었습니다.",
            errDesc2: "탭이 하나 이상 누락되었거나 너무 많이 삽입되었습니다.",
            howFix: "이것을 고치는 방법",
            howFixContent: "에러가 발생한 코드 라인이 콜론(:)으로 끝나는 라인(예: 함수 정의) 바로 다음에 있다면, 이전 라인보다 들여쓰기 레벨을 하나 더 추가해야 합니다.<br><br>즉, 해당 라인은 함수 정의 부분보다 탭 문자가 하나 더 앞에 있어야 합니다.",
            extraTitle: "외부 에러는 어디서 오나요?",
            extraDesc: "이 코스의 레슨은 당신이 <b>중요한 부분</b>만 수정하도록 설계되었습니다. 하지만 프로젝트를 실행하게 하는 보이지 않는 코드가 훨씬 많습니다.",
            successTitle: "잘 했습니다!",
            successMsg: "연습을 완료했습니다. <br><b>머무르며</b> 더 둘러보거나, <br><b>계속</b> 진행하세요.",
            initialCode: "func this_code_is_wrong():\n    #return",
            solutionCode: "func this_code_is_wrong():\n    return"
        },
        en: {
            headerTitle: "1. Fix Your First Error",
            panelTitle: "Fix Your First Error",
            labelGoals: "GOALS",
            goalsContent: `<p>This code is incorrect and will cause an error when you try to run it.</p><p class="mt-2">The code defines an empty function named <code>this_code_is_wrong</code>.</p><p class="mt-2">To work, the function should use the <code>return</code> keyword. But this keyword is currently inside a comment, which the computer ignores.</p><p class="mt-2">Test the current code by pressing the <i>Run</i> button.</p><p class="mt-2">Then, remove the comment sign (#) to make the code valid.</p>`,
            labelHints: "HINTS",
            hintsContent: "Remove the # sign.",
            labelChecks: "CHECKS",
            checksContent: "Is the error fixed?",
            btnList: "Open Practice List",
            btnRun: "Run",
            btnReset: "Reset",
            btnSolution: "Solution",
            btnOutput: "Output",
            txtSuggested: "Suggested Solution",
            btnUseSolution: "Use Solution",
            errTitle: "Indented block expected...",
            whyHappens: "Why this happens",
            errDesc1: "The indentation of your code (number of tab characters at the start of the line) is incorrect.",
            errDesc2: "You are missing one or more tabs, or you inserted too many.",
            howFix: "How to fix this",
            howFixContent: "If the line of code with the error is right after a line ending with a colon, like a function definition, you need one extra indent level compared to the previous line.<br><br>In other words, your line should have one more leading tab character than the function definition.",
            extraTitle: "Where do external errors come from?",
            extraDesc: "Lessons in this course are designed so you only need to edit the <b>important bits</b>. But there is much more code outside of what you see that makes the project run.",
            successTitle: "Well done!",
            successMsg: "You completed the practice.<br><span class='text-white font-bold'>Stay</span> and play around,<br>or <span class='text-white font-bold'>continue</span> the course.",
            initialCode: "func this_code_is_wrong():\n    #return",
            solutionCode: "func this_code_is_wrong():\n    return"
        }
    }
};

class CodingApp {
    constructor() {
        this.state = {
            currentId: "1",
            currentLang: 'ko',
            data: {}
        };
        
        this.elements = this.cacheElements();
        this.init();
    }

    cacheElements() {
        // Helper to get elements by ID
        const get = (id) => document.getElementById(id);
        const query = (sel) => document.querySelector(sel);

        return {
            headerTitle: get('header-title'),
            panelTitle: get('panel-title'),
            labelGoals: get('label-goals'),
            goalsContent: get('goals-content'),
            labelHints: get('label-hints'),
            hintsContent: get('hints-content'),
            labelChecks: get('label-checks'),
            checksContent: get('checks-content'),
            btnList: get('btn-practice-list'),
            btnRunText: query('#btn-run span'),
            btnResetText: query('#btn-reset span'),
            btnSolutionText: query('#btn-solution span'),
            btnOutputText: query('#btn-output span'),
            
            // Popups & Overlays
            txtSuggested: get('txt-suggested-solution'),
            btnUseSolution: get('btn-use-solution'),
            
            txtErrTitle: get('txt-err-title'),
            txtWhyHappens: get('txt-why-happens'),
            txtErrDesc1: get('txt-err-desc1'),
            txtErrDesc2: get('txt-err-desc2'),
            txtHowFix: get('txt-how-fix'),
            howFixContent: get('how-fix-content'), // New
            
            txtExtraTitle: get('txt-extra-title'),
            txtExtraDesc: get('txt-extra-desc'),
            txtSuccessTitle: get('txt-success-title'),
            txtSuccessMsg: get('txt-success-msg'),
            
            codeEditor: get('code-editor'),
            mainLayout: get('main-layout'),
            goalsPanel: get('goals-panel'),
            languageDropdown: get('language-dropdown')
        };
    }

    async init() {
        // 1. Get URL Params
        const urlParams = new URLSearchParams(window.location.search);
        this.state.currentId = urlParams.get('id') || "1";
        this.state.currentLang = urlParams.get('lang') || "ko"; // Default lang

        // 2. Fetch Data
        await this.fetchData();

        // 3. Bind Events
        this.bindEvents();

        // 4. Initial Render
        this.updateUI();
        this.resetCode(); // Set initial code
    }

    async fetchData() {
        try {
            const response = await fetch(`${API_URL}?id=${this.state.currentId}`);
            const json = await response.json();
            
            // Check if data exists for this ID, otherwise fallback
            if (json && json[this.state.currentId]) {
                this.state.data = json;
            } else {
                console.warn("ID not found in API, using Mock Data");
                this.state.data = DEFAULT_DATA;
            }
        } catch (error) {
            console.error("Fetch failed, using default data:", error);
            this.state.data = DEFAULT_DATA;
        }
    }

    bindEvents() {
        // Language Menu
        document.getElementById('btn-settings').onclick = (e) => {
            e.stopPropagation();
            this.elements.languageDropdown.classList.toggle('hidden');
        };
        window.onclick = (e) => {
            if (!this.elements.languageDropdown.classList.contains('hidden') && 
                !document.getElementById('btn-settings').contains(e.target)) {
                this.elements.languageDropdown.classList.add('hidden');
            }
        };

        // Actions
        window.setLanguage = (lang) => this.setLanguage(lang);
        window.toggleAccordion = (cId, chId) => this.toggleAccordion(cId, chId);
        window.toggleExpand = () => this.toggleExpand();
        window.runCode = () => this.runCode();
        window.resetCode = () => this.resetCode();
        window.toggleSolution = () => this.toggleSolution();
        window.applySolution = () => this.applySolution();
        window.toggleOutput = () => this.toggleOutput();
        window.showErrorExplain = () => this.showPopup('popup-explain');
        window.showExtraInfo = () => this.showPopup('popup-extra');
        window.hidePopup = (id) => this.hidePopup(id);
        
        // Fullscreen
        document.getElementById('btn-fullscreen').onclick = () => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen();
            else document.exitFullscreen();
        };
	
	//Tab Key
	this.elements.codeEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault(); // 포커스 이동 방지
                
                const start = this.elements.codeEditor.selectionStart;
                const end = this.elements.codeEditor.selectionEnd;

                // 탭 문자 삽입
                this.elements.codeEditor.value = 
                    this.elements.codeEditor.value.substring(0, start) + 
                    "\t" + 
                    this.elements.codeEditor.value.substring(end);

                // 커서 위치 조정
                this.elements.codeEditor.selectionStart = 
                this.elements.codeEditor.selectionEnd = start + 1;
            }
        });
    }

    updateUI() {
        const data = this.state.data[this.state.currentId][this.state.currentLang];
        if (!data) return;

        const setText = (el, text) => { if(el) el.textContent = text; };
        const setHTML = (el, html) => { if(el) el.innerHTML = html; };

        setText(this.elements.headerTitle, data.headerTitle);
        setText(this.elements.panelTitle, data.panelTitle);
        
        setText(this.elements.labelGoals, data.labelGoals);
        setHTML(this.elements.goalsContent, data.goalsContent);
        
        setText(this.elements.labelHints, data.labelHints);
        setText(this.elements.hintsContent, data.hintsContent);
        
        setText(this.elements.labelChecks, data.labelChecks);
        setText(this.elements.checksContent, data.checksContent);
        
        setText(this.elements.btnList, data.btnList);
        setText(this.elements.btnRunText, data.btnRun);
        setText(this.elements.btnResetText, data.btnReset);
        setText(this.elements.btnSolutionText, data.btnSolution);
        setText(this.elements.btnOutputText, data.btnOutput);
        
        setText(this.elements.txtSuggested, data.txtSuggested);
        setText(this.elements.btnUseSolution, data.btnUseSolution);
        
        setText(this.elements.txtErrTitle, data.errTitle);
        setText(this.elements.txtWhyHappens, data.whyHappens);
        setText(this.elements.txtErrDesc1, data.errDesc1);
        setText(this.elements.txtErrDesc2, data.errDesc2);
        setText(this.elements.txtHowFix, data.howFix);
        setHTML(this.elements.howFixContent, data.howFixContent); // New Content
        
        setText(this.elements.txtExtraTitle, data.extraTitle);
        setHTML(this.elements.txtExtraDesc, data.extraDesc);
        
        setText(this.elements.txtSuccessTitle, data.successTitle);
        setHTML(this.elements.txtSuccessMsg, data.successMsg);
    }

    setLanguage(lang) {
        this.state.currentLang = lang;
        this.updateUI();
        this.elements.languageDropdown.classList.add('hidden');
    }

    toggleAccordion(contentId, chevronId) {
        const content = document.getElementById(contentId);
        const chevron = document.getElementById(chevronId);
        
        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            chevron.classList.remove('collapsed');
        } else {
            content.classList.add('collapsed');
            chevron.classList.add('collapsed');
        }
    }

    toggleExpand() {
        const container = this.elements.mainLayout;
        const expandBtn = document.querySelector('#btn-expand i');

        if (container.classList.contains('expanded')) {
            container.classList.remove('expanded');
            expandBtn.className = 'fas fa-expand-alt';
            setTimeout(() => { this.elements.goalsPanel.style.opacity = 1; }, 100);
        } else {
            container.classList.add('expanded');
            expandBtn.className = 'fas fa-compress-alt';
            this.elements.goalsPanel.style.opacity = 0;
        }
    }

    toggleOutput() {
        const panel = document.getElementById('output-panel');
        const btn = document.getElementById('btn-output');
        const isHidden = panel.style.height === '0px' || panel.classList.contains('hidden');
        
        if (isHidden) {
            panel.style.height = '33%';
            panel.classList.remove('hidden');
            btn.classList.add('ring-2', 'ring-cyan-400');
        } else {
            panel.style.height = '0px';
            panel.classList.add('hidden');
            btn.classList.remove('ring-2', 'ring-cyan-400');
        }
    }

    formatCode(text) {
        if (!text) return "";
        return text
            .replace(/\\n/g, '\n') // 문자열 "\n" -> 줄바꿈
            .replace(/\\t/g, '\t'); // 문자열 "\t" -> 탭 문자
    }

    normalizeCode(code) {
        if (!code) return "";
        return code
            // 연속된 4개의 공백을 탭 하나로 치환
            .replace(/    /g, '\t') 
            // 앞뒤 공백 제거
            .trim();
    }

    toggleSolution() {
        document.getElementById('solution-overlay').classList.toggle('hidden');
    }

    applySolution() {
        const data = this.state.data[this.state.currentId][this.state.currentLang];
        this.elements.codeEditor.value = this.formatCode(data.solutionCode);
        this.toggleSolution();
    }

    resetCode() {
        // Check if data loaded, else safe default
        const data = this.state.data[this.state.currentId]?.[this.state.currentLang] || DEFAULT_DATA["1"].ko;
        this.elements.codeEditor.value = this.formatCode(data.initialCode);
        
        document.getElementById('output-empty').classList.remove('hidden');
        document.getElementById('output-error').classList.add('hidden');
        document.getElementById('output-success').classList.add('hidden');
        document.getElementById('visual-success-overlay').classList.add('hidden');
        document.getElementById('visual-success-overlay').classList.remove('flex');
    }

    runCode() {
        // 1. 사용자 입력 코드 가져오기
        const rawUserCode = this.elements.codeEditor.value;
        
        // 2. 정답 데이터 가져오기
        const data = this.state.data[this.state.currentId][this.state.currentLang];
        
        // 안전장치: 데이터가 로드되지 않았을 경우
        if (!data || !data.solutionCode) {
            console.error("Solution code not found.");
            return;
        }

        // 3. 정답 코드 포맷팅 (\n, \t 변환)
        const rawSolutionCode = this.formatCode(data.solutionCode);

        // 4. [중요] 사용자 코드와 정답 코드를 모두 '정규화'하여 비교
        // 사용자가 스페이스 4번을 썼든, 탭을 썼든 모두 '\t'로 통일된 상태에서 비교함
        const userCodeNormalized = this.normalizeCode(rawUserCode);
        const solutionCodeNormalized = this.normalizeCode(rawSolutionCode);

        // 5. UI 준비
        const outputPanel = document.getElementById('output-panel');
        if (outputPanel.classList.contains('hidden')) this.toggleOutput();
        document.getElementById('output-empty').classList.add('hidden');

        // 6. 비교 수행
        if (userCodeNormalized === solutionCodeNormalized) {
            // === [정답 성공] ===
            document.getElementById('output-error').classList.add('hidden');
            document.getElementById('output-success').classList.remove('hidden');
            
            const visual = document.getElementById('visual-success-overlay');
            visual.classList.remove('hidden');
            visual.classList.add('flex', 'fade-in');
            
            setTimeout(() => {
                this.showPopup('popup-success');
            }, 800);

        } else {
            // === [오답/에러] ===
            document.getElementById('output-success').classList.add('hidden');
            document.getElementById('output-error').classList.remove('hidden');
            
            document.getElementById('visual-success-overlay').classList.add('hidden');
            document.getElementById('visual-success-overlay').classList.remove('flex');
            
            // 디버깅용: 무엇이 다른지 콘솔에서 확인 가능
            //console.log("--- Comparison Failed ---");
            //console.log("User (Norm):", JSON.stringify(userCodeNormalized));
            //console.log("Sol  (Norm):", JSON.stringify(solutionCodeNormalized));
        }
    }

    showPopup(id) {
        const popup = document.getElementById(id);
        popup.classList.remove('hidden');
        popup.classList.add('flex');
    }

    hidePopup(id) {
        const popup = document.getElementById(id);
        popup.classList.add('hidden');
        popup.classList.remove('flex');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CodingApp();
});