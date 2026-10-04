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

Level definitions - use these literally, do not assume the learner knows more than this:
- Beginner: has little to no prior knowledge of ${language}. Assume they know close to ZERO vocabulary, grammar or idioms in ${language} at the very start of Unit 1.
- Intermediate: already knows basic vocabulary, simple present/past tense, and can hold short simple conversations, but struggles with complex grammar, idioms and nuance.
- Advanced: is fluent in everyday use and is refining nuance, idiom, register and cultural depth.

This should be a professional, Duolingo-quality curriculum designed for someone who is currently at ${expertise} level. The FIRST unit must match that starting point exactly - never open with content meant for a higher level than ${expertise}.
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
- Create 6 units with difficulty that genuinely progresses, starting exactly at ${expertise} level
- If user is Beginner: Unit 1 MUST cover true fundamentals only - greetings, introducing yourself, numbers, everyday nouns, simple present-tense sentences and pronunciation. Do NOT make Unit 1 (or any early unit) a "review"/"reinforcement of intermediate concepts" unit, and do NOT lead with idioms, complex tenses, or conversational fillers - those belong later, once basics are covered. Progress unit-by-unit toward Elementary, then Intermediate by unit 6.
- If user is Intermediate: Start with a quick review of basics, then advance to upper-Intermediate/Advanced concepts
- If user is Advanced: Focus on mastery, nuanced expressions, and cultural depth
- Each unit's "difficulty" field must reflect real progression across the 6 units (e.g. for a Beginner course: Beginner, Beginner, Elementary, Elementary, Intermediate, Intermediate) - never label an early unit with a difficulty above ${expertise}
- Each unit should have 6 lessons
- Topics should be practical and relevant to real-world communication
- Cover: vocabulary, grammar, conversation, pronunciation, and cultural context
- Build upon previous units logically, never introducing a concept before its prerequisite`;

    const text = await this.generateText(prompt, { maxTokens: 2048, temperature: 0.7 });

    return this.parseJSON(text);
  }

  /**
   * Generate a single unit. Plans the unit's lessons first, then generates each
   * lesson on its own call and checks it against the content contract.
   */
  async generateUnit(language, unitOutline, unitNumber, expertise = 'Beginner', baseLanguage = 'English') {
    const plan = await this.generateLessonPlan(language, unitOutline, unitNumber, expertise);

    const lessons = [];
    for (let i = 0; i < plan.length; i++) {
      const lesson = await this.generateLesson(language, unitOutline, unitNumber, plan[i], i + 1, expertise, baseLanguage);
      lessons.push(lesson);
    }

    return {
      id: unitNumber,
      title: unitOutline.title,
      description: unitOutline.description,
      difficulty: unitOutline.difficulty,
      estimatedTime: unitOutline.estimatedTime,
      lessons,
    };
  }

  /**
   * Plan the lesson titles and types for one unit (small call, no lesson content yet)
   */
  async generateLessonPlan(language, unitOutline, unitNumber, expertise) {
    const count = unitOutline.lessonCount || 6;

    const prompt = `Plan the ${count} lessons for Unit ${unitNumber} of a ${language} course for a learner at ${expertise} level.

Unit: ${unitOutline.title}
Description: ${unitOutline.description}
Topics: ${unitOutline.topics.join(', ')}
Unit difficulty: ${unitOutline.difficulty}

Respond with ONLY valid JSON in this format:
{ "lessons": [ { "title": "Lesson title", "type": "vocabulary|grammar|conversation|review", "description": "What this lesson covers" } ] }

