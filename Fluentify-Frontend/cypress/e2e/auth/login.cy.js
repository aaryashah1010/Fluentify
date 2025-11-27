describe('Fluentify Login Page Tests', () => {

  // Change this only if your login URL is different
  const BASE_URL = 'https://fluentify-rho.vercel.app/login';

  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  // -------------------------------------------------------------
  // 1. PAGE LOADS CORRECTLY
  // -------------------------------------------------------------
  it('Should load the Login page with all UI elements', () => {
    cy.contains('Welcome Back').should('be.visible');
    cy.contains('Sign in to continue').should('be.visible');

    cy.get('select').should('be.visible');
    cy.get('input[placeholder="you@example.com"]').should('be.visible');
    cy.get('input[placeholder="Enter your password"]').should('be.visible');
    cy.contains('Sign In').should('be.visible');
  });

  // -------------------------------------------------------------
  // 2. VALIDATION: EMPTY EMAIL → HTML5 POPUP
  // -------------------------------------------------------------
  it("Should show required validation when email is empty", () => {
  cy.get('input[placeholder="Enter your password"]').type("12345678");
  cy.contains("Sign In").click();
  cy.contains("Email is required").should("be.visible");
});

  // -------------------------------------------------------------
  // 3. VALIDATION: EMAIL ENTERED + EMPTY PASSWORD → HTML5 POPUP
  // -------------------------------------------------------------
  it("Should show required validation when password is empty but email is entered", () => {

  // enter email
  cy.get('input[placeholder="you@example.com"]').type("jenish.vasani08@gmail.com");

  // click outside or click Sign In
  cy.contains("Sign In").click({ force: true });

  // assert error message below password
  cy.contains("Password is required").should("be.visible");
});
  // -------------------------------------------------------------
  // 4. INVALID EMAIL FORMAT
  // -------------------------------------------------------------
  it('Should show invalid email error when email format is wrong', () => {
    cy.get('input[placeholder="you@example.com"]').type('jenish.vasani08@gmail'); // missing .com
    cy.get('input[placeholder="Enter your password"]').type('mypassword');
    cy.contains("Sign In").should("be.disabled");

    cy.contains('Please enter a valid email').should('be.visible');
  });

  // -------------------------------------------------------------
  // 5. WRONG CREDENTIALS → RED ERROR BOX
  // -------------------------------------------------------------
  it('Should show error for incorrect credentials', () => {
    cy.get('input[placeholder="you@example.com"]').type('wrong@test.com');
    cy.get('input[placeholder="Enter your password"]').type('wrongpassword');
    cy.contains('Sign In').click();

    cy.contains('Credentials are wrong. Please try again').should('be.visible');
  });

  // -------------------------------------------------------------
  // 6. SUCCESSFUL LOGIN → REDIRECTS TO DASHBOARD
  // -------------------------------------------------------------
  it('Should log in successfully and redirect to dashboard', () => {

    cy.intercept('POST', '**/login*', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        role: 'Learner'
      }
    }).as('loginSuccess');

    cy.get('input[placeholder="you@example.com"]').type('jenish.vasani08@gmail.com');
    cy.get('input[placeholder="Enter your password"]').type('Jenish@1234_');

    cy.contains('Sign In').click();
    cy.url().should('include', '/dashboard');
  });


  // -------------------------------------------------------------
  // 7. NAVIGATION: FORGOT PASSWORD
  // -------------------------------------------------------------
  it('Should navigate to Forgot Password page', () => {
    cy.contains('Forgot password?').click();
    cy.url().should('include', '/forgot-password');
  });

  // -------------------------------------------------------------
  // 8. NAVIGATION: SIGN UP
  // -------------------------------------------------------------
  it('Should navigate to Signup page', () => {
    cy.contains("Create an account").click();
    cy.url().should('include', '/signup');
  });

});
