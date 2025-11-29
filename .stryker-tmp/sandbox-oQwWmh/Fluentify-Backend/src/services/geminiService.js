// @ts-nocheck
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
import { GoogleGenerativeAI } from '@google/generative-ai';
class GeminiService {
  constructor() {
    if (stryMutAct_9fa48("3414")) {
      {}
    } else {
      stryCov_9fa48("3414");
      if (stryMutAct_9fa48("3417") ? false : stryMutAct_9fa48("3416") ? true : stryMutAct_9fa48("3415") ? process.env.GEMINI_API_KEY : (stryCov_9fa48("3415", "3416", "3417"), !process.env.GEMINI_API_KEY)) {
        if (stryMutAct_9fa48("3418")) {
          {}
        } else {
          stryCov_9fa48("3418");
          throw new Error(stryMutAct_9fa48("3419") ? "" : (stryCov_9fa48("3419"), 'GEMINI_API_KEY is not set in environment variables'));
        }
      }
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Use gemini-pro which is the stable model for v1beta API
      this.model = this.genAI.getGenerativeModel(stryMutAct_9fa48("3420") ? {} : (stryCov_9fa48("3420"), {
        model: stryMutAct_9fa48("3421") ? "" : (stryCov_9fa48("3421"), 'gemini-2.0-flash')
      }));
    }
  }

  /**
   * Retry helper with exponential backoff for rate limiting
   */
  async retryWithBackoff(fn, maxRetries = 3, initialDelay = 2000) {
    if (stryMutAct_9fa48("3422")) {
      {}
    } else {
      stryCov_9fa48("3422");
      let lastError;
      for (let attempt = 0; stryMutAct_9fa48("3425") ? attempt >= maxRetries : stryMutAct_9fa48("3424") ? attempt <= maxRetries : stryMutAct_9fa48("3423") ? false : (stryCov_9fa48("3423", "3424", "3425"), attempt < maxRetries); stryMutAct_9fa48("3426") ? attempt-- : (stryCov_9fa48("3426"), attempt++)) {
        if (stryMutAct_9fa48("3427")) {
          {}
        } else {
          stryCov_9fa48("3427");
          try {
            if (stryMutAct_9fa48("3428")) {
              {}
            } else {
              stryCov_9fa48("3428");
              return await fn();
            }
          } catch (error) {
            if (stryMutAct_9fa48("3429")) {
              {}
            } else {
              stryCov_9fa48("3429");
              lastError = error;

              // Check if it's a rate limit error (429)
              if (stryMutAct_9fa48("3432") ? (error.status === 429 || error.message?.includes('429')) && error.message?.includes('Too Many Requests') : stryMutAct_9fa48("3431") ? false : stryMutAct_9fa48("3430") ? true : (stryCov_9fa48("3430", "3431", "3432"), (stryMutAct_9fa48("3434") ? error.status === 429 && error.message?.includes('429') : stryMutAct_9fa48("3433") ? false : (stryCov_9fa48("3433", "3434"), (stryMutAct_9fa48("3436") ? error.status !== 429 : stryMutAct_9fa48("3435") ? false : (stryCov_9fa48("3435", "3436"), error.status === 429)) || (stryMutAct_9fa48("3437") ? error.message.includes('429') : (stryCov_9fa48("3437"), error.message?.includes(stryMutAct_9fa48("3438") ? "" : (stryCov_9fa48("3438"), '429')))))) || (stryMutAct_9fa48("3439") ? error.message.includes('Too Many Requests') : (stryCov_9fa48("3439"), error.message?.includes(stryMutAct_9fa48("3440") ? "" : (stryCov_9fa48("3440"), 'Too Many Requests')))))) {
                if (stryMutAct_9fa48("3441")) {
                  {}
                } else {
                  stryCov_9fa48("3441");
                  const delay = stryMutAct_9fa48("3442") ? initialDelay / Math.pow(2, attempt) : (stryCov_9fa48("3442"), initialDelay * Math.pow(2, attempt)); // Exponential backoff: 2s, 4s, 8s
                  console.warn(stryMutAct_9fa48("3443") ? `` : (stryCov_9fa48("3443"), `⏳ Rate limit hit. Retrying in ${stryMutAct_9fa48("3444") ? delay * 1000 : (stryCov_9fa48("3444"), delay / 1000)}s... (Attempt ${stryMutAct_9fa48("3445") ? attempt - 1 : (stryCov_9fa48("3445"), attempt + 1)}/${maxRetries})`));

                  // Wait before retry
                  await new Promise(stryMutAct_9fa48("3446") ? () => undefined : (stryCov_9fa48("3446"), resolve => setTimeout(resolve, delay)));
                  continue;
                }
              }

              // If it's not a rate limit error, throw immediately
              throw error;
            }
          }
        }
      }

      // If all retries failed, throw the last error
      throw lastError;
    }
  }