Rules:
- Exactly ${count} lessons
- At least 2 lessons of type "vocabulary", at least 1 of type "grammar", at least 1 of type "conversation"
- The LAST lesson must be type "review" covering this unit's topics
- Respect the ${expertise} level: a Beginner unit only uses basic, everyday material - no idioms, no complex tenses
- Each lesson builds on the one before it`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      const parsed = await this.retryWithBackoff(async () =>
        this.parseJSON(await this.generateText(prompt, { maxTokens: 1024, temperature: 0.5 }))
      );
      const lessons = Array.isArray(parsed.lessons) ? parsed.lessons.slice(0, count) : [];
      if (lessons.length === count) return lessons;
      console.warn(`Unit ${unitNumber} plan attempt ${attempt} returned ${lessons.length}/${count} lessons`);
    }
    throw new Error(`Could not plan ${count} lessons for unit ${unitNumber}`);
  }

  /**
   * Generate one lesson, validate it against the content contract, and retry once
   * with the specific problems listed if anything is missing or thin.
   */
  async generateLesson(language, unitOutline, unitNumber, planned, lessonNumber, expertise, baseLanguage) {
    const basePrompt = this.buildLessonPrompt(language, unitOutline, unitNumber, planned, expertise, baseLanguage);
    const maxAttempts = 3;

    let lesson = null;
    let problems = ['no response yet'];

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const prompt = attempt === 1 || problems.length === 0
        ? basePrompt
        : `${basePrompt}\n\nYOUR PREVIOUS ATTEMPT HAD THESE PROBLEMS - FIX ALL OF THEM:\n${problems.map((p) => `- ${p}`).join('\n')}`;
      // Lower temperature on later attempts - fewer malformed responses
      const temperature = attempt === 1 ? 0.7 : 0.4;

      try {
        lesson = await this.retryWithBackoff(async () =>
          this.parseJSON(await this.generateText(prompt, { maxTokens: 6000, temperature }))
        );
        problems = this.validateLesson(lesson, planned.type);
      } catch (error) {
        lesson = null;
        problems = [`response was not valid JSON (${error.message})`];
      }

      if (problems.length === 0) break;
      console.warn(`Unit ${unitNumber} lesson ${lessonNumber} attempt ${attempt} incomplete:`, problems);
    }

    // Never let one bad lesson fail the whole course. If every attempt failed, save a
    // clearly-marked placeholder so the rest of the course still generates.
    if (!lesson) {
      console.error(`Unit ${unitNumber} lesson ${lessonNumber} failed after ${maxAttempts} attempts - saving placeholder`);
      return {
        id: lessonNumber,
        title: planned.title,
        type: planned.type,
        description: planned.description,
        keyPhrases: [],
        dialogue: [],
        vocabulary: [],
        grammarPoints: [],
        exercises: [],
        pronunciation: [],
        commonMistakes: [],
        culture: '',
        reading: { passage: '', questions: [] },
        speakingPrompts: [],
        recall: [],
        estimatedDuration: 20,
        xpReward: 50,
        contentComplete: false,
        contentWarnings: problems,
      };
    }

    lesson.id = lessonNumber;
    lesson.title = planned.title;
    lesson.type = planned.type;
    lesson.contentComplete = problems.length === 0;
    if (problems.length > 0) lesson.contentWarnings = problems;
    return lesson;
  }

  /**
   * Content contract: every lesson must have these sections. Returns a list of
   * human-readable problems (empty list = lesson is complete).
   */
  validateLesson(lesson, type) {
    const problems = [];
    const arr = (v) => (Array.isArray(v) ? v : []);
    const vocab = arr(lesson.vocabulary);
    const grammar = arr(lesson.grammarPoints);
    const dialogue = arr(lesson.dialogue);
    const exercises = arr(lesson.exercises);
    const pronunciation = arr(lesson.pronunciation);
    const mistakes = arr(lesson.commonMistakes);
    const speaking = arr(lesson.speakingPrompts);
    const recall = arr(lesson.recall);
    const reading = lesson.reading || {};
    const readingQuestions = arr(reading.questions);

    if (type === 'vocabulary' && vocab.length < 10) problems.push(`vocabulary has ${vocab.length} items, needs at least 10`);
    if (type !== 'vocabulary' && vocab.length < 3) problems.push(`vocabulary has ${vocab.length} items, needs at least 3 key terms`);
    if (type === 'grammar' && grammar.length < 2) problems.push(`grammarPoints has ${grammar.length}, needs 2-3`);
    if (type !== 'grammar' && type !== 'review' && grammar.length < 1) problems.push('grammarPoints is empty, needs at least 1');
    if (type === 'conversation' && dialogue.length < 6) problems.push(`dialogue has ${dialogue.length} turns, needs 6-8`);

    if (exercises.length !== 5) problems.push(`exercises has ${exercises.length}, needs exactly 5`);
    exercises.forEach((ex, i) => {
      if (!Array.isArray(ex.options) || ex.options.length !== 4) problems.push(`exercise ${i + 1} must have exactly 4 options`);
      if (!(Number.isInteger(ex.correctAnswer) && ex.correctAnswer >= 0 && ex.correctAnswer <= 3)) problems.push(`exercise ${i + 1} correctAnswer must be 0-3`);
    });

    if (pronunciation.length < 2) problems.push(`pronunciation has ${pronunciation.length}, needs at least 2 tips`);
    if (mistakes.length < 2) problems.push(`commonMistakes has ${mistakes.length}, needs at least 2`);
    if (!lesson.culture || typeof lesson.culture !== 'string') problems.push('culture note is missing');
    if (!reading.passage || readingQuestions.length < 2) problems.push('reading needs a passage and at least 2 questions');
    if (speaking.length < 3) problems.push(`speakingPrompts has ${speaking.length}, needs 3`);
    if (recall.length < 3) problems.push(`recall has ${recall.length}, needs 3`);

    return problems;
  }

  /**
   * Prompt for ONE lesson. Language rules and level calibration are kept from the
   * previous unit prompt - only the scope is now a single lesson.
   */
  buildLessonPrompt(language, unitOutline, unitNumber, planned, expertise, baseLanguage) {
    return `Write the full content for ONE lesson of a ${language} course.

