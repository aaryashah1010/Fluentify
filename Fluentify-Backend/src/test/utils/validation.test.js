import { jest } from '@jest/globals';

const { validateName, validateEmail, validatePassword, generatePasswordSuggestions, validateOTP } = await import('../../utils/validation.js');

describe('utils/validation', () => {
  describe('validateName', () => {
    it('fails on empty and returns specific error', () => {
      const res = validateName('   ');
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/Name is required/);
    });
    it('fails on too short name', () => {
      const res = validateName('A');
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toContain('at least 2');
    });
    it('passes with proper name', () => {
      const res = validateName("John Doe");
      expect(res.isValid).toBe(true);
      expect(res.errors).toEqual([]);
    });

    it('fails when name exceeds 50 characters', () => {
      const longName = 'a'.repeat(51);
      const res = validateName(longName);
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toMatch(/must not exceed 50/);
    });

    it('fails when multiple consecutive spaces present', () => {
      const res = validateName('John  Doe');
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toMatch(/multiple consecutive spaces/);
    });
  });

  describe('validateEmail', () => {
    it('fails on empty', () => {
      const res = validateEmail('');
      expect(res.isValid).toBe(false);
    });
    it('fails on format', () => {
      const res = validateEmail('bad@');
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/Invalid email format/);
    });
    it('flags disposable domains and suspicious patterns', () => {
      const res = validateEmail('user@temp-mail.org');
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toMatch(/Disposable|Temporary/);
    });
    it('passes with normal email', () => {
      const res = validateEmail('user@example.com');
      expect(res.isValid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('fails with multiple errors and strength weak', () => {
      const res = validatePassword('short', 'user@example.com', 'John');
      expect(res.isValid).toBe(false);
      expect(res.strength).toBe('weak');
    });

    it('fails when password is empty and returns required error', () => {
      const res = validatePassword('', 'user@example.com', 'John');
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/Password is required/);
    });
    it('fails if equals email (case-insensitive)', () => {
      const res = validatePassword('USER@EXAMPLE.COM', 'user@example.com', 'John');
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toMatch(/cannot be the same as your email/);
    });
    it('passes with strong password', () => {
      const res = validatePassword('Abcd1234!@#$', 'user@example.com', 'John');
      expect(res.isValid).toBe(true);
      expect(['medium','strong']).toContain(res.strength);
    });

    it('passes with medium strength password (no length bonus)', () => {
      // 8 chars with all types -> score 0 + 4 + 1 = 5 => medium
      const res = validatePassword('Aa1!aa1!', 'user@example.com', 'John');
      expect(res.isValid).toBe(true);
      expect(res.strength).toBe('medium');
    });

    it('passes with medium strength password using 10-char length bonus', () => {
      // 10 chars with all types -> score 1 (length) + 4 (complexity) + 1 (types) = 6 => medium
      const res = validatePassword('Aa1!Aa1!Aa', 'user@example.com', 'John');
      expect(res.isValid).toBe(true);
      expect(res.strength).toBe('medium');
    });

    it('uses default email and name parameters when not provided', () => {
      const res = validatePassword('Abcd1234!@#$');
      expect(res.isValid).toBe(true);
      expect(['medium', 'strong']).toContain(res.strength);
    });
  });

  describe('generatePasswordSuggestions', () => {
    it('generates requested number', () => {
      const list = generatePasswordSuggestions(5);
      expect(list).toHaveLength(5);
      for (const p of list) expect(typeof p).toBe('string');
    });

    it('uses default count of 3 suggestions', () => {
      const list = generatePasswordSuggestions();
      expect(list).toHaveLength(3);
    });

    it('each suggestion has required character types and minimum length', () => {
      const list = generatePasswordSuggestions(2);
      for (const p of list) {
        expect(p.length).toBeGreaterThanOrEqual(12);
        expect(/[A-Z]/.test(p)).toBe(true);
        expect(/[a-z]/.test(p)).toBe(true);
        expect(/\d/.test(p)).toBe(true);
        expect(/[!@#$%^&*()_+\-=\[\]{}]/.test(p)).toBe(true);
      }
    });
  });

  describe('validateOTP', () => {
    it('requires 6 digits', () => {
      expect(validateOTP('').isValid).toBe(false);
      expect(validateOTP('123').isValid).toBe(false);
      expect(validateOTP('12345a').isValid).toBe(false);
      expect(validateOTP('123456').isValid).toBe(true);
    });
  });
});