  /**
   * Generate a structured language learning course similar to Duolingo
   * @param {string} language - The target language to learn
   * @param {string} expectedDuration - Expected learning duration (e.g., '3 months', '6 months')
   * @returns {Promise<Object>} - Structured course data
   */
  async generateCourse(language, expectedDuration, expertise = stryMutAct_9fa48("3447") ? "" : (stryCov_9fa48("3447"), 'Beginner')) {
    if (stryMutAct_9fa48("3448")) {
      {}
    } else {
      stryCov_9fa48("3448");
      try {
        if (stryMutAct_9fa48("3449")) {
          {}
        } else {
          stryCov_9fa48("3449");
          console.log(stryMutAct_9fa48("3450") ? `` : (stryCov_9fa48("3450"), `Generating course for: ${language}, Duration: ${expectedDuration}, Expertise: ${expertise}`));

          // Step 1: Generate course outline (units structure)
          console.log(stryMutAct_9fa48("3451") ? "" : (stryCov_9fa48("3451"), 'Step 1: Generating course outline...'));
          const outline = await this.generateCourseOutline(language, expectedDuration, expertise);

          // Step 2: Generate each unit separately
          console.log(stryMutAct_9fa48("3452") ? `` : (stryCov_9fa48("3452"), `Step 2: Generating ${outline.units.length} units...`));
          const units = stryMutAct_9fa48("3453") ? ["Stryker was here"] : (stryCov_9fa48("3453"), []);
          for (let i = 0; stryMutAct_9fa48("3456") ? i >= outline.units.length : stryMutAct_9fa48("3455") ? i <= outline.units.length : stryMutAct_9fa48("3454") ? false : (stryCov_9fa48("3454", "3455", "3456"), i < outline.units.length); stryMutAct_9fa48("3457") ? i-- : (stryCov_9fa48("3457"), i++)) {
            if (stryMutAct_9fa48("3458")) {
              {}
            } else {
              stryCov_9fa48("3458");
              const unitOutline = outline.units[i];
              console.log(stryMutAct_9fa48("3459") ? `` : (stryCov_9fa48("3459"), `  Generating Unit ${stryMutAct_9fa48("3460") ? i - 1 : (stryCov_9fa48("3460"), i + 1)}: ${unitOutline.title}...`));
              const unit = await this.generateUnit(language, unitOutline, stryMutAct_9fa48("3461") ? i - 1 : (stryCov_9fa48("3461"), i + 1), expertise);
              units.push(unit);
            }
          }

          // Step 3: Combine everything
          const structuredCourse = stryMutAct_9fa48("3462") ? {} : (stryCov_9fa48("3462"), {
            course: stryMutAct_9fa48("3463") ? {} : (stryCov_9fa48("3463"), {
              title: stryMutAct_9fa48("3464") ? `` : (stryCov_9fa48("3464"), `${language} Learning Journey`),
              language: language,
              duration: expectedDuration,
              totalLessons: units.reduce(stryMutAct_9fa48("3465") ? () => undefined : (stryCov_9fa48("3465"), (sum, unit) => stryMutAct_9fa48("3466") ? sum - unit.lessons.length : (stryCov_9fa48("3466"), sum + unit.lessons.length)), 0),
              generatedAt: new Date().toISOString(),
              version: stryMutAct_9fa48("3467") ? "" : (stryCov_9fa48("3467"), '1.0'),
              units: units
            }),
            metadata: stryMutAct_9fa48("3468") ? {} : (stryCov_9fa48("3468"), {
              language,
              totalUnits: units.length,
              totalLessons: units.reduce(stryMutAct_9fa48("3469") ? () => undefined : (stryCov_9fa48("3469"), (sum, unit) => stryMutAct_9fa48("3470") ? sum - unit.lessons.length : (stryCov_9fa48("3470"), sum + unit.lessons.length)), 0),
              estimatedTotalTime: units.reduce((sum, unit) => {
                if (stryMutAct_9fa48("3471")) {
                  {}
                } else {
                  stryCov_9fa48("3471");
                  const unitTime = stryMutAct_9fa48("3474") ? parseInt(unit.estimatedTime) && 150 : stryMutAct_9fa48("3473") ? false : stryMutAct_9fa48("3472") ? true : (stryCov_9fa48("3472", "3473", "3474"), parseInt(unit.estimatedTime) || 150);
                  return stryMutAct_9fa48("3475") ? sum - unitTime : (stryCov_9fa48("3475"), sum + unitTime);
                }
              }, 0)
            })
          });
          console.log(stryMutAct_9fa48("3476") ? "" : (stryCov_9fa48("3476"), 'Course generation complete!'));
          console.log(stryMutAct_9fa48("3477") ? `` : (stryCov_9fa48("3477"), `Total: ${structuredCourse.metadata.totalUnits} units, ${structuredCourse.metadata.totalLessons} lessons`));
          return structuredCourse;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3478")) {
          {}
        } else {
          stryCov_9fa48("3478");
          console.error(stryMutAct_9fa48("3479") ? "" : (stryCov_9fa48("3479"), 'Error generating course:'), error);
          throw new Error(stryMutAct_9fa48("3480") ? `` : (stryCov_9fa48("3480"), `Failed to generate course content: ${error.message}`));
        }
      }
    }
  }

