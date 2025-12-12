# Cypress + Excel (SheetJS) + Cucumber (Badeball) — Ready Project

## Setup
```bash
npm install
```

## Run
```bash
npx cypress open
```
Select the specs or the feature file to run.

This project includes:
- Excel read/write/update/filter tasks using `xlsx` (SheetJS).
- Custom Cypress commands wrapping tasks.
- Data-driven tests including Facebook login UI checks.
- Cucumber BDD with a `login.feature` and step definitions.

## Specs
- `readExcelTest.cy.js`
- `writeEmployeeData.cy.js`
- `updateSpecificCell.cy.js`
- `multipleSheets.cy.js`
- `loginDataAndStatus.cy.js`
- `filterEmployees.cy.js`
- Features: `features/login.feature` with steps in `stepDefinitions/login_steps.js`

## Notes
- Facebook login uses public selectors and does **not** attempt real authentication; it detects UI error or redirect and updates status in Excel.
- Fixture Excel files are auto-created by tasks if missing.

