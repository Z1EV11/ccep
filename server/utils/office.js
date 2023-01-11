const fs = require("fs");

const xlsx = require("node-xlsx");
const easy_template = require("easy-template-x");
const { param } = require("../routes/ccep");

/*
  读取评估表格 .xls, .xlsx
*/
function readEvalXlsx(filePath, params) {
  var sheets = xlsx.parse(filePath);
  var data = sheets2data(sheets, params);
  return data;
}

function heandleNumber(data) {
  let num = Number(data);
  num = Math.ceil(num*100)/100
  return num
}

function sheets2data(sheets, params) {
  var basicInfo = {};
  var assessTable = [];
  var nesma = {};
  var price2Table = [];
  for(let i=0; i<sheets.length-1; i++) {
    if(i == 4) {
      continue;
    }
    let sheetData = sheets[i].data;
    if(i == 0){
      basicInfo.id = params.prjID;
      basicInfo.client = params.prjClient;
      basicInfo.project = params.prjName;
      basicInfo.expert1 = params.evalExpert;
      basicInfo.document = sheetData[4][1];
      continue;
    }
    if(i == 1) {
      nesma.sys_factor = sheetData[1][1];
      nesma.change_factor = sheetData[2][1];
      nesma.type_factor = sheetData[3][1];
      nesma.quality_factor = sheetData[4][1];
      nesma.field_factor = sheetData[5][1];
      nesma.lang_factor = sheetData[6][1];
      nesma.exp_factor = sheetData[7][1];
      nesma.unit_price = sheetData[9][1];
      nesma.UFP = sheetData[13][1]; // [!!!] decimal point
      nesma.S = sheetData[13][2];   // [!!!]
      nesma.price2 = heandleNumber(sheetData[13][5]);
      nesma.prod_rate0 = sheetData[13][3];
      nesma.prod_rate = sheetData[14][3];
      nesma.prod_rate1 = sheetData[15][3];
      nesma.workload0 = heandleNumber(sheetData[13][4]);
      nesma.workload = heandleNumber(sheetData[14][4]);
      nesma.workload1 = heandleNumber(sheetData[15][4]);
      nesma.price0 = heandleNumber(sheetData[13][6]);
      nesma.price = heandleNumber(sheetData[14][6]);
      nesma.price1 = heandleNumber(sheetData[15][6]);
      continue;
    }
    if(params.evalMehod === 'NESMA_IND' && i == 2) {
      for(let j=3; j<sheetData.length-1; j++) {
        assessTable.push({
          FP_id: sheetData[j][0],
          sub_sys: sheetData[j][1],
          module: sheetData[j][2],
          FP_item: sheetData[j][3],
          FP_type: sheetData[j][4],
          FP_val: sheetData[j][5],
          FP_remark: sheetData[j][6]
        });
      }
      continue;
    }
    if(params.evalMehod === 'NESMA_EVAL' && i == 3) {
      for(let j=3; j<sheetData.length-1; j++) {
        assessTable.push({
          FP_id: sheetData[j][0],
          sub_sys: sheetData[j][1],
          module: sheetData[j][2],
          FP_item: sheetData[j][3],
          FP_type: sheetData[j][4],
          FP_val: sheetData[j][5],
          FP_remark: sheetData[j][6]
        });
      }
      continue;
    }
    if(i == 5) {
      for(let j=1; j<sheetData.length-1; j++) {
        price2Table.push({
          price2_type1: sheetData[j][0],
          price2_type2: sheetData[j][1],
          price2_unitprice: sheetData[j][2],
          price2_amount: sheetData[j][3],
          price2_price: sheetData[j][4],
          price2_remark: sheetData[j][5] || ''
        });
      }
      break;
    }
  }
  var date = new Date();
  var data = {
    Ch0_Ch3Sec4: [
      {
        id: basicInfo.id,
        client: basicInfo.client,
        project: basicInfo.project,
        expert1: basicInfo.expert1,
        expert2: basicInfo.expert2,
        year: date.getFullYear(),
        month: date.getMonth()+1,
        UFP: nesma.UFP,
        S: nesma.S,
        workload0: nesma.workload0,
        workload: nesma.workload,
        workload1: nesma.workload1,
        price0: nesma.price0,
        price: nesma.price,
        price1: nesma.price1,
        total_price0: nesma.price0, 
        total_price: nesma.price,
        total_price1: nesma.price1,
        document: basicInfo.document,
        sys_factor: nesma.sys_factor,
        change_factor: nesma.change_factor,
        prod_rate: nesma.prod_rate,
        field_factor: nesma.field_factor,
        type_factor: nesma.type_factor,
        quality_factor: nesma.quality_factor,
        lang_factor: nesma.lang_factor,
        exp_factor: nesma.exp_factor,
        unit_price: nesma.unit_price
      }
    ],
    assess_tab: assessTable,
    assess_tab1: [
      {
        UFP: nesma.UFP
      }
    ],
    Ch3Sec5: [
      {
        sys_factor: nesma.sys_factor,
        change_factor: nesma.change_factor,
        project: basicInfo.project,
        UFP: nesma.UFP,
        S: nesma.S,
        prod_rate0: nesma.prod_rate0,
        prod_rate: nesma.prod_rate,
        prod_rate1: nesma.prod_rate1,
        field_factor: nesma.field_factor,
        type_factor: nesma.type_factor,
        quality_factor: nesma.quality_factor,
        lang_factor: nesma.lang_factor,
        exp_factor: nesma.exp_factor,
        workload0: nesma.workload0,
        workload: nesma.workload,
        workload1: nesma.workload1,
        unit_price: nesma.unit_price,
        price0: nesma.price0,
        price: nesma.price,
        price1: nesma.price1,
        price2: nesma.price2, // non-labor cost
        total_price0: nesma.price0+nesma.price2, 
        total_price: nesma.price+nesma.price2,
        total_price1: nesma.price1+nesma.price2,
        price2Table
      }
    ]
  };
  return data
}

/*
  生成评估报告 .doc, .docx
*/
async function generateRptDocx(templatePath, filePath, data) {
  var TemplateHandler = easy_template.TemplateHandler;
  var templateFile = fs.readFileSync(templatePath);
  var handler = new TemplateHandler();
  var doc = await handler.process(templateFile, data);
  fs.writeFileSync(filePath, doc);
}

module.exports = {
  readEvalXlsx,
  generateRptDocx
};