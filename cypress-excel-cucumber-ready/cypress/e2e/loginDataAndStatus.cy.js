
describe("Data-driven login tests with status update", () => {
  it("reads login tests and updates Status after attempting login", () => {
    const relativePath = "data/loginTests.xlsx";
    const sheetName = "Sheet1";

    cy.readLoginData(relativePath, sheetName).then((rows) => {
      expect(rows.length).to.be.greaterThan(0);

      rows.forEach(({ Username, Password, Status }) => {
        cy.visit("/login");
        cy.get('input[name="email"]').should("be.visible").clear().type(Username, { log: true });
        cy.get('input[name="pass"]').should("be.visible").clear().type(Password, { log: true });
        cy.get('button[name="login"]').click();

        cy.url().then((urlAfter) => {
          cy.get("body").then(($body) => {
            const errorShown = $body.find("._9ay7, div[role='alert']").length > 0 || urlAfter.includes("login");
            const newStatus = errorShown ? "tested_error" : "tested_success";
            cy.updateLoginStatus(relativePath, sheetName, Username, newStatus);
            cy.log(`Updated ${Username} => ${newStatus}`);
          });
        });
      });
    });
  });
});