  /**
   * Generate course outline with unit structure
   */
  async generateCourseOutline(language, expectedDuration, expertise = stryMutAct_9fa48("3481") ? "" : (stryCov_9fa48("3481"), 'Beginner')) {
    if (stryMutAct_9fa48("3482")) {
      {}
    } else {
      stryCov_9fa48("3482");
      const prompt = stryMutAct_9fa48("3483") ? `` : (stryCov_9fa48("3483"), `Generate a comprehensive, in-depth course outline for learning ${language} over ${expectedDuration}.

User's Current Level: ${expertise}

This should be a professional, Duolingo-quality curriculum designed for someone who is currently at ${expertise} level. Start from their current knowledge level and build upon it.
Do NOT include any explanations, markdown, or text outside of JSON.
Respond with ONLY valid JSON in this exact format:
{
  "units": [
    {
      "id": 1,
      "title": "Unit Title",
      "description": "Detailed description of what students will learn",
      "difficulty": "Beginner",
      "estimatedTime": "3-4 hours",
      "lessonCount": 6,
      "topics": ["topic1", "topic2", "topic3", "topic4"]
    }
  ]
}

Requirements:
- Create 6 units with progressive difficulty starting from ${expertise} level
- If user is Beginner: Start with basics and progress to Elementary/Intermediate
- If user is Intermediate: Start with review and advance to upper-Intermediate/Advanced concepts
- If user is Advanced: Focus on mastery, nuanced expressions, and cultural depth
- Each unit should have 6 lessons
- Topics should be practical and relevant to real-world communication
- Cover: vocabulary, grammar, conversation, pronunciation, and cultural context
- Build upon previous units logically`);
      const result = await this.model.generateContent(stryMutAct_9fa48("3484") ? {} : (stryCov_9fa48("3484"), {
        contents: stryMutAct_9fa48("3485") ? [] : (stryCov_9fa48("3485"), [stryMutAct_9fa48("3486") ? {} : (stryCov_9fa48("3486"), {
          role: stryMutAct_9fa48("3487") ? "" : (stryCov_9fa48("3487"), 'user'),
          parts: stryMutAct_9fa48("3488") ? [] : (stryCov_9fa48("3488"), [stryMutAct_9fa48("3489") ? {} : (stryCov_9fa48("3489"), {
            text: prompt
          })])
        })]),
        generationConfig: stryMutAct_9fa48("3490") ? {} : (stryCov_9fa48("3490"), {
          maxOutputTokens: 2048,
          temperature: 0.7
        })
      }));
      const response = await result.response;
      const text = response.text();
      return this.parseJSON(text);
    }
  }

