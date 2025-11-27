describe("Fluentify | User Management Tests", () => {
  const BASE = "https://fluentify-rho.vercel.app";

  const ADMIN_EMAIL = "prathamlakhani.synapse@gmail.com";
  const ADMIN_PASSWORD = "Pratham@911";

  beforeEach(() => {
    // Login as admin via login page
    cy.visit(`${BASE}/login`);

    cy.get("select").select("Admin");
    cy.get('input[placeholder="you@example.com"]').type(ADMIN_EMAIL);
    cy.get('input[placeholder="Enter your password"]').type(ADMIN_PASSWORD);
    cy.contains("Sign In").click();

    // Land on admin dashboard
    cy.url().should("include", "/admin-dashboard");

    // Navigate to User Management from dashboard sidebar
    cy.contains("button", "User Management").click();
    cy.url().should("include", "/admin/users");
  });

  it("Should load User Management dashboard and show learners list", () => {
    // Header and search bar should be visible
    cy.contains("h1", "User Management").should("be.visible");
    cy.get('input[placeholder="Search users by name or email..."]').should("be.visible");

    // Wait for learners section to load and ensure at least one user card is present
    cy.contains("h2", "Learners").should("be.visible");
    cy.get("div.cursor-pointer").should("have.length.greaterThan", 0);
  });

  it("Should navigate back to admin dashboard when clicking header back button", () => {
    // We are already on /admin/users from beforeEach
    cy.url().should("include", "/admin/users");

    // Click the back arrow button in the User Management header
    cy.get("header button").first().click();

    // Should navigate back to admin dashboard home
    cy.url().should("include", "/admin-dashboard");
    cy.contains("h1", "Admin Dashboard").should("be.visible");
  });

  it("Should filter users via search bar", () => {
    // Ensure list is loaded
    cy.contains("h2", "Learners").should("be.visible");

    // Capture the first user's name from the grid
    cy.get("div.cursor-pointer")
      .first()
      .find("h3")
      .invoke("text")
      .then((name) => {
        const trimmedName = name.trim();

        // Type the name into the search bar and submit
        cy.get('input[placeholder="Search users by name or email..."]')
          .clear()
          .type(`${trimmedName}{enter}`);

        // After search, the learners list should show a user card matching that name
        cy.contains("h3", trimmedName).should("be.visible");
        cy.contains("No users found").should("not.exist");
      });
  });

  it("Should open user details when clicking a user card", () => {
    // Click the first user card
    cy.get("div.cursor-pointer")
      .first()
      .click();

    // URL should now be /admin/users/<userId>
    cy.url().should("match", /\/admin\/users\/[^/]+$/);

    // User Details page should be visible
    cy.contains("h2", "User Details").should("be.visible");
  });

  it("Should allow editing user details and saving changes", () => {
    // Open first user details page
    cy.get("div.cursor-pointer")
      .first()
      .click();

    cy.url().should("match", /\/admin\/users\/[^/]+$/);
    cy.contains("h2", "User Details").should("be.visible");

    const newName = `Cypress Edited User ${Date.now()}`;
    const newEmail = `cypress+edited+${Date.now()}@example.com`;

    // Enter edit mode
    cy.contains("button", "Edit").click();

    // Update name and email inputs
    cy.contains("label", "Name")
      .parent()
      .find("input")
      .clear()
      .type(newName);

    cy.contains("label", "Email")
      .parent()
      .find("input")
      .clear()
      .type(newEmail);

    // Save changes
    cy.contains("button", "Save").click();

    // Back to non-edit mode and new values should be visible
    cy.contains("button", "Edit").should("be.visible");
    cy.contains("label", "Name")
      .parent()
      .contains(newName)
      .should("be.visible");
    cy.contains("label", "Email")
      .parent()
      .contains(newEmail)
      .should("be.visible");
  });

  it("Should not persist changes when Cancel is clicked", () => {
    // Open first user details page
    cy.get("div.cursor-pointer")
      .first()
      .click();

    cy.url().should("match", /\/admin\/users\/[^/]+$/);
    cy.contains("h2", "User Details").should("be.visible");

    // Capture original name and email
    cy.contains("label", "Name")
      .parent()
      .find("p")
      .invoke("text")
      .then((originalName) => {
        cy.wrap(originalName.trim()).as("originalName");
      });

    cy.contains("label", "Email")
      .parent()
      .find("p")
      .invoke("text")
      .then((originalEmail) => {
        cy.wrap(originalEmail.trim()).as("originalEmail");
      });

    // Enter edit mode and change values
    cy.contains("button", "Edit").click();

    cy.contains("label", "Name")
      .parent()
      .find("input")
      .clear()
      .type("Temporary Name Change");

    cy.contains("label", "Email")
      .parent()
      .find("input")
      .clear()
      .type("temp-change@example.com");

    // Click Cancel
    cy.contains("button", "Cancel").click();

    // Values should revert to originals
    cy.get("@originalName").then((name) => {
      cy.contains("label", "Name")
        .parent()
        .contains(name)
        .should("be.visible");
    });

    cy.get("@originalEmail").then((email) => {
      cy.contains("label", "Email")
        .parent()
        .contains(email)
        .should("be.visible");
    });
  });

  it("Should show confirmation on delete and not delete when cancelled", () => {
    // Open first user details page
    cy.get("div.cursor-pointer")
      .first()
      .click();

    cy.url().should("match", /\/admin\/users\/[^/]+$/);
    cy.contains("h2", "User Details").should("be.visible");

    // Stub window.confirm to simulate cancel
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(false).as("confirmStub");
    });

    cy.contains("button", "Delete").click();

    cy.get("@confirmStub").should("have.been.calledOnce");
    // Still on the same user details page
    cy.url().should("match", /\/admin\/users\/[^/]+$/);
    cy.contains("h2", "User Details").should("be.visible");
  });

  it("Should delete user after confirmation and return to User Management dashboard", () => {
    // Open first user details page
    cy.get("div.cursor-pointer")
      .first()
      .click();

    cy.url().should("match", /\/admin\/users\/[^/]+$/);
    cy.contains("h2", "User Details").should("be.visible");

    // Stub window.confirm to approve deletion
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true).as("confirmStub");
    });

    cy.contains("button", "Delete").click();

    cy.get("@confirmStub").should("have.been.calledOnce");

    // After confirmed deletion, we should be back on the User Management dashboard
    cy.url().should("include", "/admin/users");
    cy.contains("h1", "User Management").should("be.visible");
  });
});

