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
const DISPOSABLE_EMAIL_DOMAINS = stryMutAct_9fa48("4097") ? [] : (stryCov_9fa48("4097"), [stryMutAct_9fa48("4098") ? "" : (stryCov_9fa48("4098"), 'tempmail.com'), stryMutAct_9fa48("4099") ? "" : (stryCov_9fa48("4099"), 'temp-mail.org'), stryMutAct_9fa48("4100") ? "" : (stryCov_9fa48("4100"), 'guerrillamail.com'), stryMutAct_9fa48("4101") ? "" : (stryCov_9fa48("4101"), '10minutemail.com'), stryMutAct_9fa48("4102") ? "" : (stryCov_9fa48("4102"), 'throwaway.email'), stryMutAct_9fa48("4103") ? "" : (stryCov_9fa48("4103"), 'maildrop.cc'), stryMutAct_9fa48("4104") ? "" : (stryCov_9fa48("4104"), 'mailinator.com'), stryMutAct_9fa48("4105") ? "" : (stryCov_9fa48("4105"), 'trashmail.com'), stryMutAct_9fa48("4106") ? "" : (stryCov_9fa48("4106"), 'yopmail.com'), stryMutAct_9fa48("4107") ? "" : (stryCov_9fa48("4107"), 'fakeinbox.com'), stryMutAct_9fa48("4108") ? "" : (stryCov_9fa48("4108"), 'getnada.com'), stryMutAct_9fa48("4109") ? "" : (stryCov_9fa48("4109"), 'temp-mail.io'), stryMutAct_9fa48("4110") ? "" : (stryCov_9fa48("4110"), 'mohmal.com'), stryMutAct_9fa48("4111") ? "" : (stryCov_9fa48("4111"), 'sharklasers.com'), stryMutAct_9fa48("4112") ? "" : (stryCov_9fa48("4112"), 'guerrillamailblock.com'), stryMutAct_9fa48("4113") ? "" : (stryCov_9fa48("4113"), 'spam4.me'), stryMutAct_9fa48("4114") ? "" : (stryCov_9fa48("4114"), 'grr.la'), stryMutAct_9fa48("4115") ? "" : (stryCov_9fa48("4115"), 'guerrillamail.biz'), stryMutAct_9fa48("4116") ? "" : (stryCov_9fa48("4116"), 'guerrillamail.de'), stryMutAct_9fa48("4117") ? "" : (stryCov_9fa48("4117"), 'guerrillamail.net'), stryMutAct_9fa48("4118") ? "" : (stryCov_9fa48("4118"), 'guerrillamail.org'), stryMutAct_9fa48("4119") ? "" : (stryCov_9fa48("4119"), 'guerrillamailblock.com'), stryMutAct_9fa48("4120") ? "" : (stryCov_9fa48("4120"), 'pokemail.net'), stryMutAct_9fa48("4121") ? "" : (stryCov_9fa48("4121"), 'spam4.me'), stryMutAct_9fa48("4122") ? "" : (stryCov_9fa48("4122"), 'trbvm.com'), stryMutAct_9fa48("4123") ? "" : (stryCov_9fa48("4123"), 'tmails.net'), stryMutAct_9fa48("4124") ? "" : (stryCov_9fa48("4124"), 'tmpmail.net'), stryMutAct_9fa48("4125") ? "" : (stryCov_9fa48("4125"), 'tmpmail.org'), stryMutAct_9fa48("4126") ? "" : (stryCov_9fa48("4126"), 'emailondeck.com')]);

/**
 * Validate name - no special characters, no numbers, only letters and spaces
 */
