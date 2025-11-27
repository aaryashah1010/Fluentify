describe("Fluentify | Admin Dashboard Tests", () => {
  const BASE = "https://fluentify-rho.vercel.app";

  beforeEach(() => {
    cy.visit(`${BASE}/login`);

    // Select Admin Role
    cy.get("select").select("Admin");

    // Enter login credentials
    cy.get('input[placeholder="you@example.com"]').type("prathamlakhani.synapse@gmail.com");
    cy.get('input[placeholder="Enter your password"]').type("Pratham@911");

    // Click Sign In
    cy.contains("Sign In").click();

    // Verify admin dashboard URL
    cy.url().should("include", "/admin-dashboard");

    // Dashboard heading should appear
    cy.contains("Admin Dashboard").should("be.visible");
    cy.contains("Welcome, Admin!").should("be.visible");
  });

  // -------------------------------------------------------------
  // 1. Check Admin Dashboard Components Visible
  // -------------------------------------------------------------
  it("Should load Admin Dashboard with main components visible", () => {
    cy.contains("Analytics Dashboard").should("be.visible");
    cy.contains("User Management").should("be.visible");
    cy.contains("Contest Management").should("be.visible");

    // Check charts/cards exist
    cy.contains("Active learners").should("be.visible");
    cy.contains("Lessons completed").should("be.visible");
    cy.contains("AI generations").should("be.visible");

    // Sidebar items
    cy.contains("Home").should("be.visible");
    cy.contains("Module Management").should("be.visible");
    cy.contains("User Management").should("be.visible");
    cy.contains("User Analytics").should("be.visible");
    cy.contains("Contest Management").should("be.visible");
    cy.contains("Email Campaign").should("be.visible");
    cy.contains("Profile").should("be.visible");
    cy.contains("Logout").should("be.visible");
  });

  // -------------------------------------------------------------
  // 2. Sidebar Navigation Tests
  // -------------------------------------------------------------
  it("Should navigate to Home", () => {
    cy.contains("Home").click();
    cy.url().should("include", "/admin-dashboard");
  });

  it("Should navigate to Module Management", () => {
    cy.contains("Module Management").click();
    cy.url().should("include", "/admin/modules");
  });

  it("Should navigate to User Management", () => {
    cy.contains("User Management").click();
    cy.url().should("include", "/admin/users");
  });

  it("Should navigate to User Analytics", () => {
    cy.contains("User Analytics").click();
    cy.url().should("include", "/admin/analytics");
  });

  it("Should navigate to Contest Management", () => {
    cy.contains("Contest Management").click();
    cy.url().should("include", "/admin/contests");
  });

  it("Should navigate to Email Campaign", () => {
    cy.contains("Email Campaign").click();
    cy.url().should("include", "/admin/email-campaign");
  });

  it("Should navigate to Profile", () => {
    cy.contains("Profile").click();
    cy.url().should("include", "/admin/profile");
  });

  it("Should open full analytics page from dashboard CTA", () => {
    cy.contains("Open full analytics").click();
    cy.url().should("include", "/admin/analytics");
  });

  it("Should navigate to User Management when clicking User Search", () => {
    cy.contains("User Search").click();
    cy.url().should("include", "/admin/users");
  });

  it("Should navigate to User Management when clicking User Table", () => {
    cy.contains("User Table").click();
    cy.url().should("include", "/admin/users");
  });

  it("Should navigate to Contest Management when clicking + Create New", () => {
    cy.contains("+ Create New").click();
    cy.url().should("include", "/admin/contests");
  });

  it("Should navigate to Contest Management when clicking Contest List", () => {
    cy.contains("Contest List").click();
    cy.url().should("include", "/admin/contests");
  });

  it("Should navigate to Module Management when clicking Create New Course", () => {
    cy.contains("Create New Course").click();
    cy.url().should("include", "/admin/modules");
  });

  it("Should allow scrolling through Recent Activity entries", () => {
    // Locate the Recent Activity section
    cy.contains("h3", "Recent Activity")
      .closest("section")
      .within(() => {
        // Scrollable container uses custom scrollbar class in AdminDashboard.jsx
        cy.get(".custom-scrollbar").then(($el) => {
          const el = $el[0];

          // Always attempt to scroll; assert scroll position change only when scrollable
          if (el.scrollHeight > el.clientHeight) {
            // Scroll to bottom
            cy.wrap($el).scrollTo("bottom");
            cy.wrap($el)
              .invoke("scrollTop")
              .should("be.gt", 0);

            // Scroll back to top
            cy.wrap($el).scrollTo("top");
            cy.wrap($el)
              .invoke("scrollTop")
              .should("equal", 0);
          } else {
            // If not enough content to require scrolling, just ensure container is visible
            cy.wrap($el).should("be.visible");
          }
        });
      });
  });

  it("Should navigate to specific language page when clicking a Module Management language card", () => {
    // Find the Module Management section on the dashboard
    cy.contains("h3", "Module Management")
      .closest("section")
      .within(() => {
        // Grab the first language card button inside the grid
        cy.get("div.grid button").first().as("languageCard");
      });

    // Read the language name from the card, click it, and verify URL
    cy.get("@languageCard")
      .find("p")
      .first()
      .invoke("text")
      .then((languageText) => {
        const language = languageText.trim();

        // Click the card to navigate
        cy.get("@languageCard").click();

        // URL should now be the language-specific module management page
        cy.url().should("include", `/admin/modules/${language}`);
      });
  });

  it("Should toggle the control panel sidebar open and collapsed via the top-left button", () => {
    // Sidebar should start expanded (w-60) with Control Center label visible
    cy.get("aside").should("have.class", "w-60");
    cy.contains("Control Center").should("be.visible");

    // Click the top-left control panel toggle button (three-line button in sidebar header)
    cy.get("aside button").first().click();

    // Sidebar should now be collapsed (w-16) and Control Center text hidden
    cy.get("aside").should("have.class", "w-16");
    cy.contains("Control Center").should("not.exist");

    // Clicking again should expand the sidebar back to full width
    cy.get("aside button").first().click();
    cy.get("aside").should("have.class", "w-60");
    cy.contains("Control Center").should("be.visible");
  });

  // -------------------------------------------------------------
  // 3. Logout Test
  // -------------------------------------------------------------
  it("Should logout successfully", () => {
    cy.contains("Logout").scrollIntoView().click();
    cy.url().should("include", "/login");
    cy.contains("Welcome Back").should("be.visible");
  });

  // -------------------------------------------------------------
  // 4. Browser Back Button Behavior
  // -------------------------------------------------------------
  it("Should stay on Admin Dashboard when browser back button is used", () => {
    // We start on /admin-dashboard from beforeEach
    cy.url().should("include", "/admin-dashboard");

    // Simulate clicking the browser back button (top-left)
    cy.go("back");

    // Back navigation is prevented, so we should remain on the admin dashboard
    cy.url().should("include", "/admin-dashboard");
    cy.contains("Admin Dashboard").should("be.visible");
    cy.contains("Welcome, Admin!").should("be.visible");
  });
});