/**
 * Quiz Application Logic
 * Supports: i18n (lang), Deep linking (id), Iframe Resizing
 */

const UI_TEXT = {
    ko: {
        pageTitle: "코딩 퀴즈",
        submitBtn: "제출하기",
        alertSelect: "답을 선택해주세요!",
        loading: "문제를 불러오는 중...",
        error: "오류가 발생했습니다.",
        notFound: "해당 번호의 문제를 찾을 수 없습니다."
    },
    en: {
        pageTitle: "Coding Quiz",
        submitBtn: "Submit Answer",
        alertSelect: "Please select an answer!",
        loading: "Loading question...",
        error: "An error occurred.",
        notFound: "Question not found."
    }
};

class QuizApp {
    constructor(dataUrl) {
        this.dataUrl = dataUrl;
        
        // URL 파라미터 파싱
        const urlParams = new URLSearchParams(window.location.search);
        this.lang = urlParams.get('lang') === 'en' ? 'en' : 'ko';
        // id 파라미터 가져오기 (없으면 null)
        this.targetId = urlParams.get('id'); 
        
        this.currentQuiz = null;
        this.quizData = [];
        
        // DOM Elements
        this.uiTitle = document.querySelector('.quiz-title');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.submitBtn = document.getElementById('submitBtn');
        this.result = document.getElementById('result');
        this.resultTitle = document.getElementById('resultTitle');
        this.resultBody = document.getElementById('resultBody');
        this.quizForm = document.getElementById('quizForm');

        this.init();
    }

    async init() {
        this.setStaticUI();
        try {
            await this.fetchQuestions();
            
            // 문제 선택 로직
            if (this.targetId) {
                // ID는 문자열/숫자 혼용 가능성이 있으므로 문자열로 변환하여 비교
                this.currentQuiz = this.quizData.find(q => String(q.id) === String(this.targetId));
            } else {
                // ID가 없으면 첫 번째 문제 선택
                this.currentQuiz = this.quizData[0];
            }

            if (this.currentQuiz) {
                this.renderQuestion();
                this.addEventListeners();
            } else {
                this.questionText.textContent = UI_TEXT[this.lang].notFound;
                this.submitBtn.disabled = true;
            }
            
        } catch (error) {
            console.error('Failed to initialize quiz:', error);
            this.questionText.textContent = UI_TEXT[this.lang].error;
        }
    }

    setStaticUI() {
        const text = UI_TEXT[this.lang];
        this.uiTitle.textContent = text.pageTitle;
        this.submitBtn.textContent = text.submitBtn;
        this.questionText.textContent = text.loading;
    }

    async fetchQuestions() {
        const response = await fetch(this.dataUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.quizData = await response.json();
    }

    renderQuestion() {
        // 질문 렌더링
        this.questionText.textContent = this.currentQuiz.question[this.lang];

        // 옵션 렌더링
        this.optionsContainer.innerHTML = '';
        this.currentQuiz.options.forEach(opt => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.dataset.value = opt.id;

            const input = document.createElement('input');
            input.type = 'radio';
            input.id = `option${opt.id}`;
            input.name = 'answer';
            input.value = opt.id;

            const label = document.createElement('label');
            label.htmlFor = `option${opt.id}`;
            label.textContent = opt.text[this.lang];

            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            
            optionDiv.addEventListener('click', () => this.handleOptionSelection(optionDiv, input));

            this.optionsContainer.appendChild(optionDiv);
        });
    }

    handleOptionSelection(selectedDiv, radioInput) {
        radioInput.checked = true;
        const allOptions = this.optionsContainer.querySelectorAll('.option');
        allOptions.forEach(opt => opt.classList.remove('selected'));
        selectedDiv.classList.add('selected');
    }

    addEventListeners() {
        this.quizForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');

        if (!selectedAnswer) {
            alert(UI_TEXT[this.lang].alertSelect);
            return;
        }

        if (selectedAnswer.value === this.currentQuiz.correctAnswerId) {
            this.showSuccess(this.currentQuiz.explanation);
        } else {
            this.showError();
        }
    }

    showSuccess(explanation) {
        this.resultTitle.textContent = explanation.title[this.lang];
        this.resultBody.innerHTML = explanation.content[this.lang]
            .map(text => `<p>${text}</p>`)
            .join('');
            
        this.result.classList.add('show');
        this.submitBtn.disabled = true;
        
        const options = this.optionsContainer.querySelectorAll('.option');
        options.forEach(opt => {
            opt.style.pointerEvents = 'none';
            opt.style.opacity = '0.6';
        });
    }

    showError() {
        const options = this.optionsContainer.querySelectorAll('.option');
        options.forEach(opt => opt.classList.add('shake'));

        setTimeout(() => {
            options.forEach(opt => opt.classList.remove('shake'));
            const selectedAnswer = document.querySelector('input[name="answer"]:checked');
            if(selectedAnswer) selectedAnswer.checked = false;
            options.forEach(opt => opt.classList.remove('selected'));
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 복사한 구글 앱스 스크립트 URL을 여기에 붙여넣으세요.
    const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbyyZpnuKiizseaH7LxMyyGN4_S-lVygVbtHltWh-r23t81wV5lRkRWKLxNXdMCAMUor/exec';
    new QuizApp(SHEET_API_URL);
});