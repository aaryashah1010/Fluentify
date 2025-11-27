describe("Fluentify | Admin Profile Tests", () => {
  const BASE = "https://fluentify-rho.vercel.app";

  const ADMIN_EMAIL = "prathamlakhani.synapse@gmail.com";
  const ADMIN_PASSWORD = "Pratham@911";

  beforeEach(() => {
    // Login as admin via login page (same pattern as Email Campaign)
    cy.visit(`${BASE}/login`);

    cy.get("select").select("Admin");
    cy.get('input[placeholder="you@example.com"]').type(ADMIN_EMAIL);
    cy.get('input[placeholder="Enter your password"]').type(ADMIN_PASSWORD);
    cy.contains("Sign In").click();

    // Land on admin dashboard
    cy.url().should("include", "/admin-dashboard");

    // Navigate to Profile from dashboard sidebar
    cy.contains("button", "Profile").click();
    cy.url().should("include", "/admin/profile");

    // Ensure Profile header is visible
    cy.contains("h1", "My Profile").should("be.visible");
  });

  it("Should navigate back to admin dashboard when clicking header back button", () => {
    // We are already on /admin/profile from beforeEach
    cy.url().should("include", "/admin/profile");

    // Click the back arrow button in the Profile header
    cy.get("header button").first().click();

    // Should navigate back to admin dashboard home
    cy.url().should("include", "/admin-dashboard");
    cy.contains("h1", "Admin Dashboard").should("be.visible");
  });

  it("Should show name as read-only until Edit is clicked", () => {
    // Locate the Full Name field container
    cy.contains("label", "Full Name")
      .parent()
      .within(() => {
        // By default, there should be no editable input for name
        cy.get('input[name="name"]').should("not.exist");

        // Static name text should be visible
        cy.get("p").first().should("be.visible");

        // Edit button should be present
        cy.contains("button", "Edit").should("be.visible");
      });
  });

  it("Should allow editing name and saving updated information", () => {
    // Capture the current name
    cy.contains("label", "Full Name")
      .parent()
      .as("nameField");

    cy.get("@nameField")
      .find("p")
      .first()
      .invoke("text")
      .then((originalText) => {
        const originalName = originalText.trim();
        const newName =
          !originalName || originalName === "Not set"
            ? "Admin Test User"
            : `${originalName} Updated`;

        // Click Edit to enable editing
        cy.get("@nameField").within(() => {
          cy.contains("button", "Edit").click();
        });

        // Input should now be editable
        cy.get('input[name="name"]').should("be.visible").clear().type(newName);

        // Click Save button (inside the name field actions)
        cy.contains("button", "Save").click();

        // Wait for success message from UserProfile
        cy.contains("Profile updated successfully!", { timeout: 20000 }).should("be.visible");

        // After save, editing mode should exit and static text should show the new name
        cy.contains("label", "Full Name")
          .parent()
          .within(() => {
            cy.get('input[name="name"]').should("not.exist");
            cy.get("p").first().should("have.text", newName);
          });
      });
  });

  it("Should keep original name when editing is cancelled", () => {
    // Capture original name before editing
    cy.contains("label", "Full Name")
      .parent()
      .as("nameField");

    cy.get("@nameField")
      .find("p")
      .first()
      .invoke("text")
      .then((originalText) => {
        const originalName = originalText.trim() || "Admin Test User";

        // Enter edit mode
        cy.get("@nameField").within(() => {
          cy.contains("button", "Edit").click();
        });

        // Change the name but then cancel
        cy.get('input[name="name"]').should("be.visible").clear().type("Some Temporary Name");

        cy.contains("button", "Cancel").click();

        // Editing mode should exit and original name should remain
        cy.contains("label", "Full Name")
          .parent()
          .within(() => {
            cy.get('input[name="name"]').should("not.exist");
            cy.get("p")
              .first()
              .invoke("text")
              .then((textAfterCancel) => {
                expect(textAfterCancel.trim()).to.eq(originalName.trim());
              });
          });
      });
  });

  it("Should log out when clicking Log Out button", () => {
    // Click the Log Out button at the bottom of the profile page
    cy.contains("button", "Log Out").click();

    // After logout, user should be taken back to login page
    cy.url({ timeout: 20000 }).should("include", "/login");

    // Login form should be visible again
    cy.contains("Sign In").should("be.visible");
  });
});

