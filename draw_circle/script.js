/**
 * Constants & Elements
 */
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const btnReset = document.getElementById('btnReset');
const btnDraw = document.getElementById('btnDraw');
const codeEditor = document.getElementById('codeEditor');
const codeOutput = document.getElementById('codeOutput');
const lineNumbers = document.getElementById('lineNumbers');

// 초기 코드 값
const INITIAL_CODE = `draw_circle(
  Vector2(0, 0),
  60,
  Color.aqua
)`;

/**
 * Domain: Canvas Drawing Logic (Mock API)
 * 사용자가 작성한 코드에서 호출할 수 있는 함수와 객체들을 정의합니다.
 */

// 캔버스 중심을 (0,0)으로 맞추기 위한 오프셋
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;

// Color 객체 정의
const Color = {
    aqua: '#00ffff',
    red: '#ff5555',
    green: '#50fa7b',
    blue: '#8be9fd',
    white: '#f8f8f2',
    black: '#000000'
};

// Vector2 함수 (객체 반환)
function Vector2(x, y) {
    return { x, y };
}

// 실제 원을 그리는 함수
function draw_circle(position, radius, color) {
    ctx.beginPath();
    // 사용자의 (0,0)은 캔버스 중앙 (CENTER_X, CENTER_Y)
    // Y축은 캔버스에서 아래가 양수이므로 그대로 더함
    const drawX = CENTER_X + position.x;
    const drawY = CENTER_Y + position.y; // 캔버스 좌표계: 아래쪽이 +Y

    ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

// 캔버스 초기화 함수
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Code Execution Logic
 * 문자열로 된 코드를 파싱하여 실행합니다.
 */
function runCode() {
    const userCode = codeEditor.value;

    // 사용자가 작성한 코드 실행을 위해 Function 생성자 사용
    // Scope Isolation: 정의된 API들만 인자로 넘겨주어 사용 가능하게 함
    try {
        // 'use strict' 모드로 실행
        const execute = new Function(
            'draw_circle', 'Vector2', 'Color', 
            `"use strict"; ${userCode}`
        );
        
        execute(draw_circle, Vector2, Color);
        
    } catch (e) {
        console.error("Code Execution Error:", e);
        alert("코드에 오류가 있습니다: " + e.message);
    }
}

/**
 * Editor UI Logic
 * 신택스 하이라이팅 및 줄 번호 처리
 */
function updateEditorDisplay() {
    const text = codeEditor.value;
    
    // 1. Syntax Highlighting (Regex)
    // HTML 엔티티 이스케이프
    let formatted = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // 함수/클래스 (draw_circle, Vector2 등): 파란색
    formatted = formatted.replace(/\b(draw_circle|Vector2)\b/g, '<span class="token-func">$1</span>');
    
    // 숫자: 주황색
    formatted = formatted.replace(/\b(\d+)\b/g, '<span class="token-num">$1</span>');

    // Color.속성: 붉은색/분홍색 (단순화를 위해 Color.xxx 전체 매칭 시도)
    formatted = formatted.replace(/(Color\.\w+)/g, '<span class="token-prop">$1</span>');

    // 마지막 문자 처리를 위해 공백 추가 (줄바꿈 시 레이아웃 깨짐 방지)
    if (text[text.length-1] === "\n") {
        formatted += " "; 
    }

    codeOutput.innerHTML = formatted;

    // 2. Line Numbers
    const lines = text.split('\n').length;
    lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => i + 1).join('<br>');
}

// 스크롤 동기화 (Textarea 스크롤 시 하이라이팅 Pre도 같이 이동)
function syncScroll() {
    const pre = document.getElementById('codeHighlighting');
    pre.scrollTop = codeEditor.scrollTop;
    pre.scrollLeft = codeEditor.scrollLeft;
}

/**
 * Event Listeners
 */
function init() {
    // 초기값 설정
    codeEditor.value = INITIAL_CODE;
    updateEditorDisplay();

    // 에디터 입력 이벤트
    codeEditor.addEventListener('input', updateEditorDisplay);
    codeEditor.addEventListener('scroll', syncScroll);

    // 버튼 이벤트
    btnReset.addEventListener('click', clearCanvas);
    btnDraw.addEventListener('click', runCode);
}

// 앱 시작
init();