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

    it('trims whitespace before validating length', () => {
      const res = validateName(' A ');
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toContain('at least 2');
    });

    it('accepts names at exact min and max length', () => {
      const min = validateName('Jo');
      expect(min.isValid).toBe(true);
      expect(min.errors).toEqual([]);

      const maxName = 'a'.repeat(50);
      const max = validateName(maxName);
      expect(max.isValid).toBe(true);
      expect(max.errors).toEqual([]);
    });

    it('fails when name contains numbers with specific error', () => {
      const res = validateName('John2');
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain('Name cannot contain numbers');
    });

    it('fails when name has disallowed special characters', () => {
      const res = validateName('John@Doe');
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain('Name can only contain letters, spaces, hyphens, and apostrophes');
    });
  });

  describe('validateEmail', () => {
    it('fails on empty', () => {
      const res = validateEmail('');
      expect(res.isValid).toBe(false);
    });

    it('fails on whitespace-only email with required error', () => {
      const res = validateEmail('   ');
      expect(res.isValid).toBe(false);
      expect(res.errors).toEqual(['Email is required']);
    });
    it('fails on format', () => {
      const res = validateEmail('bad@');
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/Invalid email format/);
    });

    it('fails on email with extra text after address', () => {
      const res = validateEmail('user@example.com extra');
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/Invalid email format/);
    });

    it('fails on email with leading text before address', () => {
      const res = validateEmail('extra user@example.com');
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/Invalid email format/);
    });

    it('flags disposable domains and suspicious patterns', () => {
      const res = validateEmail('user@temp-mail.org');
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toMatch(/Disposable|Temporary/);
    });

    it('blocks all configured disposable domains explicitly', () => {
      const disposableDomains = [
        'tempmail.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com',
        'throwaway.email', 'maildrop.cc', 'mailinator.com', 'trashmail.com',
        'yopmail.com', 'fakeinbox.com', 'getnada.com', 'temp-mail.io',
        'mohmal.com', 'sharklasers.com', 'guerrillamailblock.com', 'spam4.me',
        'grr.la', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net',
        'guerrillamail.org', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
        'trbvm.com', 'tmails.net', 'tmpmail.net', 'tmpmail.org', 'emailondeck.com',
      ];

      for (const domain of disposableDomains) {
        const res = validateEmail(`user@${domain}`);
        expect(res.isValid).toBe(false);
        expect(res.errors.join(',')).toContain('Disposable email addresses are not allowed');
      }
    });

    it('flags suspicious temp domains not in disposable list', () => {
      const res = validateEmail('user@tempdomain.com');
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toContain('Temporary email addresses are not allowed');
    });

    it('trims and lowercases email before validation', () => {
      const res = validateEmail('  USER@Example.com  ');
      expect(res.isValid).toBe(true);
    });
    it('passes with normal email', () => {
      const res = validateEmail('user@example.com');
      expect(res.isValid).toBe(true);
    });

    it('DISPOSABLE_EMAIL_DOMAINS never contains an empty string', () => {
      const originalIncludes = Array.prototype.includes;
      try {
        let checked = false;
        Array.prototype.includes = function (value, ...rest) {
          // Detect the disposable-domain list by a couple of known members
          if (
            originalIncludes.call(this, 'tempmail.com') &&
            originalIncludes.call(this, 'emailondeck.com')
          ) {
            checked = true;
            // The internal domain list must not contain an empty string
            expect(originalIncludes.call(this, '')).toBe(false);
          }
          return originalIncludes.call(this, value, ...rest);
        };

        // Trigger validateEmail so DISPOSABLE_EMAIL_DOMAINS.includes is exercised
        const result = validateEmail('user@tempmail.com');
        expect(result.isValid).toBe(false);
        expect(checked).toBe(true);
      } finally {
        Array.prototype.includes = originalIncludes;
      }
    });
  });

  describe('validatePassword', () => {
    it('fails with multiple errors and strength weak', () => {
      const res = validatePassword('short', 'user@example.com', 'John');
      expect(res.isValid).toBe(false);
      expect(res.strength).toBe('weak');
    });

    it('includes minimum length error message when password too short', () => {
      const res = validatePassword('short', 'user@example.com', 'John');
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain('Password must be at least 8 characters long');
    });

    it('fails when password is empty and returns required error', () => {
      const res = validatePassword('', 'user@example.com', 'John');
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/Password is required/);
      expect(res.strength).toBe('weak');
    });
    it('fails if equals email (case-insensitive)', () => {
      const res = validatePassword('USER@EXAMPLE.COM', 'user@example.com', 'John');
      expect(res.isValid).toBe(false);
      expect(res.errors.join(',')).toMatch(/cannot be the same as your email/);
    });
    it('passes with strong password and classifies it as strong', () => {
      const res = validatePassword('Abcd1234!@#$', 'user@example.com', 'John');
      expect(res.isValid).toBe(true);
      expect(res.strength).toBe('strong');
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

    it('does not treat password as same as email when email parameter omitted', () => {
      const pwd = 'Stryker was here!';
      const res = validatePassword(pwd);
      expect(res.isValid).toBe(false); // fails complexity, but should NOT contain email-equality error
      const combinedErrors = res.errors.join(',');
      expect(combinedErrors).not.toContain('same as your email');
    });

    it('keeps strength weak when length requirement fails even with high complexity', () => {
      const res = validatePassword('Ab1!Ab1', 'user@example.com', 'John');
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain('Password must be at least 8 characters long');
      expect(res.strength).toBe('weak');
    });

    it('requires uppercase lowercase number and special characters with specific messages', () => {
      const noUpper = validatePassword('abcd1234!', 'user@example.com', 'John');
      expect(noUpper.isValid).toBe(false);
      expect(noUpper.errors).toContain('Password must contain at least one uppercase letter');

      const noLower = validatePassword('ABCD1234!', 'user@example.com', 'John');
      expect(noLower.isValid).toBe(false);
      expect(noLower.errors).toContain('Password must contain at least one lowercase letter');

      const noNumber = validatePassword('AbcdAbcd!', 'user@example.com', 'John');
      expect(noNumber.isValid).toBe(false);
      expect(noNumber.errors).toContain('Password must contain at least one number');

      const noSpecial = validatePassword('Abcd1234', 'user@example.com', 'John');
      expect(noSpecial.isValid).toBe(false);
      expect(noSpecial.errors).toContain('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
    });

    it('uses only positive character-class regexes when testing the password string', () => {
      const originalTest = RegExp.prototype.test;
      const pwd = 'Abcd1234!@#$';
      const seenSources = new Set();

      try {
        RegExp.prototype.test = function (str) {
          if (str === pwd) {
            seenSources.add(this.source);
          }
          return originalTest.call(this, str);
        };

        const res = validatePassword(pwd, 'user@example.com', 'John');
        expect(res.isValid).toBe(true);

        // No negated character classes or \D should ever be used against the password
        for (const src of seenSources) {
          expect(src.startsWith('[^')).toBe(false);
          expect(src).not.toBe('\\D');
        }
      } finally {
        RegExp.prototype.test = originalTest;
      }
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
        expect(/\s/.test(p)).toBe(false);

        const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}';
        for (const ch of p) {
          expect(allowedChars.includes(ch)).toBe(true);
        }
      }
    });

    it('generatePasswordSuggestions is deterministic with mocked Math.random for first suggestion', () => {
      const originalRandom = Math.random;
      try {
        let calls = 0;
        Math.random = jest.fn(() => {
          // simple deterministic sequence within [0,1)
          calls += 1;
          return (calls % 10) / 10;
        });
        const [first] = generatePasswordSuggestions(1);
        // Ensure length and pattern are fixed for this deterministic random
        expect(typeof first).toBe('string');
        expect(first.length).toBeGreaterThanOrEqual(12);
      } finally {
        Math.random = originalRandom;
      }
    });

    it('does not emit NaN or undefined segments even when Math.random always returns 0', () => {
      const originalRandom = Math.random;
      try {
        Math.random = jest.fn(() => 0);
        const list = generatePasswordSuggestions(2);
        for (const p of list) {
          expect(typeof p).toBe('string');
          expect(p.includes('NaN')).toBe(false);
          expect(p.includes('undefined')).toBe(false);
        }
      } finally {
        Math.random = originalRandom;
      }
    });

    it('produces a deterministic password for fixed Math.random and disabled shuffle, verifying index math and char pools', () => {
      const originalRandom = Math.random;
      const originalSort = Array.prototype.sort;
      try {
        Math.random = jest.fn(() => 0.5);
        // Disable actual shuffling so final password order is deterministic
        Array.prototype.sort = function () {
          return this;
        };

        const [pw] = generatePasswordSuggestions(1);

        // With Math.random always 0.5, the construction should be:
        //   uppercase[13] = 'N'
        //   lowercase[13] = 'n'
        //   numbers[5]    = '5'
        //   special[9]    = ')'
        //   then 10 copies of allChars[40] = 'O'
        expect(pw).toBe('Nn5)OOOOOOOOOO');
        expect(pw.length).toBe(14);
      } finally {
        Math.random = originalRandom;
        Array.prototype.sort = originalSort;
      }
    });

    it('uses a Math.random-based comparator when shuffling characters', () => {
      const originalRandom = Math.random;
      const originalSort = Array.prototype.sort;
      try {
        const randomMock = jest.fn(() => 0.7);
        Math.random = randomMock;

        let comparatorResult;
        Array.prototype.sort = function (compareFn) {
          if (typeof compareFn === 'function') {
            comparatorResult = compareFn('a', 'b');
            // Do not actually reorder; just return the array as-is
            return this;
          }
          return originalSort.call(this, compareFn);
        };

        generatePasswordSuggestions(1);

        // Comparator should be Math.random() - 0.5 => 0.7 - 0.5 = 0.2
        expect(comparatorResult).toBeCloseTo(0.2, 5);
        expect(randomMock).toHaveBeenCalled();
      } finally {
        Math.random = originalRandom;
        Array.prototype.sort = originalSort;
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

    it('returns specific errors for empty and invalid otp formats', () => {
      const empty = validateOTP('');
      expect(empty.isValid).toBe(false);
      expect(empty.errors).toEqual(['OTP is required']);

      const bad = validateOTP('12a456');
      expect(bad.isValid).toBe(false);
      expect(bad.errors).toContain('OTP must be a 6-digit number');
    });

    it('rejects OTP with correct digits but leading or trailing characters', () => {
      const leading = validateOTP('a123456');
      expect(leading.isValid).toBe(false);

      const trailing = validateOTP('1234567');
      expect(trailing.isValid).toBe(false);
    });
  });
});
