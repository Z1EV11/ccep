/*
  读取评估表格 .xls, .xlsx
*/
function readCCEPXlsx(filePath) {
    const sheets = xlsx.parse("filePath");
    return xlsxData;
  }
  
  /*
    生成评估报告 .doc, .docx
  */
function generateCCEPDocx(filePath, data) {

}

module.exports = {
    readCCEPXlsx,
    generateCCEPDocx
};