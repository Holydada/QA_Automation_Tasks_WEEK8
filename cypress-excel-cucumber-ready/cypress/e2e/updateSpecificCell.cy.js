
describe("Update a specific cell in employeeInfo.xlsx", () => {
  it("updates D3 to 7500", () => {
    cy.updateExcelCell("data/employeeInfo.xlsx", "Sheet1", "D3", 7500).then(() => {
      cy.readExcel("data/employeeInfo.xlsx", "Sheet1").then((rows) => {
        const temesgen = rows.find((r) => r.Name === "Temesgen");
        expect(temesgen).to.exist;
        expect(temesgen.Salary).to.equal(7500);
      });
    });
  });
});
