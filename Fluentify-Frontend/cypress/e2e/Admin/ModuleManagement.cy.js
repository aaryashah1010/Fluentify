describe("Fluentify | Module Management Tests", () => {
  const BASE = "https://fluentify-rho.vercel.app";

  const ADMIN_EMAIL = "prathamlakhani.synapse@gmail.com";
  const ADMIN_PASSWORD = "Pratham@911";

  const openCreateCoursePage = () => {
    // Button text can be "Create New Course" (when languages exist)
    // or "Create First Course" (empty state)
    cy.contains(/Create New Course|Create First Course/).click();
    cy.url().should("include", "/admin/modules/course/new");
    cy.contains("Create New Course").should("be.visible");
    cy.contains("Course Information").should("be.visible");
  };

  const ensureAtLeastOneLanguageCard = () => {
    cy.get('body').then(($body) => {
      if ($body.find('button.rounded-3xl').length === 0) {
        openCreateCoursePage();
        cy.get('input[name="language"]').clear().type("Spanish");
        cy.get('input[name="title"]').clear().type(`Cypress Bootstrap Course ${Date.now()}`);
        cy.get('select[name="level"]').select("Beginner");
        cy.contains("Save Course").click();
        cy.url({ timeout: 20000 }).should("include", "/admin/modules");

        // Force reload of /admin/modules so LanguageListPage fetches languages again
        cy.visit(`${BASE}/admin/modules`);
      }
    });
  };

  beforeEach(() => {
    // Login as admin via login page
    cy.visit(`${BASE}/login`);

    cy.get("select").select("Admin");
    cy.get('input[placeholder="you@example.com"]').type(ADMIN_EMAIL);
    cy.get('input[placeholder="Enter your password"]').type(ADMIN_PASSWORD);
    cy.contains("Sign In").click();

    // Land on admin dashboard
    cy.url().should("include", "/admin-dashboard");

    // Navigate to Module Management from dashboard sidebar
    cy.contains("button", "Module Management").click();
    cy.url().should("include", "/admin/modules");
  });

  it("Should open Create New Course page from Module Management", () => {
    openCreateCoursePage();
  });

  it("Should show title and language required when saving with no details", () => {
    openCreateCoursePage();

    // Do not fill any fields, just attempt to save
    cy.contains("Save Course").click();

    // Expect backend validation error message surfaced in the UI
    cy.contains(/Title and language are required/i).should("be.visible");
  });

  it("Should show title and language required when only title is filled", () => {
    openCreateCoursePage();

    cy.get('input[name="title"]').type("Test Course Without Language");
    cy.contains("Save Course").click();

    cy.contains(/Title and language are required/i).should("be.visible");
  });

  it("Should show title and language required when only language is filled", () => {
    openCreateCoursePage();

    cy.get('input[name="language"]').type("Spanish");
    cy.contains("Save Course").click();

    cy.contains(/Title and language are required/i).should("be.visible");
  });

  it("Should show Level is required when title and language are set but no level", () => {
    openCreateCoursePage();

    cy.get('input[name="language"]').type("Spanish");
    cy.get('input[name="title"]').type("Spanish A1");
    // Leave level select at default (empty)
    cy.contains("Save Course").click();

    cy.contains(/level is required/i).should("be.visible");
  });

  it("Should save course and return to Module Management when all required fields are filled", () => {
    openCreateCoursePage();

    // Fill required fields
    cy.get('input[name="language"]').clear().type("Spanish");
    cy.get('input[name="title"]').clear().type(`Cypress Test Course ${Date.now()}`);
    cy.get('select[name="level"]').select("Beginner");

    // Save the course
    cy.contains("Save Course").click();

    // After successful save, we should be back somewhere under /admin/modules
    cy.url({ timeout: 20000 }).should("include", "/admin/modules");
  });

  it("Should navigate to language course page when clicking a language card", () => {
    ensureAtLeastOneLanguageCard();

    // We are already on /admin/modules from beforeEach
    // Click the first language card
    cy.get('button.rounded-3xl').first().click();

    // URL should now be /admin/modules/<language>
    cy.url().should('match', /\/admin\/modules\/[^/]+$/);

    // Header should show "<language> Courses" matching the URL segment
    cy.url().then((url) => {
      const match = url.match(/\/admin\/modules\/([^/?#]+)/);
      const langFromUrl = match && match[1];
      if (langFromUrl) {
        cy.contains('h2', `${langFromUrl} Courses`).should('be.visible');
      }
    });
  });

  it("Should navigate to Edit Course page when clicking Edit on a language course", () => {
    ensureAtLeastOneLanguageCard();

    // From /admin/modules, go to a specific language's course list first
    cy.get('button.rounded-3xl').first().then(($button) => {
      const rawText = $button.text().trim();
      const activeLanguage = rawText.split('\n')[0].trim();

      cy.wrap($button).click();

      // Click the first Edit button for a course
      cy.contains('button', 'Edit').first().click();

      // URL should be the edit route and Edit Course heading visible
      cy.url().should('match', /\/admin\/modules\/course\/edit\/.+$/);
      cy.contains('h2', 'Edit Course').should('be.visible');
    });
  });

  it("Should delete a course and allow creating a new one", () => {
    ensureAtLeastOneLanguageCard();

    // Go specifically to Gujarati language courses page
    cy.get('button.rounded-3xl').first().click();

    // Ensure we navigated to a specific language course list page
    cy.url().should('match', /\/admin\/modules\/[^/]+$/);

    // Capture the active language from the header ("<language> Courses")
    cy.contains('h2', 'Courses')
      .invoke('text')
      .then((headerText) => {
        const activeLanguage = headerText.replace(' Courses', '').trim();

        // Determine how many course cards exist in the grid
        cy.get('div.grid > div.relative.rounded-3xl').then(($cards) => {
          const initialCount = $cards.length;

          if (initialCount > 1) {
            // When multiple courses exist, delete one and stay on the same page
            cy.wrap($cards.first()).within(() => {
              cy.get('button').last().click();
            });

            // Delete confirmation modal should appear
            cy.contains('h3', 'Delete Course').should('be.visible');
            cy.contains('Are you sure you want to delete this course?').should('be.visible');

            // Confirm deletion
            cy.contains('button', 'Delete').click();

            // We should remain on the same language course list page
            cy.url().should('match', /\/admin\/modules\/[^/]+$/);
            cy.contains('h2', `${activeLanguage} Courses`).should('be.visible');

            // Course count should be reduced by one
            cy.get('div.grid > div.relative.rounded-3xl').should('have.length', initialCount - 1);
          } else if (initialCount === 1) {
            // Only one course exists: delete it and expect the empty-state view
            cy.wrap($cards.first()).within(() => {
              cy.get('button').last().click();
            });

            // Delete confirmation modal should appear
            cy.contains('h3', 'Delete Course').should('be.visible');
            cy.contains('Are you sure you want to delete this course?').should('be.visible');

            // Confirm deletion
            cy.contains('button', 'Delete').click();

            // Now we should see the empty state for this language with Create First Course
            cy.contains(`No courses found for ${activeLanguage}`).should('be.visible');
            cy.contains('button', 'Create First Course').should('be.visible');

            // Clicking Create First Course should open the Create New Course page
            cy.contains('button', 'Create First Course').click();
            cy.url().should('include', '/admin/modules/course/new');
            cy.contains('h2', 'Create New Course').should('be.visible');
          }
        });
      });
  });
});
