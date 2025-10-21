/**
 * Email Validation Utility
 * Validates email addresses, detects disposable/temporary emails, and checks for trusted providers
 */

// List of trusted email providers (90% of users use these)
const TRUSTED_EMAIL_PROVIDERS = [
  // Google
  'gmail.com', 'googlemail.com',
  
  // Microsoft
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  
  // Yahoo
  'yahoo.com', 'yahoo.co.uk', 'yahoo.in', 'yahoo.co.in', 'ymail.com',
  
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  
  // Other major providers
  'aol.com', 'protonmail.com', 'proton.me', 'zoho.com', 'mail.com',
  
  // Regional providers
  'rediffmail.com', 'gmx.com', 'gmx.net',
  
  // Corporate/Educational (common patterns)
  // These will be checked separately for patterns
];

// Comprehensive list of disposable/temporary email domains
// These are commonly used for temporary emails that expire
const DISPOSABLE_EMAIL_DOMAINS = [
  // Popular temporary email services
  '10minutemail.com', '10minutemail.net', 'tempmail.com', 'temp-mail.org',
  'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', 'guerrillamail.biz',
  'mailinator.com', 'maildrop.cc', 'throwaway.email', 'trashmail.com',
  'getnada.com', 'tempr.email', 'temp-mail.io', 'mohmal.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf',
  'jetable.fr.nf', 'nospam.ze.tc', 'nomail.xl.cx', 'mega.zik.dj',
  'speed.1s.fr', 'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf',
  'monmail.fr.nf', 'hide.biz.st', 'mymail.infos.st',
  
  // Telegram bot emails
  'teleosaurs.xyz', 'tmail.ws', 'tmails.net', 'tmpmail.net', 'tmpmail.org',
  
  // Other disposable services
  'fakeinbox.com', 'spamgourmet.com', 'mailnesia.com', 'mintemail.com',
  'mytrashmail.com', 'emailondeck.com', 'throwawaymail.com', 'dispostable.com',
  'armyspy.com', 'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu',
  'gustr.com', 'jourrapide.com', 'rhyta.com', 'superrito.com', 'teleworm.us',
  'spam4.me', 'grr.la', 'mailcatch.com', 'mailforspam.com', 'mailtothis.com',
  'mt2009.com', 'mt2014.com', 'mytempemail.com', 'netmails.net', 'odnorazovoe.ru',
  'oopi.org', 'privacy.net', 'proxymail.eu', 'rcpt.at', 'recode.me',
  'recursor.net', 'rtrtr.com', 's0ny.net', 'safe-mail.net', 'safersignup.de',
  'safetymail.info', 'safetypost.de', 'sandelf.de', 'saynotospams.com',
  'selfdestructingmail.com', 'sendspamhere.com', 'shiftmail.com', 'shortmail.net',
  'sibmail.com', 'skeefmail.com', 'slaskpost.se', 'slopsbox.com', 'smellfear.com',
  'snakemail.com', 'sneakemail.com', 'sofimail.com', 'sofort-mail.de',
  'sogetthis.com', 'soodonims.com', 'spam.la', 'spamavert.com', 'spambob.com',
  'spambog.com', 'spambog.de', 'spambog.ru', 'spambox.us', 'spamcannon.com',
  'spamcannon.net', 'spamcon.org', 'spamcorptastic.com', 'spamcowboy.com',
  'spamcowboy.net', 'spamcowboy.org', 'spamday.com', 'spamex.com', 'spamfree24.com',
  'spamfree24.de', 'spamfree24.eu', 'spamfree24.info', 'spamfree24.net',
  'spamfree24.org', 'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'spamherelots.com', 'spamhereplease.com', 'spamhole.com', 'spamify.com',
  'spaminator.de', 'spamkill.info', 'spaml.com', 'spaml.de', 'spammotel.com',
  'spamobox.com', 'spamoff.de', 'spamslicer.com', 'spamspot.com', 'spamthis.co.uk',
  'spamthisplease.com', 'spamtrail.com', 'speed.1s.fr', 'supergreatmail.com',
  'supermailer.jp', 'suremail.info', 'talkinator.com', 'teleworm.com',
  'temp-mail.com', 'temp-mail.de', 'temp-mail.org', 'temp-mail.ru',
  'tempail.com', 'tempalias.com', 'tempe-mail.com', 'tempemail.biz',
  'tempemail.co.za', 'tempemail.com', 'tempemail.net', 'tempinbox.co.uk',
  'tempinbox.com', 'tempmail.eu', 'tempmail.it', 'tempmail2.com',
  'tempmaildemo.com', 'tempmailer.com', 'tempmailer.de', 'tempomail.fr',
  'temporarily.de', 'temporarioemail.com.br', 'temporaryemail.net',
  'temporaryemail.us', 'temporaryforwarding.com', 'temporaryinbox.com',
  'temporarymailaddress.com', 'tempthe.net', 'thankyou2010.com',
  'thisisnotmyrealemail.com', 'throwawayemailaddress.com', 'tilien.com',
  'tittbit.in', 'tizi.com', 'tmailinator.com', 'trbvm.com', 'trillianpro.com',
  'tryalert.com', 'turual.com', 'twinmail.de', 'tyldd.com', 'uggsrock.com',
  'upliftnow.com', 'uplipht.com', 'venompen.com', 'veryrealemail.com',
  'viditag.com', 'viewcastmedia.com', 'viewcastmedia.net', 'viewcastmedia.org',
  'webm4il.info', 'wegwerfadresse.de', 'wegwerfemail.de', 'wegwerfmail.de',
  'wegwerfmail.net', 'wegwerfmail.org', 'wetrainbayarea.com', 'wetrainbayarea.org',
  'wh4f.org', 'whyspam.me', 'willselfdestruct.com', 'winemaven.info',
  'wronghead.com', 'wuzup.net', 'wuzupmail.net', 'www.e4ward.com',
  'www.gishpuppy.com', 'www.mailinator.com', 'wwwnew.eu', 'xagloo.com',
  'xemaps.com', 'xents.com', 'xmaily.com', 'xoxy.net', 'yapped.net',
  'yeah.net', 'yep.it', 'yogamaven.com', 'yopmail.com', 'yopmail.fr',
  'yopmail.net', 'yourdomain.com', 'yuurok.com', 'zehnminuten.de',
  'zehnminutenmail.de', 'zetmail.com', 'zippymail.info', 'zoaxe.com',
  'zoemail.com', 'zomg.info'
];

