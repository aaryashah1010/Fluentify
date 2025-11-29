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
const DISPOSABLE_EMAIL_DOMAINS = stryMutAct_9fa48("1541") ? [] : (stryCov_9fa48("1541"), [stryMutAct_9fa48("1542") ? "" : (stryCov_9fa48("1542"), 'tempmail.com'), stryMutAct_9fa48("1543") ? "" : (stryCov_9fa48("1543"), 'temp-mail.org'), stryMutAct_9fa48("1544") ? "" : (stryCov_9fa48("1544"), 'guerrillamail.com'), stryMutAct_9fa48("1545") ? "" : (stryCov_9fa48("1545"), '10minutemail.com'), stryMutAct_9fa48("1546") ? "" : (stryCov_9fa48("1546"), 'throwaway.email'), stryMutAct_9fa48("1547") ? "" : (stryCov_9fa48("1547"), 'maildrop.cc'), stryMutAct_9fa48("1548") ? "" : (stryCov_9fa48("1548"), 'mailinator.com'), stryMutAct_9fa48("1549") ? "" : (stryCov_9fa48("1549"), 'trashmail.com'), stryMutAct_9fa48("1550") ? "" : (stryCov_9fa48("1550"), 'yopmail.com'), stryMutAct_9fa48("1551") ? "" : (stryCov_9fa48("1551"), 'fakeinbox.com'), stryMutAct_9fa48("1552") ? "" : (stryCov_9fa48("1552"), 'getnada.com'), stryMutAct_9fa48("1553") ? "" : (stryCov_9fa48("1553"), 'temp-mail.io'), stryMutAct_9fa48("1554") ? "" : (stryCov_9fa48("1554"), 'mohmal.com'), stryMutAct_9fa48("1555") ? "" : (stryCov_9fa48("1555"), 'sharklasers.com'), stryMutAct_9fa48("1556") ? "" : (stryCov_9fa48("1556"), 'guerrillamailblock.com'), stryMutAct_9fa48("1557") ? "" : (stryCov_9fa48("1557"), 'spam4.me'), stryMutAct_9fa48("1558") ? "" : (stryCov_9fa48("1558"), 'grr.la'), stryMutAct_9fa48("1559") ? "" : (stryCov_9fa48("1559"), 'guerrillamail.biz'), stryMutAct_9fa48("1560") ? "" : (stryCov_9fa48("1560"), 'guerrillamail.de'), stryMutAct_9fa48("1561") ? "" : (stryCov_9fa48("1561"), 'guerrillamail.net'), stryMutAct_9fa48("1562") ? "" : (stryCov_9fa48("1562"), 'guerrillamail.org'), stryMutAct_9fa48("1563") ? "" : (stryCov_9fa48("1563"), 'guerrillamailblock.com'), stryMutAct_9fa48("1564") ? "" : (stryCov_9fa48("1564"), 'pokemail.net'), stryMutAct_9fa48("1565") ? "" : (stryCov_9fa48("1565"), 'spam4.me'), stryMutAct_9fa48("1566") ? "" : (stryCov_9fa48("1566"), 'trbvm.com'), stryMutAct_9fa48("1567") ? "" : (stryCov_9fa48("1567"), 'tmails.net'), stryMutAct_9fa48("1568") ? "" : (stryCov_9fa48("1568"), 'tmpmail.net'), stryMutAct_9fa48("1569") ? "" : (stryCov_9fa48("1569"), 'tmpmail.org'), stryMutAct_9fa48("1570") ? "" : (stryCov_9fa48("1570"), 'emailondeck.com')]);

/**
 * Validate name - no special characters, no numbers, only letters and spaces
 */
