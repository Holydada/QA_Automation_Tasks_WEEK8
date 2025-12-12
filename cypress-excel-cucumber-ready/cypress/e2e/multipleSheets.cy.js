
describe("Load data from multiple sheets", () => {
  it("reads LoginData, EmployeeInfo, SalaryInfo and displays them", () => {
    cy.readSheets("data/multiData.xlsx", ["LoginData", "EmployeeInfo", "SalaryInfo"]).then((result) => {
      cy.log(`LoginData rows: ${result.LoginData.length}`);
      cy.log(`EmployeeInfo rows: ${result.EmployeeInfo.length}`);
      cy.log(`SalaryInfo rows: ${result.SalaryInfo.length}`);
      console.table(result.LoginData);
      console.table(result.EmployeeInfo);
      console.table(result.SalaryInfo);
      expect(result.EmployeeInfo.length).to.be.greaterThan(0);
    });
  });
});
