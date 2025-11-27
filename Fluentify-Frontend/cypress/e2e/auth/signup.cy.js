describe('Fluentify Signup Page Tests', () => {

  const SIGNUP_URL = 'https://fluentify-rho.vercel.app/signup';

  beforeEach(() => {
    cy.visit(SIGNUP_URL);
  });

  // -------------------------------------------------------------
  // 1. CHECK PAGE LOAD
  // -------------------------------------------------------------
  it('Should load Signup page UI elements correctly', () => {
    cy.contains('Create Account').should('be.visible');
    cy.get('select').should('be.visible');
    cy.get('input[placeholder="Enter your full name"]').should('be.visible');
    cy.get('input[placeholder="you@example.com"]').should('be.visible');
    cy.get('input[placeholder="Create a strong password"]').should('be.visible');
    cy.get('input[placeholder="Confirm your password"]').should('be.visible');
    cy.contains('Continue to Verification').should('be.visible');
  });

  // -------------------------------------------------------------
  // 2. REQUIRED FIELDS VALIDATION
  // -------------------------------------------------------------
  it('Should show required field errors when submitting empty form', () => {
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.contains('Continue to Verification').click();
    cy.contains('Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    cy.contains('Please confirm your password').should('be.visible');
  });

  // -------------------------------------------------------------
  // 3. INVALID EMAIL FORMAT (error shows when user moves to password field)
  // -------------------------------------------------------------
  it('Should show invalid email error when user focuses on password after typing invalid email', () => {
    cy.get('input[placeholder="Enter your full name"]').type('Jenish Vasani');
    cy.get('input[placeholder="you@example.com"]').type('wrongemailformat');
    cy.get('input[placeholder="Create a strong password"]').click();
    cy.contains('Please enter a valid email').should('be.visible');
  });



  // -------------------------------------------------------------
  // 4. PASSWORD MISMATCH
  // -------------------------------------------------------------
  it('Should show password mismatch validation', () => {
    cy.get('input[placeholder="Enter your full name"]').type('Jenish Vasani');
    cy.get('input[placeholder="you@example.com"]').type('jenish@test.com');
    cy.get('input[placeholder="Create a strong password"]').type('StrongPass123');
    cy.get('input[placeholder="Confirm your password"]').type('DifferentPass123');
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.contains('Continue to Verification').click();

    cy.contains('Passwords do not match').should('be.visible');
  });

  // -------------------------------------------------------------
  // 5. CHECKBOX NOT SELECTED → BUTTON DISABLED
  // -------------------------------------------------------------
  it('Should disable Continue button if Terms & Conditions are not accepted', () => {

    cy.get('input[placeholder="Enter your full name"]').type('Jenish Vasani');
    cy.get('input[placeholder="you@example.com"]').type('jenish@test.com');
    cy.get('input[placeholder="Create a strong password"]').type('StrongPass123');
    cy.get('input[placeholder="Confirm your password"]').type('StrongPass123');
    cy.get('input[type="checkbox"]').should('not.be.checked');
    cy.contains('Continue to Verification').should('have.attr', 'disabled');
    cy.contains('Continue to Verification').click({ force: true });

    cy.url().should('include', '/signup');
  });

  // -------------------------------------------------------------
  // 6. EMAIL ALREADY EXISTS
  // -------------------------------------------------------------
  it('Should show "Email already exists" when using an already registered email', () => {

    cy.get('input[placeholder="Enter your full name"]').type('Jenish Vasani');
    cy.get('input[placeholder="you@example.com"]').type('jenish.vasani08@gmail.com');
    cy.get('input[placeholder="Create a strong password"]').type('Jenish@1234_');
    cy.get('input[placeholder="Confirm your password"]').type('Jenish@1234_');
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.contains('Continue to Verification').click();
    cy.contains('Email already exists').should('be.visible');
    cy.url().should('include', '/signup');
  });


  // -------------------------------------------------------------
  // 7. NEW EMAIL → SHOW OTP VERIFICATION FORM
  // -------------------------------------------------------------
  it('Should show OTP verification form after clicking Continue with a new email', () => {

    const randomEmail = `test${Date.now()}@gmail.com`;
    cy.get('input[placeholder="Enter your full name"]').type('Test User');
    cy.get('input[placeholder="you@example.com"]').type(randomEmail);
    cy.get('input[placeholder="Create a strong password"]').type('Test@12345_');
    cy.get('input[placeholder="Confirm your password"]').type('Test@12345_');

    cy.get('input[type="checkbox"]').check({ force: true });
    cy.contains('Continue to Verification').click();

    cy.get('div').contains('Enter OTP Code').should('be.visible');

    cy.contains('Verify & Create Account').should('be.visible');
    cy.get('input[maxlength="1"]').should('have.length', 6);
    cy.contains('@').should('exist');
  });


  // -------------------------------------------------------------
  // 8. NAVIGATE TO LOGIN
  // -------------------------------------------------------------
  it('Should navigate to Login page when clicking "Log In"', () => {
    cy.contains('Log In').click();
    cy.url().should('include', '/login');
  });

  // -------------------------------------------------------------
  // 9. OTP SHOULD NOT ALLOW NON-NUMERIC INPUT
  // -------------------------------------------------------------
  it('Should NOT allow non-numeric characters in OTP inputs', () => {
    const randomEmail = `user${Date.now()}@gmail.com`;

    cy.get('input[placeholder="Enter your full name"]').type('Test User');
    cy.get('input[placeholder="you@example.com"]').type(randomEmail);
    cy.get('input[placeholder="Create a strong password"]').type('Test@1234_');
    cy.get('input[placeholder="Confirm your password"]').type('Test@1234_');
    cy.get('input[type="checkbox"]').check({ force: true });

    cy.contains('Continue to Verification').click();

    cy.get('input[maxlength="1"]').eq(0).type('a').should('have.value', '');
    cy.get('input[maxlength="1"]').eq(1).type('@').should('have.value', '');

    cy.get('input[maxlength="1"]').eq(0).type('5').should('have.value', '5');
  });


  // -------------------------------------------------------------
  // 10. INCOMPLETE OTP → Should stay on page with NO error
  // -------------------------------------------------------------
  it('Should not navigate and show no error when OTP is incomplete', () => {
    const newEmail = `incomplete${Date.now()}@gmail.com`;

    cy.get('input[placeholder="Enter your full name"]').type('Test User');
    cy.get('input[placeholder="you@example.com"]').type(newEmail);
    cy.get('input[placeholder="Create a strong password"]').type('OtpTest@1234');
    cy.get('input[placeholder="Confirm your password"]').type('OtpTest@1234');
    cy.get('input[type="checkbox"]').check({ force: true });

    cy.contains('Continue to Verification').click();
    cy.get('input[maxlength="1"]').eq(0).type('1');
    cy.get('input[maxlength="1"]').eq(1).type('2');

    cy.contains('Verify & Create Account').click({ force: true });
    cy.contains('Enter OTP Code').should('be.visible');
    cy.contains('Invalid or expired OTP').should('not.exist');
    cy.url().should('not.include', '/dashboard');
  });


  // -------------------------------------------------------------
  // 11. AUTO-FOCUS TO NEXT OTP INPUT
  // -------------------------------------------------------------
  it('Should auto-focus to next OTP input after typing a digit', () => {
    const newEmail = `autofocus${Date.now()}@gmail.com`;

    cy.get('input[placeholder="Enter your full name"]').type('Test User');
    cy.get('input[placeholder="you@example.com"]').type(newEmail);
    cy.get('input[placeholder="Create a strong password"]').type('Otp@12345');
    cy.get('input[placeholder="Confirm your password"]').type('Otp@12345');
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.contains('Continue to Verification').click();

    cy.get('input[maxlength="1"]').eq(0).type('5');
    cy.get('input[maxlength="1"]').eq(1).should('be.focused');
    cy.focused().type('8');
    cy.get('input[maxlength="1"]').eq(2).should('be.focused');

  });

  // -------------------------------------------------------------
  // 12. BACK TO SIGNUP FROM OTP SCREEN
  // -------------------------------------------------------------
  it('Should navigate back to Signup page when clicking Back to Signup', () => {
    const randomEmail = `user${Date.now()}@gmail.com`;

    cy.get('input[placeholder="Enter your full name"]').type('Test User');
    cy.get('input[placeholder="you@example.com"]').type(randomEmail);
    cy.get('input[placeholder="Create a strong password"]').type('Test@1234_');
    cy.get('input[placeholder="Confirm your password"]').type('Test@1234_');
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.contains('Continue to Verification').click();

    cy.contains('Back to Signup').click();
    cy.contains('Create Account').should('be.visible');
  });

});
