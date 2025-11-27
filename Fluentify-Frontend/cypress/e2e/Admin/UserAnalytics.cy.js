describe("Fluentify | User Analytics Tests", () => {
  const BASE = "https://fluentify-rho.vercel.app";

  const ADMIN_EMAIL = "prathamlakhani.synapse@gmail.com";
  const ADMIN_PASSWORD = "Pratham@911";

  beforeEach(() => {
    // Login as admin via login page (same pattern as Module Management)
    cy.visit(`${BASE}/login`);

    cy.get("select").select("Admin");
    cy.get('input[placeholder="you@example.com"]').type(ADMIN_EMAIL);
    cy.get('input[placeholder="Enter your password"]').type(ADMIN_PASSWORD);
    cy.contains("Sign In").click();

    // Land on admin dashboard
    cy.url().should("include", "/admin-dashboard");

    // Navigate to User Analytics from dashboard sidebar
    cy.contains("button", "User Analytics").click();
    cy.url().should("include", "/admin/analytics");
  });

  it("Should load User Analytics page with charts visible", () => {
    // Header should show Platform Analytics
    cy.contains("h1", "Platform Analytics").should("be.visible");

    // Summary cards should be present
    cy.contains("Total Lessons").should("be.visible");
    cy.contains("Active Users").should("be.visible");

    // At least one chart section should be present (Popular Languages or Daily Activity)
    cy.contains("Popular Languages").should("exist");
  });

  it("Should navigate back to admin dashboard when clicking header back button", () => {
    // We are already on /admin/analytics from beforeEach
    cy.url().should("include", "/admin/analytics");

    // Click the back arrow button in the analytics header
    cy.get("header button").first().click();

    // Should navigate back to admin dashboard home
    cy.url().should("include", "/admin-dashboard");
    cy.contains("h1", "Admin Dashboard").should("be.visible");
  });

  it("Should show tooltip information when hovering over a chart", () => {
    // Ensure Popular Languages chart section is present
    cy.contains("h3", "Popular Languages").should("be.visible");

    // Hover over the first pie segment in the Popular Languages chart
    cy.contains("h3", "Popular Languages")
      .closest("div")
      .within(() => {
        cy.get("svg .recharts-sector")
          .first()
          .trigger("mouseover", { force: true });
      });

    // Tooltip from Recharts should appear with some content
    cy.get(".recharts-tooltip-wrapper")
      .should("be.visible")
      .first()
      .invoke("text")
      .should("not.be.empty");
  });
});

