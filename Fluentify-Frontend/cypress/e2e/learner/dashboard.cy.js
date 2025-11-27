describe("Fluentify Dashboard Tests", () => {

  const EMAIL = "jenish.vasani08@gmail.com";
  const PASSWORD = "Jenish@1234_";

  // ---------------------------
  // LOGIN BEFORE EACH TEST
  // ---------------------------
  beforeEach(() => {
    cy.visit("/login");

    cy.get('input[placeholder="you@example.com"]', { timeout: 8000 })
      .should("be.visible")
      .type(EMAIL);

    cy.get('input[placeholder="Enter your password"]')
      .should("be.visible")
      .type(PASSWORD);

    cy.contains("Sign In").click();

    cy.url().should("include", "/dashboard");
  });

  // ---------------------------
  // 1. DASHBOARD UI LOAD
  // ---------------------------
  it("Should load dashboard UI correctly", () => {
    cy.contains("Welcome").should("be.visible");
    cy.contains("Your Courses").should("be.visible");
    cy.contains("My Progress").should("be.visible");
    cy.contains("Talk with AI").should("be.visible");

    cy.get('button[aria-label="Open navigation menu"]').should("be.visible");
    cy.get('button[aria-label="Open settings"]').should("be.visible");
  });

  // ---------------------------
  // 2. SETTINGS MENU
  // ---------------------------
  it("Should open settings menu with Profile + Logout options", () => {
    cy.get('button[aria-label="Open settings"]').click();

    cy.contains("Profile").should("be.visible");
    cy.contains("Logout").should("be.visible");
  });

  it("Should navigate to Profile page from settings", () => {
    cy.get('button[aria-label="Open settings"]').click();
    cy.contains("Profile").click();
    cy.url().should("include", "/profile");
  });

  it("Should logout from settings menu", () => {
    cy.get('button[aria-label="Open settings"]').click();
    cy.contains("Logout").click();

    cy.url().should("include", "/login");
  });

  // ---------------------------
  // 3. SIDEBAR NAVIGATION
  // ---------------------------
  it("Should open sidebar and navigate using sidebar links", () => {
    cy.get('button[aria-label="Open navigation menu"]').click();

    cy.contains("Modules").click();
    cy.url().should("include", "/language-modules");

    cy.visit("/dashboard");
    cy.get('button[aria-label="Open navigation menu"]').click();

    cy.contains("Contests").click();
    cy.url().should("include", "/contests");

    cy.visit("/dashboard");
    cy.get('button[aria-label="Open navigation menu"]').click();

    cy.contains("Progress").click();
    cy.url().should("include", "/progress");

    cy.visit("/dashboard");
    cy.get('button[aria-label="Open navigation menu"]').click();

    cy.contains("Profile").click();
    cy.url().should("include", "/profile");

    cy.visit("/dashboard");
    cy.get('button[aria-label="Open navigation menu"]').click();

    cy.contains("Logout").click();
    cy.url().should("include", "/login");
  });

  // ---------------------------
  // 4. VIEW FULL REPORT → /progress
  // ---------------------------
  it("Should navigate to Progress page when clicking View Full Report", () => {
    cy.contains("View Full Report").scrollIntoView().click({ force: true });
    cy.url().should("include", "/progress");
  });

  // ---------------------------
  // 5. AI VOICE CALL MODAL
  // ---------------------------
  it("Should open Voice Call AI modal", () => {
    cy.contains("Start Voice Call")
      .scrollIntoView()
      .click({ force: true });

    cy.contains("AI Tutor").should("be.visible");
    cy.contains("Start Call").should("be.visible");
  });

  // ---------------------------
  // 6. CREATE NEW COURSE FORM
  // ---------------------------
  it("Should open Generate New Course form", () => {
    cy.contains("Create new course")
      .scrollIntoView()
      .click({ force: true });

    cy.contains("Generate New Course").should("be.visible");
    cy.contains("Choose Your Language").should("be.visible");
    cy.contains("Current Expertise").should("be.visible");
    cy.contains("Target Duration").should("be.visible");
  });

  // ---------------------------
  // 7. COURSE CARDS EXIST & OPEN
  // ---------------------------
  it("Should display existing course cards", () => {
    cy.contains("Your Courses").scrollIntoView().should("be.visible");
    cy.get("div")
      .filter((i, el) => el.innerText.match(/Learning Journey|Start Course|Continue Learning/i))
      .should("have.length.at.least", 1);
  });


  it("Should open a course when clicking its card", () => {
    // Click the first course card's CTA button
    cy.contains(/Start Course|Continue Learning/i)
      .first()
      .scrollIntoView()
      .click({ force: true });

    // URL should now contain /course/<id>
    cy.url().should("match", /\/course\/\d+$/);
  });


  // ---------------------------
  // 8. FLOATING CHAT WIDGET
  // ---------------------------
  it("Should open floating chat widget", () => {
    // find the bottom-right floating widget button
    cy.get("button")
      .filter((i, el) => el.className.includes("fixed"))
      .click({ force: true });

    cy.contains("AI Tutor").should("be.visible");
  });


});
