describe("Fluentify | Email Campaign Tests", () => {
  const BASE = "https://fluentify-rho.vercel.app";

  const ADMIN_EMAIL = "prathamlakhani.synapse@gmail.com";
  const ADMIN_PASSWORD = "Pratham@911";

  beforeEach(() => {
    // Login as admin via login page (same pattern as User Analytics)
    cy.visit(`${BASE}/login`);

    cy.get("select").select("Admin");
    cy.get('input[placeholder="you@example.com"]').type(ADMIN_EMAIL);
    cy.get('input[placeholder="Enter your password"]').type(ADMIN_PASSWORD);
    cy.contains("Sign In").click();

    // Land on admin dashboard
    cy.url().should("include", "/admin-dashboard");

    // Navigate to Email Campaign from dashboard sidebar
    cy.contains("button", "Email Campaign").click();
    cy.url().should("include", "/admin/email-campaign");

    // Ensure the Email Campaign header is visible
    cy.contains("h1", "Email Campaign").should("be.visible");
  });

  it("Should navigate back to admin dashboard when clicking header back button", () => {
    // We are already on /admin/email-campaign from beforeEach
    cy.url().should("include", "/admin/email-campaign");

    // Click the back arrow button in the Email Campaign header
    cy.get("header button").first().click();

    // Should navigate back to admin dashboard home
    cy.url().should("include", "/admin-dashboard");
    cy.contains("h1", "Admin Dashboard").should("be.visible");
  });

  it("Should export learners CSV and show success banner that can be closed", () => {
    // Intercept the CSV export request and return a small CSV blob
    cy.intercept("GET", "**/api/admin/email-campaign/export-csv", (req) => {
      req.reply((res) => {
        res.send({
          statusCode: 200,
          headers: {
            "content-type": "text/csv",
          },
          body: "id,name,email\n1,Test User,test@example.com",
        });
      });
    }).as("exportCsv");

    // Click Export CSV
    cy.contains("button", "Export CSV").click();

    // Wait for the export call to complete
    cy.wait("@exportCsv");

    // Success banner should appear with exact text from EmailCampaignPage
    cy.contains("Learners exported successfully!").should("be.visible");

    // Close the success banner using the × button
    cy.contains("Learners exported successfully!")
      .parent() // p
      .parent() // div.flex-1
      .parent() // outer success container
      .within(() => {
        cy.contains("button", "×").click();
      });

    // Banner should be gone
    cy.contains("Learners exported successfully!").should("not.exist");
  });

  it("Should send email campaign after confirmation and show success banner that can be closed", () => {
    // Stub window.confirm to simulate user clicking OK
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true).as("confirmStub");
    });

    // Intercept the trigger email campaign request
    cy.intercept("POST", "**/api/admin/email-campaign/trigger", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          learnerCount: 10,
          updatedRows: 10,
        },
      },
    }).as("triggerCampaign");

    // Click Send Email
    cy.contains("button", "Send Email").click();

    // Confirm dialog should have been shown
    cy.get("@confirmStub").should("have.been.calledOnce");

    // Wait for the trigger API call
    cy.wait("@triggerCampaign");

    // Success message should begin with the text defined in EmailCampaignPage
    cy.contains(
      "✅ Successfully appended 10 learners to Google Sheet! (10 rows updated) N8N workflow triggered."
    ).should("be.visible");

    // Close the success banner via the × button
    cy.contains(
      "✅ Successfully appended 10 learners to Google Sheet! (10 rows updated) N8N workflow triggered."
    )
      .parent() // p
      .parent() // div.flex-1
      .parent() // outer success container
      .within(() => {
        cy.contains("button", "×").click();
      });

    // Banner should disappear
    cy.contains(
      "✅ Successfully appended 10 learners to Google Sheet! (10 rows updated) N8N workflow triggered."
    ).should("not.exist");
  });
});

