describe("Fluentify | Profile Page Tests", () => {

  const BASE = "https://fluentify-rho.vercel.app";

  // ---------------------------------------------------------
  // LOGIN BEFORE TESTS
  // ---------------------------------------------------------
  beforeEach(() => {
    cy.visit(`${BASE}/login`);

    cy.get('input[placeholder="you@example.com"]').type("jenish.vasani08@gmail.com");
    cy.get('input[placeholder="Enter your password"]').type("Jenish@1234_");

    cy.contains("Sign In").click();
    cy.url().should("include", "/dashboard");

    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.contains("Profile").click();

    cy.url().should("include", "/profile");
    cy.contains("Statistics").should("be.visible");
  });

  // ---------------------------------------------------------
  // 1. PAGE LOAD
  // ---------------------------------------------------------
  it("Should load Profile page with basic stats", () => {
    cy.contains("Statistics").should("be.visible");
    cy.contains("Courses").should("be.visible");
    cy.contains("Lessons Completed").should("be.visible");
    cy.get("h2").should("contain", "Jenish Vasani"); // username
  });

  // ---------------------------------------------------------
  // 2. VERIFY STATS ARE NUMERIC
  // ---------------------------------------------------------
  it("Should show numeric course count and lessons completed", () => {
    cy.contains("Courses")
      .parent()                 // first wrapper
      .parent()                 // the card wrapper div
      .find("p")
      .eq(1)                    // second p = numeric count
      .invoke("text")
      .should("match", /^\d+$/);

    cy.contains("Lessons Completed")
      .parent()
      .find("p")
      .eq(1)               // 🎯 ONLY the number text
      .invoke("text")
      .should("match", /^\d+$/);
  });

  // ---------------------------------------------------------
  // 3. DYNAMIC LANGUAGE LIST TEST
  // ---------------------------------------------------------
  it("Should list all learning languages dynamically", () => {
    cy.contains("Languages Learning").should("be.visible");

    cy.get(".Languages-learning-section, .space-y-4")
      .find("div")
      .its("length")
      .should("be.gte", 1); // ensure at least 1 language block exists
  });

  // ---------------------------------------------------------
  // 4. VERIFY EACH LANGUAGE BLOCK
  // ---------------------------------------------------------
  it("Should validate each language progress dynamically", () => {
    cy.get("body").then(($body) => {

      // Find all languages inside the section
      cy.contains("Languages Learning")
        .parent()
        .find("div.border, .rounded-xl")
        .each(($lang) => {

          const languageText = $lang.text().trim();
          cy.log("Detected Language Block: ", languageText);

          // 1. Should contain language name
          expect(languageText.length).to.be.greaterThan(0);

          // 2. Should contain learning journey text
          expect(languageText).to.match(/Learning Journey/);

          // 3. Should show a progress percentage (0% allowed)
          const percentageMatch = languageText.match(/\d+%/);
          expect(percentageMatch).to.not.be.null;

        });
    });
  });

  // ---------------------------------------------------------
  // 5. VERIFY EMAIL + MEMBER SINCE + VERIFIED
  // ---------------------------------------------------------
  it("Should show correct email and verification status", () => {
    cy.contains("Email Address").should("be.visible");
    cy.contains("Member Since").should("be.visible");
    cy.contains("Verified").should("be.visible");

    cy.contains("jenish.vasani08@gmail.com").should("be.visible");
  });

  // ---------------------------------------------------------
  // 6. EDIT BUTTON SHOULD EXIST
  // ---------------------------------------------------------
  it("Should show Edit button for username", () => {
    cy.contains("Edit").should("be.visible");
  });

  // ---------------------------------------------------------
  // 7. LOGOUT WORKS
  // ---------------------------------------------------------
  it("Should logout successfully", () => {
    cy.contains("Log Out", { timeout: 10000 })
    .scrollIntoView()
    .should("be.visible")
    .click();

    cy.url().should("include", "/login");
  });
});