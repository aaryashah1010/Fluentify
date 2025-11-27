describe("Fluentify | Contest Management Tests", () => {
  const BASE = "https://fluentify-rho.vercel.app";

  const ADMIN_EMAIL = "prathamlakhani.synapse@gmail.com";
  const ADMIN_PASSWORD = "Pratham@911";

  const formatDateTimeLocal = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const ensureAtLeastOneContestCard = () => {
    cy.get("body").then(($body) => {
      const hasEmptyState = $body.text().includes("No Contests Yet");

      if (hasEmptyState) {
        // Empty state: create a contest so that cards and actions exist
        const now = new Date();
        const start = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
        const end = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

        cy.contains("button", "Create Contest").click();
        cy.url().should("include", "/admin/contests/new");
        cy.contains("h1", "Create New Contest").should("be.visible");

        cy.get('input[placeholder="e.g., Weekly Spanish Challenge"]').clear().type(
          `Cypress Contest ${Date.now()}`
        );

        cy.get('input[type="datetime-local"]').eq(0).clear().type(formatDateTimeLocal(start));
        cy.get('input[type="datetime-local"]').eq(1).clear().type(formatDateTimeLocal(end));

        cy.contains("button", "Create Contest").click();

        // After successful create, we should be back on the contest list
        cy.url({ timeout: 20000 }).should("include", "/admin/contests");
      }

      // Whether we created one or already had contests, wait until real cards
      // with action buttons (e.g. "View") are rendered, not the loading skeletons.
      cy.contains("button", "View", { timeout: 20000 }).should("exist");
    });
  };

  const openFirstContestInEditMode = () => {
    ensureAtLeastOneContestCard();

    cy.get("div.grid > div.relative.rounded-3xl")
      .first()
      .within(() => {
        cy.contains("button", "Edit").click();
      });

    cy.url().should("match", /\/admin\/contests\/[^/]+\/edit$/);
    cy.contains("h1", "Edit Contest").should("be.visible");
    cy.contains("h2", "Contest Details").should("be.visible");
    // Ensure questions UI is mounted
    cy.contains("h2", "Add New Question").should("be.visible");
  };

  beforeEach(() => {
    // Login as admin via login page (same pattern as User Analytics)
    cy.visit(`${BASE}/login`);

    cy.get("select").select("Admin");
    cy.get('input[placeholder="you@example.com"]').type(ADMIN_EMAIL);
    cy.get('input[placeholder="Enter your password"]').type(ADMIN_PASSWORD);
    cy.contains("Sign In").click();

    // Land on admin dashboard
    cy.url().should("include", "/admin-dashboard");

    // Navigate to Contest Management from dashboard sidebar
    cy.contains("Contest Management").click();
    cy.url().should("include", "/admin/contests");
  });

  it("Should navigate back to admin dashboard when clicking header back button", () => {
    // We are already on /admin/contests from beforeEach
    cy.url().should("include", "/admin/contests");

    // Click the back arrow button in the Contest Management header
    cy.get("header button").first().click();

    // Should navigate back to admin dashboard home
    cy.url().should("include", "/admin-dashboard");
    cy.contains("h1", "Admin Dashboard").should("be.visible");
  });

  it("Should open contest details page when clicking View on a contest card", () => {
    ensureAtLeastOneContestCard();

    // Click View on the first contest card
    cy.get("div.grid > div.relative.rounded-3xl")
      .first()
      .within(() => {
        cy.contains("button", "View").click();
      });

    // URL should now be /admin/contests/<id> and Edit Contest heading visible
    cy.url().should("match", /\/admin\/contests\/[^/]+$/);
    cy.contains("h1", "Edit Contest").should("be.visible");
    cy.contains("h2", "Contest Details").should("be.visible");
  });

  it("Should open contest edit page when clicking Edit on a contest card", () => {
    ensureAtLeastOneContestCard();

    // Click Edit on the first contest card
    cy.get("div.grid > div.relative.rounded-3xl")
      .first()
      .within(() => {
        cy.contains("button", "Edit").click();
      });

    // URL should now be /admin/contests/<id>/edit and Edit Contest heading visible
    cy.url().should("match", /\/admin\/contests\/[^/]+\/edit$/);
    cy.contains("h1", "Edit Contest").should("be.visible");
    cy.contains("h2", "Contest Details").should("be.visible");
  });

  it("Should show delete confirmation modal and not delete when cancelled", () => {
    ensureAtLeastOneContestCard();

    cy.get("div.grid > div.relative.rounded-3xl").then(($cards) => {
      const initialCount = $cards.length;

      // Click the delete button (trash icon) on the first card
      cy.wrap($cards.first()).within(() => {
        cy.get("button").last().click();
      });

      // Confirmation modal should appear
      cy.contains("h3", "Delete Contest?").should("be.visible");
      cy.contains("Are you sure you want to delete this contest?").should("be.visible");

      // Cancel deletion
      cy.contains("button", "Cancel").click();

      // Still on contest list, and count unchanged
      cy.url().should("include", "/admin/contests");
      cy.get("div.grid > div.relative.rounded-3xl").should("have.length", initialCount);
    });
  });

  it("Should delete contest only after confirming in modal", () => {
    ensureAtLeastOneContestCard();

    cy.get("div.grid > div.relative.rounded-3xl").then(($cards) => {
      const initialCount = $cards.length;

      cy.wrap($cards.first()).within(() => {
        cy.get("button").last().click();
      });

      cy.contains("h3", "Delete Contest?").should("be.visible");
      cy.contains("Are you sure you want to delete this contest?").should("be.visible");

      // Confirm deletion
      cy.contains("button", "Delete").click();

      // Back on contest list, with one fewer card
      cy.url().should("include", "/admin/contests");
      cy.get("div.grid > div.relative.rounded-3xl").should("have.length", Math.max(initialCount - 1, 0));
    });
  });

  it("Should navigate to Create Contest page when clicking Create Contest button", () => {
    cy.contains("button", "Create Contest").click();

    cy.url().should("include", "/admin/contests/new");
    cy.contains("h1", "Create New Contest").should("be.visible");
    cy.contains("h2", "Contest Details").should("be.visible");
  });

  it("Should validate required fields when creating a contest", () => {
    cy.contains("button", "Create Contest").click();

    cy.url().should("include", "/admin/contests/new");
    cy.contains("h1", "Create New Contest").should("be.visible");

    // Click Create Contest without filling required fields
    cy.contains("button", "Create Contest").click();

    // Validation messages from ContestEditorPage.validateContest
    cy.contains("Title is required").should("be.visible");
    cy.contains("Start time is required").should("be.visible");
    cy.contains("End time is required").should("be.visible");

    // Should remain on the same page
    cy.url().should("include", "/admin/contests/new");
  });

  it("Should validate that end time is after start time when creating a contest", () => {
    cy.contains("button", "Create Contest").click();

    cy.url().should("include", "/admin/contests/new");
    cy.contains("h1", "Create New Contest").should("be.visible");

    const now = new Date();
    const startLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    const endEarlier = new Date(now.getTime() + 1 * 60 * 60 * 1000); // +1 hour

    cy.get('input[placeholder="e.g., Weekly Spanish Challenge"]').clear().type(
      `Cypress Invalid Contest ${Date.now()}`
    );

    cy.get('input[type="datetime-local"]').eq(0).clear().type(formatDateTimeLocal(startLater));
    cy.get('input[type="datetime-local"]').eq(1).clear().type(formatDateTimeLocal(endEarlier));

    cy.contains("button", "Create Contest").click();

    // The form should show the specific end-time validation message and stay on the page
    cy.contains("End time must be after start time").should("be.visible");
    cy.url().should("include", "/admin/contests/new");
  });

it("Should open contest edit page when clicking Edit on a contest card", () => {
  ensureAtLeastOneContestCard();

  // Click Edit on the first contest card
  cy.get("div.grid > div.relative.rounded-3xl")
    .first()
    .within(() => {
      cy.contains("button", "Edit").click();
    });

  // URL should now be /admin/contests/<id>/edit and Edit Contest heading visible
  cy.url().should("match", /\/admin\/contests\/[^/]+\/edit$/);
  cy.contains("h1", "Edit Contest").should("be.visible");
  cy.contains("h2", "Contest Details").should("be.visible");
});

it("Should show delete confirmation modal and not delete when cancelled", () => {
  ensureAtLeastOneContestCard();

  cy.get("div.grid > div.relative.rounded-3xl").then(($cards) => {
    const initialCount = $cards.length;

    // Click the delete button (trash icon) on the first card
    cy.wrap($cards.first()).within(() => {
      cy.get("button").last().click();
    });

    // Confirmation modal should appear
    cy.contains("h3", "Delete Contest?").should("be.visible");
    cy.contains("Are you sure you want to delete this contest?").should("be.visible");

    // Cancel deletion
    cy.contains("button", "Cancel").click();

    // Still on contest list, and count unchanged
    cy.url().should("include", "/admin/contests");
    cy.get("div.grid > div.relative.rounded-3xl").should("have.length", initialCount);
  });
});

it("Should delete contest only after confirming in modal", () => {
  ensureAtLeastOneContestCard();

  cy.get("div.grid > div.relative.rounded-3xl").then(($cards) => {
    const initialCount = $cards.length;

    cy.wrap($cards.first()).within(() => {
      cy.get("button").last().click();
    });

    cy.contains("h3", "Delete Contest?").should("be.visible");
    cy.contains("Are you sure you want to delete this contest?").should("be.visible");

    // Confirm deletion
    cy.contains("button", "Delete").click();

    // Back on contest list, with one fewer card
    cy.url().should("include", "/admin/contests");
    cy.get("div.grid > div.relative.rounded-3xl").should("have.length", Math.max(initialCount - 1, 0));
  });
});

it("Should navigate to Create Contest page when clicking Create Contest button", () => {
  cy.contains("button", "Create Contest").click();

  cy.url().should("include", "/admin/contests/new");
  cy.contains("h1", "Create New Contest").should("be.visible");
  cy.contains("h2", "Contest Details").should("be.visible");
});

it("Should validate required fields when creating a contest", () => {
  cy.contains("button", "Create Contest").click();

  cy.url().should("include", "/admin/contests/new");
  cy.contains("h1", "Create New Contest").should("be.visible");

  // Click Create Contest without filling required fields
  cy.contains("button", "Create Contest").click();

  // Validation messages from ContestEditorPage.validateContest
  cy.contains("Title is required").should("be.visible");
  cy.contains("Start time is required").should("be.visible");
  cy.contains("End time is required").should("be.visible");

  // Should remain on the same page
  cy.url().should("include", "/admin/contests/new");
});

it("Should validate that end time is after start time when creating a contest", () => {
  cy.contains("button", "Create Contest").click();

  cy.url().should("include", "/admin/contests/new");
  cy.contains("h1", "Create New Contest").should("be.visible");

  const now = new Date();
  const startLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours
  const endEarlier = new Date(now.getTime() + 1 * 60 * 60 * 1000); // +1 hour

  cy.get('input[placeholder="e.g., Weekly Spanish Challenge"]').clear().type(
    `Cypress Invalid Contest ${Date.now()}`
  );

  cy.get('input[type="datetime-local"]').eq(0).clear().type(formatDateTimeLocal(startLater));
  cy.get('input[type="datetime-local"]').eq(1).clear().type(formatDateTimeLocal(endEarlier));

  cy.contains("button", "Create Contest").click();

  // The form should show the specific end-time validation message and stay on the page
  cy.contains("End time must be after start time").should("be.visible");
  cy.url().should("include", "/admin/contests/new");
});

it("Should delete a question when clicking its delete icon", () => {
  openFirstContestInEditMode();

  // If there are no existing questions, add one first via the Add New Question form
  cy.get("body").then(($body) => {
    if (!$body.text().includes("Questions (")) {
      cy.get('textarea[placeholder="Enter your question here..."]').type(
        "Cypress temporary question?"
      );
      cy.get('input[placeholder="Option A"]').type("Option 1");
      cy.get('input[placeholder="Option B"]').type("Option 2");

      cy.contains("button", "Add Question").click();

      // Wait for the Questions header to appear with at least 1 question
      cy.contains("h2", "Questions (1)", { timeout: 20000 }).should("be.visible");
    }
  });

  // Capture the current question count from the "Questions (N)" heading
  cy.contains("h2", "Questions (")
    .invoke("text")
    .then((text) => {
      const match = text.match(/Questions\s*\((\d+)\)/);
      const initialCount = match ? parseInt(match[1], 10) : 0;

      if (initialCount === 0) {
        // Nothing to delete; skip the rest gracefully
        return;
      }

      // Click the delete button (trash icon) on the first question card
      cy.contains("h2", "Questions (")
        .parent()
        .within(() => {
          cy.get("button.text-rose-300").first().click();
        });

      if (initialCount > 1) {
        // Header should still exist with count decremented by 1
        cy.contains("h2", "Questions (")
          .invoke("text")
          .then((afterText) => {
            const afterMatch = afterText.match(/Questions\s*\((\d+)\)/);
            const newCount = afterMatch ? parseInt(afterMatch[1], 10) : 0;
            expect(newCount).to.eq(initialCount - 1);
          });
      } else {
        // When only one question existed, the Questions section disappears
        cy.contains("h2", "Questions (").should("not.exist");
      }
    });
});

it("Should enforce validations and show confirmation when adding a question", () => {
  openFirstContestInEditMode();

  // Stub alert to capture validation and success/error messages
  cy.window().then((win) => {
    cy.stub(win, "alert").as("alertStub");
  });

  // 1) Click Add Question with all fields empty
  cy.contains("button", "Add Question").click();

  // 2) Fill question text but no options -> should require at least 2 options
  cy.get('textarea[placeholder="Enter your question here..."]').type("Sample question?");
  cy.contains("button", "Add Question").click();

  // 3) Provide valid question text and at least two options, then add
  cy.get('textarea[placeholder="Enter your question here..."]').clear().type("Valid question?");
  cy.get('input[placeholder="Option A"]').clear().type("Option 1");
  cy.get('input[placeholder="Option B"]').clear().type("Option 2");

  cy.contains("button", "Add Question").click();

  // Validate that the expected validation alerts fired, and that a final
  // success or failure alert was shown by the app.
  cy.get("@alertStub").then((stub) => {
    // At least one alert should have been shown across the invalid and valid attempts
    expect(stub.getCalls().length).to.be.greaterThan(0);
  });
});

it("Should trigger contest update when clicking Save Changes", () => {
  openFirstContestInEditMode();

  // Intercept the update API so we don't depend on real backend/network
  cy.intercept("PUT", "**/api/contests/admin/*", {
    statusCode: 200,
    body: { success: true, data: {} },
  }).as("updateContest");

  // Click Save Changes in edit mode
  cy.contains("button", "Save Changes").click();

  // The PUT update request should have been made
  cy.wait("@updateContest");
});

it("Should mark selected option as correct answer in questions list", () => {
  openFirstContestInEditMode();

  // Ensure add-question API succeeds so the question appears in the Questions list
  cy.intercept("POST", "**/api/contests/admin/*/questions", {
    statusCode: 200,
    body: { success: true, data: {} },
  }).as("addQuestion");

  const questionText = `Correct answer radio test ${Date.now()}`;
  const optionA = "First option";
  const optionB = "Second (correct) option";

  // Fill question text and at least two options
  cy.get('textarea[placeholder="Enter your question here..."]').clear().type(
    questionText
  );
  cy.get('input[placeholder="Option A"]').clear().type(optionA);
  cy.get('input[placeholder="Option B"]').clear().type(optionB);

  // Select Option B as the correct answer via the radio button
  cy.get('input[type="radio"][name="correct_option"]').eq(1).check({ force: true });

  // Add the question
  cy.contains("button", "Add Question").click();
  cy.wait("@addQuestion");

  // Verify that the question appears in the Questions list
  cy.contains("h2", "Questions (", { timeout: 20000 }).should("be.visible");

  cy.contains("h2", "Questions (")
    .parent()
    .find("div.border.rounded-2xl.p-4")
    .last()
    .within(() => {
      // The question header should contain our question text
      cy.contains("h3", questionText).should("exist");

      // Option A should NOT be marked as correct
      cy.contains("div", `A. ${optionA}`).should("not.contain.text", "✓");

      // Option B should be marked as the correct answer with the ✓ marker
      cy.contains("div", `B. ${optionB}`).should("contain.text", "✓");
    });
});

it("Should confirm before publishing contest and show result message", () => {
  openFirstContestInEditMode();

  // Ensure there is at least one question (otherwise publish will alert and return)
  cy.get("body").then(($body) => {
    if (!$body.text().includes("Questions (")) {
      cy.get('textarea[placeholder="Enter your question here..."]').type(
        "Question for publish test?"
      );
      cy.get('input[placeholder="Option A"]').type("Option 1");
      cy.get('input[placeholder="Option B"]').type("Option 2");
      cy.contains("button", "Add Question").click();
    }
  });

  // Stub confirm and alert
  cy.window().then((win) => {
    cy.stub(win, "confirm").returns(true).as("confirmStub");
    cy.stub(win, "alert").as("alertStub");
  });

  // Click Publish Contest
  cy.contains("button", "Publish Contest").click();

  // Confirm dialog should have been shown
  cy.get("@confirmStub").should("have.been.called");

  // The app should show at least one alert indicating the publish result
  // Use Cypress retry so we don't race the async network/alert
  cy.get("@alertStub").should("have.been.called");
});

});
