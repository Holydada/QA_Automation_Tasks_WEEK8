
// cypress.config.js
const { defineConfig } = require("cypress");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

// ===== Helpers =====
function resolveFixture(...parts) {
  return path.join(process.cwd(), "cypress", "fixtures", ...parts);
}
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}
function writeSheetToWorkbook(filePath, sheetName, jsonRows) {
  let wb;
  if (fs.existsSync(filePath)) {
    wb = XLSX.readFile(filePath);
  } else {
    wb = XLSX.utils.book_new();
  }
  const ws = XLSX.utils.json_to_sheet(jsonRows);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filePath);
}
function readSheetAsJson(filePath, sheetName) {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[sheetName || wb.SheetNames[0]];
  if (!ws) throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);
  return XLSX.utils.sheet_to_json(ws, { defval: "" });
}
function updateCellByAddress(filePath, sheetName, cellAddress, value) {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[sheetName || wb.SheetNames[0]];
  if (!ws) throw new Error(`Sheet "${sheetName}" not found`);
  ws[cellAddress] = { t: "s", v: value };
  if (ws["!ref"]) {
    const range = XLSX.utils.decode_range(ws["!ref"]);
    const addr = XLSX.utils.decode_cell(cellAddress);
    range.s.c = Math.min(range.s.c, addr.c);
    range.s.r = Math.min(range.s.r, addr.r);
    range.e.c = Math.max(range.e.c, addr.c);
    range.e.r = Math.max(range.e.r, addr.r);
    ws["!ref"] = XLSX.utils.encode_range(range);
  }
  XLSX.writeFile(wb, filePath);
}
function updateRowByKey(filePath, sheetName, keyColumn, keyValue, targetColumn, newValue) {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[sheetName || wb.SheetNames[0]];
  if (!ws) throw new Error(`Sheet "${sheetName}" not found`);
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const header = rows[0];
  const keyIdx = header.indexOf(keyColumn);
  const targetIdx = header.indexOf(targetColumn);
  if (keyIdx === -1 || targetIdx === -1) {
    throw new Error(`Columns ${keyColumn} or ${targetColumn} not found`);
  }
  let updated = false;
  for (let r = 1; r < rows.length; r++) {
    if (String(rows[r][keyIdx]).trim() === String(keyValue).trim()) {
      rows[r][targetIdx] = newValue;
      updated = true;
      break;
    }
  }
  if (!updated) throw new Error(`Row with ${keyColumn}=${keyValue} not found`);
  const newWs = XLSX.utils.aoa_to_sheet(rows);
  ws = newWs;
  const sheetIndex = XLSX.utils.book_new();
  // Replace sheet directly
  const wb2 = XLSX.readFile(filePath);
  wb2.Sheets[sheetName] = newWs;
  XLSX.writeFile(wb2, filePath);
}

// ===== Auto-create sample files when needed =====
function ensureTestDataXlsx() {
  const file = resolveFixture("data", "testData.xlsx");
  ensureDir(path.dirname(file));
  if (!fs.existsSync(file)) {
    writeSheetToWorkbook(file, "Sheet1", [
      { username: "User1", Password: "password123" },
      { username: "admin", Password: "adminPass" },
    ]);
  }
}
function ensureEmployeeInfoXlsx() {
  const file = resolveFixture("data", "employeeInfo.xlsx");
  ensureDir(path.dirname(file));
  if (!fs.existsSync(file)) {
    writeSheetToWorkbook(file, "Sheet1", [
      { EmployeeID: 1, Name: "Zelalem", Department: "HR", Salary: 5000 },
      { EmployeeID: 2, Name: "Temesgen", Department: "IT", Salary: 7000 },
      { EmployeeID: 3, Name: "Hana", Department: "Finance", Salary: 6000 },
    ]);
  }
}
function ensureMultiDataXlsx() {
  const file = resolveFixture("data", "multiData.xlsx");
  ensureDir(path.dirname(file));
  if (!fs.existsSync(file)) {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
      { Username: "userA", Password: "passA" },
      { Username: "userB", Password: "passB" },
    ]), "LoginData");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
      { EmployeeID: 101, Name: "Alice", Department: "HR", Salary: 60000 },
      { EmployeeID: 102, Name: "Bob", Department: "IT", Salary: 75000 },
    ]), "EmployeeInfo");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
      { EmployeeID: 101, Salary: 60000 },
      { EmployeeID: 102, Salary: 75000 },
    ]), "SalaryInfo");
    XLSX.writeFile(wb, file);
  }
}
function ensureLoginTestsXlsx() {
  const file = resolveFixture("data", "loginTests.xlsx");
  ensureDir(path.dirname(file));
  if (!fs.existsSync(file)) {
    writeSheetToWorkbook(file, "Sheet1", [
      { Username: "Hageru", Password: "Test@123", Status: "pending" },
      { Username: "Roman",  Password: "Test@1245", Status: "activate" },
      { Username: "Danial", Password: "pass@123", Status: "suspended" },
    ]);
  }
}
function ensureEmployeesXlsx() {
  const file = resolveFixture("data", "employees.xlsx");
  ensureDir(path.dirname(file));
  if (!fs.existsSync(file)) {
    writeSheetToWorkbook(file, "AllEmployees", [
      { EmployeeID: 101, Name: "Zeleke",  Department: "HR",      Salary: 5000 },
      { EmployeeID: 102, Name: "Aster",   Department: "IT",      Salary: 7000 },
      { EmployeeID: 103, Name: "Mulusew", Department: "Finance", Salary: 6000 },
      { EmployeeID: 104, Name: "Brhanu",  Department: "IT",      Salary: 8000 },
      { EmployeeID: 105, Name: "Amare",   Department: "HR",      Salary: 5500 },
    ]);
  }
}

