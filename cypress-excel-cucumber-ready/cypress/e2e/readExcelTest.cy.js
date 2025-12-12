
describe("Read Excel data via cy.readExcel", () => {
  it("reads testData.xlsx and logs each row", () => {
    cy.readExcel("data/testData.xlsx", "Sheet1").then((rows) => {
      expect(rows.length).to.be.greaterThan(0);
      rows.forEach((row) => {
        cy.log(`username=${row.username}, password=${row.Password}`);
        console.log(row);
      });
    });
  });
});