export function validateName(name) {
  if (stryMutAct_9fa48("4127")) {
    {}
  } else {
    stryCov_9fa48("4127");
    const errors = stryMutAct_9fa48("4128") ? ["Stryker was here"] : (stryCov_9fa48("4128"), []);
    if (stryMutAct_9fa48("4131") ? !name && !name.trim() : stryMutAct_9fa48("4130") ? false : stryMutAct_9fa48("4129") ? true : (stryCov_9fa48("4129", "4130", "4131"), (stryMutAct_9fa48("4132") ? name : (stryCov_9fa48("4132"), !name)) || (stryMutAct_9fa48("4133") ? name.trim() : (stryCov_9fa48("4133"), !(stryMutAct_9fa48("4134") ? name : (stryCov_9fa48("4134"), name.trim())))))) {
      if (stryMutAct_9fa48("4135")) {
        {}
      } else {
        stryCov_9fa48("4135");
        errors.push(stryMutAct_9fa48("4136") ? "" : (stryCov_9fa48("4136"), 'Name is required'));
        return stryMutAct_9fa48("4137") ? {} : (stryCov_9fa48("4137"), {
          isValid: stryMutAct_9fa48("4138") ? true : (stryCov_9fa48("4138"), false),
          errors
        });
      }
    }
    const trimmedName = stryMutAct_9fa48("4139") ? name : (stryCov_9fa48("4139"), name.trim());

    // Check for minimum length
    if (stryMutAct_9fa48("4143") ? trimmedName.length >= 2 : stryMutAct_9fa48("4142") ? trimmedName.length <= 2 : stryMutAct_9fa48("4141") ? false : stryMutAct_9fa48("4140") ? true : (stryCov_9fa48("4140", "4141", "4142", "4143"), trimmedName.length < 2)) {
      if (stryMutAct_9fa48("4144")) {
        {}
      } else {
        stryCov_9fa48("4144");
        errors.push(stryMutAct_9fa48("4145") ? "" : (stryCov_9fa48("4145"), 'Name must be at least 2 characters long'));
      }
    }

    // Check for maximum length
    if (stryMutAct_9fa48("4149") ? trimmedName.length <= 50 : stryMutAct_9fa48("4148") ? trimmedName.length >= 50 : stryMutAct_9fa48("4147") ? false : stryMutAct_9fa48("4146") ? true : (stryCov_9fa48("4146", "4147", "4148", "4149"), trimmedName.length > 50)) {
      if (stryMutAct_9fa48("4150")) {
        {}
      } else {
        stryCov_9fa48("4150");
        errors.push(stryMutAct_9fa48("4151") ? "" : (stryCov_9fa48("4151"), 'Name must not exceed 50 characters'));
      }
    }

    // Check for numbers
    if (stryMutAct_9fa48("4153") ? false : stryMutAct_9fa48("4152") ? true : (stryCov_9fa48("4152", "4153"), (stryMutAct_9fa48("4154") ? /\D/ : (stryCov_9fa48("4154"), /\d/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4155")) {
        {}
      } else {
        stryCov_9fa48("4155");
        errors.push(stryMutAct_9fa48("4156") ? "" : (stryCov_9fa48("4156"), 'Name cannot contain numbers'));
      }
    }

    // Check for special characters (allow only letters, spaces, hyphens, and apostrophes)
    if (stryMutAct_9fa48("4159") ? false : stryMutAct_9fa48("4158") ? true : stryMutAct_9fa48("4157") ? /^[a-zA-Z\s'-]+$/.test(trimmedName) : (stryCov_9fa48("4157", "4158", "4159"), !(stryMutAct_9fa48("4164") ? /^[a-zA-Z\S'-]+$/ : stryMutAct_9fa48("4163") ? /^[^a-zA-Z\s'-]+$/ : stryMutAct_9fa48("4162") ? /^[a-zA-Z\s'-]$/ : stryMutAct_9fa48("4161") ? /^[a-zA-Z\s'-]+/ : stryMutAct_9fa48("4160") ? /[a-zA-Z\s'-]+$/ : (stryCov_9fa48("4160", "4161", "4162", "4163", "4164"), /^[a-zA-Z\s'-]+$/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4165")) {
        {}
      } else {
        stryCov_9fa48("4165");
        errors.push(stryMutAct_9fa48("4166") ? "" : (stryCov_9fa48("4166"), 'Name can only contain letters, spaces, hyphens, and apostrophes'));
      }
    }

    // Check for multiple consecutive spaces
    if (stryMutAct_9fa48("4168") ? false : stryMutAct_9fa48("4167") ? true : (stryCov_9fa48("4167", "4168"), (stryMutAct_9fa48("4170") ? /\S{2,}/ : stryMutAct_9fa48("4169") ? /\s/ : (stryCov_9fa48("4169", "4170"), /\s{2,}/)).test(trimmedName))) {
      if (stryMutAct_9fa48("4171")) {
        {}
      } else {
        stryCov_9fa48("4171");
        errors.push(stryMutAct_9fa48("4172") ? "" : (stryCov_9fa48("4172"), 'Name cannot contain multiple consecutive spaces'));
      }
    }
    return stryMutAct_9fa48("4173") ? {} : (stryCov_9fa48("4173"), {
      isValid: stryMutAct_9fa48("4176") ? errors.length !== 0 : stryMutAct_9fa48("4175") ? false : stryMutAct_9fa48("4174") ? true : (stryCov_9fa48("4174", "4175", "4176"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate email - check format and block disposable emails
 */
export function validateEmail(email) {
  if (stryMutAct_9fa48("4177")) {
    {}
  } else {
    stryCov_9fa48("4177");
    const errors = stryMutAct_9fa48("4178") ? ["Stryker was here"] : (stryCov_9fa48("4178"), []);
    if (stryMutAct_9fa48("4181") ? !email && !email.trim() : stryMutAct_9fa48("4180") ? false : stryMutAct_9fa48("4179") ? true : (stryCov_9fa48("4179", "4180", "4181"), (stryMutAct_9fa48("4182") ? email : (stryCov_9fa48("4182"), !email)) || (stryMutAct_9fa48("4183") ? email.trim() : (stryCov_9fa48("4183"), !(stryMutAct_9fa48("4184") ? email : (stryCov_9fa48("4184"), email.trim())))))) {
      if (stryMutAct_9fa48("4185")) {
        {}
      } else {
        stryCov_9fa48("4185");
        errors.push(stryMutAct_9fa48("4186") ? "" : (stryCov_9fa48("4186"), 'Email is required'));
        return stryMutAct_9fa48("4187") ? {} : (stryCov_9fa48("4187"), {
          isValid: stryMutAct_9fa48("4188") ? true : (stryCov_9fa48("4188"), false),
          errors
        });
      }
    }
    const trimmedEmail = stryMutAct_9fa48("4190") ? email.toLowerCase() : stryMutAct_9fa48("4189") ? email.trim().toUpperCase() : (stryCov_9fa48("4189", "4190"), email.trim().toLowerCase());

    // Basic email format validation
    const emailRegex = stryMutAct_9fa48("4201") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("4200") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("4199") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("4198") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("4197") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4196") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("4195") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4194") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4193") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("4192") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("4191") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("4191", "4192", "4193", "4194", "4195", "4196", "4197", "4198", "4199", "4200", "4201"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (stryMutAct_9fa48("4204") ? false : stryMutAct_9fa48("4203") ? true : stryMutAct_9fa48("4202") ? emailRegex.test(trimmedEmail) : (stryCov_9fa48("4202", "4203", "4204"), !emailRegex.test(trimmedEmail))) {
      if (stryMutAct_9fa48("4205")) {
        {}
      } else {
        stryCov_9fa48("4205");
        errors.push(stryMutAct_9fa48("4206") ? "" : (stryCov_9fa48("4206"), 'Invalid email format'));
        return stryMutAct_9fa48("4207") ? {} : (stryCov_9fa48("4207"), {
          isValid: stryMutAct_9fa48("4208") ? true : (stryCov_9fa48("4208"), false),
          errors
        });
      }
    }

    // Extract domain
    const domain = trimmedEmail.split(stryMutAct_9fa48("4209") ? "" : (stryCov_9fa48("4209"), '@'))[1];

    // Check if it's a disposable email
    if (stryMutAct_9fa48("4211") ? false : stryMutAct_9fa48("4210") ? true : (stryCov_9fa48("4210", "4211"), DISPOSABLE_EMAIL_DOMAINS.includes(domain))) {
      if (stryMutAct_9fa48("4212")) {
        {}
      } else {
        stryCov_9fa48("4212");
        errors.push(stryMutAct_9fa48("4213") ? "" : (stryCov_9fa48("4213"), 'Disposable email addresses are not allowed. Please use a permanent email address'));
      }
    }

    // Additional checks for suspicious patterns
    if (stryMutAct_9fa48("4216") ? (domain.includes('temp') || domain.includes('fake')) && domain.includes('trash') : stryMutAct_9fa48("4215") ? false : stryMutAct_9fa48("4214") ? true : (stryCov_9fa48("4214", "4215", "4216"), (stryMutAct_9fa48("4218") ? domain.includes('temp') && domain.includes('fake') : stryMutAct_9fa48("4217") ? false : (stryCov_9fa48("4217", "4218"), domain.includes(stryMutAct_9fa48("4219") ? "" : (stryCov_9fa48("4219"), 'temp')) || domain.includes(stryMutAct_9fa48("4220") ? "" : (stryCov_9fa48("4220"), 'fake')))) || domain.includes(stryMutAct_9fa48("4221") ? "" : (stryCov_9fa48("4221"), 'trash')))) {
      if (stryMutAct_9fa48("4222")) {
        {}
      } else {
        stryCov_9fa48("4222");
        errors.push(stryMutAct_9fa48("4223") ? "" : (stryCov_9fa48("4223"), 'Temporary email addresses are not allowed. Please use a permanent email address'));
      }
    }
    return stryMutAct_9fa48("4224") ? {} : (stryCov_9fa48("4224"), {
      isValid: stryMutAct_9fa48("4227") ? errors.length !== 0 : stryMutAct_9fa48("4226") ? false : stryMutAct_9fa48("4225") ? true : (stryCov_9fa48("4225", "4226", "4227"), errors.length === 0),
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
export function validatePassword(password, email = stryMutAct_9fa48("4228") ? "Stryker was here!" : (stryCov_9fa48("4228"), ''), name = stryMutAct_9fa48("4229") ? "Stryker was here!" : (stryCov_9fa48("4229"), '')) {
  if (stryMutAct_9fa48("4230")) {
    {}
  } else {
    stryCov_9fa48("4230");
    const errors = stryMutAct_9fa48("4231") ? ["Stryker was here"] : (stryCov_9fa48("4231"), []);
    if (stryMutAct_9fa48("4234") ? false : stryMutAct_9fa48("4233") ? true : stryMutAct_9fa48("4232") ? password : (stryCov_9fa48("4232", "4233", "4234"), !password)) {
      if (stryMutAct_9fa48("4235")) {
        {}
      } else {
        stryCov_9fa48("4235");
        errors.push(stryMutAct_9fa48("4236") ? "" : (stryCov_9fa48("4236"), 'Password is required'));
        return stryMutAct_9fa48("4237") ? {} : (stryCov_9fa48("4237"), {
          isValid: stryMutAct_9fa48("4238") ? true : (stryCov_9fa48("4238"), false),
          errors,
          strength: stryMutAct_9fa48("4239") ? "" : (stryCov_9fa48("4239"), 'weak')
        });
      }
    }

    // Check minimum length
    if (stryMutAct_9fa48("4243") ? password.length >= 8 : stryMutAct_9fa48("4242") ? password.length <= 8 : stryMutAct_9fa48("4241") ? false : stryMutAct_9fa48("4240") ? true : (stryCov_9fa48("4240", "4241", "4242", "4243"), password.length < 8)) {
      if (stryMutAct_9fa48("4244")) {
        {}
      } else {
        stryCov_9fa48("4244");
        errors.push(stryMutAct_9fa48("4245") ? "" : (stryCov_9fa48("4245"), 'Password must be at least 8 characters long'));
      }
    }

    // Check for uppercase letter
    if (stryMutAct_9fa48("4248") ? false : stryMutAct_9fa48("4247") ? true : stryMutAct_9fa48("4246") ? /[A-Z]/.test(password) : (stryCov_9fa48("4246", "4247", "4248"), !(stryMutAct_9fa48("4249") ? /[^A-Z]/ : (stryCov_9fa48("4249"), /[A-Z]/)).test(password))) {
      if (stryMutAct_9fa48("4250")) {
        {}
      } else {
        stryCov_9fa48("4250");
        errors.push(stryMutAct_9fa48("4251") ? "" : (stryCov_9fa48("4251"), 'Password must contain at least one uppercase letter'));
      }
    }

    // Check for lowercase letter
    if (stryMutAct_9fa48("4254") ? false : stryMutAct_9fa48("4253") ? true : stryMutAct_9fa48("4252") ? /[a-z]/.test(password) : (stryCov_9fa48("4252", "4253", "4254"), !(stryMutAct_9fa48("4255") ? /[^a-z]/ : (stryCov_9fa48("4255"), /[a-z]/)).test(password))) {
      if (stryMutAct_9fa48("4256")) {
        {}
      } else {
        stryCov_9fa48("4256");
        errors.push(stryMutAct_9fa48("4257") ? "" : (stryCov_9fa48("4257"), 'Password must contain at least one lowercase letter'));
      }
    }

    // Check for number
    if (stryMutAct_9fa48("4260") ? false : stryMutAct_9fa48("4259") ? true : stryMutAct_9fa48("4258") ? /\d/.test(password) : (stryCov_9fa48("4258", "4259", "4260"), !(stryMutAct_9fa48("4261") ? /\D/ : (stryCov_9fa48("4261"), /\d/)).test(password))) {
      if (stryMutAct_9fa48("4262")) {
        {}
      } else {
        stryCov_9fa48("4262");
        errors.push(stryMutAct_9fa48("4263") ? "" : (stryCov_9fa48("4263"), 'Password must contain at least one number'));
      }
    }

    // Check for special character
    if (stryMutAct_9fa48("4266") ? false : stryMutAct_9fa48("4265") ? true : stryMutAct_9fa48("4264") ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) : (stryCov_9fa48("4264", "4265", "4266"), !(stryMutAct_9fa48("4267") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4267"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password))) {
      if (stryMutAct_9fa48("4268")) {
        {}
      } else {
        stryCov_9fa48("4268");
        errors.push(stryMutAct_9fa48("4269") ? "" : (stryCov_9fa48("4269"), 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'));
      }
    }

    // Check if password is same as email (case insensitive)
    if (stryMutAct_9fa48("4272") ? email || password.toLowerCase() === email.toLowerCase() : stryMutAct_9fa48("4271") ? false : stryMutAct_9fa48("4270") ? true : (stryCov_9fa48("4270", "4271", "4272"), email && (stryMutAct_9fa48("4274") ? password.toLowerCase() !== email.toLowerCase() : stryMutAct_9fa48("4273") ? true : (stryCov_9fa48("4273", "4274"), (stryMutAct_9fa48("4275") ? password.toUpperCase() : (stryCov_9fa48("4275"), password.toLowerCase())) === (stryMutAct_9fa48("4276") ? email.toUpperCase() : (stryCov_9fa48("4276"), email.toLowerCase())))))) {
      if (stryMutAct_9fa48("4277")) {
        {}
      } else {
        stryCov_9fa48("4277");
        errors.push(stryMutAct_9fa48("4278") ? "" : (stryCov_9fa48("4278"), 'Password cannot be the same as your email'));
      }
    }

    // Password can contain name - restriction removed per user request
    // Users should be able to use their name in passwords if they want

    // Calculate password strength
    let strength = stryMutAct_9fa48("4279") ? "" : (stryCov_9fa48("4279"), 'weak');
    if (stryMutAct_9fa48("4282") ? errors.length !== 0 : stryMutAct_9fa48("4281") ? false : stryMutAct_9fa48("4280") ? true : (stryCov_9fa48("4280", "4281", "4282"), errors.length === 0)) {
      if (stryMutAct_9fa48("4283")) {
        {}
      } else {
        stryCov_9fa48("4283");
        let score = 0;

        // Length bonus
        if (stryMutAct_9fa48("4287") ? password.length < 12 : stryMutAct_9fa48("4286") ? password.length > 12 : stryMutAct_9fa48("4285") ? false : stryMutAct_9fa48("4284") ? true : (stryCov_9fa48("4284", "4285", "4286", "4287"), password.length >= 12)) stryMutAct_9fa48("4288") ? score -= 2 : (stryCov_9fa48("4288"), score += 2);else if (stryMutAct_9fa48("4292") ? password.length < 10 : stryMutAct_9fa48("4291") ? password.length > 10 : stryMutAct_9fa48("4290") ? false : stryMutAct_9fa48("4289") ? true : (stryCov_9fa48("4289", "4290", "4291", "4292"), password.length >= 10)) stryMutAct_9fa48("4293") ? score -= 1 : (stryCov_9fa48("4293"), score += 1);

        // Complexity bonus
        if (stryMutAct_9fa48("4295") ? false : stryMutAct_9fa48("4294") ? true : (stryCov_9fa48("4294", "4295"), (stryMutAct_9fa48("4296") ? /[^A-Z]/ : (stryCov_9fa48("4296"), /[A-Z]/)).test(password))) stryMutAct_9fa48("4297") ? score -= 1 : (stryCov_9fa48("4297"), score += 1);
        if (stryMutAct_9fa48("4299") ? false : stryMutAct_9fa48("4298") ? true : (stryCov_9fa48("4298", "4299"), (stryMutAct_9fa48("4300") ? /[^a-z]/ : (stryCov_9fa48("4300"), /[a-z]/)).test(password))) stryMutAct_9fa48("4301") ? score -= 1 : (stryCov_9fa48("4301"), score += 1);
        if (stryMutAct_9fa48("4303") ? false : stryMutAct_9fa48("4302") ? true : (stryCov_9fa48("4302", "4303"), (stryMutAct_9fa48("4304") ? /\D/ : (stryCov_9fa48("4304"), /\d/)).test(password))) stryMutAct_9fa48("4305") ? score -= 1 : (stryCov_9fa48("4305"), score += 1);
        if (stryMutAct_9fa48("4307") ? false : stryMutAct_9fa48("4306") ? true : (stryCov_9fa48("4306", "4307"), (stryMutAct_9fa48("4308") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4308"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password))) stryMutAct_9fa48("4309") ? score -= 1 : (stryCov_9fa48("4309"), score += 1);

        // Multiple character types
        const hasMultipleTypes = stryMutAct_9fa48("4310") ? [/[A-Z]/.test(password), /[a-z]/.test(password), /\d/.test(password), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)].length : (stryCov_9fa48("4310"), (stryMutAct_9fa48("4311") ? [] : (stryCov_9fa48("4311"), [(stryMutAct_9fa48("4312") ? /[^A-Z]/ : (stryCov_9fa48("4312"), /[A-Z]/)).test(password), (stryMutAct_9fa48("4313") ? /[^a-z]/ : (stryCov_9fa48("4313"), /[a-z]/)).test(password), (stryMutAct_9fa48("4314") ? /\D/ : (stryCov_9fa48("4314"), /\d/)).test(password), (stryMutAct_9fa48("4315") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("4315"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password)])).filter(Boolean).length);
        if (stryMutAct_9fa48("4319") ? hasMultipleTypes < 4 : stryMutAct_9fa48("4318") ? hasMultipleTypes > 4 : stryMutAct_9fa48("4317") ? false : stryMutAct_9fa48("4316") ? true : (stryCov_9fa48("4316", "4317", "4318", "4319"), hasMultipleTypes >= 4)) stryMutAct_9fa48("4320") ? score -= 1 : (stryCov_9fa48("4320"), score += 1);
        if (stryMutAct_9fa48("4324") ? score < 7 : stryMutAct_9fa48("4323") ? score > 7 : stryMutAct_9fa48("4322") ? false : stryMutAct_9fa48("4321") ? true : (stryCov_9fa48("4321", "4322", "4323", "4324"), score >= 7)) strength = stryMutAct_9fa48("4325") ? "" : (stryCov_9fa48("4325"), 'strong');else if (stryMutAct_9fa48("4329") ? score < 5 : stryMutAct_9fa48("4328") ? score > 5 : stryMutAct_9fa48("4327") ? false : stryMutAct_9fa48("4326") ? true : (stryCov_9fa48("4326", "4327", "4328", "4329"), score >= 5)) strength = stryMutAct_9fa48("4330") ? "" : (stryCov_9fa48("4330"), 'medium');
      }
    }
    return stryMutAct_9fa48("4331") ? {} : (stryCov_9fa48("4331"), {
      isValid: stryMutAct_9fa48("4334") ? errors.length !== 0 : stryMutAct_9fa48("4333") ? false : stryMutAct_9fa48("4332") ? true : (stryCov_9fa48("4332", "4333", "4334"), errors.length === 0),
      errors,
      strength
    });
  }
}

/**
 * Generate strong password suggestions
 */
export function generatePasswordSuggestions(count = 3) {
  if (stryMutAct_9fa48("4335")) {
    {}
  } else {
    stryCov_9fa48("4335");
    const lowercase = stryMutAct_9fa48("4336") ? "" : (stryCov_9fa48("4336"), 'abcdefghijklmnopqrstuvwxyz');
    const uppercase = stryMutAct_9fa48("4337") ? "" : (stryCov_9fa48("4337"), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    const numbers = stryMutAct_9fa48("4338") ? "" : (stryCov_9fa48("4338"), '0123456789');
    const special = stryMutAct_9fa48("4339") ? "" : (stryCov_9fa48("4339"), '!@#$%^&*()_+-=[]{}');
    const suggestions = stryMutAct_9fa48("4340") ? ["Stryker was here"] : (stryCov_9fa48("4340"), []);
    for (let i = 0; stryMutAct_9fa48("4343") ? i >= count : stryMutAct_9fa48("4342") ? i <= count : stryMutAct_9fa48("4341") ? false : (stryCov_9fa48("4341", "4342", "4343"), i < count); stryMutAct_9fa48("4344") ? i-- : (stryCov_9fa48("4344"), i++)) {
      if (stryMutAct_9fa48("4345")) {
        {}
      } else {
        stryCov_9fa48("4345");
        let password = stryMutAct_9fa48("4346") ? "Stryker was here!" : (stryCov_9fa48("4346"), '');

        // Ensure at least one of each required type
        stryMutAct_9fa48("4347") ? password -= uppercase[Math.floor(Math.random() * uppercase.length)] : (stryCov_9fa48("4347"), password += uppercase[Math.floor(stryMutAct_9fa48("4348") ? Math.random() / uppercase.length : (stryCov_9fa48("4348"), Math.random() * uppercase.length))]);
        stryMutAct_9fa48("4349") ? password -= lowercase[Math.floor(Math.random() * lowercase.length)] : (stryCov_9fa48("4349"), password += lowercase[Math.floor(stryMutAct_9fa48("4350") ? Math.random() / lowercase.length : (stryCov_9fa48("4350"), Math.random() * lowercase.length))]);
        stryMutAct_9fa48("4351") ? password -= numbers[Math.floor(Math.random() * numbers.length)] : (stryCov_9fa48("4351"), password += numbers[Math.floor(stryMutAct_9fa48("4352") ? Math.random() / numbers.length : (stryCov_9fa48("4352"), Math.random() * numbers.length))]);
        stryMutAct_9fa48("4353") ? password -= special[Math.floor(Math.random() * special.length)] : (stryCov_9fa48("4353"), password += special[Math.floor(stryMutAct_9fa48("4354") ? Math.random() / special.length : (stryCov_9fa48("4354"), Math.random() * special.length))]);

        // Fill the rest with random characters (total length 12-16)
        const allChars = stryMutAct_9fa48("4355") ? lowercase + uppercase + numbers - special : (stryCov_9fa48("4355"), (stryMutAct_9fa48("4356") ? lowercase + uppercase - numbers : (stryCov_9fa48("4356"), (stryMutAct_9fa48("4357") ? lowercase - uppercase : (stryCov_9fa48("4357"), lowercase + uppercase)) + numbers)) + special);
        const remainingLength = stryMutAct_9fa48("4358") ? 8 - Math.floor(Math.random() * 5) : (stryCov_9fa48("4358"), 8 + Math.floor(stryMutAct_9fa48("4359") ? Math.random() / 5 : (stryCov_9fa48("4359"), Math.random() * 5))); // 8-12 more characters

        for (let j = 0; stryMutAct_9fa48("4362") ? j >= remainingLength : stryMutAct_9fa48("4361") ? j <= remainingLength : stryMutAct_9fa48("4360") ? false : (stryCov_9fa48("4360", "4361", "4362"), j < remainingLength); stryMutAct_9fa48("4363") ? j-- : (stryCov_9fa48("4363"), j++)) {
          if (stryMutAct_9fa48("4364")) {
            {}
          } else {
            stryCov_9fa48("4364");
            stryMutAct_9fa48("4365") ? password -= allChars[Math.floor(Math.random() * allChars.length)] : (stryCov_9fa48("4365"), password += allChars[Math.floor(stryMutAct_9fa48("4366") ? Math.random() / allChars.length : (stryCov_9fa48("4366"), Math.random() * allChars.length))]);
          }
        }

        // Shuffle the password
        password = stryMutAct_9fa48("4367") ? password.split('').join('') : (stryCov_9fa48("4367"), password.split(stryMutAct_9fa48("4368") ? "Stryker was here!" : (stryCov_9fa48("4368"), '')).sort(stryMutAct_9fa48("4369") ? () => undefined : (stryCov_9fa48("4369"), () => stryMutAct_9fa48("4370") ? Math.random() + 0.5 : (stryCov_9fa48("4370"), Math.random() - 0.5))).join(stryMutAct_9fa48("4371") ? "Stryker was here!" : (stryCov_9fa48("4371"), '')));
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
  if (stryMutAct_9fa48("4372")) {
    {}
  } else {
    stryCov_9fa48("4372");
    const errors = stryMutAct_9fa48("4373") ? ["Stryker was here"] : (stryCov_9fa48("4373"), []);
    if (stryMutAct_9fa48("4376") ? false : stryMutAct_9fa48("4375") ? true : stryMutAct_9fa48("4374") ? otp : (stryCov_9fa48("4374", "4375", "4376"), !otp)) {
      if (stryMutAct_9fa48("4377")) {
        {}
      } else {
        stryCov_9fa48("4377");
        errors.push(stryMutAct_9fa48("4378") ? "" : (stryCov_9fa48("4378"), 'OTP is required'));
        return stryMutAct_9fa48("4379") ? {} : (stryCov_9fa48("4379"), {
          isValid: stryMutAct_9fa48("4380") ? true : (stryCov_9fa48("4380"), false),
          errors
        });
      }
    }

    // OTP should be exactly 6 digits
    if (stryMutAct_9fa48("4383") ? false : stryMutAct_9fa48("4382") ? true : stryMutAct_9fa48("4381") ? /^\d{6}$/.test(otp) : (stryCov_9fa48("4381", "4382", "4383"), !(stryMutAct_9fa48("4387") ? /^\D{6}$/ : stryMutAct_9fa48("4386") ? /^\d$/ : stryMutAct_9fa48("4385") ? /^\d{6}/ : stryMutAct_9fa48("4384") ? /\d{6}$/ : (stryCov_9fa48("4384", "4385", "4386", "4387"), /^\d{6}$/)).test(otp))) {
      if (stryMutAct_9fa48("4388")) {
        {}
      } else {
        stryCov_9fa48("4388");
        errors.push(stryMutAct_9fa48("4389") ? "" : (stryCov_9fa48("4389"), 'OTP must be a 6-digit number'));
      }
    }
    return stryMutAct_9fa48("4390") ? {} : (stryCov_9fa48("4390"), {
      isValid: stryMutAct_9fa48("4393") ? errors.length !== 0 : stryMutAct_9fa48("4392") ? false : stryMutAct_9fa48("4391") ? true : (stryCov_9fa48("4391", "4392", "4393"), errors.length === 0),
      errors
    });
  }
}