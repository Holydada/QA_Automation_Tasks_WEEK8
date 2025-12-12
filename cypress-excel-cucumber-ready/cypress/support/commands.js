
// cypress/support/commands.js

// 1) Read Excel
Cypress.Commands.add("readExcel", (relativePath = "data/testData.xlsx", sheetName = "Sheet1") => {
  return cy.task("readExcelFile", { relativePath, sheetName });
});

// 2) Write Employee Data
Cypress.Commands.add("writeEmployeesToExcel", (relativePath, sheetName, data) => {
  return cy.task("writeEmployeesToExcel", { relativePath, sheetName, data });
});

// 3) Update a specific cell
Cypress.Commands.add("updateExcelCell", (relativePath, sheetName, cell, value) => {
  return cy.task("updateExcelCell", { relativePath, sheetName, cell, value });
});

// 4) Read multiple sheets
Cypress.Commands.add("readSheets", (relativePath, sheets) => {
  return cy.task("readMultipleSheets", { relativePath, sheets });
});

// 5) Login data + update status
Cypress.Commands.add("readLoginData", (relativePath = "data/loginTests.xlsx", sheetName = "Sheet1") => {
  return cy.task("readLoginData", { relativePath, sheetName });
});
Cypress.Commands.add("updateLoginStatus", (relativePath, sheetName, username, newStatus) => {
  return cy.task("updateLoginStatus", { relativePath, sheetName, username, newStatus });
});

// 7) Filter employees by department
Cypress.Commands.add("filterDepartment", (department = "IT") => {
  return cy.task("filterEmployeesByDepartment", { department });
});
