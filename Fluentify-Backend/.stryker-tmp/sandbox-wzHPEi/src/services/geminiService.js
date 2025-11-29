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
    if (stryMutAct_9fa48("3085")) {
      {}
    } else {
      stryCov_9fa48("3085");
      if (stryMutAct_9fa48("3088") ? false : stryMutAct_9fa48("3087") ? true : stryMutAct_9fa48("3086") ? process.env.GEMINI_API_KEY : (stryCov_9fa48("3086", "3087", "3088"), !process.env.GEMINI_API_KEY)) {
        if (stryMutAct_9fa48("3089")) {
          {}
        } else {
          stryCov_9fa48("3089");
          throw new Error(stryMutAct_9fa48("3090") ? "" : (stryCov_9fa48("3090"), 'GEMINI_API_KEY is not set in environment variables'));
        }
      }
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Use gemini-pro which is the stable model for v1beta API
      this.model = this.genAI.getGenerativeModel(stryMutAct_9fa48("3091") ? {} : (stryCov_9fa48("3091"), {
        model: stryMutAct_9fa48("3092") ? "" : (stryCov_9fa48("3092"), 'gemini-2.0-flash')
      }));
    }
  }

  /**
   * Retry helper with exponential backoff for rate limiting
   */
  async retryWithBackoff(fn, maxRetries = 3, initialDelay = 2000) {
    if (stryMutAct_9fa48("3093")) {
      {}
    } else {
      stryCov_9fa48("3093");
      let lastError;
      for (let attempt = 0; stryMutAct_9fa48("3096") ? attempt >= maxRetries : stryMutAct_9fa48("3095") ? attempt <= maxRetries : stryMutAct_9fa48("3094") ? false : (stryCov_9fa48("3094", "3095", "3096"), attempt < maxRetries); stryMutAct_9fa48("3097") ? attempt-- : (stryCov_9fa48("3097"), attempt++)) {
        if (stryMutAct_9fa48("3098")) {
          {}
        } else {
          stryCov_9fa48("3098");
          try {
            if (stryMutAct_9fa48("3099")) {
              {}
            } else {
              stryCov_9fa48("3099");
              return await fn();
            }
          } catch (error) {
            if (stryMutAct_9fa48("3100")) {
              {}
            } else {
              stryCov_9fa48("3100");
              lastError = error;

              // Check if it's a rate limit error (429)
              if (stryMutAct_9fa48("3103") ? (error.status === 429 || error.message?.includes('429')) && error.message?.includes('Too Many Requests') : stryMutAct_9fa48("3102") ? false : stryMutAct_9fa48("3101") ? true : (stryCov_9fa48("3101", "3102", "3103"), (stryMutAct_9fa48("3105") ? error.status === 429 && error.message?.includes('429') : stryMutAct_9fa48("3104") ? false : (stryCov_9fa48("3104", "3105"), (stryMutAct_9fa48("3107") ? error.status !== 429 : stryMutAct_9fa48("3106") ? false : (stryCov_9fa48("3106", "3107"), error.status === 429)) || (stryMutAct_9fa48("3108") ? error.message.includes('429') : (stryCov_9fa48("3108"), error.message?.includes(stryMutAct_9fa48("3109") ? "" : (stryCov_9fa48("3109"), '429')))))) || (stryMutAct_9fa48("3110") ? error.message.includes('Too Many Requests') : (stryCov_9fa48("3110"), error.message?.includes(stryMutAct_9fa48("3111") ? "" : (stryCov_9fa48("3111"), 'Too Many Requests')))))) {
                if (stryMutAct_9fa48("3112")) {
                  {}
                } else {
                  stryCov_9fa48("3112");
                  const delay = stryMutAct_9fa48("3113") ? initialDelay / Math.pow(2, attempt) : (stryCov_9fa48("3113"), initialDelay * Math.pow(2, attempt)); // Exponential backoff: 2s, 4s, 8s
                  console.warn(stryMutAct_9fa48("3114") ? `` : (stryCov_9fa48("3114"), `⏳ Rate limit hit. Retrying in ${stryMutAct_9fa48("3115") ? delay * 1000 : (stryCov_9fa48("3115"), delay / 1000)}s... (Attempt ${stryMutAct_9fa48("3116") ? attempt - 1 : (stryCov_9fa48("3116"), attempt + 1)}/${maxRetries})`));

                  // Wait before retry
                  await new Promise(stryMutAct_9fa48("3117") ? () => undefined : (stryCov_9fa48("3117"), resolve => setTimeout(resolve, delay)));
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
  async generateCourse(language, expectedDuration, expertise = stryMutAct_9fa48("3118") ? "" : (stryCov_9fa48("3118"), 'Beginner')) {
    if (stryMutAct_9fa48("3119")) {
      {}
    } else {
      stryCov_9fa48("3119");
      try {
        if (stryMutAct_9fa48("3120")) {
          {}
        } else {
          stryCov_9fa48("3120");
          console.log(stryMutAct_9fa48("3121") ? `` : (stryCov_9fa48("3121"), `Generating course for: ${language}, Duration: ${expectedDuration}, Expertise: ${expertise}`));

          // Step 1: Generate course outline (units structure)
          console.log(stryMutAct_9fa48("3122") ? "" : (stryCov_9fa48("3122"), 'Step 1: Generating course outline...'));
          const outline = await this.generateCourseOutline(language, expectedDuration, expertise);

          // Step 2: Generate each unit separately
          console.log(stryMutAct_9fa48("3123") ? `` : (stryCov_9fa48("3123"), `Step 2: Generating ${outline.units.length} units...`));
          const units = stryMutAct_9fa48("3124") ? ["Stryker was here"] : (stryCov_9fa48("3124"), []);
          for (let i = 0; stryMutAct_9fa48("3127") ? i >= outline.units.length : stryMutAct_9fa48("3126") ? i <= outline.units.length : stryMutAct_9fa48("3125") ? false : (stryCov_9fa48("3125", "3126", "3127"), i < outline.units.length); stryMutAct_9fa48("3128") ? i-- : (stryCov_9fa48("3128"), i++)) {
            if (stryMutAct_9fa48("3129")) {
              {}
            } else {
              stryCov_9fa48("3129");
              const unitOutline = outline.units[i];
              console.log(stryMutAct_9fa48("3130") ? `` : (stryCov_9fa48("3130"), `  Generating Unit ${stryMutAct_9fa48("3131") ? i - 1 : (stryCov_9fa48("3131"), i + 1)}: ${unitOutline.title}...`));
              const unit = await this.generateUnit(language, unitOutline, stryMutAct_9fa48("3132") ? i - 1 : (stryCov_9fa48("3132"), i + 1), expertise);
              units.push(unit);
            }
          }

          // Step 3: Combine everything
          const structuredCourse = stryMutAct_9fa48("3133") ? {} : (stryCov_9fa48("3133"), {
            course: stryMutAct_9fa48("3134") ? {} : (stryCov_9fa48("3134"), {
              title: stryMutAct_9fa48("3135") ? `` : (stryCov_9fa48("3135"), `${language} Learning Journey`),
              language: language,
              duration: expectedDuration,
              totalLessons: units.reduce(stryMutAct_9fa48("3136") ? () => undefined : (stryCov_9fa48("3136"), (sum, unit) => stryMutAct_9fa48("3137") ? sum - unit.lessons.length : (stryCov_9fa48("3137"), sum + unit.lessons.length)), 0),
              generatedAt: new Date().toISOString(),
              version: stryMutAct_9fa48("3138") ? "" : (stryCov_9fa48("3138"), '1.0'),
              units: units
            }),
            metadata: stryMutAct_9fa48("3139") ? {} : (stryCov_9fa48("3139"), {
              language,
              totalUnits: units.length,
              totalLessons: units.reduce(stryMutAct_9fa48("3140") ? () => undefined : (stryCov_9fa48("3140"), (sum, unit) => stryMutAct_9fa48("3141") ? sum - unit.lessons.length : (stryCov_9fa48("3141"), sum + unit.lessons.length)), 0),
              estimatedTotalTime: units.reduce((sum, unit) => {
                if (stryMutAct_9fa48("3142")) {
                  {}
                } else {
                  stryCov_9fa48("3142");
                  const unitTime = stryMutAct_9fa48("3145") ? parseInt(unit.estimatedTime) && 150 : stryMutAct_9fa48("3144") ? false : stryMutAct_9fa48("3143") ? true : (stryCov_9fa48("3143", "3144", "3145"), parseInt(unit.estimatedTime) || 150);
                  return stryMutAct_9fa48("3146") ? sum - unitTime : (stryCov_9fa48("3146"), sum + unitTime);
                }
              }, 0)
            })
          });
          console.log(stryMutAct_9fa48("3147") ? "" : (stryCov_9fa48("3147"), 'Course generation complete!'));
          console.log(stryMutAct_9fa48("3148") ? `` : (stryCov_9fa48("3148"), `Total: ${structuredCourse.metadata.totalUnits} units, ${structuredCourse.metadata.totalLessons} lessons`));
          return structuredCourse;
        }
      } catch (error) {
        if (stryMutAct_9fa48("3149")) {
          {}
        } else {
          stryCov_9fa48("3149");
          console.error(stryMutAct_9fa48("3150") ? "" : (stryCov_9fa48("3150"), 'Error generating course:'), error);
          throw new Error(stryMutAct_9fa48("3151") ? `` : (stryCov_9fa48("3151"), `Failed to generate course content: ${error.message}`));
        }
      }
    }
  }

  /**
   * Generate course outline with unit structure
   */
  async generateCourseOutline(language, expectedDuration, expertise = stryMutAct_9fa48("3152") ? "" : (stryCov_9fa48("3152"), 'Beginner')) {
    if (stryMutAct_9fa48("3153")) {
      {}
    } else {
      stryCov_9fa48("3153");
      const prompt = stryMutAct_9fa48("3154") ? `` : (stryCov_9fa48("3154"), `Generate a comprehensive, in-depth course outline for learning ${language} over ${expectedDuration}.

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
      const result = await this.model.generateContent(stryMutAct_9fa48("3155") ? {} : (stryCov_9fa48("3155"), {
        contents: stryMutAct_9fa48("3156") ? [] : (stryCov_9fa48("3156"), [stryMutAct_9fa48("3157") ? {} : (stryCov_9fa48("3157"), {
          role: stryMutAct_9fa48("3158") ? "" : (stryCov_9fa48("3158"), 'user'),
          parts: stryMutAct_9fa48("3159") ? [] : (stryCov_9fa48("3159"), [stryMutAct_9fa48("3160") ? {} : (stryCov_9fa48("3160"), {
            text: prompt
          })])
        })]),
        generationConfig: stryMutAct_9fa48("3161") ? {} : (stryCov_9fa48("3161"), {
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
  async generateUnit(language, unitOutline, unitNumber, expertise = stryMutAct_9fa48("3162") ? "" : (stryCov_9fa48("3162"), 'Beginner')) {
    if (stryMutAct_9fa48("3163")) {
      {}
    } else {
      stryCov_9fa48("3163");
      const prompt = stryMutAct_9fa48("3164") ? `` : (stryCov_9fa48("3164"), `Generate detailed lessons for Unit ${unitNumber} of a ${language} course.

User's Current Level: ${expertise}

Unit Info:
- Title: ${unitOutline.title}
- Description: ${unitOutline.description}
- Difficulty: ${unitOutline.difficulty}
- Topics: ${unitOutline.topics.join(stryMutAct_9fa48("3165") ? "" : (stryCov_9fa48("3165"), ', '))}
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
        if (stryMutAct_9fa48("3166")) {
          {}
        } else {
          stryCov_9fa48("3166");
          const result = await this.model.generateContent(stryMutAct_9fa48("3167") ? {} : (stryCov_9fa48("3167"), {
            contents: stryMutAct_9fa48("3168") ? [] : (stryCov_9fa48("3168"), [stryMutAct_9fa48("3169") ? {} : (stryCov_9fa48("3169"), {
              role: stryMutAct_9fa48("3170") ? "" : (stryCov_9fa48("3170"), 'user'),
              parts: stryMutAct_9fa48("3171") ? [] : (stryCov_9fa48("3171"), [stryMutAct_9fa48("3172") ? {} : (stryCov_9fa48("3172"), {
                text: prompt
              })])
            })]),
            generationConfig: stryMutAct_9fa48("3173") ? {} : (stryCov_9fa48("3173"), {
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
    if (stryMutAct_9fa48("3174")) {
      {}
    } else {
      stryCov_9fa48("3174");
      try {
        if (stryMutAct_9fa48("3175")) {
          {}
        } else {
          stryCov_9fa48("3175");
          console.log(stryMutAct_9fa48("3176") ? "" : (stryCov_9fa48("3176"), 'Response length:'), text.length, stryMutAct_9fa48("3177") ? "" : (stryCov_9fa48("3177"), 'characters'));

          // Clean the response text
          let cleanText = stryMutAct_9fa48("3178") ? text : (stryCov_9fa48("3178"), text.trim());

          // Remove markdown code blocks if present
          cleanText = stryMutAct_9fa48("3179") ? cleanText.replace(/```json\n?/g, '').replace(/```/g, '') : (stryCov_9fa48("3179"), cleanText.replace(stryMutAct_9fa48("3180") ? /```json\n/g : (stryCov_9fa48("3180"), /```json\n?/g), stryMutAct_9fa48("3181") ? "Stryker was here!" : (stryCov_9fa48("3181"), '')).replace(/```/g, stryMutAct_9fa48("3182") ? "Stryker was here!" : (stryCov_9fa48("3182"), '')).trim());

          // Try to extract JSON from the response
          let jsonMatch = cleanText.match(stryMutAct_9fa48("3186") ? /\{[\s\s]*\}/ : stryMutAct_9fa48("3185") ? /\{[\S\S]*\}/ : stryMutAct_9fa48("3184") ? /\{[^\s\S]*\}/ : stryMutAct_9fa48("3183") ? /\{[\s\S]\}/ : (stryCov_9fa48("3183", "3184", "3185", "3186"), /\{[\s\S]*\}/));
          if (stryMutAct_9fa48("3189") ? false : stryMutAct_9fa48("3188") ? true : stryMutAct_9fa48("3187") ? jsonMatch : (stryCov_9fa48("3187", "3188", "3189"), !jsonMatch)) {
            if (stryMutAct_9fa48("3190")) {
              {}
            } else {
              stryCov_9fa48("3190");
              const startIdx = cleanText.indexOf(stryMutAct_9fa48("3191") ? "" : (stryCov_9fa48("3191"), '{'));
              const endIdx = cleanText.lastIndexOf(stryMutAct_9fa48("3192") ? "" : (stryCov_9fa48("3192"), '}'));
              if (stryMutAct_9fa48("3195") ? startIdx !== -1 && endIdx !== -1 || endIdx > startIdx : stryMutAct_9fa48("3194") ? false : stryMutAct_9fa48("3193") ? true : (stryCov_9fa48("3193", "3194", "3195"), (stryMutAct_9fa48("3197") ? startIdx !== -1 || endIdx !== -1 : stryMutAct_9fa48("3196") ? true : (stryCov_9fa48("3196", "3197"), (stryMutAct_9fa48("3199") ? startIdx === -1 : stryMutAct_9fa48("3198") ? true : (stryCov_9fa48("3198", "3199"), startIdx !== (stryMutAct_9fa48("3200") ? +1 : (stryCov_9fa48("3200"), -1)))) && (stryMutAct_9fa48("3202") ? endIdx === -1 : stryMutAct_9fa48("3201") ? true : (stryCov_9fa48("3201", "3202"), endIdx !== (stryMutAct_9fa48("3203") ? +1 : (stryCov_9fa48("3203"), -1)))))) && (stryMutAct_9fa48("3206") ? endIdx <= startIdx : stryMutAct_9fa48("3205") ? endIdx >= startIdx : stryMutAct_9fa48("3204") ? true : (stryCov_9fa48("3204", "3205", "3206"), endIdx > startIdx)))) {
                if (stryMutAct_9fa48("3207")) {
                  {}
                } else {
                  stryCov_9fa48("3207");
                  jsonMatch = stryMutAct_9fa48("3208") ? [] : (stryCov_9fa48("3208"), [stryMutAct_9fa48("3209") ? cleanText : (stryCov_9fa48("3209"), cleanText.substring(startIdx, stryMutAct_9fa48("3210") ? endIdx - 1 : (stryCov_9fa48("3210"), endIdx + 1)))]);
                }
              }
            }
          }
          if (stryMutAct_9fa48("3213") ? false : stryMutAct_9fa48("3212") ? true : stryMutAct_9fa48("3211") ? jsonMatch : (stryCov_9fa48("3211", "3212", "3213"), !jsonMatch)) {
            if (stryMutAct_9fa48("3214")) {
              {}
            } else {
              stryCov_9fa48("3214");
              throw new Error(stryMutAct_9fa48("3215") ? "" : (stryCov_9fa48("3215"), 'No valid JSON found in AI response'));
            }
          }
          let data;
          try {
            if (stryMutAct_9fa48("3216")) {
              {}
            } else {
              stryCov_9fa48("3216");
              data = JSON.parse(jsonMatch[0]);
            }
          } catch (parseError) {
            if (stryMutAct_9fa48("3217")) {
              {}
            } else {
              stryCov_9fa48("3217");
              console.error(stryMutAct_9fa48("3218") ? "" : (stryCov_9fa48("3218"), 'JSON parse error:'), parseError.message);

              // Try to fix common JSON issues
              let fixedJson = jsonMatch[0].replace(stryMutAct_9fa48("3221") ? /,\s*([^}\]])/g : stryMutAct_9fa48("3220") ? /,\S*([}\]])/g : stryMutAct_9fa48("3219") ? /,\s([}\]])/g : (stryCov_9fa48("3219", "3220", "3221"), /,\s*([}\]])/g), stryMutAct_9fa48("3222") ? "" : (stryCov_9fa48("3222"), '$1')) // Remove trailing commas
              .replace(stryMutAct_9fa48("3226") ? /"\s*\n\S*"/g : stryMutAct_9fa48("3225") ? /"\s*\n\s"/g : stryMutAct_9fa48("3224") ? /"\S*\n\s*"/g : stryMutAct_9fa48("3223") ? /"\s\n\s*"/g : (stryCov_9fa48("3223", "3224", "3225", "3226"), /"\s*\n\s*"/g), stryMutAct_9fa48("3227") ? "" : (stryCov_9fa48("3227"), '" "')) // Fix line breaks in strings
              .replace(stryMutAct_9fa48("3228") ? /([\\])\n/g : (stryCov_9fa48("3228"), /([^\\])\n/g), stryMutAct_9fa48("3229") ? "" : (stryCov_9fa48("3229"), '$1 ')); // Remove unescaped newlines

              // If still fails, try to truncate at last valid closing brace
              try {
                if (stryMutAct_9fa48("3230")) {
                  {}
                } else {
                  stryCov_9fa48("3230");
                  data = JSON.parse(fixedJson);
                }
              } catch (secondError) {
                if (stryMutAct_9fa48("3231")) {
                  {}
                } else {
                  stryCov_9fa48("3231");
                  console.error(stryMutAct_9fa48("3232") ? "" : (stryCov_9fa48("3232"), 'Second parse attempt failed, trying to auto-close JSON'));

                  // Find the position of the error and try to close JSON properly
                  const errorPos = parseInt(stryMutAct_9fa48("3235") ? secondError.message.match(/position (\d+)/)?.[1] && '0' : stryMutAct_9fa48("3234") ? false : stryMutAct_9fa48("3233") ? true : (stryCov_9fa48("3233", "3234", "3235"), (stryMutAct_9fa48("3236") ? secondError.message.match(/position (\d+)/)[1] : (stryCov_9fa48("3236"), secondError.message.match(stryMutAct_9fa48("3238") ? /position (\D+)/ : stryMutAct_9fa48("3237") ? /position (\d)/ : (stryCov_9fa48("3237", "3238"), /position (\d+)/))?.[1])) || (stryMutAct_9fa48("3239") ? "" : (stryCov_9fa48("3239"), '0'))));
                  if (stryMutAct_9fa48("3243") ? errorPos <= 0 : stryMutAct_9fa48("3242") ? errorPos >= 0 : stryMutAct_9fa48("3241") ? false : stryMutAct_9fa48("3240") ? true : (stryCov_9fa48("3240", "3241", "3242", "3243"), errorPos > 0)) {
                    if (stryMutAct_9fa48("3244")) {
                      {}
                    } else {
                      stryCov_9fa48("3244");
                      let truncated = stryMutAct_9fa48("3245") ? fixedJson : (stryCov_9fa48("3245"), fixedJson.substring(0, errorPos));
                      // Count open braces/brackets and close them
                      const openBraces = (stryMutAct_9fa48("3248") ? truncated.match(/\{/g) && [] : stryMutAct_9fa48("3247") ? false : stryMutAct_9fa48("3246") ? true : (stryCov_9fa48("3246", "3247", "3248"), truncated.match(/\{/g) || (stryMutAct_9fa48("3249") ? ["Stryker was here"] : (stryCov_9fa48("3249"), [])))).length;
                      const closeBraces = (stryMutAct_9fa48("3252") ? truncated.match(/\}/g) && [] : stryMutAct_9fa48("3251") ? false : stryMutAct_9fa48("3250") ? true : (stryCov_9fa48("3250", "3251", "3252"), truncated.match(/\}/g) || (stryMutAct_9fa48("3253") ? ["Stryker was here"] : (stryCov_9fa48("3253"), [])))).length;
                      const openBrackets = (stryMutAct_9fa48("3256") ? truncated.match(/\[/g) && [] : stryMutAct_9fa48("3255") ? false : stryMutAct_9fa48("3254") ? true : (stryCov_9fa48("3254", "3255", "3256"), truncated.match(/\[/g) || (stryMutAct_9fa48("3257") ? ["Stryker was here"] : (stryCov_9fa48("3257"), [])))).length;
                      const closeBrackets = (stryMutAct_9fa48("3260") ? truncated.match(/\]/g) && [] : stryMutAct_9fa48("3259") ? false : stryMutAct_9fa48("3258") ? true : (stryCov_9fa48("3258", "3259", "3260"), truncated.match(/\]/g) || (stryMutAct_9fa48("3261") ? ["Stryker was here"] : (stryCov_9fa48("3261"), [])))).length;

                      // Add missing closing characters
                      for (let i = 0; stryMutAct_9fa48("3264") ? i >= openBrackets - closeBrackets : stryMutAct_9fa48("3263") ? i <= openBrackets - closeBrackets : stryMutAct_9fa48("3262") ? false : (stryCov_9fa48("3262", "3263", "3264"), i < (stryMutAct_9fa48("3265") ? openBrackets + closeBrackets : (stryCov_9fa48("3265"), openBrackets - closeBrackets))); stryMutAct_9fa48("3266") ? i-- : (stryCov_9fa48("3266"), i++)) truncated += stryMutAct_9fa48("3267") ? "" : (stryCov_9fa48("3267"), ']');
                      for (let i = 0; stryMutAct_9fa48("3270") ? i >= openBraces - closeBraces : stryMutAct_9fa48("3269") ? i <= openBraces - closeBraces : stryMutAct_9fa48("3268") ? false : (stryCov_9fa48("3268", "3269", "3270"), i < (stryMutAct_9fa48("3271") ? openBraces + closeBraces : (stryCov_9fa48("3271"), openBraces - closeBraces))); stryMutAct_9fa48("3272") ? i-- : (stryCov_9fa48("3272"), i++)) truncated += stryMutAct_9fa48("3273") ? "" : (stryCov_9fa48("3273"), '}');
                      console.log(stryMutAct_9fa48("3274") ? "" : (stryCov_9fa48("3274"), 'Attempting to parse auto-closed JSON'));
                      data = JSON.parse(truncated);
                    }
                  } else {
                    if (stryMutAct_9fa48("3275")) {
                      {}
                    } else {
                      stryCov_9fa48("3275");
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
        if (stryMutAct_9fa48("3276")) {
          {}
        } else {
          stryCov_9fa48("3276");
          console.error(stryMutAct_9fa48("3277") ? "" : (stryCov_9fa48("3277"), 'Error parsing JSON:'), error);
          console.error(stryMutAct_9fa48("3278") ? "" : (stryCov_9fa48("3278"), 'Raw response:'), stryMutAct_9fa48("3279") ? text : (stryCov_9fa48("3279"), text.substring(0, 500)));
          throw new Error(stryMutAct_9fa48("3280") ? `` : (stryCov_9fa48("3280"), `Failed to parse JSON: ${error.message}`));
        }
      }
    }
  }

  /**
   * Generate additional exercises for a specific lesson (kept for backward compatibility)
   */
  async generateExercises(lessonTitle, lessonType, language) {
    if (stryMutAct_9fa48("3281")) {
      {}
    } else {
      stryCov_9fa48("3281");
      try {
        if (stryMutAct_9fa48("3282")) {
          {}
        } else {
          stryCov_9fa48("3282");
          const prompt = stryMutAct_9fa48("3283") ? `` : (stryCov_9fa48("3283"), `Generate 5 multiple choice questions (MCQ) for a ${lessonType} lesson titled "${lessonTitle}" in ${language}. 

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
            if (stryMutAct_9fa48("3284")) {
              {}
            } else {
              stryCov_9fa48("3284");
              const result = await this.model.generateContent(prompt);
              const response = await result.response;
              const text = response.text();
              return this.parseJSON(text);
            }
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3285")) {
          {}
        } else {
          stryCov_9fa48("3285");
          console.error(stryMutAct_9fa48("3286") ? "" : (stryCov_9fa48("3286"), 'Error generating exercises:'), error);
          throw new Error(stryMutAct_9fa48("3287") ? "" : (stryCov_9fa48("3287"), 'Failed to generate exercises'));
        }
      }
    }
  }
  createCoursePrompt(language, expectedDuration) {
    if (stryMutAct_9fa48("3288")) {
      {}
    } else {
      stryCov_9fa48("3288");
      return stryMutAct_9fa48("3289") ? `` : (stryCov_9fa48("3289"), `Generate a language learning course for ${language} designed for ${expectedDuration} of learning.

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