export function validateName(name) {
  if (stryMutAct_9fa48("1571")) {
    {}
  } else {
    stryCov_9fa48("1571");
    const errors = stryMutAct_9fa48("1572") ? ["Stryker was here"] : (stryCov_9fa48("1572"), []);
    if (stryMutAct_9fa48("1575") ? !name && !name.trim() : stryMutAct_9fa48("1574") ? false : stryMutAct_9fa48("1573") ? true : (stryCov_9fa48("1573", "1574", "1575"), (stryMutAct_9fa48("1576") ? name : (stryCov_9fa48("1576"), !name)) || (stryMutAct_9fa48("1577") ? name.trim() : (stryCov_9fa48("1577"), !(stryMutAct_9fa48("1578") ? name : (stryCov_9fa48("1578"), name.trim())))))) {
      if (stryMutAct_9fa48("1579")) {
        {}
      } else {
        stryCov_9fa48("1579");
        errors.push(stryMutAct_9fa48("1580") ? "" : (stryCov_9fa48("1580"), 'Name is required'));
        return stryMutAct_9fa48("1581") ? {} : (stryCov_9fa48("1581"), {
          isValid: stryMutAct_9fa48("1582") ? true : (stryCov_9fa48("1582"), false),
          errors
        });
      }
    }
    const trimmedName = stryMutAct_9fa48("1583") ? name : (stryCov_9fa48("1583"), name.trim());

    // Check for minimum length
    if (stryMutAct_9fa48("1587") ? trimmedName.length >= 2 : stryMutAct_9fa48("1586") ? trimmedName.length <= 2 : stryMutAct_9fa48("1585") ? false : stryMutAct_9fa48("1584") ? true : (stryCov_9fa48("1584", "1585", "1586", "1587"), trimmedName.length < 2)) {
      if (stryMutAct_9fa48("1588")) {
        {}
      } else {
        stryCov_9fa48("1588");
        errors.push(stryMutAct_9fa48("1589") ? "" : (stryCov_9fa48("1589"), 'Name must be at least 2 characters long'));
      }
    }

    // Check for maximum length
    if (stryMutAct_9fa48("1593") ? trimmedName.length <= 50 : stryMutAct_9fa48("1592") ? trimmedName.length >= 50 : stryMutAct_9fa48("1591") ? false : stryMutAct_9fa48("1590") ? true : (stryCov_9fa48("1590", "1591", "1592", "1593"), trimmedName.length > 50)) {
      if (stryMutAct_9fa48("1594")) {
        {}
      } else {
        stryCov_9fa48("1594");
        errors.push(stryMutAct_9fa48("1595") ? "" : (stryCov_9fa48("1595"), 'Name must not exceed 50 characters'));
      }
    }

    // Check for numbers
    if (stryMutAct_9fa48("1597") ? false : stryMutAct_9fa48("1596") ? true : (stryCov_9fa48("1596", "1597"), (stryMutAct_9fa48("1598") ? /\D/ : (stryCov_9fa48("1598"), /\d/)).test(trimmedName))) {
      if (stryMutAct_9fa48("1599")) {
        {}
      } else {
        stryCov_9fa48("1599");
        errors.push(stryMutAct_9fa48("1600") ? "" : (stryCov_9fa48("1600"), 'Name cannot contain numbers'));
      }
    }

    // Check for special characters (allow only letters, spaces, hyphens, and apostrophes)
    if (stryMutAct_9fa48("1603") ? false : stryMutAct_9fa48("1602") ? true : stryMutAct_9fa48("1601") ? /^[a-zA-Z\s'-]+$/.test(trimmedName) : (stryCov_9fa48("1601", "1602", "1603"), !(stryMutAct_9fa48("1608") ? /^[a-zA-Z\S'-]+$/ : stryMutAct_9fa48("1607") ? /^[^a-zA-Z\s'-]+$/ : stryMutAct_9fa48("1606") ? /^[a-zA-Z\s'-]$/ : stryMutAct_9fa48("1605") ? /^[a-zA-Z\s'-]+/ : stryMutAct_9fa48("1604") ? /[a-zA-Z\s'-]+$/ : (stryCov_9fa48("1604", "1605", "1606", "1607", "1608"), /^[a-zA-Z\s'-]+$/)).test(trimmedName))) {
      if (stryMutAct_9fa48("1609")) {
        {}
      } else {
        stryCov_9fa48("1609");
        errors.push(stryMutAct_9fa48("1610") ? "" : (stryCov_9fa48("1610"), 'Name can only contain letters, spaces, hyphens, and apostrophes'));
      }
    }

    // Check for multiple consecutive spaces
    if (stryMutAct_9fa48("1612") ? false : stryMutAct_9fa48("1611") ? true : (stryCov_9fa48("1611", "1612"), (stryMutAct_9fa48("1614") ? /\S{2,}/ : stryMutAct_9fa48("1613") ? /\s/ : (stryCov_9fa48("1613", "1614"), /\s{2,}/)).test(trimmedName))) {
      if (stryMutAct_9fa48("1615")) {
        {}
      } else {
        stryCov_9fa48("1615");
        errors.push(stryMutAct_9fa48("1616") ? "" : (stryCov_9fa48("1616"), 'Name cannot contain multiple consecutive spaces'));
      }
    }
    return stryMutAct_9fa48("1617") ? {} : (stryCov_9fa48("1617"), {
      isValid: stryMutAct_9fa48("1620") ? errors.length !== 0 : stryMutAct_9fa48("1619") ? false : stryMutAct_9fa48("1618") ? true : (stryCov_9fa48("1618", "1619", "1620"), errors.length === 0),
      errors
    });
  }
}

/**
 * Validate email - check format and block disposable emails
 */
export function validateEmail(email) {
  if (stryMutAct_9fa48("1621")) {
    {}
  } else {
    stryCov_9fa48("1621");
    const errors = stryMutAct_9fa48("1622") ? ["Stryker was here"] : (stryCov_9fa48("1622"), []);
    if (stryMutAct_9fa48("1625") ? !email && !email.trim() : stryMutAct_9fa48("1624") ? false : stryMutAct_9fa48("1623") ? true : (stryCov_9fa48("1623", "1624", "1625"), (stryMutAct_9fa48("1626") ? email : (stryCov_9fa48("1626"), !email)) || (stryMutAct_9fa48("1627") ? email.trim() : (stryCov_9fa48("1627"), !(stryMutAct_9fa48("1628") ? email : (stryCov_9fa48("1628"), email.trim())))))) {
      if (stryMutAct_9fa48("1629")) {
        {}
      } else {
        stryCov_9fa48("1629");
        errors.push(stryMutAct_9fa48("1630") ? "" : (stryCov_9fa48("1630"), 'Email is required'));
        return stryMutAct_9fa48("1631") ? {} : (stryCov_9fa48("1631"), {
          isValid: stryMutAct_9fa48("1632") ? true : (stryCov_9fa48("1632"), false),
          errors
        });
      }
    }
    const trimmedEmail = stryMutAct_9fa48("1634") ? email.toLowerCase() : stryMutAct_9fa48("1633") ? email.trim().toUpperCase() : (stryCov_9fa48("1633", "1634"), email.trim().toLowerCase());

    // Basic email format validation
    const emailRegex = stryMutAct_9fa48("1645") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("1644") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("1643") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("1642") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("1641") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1640") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("1639") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1638") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1637") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1636") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("1635") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("1635", "1636", "1637", "1638", "1639", "1640", "1641", "1642", "1643", "1644", "1645"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (stryMutAct_9fa48("1648") ? false : stryMutAct_9fa48("1647") ? true : stryMutAct_9fa48("1646") ? emailRegex.test(trimmedEmail) : (stryCov_9fa48("1646", "1647", "1648"), !emailRegex.test(trimmedEmail))) {
      if (stryMutAct_9fa48("1649")) {
        {}
      } else {
        stryCov_9fa48("1649");
        errors.push(stryMutAct_9fa48("1650") ? "" : (stryCov_9fa48("1650"), 'Invalid email format'));
        return stryMutAct_9fa48("1651") ? {} : (stryCov_9fa48("1651"), {
          isValid: stryMutAct_9fa48("1652") ? true : (stryCov_9fa48("1652"), false),
          errors
        });
      }
    }

    // Extract domain
    const domain = trimmedEmail.split(stryMutAct_9fa48("1653") ? "" : (stryCov_9fa48("1653"), '@'))[1];

    // Check if it's a disposable email
    if (stryMutAct_9fa48("1655") ? false : stryMutAct_9fa48("1654") ? true : (stryCov_9fa48("1654", "1655"), DISPOSABLE_EMAIL_DOMAINS.includes(domain))) {
      if (stryMutAct_9fa48("1656")) {
        {}
      } else {
        stryCov_9fa48("1656");
        errors.push(stryMutAct_9fa48("1657") ? "" : (stryCov_9fa48("1657"), 'Disposable email addresses are not allowed. Please use a permanent email address'));
      }
    }

    // Additional checks for suspicious patterns
    if (stryMutAct_9fa48("1660") ? (domain.includes('temp') || domain.includes('fake')) && domain.includes('trash') : stryMutAct_9fa48("1659") ? false : stryMutAct_9fa48("1658") ? true : (stryCov_9fa48("1658", "1659", "1660"), (stryMutAct_9fa48("1662") ? domain.includes('temp') && domain.includes('fake') : stryMutAct_9fa48("1661") ? false : (stryCov_9fa48("1661", "1662"), domain.includes(stryMutAct_9fa48("1663") ? "" : (stryCov_9fa48("1663"), 'temp')) || domain.includes(stryMutAct_9fa48("1664") ? "" : (stryCov_9fa48("1664"), 'fake')))) || domain.includes(stryMutAct_9fa48("1665") ? "" : (stryCov_9fa48("1665"), 'trash')))) {
      if (stryMutAct_9fa48("1666")) {
        {}
      } else {
        stryCov_9fa48("1666");
        errors.push(stryMutAct_9fa48("1667") ? "" : (stryCov_9fa48("1667"), 'Temporary email addresses are not allowed. Please use a permanent email address'));
      }
    }
    return stryMutAct_9fa48("1668") ? {} : (stryCov_9fa48("1668"), {
      isValid: stryMutAct_9fa48("1671") ? errors.length !== 0 : stryMutAct_9fa48("1670") ? false : stryMutAct_9fa48("1669") ? true : (stryCov_9fa48("1669", "1670", "1671"), errors.length === 0),
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
export function validatePassword(password, email = stryMutAct_9fa48("1672") ? "Stryker was here!" : (stryCov_9fa48("1672"), ''), name = stryMutAct_9fa48("1673") ? "Stryker was here!" : (stryCov_9fa48("1673"), '')) {
  if (stryMutAct_9fa48("1674")) {
    {}
  } else {
    stryCov_9fa48("1674");
    const errors = stryMutAct_9fa48("1675") ? ["Stryker was here"] : (stryCov_9fa48("1675"), []);
    if (stryMutAct_9fa48("1678") ? false : stryMutAct_9fa48("1677") ? true : stryMutAct_9fa48("1676") ? password : (stryCov_9fa48("1676", "1677", "1678"), !password)) {
      if (stryMutAct_9fa48("1679")) {
        {}
      } else {
        stryCov_9fa48("1679");
        errors.push(stryMutAct_9fa48("1680") ? "" : (stryCov_9fa48("1680"), 'Password is required'));
        return stryMutAct_9fa48("1681") ? {} : (stryCov_9fa48("1681"), {
          isValid: stryMutAct_9fa48("1682") ? true : (stryCov_9fa48("1682"), false),
          errors,
          strength: stryMutAct_9fa48("1683") ? "" : (stryCov_9fa48("1683"), 'weak')
        });
      }
    }

    // Check minimum length
    if (stryMutAct_9fa48("1687") ? password.length >= 8 : stryMutAct_9fa48("1686") ? password.length <= 8 : stryMutAct_9fa48("1685") ? false : stryMutAct_9fa48("1684") ? true : (stryCov_9fa48("1684", "1685", "1686", "1687"), password.length < 8)) {
      if (stryMutAct_9fa48("1688")) {
        {}
      } else {
        stryCov_9fa48("1688");
        errors.push(stryMutAct_9fa48("1689") ? "" : (stryCov_9fa48("1689"), 'Password must be at least 8 characters long'));
      }
    }

    // Check for uppercase letter
    if (stryMutAct_9fa48("1692") ? false : stryMutAct_9fa48("1691") ? true : stryMutAct_9fa48("1690") ? /[A-Z]/.test(password) : (stryCov_9fa48("1690", "1691", "1692"), !(stryMutAct_9fa48("1693") ? /[^A-Z]/ : (stryCov_9fa48("1693"), /[A-Z]/)).test(password))) {
      if (stryMutAct_9fa48("1694")) {
        {}
      } else {
        stryCov_9fa48("1694");
        errors.push(stryMutAct_9fa48("1695") ? "" : (stryCov_9fa48("1695"), 'Password must contain at least one uppercase letter'));
      }
    }

    // Check for lowercase letter
    if (stryMutAct_9fa48("1698") ? false : stryMutAct_9fa48("1697") ? true : stryMutAct_9fa48("1696") ? /[a-z]/.test(password) : (stryCov_9fa48("1696", "1697", "1698"), !(stryMutAct_9fa48("1699") ? /[^a-z]/ : (stryCov_9fa48("1699"), /[a-z]/)).test(password))) {
      if (stryMutAct_9fa48("1700")) {
        {}
      } else {
        stryCov_9fa48("1700");
        errors.push(stryMutAct_9fa48("1701") ? "" : (stryCov_9fa48("1701"), 'Password must contain at least one lowercase letter'));
      }
    }

    // Check for number
    if (stryMutAct_9fa48("1704") ? false : stryMutAct_9fa48("1703") ? true : stryMutAct_9fa48("1702") ? /\d/.test(password) : (stryCov_9fa48("1702", "1703", "1704"), !(stryMutAct_9fa48("1705") ? /\D/ : (stryCov_9fa48("1705"), /\d/)).test(password))) {
      if (stryMutAct_9fa48("1706")) {
        {}
      } else {
        stryCov_9fa48("1706");
        errors.push(stryMutAct_9fa48("1707") ? "" : (stryCov_9fa48("1707"), 'Password must contain at least one number'));
      }
    }

    // Check for special character
    if (stryMutAct_9fa48("1710") ? false : stryMutAct_9fa48("1709") ? true : stryMutAct_9fa48("1708") ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) : (stryCov_9fa48("1708", "1709", "1710"), !(stryMutAct_9fa48("1711") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("1711"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password))) {
      if (stryMutAct_9fa48("1712")) {
        {}
      } else {
        stryCov_9fa48("1712");
        errors.push(stryMutAct_9fa48("1713") ? "" : (stryCov_9fa48("1713"), 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'));
      }
    }

    // Check if password is same as email (case insensitive)
    if (stryMutAct_9fa48("1716") ? email || password.toLowerCase() === email.toLowerCase() : stryMutAct_9fa48("1715") ? false : stryMutAct_9fa48("1714") ? true : (stryCov_9fa48("1714", "1715", "1716"), email && (stryMutAct_9fa48("1718") ? password.toLowerCase() !== email.toLowerCase() : stryMutAct_9fa48("1717") ? true : (stryCov_9fa48("1717", "1718"), (stryMutAct_9fa48("1719") ? password.toUpperCase() : (stryCov_9fa48("1719"), password.toLowerCase())) === (stryMutAct_9fa48("1720") ? email.toUpperCase() : (stryCov_9fa48("1720"), email.toLowerCase())))))) {
      if (stryMutAct_9fa48("1721")) {
        {}
      } else {
        stryCov_9fa48("1721");
        errors.push(stryMutAct_9fa48("1722") ? "" : (stryCov_9fa48("1722"), 'Password cannot be the same as your email'));
      }
    }

    // Password can contain name - restriction removed per user request
    // Users should be able to use their name in passwords if they want

    // Calculate password strength
    let strength = stryMutAct_9fa48("1723") ? "" : (stryCov_9fa48("1723"), 'weak');
    if (stryMutAct_9fa48("1726") ? errors.length !== 0 : stryMutAct_9fa48("1725") ? false : stryMutAct_9fa48("1724") ? true : (stryCov_9fa48("1724", "1725", "1726"), errors.length === 0)) {
      if (stryMutAct_9fa48("1727")) {
        {}
      } else {
        stryCov_9fa48("1727");
        let score = 0;

        // Length bonus
        if (stryMutAct_9fa48("1731") ? password.length < 12 : stryMutAct_9fa48("1730") ? password.length > 12 : stryMutAct_9fa48("1729") ? false : stryMutAct_9fa48("1728") ? true : (stryCov_9fa48("1728", "1729", "1730", "1731"), password.length >= 12)) stryMutAct_9fa48("1732") ? score -= 2 : (stryCov_9fa48("1732"), score += 2);else if (stryMutAct_9fa48("1736") ? password.length < 10 : stryMutAct_9fa48("1735") ? password.length > 10 : stryMutAct_9fa48("1734") ? false : stryMutAct_9fa48("1733") ? true : (stryCov_9fa48("1733", "1734", "1735", "1736"), password.length >= 10)) stryMutAct_9fa48("1737") ? score -= 1 : (stryCov_9fa48("1737"), score += 1);

        // Complexity bonus
        if (stryMutAct_9fa48("1739") ? false : stryMutAct_9fa48("1738") ? true : (stryCov_9fa48("1738", "1739"), (stryMutAct_9fa48("1740") ? /[^A-Z]/ : (stryCov_9fa48("1740"), /[A-Z]/)).test(password))) stryMutAct_9fa48("1741") ? score -= 1 : (stryCov_9fa48("1741"), score += 1);
        if (stryMutAct_9fa48("1743") ? false : stryMutAct_9fa48("1742") ? true : (stryCov_9fa48("1742", "1743"), (stryMutAct_9fa48("1744") ? /[^a-z]/ : (stryCov_9fa48("1744"), /[a-z]/)).test(password))) stryMutAct_9fa48("1745") ? score -= 1 : (stryCov_9fa48("1745"), score += 1);
        if (stryMutAct_9fa48("1747") ? false : stryMutAct_9fa48("1746") ? true : (stryCov_9fa48("1746", "1747"), (stryMutAct_9fa48("1748") ? /\D/ : (stryCov_9fa48("1748"), /\d/)).test(password))) stryMutAct_9fa48("1749") ? score -= 1 : (stryCov_9fa48("1749"), score += 1);
        if (stryMutAct_9fa48("1751") ? false : stryMutAct_9fa48("1750") ? true : (stryCov_9fa48("1750", "1751"), (stryMutAct_9fa48("1752") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("1752"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password))) stryMutAct_9fa48("1753") ? score -= 1 : (stryCov_9fa48("1753"), score += 1);

        // Multiple character types
        const hasMultipleTypes = stryMutAct_9fa48("1754") ? [/[A-Z]/.test(password), /[a-z]/.test(password), /\d/.test(password), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)].length : (stryCov_9fa48("1754"), (stryMutAct_9fa48("1755") ? [] : (stryCov_9fa48("1755"), [(stryMutAct_9fa48("1756") ? /[^A-Z]/ : (stryCov_9fa48("1756"), /[A-Z]/)).test(password), (stryMutAct_9fa48("1757") ? /[^a-z]/ : (stryCov_9fa48("1757"), /[a-z]/)).test(password), (stryMutAct_9fa48("1758") ? /\D/ : (stryCov_9fa48("1758"), /\d/)).test(password), (stryMutAct_9fa48("1759") ? /[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ : (stryCov_9fa48("1759"), /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)).test(password)])).filter(Boolean).length);
        if (stryMutAct_9fa48("1763") ? hasMultipleTypes < 4 : stryMutAct_9fa48("1762") ? hasMultipleTypes > 4 : stryMutAct_9fa48("1761") ? false : stryMutAct_9fa48("1760") ? true : (stryCov_9fa48("1760", "1761", "1762", "1763"), hasMultipleTypes >= 4)) stryMutAct_9fa48("1764") ? score -= 1 : (stryCov_9fa48("1764"), score += 1);
        if (stryMutAct_9fa48("1768") ? score < 7 : stryMutAct_9fa48("1767") ? score > 7 : stryMutAct_9fa48("1766") ? false : stryMutAct_9fa48("1765") ? true : (stryCov_9fa48("1765", "1766", "1767", "1768"), score >= 7)) strength = stryMutAct_9fa48("1769") ? "" : (stryCov_9fa48("1769"), 'strong');else if (stryMutAct_9fa48("1773") ? score < 5 : stryMutAct_9fa48("1772") ? score > 5 : stryMutAct_9fa48("1771") ? false : stryMutAct_9fa48("1770") ? true : (stryCov_9fa48("1770", "1771", "1772", "1773"), score >= 5)) strength = stryMutAct_9fa48("1774") ? "" : (stryCov_9fa48("1774"), 'medium');
      }
    }
    return stryMutAct_9fa48("1775") ? {} : (stryCov_9fa48("1775"), {
      isValid: stryMutAct_9fa48("1778") ? errors.length !== 0 : stryMutAct_9fa48("1777") ? false : stryMutAct_9fa48("1776") ? true : (stryCov_9fa48("1776", "1777", "1778"), errors.length === 0),
      errors,
      strength
    });
  }
}

/**
 * Generate strong password suggestions
 */
export function generatePasswordSuggestions(count = 3) {
  if (stryMutAct_9fa48("1779")) {
    {}
  } else {
    stryCov_9fa48("1779");
    const lowercase = stryMutAct_9fa48("1780") ? "" : (stryCov_9fa48("1780"), 'abcdefghijklmnopqrstuvwxyz');
    const uppercase = stryMutAct_9fa48("1781") ? "" : (stryCov_9fa48("1781"), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    const numbers = stryMutAct_9fa48("1782") ? "" : (stryCov_9fa48("1782"), '0123456789');
    const special = stryMutAct_9fa48("1783") ? "" : (stryCov_9fa48("1783"), '!@#$%^&*()_+-=[]{}');
    const suggestions = stryMutAct_9fa48("1784") ? ["Stryker was here"] : (stryCov_9fa48("1784"), []);
    for (let i = 0; stryMutAct_9fa48("1787") ? i >= count : stryMutAct_9fa48("1786") ? i <= count : stryMutAct_9fa48("1785") ? false : (stryCov_9fa48("1785", "1786", "1787"), i < count); stryMutAct_9fa48("1788") ? i-- : (stryCov_9fa48("1788"), i++)) {
      if (stryMutAct_9fa48("1789")) {
        {}
      } else {
        stryCov_9fa48("1789");
        let password = stryMutAct_9fa48("1790") ? "Stryker was here!" : (stryCov_9fa48("1790"), '');

        // Ensure at least one of each required type
        stryMutAct_9fa48("1791") ? password -= uppercase[Math.floor(Math.random() * uppercase.length)] : (stryCov_9fa48("1791"), password += uppercase[Math.floor(stryMutAct_9fa48("1792") ? Math.random() / uppercase.length : (stryCov_9fa48("1792"), Math.random() * uppercase.length))]);
        stryMutAct_9fa48("1793") ? password -= lowercase[Math.floor(Math.random() * lowercase.length)] : (stryCov_9fa48("1793"), password += lowercase[Math.floor(stryMutAct_9fa48("1794") ? Math.random() / lowercase.length : (stryCov_9fa48("1794"), Math.random() * lowercase.length))]);
        stryMutAct_9fa48("1795") ? password -= numbers[Math.floor(Math.random() * numbers.length)] : (stryCov_9fa48("1795"), password += numbers[Math.floor(stryMutAct_9fa48("1796") ? Math.random() / numbers.length : (stryCov_9fa48("1796"), Math.random() * numbers.length))]);
        stryMutAct_9fa48("1797") ? password -= special[Math.floor(Math.random() * special.length)] : (stryCov_9fa48("1797"), password += special[Math.floor(stryMutAct_9fa48("1798") ? Math.random() / special.length : (stryCov_9fa48("1798"), Math.random() * special.length))]);

        // Fill the rest with random characters (total length 12-16)
        const allChars = stryMutAct_9fa48("1799") ? lowercase + uppercase + numbers - special : (stryCov_9fa48("1799"), (stryMutAct_9fa48("1800") ? lowercase + uppercase - numbers : (stryCov_9fa48("1800"), (stryMutAct_9fa48("1801") ? lowercase - uppercase : (stryCov_9fa48("1801"), lowercase + uppercase)) + numbers)) + special);
        const remainingLength = stryMutAct_9fa48("1802") ? 8 - Math.floor(Math.random() * 5) : (stryCov_9fa48("1802"), 8 + Math.floor(stryMutAct_9fa48("1803") ? Math.random() / 5 : (stryCov_9fa48("1803"), Math.random() * 5))); // 8-12 more characters

        for (let j = 0; stryMutAct_9fa48("1806") ? j >= remainingLength : stryMutAct_9fa48("1805") ? j <= remainingLength : stryMutAct_9fa48("1804") ? false : (stryCov_9fa48("1804", "1805", "1806"), j < remainingLength); stryMutAct_9fa48("1807") ? j-- : (stryCov_9fa48("1807"), j++)) {
          if (stryMutAct_9fa48("1808")) {
            {}
          } else {
            stryCov_9fa48("1808");
            stryMutAct_9fa48("1809") ? password -= allChars[Math.floor(Math.random() * allChars.length)] : (stryCov_9fa48("1809"), password += allChars[Math.floor(stryMutAct_9fa48("1810") ? Math.random() / allChars.length : (stryCov_9fa48("1810"), Math.random() * allChars.length))]);
          }
        }

        // Shuffle the password
        password = stryMutAct_9fa48("1811") ? password.split('').join('') : (stryCov_9fa48("1811"), password.split(stryMutAct_9fa48("1812") ? "Stryker was here!" : (stryCov_9fa48("1812"), '')).sort(stryMutAct_9fa48("1813") ? () => undefined : (stryCov_9fa48("1813"), () => stryMutAct_9fa48("1814") ? Math.random() + 0.5 : (stryCov_9fa48("1814"), Math.random() - 0.5))).join(stryMutAct_9fa48("1815") ? "Stryker was here!" : (stryCov_9fa48("1815"), '')));
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
  if (stryMutAct_9fa48("1816")) {
    {}
  } else {
    stryCov_9fa48("1816");
    const errors = stryMutAct_9fa48("1817") ? ["Stryker was here"] : (stryCov_9fa48("1817"), []);
    if (stryMutAct_9fa48("1820") ? false : stryMutAct_9fa48("1819") ? true : stryMutAct_9fa48("1818") ? otp : (stryCov_9fa48("1818", "1819", "1820"), !otp)) {
      if (stryMutAct_9fa48("1821")) {
        {}
      } else {
        stryCov_9fa48("1821");
        errors.push(stryMutAct_9fa48("1822") ? "" : (stryCov_9fa48("1822"), 'OTP is required'));
        return stryMutAct_9fa48("1823") ? {} : (stryCov_9fa48("1823"), {
          isValid: stryMutAct_9fa48("1824") ? true : (stryCov_9fa48("1824"), false),
          errors
        });
      }
    }

    // OTP should be exactly 6 digits
    if (stryMutAct_9fa48("1827") ? false : stryMutAct_9fa48("1826") ? true : stryMutAct_9fa48("1825") ? /^\d{6}$/.test(otp) : (stryCov_9fa48("1825", "1826", "1827"), !(stryMutAct_9fa48("1831") ? /^\D{6}$/ : stryMutAct_9fa48("1830") ? /^\d$/ : stryMutAct_9fa48("1829") ? /^\d{6}/ : stryMutAct_9fa48("1828") ? /\d{6}$/ : (stryCov_9fa48("1828", "1829", "1830", "1831"), /^\d{6}$/)).test(otp))) {
      if (stryMutAct_9fa48("1832")) {
        {}
      } else {
        stryCov_9fa48("1832");
        errors.push(stryMutAct_9fa48("1833") ? "" : (stryCov_9fa48("1833"), 'OTP must be a 6-digit number'));
      }
    }
    return stryMutAct_9fa48("1834") ? {} : (stryCov_9fa48("1834"), {
      isValid: stryMutAct_9fa48("1837") ? errors.length !== 0 : stryMutAct_9fa48("1836") ? false : stryMutAct_9fa48("1835") ? true : (stryCov_9fa48("1835", "1836", "1837"), errors.length === 0),
      errors
    });
  }
}