function doGet() {
  // 시트 이름이 정확한지 반드시 확인하세요.
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('시트1'); 
  
  // 데이터 범위 가져오기
  const rows = sheet.getDataRange().getValues();
  const data = rows.slice(1); // 헤더(1행) 제거

  // 고정된 컬럼의 개수 (A~H열 = 8개)
  // 이 뒤로부터는 옵션 데이터로 간주합니다.
  const FIXED_COL_COUNT = 8;

  const jsonArray = data.map(row => {
    // ID가 없으면 빈 행으로 간주하고 패스
    if(row[0] === '') return null;

    // 1. 기본 문제 정보 파싱 (고정 컬럼)
    const quizItem = {
      id: row[0],                    // A열
      question: {
        ko: row[1],                  // B열
        en: row[2]                   // C열
      },
      correctAnswerId: String(row[3]), // D열
      explanation: {
        title: {
          ko: row[4],                // E열
          en: row[5]                 // F열
        },
        content: {
          // 줄바꿈 문자를 기준으로 배열로 변환
          ko: row[6] ? String(row[6]).split('\n') : [], // G열
          en: row[7] ? String(row[7]).split('\n') : []  // H열
        }
      },
      options: [] // 옵션 배열 초기화
    };

    // 2. 옵션 데이터 동적 파싱 (가변 컬럼)
    // FIXED_COL_COUNT(8)부터 시작해서 3칸씩(ID, KO, EN) 이동하며 확인
    for (let i = FIXED_COL_COUNT; i < row.length; i += 3) {
      const optId = row[i];
      const optKo = row[i+1];
      const optEn = row[i+2];

      // 옵션 ID가 존재할 때만 옵션으로 추가 (비어있으면 무시)
      if (optId !== "" && optId !== undefined) {
        quizItem.options.push({
          id: String(optId),
          text: {
            ko: optKo,
            en: optEn
          }
        });
      }
    }

    return quizItem;
  }).filter(item => item !== null); // null 값 제거

  // JSON 결과 반환
  return ContentService.createTextOutput(JSON.stringify(jsonArray))
    .setMimeType(ContentService.MimeType.JSON);
}