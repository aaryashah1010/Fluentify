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
const DISPOSABLE_EMAIL_DOMAINS = stryMutAct_9fa48("4114") ? [] : (stryCov_9fa48("4114"), [stryMutAct_9fa48("4115") ? "" : (stryCov_9fa48("4115"), 'tempmail.com'), stryMutAct_9fa48("4116") ? "" : (stryCov_9fa48("4116"), 'temp-mail.org'), stryMutAct_9fa48("4117") ? "" : (stryCov_9fa48("4117"), 'guerrillamail.com'), stryMutAct_9fa48("4118") ? "" : (stryCov_9fa48("4118"), '10minutemail.com'), stryMutAct_9fa48("4119") ? "" : (stryCov_9fa48("4119"), 'throwaway.email'), stryMutAct_9fa48("4120") ? "" : (stryCov_9fa48("4120"), 'maildrop.cc'), stryMutAct_9fa48("4121") ? "" : (stryCov_9fa48("4121"), 'mailinator.com'), stryMutAct_9fa48("4122") ? "" : (stryCov_9fa48("4122"), 'trashmail.com'), stryMutAct_9fa48("4123") ? "" : (stryCov_9fa48("4123"), 'yopmail.com'), stryMutAct_9fa48("4124") ? "" : (stryCov_9fa48("4124"), 'fakeinbox.com'), stryMutAct_9fa48("4125") ? "" : (stryCov_9fa48("4125"), 'getnada.com'), stryMutAct_9fa48("4126") ? "" : (stryCov_9fa48("4126"), 'temp-mail.io'), stryMutAct_9fa48("4127") ? "" : (stryCov_9fa48("4127"), 'mohmal.com'), stryMutAct_9fa48("4128") ? "" : (stryCov_9fa48("4128"), 'sharklasers.com'), stryMutAct_9fa48("4129") ? "" : (stryCov_9fa48("4129"), 'guerrillamailblock.com'), stryMutAct_9fa48("4130") ? "" : (stryCov_9fa48("4130"), 'spam4.me'), stryMutAct_9fa48("4131") ? "" : (stryCov_9fa48("4131"), 'grr.la'), stryMutAct_9fa48("4132") ? "" : (stryCov_9fa48("4132"), 'guerrillamail.biz'), stryMutAct_9fa48("4133") ? "" : (stryCov_9fa48("4133"), 'guerrillamail.de'), stryMutAct_9fa48("4134") ? "" : (stryCov_9fa48("4134"), 'guerrillamail.net'), stryMutAct_9fa48("4135") ? "" : (stryCov_9fa48("4135"), 'guerrillamail.org'), stryMutAct_9fa48("4136") ? "" : (stryCov_9fa48("4136"), 'guerrillamailblock.com'), stryMutAct_9fa48("4137") ? "" : (stryCov_9fa48("4137"), 'pokemail.net'), stryMutAct_9fa48("4138") ? "" : (stryCov_9fa48("4138"), 'spam4.me'), stryMutAct_9fa48("4139") ? "" : (stryCov_9fa48("4139"), 'trbvm.com'), stryMutAct_9fa48("4140") ? "" : (stryCov_9fa48("4140"), 'tmails.net'), stryMutAct_9fa48("4141") ? "" : (stryCov_9fa48("4141"), 'tmpmail.net'), stryMutAct_9fa48("4142") ? "" : (stryCov_9fa48("4142"), 'tmpmail.org'), stryMutAct_9fa48("4143") ? "" : (stryCov_9fa48("4143"), 'emailondeck.com')]);

/**
 * Validate name - no special characters, no numbers, only letters and spaces
 */