// Patterns that indicate disposable emails
const DISPOSABLE_PATTERNS = [
  /temp.*mail/i,
  /trash.*mail/i,
  /throw.*away/i,
  /disposable/i,
  /guerrilla/i,
  /fake.*mail/i,
  /spam.*mail/i,
  /10.*minute/i,
  /mailinator/i,
  /yopmail/i
];

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
function isValidEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extracts domain from email address
 * @param {string} email - Email address
 * @returns {string} Domain part of email
 */
function extractDomain(email) {
  return email.split('@')[1]?.toLowerCase() || '';
}

/**
 * Checks if email domain is from a trusted provider
 * @param {string} email - Email address to check
 * @returns {boolean} True if from trusted provider
 */
function isTrustedProvider(email) {
  const domain = extractDomain(email);
  
  // Check against trusted providers list
  if (TRUSTED_EMAIL_PROVIDERS.includes(domain)) {
    return true;
  }
  
  // Check for corporate/educational emails (common patterns)
  // These typically end with .edu, .ac.*, .edu.*, or have company domains
  if (domain.endsWith('.edu') || 
      domain.endsWith('.ac.in') || 
      domain.endsWith('.edu.in') ||
      domain.includes('.edu.') ||
      domain.includes('.ac.')) {
    return true;
  }
  
  return false;
}

/**
 * Checks if email is from a disposable/temporary email service
 * @param {string} email - Email address to check
 * @returns {boolean} True if disposable email detected
 */
function isDisposableEmail(email) {
  const domain = extractDomain(email);
  
  // Check against known disposable domains
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return true;
  }
  
  // Check against disposable patterns
  for (const pattern of DISPOSABLE_PATTERNS) {
    if (pattern.test(domain)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Comprehensive email validation
 * @param {string} email - Email address to validate
 * @returns {Object} Validation result with details
 */
export function validateEmail(email) {
  const errors = [];
  const warnings = [];
  
  // Basic format validation
  if (!isValidEmailFormat(email)) {
    errors.push('Invalid email format');
    return {
      isValid: false,
      isTrusted: false,
      isDisposable: false,
      errors,
      warnings
    };
  }
  
  const domain = extractDomain(email);
  const isTrusted = isTrustedProvider(email);
  const isDisposable = isDisposableEmail(email);
  
  // Check for disposable email
  if (isDisposable) {
    errors.push('Temporary or disposable email addresses are not allowed');
    errors.push('Please use a permanent email address for account verification and notifications');
  }
  
  // Warn if not from trusted provider (but don't block)
  if (!isTrusted && !isDisposable) {
    warnings.push(`Email domain '${domain}' is not commonly used. Please ensure it's a valid, permanent email address.`);
  }
  
  const isValid = errors.length === 0;
  
  return {
    isValid,
    isTrusted,
    isDisposable,
    domain,
    errors,
    warnings
  };
}

/**
 * Gets list of recommended email providers
 * @returns {Array<string>} List of recommended email domains
 */
export function getRecommendedProviders() {
  return [
    'gmail.com',
    'outlook.com',
    'yahoo.com',
    'icloud.com',
    'protonmail.com'
  ];
}

export default {
  validateEmail,
  isDisposableEmail,
  isTrustedProvider,
  getRecommendedProviders
};
