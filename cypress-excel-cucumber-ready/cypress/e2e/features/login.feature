
Feature: Facebook Login
  As a user
  I want to login to Facebook
  So that I can access my account

  Background:
    Given I am on the Facebook login page

  @smoke
  Scenario Outline: Attempt login with various credentials
    When I enter username "<username>" and password "<password>"
    And I click the login button
    Then I should see either an error or a redirect

    Examples:
      | username | password |
      | userA    | passA    |
      | userB    | passB    |
