function doGet(e) {
  // 1. 활성화된 시트 가져오기
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // 2. 헤더와 데이터 분리
  const headers = data[0];
  const rows = data.slice(1);
  
  // 3. 배열을 JSON 객체 리스트로 변환
  const jsonArray = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  // 4. JSON 응답 반환 (CORS 문제 해결을 위해 JSONP 대신 순수 JSON 반환)
  return ContentService.createTextOutput(JSON.stringify(jsonArray))
    .setMimeType(ContentService.MimeType.JSON);
}