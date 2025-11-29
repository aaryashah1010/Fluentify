/**
 * Validation utilities for authentication
 */
// @ts-nocheck


// List of disposable/temporary email domains to block
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
const DISPOSABLE_EMAIL_DOMAINS = stryMutAct_9fa48("4520") ? [] : (stryCov_9fa48("4520"), [stryMutAct_9fa48("4521") ? "" : (stryCov_9fa48("4521"), 'tempmail.com'), stryMutAct_9fa48("4522") ? "" : (stryCov_9fa48("4522"), 'temp-mail.org'), stryMutAct_9fa48("4523") ? "" : (stryCov_9fa48("4523"), 'guerrillamail.com'), stryMutAct_9fa48("4524") ? "" : (stryCov_9fa48("4524"), '10minutemail.com'), stryMutAct_9fa48("4525") ? "" : (stryCov_9fa48("4525"), 'throwaway.email'), stryMutAct_9fa48("4526") ? "" : (stryCov_9fa48("4526"), 'maildrop.cc'), stryMutAct_9fa48("4527") ? "" : (stryCov_9fa48("4527"), 'mailinator.com'), stryMutAct_9fa48("4528") ? "" : (stryCov_9fa48("4528"), 'trashmail.com'), stryMutAct_9fa48("4529") ? "" : (stryCov_9fa48("4529"), 'yopmail.com'), stryMutAct_9fa48("4530") ? "" : (stryCov_9fa48("4530"), 'fakeinbox.com'), stryMutAct_9fa48("4531") ? "" : (stryCov_9fa48("4531"), 'getnada.com'), stryMutAct_9fa48("4532") ? "" : (stryCov_9fa48("4532"), 'temp-mail.io'), stryMutAct_9fa48("4533") ? "" : (stryCov_9fa48("4533"), 'mohmal.com'), stryMutAct_9fa48("4534") ? "" : (stryCov_9fa48("4534"), 'sharklasers.com'), stryMutAct_9fa48("4535") ? "" : (stryCov_9fa48("4535"), 'guerrillamailblock.com'), stryMutAct_9fa48("4536") ? "" : (stryCov_9fa48("4536"), 'spam4.me'), stryMutAct_9fa48("4537") ? "" : (stryCov_9fa48("4537"), 'grr.la'), stryMutAct_9fa48("4538") ? "" : (stryCov_9fa48("4538"), 'guerrillamail.biz'), stryMutAct_9fa48("4539") ? "" : (stryCov_9fa48("4539"), 'guerrillamail.de'), stryMutAct_9fa48("4540") ? "" : (stryCov_9fa48("4540"), 'guerrillamail.net'), stryMutAct_9fa48("4541") ? "" : (stryCov_9fa48("4541"), 'guerrillamail.org'), stryMutAct_9fa48("4542") ? "" : (stryCov_9fa48("4542"), 'guerrillamailblock.com'), stryMutAct_9fa48("4543") ? "" : (stryCov_9fa48("4543"), 'pokemail.net'), stryMutAct_9fa48("4544") ? "" : (stryCov_9fa48("4544"), 'spam4.me'), stryMutAct_9fa48("4545") ? "" : (stryCov_9fa48("4545"), 'trbvm.com'), stryMutAct_9fa48("4546") ? "" : (stryCov_9fa48("4546"), 'tmails.net'), stryMutAct_9fa48("4547") ? "" : (stryCov_9fa48("4547"), 'tmpmail.net'), stryMutAct_9fa48("4548") ? "" : (stryCov_9fa48("4548"), 'tmpmail.org'), stryMutAct_9fa48("4549") ? "" : (stryCov_9fa48("4549"), 'emailondeck.com')]);

/**
 * Validate name - no special characters, no numbers, only letters and spaces
 */
