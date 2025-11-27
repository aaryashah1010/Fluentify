describe("Fluentify | Progress Report Page Tests", () => {
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
    cy.contains("Progress").click();

    cy.url().should("include", "/progress");
    cy.contains("Your Progress Report").should("be.visible");
  });

  // -------------------------------------------------------------------
  // 1. PAGE LOAD TEST
  // -------------------------------------------------------------------
  it("Should load Progress Report page with stats cards", () => {
    cy.contains("Total XP").should("be.visible");
    cy.contains("Lessons Completed").should("be.visible");
    cy.contains("Current Streak").should("be.visible");
    cy.get("select").should("exist").and("be.visible");
  });

  // -------------------------------------------------------------------
  // 3. FILTER BUTTONS EXIST
  // -------------------------------------------------------------------
  it("Should show date filter buttons", () => {
    cy.contains("Last 7 Days").should("be.visible");
    cy.contains("Last 30 Days").should("be.visible");
    cy.contains("All Time").should("be.visible");
    cy.contains("Refresh").should("be.visible");
  });

  // -------------------------------------------------------------------
  // 4. SELECT A COURSE FROM DROPDOWN
  // -------------------------------------------------------------------
  it("Should switch courses using dropdown", () => {
    cy.get("select").select("Hindi - Hindi Learning Journey");
    cy.get("select").select("Spanish - Spanish Learning Journey");
  });

  // -------------------------------------------------------------------
  // 5. DATE FILTERS SHOULD UPDATE UI
  // -------------------------------------------------------------------
  it("Should change progress view on clicking date filters", () => {
    // Click Last 7 Days
    cy.contains("Last 7 Days").click();

    // Active button should have gradient background
    cy.contains("Last 7 Days")
      .should("have.class", "bg-gradient-to-r")
      .and("have.class", "text-white");

    // Inactive buttons should NOT have gradient
    cy.contains("Last 30 Days")
      .should("not.have.class", "bg-gradient-to-r");

    cy.contains("All Time")
      .should("not.have.class", "bg-gradient-to-r");

    // Click Last 30 Days
    cy.contains("Last 30 Days").click();

    // Now Last 30 Days becomes active
    cy.contains("Last 30 Days")
      .should("have.class", "bg-gradient-to-r")
      .and("have.class", "text-white");

    // Last 7 Days becomes inactive again
    cy.contains("Last 7 Days")
      .should("not.have.class", "bg-gradient-to-r");

    // Click All Time
    cy.contains("All Time").click();

    cy.contains("All Time")
      .should("have.class", "bg-gradient-to-r")
      .and("have.class", "text-white");
  });


  // -------------------------------------------------------------------
  // 6. LEARNING ACTIVITY CHART
  // -------------------------------------------------------------------
  it("Should display the Learning Activity chart", () => {
  cy.contains("Learning Activity").should("be.visible");

  // Wait for the Recharts wrapper div
  cy.get(".recharts-wrapper", { timeout: 8000 })
    .should("exist")
    .and("be.visible");

  // Ensure it contains an <svg> (the chart)
  cy.get(".recharts-wrapper svg")
    .should("exist")
    .and("be.visible");

  // Ensure at least one path exists → confirms chart lines/areas are drawn
  cy.get(".recharts-wrapper svg path").its("length").should("be.gte", 1);
  });

  // -------------------------------------------------------------------
  // 7. XP & STREAK SHOULD BE NUMBERS
  // -------------------------------------------------------------------
  it("Should show numeric XP and streak", () => {
  // Total XP numeric check
  cy.contains("Total XP")
    .parent()
    .find("p")
    .eq(1)
    .invoke("text")
    .should("match", /^\d+$/);

  // Current Streak check
  cy.contains("Current Streak")
    .parent()
    .find("p")
    .eq(1)
    .invoke("text")
    .should("contain", "days");
  });

  // -------------------------------------------------------------------
  // 8. FLUENCY SCORE TREND CHART
  // -------------------------------------------------------------------
  it("Should display the Fluency Score Trend chart", () => {
  cy.contains("Fluency Score Trend")
    .closest(".bg-slate-900\\/90")     // card wrapper
    .find("svg")                      // Recharts outputs SVG, not canvas
    .should("exist")
    .and("be.visible");
  });

  // -------------------------------------------------------------------
  // 9. CHECK IF STATS UPDATE ON REFRESH
  // -------------------------------------------------------------------
  it("Should refresh stats when clicking Refresh", () => {
    cy.contains("Refresh").click();
    cy.wait(1000); // Let API fetch
    cy.contains("Total XP").should("be.visible");
  });

  // -------------------------------------------------------------------
  // 10. RECENT ACTIVITY TABLE
  // -------------------------------------------------------------------
  it("Should show recent activity with at least 1 completed lesson", () => {
    cy.contains("Recent Activity").should("be.visible");

    cy.get("table tbody tr").its("length").should("be.gte", 1);
  });

  // -------------------------------------------------------------------
  // 11. BACK NAVIGATION
  // -------------------------------------------------------------------
  it("Should navigate back to dashboard using Back button", () => {
    cy.contains("Back to Dashboard").click();

    cy.url().should("include", "/dashboard");
  });

});