  /**
   * Generate a single unit with all its lessons
   */
  async generateUnit(language, unitOutline, unitNumber, expertise = stryMutAct_9fa48("3491") ? "" : (stryCov_9fa48("3491"), 'Beginner')) {
    if (stryMutAct_9fa48("3492")) {
      {}
    } else {
      stryCov_9fa48("3492");
      const prompt = stryMutAct_9fa48("3493") ? `` : (stryCov_9fa48("3493"), `Generate detailed lessons for Unit ${unitNumber} of a ${language} course.

User's Current Level: ${expertise}

Unit Info:
- Title: ${unitOutline.title}
- Description: ${unitOutline.description}
- Difficulty: ${unitOutline.difficulty}
- Topics: ${unitOutline.topics.join(stryMutAct_9fa48("3494") ? "" : (stryCov_9fa48("3494"), ', '))}
- Number of lessons: ${unitOutline.lessonCount}

The user is currently at ${expertise} level. Adjust vocabulary difficulty, grammar complexity, and exercise difficulty accordingly.
- If Beginner: Use simple vocabulary, basic grammar structures, and clear explanations
- If Intermediate: Use more complex vocabulary, intermediate grammar, assume basic knowledge
- If Advanced: Use sophisticated vocabulary, advanced grammar, focus on nuance and mastery

Respond with ONLY valid JSON in this exact format:
{
  "id": ${unitNumber},
  "title": "${unitOutline.title}",
  "description": "${unitOutline.description}",
  "difficulty": "${unitOutline.difficulty}",
  "estimatedTime": "${unitOutline.estimatedTime}",
  "lessons": [
    {
      "id": 1,
      "title": "Lesson Title",
      "type": "vocabulary|grammar|conversation|review",
      "description": "What the lesson covers",
      "keyPhrases": ["phrase 1", "phrase 2"],
      "vocabulary": [
        {
          "word": "foreign word",
          "translation": "english translation",
          "pronunciation": "phonetic pronunciation",
          "example": "example sentence"
        }
      ],
      "grammarPoints": [
        {
          "topic": "grammar topic",
          "explanation": "brief explanation",
          "examples": ["example 1", "example 2"]
        }
      ],
      "exercises": [
        {
          "type": "multiple_choice",
          "question": "exercise question",
          "options": ["option 1", "option 2", "option 3", "option 4"],
          "correctAnswer": 0
        }
      ],
      "estimatedDuration": 15,
      "xpReward": 50
    }
  ]
}

IMPORTANT: 
- Create exactly ${unitOutline.lessonCount} lessons
- Each vocabulary lesson MUST have 5-8 vocabulary items with detailed examples
- Each grammar lesson MUST have 2-4 comprehensive grammar points with multiple examples
- Include EXACTLY 5 multiple choice questions (MCQ) per lesson
- ALL exercises MUST be type "multiple_choice" with exactly 4 options
- Exercises should test understanding, not just memorization
- Include practical, real-world examples in all content
- Last lesson MUST be type "review" covering all unit topics
- Ensure all JSON arrays and objects are properly closed
- Make content engaging and progressively challenging`);

      // Use retry with backoff to handle rate limits
      return await this.retryWithBackoff(async () => {
        if (stryMutAct_9fa48("3495")) {
          {}
        } else {
          stryCov_9fa48("3495");
          const result = await this.model.generateContent(stryMutAct_9fa48("3496") ? {} : (stryCov_9fa48("3496"), {
            contents: stryMutAct_9fa48("3497") ? [] : (stryCov_9fa48("3497"), [stryMutAct_9fa48("3498") ? {} : (stryCov_9fa48("3498"), {
              role: stryMutAct_9fa48("3499") ? "" : (stryCov_9fa48("3499"), 'user'),
              parts: stryMutAct_9fa48("3500") ? [] : (stryCov_9fa48("3500"), [stryMutAct_9fa48("3501") ? {} : (stryCov_9fa48("3501"), {
                text: prompt
              })])
            })]),
            generationConfig: stryMutAct_9fa48("3502") ? {} : (stryCov_9fa48("3502"), {
              maxOutputTokens: 8192,
              temperature: 0.7
            })
          }));
          const response = await result.response;
          const text = response.text();
          return this.parseJSON(text);
        }
      });
    }
  }