export function validateName(name) {
  if (stryMutAct_9fa48("4144")) {
    {}
  } else {
    stryCov_9fa48("4144");
    const errors = stryMutAct_9fa48("4145") ? ["Stryker was here"] : (stryCov_9fa48("4145"), []);
    if (stryMutAct_9fa48("4148") ? !name && !name.trim() : stryMutAct_9fa48("4147") ? false : stryMutAct_9fa48("4146") ? true : (stryCov_9fa48("4146", "4147", "4148"), (stryMutAct_9fa48("4149") ? name : (stryCov_9fa48("4149"), !name)) || (stryMutAct_9fa48("4150") ? name.trim() : (stryCov_9fa48("4150"), !(stryMutAct_9fa48("4151") ? name : (stryCov_9fa48("4151"), name.trim())))))) {
      if (stryMutAct_9fa48("4152")) {
        {}
      } else {
        stryCov_9fa48("4152");
        errors.push(stryMutAct_9fa48("4153") ? "" : (stryCov_9fa48("4153"), 'Name is required'));
        return stryMutAct_9fa48("4154") ? {} : (stryCov_9fa48("4154"), {
          isValid: stryMutAct_9fa48("4155") ? true : (stryCov_9fa48("4155"), false),
          errors
        });
      }
    }
    const trimmedName = stryMutAct_9fa48("4156") ? name : (stryCov_9fa48("4156"), name.trim());

    // Check for minimum length
    if (stryMutAct_9fa48("4160") ? trimmedName.length >= 2 : stryMutAct_9fa48("4159") ? trimmedName.length <= 2 : stryMutAct_9fa48("4158") ? false : stryMutAct_9fa48("4157") ? true : (stryCov_9fa48("4157", "4158", "4159", "4160"), trimmedName.length < 2)) {
      if (stryMutAct_9fa48("4161")) {
        {}
      } else {
        stryCov_9fa48("4161");
        errors.push(stryMutAct_9fa48("4162") ? "" : (stryCov_9fa48("4162"), 'Name must be at least 2 characters long'));
      }
    }

    // Check for maximum length
    if (stryMutAct_9fa48("4166") ? trimmedName.length <= 50 : stryMutAct_9fa48("4165") ? trimmedName.length >= 50 : stryMutAct_9fa48("4164") ? false : stryMutAct_9fa48("4163") ? true : (stryCov_9fa48("4163", "4164", "4165", "4166"), trimmedName.length > 50)) {
      if (stryMutAct_9fa48("4167")) {
        {}
      } else {
        stryCov_9fa48("4167");
        errors.push(stryMutAct_9fa48("4168") ? "" : (stryCov_9fa48("4168"), 'Name must not exceed 50 characters'));
      }
    }

    // Check for numbers
    if (stryMutAct_9fa48("4170") ? false : stryMutAct_9fa48("4169") ? true : (stryCov_9fa48("4169", "4170"), (stryMutAct_9fa48("4171") ? /\D/ : (stryCov_9fa48("4171"), /\d/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4172")) {
        {}
      } else {
        stryCov_9fa48("4172");
        errors.push(stryMutAct_9fa48("4173") ? "" : (stryCov_9fa48("4173"), 'Name cannot contain numbers'));
      }
    }

    // Check for special characters (allow only letters, spaces, hyphens, and apostrophes)
    if (stryMutAct_9fa48("4176") ? false : stryMutAct_9fa48("4175") ? true : stryMutAct_9fa48("4174") ? /^[a-zA-Z\s'-]+$/.test(trimmedName) : (stryCov_9fa48("4174", "4175", "4176"), !(stryMutAct_9fa48("4181") ? /^[a-zA-Z\S'-]+$/ : stryMutAct_9fa48("4180") ? /^[^a-zA-Z\s'-]+$/ : stryMutAct_9fa48("4179") ? /^[a-zA-Z\s'-]$/ : stryMutAct_9fa48("4178") ? /^[a-zA-Z\s'-]+/ : stryMutAct_9fa48("4177") ? /[a-zA-Z\s'-]+$/ : (stryCov_9fa48("4177", "4178", "4179", "4180", "4181"), /^[a-zA-Z\s'-]+$/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4182")) {
        {}
      } else {
        stryCov_9fa48("4182");
        errors.push(stryMutAct_9fa48("4183") ? "" : (stryCov_9fa48("4183"), 'Name can only contain letters, spaces, hyphens, and apostrophes'));
      }
    }

    // Check for multiple consecutive spaces
    if (stryMutAct_9fa48("4185") ? false : stryMutAct_9fa48("4184") ? true : (stryCov_9fa48("4184", "4185"), (stryMutAct_9fa48("4187") ? /\S{2,}/ : stryMutAct_9fa48("4186") ? /\s/ : (stryCov_9fa48("4186", "4187"), /\s{2,}/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4188")) {
        {}
      } else {
        stryCov_9fa48("4188");
        errors.push(stryMutAct_9fa48("4189") ? "" : (stryCov_9fa48("4189"), 'Name cannot contain multiple consecutive spaces'));
      }
    }
    return stryMutAct_9fa48("4190") ? {} : (stryCov_9fa48("4190"), {
      isValid: stryMutAct_9fa48("4193") ? errors.length !== 0 : stryMutAct_9fa48("4192") ? false : stryMutAct_9fa48("4191") ? true : (stryCov_9fa48("4191", "4192", "4193"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate email - check format and block disposable emails
 */
export function validateEmail(email) {
  if (stryMutAct_9fa48("4194")) {
    {}
  } else {
    stryCov_9fa48("4194");
    const errors = stryMutAct_9fa48("4195") ? ["Stryker was here"] : (stryCov_9fa48("4195"), []);
    if (stryMutAct_9fa48("4198") ? !email && !email.trim() : stryMutAct_9fa48("4197") ? false : stryMutAct_9fa48("4196") ? true : (stryCov_9fa48("4196", "4197", "4198"), (stryMutAct_9fa48("4199") ? email : (stryCov_9fa48("4199"), !email)) || (stryMutAct_9fa48("4200") ? email.trim() : (stryCov_9fa48("4200"), !(stryMutAct_9fa48("4201") ? email : (stryCov_9fa48("4201"), email.trim())))))) {
      if (stryMutAct_9fa48("4202")) {
        {}
      } else {
        stryCov_9fa48("4202");
        errors.push(stryMutAct_9fa48("4203") ? "" : (stryCov_9fa48("4203"), 'Email is required'));
        return stryMutAct_9fa48("4204") ? {} : (stryCov_9fa48("4204"), {
          isValid: stryMutAct_9fa48("4205") ? true : (stryCov_9fa48("4205"), false),
          errors
        });
      }
    }
    const trimmedEmail = stryMutAct_9fa48("4207") ? email.toLowerCase() : stryMutAct_9fa48("4206") ? email.trim().toUpperCase() : (stryCov_9fa48("4206", "4207"), email.trim().toLowerCase());

    // Basic email format validation
    const emailRegex = stryMutAct_9fa48("4218") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("4217") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("4216") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("4215") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("4214") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4213") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("4212") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4211") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4210") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4209") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("4208") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("4208", "4209", "4210", "4211", "4212", "4213", "4214", "4215", "4216", "4217", "4218"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (stryMutAct_9fa48("4221") ? false : stryMutAct_9fa48("4220") ? true : stryMutAct_9fa48("4219") ? emailRegex.test(trimmedEmail) : (stryCov_9fa48("4219", "4220", "4221"), !emailRegex.test(trimmedEmail))) {
      if (stryMutAct_9fa48("4222")) {
        {}
      } else {
        stryCov_9fa48("4222");
        errors.push(stryMutAct_9fa48("4223") ? "" : (stryCov_9fa48("4223"), 'Invalid email format'));
        return stryMutAct_9fa48("4224") ? {} : (stryCov_9fa48("4224"), {
          isValid: stryMutAct_9fa48("4225") ? true : (stryCov_9fa48("4225"), false),
          errors
        });
      }
    }

    // Extract domain
    const domain = trimmedEmail.split(stryMutAct_9fa48("4226") ? "" : (stryCov_9fa48("4226"), '@'))[1];

    // Check if it's a disposable email
    if (stryMutAct_9fa48("4228") ? false : stryMutAct_9fa48("4227") ? true : (stryCov_9fa48("4227", "4228"), DISPOSABLE_EMAIL_DOMAINS.includes(domain))) {
      if (stryMutAct_9fa48("4229")) {
        {}
      } else {
        stryCov_9fa48("4229");
        errors.push(stryMutAct_9fa48("4230") ? "" : (stryCov_9fa48("4230"), 'Disposable email addresses are not allowed. Please use a permanent email address'));
      }
    }

    // Additional checks for suspicious patterns
    if (stryMutAct_9fa48("4233") ? (domain.includes('temp') || domain.includes('fake')) && domain.includes('trash') : stryMutAct_9fa48("4232") ? false : stryMutAct_9fa48("4231") ? true : (stryCov_9fa48("4231", "4232", "4233"), (stryMutAct_9fa48("4235") ? domain.includes('temp') && domain.includes('fake') : stryMutAct_9fa48("4234") ? false : (stryCov_9fa48("4234", "4235"), domain.includes(stryMutAct_9fa48("4236") ? "" : (stryCov_9fa48("4236"), 'temp')) || domain.includes(stryMutAct_9fa48("4237") ? "" : (stryCov_9fa48("4237"), 'fake')))) || domain.includes(stryMutAct_9fa48("4238") ? "" : (stryCov_9fa48("4238"), 'trash')))) {
      if (stryMutAct_9fa48("4239")) {
        {}
      } else {
        stryCov_9fa48("4239");
        errors.push(stryMutAct_9fa48("4240") ? "" : (stryCov_9fa48("4240"), 'Temporary email addresses are not allowed. Please use a permanent email address'));
      }
    }
    return stryMutAct_9fa48("4241") ? {} : (stryCov_9fa48("4241"), {
      isValid: stryMutAct_9fa48("4244") ? errors.length !== 0 : stryMutAct_9fa48("4243") ? false : stryMutAct_9fa48("4242") ? true : (stryCov_9fa48("4242", "4243", "4244"), errors.length === 0),
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
export function validatePassword(password, email = stryMutAct_9fa48("4245") ? "Stryker was here!" : (stryCov_9fa48("4245"), ''), name = stryMutAct_9fa48("4246") ? "Stryker was here!" : (stryCov_9fa48("4246"), '')) {
  if (stryMutAct_9fa48("4247")) {
    {}
  } else {
    stryCov_9fa48("4247");
    const errors = stryMutAct_9fa48("4248") ? ["Stryker was here"] : (stryCov_9fa48("4248"), []);
    if (stryMutAct_9fa48("4251") ? false : stryMutAct_9fa48("4250") ? true : stryMutAct_9fa48("4249") ? password : (stryCov_9fa48("4249", "4250", "4251"), !password)) {
      if (stryMutAct_9fa48("4252")) {
        {}
      } else {
        stryCov_9fa48("4252");
        errors.push(stryMutAct_9fa48("4253") ? "" : (stryCov_9fa48("4253"), 'Password is required'));
        return stryMutAct_9fa48("4254") ? {} : (stryCov_9fa48("4254"), {
          isValid: stryMutAct_9fa48("4255") ? true : (stryCov_9fa48("4255"), false),
          errors,
          strength: stryMutAct_9fa48("4256") ? "" : (stryCov_9fa48("4256"), 'weak')
        });
      }
    }

    // Check minimum length
    if (stryMutAct_9fa48("4260") ? password.length >= 8 : stryMutAct_9fa48("4259") ? password.length <= 8 : stryMutAct_9fa48("4258") ? false : stryMutAct_9fa48("4257") ? true : (stryCov_9fa48("4257", "4258", "4259", "4260"), password.length < 8)) {
      if (stryMutAct_9fa48("4261")) {
        {}
      } else {
        stryCov_9fa48("4261");
        errors.push(stryMutAct_9fa48("4262") ? "" : (stryCov_9fa48("4262"), 'Password must be at least 8 characters long'));
      }
    }

    // Check for uppercase letter
    if (stryMutAct_9fa48("4265") ? false : stryMutAct_9fa48("4264") ? true : stryMutAct_9fa48("4263") ? /[A-Z]/.test(password) : (stryCov_9fa48("4263", "4264", "4265"), !(stryMutAct_9fa48("4266") ? /[^A-Z]/ : (stryCov_9fa48("4266"), /[A-Z]/)).test(password))) {
      if (stryMutAct_9fa48("4267")) {
        {}
      } else {
        stryCov_9fa48("4267");
        errors.push(stryMutAct_9fa48("4268") ? "" : (stryCov_9fa48("4268"), 'Password must contain at least one uppercase letter'));
      }
    }

    // Check for lowercase letter
    if (stryMutAct_9fa48("4271") ? false : stryMutAct_9fa48("4270") ? true : stryMutAct_9fa48("4269") ? /[a-z]/.test(password) : (stryCov_9fa48("4269", "4270", "4271"), !(stryMutAct_9fa48("4272") ? /[^a-z]/ : (stryCov_9fa48("4272"), /[a-z]/)).test(password))) {
      if (stryMutAct_9fa48("4273")) {
        {}
      } else {
        stryCov_9fa48("4273");
        errors.push(stryMutAct_9fa48("4274") ? "" : (stryCov_9fa48("4274"), 'Password must contain at least one lowercase letter'));
      }
    }

    // Check for number
    if (stryMutAct_9fa48("4277") ? false : stryMutAct_9fa48("4276") ? true : stryMutAct_9fa48("4275") ? /\d/.test(password) : (stryCov_9fa48("4275", "4276", "4277"), !(stryMutAct_9fa48("4278") ? /\D/ : (stryCov_9fa48("4278"), /\d/)).test(password))) {
      if (stryMutAct_9fa48("4279")) {
        {}
      } else {
        stryCov_9fa48("4279");
        errors.push(stryMutAct_9fa48("4280") ? "" : (stryCov_9fa48("4280"), 'Password must contain at least one number'));
      }
    }

    // Check for special character
    if (stryMutAct_9fa48("4283") ? false : stryMutAct_9fa48("4282") ? true : stryMutAct_9fa48("4281") ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) : (stryCov_9fa48("4281", "4282", "4283"), !(stryMutAct_9fa48("4284") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4284"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password))) {
      if (stryMutAct_9fa48("4285")) {
        {}
      } else {
        stryCov_9fa48("4285");
        errors.push(stryMutAct_9fa48("4286") ? "" : (stryCov_9fa48("4286"), 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'));
      }
    }

    // Check if password is same as email (case insensitive)
    if (stryMutAct_9fa48("4289") ? email || password.toLowerCase() === email.toLowerCase() : stryMutAct_9fa48("4288") ? false : stryMutAct_9fa48("4287") ? true : (stryCov_9fa48("4287", "4288", "4289"), email && (stryMutAct_9fa48("4291") ? password.toLowerCase() !== email.toLowerCase() : stryMutAct_9fa48("4290") ? true : (stryCov_9fa48("4290", "4291"), (stryMutAct_9fa48("4292") ? password.toUpperCase() : (stryCov_9fa48("4292"), password.toLowerCase())) === (stryMutAct_9fa48("4293") ? email.toUpperCase() : (stryCov_9fa48("4293"), email.toLowerCase())))))) {
      if (stryMutAct_9fa48("4294")) {
        {}
      } else {
        stryCov_9fa48("4294");
        errors.push(stryMutAct_9fa48("4295") ? "" : (stryCov_9fa48("4295"), 'Password cannot be the same as your email'));
      }
    }

    // Password can contain name - restriction removed per user request
    // Users should be able to use their name in passwords if they want

    // Calculate password strength
    let strength = stryMutAct_9fa48("4296") ? "" : (stryCov_9fa48("4296"), 'weak');
    if (stryMutAct_9fa48("4299") ? errors.length !== 0 : stryMutAct_9fa48("4298") ? false : stryMutAct_9fa48("4297") ? true : (stryCov_9fa48("4297", "4298", "4299"), errors.length === 0)) {
      if (stryMutAct_9fa48("4300")) {
        {}
      } else {
        stryCov_9fa48("4300");
        let score = 0;

        // Length bonus
        if (stryMutAct_9fa48("4304") ? password.length < 12 : stryMutAct_9fa48("4303") ? password.length > 12 : stryMutAct_9fa48("4302") ? false : stryMutAct_9fa48("4301") ? true : (stryCov_9fa48("4301", "4302", "4303", "4304"), password.length >= 12)) stryMutAct_9fa48("4305") ? score -= 2 : (stryCov_9fa48("4305"), score += 2);else if (stryMutAct_9fa48("4309") ? password.length < 10 : stryMutAct_9fa48("4308") ? password.length > 10 : stryMutAct_9fa48("4307") ? false : stryMutAct_9fa48("4306") ? true : (stryCov_9fa48("4306", "4307", "4308", "4309"), password.length >= 10)) stryMutAct_9fa48("4310") ? score -= 1 : (stryCov_9fa48("4310"), score += 1);

        // Complexity bonus
        if (stryMutAct_9fa48("4312") ? false : stryMutAct_9fa48("4311") ? true : (stryCov_9fa48("4311", "4312"), (stryMutAct_9fa48("4313") ? /[^A-Z]/ : (stryCov_9fa48("4313"), /[A-Z]/)).test(password))) stryMutAct_9fa48("4314") ? score -= 1 : (stryCov_9fa48("4314"), score += 1);
        if (stryMutAct_9fa48("4316") ? false : stryMutAct_9fa48("4315") ? true : (stryCov_9fa48("4315", "4316"), (stryMutAct_9fa48("4317") ? /[^a-z]/ : (stryCov_9fa48("4317"), /[a-z]/)).test(password))) stryMutAct_9fa48("4318") ? score -= 1 : (stryCov_9fa48("4318"), score += 1);
        if (stryMutAct_9fa48("4320") ? false : stryMutAct_9fa48("4319") ? true : (stryCov_9fa48("4319", "4320"), (stryMutAct_9fa48("4321") ? /\D/ : (stryCov_9fa48("4321"), /\d/)).test(password))) stryMutAct_9fa48("4322") ? score -= 1 : (stryCov_9fa48("4322"), score += 1);
        if (stryMutAct_9fa48("4324") ? false : stryMutAct_9fa48("4323") ? true : (stryCov_9fa48("4323", "4324"), (stryMutAct_9fa48("4325") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4325"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password))) stryMutAct_9fa48("4326") ? score -= 1 : (stryCov_9fa48("4326"), score += 1);

        // Multiple character types
        const hasMultipleTypes = stryMutAct_9fa48("4327") ? [/[A-Z]/.test(password), /[a-z]/.test(password), /\d/.test(password), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)].length : (stryCov_9fa48("4327"), (stryMutAct_9fa48("4328") ? [] : (stryCov_9fa48("4328"), [(stryMutAct_9fa48("4329") ? /[^A-Z]/ : (stryCov_9fa48("4329"), /[A-Z]/)).test(password), (stryMutAct_9fa48("4330") ? /[^a-z]/ : (stryCov_9fa48("4330"), /[a-z]/)).test(password), (stryMutAct_9fa48("4331") ? /\D/ : (stryCov_9fa48("4331"), /\d/)).test(password), (stryMutAct_9fa48("4332") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4332"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password)])).filter(Boolean).length);
        if (stryMutAct_9fa48("4336") ? hasMultipleTypes < 4 : stryMutAct_9fa48("4335") ? hasMultipleTypes > 4 : stryMutAct_9fa48("4334") ? false : stryMutAct_9fa48("4333") ? true : (stryCov_9fa48("4333", "4334", "4335", "4336"), hasMultipleTypes >= 4)) stryMutAct_9fa48("4337") ? score -= 1 : (stryCov_9fa48("4337"), score += 1);
        if (stryMutAct_9fa48("4341") ? score < 7 : stryMutAct_9fa48("4340") ? score > 7 : stryMutAct_9fa48("4339") ? false : stryMutAct_9fa48("4338") ? true : (stryCov_9fa48("4338", "4339", "4340", "4341"), score >= 7)) strength = stryMutAct_9fa48("4342") ? "" : (stryCov_9fa48("4342"), 'strong');else if (stryMutAct_9fa48("4346") ? score < 5 : stryMutAct_9fa48("4345") ? score > 5 : stryMutAct_9fa48("4344") ? false : stryMutAct_9fa48("4343") ? true : (stryCov_9fa48("4343", "4344", "4345", "4346"), score >= 5)) strength = stryMutAct_9fa48("4347") ? "" : (stryCov_9fa48("4347"), 'medium');
      }
    }
    return stryMutAct_9fa48("4348") ? {} : (stryCov_9fa48("4348"), {
      isValid: stryMutAct_9fa48("4351") ? errors.length !== 0 : stryMutAct_9fa48("4350") ? false : stryMutAct_9fa48("4349") ? true : (stryCov_9fa48("4349", "4350", "4351"), errors.length === 0),
      errors,
      strength
    });
  }
}

/**
 * Generate strong password suggestions
 */
export function generatePasswordSuggestions(count = 3) {
  if (stryMutAct_9fa48("4352")) {
    {}
  } else {
    stryCov_9fa48("4352");
    const lowercase = stryMutAct_9fa48("4353") ? "" : (stryCov_9fa48("4353"), 'abcdefghijklmnopqrstuvwxyz');
    const uppercase = stryMutAct_9fa48("4354") ? "" : (stryCov_9fa48("4354"), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    const numbers = stryMutAct_9fa48("4355") ? "" : (stryCov_9fa48("4355"), '0123456789');
    const special = stryMutAct_9fa48("4356") ? "" : (stryCov_9fa48("4356"), '!@#$%^&*()_+-=[]{}');
    const suggestions = stryMutAct_9fa48("4357") ? ["Stryker was here"] : (stryCov_9fa48("4357"), []);
    for (let i = 0; stryMutAct_9fa48("4360") ? i >= count : stryMutAct_9fa48("4359") ? i <= count : stryMutAct_9fa48("4358") ? false : (stryCov_9fa48("4358", "4359", "4360"), i < count); stryMutAct_9fa48("4361") ? i-- : (stryCov_9fa48("4361"), i++)) {
      if (stryMutAct_9fa48("4362")) {
        {}
      } else {
        stryCov_9fa48("4362");
        let password = stryMutAct_9fa48("4363") ? "Stryker was here!" : (stryCov_9fa48("4363"), '');

        // Ensure at least one of each required type
        stryMutAct_9fa48("4364") ? password -= uppercase[Math.floor(Math.random() * uppercase.length)] : (stryCov_9fa48("4364"), password += uppercase[Math.floor(stryMutAct_9fa48("4365") ? Math.random() / uppercase.length : (stryCov_9fa48("4365"), Math.random() * uppercase.length))]);
        stryMutAct_9fa48("4366") ? password -= lowercase[Math.floor(Math.random() * lowercase.length)] : (stryCov_9fa48("4366"), password += lowercase[Math.floor(stryMutAct_9fa48("4367") ? Math.random() / lowercase.length : (stryCov_9fa48("4367"), Math.random() * lowercase.length))]);
        stryMutAct_9fa48("4368") ? password -= numbers[Math.floor(Math.random() * numbers.length)] : (stryCov_9fa48("4368"), password += numbers[Math.floor(stryMutAct_9fa48("4369") ? Math.random() / numbers.length : (stryCov_9fa48("4369"), Math.random() * numbers.length))]);
        stryMutAct_9fa48("4370") ? password -= special[Math.floor(Math.random() * special.length)] : (stryCov_9fa48("4370"), password += special[Math.floor(stryMutAct_9fa48("4371") ? Math.random() / special.length : (stryCov_9fa48("4371"), Math.random() * special.length))]);

        // Fill the rest with random characters (total length 12-16)
        const allChars = stryMutAct_9fa48("4372") ? lowercase + uppercase + numbers - special : (stryCov_9fa48("4372"), (stryMutAct_9fa48("4373") ? lowercase + uppercase - numbers : (stryCov_9fa48("4373"), (stryMutAct_9fa48("4374") ? lowercase - uppercase : (stryCov_9fa48("4374"), lowercase + uppercase)) + numbers)) + special);
        const remainingLength = stryMutAct_9fa48("4375") ? 8 - Math.floor(Math.random() * 5) : (stryCov_9fa48("4375"), 8 + Math.floor(stryMutAct_9fa48("4376") ? Math.random() / 5 : (stryCov_9fa48("4376"), Math.random() * 5))); // 8-12 more characters

        for (let j = 0; stryMutAct_9fa48("4379") ? j >= remainingLength : stryMutAct_9fa48("4378") ? j <= remainingLength : stryMutAct_9fa48("4377") ? false : (stryCov_9fa48("4377", "4378", "4379"), j < remainingLength); stryMutAct_9fa48("4380") ? j-- : (stryCov_9fa48("4380"), j++)) {
          if (stryMutAct_9fa48("4381")) {
            {}
          } else {
            stryCov_9fa48("4381");
            stryMutAct_9fa48("4382") ? password -= allChars[Math.floor(Math.random() * allChars.length)] : (stryCov_9fa48("4382"), password += allChars[Math.floor(stryMutAct_9fa48("4383") ? Math.random() / allChars.length : (stryCov_9fa48("4383"), Math.random() * allChars.length))]);
          }
        }

        // Shuffle the password
        password = stryMutAct_9fa48("4384") ? password.split('').join('') : (stryCov_9fa48("4384"), password.split(stryMutAct_9fa48("4385") ? "Stryker was here!" : (stryCov_9fa48("4385"), '')).sort(stryMutAct_9fa48("4386") ? () => undefined : (stryCov_9fa48("4386"), () => stryMutAct_9fa48("4387") ? Math.random() + 0.5 : (stryCov_9fa48("4387"), Math.random() - 0.5))).join(stryMutAct_9fa48("4388") ? "Stryker was here!" : (stryCov_9fa48("4388"), '')));
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
  if (stryMutAct_9fa48("4389")) {
    {}
  } else {
    stryCov_9fa48("4389");
    const errors = stryMutAct_9fa48("4390") ? ["Stryker was here"] : (stryCov_9fa48("4390"), []);
    if (stryMutAct_9fa48("4393") ? false : stryMutAct_9fa48("4392") ? true : stryMutAct_9fa48("4391") ? otp : (stryCov_9fa48("4391", "4392", "4393"), !otp)) {
      if (stryMutAct_9fa48("4394")) {
        {}
      } else {
        stryCov_9fa48("4394");
        errors.push(stryMutAct_9fa48("4395") ? "" : (stryCov_9fa48("4395"), 'OTP is required'));
        return stryMutAct_9fa48("4396") ? {} : (stryCov_9fa48("4396"), {
          isValid: stryMutAct_9fa48("4397") ? true : (stryCov_9fa48("4397"), false),
          errors
        });
      }
    }

    // OTP should be exactly 6 digits
    if (stryMutAct_9fa48("4400") ? false : stryMutAct_9fa48("4399") ? true : stryMutAct_9fa48("4398") ? /^\d{6}$/.test(otp) : (stryCov_9fa48("4398", "4399", "4400"), !(stryMutAct_9fa48("4404") ? /^\D{6}$/ : stryMutAct_9fa48("4403") ? /^\d$/ : stryMutAct_9fa48("4402") ? /^\d{6}/ : stryMutAct_9fa48("4401") ? /\d{6}$/ : (stryCov_9fa48("4401", "4402", "4403", "4404"), /^\d{6}$/)).test(otp))) {
      if (stryMutAct_9fa48("4405")) {
        {}
      } else {
        stryCov_9fa48("4405");
        errors.push(stryMutAct_9fa48("4406") ? "" : (stryCov_9fa48("4406"), 'OTP must be a 6-digit number'));
      }
    }
    return stryMutAct_9fa48("4407") ? {} : (stryCov_9fa48("4407"), {
      isValid: stryMutAct_9fa48("4410") ? errors.length !== 0 : stryMutAct_9fa48("4409") ? false : stryMutAct_9fa48("4408") ? true : (stryCov_9fa48("4408", "4409", "4410"), errors.length === 0),
      errors
    });
  }
}