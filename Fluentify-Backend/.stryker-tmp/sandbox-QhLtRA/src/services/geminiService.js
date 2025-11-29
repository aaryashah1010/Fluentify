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
    if (stryMutAct_9fa48("512")) {
      {}
    } else {
      stryCov_9fa48("512");
      if (stryMutAct_9fa48("515") ? false : stryMutAct_9fa48("514") ? true : stryMutAct_9fa48("513") ? process.env.GEMINI_API_KEY : (stryCov_9fa48("513", "514", "515"), !process.env.GEMINI_API_KEY)) {
        if (stryMutAct_9fa48("516")) {
          {}
        } else {
          stryCov_9fa48("516");
          throw new Error(stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), 'GEMINI_API_KEY is not set in environment variables'));
        }
      }
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Use gemini-pro which is the stable model for v1beta API
      this.model = this.genAI.getGenerativeModel(stryMutAct_9fa48("518") ? {} : (stryCov_9fa48("518"), {
        model: stryMutAct_9fa48("519") ? "" : (stryCov_9fa48("519"), 'gemini-2.0-flash')
      }));
    }
  }

  /**
   * Retry helper with exponential backoff for rate limiting
   */
  async retryWithBackoff(fn, maxRetries = 3, initialDelay = 2000) {
    if (stryMutAct_9fa48("520")) {
      {}
    } else {
      stryCov_9fa48("520");
      let lastError;
      for (let attempt = 0; stryMutAct_9fa48("523") ? attempt >= maxRetries : stryMutAct_9fa48("522") ? attempt <= maxRetries : stryMutAct_9fa48("521") ? false : (stryCov_9fa48("521", "522", "523"), attempt < maxRetries); stryMutAct_9fa48("524") ? attempt-- : (stryCov_9fa48("524"), attempt++)) {
        if (stryMutAct_9fa48("525")) {
          {}
        } else {
          stryCov_9fa48("525");
          try {
            if (stryMutAct_9fa48("526")) {
              {}
            } else {
              stryCov_9fa48("526");
              return await fn();
            }
          } catch (error) {
            if (stryMutAct_9fa48("527")) {
              {}
            } else {
              stryCov_9fa48("527");
              lastError = error;

              // Check if it's a rate limit error (429)
              if (stryMutAct_9fa48("530") ? (error.status === 429 || error.message?.includes('429')) && error.message?.includes('Too Many Requests') : stryMutAct_9fa48("529") ? false : stryMutAct_9fa48("528") ? true : (stryCov_9fa48("528", "529", "530"), (stryMutAct_9fa48("532") ? error.status === 429 && error.message?.includes('429') : stryMutAct_9fa48("531") ? false : (stryCov_9fa48("531", "532"), (stryMutAct_9fa48("534") ? error.status !== 429 : stryMutAct_9fa48("533") ? false : (stryCov_9fa48("533", "534"), error.status === 429)) || (stryMutAct_9fa48("535") ? error.message.includes('429') : (stryCov_9fa48("535"), error.message?.includes(stryMutAct_9fa48("536") ? "" : (stryCov_9fa48("536"), '429')))))) || (stryMutAct_9fa48("537") ? error.message.includes('Too Many Requests') : (stryCov_9fa48("537"), error.message?.includes(stryMutAct_9fa48("538") ? "" : (stryCov_9fa48("538"), 'Too Many Requests')))))) {
                if (stryMutAct_9fa48("539")) {
                  {}
                } else {
                  stryCov_9fa48("539");
                  const delay = stryMutAct_9fa48("540") ? initialDelay / Math.pow(2, attempt) : (stryCov_9fa48("540"), initialDelay * Math.pow(2, attempt)); // Exponential backoff: 2s, 4s, 8s
                  console.warn(stryMutAct_9fa48("541") ? `` : (stryCov_9fa48("541"), `⏳ Rate limit hit. Retrying in ${stryMutAct_9fa48("542") ? delay * 1000 : (stryCov_9fa48("542"), delay / 1000)}s... (Attempt ${stryMutAct_9fa48("543") ? attempt - 1 : (stryCov_9fa48("543"), attempt + 1)}/${maxRetries})`));

                  // Wait before retry
                  await new Promise(stryMutAct_9fa48("544") ? () => undefined : (stryCov_9fa48("544"), resolve => setTimeout(resolve, delay)));
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
  async generateCourse(language, expectedDuration, expertise = stryMutAct_9fa48("545") ? "" : (stryCov_9fa48("545"), 'Beginner')) {
    if (stryMutAct_9fa48("546")) {
      {}
    } else {
      stryCov_9fa48("546");
      try {
        if (stryMutAct_9fa48("547")) {
          {}
        } else {
          stryCov_9fa48("547");
          console.log(stryMutAct_9fa48("548") ? `` : (stryCov_9fa48("548"), `Generating course for: ${language}, Duration: ${expectedDuration}, Expertise: ${expertise}`));

          // Step 1: Generate course outline (units structure)
          console.log(stryMutAct_9fa48("549") ? "" : (stryCov_9fa48("549"), 'Step 1: Generating course outline...'));
          const outline = await this.generateCourseOutline(language, expectedDuration, expertise);

          // Step 2: Generate each unit separately
          console.log(stryMutAct_9fa48("550") ? `` : (stryCov_9fa48("550"), `Step 2: Generating ${outline.units.length} units...`));
          const units = stryMutAct_9fa48("551") ? ["Stryker was here"] : (stryCov_9fa48("551"), []);
          for (let i = 0; stryMutAct_9fa48("554") ? i >= outline.units.length : stryMutAct_9fa48("553") ? i <= outline.units.length : stryMutAct_9fa48("552") ? false : (stryCov_9fa48("552", "553", "554"), i < outline.units.length); stryMutAct_9fa48("555") ? i-- : (stryCov_9fa48("555"), i++)) {
            if (stryMutAct_9fa48("556")) {
              {}
            } else {
              stryCov_9fa48("556");
              const unitOutline = outline.units[i];
              console.log(stryMutAct_9fa48("557") ? `` : (stryCov_9fa48("557"), `  Generating Unit ${stryMutAct_9fa48("558") ? i - 1 : (stryCov_9fa48("558"), i + 1)}: ${unitOutline.title}...`));
              const unit = await this.generateUnit(language, unitOutline, stryMutAct_9fa48("559") ? i - 1 : (stryCov_9fa48("559"), i + 1), expertise);
              units.push(unit);
            }
          }

          // Step 3: Combine everything
          const structuredCourse = stryMutAct_9fa48("560") ? {} : (stryCov_9fa48("560"), {
            course: stryMutAct_9fa48("561") ? {} : (stryCov_9fa48("561"), {
              title: stryMutAct_9fa48("562") ? `` : (stryCov_9fa48("562"), `${language} Learning Journey`),
              language: language,
              duration: expectedDuration,
              totalLessons: units.reduce(stryMutAct_9fa48("563") ? () => undefined : (stryCov_9fa48("563"), (sum, unit) => stryMutAct_9fa48("564") ? sum - unit.lessons.length : (stryCov_9fa48("564"), sum + unit.lessons.length)), 0),
              generatedAt: new Date().toISOString(),
              version: stryMutAct_9fa48("565") ? "" : (stryCov_9fa48("565"), '1.0'),
              units: units
            }),
            metadata: stryMutAct_9fa48("566") ? {} : (stryCov_9fa48("566"), {
              language,
              totalUnits: units.length,
              totalLessons: units.reduce(stryMutAct_9fa48("567") ? () => undefined : (stryCov_9fa48("567"), (sum, unit) => stryMutAct_9fa48("568") ? sum - unit.lessons.length : (stryCov_9fa48("568"), sum + unit.lessons.length)), 0),
              estimatedTotalTime: units.reduce((sum, unit) => {
                if (stryMutAct_9fa48("569")) {
                  {}
                } else {
                  stryCov_9fa48("569");
                  const unitTime = stryMutAct_9fa48("572") ? parseInt(unit.estimatedTime) && 150 : stryMutAct_9fa48("571") ? false : stryMutAct_9fa48("570") ? true : (stryCov_9fa48("570", "571", "572"), parseInt(unit.estimatedTime) || 150);
                  return stryMutAct_9fa48("573") ? sum - unitTime : (stryCov_9fa48("573"), sum + unitTime);
                }
              }, 0)
            })
          });
          console.log(stryMutAct_9fa48("574") ? "" : (stryCov_9fa48("574"), 'Course generation complete!'));
          console.log(stryMutAct_9fa48("575") ? `` : (stryCov_9fa48("575"), `Total: ${structuredCourse.metadata.totalUnits} units, ${structuredCourse.metadata.totalLessons} lessons`));
          return structuredCourse;
        }
      } catch (error) {
        if (stryMutAct_9fa48("576")) {
          {}
        } else {
          stryCov_9fa48("576");
          console.error(stryMutAct_9fa48("577") ? "" : (stryCov_9fa48("577"), 'Error generating course:'), error);
          throw new Error(stryMutAct_9fa48("578") ? `` : (stryCov_9fa48("578"), `Failed to generate course content: ${error.message}`));
        }
      }
    }
  }

  /**
   * Generate course outline with unit structure
   */
  async generateCourseOutline(language, expectedDuration, expertise = stryMutAct_9fa48("579") ? "" : (stryCov_9fa48("579"), 'Beginner')) {
    if (stryMutAct_9fa48("580")) {
      {}
    } else {
      stryCov_9fa48("580");
      const prompt = stryMutAct_9fa48("581") ? `` : (stryCov_9fa48("581"), `Generate a comprehensive, in-depth course outline for learning ${language} over ${expectedDuration}.

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
      const result = await this.model.generateContent(stryMutAct_9fa48("582") ? {} : (stryCov_9fa48("582"), {
        contents: stryMutAct_9fa48("583") ? [] : (stryCov_9fa48("583"), [stryMutAct_9fa48("584") ? {} : (stryCov_9fa48("584"), {
          role: stryMutAct_9fa48("585") ? "" : (stryCov_9fa48("585"), 'user'),
          parts: stryMutAct_9fa48("586") ? [] : (stryCov_9fa48("586"), [stryMutAct_9fa48("587") ? {} : (stryCov_9fa48("587"), {
            text: prompt
          })])
        })]),
        generationConfig: stryMutAct_9fa48("588") ? {} : (stryCov_9fa48("588"), {
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
  async generateUnit(language, unitOutline, unitNumber, expertise = stryMutAct_9fa48("589") ? "" : (stryCov_9fa48("589"), 'Beginner')) {
    if (stryMutAct_9fa48("590")) {
      {}
    } else {
      stryCov_9fa48("590");
      const prompt = stryMutAct_9fa48("591") ? `` : (stryCov_9fa48("591"), `Generate detailed lessons for Unit ${unitNumber} of a ${language} course.

User's Current Level: ${expertise}

Unit Info:
- Title: ${unitOutline.title}
- Description: ${unitOutline.description}
- Difficulty: ${unitOutline.difficulty}
- Topics: ${unitOutline.topics.join(stryMutAct_9fa48("592") ? "" : (stryCov_9fa48("592"), ', '))}
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
        if (stryMutAct_9fa48("593")) {
          {}
        } else {
          stryCov_9fa48("593");
          const result = await this.model.generateContent(stryMutAct_9fa48("594") ? {} : (stryCov_9fa48("594"), {
            contents: stryMutAct_9fa48("595") ? [] : (stryCov_9fa48("595"), [stryMutAct_9fa48("596") ? {} : (stryCov_9fa48("596"), {
              role: stryMutAct_9fa48("597") ? "" : (stryCov_9fa48("597"), 'user'),
              parts: stryMutAct_9fa48("598") ? [] : (stryCov_9fa48("598"), [stryMutAct_9fa48("599") ? {} : (stryCov_9fa48("599"), {
                text: prompt
              })])
            })]),
            generationConfig: stryMutAct_9fa48("600") ? {} : (stryCov_9fa48("600"), {
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
    if (stryMutAct_9fa48("601")) {
      {}
    } else {
      stryCov_9fa48("601");
      try {
        if (stryMutAct_9fa48("602")) {
          {}
        } else {
          stryCov_9fa48("602");
          console.log(stryMutAct_9fa48("603") ? "" : (stryCov_9fa48("603"), 'Response length:'), text.length, stryMutAct_9fa48("604") ? "" : (stryCov_9fa48("604"), 'characters'));

          // Clean the response text
          let cleanText = stryMutAct_9fa48("605") ? text : (stryCov_9fa48("605"), text.trim());

          // Remove markdown code blocks if present
          cleanText = stryMutAct_9fa48("606") ? cleanText.replace(/```json\n?/g, '').replace(/```/g, '') : (stryCov_9fa48("606"), cleanText.replace(stryMutAct_9fa48("607") ? /```json\n/g : (stryCov_9fa48("607"), /```json\n?/g), stryMutAct_9fa48("608") ? "Stryker was here!" : (stryCov_9fa48("608"), '')).replace(/```/g, stryMutAct_9fa48("609") ? "Stryker was here!" : (stryCov_9fa48("609"), '')).trim());

          // Try to extract JSON from the response
          let jsonMatch = cleanText.match(stryMutAct_9fa48("613") ? /\{[\s\s]*\}/ : stryMutAct_9fa48("612") ? /\{[\S\S]*\}/ : stryMutAct_9fa48("611") ? /\{[^\s\S]*\}/ : stryMutAct_9fa48("610") ? /\{[\s\S]\}/ : (stryCov_9fa48("610", "611", "612", "613"), /\{[\s\S]*\}/));
          if (stryMutAct_9fa48("616") ? false : stryMutAct_9fa48("615") ? true : stryMutAct_9fa48("614") ? jsonMatch : (stryCov_9fa48("614", "615", "616"), !jsonMatch)) {
            if (stryMutAct_9fa48("617")) {
              {}
            } else {
              stryCov_9fa48("617");
              const startIdx = cleanText.indexOf(stryMutAct_9fa48("618") ? "" : (stryCov_9fa48("618"), '{'));
              const endIdx = cleanText.lastIndexOf(stryMutAct_9fa48("619") ? "" : (stryCov_9fa48("619"), '}'));
              if (stryMutAct_9fa48("622") ? startIdx !== -1 && endIdx !== -1 || endIdx > startIdx : stryMutAct_9fa48("621") ? false : stryMutAct_9fa48("620") ? true : (stryCov_9fa48("620", "621", "622"), (stryMutAct_9fa48("624") ? startIdx !== -1 || endIdx !== -1 : stryMutAct_9fa48("623") ? true : (stryCov_9fa48("623", "624"), (stryMutAct_9fa48("626") ? startIdx === -1 : stryMutAct_9fa48("625") ? true : (stryCov_9fa48("625", "626"), startIdx !== (stryMutAct_9fa48("627") ? +1 : (stryCov_9fa48("627"), -1)))) && (stryMutAct_9fa48("629") ? endIdx === -1 : stryMutAct_9fa48("628") ? true : (stryCov_9fa48("628", "629"), endIdx !== (stryMutAct_9fa48("630") ? +1 : (stryCov_9fa48("630"), -1)))))) && (stryMutAct_9fa48("633") ? endIdx <= startIdx : stryMutAct_9fa48("632") ? endIdx >= startIdx : stryMutAct_9fa48("631") ? true : (stryCov_9fa48("631", "632", "633"), endIdx > startIdx)))) {
                if (stryMutAct_9fa48("634")) {
                  {}
                } else {
                  stryCov_9fa48("634");
                  jsonMatch = stryMutAct_9fa48("635") ? [] : (stryCov_9fa48("635"), [stryMutAct_9fa48("636") ? cleanText : (stryCov_9fa48("636"), cleanText.substring(startIdx, stryMutAct_9fa48("637") ? endIdx - 1 : (stryCov_9fa48("637"), endIdx + 1)))]);
                }
              }
            }
          }
          if (stryMutAct_9fa48("640") ? false : stryMutAct_9fa48("639") ? true : stryMutAct_9fa48("638") ? jsonMatch : (stryCov_9fa48("638", "639", "640"), !jsonMatch)) {
            if (stryMutAct_9fa48("641")) {
              {}
            } else {
              stryCov_9fa48("641");
              throw new Error(stryMutAct_9fa48("642") ? "" : (stryCov_9fa48("642"), 'No valid JSON found in AI response'));
            }
          }
          let data;
          try {
            if (stryMutAct_9fa48("643")) {
              {}
            } else {
              stryCov_9fa48("643");
              data = JSON.parse(jsonMatch[0]);
            }
          } catch (parseError) {
            if (stryMutAct_9fa48("644")) {
              {}
            } else {
              stryCov_9fa48("644");
              console.error(stryMutAct_9fa48("645") ? "" : (stryCov_9fa48("645"), 'JSON parse error:'), parseError.message);

              // Try to fix common JSON issues
              let fixedJson = jsonMatch[0].replace(stryMutAct_9fa48("648") ? /,\s*([^}\]])/g : stryMutAct_9fa48("647") ? /,\S*([}\]])/g : stryMutAct_9fa48("646") ? /,\s([}\]])/g : (stryCov_9fa48("646", "647", "648"), /,\s*([}\]])/g), stryMutAct_9fa48("649") ? "" : (stryCov_9fa48("649"), '$1')) // Remove trailing commas
              .replace(stryMutAct_9fa48("653") ? /"\s*\n\S*"/g : stryMutAct_9fa48("652") ? /"\s*\n\s"/g : stryMutAct_9fa48("651") ? /"\S*\n\s*"/g : stryMutAct_9fa48("650") ? /"\s\n\s*"/g : (stryCov_9fa48("650", "651", "652", "653"), /"\s*\n\s*"/g), stryMutAct_9fa48("654") ? "" : (stryCov_9fa48("654"), '" "')) // Fix line breaks in strings
              .replace(stryMutAct_9fa48("655") ? /([\\])\n/g : (stryCov_9fa48("655"), /([^\\])\n/g), stryMutAct_9fa48("656") ? "" : (stryCov_9fa48("656"), '$1 ')); // Remove unescaped newlines

              // If still fails, try to truncate at last valid closing brace
              try {
                if (stryMutAct_9fa48("657")) {
                  {}
                } else {
                  stryCov_9fa48("657");
                  data = JSON.parse(fixedJson);
                }
              } catch (secondError) {
                if (stryMutAct_9fa48("658")) {
                  {}
                } else {
                  stryCov_9fa48("658");
                  console.error(stryMutAct_9fa48("659") ? "" : (stryCov_9fa48("659"), 'Second parse attempt failed, trying to auto-close JSON'));

                  // Find the position of the error and try to close JSON properly
                  const errorPos = parseInt(stryMutAct_9fa48("662") ? secondError.message.match(/position (\d+)/)?.[1] && '0' : stryMutAct_9fa48("661") ? false : stryMutAct_9fa48("660") ? true : (stryCov_9fa48("660", "661", "662"), (stryMutAct_9fa48("663") ? secondError.message.match(/position (\d+)/)[1] : (stryCov_9fa48("663"), secondError.message.match(stryMutAct_9fa48("665") ? /position (\D+)/ : stryMutAct_9fa48("664") ? /position (\d)/ : (stryCov_9fa48("664", "665"), /position (\d+)/))?.[1])) || (stryMutAct_9fa48("666") ? "" : (stryCov_9fa48("666"), '0'))));
                  if (stryMutAct_9fa48("670") ? errorPos <= 0 : stryMutAct_9fa48("669") ? errorPos >= 0 : stryMutAct_9fa48("668") ? false : stryMutAct_9fa48("667") ? true : (stryCov_9fa48("667", "668", "669", "670"), errorPos > 0)) {
                    if (stryMutAct_9fa48("671")) {
                      {}
                    } else {
                      stryCov_9fa48("671");
                      let truncated = stryMutAct_9fa48("672") ? fixedJson : (stryCov_9fa48("672"), fixedJson.substring(0, errorPos));
                      // Count open braces/brackets and close them
                      const openBraces = (stryMutAct_9fa48("675") ? truncated.match(/\{/g) && [] : stryMutAct_9fa48("674") ? false : stryMutAct_9fa48("673") ? true : (stryCov_9fa48("673", "674", "675"), truncated.match(/\{/g) || (stryMutAct_9fa48("676") ? ["Stryker was here"] : (stryCov_9fa48("676"), [])))).length;
                      const closeBraces = (stryMutAct_9fa48("679") ? truncated.match(/\}/g) && [] : stryMutAct_9fa48("678") ? false : stryMutAct_9fa48("677") ? true : (stryCov_9fa48("677", "678", "679"), truncated.match(/\}/g) || (stryMutAct_9fa48("680") ? ["Stryker was here"] : (stryCov_9fa48("680"), [])))).length;
                      const openBrackets = (stryMutAct_9fa48("683") ? truncated.match(/\[/g) && [] : stryMutAct_9fa48("682") ? false : stryMutAct_9fa48("681") ? true : (stryCov_9fa48("681", "682", "683"), truncated.match(/\[/g) || (stryMutAct_9fa48("684") ? ["Stryker was here"] : (stryCov_9fa48("684"), [])))).length;
                      const closeBrackets = (stryMutAct_9fa48("687") ? truncated.match(/\]/g) && [] : stryMutAct_9fa48("686") ? false : stryMutAct_9fa48("685") ? true : (stryCov_9fa48("685", "686", "687"), truncated.match(/\]/g) || (stryMutAct_9fa48("688") ? ["Stryker was here"] : (stryCov_9fa48("688"), [])))).length;

                      // Add missing closing characters
                      for (let i = 0; stryMutAct_9fa48("691") ? i >= openBrackets - closeBrackets : stryMutAct_9fa48("690") ? i <= openBrackets - closeBrackets : stryMutAct_9fa48("689") ? false : (stryCov_9fa48("689", "690", "691"), i < (stryMutAct_9fa48("692") ? openBrackets + closeBrackets : (stryCov_9fa48("692"), openBrackets - closeBrackets))); stryMutAct_9fa48("693") ? i-- : (stryCov_9fa48("693"), i++)) truncated += stryMutAct_9fa48("694") ? "" : (stryCov_9fa48("694"), ']');
                      for (let i = 0; stryMutAct_9fa48("697") ? i >= openBraces - closeBraces : stryMutAct_9fa48("696") ? i <= openBraces - closeBraces : stryMutAct_9fa48("695") ? false : (stryCov_9fa48("695", "696", "697"), i < (stryMutAct_9fa48("698") ? openBraces + closeBraces : (stryCov_9fa48("698"), openBraces - closeBraces))); stryMutAct_9fa48("699") ? i-- : (stryCov_9fa48("699"), i++)) truncated += stryMutAct_9fa48("700") ? "" : (stryCov_9fa48("700"), '}');
                      console.log(stryMutAct_9fa48("701") ? "" : (stryCov_9fa48("701"), 'Attempting to parse auto-closed JSON'));
                      data = JSON.parse(truncated);
                    }
                  } else {
                    if (stryMutAct_9fa48("702")) {
                      {}
                    } else {
                      stryCov_9fa48("702");
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
        if (stryMutAct_9fa48("703")) {
          {}
        } else {
          stryCov_9fa48("703");
          console.error(stryMutAct_9fa48("704") ? "" : (stryCov_9fa48("704"), 'Error parsing JSON:'), error);
          console.error(stryMutAct_9fa48("705") ? "" : (stryCov_9fa48("705"), 'Raw response:'), stryMutAct_9fa48("706") ? text : (stryCov_9fa48("706"), text.substring(0, 500)));
          throw new Error(stryMutAct_9fa48("707") ? `` : (stryCov_9fa48("707"), `Failed to parse JSON: ${error.message}`));
        }
      }
    }
  }

  /**
   * Generate additional exercises for a specific lesson (kept for backward compatibility)
   */
  async generateExercises(lessonTitle, lessonType, language) {
    if (stryMutAct_9fa48("708")) {
      {}
    } else {
      stryCov_9fa48("708");
      try {
        if (stryMutAct_9fa48("709")) {
          {}
        } else {
          stryCov_9fa48("709");
          const prompt = stryMutAct_9fa48("710") ? `` : (stryCov_9fa48("710"), `Generate 5 multiple choice questions (MCQ) for a ${lessonType} lesson titled "${lessonTitle}" in ${language}. 

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
            if (stryMutAct_9fa48("711")) {
              {}
            } else {
              stryCov_9fa48("711");
              const result = await this.model.generateContent(prompt);
              const response = await result.response;
              const text = response.text();
              return this.parseJSON(text);
            }
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("712")) {
          {}
        } else {
          stryCov_9fa48("712");
          console.error(stryMutAct_9fa48("713") ? "" : (stryCov_9fa48("713"), 'Error generating exercises:'), error);
          throw new Error(stryMutAct_9fa48("714") ? "" : (stryCov_9fa48("714"), 'Failed to generate exercises'));
        }
      }
    }
  }
  createCoursePrompt(language, expectedDuration) {
    if (stryMutAct_9fa48("715")) {
      {}
    } else {
      stryCov_9fa48("715");
      return stryMutAct_9fa48("716") ? `` : (stryCov_9fa48("716"), `Generate a language learning course for ${language} designed for ${expectedDuration} of learning.

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