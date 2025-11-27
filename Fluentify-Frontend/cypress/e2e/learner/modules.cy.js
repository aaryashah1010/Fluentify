describe("Fluentify | Language Modules Page Tests", () => {
  const BASE = "https://fluentify-rho.vercel.app";

  // ---------------------------------------------------------
  // LOGIN BEFORE EACH TEST
  // ---------------------------------------------------------
  beforeEach(() => {
    cy.visit(`${BASE}/login`);

    cy.get('input[placeholder="you@example.com"]').type("jenish.vasani08@gmail.com");
    cy.get('input[placeholder="Enter your password"]').type("Jenish@1234_");

    cy.contains("Sign In").click();
    cy.url().should("include", "/dashboard");

    // Navigate using sidebar
    cy.get('button[aria-label="Open navigation menu"]').click();

    cy.contains("Modules").click();

    cy.url().should("include", "/language-modules");
    cy.contains("Language Modules").should("be.visible");
  });

  // -------------------------------------------------------------------
  // 1. PAGE LOAD TEST
  // -------------------------------------------------------------------
  it("Should load the Language Modules page UI correctly", () => {
    cy.contains("Language Modules").should("be.visible");
    cy.contains("Explore our curated collection").should("be.visible");

    // Back button
    cy.contains("Back to Dashboard").should("be.visible");
  });

  // -------------------------------------------------------------------
  // 2. BACK TO DASHBOARD
  // -------------------------------------------------------------------
  it("Should navigate back to Dashboard when clicking Back to Dashboard", () => {
    cy.contains("Back to Dashboard").click();
    cy.url().should("include", "/dashboard");
  });

  // -------------------------------------------------------------------
  // 3. MODULE CARDS SHOULD RENDER
  // -------------------------------------------------------------------
  it("Should render at least one language module card", () => {
    cy.get(".grid .rounded-2xl").its("length").should("be.gte", 1);

    // Any card must have:
    // - language name
    // - flag emoji
    // - course count
    // - instructor-led label
    cy.contains("Instructor Led").should("be.visible");
  });

  // -------------------------------------------------------------------
  // 5. NAVIGATE INTO A SPECIFIC LANGUAGE MODULE
  // -------------------------------------------------------------------
  it("Should navigate into a selected language module page", () => {
    // Find first available language name from card
    cy.get(".grid .rounded-2xl").first().within(() => {
      cy.get("h3").invoke("text").then((languageName) => {
        const normalized = languageName.trim();

        cy.wrap(Cypress.$(document)).contains(normalized).click({ force: true });

        cy.url().should("include", `/language-modules/${normalized}`);

        // Title check
        cy.contains(normalized).should("be.visible");
      });
    });
  });

  // -------------------------------------------------------------------
  // 6. LOADING STATE CHECK
  // -------------------------------------------------------------------
  it("Should show loader when modules are loading", () => {

    cy.intercept("GET", "**/published-languages", (req) => {
      req.on("response", (res) => {
        res.setDelay(2000); // simulate loading
      });
    }).as("mockSlow");

    cy.visit(`${BASE}/language-modules`);

    cy.contains("Loading language modules...", { timeout: 200 }).should("be.visible");
  });

});
