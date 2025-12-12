
describe("Filter employees by department and save to new sheet", () => {
  it('filters "IT" department to Filtered_IT sheet', () => {
    cy.filterDepartment("IT").then(({ count, sheet }) => {
      cy.log(`Filtered rows: ${count}, written to sheet: ${sheet}`);
      expect(count).to.be.greaterThan(0);

      cy.readSheets("data/employees.xlsx", [sheet]).then((result) => {
        const rows = result[sheet];
        expect(rows.length).to.equal(count);
        rows.forEach((r) => expect(String(r.Department)).to.equal("IT"));
      });
    });
  });
});