async function addCucumberPlugin(on, config) {
  const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
  const createEsbuildPlugin = require("@bahmutov/cypress-esbuild-preprocessor");
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  on("file:preprocessor", createEsbuildPlugin.default(config));
  return config;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.facebook.com",
    chromeWebSecurity: false,
    specPattern: ["cypress/e2e/**/*.cy.js", "cypress/e2e/**/*.feature"],
    async setupNodeEvents(on, config) {
      // Cucumber plugin
      config = await addCucumberPlugin(on, config);

      // ===== Tasks =====
      on("task", {
        // 1) Read Excel
        readExcelFile({ relativePath, sheetName }) {
          const file = resolveFixture(relativePath);
          if (relativePath.includes("testData.xlsx")) ensureTestDataXlsx();
          if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);
          const rows = readSheetAsJson(file, sheetName);
          return rows;
        },

        // 2) Write Employee Data to Excel
        writeEmployeesToExcel({ relativePath, sheetName, data }) {
          const file = resolveFixture(relativePath);
          ensureDir(path.dirname(file));
          writeSheetToWorkbook(file, sheetName, data);
          return true;
        },

        // 3) Update specific cell by address
        updateExcelCell({ relativePath, sheetName, cell, value }) {
          const file = resolveFixture(relativePath);
          ensureEmployeeInfoXlsx();
          updateCellByAddress(file, sheetName, cell, value);
          return true;
        },

        // 4) Read multiple sheets
        readMultipleSheets({ relativePath, sheets }) {
          const file = resolveFixture(relativePath);
          ensureMultiDataXlsx();
          const wb = XLSX.readFile(file);
          const result = {};
          sheets.forEach((name) => {
            const ws = wb.Sheets[name];
            result[name] = ws ? XLSX.utils.sheet_to_json(ws, { defval: "" }) : [];
          });
          return result;
        },

        // 5a) Read login data
        readLoginData({ relativePath, sheetName }) {
          const file = resolveFixture(relativePath);
          ensureLoginTestsXlsx();
          const rows = readSheetAsJson(file, sheetName);
          return rows;
        },
        // 5b) Update login status for a specific Username
        updateLoginStatus({ relativePath, sheetName, username, newStatus }) {
          const file = resolveFixture(relativePath);
          ensureLoginTestsXlsx();
          updateRowByKey(file, sheetName, "Username", username, "Status", newStatus);
          return true;
        },

        // 7) Filter employees by department and write to a new sheet
        filterEmployeesByDepartment({ department }) {
          const file = resolveFixture("data", "employees.xlsx");
          ensureEmployeesXlsx();
          const wb = XLSX.readFile(file);
          const ws = wb.Sheets["AllEmployees"];
          const all = XLSX.utils.sheet_to_json(ws, { defval: "" });
          const filtered = all.filter((r) => String(r.Department).toLowerCase() === String(department).toLowerCase());
          const newSheetName = `Filtered_${department}`;
          const newWs = XLSX.utils.json_to_sheet(filtered);
          XLSX.utils.book_append_sheet(wb, newWs, newSheetName);
          XLSX.writeFile(wb, file);
          return { count: filtered.length, sheet: newSheetName };
        },
      });

      return config;
    },
  },
});
