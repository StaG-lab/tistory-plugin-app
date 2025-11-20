function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var data = {};

  // 1번 행부터 데이터 순회
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var id = row[0].toString();   // ID 컬럼
    var lang = row[1].toString(); // Lang 컬럼 (ko, en)
    
    if (!data[id]) {
      data[id] = {};
    }

    var obj = {};
    // 나머지 컬럼 매핑 (C열부터 시작)
    for (var j = 2; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    
    // 공통 UI 라벨 (필요하다면 시트에 추가하거나, 코드상에서 병합)
    // 시트에 컬럼이 있다면 그대로 사용됩니다.
    
    data[id][lang] = obj;
  }

  // JSON 반환
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}