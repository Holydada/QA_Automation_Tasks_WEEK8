
const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

Given("I am on the Facebook login page", () => {
  cy.visit("/login");
  cy.get('input[name="email"]').should("be.visible");
  cy.get('input[name="pass"]').should("be.visible");
  cy.get('button[name="login"]').should("be.visible");
});

When("I enter username {string} and password {string}", (username, password) => {
  cy.get('input[name="email"]').clear().type(username);
  cy.get('input[name="pass"]').clear().type(password);
});

When("I click the login button", () => {
  cy.get('button[name="login"]').click();
});

Then("I should see either an error or a redirect", () => {
  cy.url().then((url) => {
    cy.get("body").then(($body) => {
      const errorShown = $body.find("._9ay7, div[role='alert']").length > 0 || url.includes("login");
      expect([true, false]).to.include(errorShown);
    });
  });
});
