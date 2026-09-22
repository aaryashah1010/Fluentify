import OpenAI from 'openai';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

class OpenAIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Retry helper with exponential backoff for rate limiting
   */
  async retryWithBackoff(fn, maxRetries = 3, initialDelay = 2000) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Check if it's a rate limit error (429)
        if (error.status === 429 || error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
          const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff: 2s, 4s, 8s
          console.warn(`⏳ Rate limit hit. Retrying in ${delay/1000}s... (Attempt ${attempt + 1}/${maxRetries})`);

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // If it's not a rate limit error, throw immediately
        throw error;
      }
    }

    // If all retries failed, throw the last error
    throw lastError;
  }

  /**
   * Call the chat completion API with a single user prompt and return the raw text
   */
  async generateText(prompt, { maxTokens = 2048, temperature = 0.7 } = {}) {
    const completion = await this.client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature,
    });

    return completion.choices[0].message.content;
  }

  /**
   * Generate a structured language learning course similar to Duolingo
   * @param {string} language - The target language to learn
   * @param {string} expectedDuration - Expected learning duration (e.g., '3 months', '6 months')
   * @returns {Promise<Object>} - Structured course data
   */
  async generateCourse(language, expectedDuration, expertise = 'Beginner', baseLanguage = 'English') {
    try {
      console.log(`Generating course for: ${language}, Duration: ${expectedDuration}, Expertise: ${expertise}, Base language: ${baseLanguage}`);

      // Step 1: Generate course outline (units structure)
      console.log('Step 1: Generating course outline...');
      const outline = await this.generateCourseOutline(language, expectedDuration, expertise);

      // Step 2: Generate each unit separately
      console.log(`Step 2: Generating ${outline.units.length} units...`);
      const units = [];

      for (let i = 0; i < outline.units.length; i++) {
        const unitOutline = outline.units[i];
        console.log(`  Generating Unit ${i + 1}: ${unitOutline.title}...`);
        const unit = await this.generateUnit(language, unitOutline, i + 1, expertise, baseLanguage);
        units.push(unit);
      }

      // Step 3: Combine everything
      const structuredCourse = {
        course: {
          title: `${language} Learning Journey`,
          language: language,
          duration: expectedDuration,
          totalLessons: units.reduce((sum, unit) => sum + unit.lessons.length, 0),
          generatedAt: new Date().toISOString(),
          version: '1.0',
          units: units
        },
        metadata: {
          language,
          totalUnits: units.length,
          totalLessons: units.reduce((sum, unit) => sum + unit.lessons.length, 0),
          estimatedTotalTime: units.reduce((sum, unit) => {
            const unitTime = parseInt(unit.estimatedTime) || 150;
            return sum + unitTime;
          }, 0)
        }
      };

      console.log('Course generation complete!');
      console.log(`Total: ${structuredCourse.metadata.totalUnits} units, ${structuredCourse.metadata.totalLessons} lessons`);

      return structuredCourse;
    } catch (error) {
      console.error('Error generating course:', error);
      throw new Error(`Failed to generate course content: ${error.message}`);
    }
  }

  /**
   * Generate course outline with unit structure
   */
  async generateCourseOutline(language, expectedDuration, expertise = 'Beginner') {
    const prompt = `Generate a comprehensive, in-depth course outline for learning ${language} over ${expectedDuration}.

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
- Build upon previous units logically`;

    const text = await this.generateText(prompt, { maxTokens: 2048, temperature: 0.7 });

    return this.parseJSON(text);
  }

  /**
   * Generate a single unit with all its lessons
   */
  async generateUnit(language, unitOutline, unitNumber, expertise = 'Beginner', baseLanguage = 'English') {
    const prompt = `Generate detailed lessons for Unit ${unitNumber} of a ${language} course.

User's Current Level: ${expertise}
User's Base Language (the language they already speak fluently - use this for ALL explanations, translations, and exercise questions): ${baseLanguage}

Unit Info:
- Title: ${unitOutline.title}
- Description: ${unitOutline.description}
- Difficulty: ${unitOutline.difficulty}
- Topics: ${unitOutline.topics.join(', ')}
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
      "keyPhrases": ["phrase 1", "phrase 2", "phrase 3", "phrase 4"],
      "dialogue": [
        {
          "speaker": "Role name fitting the scenario (e.g. Traveler, Local, Waiter, Customer)",
          "text": "Line of dialogue in ${language} (the language being learned)",
          "translation": "${baseLanguage} translation of that exact line"
        }
      ],
      "vocabulary": [
        {
          "word": "word or phrase in ${language} (the language being learned)",
          "translation": "translation in ${baseLanguage} (the user's base language)",
          "pronunciation": "phonetic pronunciation, written so a ${baseLanguage} speaker can read it aloud",
          "example": "example sentence in ${language}, showing the word used naturally"
        }
      ],
      "grammarPoints": [
        {
          "topic": "grammar topic",
          "explanation": "explanation written in ${baseLanguage}, clear enough for a ${baseLanguage} speaker to understand",
          "examples": ["example sentence in ${language} 1", "example sentence in ${language} 2"]
        }
      ],
      "exercises": [
        {
          "type": "multiple_choice",
          "question": "A question written entirely in ${baseLanguage} that gives a ${baseLanguage} definition, context, or translation prompt for ONE specific ${language} word or phrase from this lesson (e.g. \\"Which word means 'water'?\\" or \\"How do you say 'water'?\\", phrased in ${baseLanguage}). The question text itself must contain NO ${language} words other than proper nouns.",
          "options": ["4 candidate words/phrases, ALL written in ${language} - these are what the learner picks between"],
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
- At least 1-2 lessons in this unit MUST be type "conversation"
- Every lesson of type "conversation" MUST have a "dialogue" array with 6-8 turns, alternating between exactly 2 speakers with role names that fit a realistic scenario tied to the unit's topics (e.g. a traveler ordering food, checking into a hotel, asking for directions) - not generic "Person A / Person B" labels. Each turn's "text" must be in ${language}, and "translation" must be in ${baseLanguage}.
- Lessons that are NOT type "conversation" should have "dialogue": [] (empty array)
- LANGUAGE RULE (critical, applies to every lesson): the material being taught (vocabulary words, example sentences, dialogue lines, exercise answer options) is always in ${language}. Everything that explains, translates, or asks about that material (translations, pronunciation guides, grammar explanations, exercise questions) is always in ${baseLanguage}. Never write an exercise question in ${language} - the learner is still acquiring ${language}, so questions must be in ${baseLanguage} they already understand, while the options/answers they pick from must be in ${language} to test what they're learning.
- This rule applies exactly the same way even when ${language} is "English": the learner is acquiring English, ${baseLanguage} is what they already speak fluently. Do NOT default to writing exercise options in English out of habit - the "vocabulary"/"options"/example-sentence language is whichever value ${language} holds (which may itself be "English"), and the "question"/"translation"/"explanation" language is whichever value ${baseLanguage} holds (which may be a language other than English). Before writing each field, check which of the two variables it belongs to.
- Each vocabulary lesson's item count is NOT fixed - size it to what the topic actually requires, decided by you: if the topic is a complete, enumerable set (the alphabet, days of the week, months, numbers 1-20, etc.), include EVERY item in that set, not a sample of it - e.g. a lesson on the alphabet must teach all 26+ letters, never stop partway through. If the topic is open-ended (greetings, common verbs, travel phrases), include a thorough, representative set - at minimum 10 items, more if the topic genuinely calls for it. Never truncate a bounded topic early just to hit a small round number.
- Each grammar lesson MUST have 2-4 comprehensive grammar points with multiple examples
- Include EXACTLY 5 multiple choice questions (MCQ) per lesson
- ALL exercises MUST be type "multiple_choice" with exactly 4 options
- Exercises should test understanding, not just memorization
- Include practical, real-world examples in all content
- Last lesson MUST be type "review" covering all unit topics
- Ensure all JSON arrays and objects are properly closed
- Make content engaging and progressively challenging`;

    // Use retry with backoff to handle rate limits
    return await this.retryWithBackoff(async () => {
      const text = await this.generateText(prompt, { maxTokens: 16384, temperature: 0.7 });
      return this.parseJSON(text);
    });
  }

  /**
   * Parse JSON from AI response with error handling
   */
  parseJSON(text) {
    try {
      console.log('Response length:', text.length, 'characters');

      // Clean the response text
      let cleanText = text.trim();

      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```/g, '').trim();

      // Try to extract JSON from the response
      let jsonMatch = cleanText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        const startIdx = cleanText.indexOf('{');
        const endIdx = cleanText.lastIndexOf('}');

        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          jsonMatch = [cleanText.substring(startIdx, endIdx + 1)];
        }
      }

      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      let data;
      try {
        data = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);

        // Try to fix common JSON issues
        let fixedJson = jsonMatch[0]
          .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
          .replace(/"\s*\n\s*"/g, '" "') // Fix line breaks in strings
          .replace(/([^\\])\n/g, '$1 '); // Remove unescaped newlines

        // If still fails, try to truncate at last valid closing brace
        try {
          data = JSON.parse(fixedJson);
        } catch (secondError) {
          console.error('Second parse attempt failed, trying to auto-close JSON');

          // Find the position of the error and try to close JSON properly
          const errorPos = parseInt(secondError.message.match(/position (\d+)/)?.[1] || '0');
          if (errorPos > 0) {
            let truncated = fixedJson.substring(0, errorPos);
            // Count open braces/brackets and close them
            const openBraces = (truncated.match(/\{/g) || []).length;
            const closeBraces = (truncated.match(/\}/g) || []).length;
            const openBrackets = (truncated.match(/\[/g) || []).length;
            const closeBrackets = (truncated.match(/\]/g) || []).length;

            // Add missing closing characters
            for (let i = 0; i < (openBrackets - closeBrackets); i++) truncated += ']';
            for (let i = 0; i < (openBraces - closeBraces); i++) truncated += '}';

            console.log('Attempting to parse auto-closed JSON');
            data = JSON.parse(truncated);
          } else {
            throw secondError;
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.error('Raw response:', text.substring(0, 500));
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  }

  /**
   * Generate additional exercises for a specific lesson (kept for backward compatibility)
   */
  async generateExercises(lessonTitle, lessonType, language, baseLanguage = 'English') {
    try {
      const prompt = `Generate 5 multiple choice questions (MCQ) for a ${lessonType} lesson titled "${lessonTitle}" in ${language}.

The learner's base language (the language they already speak fluently) is ${baseLanguage}.

IMPORTANT REQUIREMENTS:
- ALL exercises MUST be "multiple_choice" type only
- Each question MUST have exactly 4 options
- Questions should test understanding of the lesson content
- Options should be plausible to make questions challenging
- correctAnswer must be the index (0-3) of the correct option
- LANGUAGE RULE (critical): the "question" MUST be written entirely in ${baseLanguage}, giving a ${baseLanguage} definition/context/translation prompt for one ${language} word or phrase (e.g. "Which word means 'water'?" phrased in ${baseLanguage}) - it must contain no ${language} words other than proper nouns. The "options" MUST be written in ${language}, the language being learned. This applies exactly the same way even when ${language} is "English": do not default to writing options in English out of habit - options go in whichever language ${language} names (even if that's English), and the question goes in whichever language ${baseLanguage} names (which may not be English). Check which variable each field belongs to before writing it.

Provide the response in this EXACT JSON format:
{
  "exercises": [
    {
      "type": "multiple_choice",
      "question": "Exercise question in ${baseLanguage}",
      "options": ["4 options in ${language}"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of the answer, written in ${baseLanguage}"
    }
  ]
}

Make sure to generate exactly 5 exercises.`;

      // Use retry with backoff to handle rate limits
      return await this.retryWithBackoff(async () => {
        const text = await this.generateText(prompt, { maxTokens: 2048, temperature: 0.7 });
        return this.parseJSON(text);
      });
    } catch (error) {
      console.error('Error generating exercises:', error);
      throw new Error('Failed to generate exercises');
    }
  }
}

export default new OpenAIService();