export function validateName(name) {
  if (stryMutAct_9fa48("4550")) {
    {}
  } else {
    stryCov_9fa48("4550");
    const errors = stryMutAct_9fa48("4551") ? ["Stryker was here"] : (stryCov_9fa48("4551"), []);
    if (stryMutAct_9fa48("4554") ? !name && !name.trim() : stryMutAct_9fa48("4553") ? false : stryMutAct_9fa48("4552") ? true : (stryCov_9fa48("4552", "4553", "4554"), (stryMutAct_9fa48("4555") ? name : (stryCov_9fa48("4555"), !name)) || (stryMutAct_9fa48("4556") ? name.trim() : (stryCov_9fa48("4556"), !(stryMutAct_9fa48("4557") ? name : (stryCov_9fa48("4557"), name.trim())))))) {
      if (stryMutAct_9fa48("4558")) {
        {}
      } else {
        stryCov_9fa48("4558");
        errors.push(stryMutAct_9fa48("4559") ? "" : (stryCov_9fa48("4559"), 'Name is required'));
        return stryMutAct_9fa48("4560") ? {} : (stryCov_9fa48("4560"), {
          isValid: stryMutAct_9fa48("4561") ? true : (stryCov_9fa48("4561"), false),
          errors
        });
      }
    }
    const trimmedName = stryMutAct_9fa48("4562") ? name : (stryCov_9fa48("4562"), name.trim());

    // Check for minimum length
    if (stryMutAct_9fa48("4566") ? trimmedName.length >= 2 : stryMutAct_9fa48("4565") ? trimmedName.length <= 2 : stryMutAct_9fa48("4564") ? false : stryMutAct_9fa48("4563") ? true : (stryCov_9fa48("4563", "4564", "4565", "4566"), trimmedName.length < 2)) {
      if (stryMutAct_9fa48("4567")) {
        {}
      } else {
        stryCov_9fa48("4567");
        errors.push(stryMutAct_9fa48("4568") ? "" : (stryCov_9fa48("4568"), 'Name must be at least 2 characters long'));
      }
    }

    // Check for maximum length
    if (stryMutAct_9fa48("4572") ? trimmedName.length <= 50 : stryMutAct_9fa48("4571") ? trimmedName.length >= 50 : stryMutAct_9fa48("4570") ? false : stryMutAct_9fa48("4569") ? true : (stryCov_9fa48("4569", "4570", "4571", "4572"), trimmedName.length > 50)) {
      if (stryMutAct_9fa48("4573")) {
        {}
      } else {
        stryCov_9fa48("4573");
        errors.push(stryMutAct_9fa48("4574") ? "" : (stryCov_9fa48("4574"), 'Name must not exceed 50 characters'));
      }
    }

    // Check for numbers
    if (stryMutAct_9fa48("4576") ? false : stryMutAct_9fa48("4575") ? true : (stryCov_9fa48("4575", "4576"), (stryMutAct_9fa48("4577") ? /\D/ : (stryCov_9fa48("4577"), /\d/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4578")) {
        {}
      } else {
        stryCov_9fa48("4578");
        errors.push(stryMutAct_9fa48("4579") ? "" : (stryCov_9fa48("4579"), 'Name cannot contain numbers'));
      }
    }

    // Check for special characters (allow only letters, spaces, hyphens, and apostrophes)
    if (stryMutAct_9fa48("4582") ? false : stryMutAct_9fa48("4581") ? true : stryMutAct_9fa48("4580") ? /^[a-zA-Z\s'-]+$/.test(trimmedName) : (stryCov_9fa48("4580", "4581", "4582"), !(stryMutAct_9fa48("4587") ? /^[a-zA-Z\S'-]+$/ : stryMutAct_9fa48("4586") ? /^[^a-zA-Z\s'-]+$/ : stryMutAct_9fa48("4585") ? /^[a-zA-Z\s'-]$/ : stryMutAct_9fa48("4584") ? /^[a-zA-Z\s'-]+/ : stryMutAct_9fa48("4583") ? /[a-zA-Z\s'-]+$/ : (stryCov_9fa48("4583", "4584", "4585", "4586", "4587"), /^[a-zA-Z\s'-]+$/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4588")) {
        {}
      } else {
        stryCov_9fa48("4588");
        errors.push(stryMutAct_9fa48("4589") ? "" : (stryCov_9fa48("4589"), 'Name can only contain letters, spaces, hyphens, and apostrophes'));
      }
    }

    // Check for multiple consecutive spaces
    if (stryMutAct_9fa48("4591") ? false : stryMutAct_9fa48("4590") ? true : (stryCov_9fa48("4590", "4591"), (stryMutAct_9fa48("4593") ? /\S{2,}/ : stryMutAct_9fa48("4592") ? /\s/ : (stryCov_9fa48("4592", "4593"), /\s{2,}/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4594")) {
        {}
      } else {
        stryCov_9fa48("4594");
        errors.push(stryMutAct_9fa48("4595") ? "" : (stryCov_9fa48("4595"), 'Name cannot contain multiple consecutive spaces'));
      }
    }
    return stryMutAct_9fa48("4596") ? {} : (stryCov_9fa48("4596"), {
      isValid: stryMutAct_9fa48("4599") ? errors.length !== 0 : stryMutAct_9fa48("4598") ? false : stryMutAct_9fa48("4597") ? true : (stryCov_9fa48("4597", "4598", "4599"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate email - check format and block disposable emails
 */
export function validateEmail(email) {
  if (stryMutAct_9fa48("4600")) {
    {}
  } else {
    stryCov_9fa48("4600");
    const errors = stryMutAct_9fa48("4601") ? ["Stryker was here"] : (stryCov_9fa48("4601"), []);
    if (stryMutAct_9fa48("4604") ? !email && !email.trim() : stryMutAct_9fa48("4603") ? false : stryMutAct_9fa48("4602") ? true : (stryCov_9fa48("4602", "4603", "4604"), (stryMutAct_9fa48("4605") ? email : (stryCov_9fa48("4605"), !email)) || (stryMutAct_9fa48("4606") ? email.trim() : (stryCov_9fa48("4606"), !(stryMutAct_9fa48("4607") ? email : (stryCov_9fa48("4607"), email.trim())))))) {
      if (stryMutAct_9fa48("4608")) {
        {}
      } else {
        stryCov_9fa48("4608");
        errors.push(stryMutAct_9fa48("4609") ? "" : (stryCov_9fa48("4609"), 'Email is required'));
        return stryMutAct_9fa48("4610") ? {} : (stryCov_9fa48("4610"), {
          isValid: stryMutAct_9fa48("4611") ? true : (stryCov_9fa48("4611"), false),
          errors
        });
      }
    }
    const trimmedEmail = stryMutAct_9fa48("4613") ? email.toLowerCase() : stryMutAct_9fa48("4612") ? email.trim().toUpperCase() : (stryCov_9fa48("4612", "4613"), email.trim().toLowerCase());

    // Basic email format validation
    const emailRegex = stryMutAct_9fa48("4624") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("4623") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("4622") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("4621") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("4620") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4619") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("4618") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4617") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4616") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4615") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("4614") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("4614", "4615", "4616", "4617", "4618", "4619", "4620", "4621", "4622", "4623", "4624"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (stryMutAct_9fa48("4627") ? false : stryMutAct_9fa48("4626") ? true : stryMutAct_9fa48("4625") ? emailRegex.test(trimmedEmail) : (stryCov_9fa48("4625", "4626", "4627"), !emailRegex.test(trimmedEmail))) {
      if (stryMutAct_9fa48("4628")) {
        {}
      } else {
        stryCov_9fa48("4628");
        errors.push(stryMutAct_9fa48("4629") ? "" : (stryCov_9fa48("4629"), 'Invalid email format'));
        return stryMutAct_9fa48("4630") ? {} : (stryCov_9fa48("4630"), {
          isValid: stryMutAct_9fa48("4631") ? true : (stryCov_9fa48("4631"), false),
          errors
        });
      }
    }

    // Extract domain
    const domain = trimmedEmail.split(stryMutAct_9fa48("4632") ? "" : (stryCov_9fa48("4632"), '@'))[1];

    // Check if it's a disposable email
    if (stryMutAct_9fa48("4634") ? false : stryMutAct_9fa48("4633") ? true : (stryCov_9fa48("4633", "4634"), DISPOSABLE_EMAIL_DOMAINS.includes(domain))) {
      if (stryMutAct_9fa48("4635")) {
        {}
      } else {
        stryCov_9fa48("4635");
        errors.push(stryMutAct_9fa48("4636") ? "" : (stryCov_9fa48("4636"), 'Disposable email addresses are not allowed. Please use a permanent email address'));
      }
    }

    // Additional checks for suspicious patterns
    if (stryMutAct_9fa48("4639") ? (domain.includes('temp') || domain.includes('fake')) && domain.includes('trash') : stryMutAct_9fa48("4638") ? false : stryMutAct_9fa48("4637") ? true : (stryCov_9fa48("4637", "4638", "4639"), (stryMutAct_9fa48("4641") ? domain.includes('temp') && domain.includes('fake') : stryMutAct_9fa48("4640") ? false : (stryCov_9fa48("4640", "4641"), domain.includes(stryMutAct_9fa48("4642") ? "" : (stryCov_9fa48("4642"), 'temp')) || domain.includes(stryMutAct_9fa48("4643") ? "" : (stryCov_9fa48("4643"), 'fake')))) || domain.includes(stryMutAct_9fa48("4644") ? "" : (stryCov_9fa48("4644"), 'trash')))) {
      if (stryMutAct_9fa48("4645")) {
        {}
      } else {
        stryCov_9fa48("4645");
        errors.push(stryMutAct_9fa48("4646") ? "" : (stryCov_9fa48("4646"), 'Temporary email addresses are not allowed. Please use a permanent email address'));
      }
    }
    return stryMutAct_9fa48("4647") ? {} : (stryCov_9fa48("4647"), {
      isValid: stryMutAct_9fa48("4650") ? errors.length !== 0 : stryMutAct_9fa48("4649") ? false : stryMutAct_9fa48("4648") ? true : (stryCov_9fa48("4648", "4649", "4650"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 * - Not same as email or name
 */
export function validatePassword(password, email = stryMutAct_9fa48("4651") ? "Stryker was here!" : (stryCov_9fa48("4651"), ''), name = stryMutAct_9fa48("4652") ? "Stryker was here!" : (stryCov_9fa48("4652"), '')) {
  if (stryMutAct_9fa48("4653")) {
    {}
  } else {
    stryCov_9fa48("4653");
    const errors = stryMutAct_9fa48("4654") ? ["Stryker was here"] : (stryCov_9fa48("4654"), []);
    if (stryMutAct_9fa48("4657") ? false : stryMutAct_9fa48("4656") ? true : stryMutAct_9fa48("4655") ? password : (stryCov_9fa48("4655", "4656", "4657"), !password)) {
      if (stryMutAct_9fa48("4658")) {
        {}
      } else {
        stryCov_9fa48("4658");
        errors.push(stryMutAct_9fa48("4659") ? "" : (stryCov_9fa48("4659"), 'Password is required'));
        return stryMutAct_9fa48("4660") ? {} : (stryCov_9fa48("4660"), {
          isValid: stryMutAct_9fa48("4661") ? true : (stryCov_9fa48("4661"), false),
          errors,
          strength: stryMutAct_9fa48("4662") ? "" : (stryCov_9fa48("4662"), 'weak')
        });
      }
    }

    // Check minimum length
    if (stryMutAct_9fa48("4666") ? password.length >= 8 : stryMutAct_9fa48("4665") ? password.length <= 8 : stryMutAct_9fa48("4664") ? false : stryMutAct_9fa48("4663") ? true : (stryCov_9fa48("4663", "4664", "4665", "4666"), password.length < 8)) {
      if (stryMutAct_9fa48("4667")) {
        {}
      } else {
        stryCov_9fa48("4667");
        errors.push(stryMutAct_9fa48("4668") ? "" : (stryCov_9fa48("4668"), 'Password must be at least 8 characters long'));
      }
    }

    // Check for uppercase letter
    if (stryMutAct_9fa48("4671") ? false : stryMutAct_9fa48("4670") ? true : stryMutAct_9fa48("4669") ? /[A-Z]/.test(password) : (stryCov_9fa48("4669", "4670", "4671"), !(stryMutAct_9fa48("4672") ? /[^A-Z]/ : (stryCov_9fa48("4672"), /[A-Z]/)).test(password))) {
      if (stryMutAct_9fa48("4673")) {
        {}
      } else {
        stryCov_9fa48("4673");
        errors.push(stryMutAct_9fa48("4674") ? "" : (stryCov_9fa48("4674"), 'Password must contain at least one uppercase letter'));
      }
    }

    // Check for lowercase letter
    if (stryMutAct_9fa48("4677") ? false : stryMutAct_9fa48("4676") ? true : stryMutAct_9fa48("4675") ? /[a-z]/.test(password) : (stryCov_9fa48("4675", "4676", "4677"), !(stryMutAct_9fa48("4678") ? /[^a-z]/ : (stryCov_9fa48("4678"), /[a-z]/)).test(password))) {
      if (stryMutAct_9fa48("4679")) {
        {}
      } else {
        stryCov_9fa48("4679");
        errors.push(stryMutAct_9fa48("4680") ? "" : (stryCov_9fa48("4680"), 'Password must contain at least one lowercase letter'));
      }
    }

    // Check for number
    if (stryMutAct_9fa48("4683") ? false : stryMutAct_9fa48("4682") ? true : stryMutAct_9fa48("4681") ? /\d/.test(password) : (stryCov_9fa48("4681", "4682", "4683"), !(stryMutAct_9fa48("4684") ? /\D/ : (stryCov_9fa48("4684"), /\d/)).test(password))) {
      if (stryMutAct_9fa48("4685")) {
        {}
      } else {
        stryCov_9fa48("4685");
        errors.push(stryMutAct_9fa48("4686") ? "" : (stryCov_9fa48("4686"), 'Password must contain at least one number'));
      }
    }

    // Check for special character
    if (stryMutAct_9fa48("4689") ? false : stryMutAct_9fa48("4688") ? true : stryMutAct_9fa48("4687") ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) : (stryCov_9fa48("4687", "4688", "4689"), !(stryMutAct_9fa48("4690") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4690"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password))) {
      if (stryMutAct_9fa48("4691")) {
        {}
      } else {
        stryCov_9fa48("4691");
        errors.push(stryMutAct_9fa48("4692") ? "" : (stryCov_9fa48("4692"), 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'));
      }
    }

    // Check if password is same as email (case insensitive)
    if (stryMutAct_9fa48("4695") ? email || password.toLowerCase() === email.toLowerCase() : stryMutAct_9fa48("4694") ? false : stryMutAct_9fa48("4693") ? true : (stryCov_9fa48("4693", "4694", "4695"), email && (stryMutAct_9fa48("4697") ? password.toLowerCase() !== email.toLowerCase() : stryMutAct_9fa48("4696") ? true : (stryCov_9fa48("4696", "4697"), (stryMutAct_9fa48("4698") ? password.toUpperCase() : (stryCov_9fa48("4698"), password.toLowerCase())) === (stryMutAct_9fa48("4699") ? email.toUpperCase() : (stryCov_9fa48("4699"), email.toLowerCase())))))) {
      if (stryMutAct_9fa48("4700")) {
        {}
      } else {
        stryCov_9fa48("4700");
        errors.push(stryMutAct_9fa48("4701") ? "" : (stryCov_9fa48("4701"), 'Password cannot be the same as your email'));
      }
    }

    // Password can contain name - restriction removed per user request
    // Users should be able to use their name in passwords if they want

    // Calculate password strength
    let strength = stryMutAct_9fa48("4702") ? "" : (stryCov_9fa48("4702"), 'weak');
    if (stryMutAct_9fa48("4705") ? errors.length !== 0 : stryMutAct_9fa48("4704") ? false : stryMutAct_9fa48("4703") ? true : (stryCov_9fa48("4703", "4704", "4705"), errors.length === 0)) {
      if (stryMutAct_9fa48("4706")) {
        {}
      } else {
        stryCov_9fa48("4706");
        let score = 0;

        // Length bonus
        if (stryMutAct_9fa48("4710") ? password.length < 12 : stryMutAct_9fa48("4709") ? password.length > 12 : stryMutAct_9fa48("4708") ? false : stryMutAct_9fa48("4707") ? true : (stryCov_9fa48("4707", "4708", "4709", "4710"), password.length >= 12)) stryMutAct_9fa48("4711") ? score -= 2 : (stryCov_9fa48("4711"), score += 2);else if (stryMutAct_9fa48("4715") ? password.length < 10 : stryMutAct_9fa48("4714") ? password.length > 10 : stryMutAct_9fa48("4713") ? false : stryMutAct_9fa48("4712") ? true : (stryCov_9fa48("4712", "4713", "4714", "4715"), password.length >= 10)) stryMutAct_9fa48("4716") ? score -= 1 : (stryCov_9fa48("4716"), score += 1);

        // Complexity bonus
        if (stryMutAct_9fa48("4718") ? false : stryMutAct_9fa48("4717") ? true : (stryCov_9fa48("4717", "4718"), (stryMutAct_9fa48("4719") ? /[^A-Z]/ : (stryCov_9fa48("4719"), /[A-Z]/)).test(password))) stryMutAct_9fa48("4720") ? score -= 1 : (stryCov_9fa48("4720"), score += 1);
        if (stryMutAct_9fa48("4722") ? false : stryMutAct_9fa48("4721") ? true : (stryCov_9fa48("4721", "4722"), (stryMutAct_9fa48("4723") ? /[^a-z]/ : (stryCov_9fa48("4723"), /[a-z]/)).test(password))) stryMutAct_9fa48("4724") ? score -= 1 : (stryCov_9fa48("4724"), score += 1);
        if (stryMutAct_9fa48("4726") ? false : stryMutAct_9fa48("4725") ? true : (stryCov_9fa48("4725", "4726"), (stryMutAct_9fa48("4727") ? /\D/ : (stryCov_9fa48("4727"), /\d/)).test(password))) stryMutAct_9fa48("4728") ? score -= 1 : (stryCov_9fa48("4728"), score += 1);
        if (stryMutAct_9fa48("4730") ? false : stryMutAct_9fa48("4729") ? true : (stryCov_9fa48("4729", "4730"), (stryMutAct_9fa48("4731") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4731"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password))) stryMutAct_9fa48("4732") ? score -= 1 : (stryCov_9fa48("4732"), score += 1);

        // Multiple character types
        const hasMultipleTypes = stryMutAct_9fa48("4733") ? [/[A-Z]/.test(password), /[a-z]/.test(password), /\d/.test(password), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)].length : (stryCov_9fa48("4733"), (stryMutAct_9fa48("4734") ? [] : (stryCov_9fa48("4734"), [(stryMutAct_9fa48("4735") ? /[^A-Z]/ : (stryCov_9fa48("4735"), /[A-Z]/)).test(password), (stryMutAct_9fa48("4736") ? /[^a-z]/ : (stryCov_9fa48("4736"), /[a-z]/)).test(password), (stryMutAct_9fa48("4737") ? /\D/ : (stryCov_9fa48("4737"), /\d/)).test(password), (stryMutAct_9fa48("4738") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4738"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password)])).filter(Boolean).length);
        if (stryMutAct_9fa48("4742") ? hasMultipleTypes < 4 : stryMutAct_9fa48("4741") ? hasMultipleTypes > 4 : stryMutAct_9fa48("4740") ? false : stryMutAct_9fa48("4739") ? true : (stryCov_9fa48("4739", "4740", "4741", "4742"), hasMultipleTypes >= 4)) stryMutAct_9fa48("4743") ? score -= 1 : (stryCov_9fa48("4743"), score += 1);
        if (stryMutAct_9fa48("4747") ? score < 7 : stryMutAct_9fa48("4746") ? score > 7 : stryMutAct_9fa48("4745") ? false : stryMutAct_9fa48("4744") ? true : (stryCov_9fa48("4744", "4745", "4746", "4747"), score >= 7)) strength = stryMutAct_9fa48("4748") ? "" : (stryCov_9fa48("4748"), 'strong');else if (stryMutAct_9fa48("4752") ? score < 5 : stryMutAct_9fa48("4751") ? score > 5 : stryMutAct_9fa48("4750") ? false : stryMutAct_9fa48("4749") ? true : (stryCov_9fa48("4749", "4750", "4751", "4752"), score >= 5)) strength = stryMutAct_9fa48("4753") ? "" : (stryCov_9fa48("4753"), 'medium');
      }
    }
    return stryMutAct_9fa48("4754") ? {} : (stryCov_9fa48("4754"), {
      isValid: stryMutAct_9fa48("4757") ? errors.length !== 0 : stryMutAct_9fa48("4756") ? false : stryMutAct_9fa48("4755") ? true : (stryCov_9fa48("4755", "4756", "4757"), errors.length === 0),
      errors,
      strength
    });
  }
}

/**
 * Generate strong password suggestions
 */
export function generatePasswordSuggestions(count = 3) {
  if (stryMutAct_9fa48("4758")) {
    {}
  } else {
    stryCov_9fa48("4758");
    const lowercase = stryMutAct_9fa48("4759") ? "" : (stryCov_9fa48("4759"), 'abcdefghijklmnopqrstuvwxyz');
    const uppercase = stryMutAct_9fa48("4760") ? "" : (stryCov_9fa48("4760"), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    const numbers = stryMutAct_9fa48("4761") ? "" : (stryCov_9fa48("4761"), '0123456789');
    const special = stryMutAct_9fa48("4762") ? "" : (stryCov_9fa48("4762"), '!@#$%^&*()_+-=[]{}');
    const suggestions = stryMutAct_9fa48("4763") ? ["Stryker was here"] : (stryCov_9fa48("4763"), []);
    for (let i = 0; stryMutAct_9fa48("4766") ? i >= count : stryMutAct_9fa48("4765") ? i <= count : stryMutAct_9fa48("4764") ? false : (stryCov_9fa48("4764", "4765", "4766"), i < count); stryMutAct_9fa48("4767") ? i-- : (stryCov_9fa48("4767"), i++)) {
      if (stryMutAct_9fa48("4768")) {
        {}
      } else {
        stryCov_9fa48("4768");
        let password = stryMutAct_9fa48("4769") ? "Stryker was here!" : (stryCov_9fa48("4769"), '');

        // Ensure at least one of each required type
        stryMutAct_9fa48("4770") ? password -= uppercase[Math.floor(Math.random() * uppercase.length)] : (stryCov_9fa48("4770"), password += uppercase[Math.floor(stryMutAct_9fa48("4771") ? Math.random() / uppercase.length : (stryCov_9fa48("4771"), Math.random() * uppercase.length))]);
        stryMutAct_9fa48("4772") ? password -= lowercase[Math.floor(Math.random() * lowercase.length)] : (stryCov_9fa48("4772"), password += lowercase[Math.floor(stryMutAct_9fa48("4773") ? Math.random() / lowercase.length : (stryCov_9fa48("4773"), Math.random() * lowercase.length))]);
        stryMutAct_9fa48("4774") ? password -= numbers[Math.floor(Math.random() * numbers.length)] : (stryCov_9fa48("4774"), password += numbers[Math.floor(stryMutAct_9fa48("4775") ? Math.random() / numbers.length : (stryCov_9fa48("4775"), Math.random() * numbers.length))]);
        stryMutAct_9fa48("4776") ? password -= special[Math.floor(Math.random() * special.length)] : (stryCov_9fa48("4776"), password += special[Math.floor(stryMutAct_9fa48("4777") ? Math.random() / special.length : (stryCov_9fa48("4777"), Math.random() * special.length))]);

        // Fill the rest with random characters (total length 12-16)
        const allChars = stryMutAct_9fa48("4778") ? lowercase + uppercase + numbers - special : (stryCov_9fa48("4778"), (stryMutAct_9fa48("4779") ? lowercase + uppercase - numbers : (stryCov_9fa48("4779"), (stryMutAct_9fa48("4780") ? lowercase - uppercase : (stryCov_9fa48("4780"), lowercase + uppercase)) + numbers)) + special);
        const remainingLength = stryMutAct_9fa48("4781") ? 8 - Math.floor(Math.random() * 5) : (stryCov_9fa48("4781"), 8 + Math.floor(stryMutAct_9fa48("4782") ? Math.random() / 5 : (stryCov_9fa48("4782"), Math.random() * 5))); // 8-12 more characters

        for (let j = 0; stryMutAct_9fa48("4785") ? j >= remainingLength : stryMutAct_9fa48("4784") ? j <= remainingLength : stryMutAct_9fa48("4783") ? false : (stryCov_9fa48("4783", "4784", "4785"), j < remainingLength); stryMutAct_9fa48("4786") ? j-- : (stryCov_9fa48("4786"), j++)) {
          if (stryMutAct_9fa48("4787")) {
            {}
          } else {
            stryCov_9fa48("4787");
            stryMutAct_9fa48("4788") ? password -= allChars[Math.floor(Math.random() * allChars.length)] : (stryCov_9fa48("4788"), password += allChars[Math.floor(stryMutAct_9fa48("4789") ? Math.random() / allChars.length : (stryCov_9fa48("4789"), Math.random() * allChars.length))]);
          }
        }

        // Shuffle the password
        password = stryMutAct_9fa48("4790") ? password.split('').join('') : (stryCov_9fa48("4790"), password.split(stryMutAct_9fa48("4791") ? "Stryker was here!" : (stryCov_9fa48("4791"), '')).sort(stryMutAct_9fa48("4792") ? () => undefined : (stryCov_9fa48("4792"), () => stryMutAct_9fa48("4793") ? Math.random() + 0.5 : (stryCov_9fa48("4793"), Math.random() - 0.5))).join(stryMutAct_9fa48("4794") ? "Stryker was here!" : (stryCov_9fa48("4794"), '')));
        suggestions.push(password);
      }
    }
    return suggestions;
  }
}

/**
 * Validate OTP code
 */
export function validateOTP(otp) {
  if (stryMutAct_9fa48("4795")) {
    {}
  } else {
    stryCov_9fa48("4795");
    const errors = stryMutAct_9fa48("4796") ? ["Stryker was here"] : (stryCov_9fa48("4796"), []);
    if (stryMutAct_9fa48("4799") ? false : stryMutAct_9fa48("4798") ? true : stryMutAct_9fa48("4797") ? otp : (stryCov_9fa48("4797", "4798", "4799"), !otp)) {
      if (stryMutAct_9fa48("4800")) {
        {}
      } else {
        stryCov_9fa48("4800");
        errors.push(stryMutAct_9fa48("4801") ? "" : (stryCov_9fa48("4801"), 'OTP is required'));
        return stryMutAct_9fa48("4802") ? {} : (stryCov_9fa48("4802"), {
          isValid: stryMutAct_9fa48("4803") ? true : (stryCov_9fa48("4803"), false),
          errors
        });
      }
    }

    // OTP should be exactly 6 digits
    if (stryMutAct_9fa48("4806") ? false : stryMutAct_9fa48("4805") ? true : stryMutAct_9fa48("4804") ? /^\d{6}$/.test(otp) : (stryCov_9fa48("4804", "4805", "4806"), !(stryMutAct_9fa48("4810") ? /^\D{6}$/ : stryMutAct_9fa48("4809") ? /^\d$/ : stryMutAct_9fa48("4808") ? /^\d{6}/ : stryMutAct_9fa48("4807") ? /\d{6}$/ : (stryCov_9fa48("4807", "4808", "4809", "4810"), /^\d{6}$/)).test(otp))) {
      if (stryMutAct_9fa48("4811")) {
        {}
      } else {
        stryCov_9fa48("4811");
        errors.push(stryMutAct_9fa48("4812") ? "" : (stryCov_9fa48("4812"), 'OTP must be a 6-digit number'));
      }
    }
    return stryMutAct_9fa48("4813") ? {} : (stryCov_9fa48("4813"), {
      isValid: stryMutAct_9fa48("4816") ? errors.length !== 0 : stryMutAct_9fa48("4815") ? false : stryMutAct_9fa48("4814") ? true : (stryCov_9fa48("4814", "4815", "4816"), errors.length === 0),
      errors
    });
  }
}