Lesson: "${planned.title}" (type: ${planned.type})
Lesson description: ${planned.description}
Unit ${unitNumber}: ${unitOutline.title} - ${unitOutline.description}
Unit difficulty: ${unitOutline.difficulty}
Learner's overall starting level: ${expertise}
Learner's base language (already spoken fluently - used for ALL explanations, translations, and exercise questions): ${baseLanguage}

LEVEL: calibrate vocabulary and grammar to THIS lesson's unit difficulty (${unitOutline.difficulty}). A Beginner lesson uses only simple, everyday words and basic grammar. Do not assume knowledge the learner would not have yet.

LANGUAGE RULE (critical):
- Material being taught (vocabulary words, example sentences, dialogue lines, passage text, speaking targets, exercise answer options) is in ${language}.
- Everything that explains, translates, or asks about that material (translations, pronunciation guides, grammar explanations, culture note, exercise questions, reading questions, recall questions, speaking prompt instructions) is in ${baseLanguage}.
- This applies the same way when ${language} is English: check which variable each field belongs to before writing it.

Respond with ONLY valid JSON in exactly this shape:
{
  "description": "one sentence on what this lesson covers",
  "keyPhrases": ["4-6 key phrases in ${language}"],
  "dialogue": [ { "speaker": "role name fitting the scenario", "text": "line in ${language}", "translation": "line in ${baseLanguage}" } ],
  "vocabulary": [ { "word": "in ${language}", "translation": "in ${baseLanguage}", "pronunciation": "readable by a ${baseLanguage} speaker", "example": "sentence in ${language}" } ],
  "grammarPoints": [ { "topic": "grammar topic", "explanation": "in ${baseLanguage}", "examples": ["sentence in ${language}", "sentence in ${language}", "sentence in ${language}"], "commonMistake": "a mistake learners make with this point, in ${baseLanguage}, and the correct form" } ],
  "pronunciation": [ { "sound": "a sound or pattern that is hard for a ${baseLanguage} speaker", "tip": "how to produce it, in ${baseLanguage}", "examples": ["words in ${language}"] } ],
  "commonMistakes": [ { "mistake": "what learners typically say, in ${language}", "correction": "the correct version in ${language}", "why": "short reason, in ${baseLanguage}" } ],
  "culture": "one practical cultural note about using this language in real life, in ${baseLanguage}",
  "reading": { "passage": "short passage (4-6 sentences) in ${language} using this lesson's words", "questions": [ { "question": "in ${baseLanguage}", "options": ["4 options in ${language}"], "correctAnswer": 0 } ] },
  "speakingPrompts": ["3 instructions in ${baseLanguage} asking the learner to say something specific in ${language}, e.g. 'Introduce yourself using Me llamo...'"],
  "recall": [ { "question": "question in ${baseLanguage} to test this lesson's content later", "answer": "answer in ${language}" } ],
  "exercises": [ { "type": "multiple_choice", "question": "in ${baseLanguage}", "options": ["4 options in ${language}"], "correctAnswer": 0 } ],
  "estimatedDuration": 20,
  "xpReward": 50
}

REQUIREMENTS:
- vocabulary: ${planned.type === 'vocabulary' ? 'AT LEAST 10 items. For an enumerable set (numbers, days, alphabet) include every item in the set.' : 'at least 3 key terms used in this lesson'}
- grammarPoints: ${planned.type === 'grammar' ? 'exactly 2-3 points, each with 3 examples' : 'at least 1 point the lesson relies on'}
- dialogue: ${planned.type === 'conversation' ? '6-8 turns alternating between exactly 2 speakers in a realistic scenario' : 'empty array []'}
- exercises: EXACTLY 5 multiple_choice questions with 4 options each. Test understanding, not just memorisation.
- pronunciation: at least 2 tips. commonMistakes: at least 2. speakingPrompts: exactly 3. recall: exactly 3. reading: a passage plus exactly 2 questions.
- JSON SAFETY: never put a double quote character inside a text value. For any quoted word inside text, use single quotes instead (e.g. 'Good morning').
- Use practical, real-world content. Ensure all JSON is valid and closed.`;
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
