describe('Fluentify Landing Page Tests', () => {

  const BASE_URL = 'https://fluentify-rho.vercel.app/';

  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it('Landing page loads successfully', () => {
    cy.contains('Start Your Journey').should('be.visible');
    cy.contains('Unlock Your Voice').should('be.visible');
  });

  it('Navbar buttons should be visible', () => {
    cy.contains('Features').should('be.visible');
    cy.contains('How It Works').should('be.visible');
    cy.contains('Languages').should('be.visible');
    cy.contains('Log In').should('be.visible');
    cy.contains('Get Started').should('be.visible');
  });

  it('Clicking Get Started navigates to Signup page', () => {
    cy.contains('Get Started').click();
    cy.url().should('include', '/signup');   // Adjust route if different
  });

  it('Clicking Start Learning button navigates to Signup page', () => {
    cy.contains('Start Learning').first().click();
    cy.url().should('include', '/signup');   // Adjust route if needed
  });

  it('Clicking Log In navigates to Login page', () => {
    cy.contains('Log In').click();
    cy.url().should('include', '/login');    // Adjust route if different
  });

});