  /**
   * Parse JSON from AI response with error handling
   */
  parseJSON(text) {
    if (stryMutAct_9fa48("3503")) {
      {}
    } else {
      stryCov_9fa48("3503");
      try {
        if (stryMutAct_9fa48("3504")) {
          {}
        } else {
          stryCov_9fa48("3504");
          console.log(stryMutAct_9fa48("3505") ? "" : (stryCov_9fa48("3505"), 'Response length:'), text.length, stryMutAct_9fa48("3506") ? "" : (stryCov_9fa48("3506"), 'characters'));

          // Clean the response text
          let cleanText = stryMutAct_9fa48("3507") ? text : (stryCov_9fa48("3507"), text.trim());

          // Remove markdown code blocks if present
          cleanText = stryMutAct_9fa48("3508") ? cleanText.replace(/```json\n?/g, '').replace(/```/g, '') : (stryCov_9fa48("3508"), cleanText.replace(stryMutAct_9fa48("3509") ? /```json\n/g : (stryCov_9fa48("3509"), /```json\n?/g), stryMutAct_9fa48("3510") ? "Stryker was here!" : (stryCov_9fa48("3510"), '')).replace(/```/g, stryMutAct_9fa48("3511") ? "Stryker was here!" : (stryCov_9fa48("3511"), '')).trim());

          // Try to extract JSON from the response
          let jsonMatch = cleanText.match(stryMutAct_9fa48("3515") ? /\{[\s\s]*\}/ : stryMutAct_9fa48("3514") ? /\{[\S\S]*\}/ : stryMutAct_9fa48("3513") ? /\{[^\s\S]*\}/ : stryMutAct_9fa48("3512") ? /\{[\s\S]\}/ : (stryCov_9fa48("3512", "3513", "3514", "3515"), /\{[\s\S]*\}/));
          if (stryMutAct_9fa48("3518") ? false : stryMutAct_9fa48("3517") ? true : stryMutAct_9fa48("3516") ? jsonMatch : (stryCov_9fa48("3516", "3517", "3518"), !jsonMatch)) {
            if (stryMutAct_9fa48("3519")) {
              {}
            } else {
              stryCov_9fa48("3519");
              const startIdx = cleanText.indexOf(stryMutAct_9fa48("3520") ? "" : (stryCov_9fa48("3520"), '{'));
              const endIdx = cleanText.lastIndexOf(stryMutAct_9fa48("3521") ? "" : (stryCov_9fa48("3521"), '}'));
              if (stryMutAct_9fa48("3524") ? startIdx !== -1 && endIdx !== -1 || endIdx > startIdx : stryMutAct_9fa48("3523") ? false : stryMutAct_9fa48("3522") ? true : (stryCov_9fa48("3522", "3523", "3524"), (stryMutAct_9fa48("3526") ? startIdx !== -1 || endIdx !== -1 : stryMutAct_9fa48("3525") ? true : (stryCov_9fa48("3525", "3526"), (stryMutAct_9fa48("3528") ? startIdx === -1 : stryMutAct_9fa48("3527") ? true : (stryCov_9fa48("3527", "3528"), startIdx !== (stryMutAct_9fa48("3529") ? +1 : (stryCov_9fa48("3529"), -1)))) && (stryMutAct_9fa48("3531") ? endIdx === -1 : stryMutAct_9fa48("3530") ? true : (stryCov_9fa48("3530", "3531"), endIdx !== (stryMutAct_9fa48("3532") ? +1 : (stryCov_9fa48("3532"), -1)))))) && (stryMutAct_9fa48("3535") ? endIdx <= startIdx : stryMutAct_9fa48("3534") ? endIdx >= startIdx : stryMutAct_9fa48("3533") ? true : (stryCov_9fa48("3533", "3534", "3535"), endIdx > startIdx)))) {
                if (stryMutAct_9fa48("3536")) {
                  {}
                } else {
                  stryCov_9fa48("3536");
                  jsonMatch = stryMutAct_9fa48("3537") ? [] : (stryCov_9fa48("3537"), [stryMutAct_9fa48("3538") ? cleanText : (stryCov_9fa48("3538"), cleanText.substring(startIdx, stryMutAct_9fa48("3539") ? endIdx - 1 : (stryCov_9fa48("3539"), endIdx + 1)))]);
                }
              }
            }
          }
          if (stryMutAct_9fa48("3542") ? false : stryMutAct_9fa48("3541") ? true : stryMutAct_9fa48("3540") ? jsonMatch : (stryCov_9fa48("3540", "3541", "3542"), !jsonMatch)) {
            if (stryMutAct_9fa48("3543")) {
              {}
            } else {
              stryCov_9fa48("3543");
              throw new Error(stryMutAct_9fa48("3544") ? "" : (stryCov_9fa48("3544"), 'No valid JSON found in AI response'));
            }
          }
          let data;
          try {
            if (stryMutAct_9fa48("3545")) {
              {}
            } else {
              stryCov_9fa48("3545");
              data = JSON.parse(jsonMatch[0]);
            }
          } catch (parseError) {
            if (stryMutAct_9fa48("3546")) {
              {}
            } else {
              stryCov_9fa48("3546");
              console.error(stryMutAct_9fa48("3547") ? "" : (stryCov_9fa48("3547"), 'JSON parse error:'), parseError.message);

              // Try to fix common JSON issues
              let fixedJson = jsonMatch[0].replace(stryMutAct_9fa48("3550") ? /,\s*([^}\]])/g : stryMutAct_9fa48("3549") ? /,\S*([}\]])/g : stryMutAct_9fa48("3548") ? /,\s([}\]])/g : (stryCov_9fa48("3548", "3549", "3550"), /,\s*([}\]])/g), stryMutAct_9fa48("3551") ? "" : (stryCov_9fa48("3551"), '$1')) // Remove trailing commas
              .replace(stryMutAct_9fa48("3555") ? /"\s*\n\S*"/g : stryMutAct_9fa48("3554") ? /"\s*\n\s"/g : stryMutAct_9fa48("3553") ? /"\S*\n\s*"/g : stryMutAct_9fa48("3552") ? /"\s\n\s*"/g : (stryCov_9fa48("3552", "3553", "3554", "3555"), /"\s*\n\s*"/g), stryMutAct_9fa48("3556") ? "" : (stryCov_9fa48("3556"), '" "')) // Fix line breaks in strings
              .replace(stryMutAct_9fa48("3557") ? /([\\])\n/g : (stryCov_9fa48("3557"), /([^\\])\n/g), stryMutAct_9fa48("3558") ? "" : (stryCov_9fa48("3558"), '$1 ')); // Remove unescaped newlines

              // If still fails, try to truncate at last valid closing brace
              try {
                if (stryMutAct_9fa48("3559")) {
                  {}
                } else {
                  stryCov_9fa48("3559");
                  data = JSON.parse(fixedJson);
                }
              } catch (secondError) {
                if (stryMutAct_9fa48("3560")) {
                  {}
                } else {
                  stryCov_9fa48("3560");
                  console.error(stryMutAct_9fa48("3561") ? "" : (stryCov_9fa48("3561"), 'Second parse attempt failed, trying to auto-close JSON'));

                  // Find the position of the error and try to close JSON properly
                  const errorPos = parseInt(stryMutAct_9fa48("3564") ? secondError.message.match(/position (\d+)/)?.[1] && '0' : stryMutAct_9fa48("3563") ? false : stryMutAct_9fa48("3562") ? true : (stryCov_9fa48("3562", "3563", "3564"), (stryMutAct_9fa48("3565") ? secondError.message.match(/position (\d+)/)[1] : (stryCov_9fa48("3565"), secondError.message.match(stryMutAct_9fa48("3567") ? /position (\D+)/ : stryMutAct_9fa48("3566") ? /position (\d)/ : (stryCov_9fa48("3566", "3567"), /position (\d+)/))?.[1])) || (stryMutAct_9fa48("3568") ? "" : (stryCov_9fa48("3568"), '0'))));
                  if (stryMutAct_9fa48("3572") ? errorPos <= 0 : stryMutAct_9fa48("3571") ? errorPos >= 0 : stryMutAct_9fa48("3570") ? false : stryMutAct_9fa48("3569") ? true : (stryCov_9fa48("3569", "3570", "3571", "3572"), errorPos > 0)) {
                    if (stryMutAct_9fa48("3573")) {
                      {}
                    } else {
                      stryCov_9fa48("3573");
                      let truncated = stryMutAct_9fa48("3574") ? fixedJson : (stryCov_9fa48("3574"), fixedJson.substring(0, errorPos));
                      // Count open braces/brackets and close them
                      const openBraces = (stryMutAct_9fa48("3577") ? truncated.match(/\{/g) && [] : stryMutAct_9fa48("3576") ? false : stryMutAct_9fa48("3575") ? true : (stryCov_9fa48("3575", "3576", "3577"), truncated.match(/\{/g) || (stryMutAct_9fa48("3578") ? ["Stryker was here"] : (stryCov_9fa48("3578"), [])))).length;
                      const closeBraces = (stryMutAct_9fa48("3581") ? truncated.match(/\}/g) && [] : stryMutAct_9fa48("3580") ? false : stryMutAct_9fa48("3579") ? true : (stryCov_9fa48("3579", "3580", "3581"), truncated.match(/\}/g) || (stryMutAct_9fa48("3582") ? ["Stryker was here"] : (stryCov_9fa48("3582"), [])))).length;
                      const openBrackets = (stryMutAct_9fa48("3585") ? truncated.match(/\[/g) && [] : stryMutAct_9fa48("3584") ? false : stryMutAct_9fa48("3583") ? true : (stryCov_9fa48("3583", "3584", "3585"), truncated.match(/\[/g) || (stryMutAct_9fa48("3586") ? ["Stryker was here"] : (stryCov_9fa48("3586"), [])))).length;
                      const closeBrackets = (stryMutAct_9fa48("3589") ? truncated.match(/\]/g) && [] : stryMutAct_9fa48("3588") ? false : stryMutAct_9fa48("3587") ? true : (stryCov_9fa48("3587", "3588", "3589"), truncated.match(/\]/g) || (stryMutAct_9fa48("3590") ? ["Stryker was here"] : (stryCov_9fa48("3590"), [])))).length;

                      // Add missing closing characters
                      for (let i = 0; stryMutAct_9fa48("3593") ? i >= openBrackets - closeBrackets : stryMutAct_9fa48("3592") ? i <= openBrackets - closeBrackets : stryMutAct_9fa48("3591") ? false : (stryCov_9fa48("3591", "3592", "3593"), i < (stryMutAct_9fa48("3594") ? openBrackets + closeBrackets : (stryCov_9fa48("3594"), openBrackets - closeBrackets))); stryMutAct_9fa48("3595") ? i-- : (stryCov_9fa48("3595"), i++)) truncated += stryMutAct_9fa48("3596") ? "" : (stryCov_9fa48("3596"), ']');
                      for (let i = 0; stryMutAct_9fa48("3599") ? i >= openBraces - closeBraces : stryMutAct_9fa48("3598") ? i <= openBraces - closeBraces : stryMutAct_9fa48("3597") ? false : (stryCov_9fa48("3597", "3598", "3599"), i < (stryMutAct_9fa48("3600") ? openBraces + closeBraces : (stryCov_9fa48("3600"), openBraces - closeBraces))); stryMutAct_9fa48("3601") ? i-- : (stryCov_9fa48("3601"), i++)) truncated += stryMutAct_9fa48("3602") ? "" : (stryCov_9fa48("3602"), '}');
                      console.log(stryMutAct_9fa48("3603") ? "" : (stryCov_9fa48("3603"), 'Attempting to parse auto-closed JSON'));
                      data = JSON.parse(truncated);
                    }
                  } else {
                    if (stryMutAct_9fa48("3604")) {
                      {}
                    } else {
                      stryCov_9fa48("3604");
                      throw secondError;
                    }
                  }
                }
              }
            }
          }
          return data;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3605")) {
          {}
        } else {
          stryCov_9fa48("3605");
          console.error(stryMutAct_9fa48("3606") ? "" : (stryCov_9fa48("3606"), 'Error parsing JSON:'), error);
          console.error(stryMutAct_9fa48("3607") ? "" : (stryCov_9fa48("3607"), 'Raw response:'), stryMutAct_9fa48("3608") ? text : (stryCov_9fa48("3608"), text.substring(0, 500)));
          throw new Error(stryMutAct_9fa48("3609") ? `` : (stryCov_9fa48("3609"), `Failed to parse JSON: ${error.message}`));
        }
      }
    }
  }

  /**
   * Generate additional exercises for a specific lesson (kept for backward compatibility)
   */
  async generateExercises(lessonTitle, lessonType, language) {
    if (stryMutAct_9fa48("3610")) {
      {}
    } else {
      stryCov_9fa48("3610");
      try {
        if (stryMutAct_9fa48("3611")) {
          {}
        } else {
          stryCov_9fa48("3611");
          const prompt = stryMutAct_9fa48("3612") ? `` : (stryCov_9fa48("3612"), `Generate 5 multiple choice questions (MCQ) for a ${lessonType} lesson titled "${lessonTitle}" in ${language}. 

IMPORTANT REQUIREMENTS:
- ALL exercises MUST be "multiple_choice" type only
- Each question MUST have exactly 4 options
- Questions should test understanding of the lesson content
- Options should be plausible to make questions challenging
- correctAnswer must be the index (0-3) of the correct option

Provide the response in this EXACT JSON format:
{
  "exercises": [
    {
      "type": "multiple_choice",
      "question": "Exercise question",
      "options": ["option 1", "option 2", "option 3", "option 4"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of the answer"
    }
  ]
}

Make sure to generate exactly 5 exercises.`);

          // Use retry with backoff to handle rate limits
          return await this.retryWithBackoff(async () => {
            if (stryMutAct_9fa48("3613")) {
              {}
            } else {
              stryCov_9fa48("3613");
              const result = await this.model.generateContent(prompt);
              const response = await result.response;
              const text = response.text();
              return this.parseJSON(text);
            }
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3614")) {
          {}
        } else {
          stryCov_9fa48("3614");
          console.error(stryMutAct_9fa48("3615") ? "" : (stryCov_9fa48("3615"), 'Error generating exercises:'), error);
          throw new Error(stryMutAct_9fa48("3616") ? "" : (stryCov_9fa48("3616"), 'Failed to generate exercises'));
        }
      }
    }
  }
  createCoursePrompt(language, expectedDuration) {
    if (stryMutAct_9fa48("3617")) {
      {}
    } else {
      stryCov_9fa48("3617");
      return stryMutAct_9fa48("3618") ? `` : (stryCov_9fa48("3618"), `Generate a language learning course for ${language} designed for ${expectedDuration} of learning.

CRITICAL: Respond with ONLY valid JSON. Keep it concise. Each lesson should have 2-3 vocabulary items and 1-2 exercises maximum.

1. Course Structure:
   - Create 3 units total
   - Each unit contains 3-4 lessons
   - Progressive difficulty from beginner to intermediate

2. JSON Format:
{
  "course": {
    "title": "${language} Learning Journey",
    "language": "${language}",
    "duration": "${expectedDuration}",
    "totalLessons": 35,
    "units": [
      {
        "id": 1,
        "title": "Unit Title",
        "description": "Brief description of what will be learned",
        "difficulty": "Beginner",
        "estimatedTime": "2-3 hours",
        "lessons": [
          {
            "id": 1,
            "title": "Lesson Title",
            "type": "vocabulary|grammar|conversation|review",
            "description": "What the lesson covers",
            "keyPhrases": ["phrase 1", "phrase 2", "phrase 3"],
            "vocabulary": [
              {
                "word": "foreign word",
                "translation": "english translation",
                "pronunciation": "phonetic pronunciation",
                "example": "example sentence"
              }
            ],
            "grammarPoints": [
              {
                "topic": "grammar topic",
                "explanation": "brief explanation",
                "examples": ["example 1", "example 2"]
              }
            ],
            "exercises": [
              {
                "type": "multiple_choice|translation|matching|listening",
                "question": "exercise question",
                "options": ["option 1", "option 2", "option 3", "option 4"],
                "correctAnswer": 0
              }
            ],
            "estimatedDuration": 15,
            "xpReward": 50
          }
        ]
      }
    ]
  }
}

3. Content Guidelines:
   - Start with basic greetings and introductions
   - Include essential vocabulary for daily life
   - Cover fundamental grammar concepts
   - Progress to more complex sentence structures
   - Include cultural notes where relevant
   - Each lesson should build upon previous knowledge
   - Include review lessons at the end of each unit

4. Difficulty Progression:
   - Unit 1: Absolute basics (greetings, numbers, simple phrases)
   - Unit 2: Building sentences (basic grammar, more vocabulary)
   - Unit 3: Everyday conversations (present tense, common situations)
   - Unit 4: More complex structures (past/future tense, more vocabulary)
   - Unit 5: Intermediate skills (conversations, cultural context)

Please ensure the response is valid JSON and covers all aspects mentioned above.`);
    }
  }
}
export default new GeminiService();