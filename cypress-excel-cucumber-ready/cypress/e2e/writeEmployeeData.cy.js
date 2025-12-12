
describe("Write employees to employeeData.xlsx", () => {
  it("writes JSON array to EmployeeDetails sheet", () => {
    const data = [
      { EmployeeID: 101, Name: "Alice",   Department: "HR",      Salary: 60000 },
      { EmployeeID: 102, Name: "Bob",     Department: "IT",      Salary: 75000 },
      { EmployeeID: 103, Name: "Charlie", Department: "Finance", Salary: 65000 },
    ];
    cy.writeEmployeesToExcel("data/employeeData.xlsx", "EmployeeDetails", data).then(() => {
      cy.readExcel("data/employeeData.xlsx", "EmployeeDetails").then((rows) => {
        expect(rows).to.have.length(3);
        expect(rows[1]).to.include({ Name: "Bob", Department: "IT" });
      });
    });
  });
});
