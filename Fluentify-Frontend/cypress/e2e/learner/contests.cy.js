describe("Fluentify | Contests Page Tests", () => {
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

    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.contains("Contests").click();

    cy.url().should("include", "/contests");
    cy.contains("Contests & Competitions").should("be.visible");
  });

  // ---------------------------------------------------------
  // 1. PAGE LOAD TEST
  // ---------------------------------------------------------
  it("Should load the Contests page UI correctly", () => {
    cy.contains("Contests & Competitions").should("be.visible");
    cy.contains("Available Contests").should("be.visible");

    cy.contains("Back to Dashboard").should("be.visible");
  });

  // ---------------------------------------------------------
  // 2. DISPLAY AVAILABLE CONTEST CARDS
  // ---------------------------------------------------------
  it("Should display available contest cards", () => {
    // Contest cards share: rounded-2xl + border-white/10
    cy.get("div.rounded-2xl.border-white\\/10")
      .should("have.length.gte", 1);

    cy.contains("Questions").should("exist");
    cy.contains("Participants").should("exist");
  });

  // ---------------------------------------------------------
  // 3. CHECK EACH CONTEST CARD STRUCTURE
  // ---------------------------------------------------------
  it("Should verify that contest cards contain title, status, and button", () => {
    cy.get('.bg-slate-900\\/80').each(($card) => {
      cy.wrap($card).within(() => {

        // TITLE CHECK
        cy.get("h3")
          .should("exist")
          .invoke("text")
          .should("match", /[A-Za-z]/);

        // STATUS CHECK
        cy.get(".flex.justify-between.items-start span")
          .invoke("text")
          .then((txt) => {
            const status = txt.trim().toUpperCase();
            expect(["PUBLISHED", "ENDED", "ACTIVE", "DRAFT"]).to.include(status);
          });

        // BUTTON CHECK (any valid CTA)
        cy.get("button")
          .should("exist")
          .invoke("text")
          .should("match", /(Coming Soon|View Results|Start Contest|View Leaderboard)/);

      });
    });
  });



  // ---------------------------------------------------------
  // 4. NAVIGATE TO A CONTEST (ENDED → View Results → Leaderboard)
  // ---------------------------------------------------------
  it("Should open ENDED contest → correct navigation → Leaderboard page", () => {
    
  // Get all ENDED contest cards
  cy.contains("ENDED")
    .parents(".bg-slate-900\\/80")
    .each(($card) => {
      const card = cy.wrap($card);

      // If the card has direct leaderboard button
      card.then(($el) => {
        if ($el.text().includes("View Leaderboard")) {

          // 📌 DIRECT LEADERBOARD PATH
          card.contains("View Leaderboard").click({ force: true });

          cy.url().should("include", "/leaderboard");
          cy.contains("Rankings").should("be.visible");

        } else if ($el.text().includes("View Results")) {

          // 📌 RESULTS → LEADERBOARD PATH
          card.contains("View Results").click({ force: true });

          // Now on result page
          cy.contains("Leaderboard").should("be.visible").click();

          cy.url().should("include", "/leaderboard");
          cy.contains("Rankings").should("be.visible");
        }
      });
    });
});

  // ---------------------------------------------------------
  // 5. NAVIGATE TO SUBMITTED CONTEST → RESULT PAGE
  // ---------------------------------------------------------
  it("Should open submitted contest → Result page", () => {
    cy.contains("View Results").first().click({ force: true });

    cy.url().should("include", "/result");

    cy.contains("Your Score").should("be.visible");
    cy.contains("Accuracy").should("be.visible");
    cy.contains("Question Review").should("be.visible");
  });

  // ---------------------------------------------------------
  // 6. NAVIGATE BACK USING BACK BUTTON
  // ---------------------------------------------------------
  it("Should navigate back to contests page using Back button in result/leaderboard", () => {
    cy.contains("View Results").first().click({ force: true });

    cy.contains("Back").click({ force: true });

    cy.url().should("include", "/contests");
  });

  // ---------------------------------------------------------
  // 7. LOADING STATE CHECK
  // ---------------------------------------------------------
  it("Should show loader when contest API is loading", () => {
    cy.intercept("GET", "**/published-contests", (req) => {
      req.on("response", (res) => {
        res.setDelay(2000); // simulate slow API
      });
    }).as("slowLoad");

    cy.visit(`${BASE}/contests`);

    cy.contains("Loading", { timeout: 300 }).should("be.visible");
  });
});
