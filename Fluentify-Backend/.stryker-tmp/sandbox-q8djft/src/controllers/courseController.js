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
import geminiService from '../services/geminiService.js';
import courseRepository from '../repositories/courseRepository.js';
import progressRepository from '../repositories/progressRepository.js';
import analyticsService from '../services/analyticsService.js';
import { successResponse, createdResponse, listResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';
class CourseController {
  /**
   * Generate a new course for a learner (streaming with SSE)
   */
  async generateCourseStream(req, res, next) {
    if (stryMutAct_9fa48("854")) {
      {}
    } else {
      stryCov_9fa48("854");
      try {
        if (stryMutAct_9fa48("855")) {
          {}
        } else {
          stryCov_9fa48("855");
          const {
            language,
            expectedDuration,
            expertise = stryMutAct_9fa48("856") ? "" : (stryCov_9fa48("856"), 'Beginner')
          } = req.query;
          const userId = req.user.id;
          console.log(stryMutAct_9fa48("857") ? "" : (stryCov_9fa48("857"), '📥 Starting streaming course generation...'));
          console.log(stryMutAct_9fa48("858") ? "" : (stryCov_9fa48("858"), '🌍 Language:'), language);
          console.log(stryMutAct_9fa48("859") ? "" : (stryCov_9fa48("859"), '⏱️  Duration:'), expectedDuration);
          console.log(stryMutAct_9fa48("860") ? "" : (stryCov_9fa48("860"), '🎓 Expertise:'), expertise);
          if (stryMutAct_9fa48("863") ? !language && !expectedDuration : stryMutAct_9fa48("862") ? false : stryMutAct_9fa48("861") ? true : (stryCov_9fa48("861", "862", "863"), (stryMutAct_9fa48("864") ? language : (stryCov_9fa48("864"), !language)) || (stryMutAct_9fa48("865") ? expectedDuration : (stryCov_9fa48("865"), !expectedDuration)))) {
            if (stryMutAct_9fa48("866")) {
              {}
            } else {
              stryCov_9fa48("866");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Allow multiple courses for same language with different duration/expertise
          // Users can create multiple courses!

          // Set up SSE headers
          res.setHeader(stryMutAct_9fa48("867") ? "" : (stryCov_9fa48("867"), 'Content-Type'), stryMutAct_9fa48("868") ? "" : (stryCov_9fa48("868"), 'text/event-stream'));
          res.setHeader(stryMutAct_9fa48("869") ? "" : (stryCov_9fa48("869"), 'Cache-Control'), stryMutAct_9fa48("870") ? "" : (stryCov_9fa48("870"), 'no-cache'));
          res.setHeader(stryMutAct_9fa48("871") ? "" : (stryCov_9fa48("871"), 'Connection'), stryMutAct_9fa48("872") ? "" : (stryCov_9fa48("872"), 'keep-alive'));
          res.flushHeaders();

          // Helper function to send SSE events
          const sendEvent = (event, data) => {
            if (stryMutAct_9fa48("873")) {
              {}
            } else {
              stryCov_9fa48("873");
              res.write(stryMutAct_9fa48("874") ? `` : (stryCov_9fa48("874"), `event: ${event}\n`));
              res.write(stryMutAct_9fa48("875") ? `` : (stryCov_9fa48("875"), `data: ${JSON.stringify(data)}\n\n`));
            }
          };
          console.log(stryMutAct_9fa48("876") ? `` : (stryCov_9fa48("876"), `🚀 Generating course outline...`));

          // Generate course outline first with expertise level
          const outline = await geminiService.generateCourseOutline(language, expectedDuration, expertise);

          // Create initial course record in database
          const courseData = stryMutAct_9fa48("877") ? {} : (stryCov_9fa48("877"), {
            course: stryMutAct_9fa48("878") ? {} : (stryCov_9fa48("878"), {
              title: stryMutAct_9fa48("879") ? `` : (stryCov_9fa48("879"), `${language} Learning Journey`),
              language: language,
              duration: expectedDuration,
              totalLessons: 0,
              generatedAt: new Date().toISOString(),
              version: stryMutAct_9fa48("880") ? "" : (stryCov_9fa48("880"), '1.0'),
              units: stryMutAct_9fa48("881") ? ["Stryker was here"] : (stryCov_9fa48("881"), [])
            }),
            metadata: stryMutAct_9fa48("882") ? {} : (stryCov_9fa48("882"), {
              language,
              totalUnits: outline.units.length,
              totalLessons: 0,
              estimatedTotalTime: 0,
              createdBy: stryMutAct_9fa48("883") ? "" : (stryCov_9fa48("883"), 'ai')
            })
          });
          const courseId = await courseRepository.createCourse(userId, language, expectedDuration, courseData);

          // Initialize progress (unlock first unit)
          await progressRepository.initializeCourseProgress(courseId, userId);

          // Send course created event
          sendEvent(stryMutAct_9fa48("884") ? "" : (stryCov_9fa48("884"), 'course_created'), stryMutAct_9fa48("885") ? {} : (stryCov_9fa48("885"), {
            courseId,
            language,
            totalUnits: outline.units.length,
            message: stryMutAct_9fa48("886") ? "" : (stryCov_9fa48("886"), 'Course created, generating units...')
          }));
          console.log(stryMutAct_9fa48("887") ? `` : (stryCov_9fa48("887"), `Course ${courseId} created, generating ${outline.units.length} units...`));
          const units = stryMutAct_9fa48("888") ? ["Stryker was here"] : (stryCov_9fa48("888"), []);
          let totalLessons = 0;
          let totalTime = 0;

          // Generate each unit one by one
          for (let i = 0; stryMutAct_9fa48("891") ? i >= outline.units.length : stryMutAct_9fa48("890") ? i <= outline.units.length : stryMutAct_9fa48("889") ? false : (stryCov_9fa48("889", "890", "891"), i < outline.units.length); stryMutAct_9fa48("892") ? i-- : (stryCov_9fa48("892"), i++)) {
            if (stryMutAct_9fa48("893")) {
              {}
            } else {
              stryCov_9fa48("893");
              const unitOutline = outline.units[i];

              // Send unit generating event
              sendEvent(stryMutAct_9fa48("894") ? "" : (stryCov_9fa48("894"), 'unit_generating'), stryMutAct_9fa48("895") ? {} : (stryCov_9fa48("895"), {
                unitNumber: stryMutAct_9fa48("896") ? i - 1 : (stryCov_9fa48("896"), i + 1),
                totalUnits: outline.units.length,
                title: unitOutline.title,
                message: stryMutAct_9fa48("897") ? `` : (stryCov_9fa48("897"), `Generating Unit ${stryMutAct_9fa48("898") ? i - 1 : (stryCov_9fa48("898"), i + 1)}: ${unitOutline.title}...`)
              }));
              console.log(stryMutAct_9fa48("899") ? `` : (stryCov_9fa48("899"), `  📝 Generating Unit ${stryMutAct_9fa48("900") ? i - 1 : (stryCov_9fa48("900"), i + 1)}: ${unitOutline.title}...`));

              // Generate the unit content with expertise level
              const unit = await geminiService.generateUnit(language, unitOutline, stryMutAct_9fa48("901") ? i - 1 : (stryCov_9fa48("901"), i + 1), expertise);
              units.push(unit);
              stryMutAct_9fa48("902") ? totalLessons -= unit.lessons.length : (stryCov_9fa48("902"), totalLessons += unit.lessons.length);
              stryMutAct_9fa48("903") ? totalTime -= parseInt(unit.estimatedTime) || 150 : (stryCov_9fa48("903"), totalTime += stryMutAct_9fa48("906") ? parseInt(unit.estimatedTime) && 150 : stryMutAct_9fa48("905") ? false : stryMutAct_9fa48("904") ? true : (stryCov_9fa48("904", "905", "906"), parseInt(unit.estimatedTime) || 150));

              // Update course data with new unit
              courseData.course.units = units;
              courseData.course.totalLessons = totalLessons;
              courseData.metadata.totalLessons = totalLessons;
              courseData.metadata.estimatedTotalTime = totalTime;

              // Save unit to database immediately
              await courseRepository.updateCourseData(courseId, courseData);
              await courseRepository.populateCourseStructure(courseId, stryMutAct_9fa48("907") ? {} : (stryCov_9fa48("907"), {
                course: stryMutAct_9fa48("908") ? {} : (stryCov_9fa48("908"), {
                  units: stryMutAct_9fa48("909") ? [] : (stryCov_9fa48("909"), [unit])
                })
              }));

              // Send unit generated event
              sendEvent(stryMutAct_9fa48("910") ? "" : (stryCov_9fa48("910"), 'unit_generated'), stryMutAct_9fa48("911") ? {} : (stryCov_9fa48("911"), {
                unitNumber: stryMutAct_9fa48("912") ? i - 1 : (stryCov_9fa48("912"), i + 1),
                totalUnits: outline.units.length,
                unit: unit,
                progress: stryMutAct_9fa48("913") ? `` : (stryCov_9fa48("913"), `${stryMutAct_9fa48("914") ? i - 1 : (stryCov_9fa48("914"), i + 1)}/${outline.units.length}`),
                message: stryMutAct_9fa48("915") ? `` : (stryCov_9fa48("915"), `Unit ${stryMutAct_9fa48("916") ? i - 1 : (stryCov_9fa48("916"), i + 1)} completed!`)
              }));
              console.log(stryMutAct_9fa48("917") ? `` : (stryCov_9fa48("917"), `  ✅ Unit ${stryMutAct_9fa48("918") ? i - 1 : (stryCov_9fa48("918"), i + 1)} saved to database`));

              // Add delay between units to avoid rate limiting (except after last unit)
              if (stryMutAct_9fa48("922") ? i >= outline.units.length - 1 : stryMutAct_9fa48("921") ? i <= outline.units.length - 1 : stryMutAct_9fa48("920") ? false : stryMutAct_9fa48("919") ? true : (stryCov_9fa48("919", "920", "921", "922"), i < (stryMutAct_9fa48("923") ? outline.units.length + 1 : (stryCov_9fa48("923"), outline.units.length - 1)))) {
                if (stryMutAct_9fa48("924")) {
                  {}
                } else {
                  stryCov_9fa48("924");
                  console.log(stryMutAct_9fa48("925") ? "" : (stryCov_9fa48("925"), '  ⏳ Waiting 3 seconds before next unit to avoid rate limits...'));
                  await new Promise(stryMutAct_9fa48("926") ? () => undefined : (stryCov_9fa48("926"), resolve => setTimeout(resolve, 3000)));
                }
              }
            }
          }

          // Send course complete event
          sendEvent(stryMutAct_9fa48("927") ? "" : (stryCov_9fa48("927"), 'course_complete'), stryMutAct_9fa48("928") ? {} : (stryCov_9fa48("928"), {
            courseId,
            language,
            totalUnits: units.length,
            totalLessons,
            estimatedTotalTime: totalTime,
            message: stryMutAct_9fa48("929") ? "" : (stryCov_9fa48("929"), 'Course generation complete!')
          }));
          console.log(stryMutAct_9fa48("930") ? `` : (stryCov_9fa48("930"), `🎉 Course ${courseId} generation complete!`));

          // Track AI course generation for analytics
          try {
            if (stryMutAct_9fa48("931")) {
              {}
            } else {
              stryCov_9fa48("931");
              await analyticsService.trackAIGeneration(userId, language, stryMutAct_9fa48("932") ? false : (stryCov_9fa48("932"), true), // success
              stryMutAct_9fa48("933") ? {} : (stryCov_9fa48("933"), {
                courseId,
                unitsGenerated: units.length,
                lessonsGenerated: totalLessons
              }));
            }
          } catch (analyticsError) {
            if (stryMutAct_9fa48("934")) {
              {}
            } else {
              stryCov_9fa48("934");
              console.error(stryMutAct_9fa48("935") ? "" : (stryCov_9fa48("935"), 'Error tracking AI generation analytics:'), analyticsError);
              // Don't fail the course generation if analytics fails
            }
          }
          res.end();
        }
      } catch (error) {
        if (stryMutAct_9fa48("936")) {
          {}
        } else {
          stryCov_9fa48("936");
          console.error(stryMutAct_9fa48("937") ? "" : (stryCov_9fa48("937"), 'Error in streaming course generation:'), error);

          // Track failed AI generation for analytics (only if userId and language are available)
          try {
            if (stryMutAct_9fa48("938")) {
              {}
            } else {
              stryCov_9fa48("938");
              const userId = stryMutAct_9fa48("939") ? req.user.id : (stryCov_9fa48("939"), req.user?.id);
              const language = stryMutAct_9fa48("940") ? req.query.language : (stryCov_9fa48("940"), req.query?.language);
              if (stryMutAct_9fa48("943") ? userId || language : stryMutAct_9fa48("942") ? false : stryMutAct_9fa48("941") ? true : (stryCov_9fa48("941", "942", "943"), userId && language)) {
                if (stryMutAct_9fa48("944")) {
                  {}
                } else {
                  stryCov_9fa48("944");
                  await analyticsService.trackAIGeneration(userId, language, stryMutAct_9fa48("945") ? true : (stryCov_9fa48("945"), false), // success = false
                  stryMutAct_9fa48("946") ? {} : (stryCov_9fa48("946"), {
                    errorMessage: error.message
                  }));
                }
              }
            }
          } catch (analyticsError) {
            if (stryMutAct_9fa48("947")) {
              {}
            } else {
              stryCov_9fa48("947");
              console.error(stryMutAct_9fa48("948") ? "" : (stryCov_9fa48("948"), 'Error tracking failed AI generation analytics:'), analyticsError);
            }
          }

          // Send error event with better message
          const errorMessage = (stryMutAct_9fa48("951") ? error.message.includes('429') && error.message.includes('Too Many Requests') : stryMutAct_9fa48("950") ? false : stryMutAct_9fa48("949") ? true : (stryCov_9fa48("949", "950", "951"), error.message.includes(stryMutAct_9fa48("952") ? "" : (stryCov_9fa48("952"), '429')) || error.message.includes(stryMutAct_9fa48("953") ? "" : (stryCov_9fa48("953"), 'Too Many Requests')))) ? stryMutAct_9fa48("954") ? "" : (stryCov_9fa48("954"), 'API rate limit exceeded. Please wait a few minutes and try again.') : error.message;
          res.write(stryMutAct_9fa48("955") ? `` : (stryCov_9fa48("955"), `event: error\n`));
          res.write(stryMutAct_9fa48("956") ? `` : (stryCov_9fa48("956"), `data: ${JSON.stringify(stryMutAct_9fa48("957") ? {} : (stryCov_9fa48("957"), {
            message: errorMessage
          }))}\n\n`));
          res.end();
        }
      }
    }
  }

  /**
   * Generate a new course for a learner (legacy - non-streaming)
   */
  async generateCourse(req, res, next) {
    if (stryMutAct_9fa48("958")) {
      {}
    } else {
      stryCov_9fa48("958");
      try {
        if (stryMutAct_9fa48("959")) {
          {}
        } else {
          stryCov_9fa48("959");
          const {
            language,
            expectedDuration,
            expertise = stryMutAct_9fa48("960") ? "" : (stryCov_9fa48("960"), 'Beginner')
          } = req.body;
          const userId = req.user.id;
          console.log(stryMutAct_9fa48("961") ? "" : (stryCov_9fa48("961"), '📥 Received request body:'), req.body);
          console.log(stryMutAct_9fa48("962") ? "" : (stryCov_9fa48("962"), '🌍 Language:'), language);
          console.log(stryMutAct_9fa48("963") ? "" : (stryCov_9fa48("963"), '⏱️  Duration:'), expectedDuration);
          console.log(stryMutAct_9fa48("964") ? "" : (stryCov_9fa48("964"), '🎓 Expertise:'), expertise);
          if (stryMutAct_9fa48("967") ? !language || !expectedDuration : stryMutAct_9fa48("966") ? false : stryMutAct_9fa48("965") ? true : (stryCov_9fa48("965", "966", "967"), (stryMutAct_9fa48("968") ? language : (stryCov_9fa48("968"), !language)) && (stryMutAct_9fa48("969") ? expectedDuration : (stryCov_9fa48("969"), !expectedDuration)))) {
            if (stryMutAct_9fa48("970")) {
              {}
            } else {
              stryCov_9fa48("970");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }
          if (stryMutAct_9fa48("973") ? false : stryMutAct_9fa48("972") ? true : stryMutAct_9fa48("971") ? language : (stryCov_9fa48("971", "972", "973"), !language)) {
            if (stryMutAct_9fa48("974")) {
              {}
            } else {
              stryCov_9fa48("974");
              throw ERRORS.LANGUAGE_REQUIRED;
            }
          }
          if (stryMutAct_9fa48("977") ? false : stryMutAct_9fa48("976") ? true : stryMutAct_9fa48("975") ? expectedDuration : (stryCov_9fa48("975", "976", "977"), !expectedDuration)) {
            if (stryMutAct_9fa48("978")) {
              {}
            } else {
              stryCov_9fa48("978");
              throw ERRORS.DURATION_REQUIRED;
            }
          }

          // Allow multiple courses for same language with different duration/expertise
          // Users can create multiple courses!

          console.log(stryMutAct_9fa48("979") ? `` : (stryCov_9fa48("979"), `🚀 Starting course generation for ${language}...`));

          // Generate course content using Gemini with expertise level
          const courseData = await geminiService.generateCourse(language, expectedDuration, expertise);
          console.log(stryMutAct_9fa48("980") ? "" : (stryCov_9fa48("980"), 'Saving course to database...'));

          // Save course to database with course_data
          const courseId = await courseRepository.createCourse(userId, language, expectedDuration, courseData);

          // Initialize progress (unlock first unit)
          await progressRepository.initializeCourseProgress(courseId, userId);
          console.log(stryMutAct_9fa48("981") ? `` : (stryCov_9fa48("981"), `Course created successfully with ID: ${courseId}`));
          res.json(createdResponse(stryMutAct_9fa48("982") ? {} : (stryCov_9fa48("982"), {
            id: courseId,
            language: language,
            title: courseData.course.title,
            totalUnits: courseData.metadata.totalUnits,
            totalLessons: courseData.metadata.totalLessons,
            estimatedTotalTime: courseData.metadata.estimatedTotalTime
          }), stryMutAct_9fa48("983") ? "" : (stryCov_9fa48("983"), 'Course generated successfully!')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("984")) {
          {}
        } else {
          stryCov_9fa48("984");
          console.error(stryMutAct_9fa48("985") ? "" : (stryCov_9fa48("985"), 'Error generating course:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get learner's courses
   */
  async getLearnerCourses(req, res, next) {
    if (stryMutAct_9fa48("986")) {
      {}
    } else {
      stryCov_9fa48("986");
      try {
        if (stryMutAct_9fa48("987")) {
          {}
        } else {
          stryCov_9fa48("987");
          const userId = req.user.id;
          const courses = await courseRepository.findLearnerCoursesWithStats(userId);
          const coursesWithDetails = courses.map(course => {
            if (stryMutAct_9fa48("988")) {
              {}
            } else {
              stryCov_9fa48("988");
              return stryMutAct_9fa48("989") ? {} : (stryCov_9fa48("989"), {
                id: course.id,
                language: course.language,
                title: stryMutAct_9fa48("992") ? course.title && `${course.language} Course` : stryMutAct_9fa48("991") ? false : stryMutAct_9fa48("990") ? true : (stryCov_9fa48("990", "991", "992"), course.title || (stryMutAct_9fa48("993") ? `` : (stryCov_9fa48("993"), `${course.language} Course`))),
                description: course.description,
                expectedDuration: course.expected_duration,
                totalUnits: stryMutAct_9fa48("996") ? course.total_units && 0 : stryMutAct_9fa48("995") ? false : stryMutAct_9fa48("994") ? true : (stryCov_9fa48("994", "995", "996"), course.total_units || 0),
                totalLessons: stryMutAct_9fa48("999") ? course.total_lessons && 0 : stryMutAct_9fa48("998") ? false : stryMutAct_9fa48("997") ? true : (stryCov_9fa48("997", "998", "999"), course.total_lessons || 0),
                estimatedTotalTime: stryMutAct_9fa48("1002") ? course.estimated_total_time && 0 : stryMutAct_9fa48("1001") ? false : stryMutAct_9fa48("1000") ? true : (stryCov_9fa48("1000", "1001", "1002"), course.estimated_total_time || 0),
                createdAt: course.created_at,
                progress: stryMutAct_9fa48("1003") ? {} : (stryCov_9fa48("1003"), {
                  totalXp: stryMutAct_9fa48("1006") ? course.total_xp && 0 : stryMutAct_9fa48("1005") ? false : stryMutAct_9fa48("1004") ? true : (stryCov_9fa48("1004", "1005", "1006"), course.total_xp || 0),
                  lessonsCompleted: stryMutAct_9fa48("1009") ? course.lessons_completed && 0 : stryMutAct_9fa48("1008") ? false : stryMutAct_9fa48("1007") ? true : (stryCov_9fa48("1007", "1008", "1009"), course.lessons_completed || 0),
                  unitsCompleted: stryMutAct_9fa48("1012") ? course.units_completed && 0 : stryMutAct_9fa48("1011") ? false : stryMutAct_9fa48("1010") ? true : (stryCov_9fa48("1010", "1011", "1012"), course.units_completed || 0),
                  currentStreak: stryMutAct_9fa48("1015") ? course.current_streak && 0 : stryMutAct_9fa48("1014") ? false : stryMutAct_9fa48("1013") ? true : (stryCov_9fa48("1013", "1014", "1015"), course.current_streak || 0),
                  progressPercentage: stryMutAct_9fa48("1018") ? course.progress_percentage && 0 : stryMutAct_9fa48("1017") ? false : stryMutAct_9fa48("1016") ? true : (stryCov_9fa48("1016", "1017", "1018"), course.progress_percentage || 0)
                })
              });
            }
          });
          res.json(listResponse(coursesWithDetails, stryMutAct_9fa48("1019") ? "" : (stryCov_9fa48("1019"), 'Courses retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1020")) {
          {}
        } else {
          stryCov_9fa48("1020");
          console.error(stryMutAct_9fa48("1021") ? "" : (stryCov_9fa48("1021"), 'Error fetching courses:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get specific course details with progress
   */
  async getCourseDetails(req, res, next) {
    if (stryMutAct_9fa48("1022")) {
      {}
    } else {
      stryCov_9fa48("1022");
      try {
        if (stryMutAct_9fa48("1023")) {
          {}
        } else {
          stryCov_9fa48("1023");
          const {
            courseId
          } = req.params;
          const userId = req.user.id;
          // Get course data
          const course = await courseRepository.findCourseById(courseId, userId);
          if (stryMutAct_9fa48("1026") ? false : stryMutAct_9fa48("1025") ? true : stryMutAct_9fa48("1024") ? course : (stryCov_9fa48("1024", "1025", "1026"), !course)) {
            if (stryMutAct_9fa48("1027")) {
              {}
            } else {
              stryCov_9fa48("1027");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }

          // Parse course data
          let courseData;
          try {
            if (stryMutAct_9fa48("1028")) {
              {}
            } else {
              stryCov_9fa48("1028");
              courseData = course.course_data;
            }
          } catch (parseError) {
            if (stryMutAct_9fa48("1029")) {
              {}
            } else {
              stryCov_9fa48("1029");
              console.error(stryMutAct_9fa48("1030") ? "" : (stryCov_9fa48("1030"), 'Error parsing course_data:'), parseError);
              throw ERRORS.INVALID_COURSE_DATA;
            }
          }

          // Get unit progress
          const unitProgressResult = await progressRepository.findUnitProgress(userId, courseId);

          // Get lesson progress
          const lessonProgressResult = await progressRepository.findLessonProgress(userId, courseId);

          // Get user stats
          const stats = await progressRepository.findUserStats(userId, courseId);

          // Create progress maps for easy lookup
          const unitProgressMap = {};
          unitProgressResult.forEach(up => {
            if (stryMutAct_9fa48("1031")) {
              {}
            } else {
              stryCov_9fa48("1031");
              unitProgressMap[up.unit_id] = stryMutAct_9fa48("1032") ? {} : (stryCov_9fa48("1032"), {
                isUnlocked: up.is_unlocked,
                isCompleted: up.is_completed
              });
            }
          });
          const lessonProgressMap = {};
          lessonProgressResult.forEach(lp => {
            if (stryMutAct_9fa48("1033")) {
              {}
            } else {
              stryCov_9fa48("1033");
              const key = stryMutAct_9fa48("1034") ? `` : (stryCov_9fa48("1034"), `${lp.unit_id}-${lp.lesson_id}`);
              lessonProgressMap[key] = stryMutAct_9fa48("1035") ? {} : (stryCov_9fa48("1035"), {
                isCompleted: lp.is_completed,
                score: lp.score,
                xpEarned: lp.xp_earned
              });
            }
          });

          // Enhance course data with progress
          const enhancedUnits = courseData.course.units.map(unit => {
            if (stryMutAct_9fa48("1036")) {
              {}
            } else {
              stryCov_9fa48("1036");
              const unitProg = stryMutAct_9fa48("1039") ? unitProgressMap[unit.id] && {
                isUnlocked: unit.id === 1,
                isCompleted: false
              } : stryMutAct_9fa48("1038") ? false : stryMutAct_9fa48("1037") ? true : (stryCov_9fa48("1037", "1038", "1039"), unitProgressMap[unit.id] || (stryMutAct_9fa48("1040") ? {} : (stryCov_9fa48("1040"), {
                isUnlocked: stryMutAct_9fa48("1043") ? unit.id !== 1 : stryMutAct_9fa48("1042") ? false : stryMutAct_9fa48("1041") ? true : (stryCov_9fa48("1041", "1042", "1043"), unit.id === 1),
                isCompleted: stryMutAct_9fa48("1044") ? true : (stryCov_9fa48("1044"), false)
              })));
              const enhancedLessons = unit.lessons.map((lesson, index) => {
                if (stryMutAct_9fa48("1045")) {
                  {}
                } else {
                  stryCov_9fa48("1045");
                  const key = stryMutAct_9fa48("1046") ? `` : (stryCov_9fa48("1046"), `${unit.id}-${lesson.id}`);
                  const lessonProg = stryMutAct_9fa48("1049") ? lessonProgressMap[key] && {
                    isCompleted: false,
                    score: 0,
                    xpEarned: 0
                  } : stryMutAct_9fa48("1048") ? false : stryMutAct_9fa48("1047") ? true : (stryCov_9fa48("1047", "1048", "1049"), lessonProgressMap[key] || (stryMutAct_9fa48("1050") ? {} : (stryCov_9fa48("1050"), {
                    isCompleted: stryMutAct_9fa48("1051") ? true : (stryCov_9fa48("1051"), false),
                    score: 0,
                    xpEarned: 0
                  })));

                  // Lesson is unlocked if:
                  // 1. Unit is unlocked AND
                  // 2. It's the first lesson OR previous lesson is completed
                  const previousLesson = (stryMutAct_9fa48("1055") ? index <= 0 : stryMutAct_9fa48("1054") ? index >= 0 : stryMutAct_9fa48("1053") ? false : stryMutAct_9fa48("1052") ? true : (stryCov_9fa48("1052", "1053", "1054", "1055"), index > 0)) ? unit.lessons[stryMutAct_9fa48("1056") ? index + 1 : (stryCov_9fa48("1056"), index - 1)] : null;
                  const previousKey = previousLesson ? stryMutAct_9fa48("1057") ? `` : (stryCov_9fa48("1057"), `${unit.id}-${previousLesson.id}`) : null;
                  const previousCompleted = previousKey ? stryMutAct_9fa48("1060") ? lessonProgressMap[previousKey]?.isCompleted && false : stryMutAct_9fa48("1059") ? false : stryMutAct_9fa48("1058") ? true : (stryCov_9fa48("1058", "1059", "1060"), (stryMutAct_9fa48("1061") ? lessonProgressMap[previousKey].isCompleted : (stryCov_9fa48("1061"), lessonProgressMap[previousKey]?.isCompleted)) || (stryMutAct_9fa48("1062") ? true : (stryCov_9fa48("1062"), false))) : stryMutAct_9fa48("1063") ? false : (stryCov_9fa48("1063"), true);
                  return stryMutAct_9fa48("1064") ? {} : (stryCov_9fa48("1064"), {
                    ...lesson,
                    isUnlocked: stryMutAct_9fa48("1067") ? unitProg.isUnlocked || index === 0 || previousCompleted : stryMutAct_9fa48("1066") ? false : stryMutAct_9fa48("1065") ? true : (stryCov_9fa48("1065", "1066", "1067"), unitProg.isUnlocked && (stryMutAct_9fa48("1069") ? index === 0 && previousCompleted : stryMutAct_9fa48("1068") ? true : (stryCov_9fa48("1068", "1069"), (stryMutAct_9fa48("1071") ? index !== 0 : stryMutAct_9fa48("1070") ? false : (stryCov_9fa48("1070", "1071"), index === 0)) || previousCompleted))),
                    isCompleted: lessonProg.isCompleted,
                    score: lessonProg.score,
                    xpEarned: lessonProg.xpEarned
                  });
                }
              });
              return stryMutAct_9fa48("1072") ? {} : (stryCov_9fa48("1072"), {
                ...unit,
                isUnlocked: unitProg.isUnlocked,
                isCompleted: unitProg.isCompleted,
                lessons: enhancedLessons
              });
            }
          });
          res.json(successResponse(stryMutAct_9fa48("1073") ? {} : (stryCov_9fa48("1073"), {
            course: stryMutAct_9fa48("1074") ? {} : (stryCov_9fa48("1074"), {
              id: course.id,
              language: course.language,
              title: courseData.course.title,
              duration: courseData.course.duration,
              units: enhancedUnits
            }),
            stats: stryMutAct_9fa48("1077") ? stats && {
              total_xp: 0,
              lessons_completed: 0,
              units_completed: 0,
              current_streak: 0,
              longest_streak: 0
            } : stryMutAct_9fa48("1076") ? false : stryMutAct_9fa48("1075") ? true : (stryCov_9fa48("1075", "1076", "1077"), stats || (stryMutAct_9fa48("1078") ? {} : (stryCov_9fa48("1078"), {
              total_xp: 0,
              lessons_completed: 0,
              units_completed: 0,
              current_streak: 0,
              longest_streak: 0
            })))
          }), stryMutAct_9fa48("1079") ? "" : (stryCov_9fa48("1079"), 'Course details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1080")) {
          {}
        } else {
          stryCov_9fa48("1080");
          console.error(stryMutAct_9fa48("1081") ? "" : (stryCov_9fa48("1081"), 'Error fetching course details:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get specific lesson details
   */
  async getLessonDetails(req, res, next) {
    if (stryMutAct_9fa48("1082")) {
      {}
    } else {
      stryCov_9fa48("1082");
      try {
        if (stryMutAct_9fa48("1083")) {
          {}
        } else {
          stryCov_9fa48("1083");
          const {
            courseId,
            unitId,
            lessonId
          } = req.params;
          const userId = req.user.id;
          // Get course data
          const courseResult = await courseRepository.findCourseDataById(courseId, userId);
          if (stryMutAct_9fa48("1086") ? false : stryMutAct_9fa48("1085") ? true : stryMutAct_9fa48("1084") ? courseResult : (stryCov_9fa48("1084", "1085", "1086"), !courseResult)) {
            if (stryMutAct_9fa48("1087")) {
              {}
            } else {
              stryCov_9fa48("1087");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          const courseData = courseResult.course_data;
          const unit = courseData.course.units.find(stryMutAct_9fa48("1088") ? () => undefined : (stryCov_9fa48("1088"), u => stryMutAct_9fa48("1091") ? u.id !== parseInt(unitId) : stryMutAct_9fa48("1090") ? false : stryMutAct_9fa48("1089") ? true : (stryCov_9fa48("1089", "1090", "1091"), u.id === parseInt(unitId))));
          const lesson = stryMutAct_9fa48("1092") ? unit.lessons.find(l => l.id === parseInt(lessonId)) : (stryCov_9fa48("1092"), unit?.lessons.find(stryMutAct_9fa48("1093") ? () => undefined : (stryCov_9fa48("1093"), l => stryMutAct_9fa48("1096") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1095") ? false : stryMutAct_9fa48("1094") ? true : (stryCov_9fa48("1094", "1095", "1096"), l.id === parseInt(lessonId)))));
          if (stryMutAct_9fa48("1099") ? false : stryMutAct_9fa48("1098") ? true : stryMutAct_9fa48("1097") ? lesson : (stryCov_9fa48("1097", "1098", "1099"), !lesson)) {
            if (stryMutAct_9fa48("1100")) {
              {}
            } else {
              stryCov_9fa48("1100");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Get lesson progress
          const progress = await progressRepository.findSpecificLessonProgress(userId, courseId, unitId, lessonId);
          res.json(successResponse(stryMutAct_9fa48("1101") ? {} : (stryCov_9fa48("1101"), {
            lesson,
            progress: stryMutAct_9fa48("1104") ? progress && null : stryMutAct_9fa48("1103") ? false : stryMutAct_9fa48("1102") ? true : (stryCov_9fa48("1102", "1103", "1104"), progress || null)
          }), stryMutAct_9fa48("1105") ? "" : (stryCov_9fa48("1105"), 'Lesson details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1106")) {
          {}
        } else {
          stryCov_9fa48("1106");
          console.error(stryMutAct_9fa48("1107") ? "" : (stryCov_9fa48("1107"), 'Error fetching lesson details:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get lesson details (legacy - without unit ID in URL)
   * Searches through all units to find the lesson
   */
  async getLessonDetailsLegacy(req, res, next) {
    if (stryMutAct_9fa48("1108")) {
      {}
    } else {
      stryCov_9fa48("1108");
      try {
        if (stryMutAct_9fa48("1109")) {
          {}
        } else {
          stryCov_9fa48("1109");
          const {
            courseId,
            lessonId
          } = req.params;
          const userId = req.user.id;
          // Get course data
          const courseResult = await courseRepository.findCourseDataById(courseId, userId);
          if (stryMutAct_9fa48("1112") ? false : stryMutAct_9fa48("1111") ? true : stryMutAct_9fa48("1110") ? courseResult : (stryCov_9fa48("1110", "1111", "1112"), !courseResult)) {
            if (stryMutAct_9fa48("1113")) {
              {}
            } else {
              stryCov_9fa48("1113");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          const courseData = courseResult.course_data;

          // Search through all units to find the lesson
          let foundLesson = null;
          let foundUnitId = null;
          for (const unit of courseData.course.units) {
            if (stryMutAct_9fa48("1114")) {
              {}
            } else {
              stryCov_9fa48("1114");
              const lesson = unit.lessons.find(stryMutAct_9fa48("1115") ? () => undefined : (stryCov_9fa48("1115"), l => stryMutAct_9fa48("1118") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1117") ? false : stryMutAct_9fa48("1116") ? true : (stryCov_9fa48("1116", "1117", "1118"), l.id === parseInt(lessonId))));
              if (stryMutAct_9fa48("1120") ? false : stryMutAct_9fa48("1119") ? true : (stryCov_9fa48("1119", "1120"), lesson)) {
                if (stryMutAct_9fa48("1121")) {
                  {}
                } else {
                  stryCov_9fa48("1121");
                  foundLesson = lesson;
                  foundUnitId = unit.id;
                  break;
                }
              }
            }
          }
          if (stryMutAct_9fa48("1124") ? false : stryMutAct_9fa48("1123") ? true : stryMutAct_9fa48("1122") ? foundLesson : (stryCov_9fa48("1122", "1123", "1124"), !foundLesson)) {
            if (stryMutAct_9fa48("1125")) {
              {}
            } else {
              stryCov_9fa48("1125");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Get lesson progress
          const progress = await progressRepository.findSpecificLessonProgress(userId, courseId, foundUnitId, lessonId);
          res.json(successResponse(stryMutAct_9fa48("1126") ? {} : (stryCov_9fa48("1126"), {
            lesson: foundLesson,
            unitId: foundUnitId,
            progress: stryMutAct_9fa48("1129") ? progress && null : stryMutAct_9fa48("1128") ? false : stryMutAct_9fa48("1127") ? true : (stryCov_9fa48("1127", "1128", "1129"), progress || null)
          }), stryMutAct_9fa48("1130") ? "" : (stryCov_9fa48("1130"), 'Lesson details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1131")) {
          {}
        } else {
          stryCov_9fa48("1131");
          console.error(stryMutAct_9fa48("1132") ? "" : (stryCov_9fa48("1132"), 'Error fetching lesson details (legacy):'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Complete lesson (legacy - without unit ID in URL)
   * Finds the unit ID and calls the progress controller
   */
  async completeLessonLegacy(req, res, next) {
    if (stryMutAct_9fa48("1133")) {
      {}
    } else {
      stryCov_9fa48("1133");
      try {
        if (stryMutAct_9fa48("1134")) {
          {}
        } else {
          stryCov_9fa48("1134");
          const {
            courseId,
            lessonId
          } = req.params;
          const userId = req.user.id;
          const {
            score = 100,
            exercises = stryMutAct_9fa48("1135") ? ["Stryker was here"] : (stryCov_9fa48("1135"), [])
          } = stryMutAct_9fa48("1138") ? req.body && {} : stryMutAct_9fa48("1137") ? false : stryMutAct_9fa48("1136") ? true : (stryCov_9fa48("1136", "1137", "1138"), req.body || {});
          // Get course data to find unit ID
          const courseResult = await courseRepository.findCourseDataById(courseId, userId);
          if (stryMutAct_9fa48("1141") ? false : stryMutAct_9fa48("1140") ? true : stryMutAct_9fa48("1139") ? courseResult : (stryCov_9fa48("1139", "1140", "1141"), !courseResult)) {
            if (stryMutAct_9fa48("1142")) {
              {}
            } else {
              stryCov_9fa48("1142");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          const courseData = courseResult.course_data;

          // Find which unit contains this lesson
          let foundUnitId = null;
          let foundLesson = null;
          for (const unit of courseData.course.units) {
            if (stryMutAct_9fa48("1143")) {
              {}
            } else {
              stryCov_9fa48("1143");
              const lesson = unit.lessons.find(stryMutAct_9fa48("1144") ? () => undefined : (stryCov_9fa48("1144"), l => stryMutAct_9fa48("1147") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1146") ? false : stryMutAct_9fa48("1145") ? true : (stryCov_9fa48("1145", "1146", "1147"), l.id === parseInt(lessonId))));
              if (stryMutAct_9fa48("1149") ? false : stryMutAct_9fa48("1148") ? true : (stryCov_9fa48("1148", "1149"), lesson)) {
                if (stryMutAct_9fa48("1150")) {
                  {}
                } else {
                  stryCov_9fa48("1150");
                  foundUnitId = unit.id;
                  foundLesson = lesson;
                  break;
                }
              }
            }
          }
          if (stryMutAct_9fa48("1153") ? !foundUnitId && !foundLesson : stryMutAct_9fa48("1152") ? false : stryMutAct_9fa48("1151") ? true : (stryCov_9fa48("1151", "1152", "1153"), (stryMutAct_9fa48("1154") ? foundUnitId : (stryCov_9fa48("1154"), !foundUnitId)) || (stryMutAct_9fa48("1155") ? foundLesson : (stryCov_9fa48("1155"), !foundLesson)))) {
            if (stryMutAct_9fa48("1156")) {
              {}
            } else {
              stryCov_9fa48("1156");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Validate exercise score - must get at least 3/5 correct
          if (stryMutAct_9fa48("1159") ? exercises || exercises.length > 0 : stryMutAct_9fa48("1158") ? false : stryMutAct_9fa48("1157") ? true : (stryCov_9fa48("1157", "1158", "1159"), exercises && (stryMutAct_9fa48("1162") ? exercises.length <= 0 : stryMutAct_9fa48("1161") ? exercises.length >= 0 : stryMutAct_9fa48("1160") ? true : (stryCov_9fa48("1160", "1161", "1162"), exercises.length > 0)))) {
            if (stryMutAct_9fa48("1163")) {
              {}
            } else {
              stryCov_9fa48("1163");
              const correctAnswers = stryMutAct_9fa48("1164") ? exercises.length : (stryCov_9fa48("1164"), exercises.filter(stryMutAct_9fa48("1165") ? () => undefined : (stryCov_9fa48("1165"), ex => stryMutAct_9fa48("1168") ? ex.isCorrect !== true : stryMutAct_9fa48("1167") ? false : stryMutAct_9fa48("1166") ? true : (stryCov_9fa48("1166", "1167", "1168"), ex.isCorrect === (stryMutAct_9fa48("1169") ? false : (stryCov_9fa48("1169"), true))))).length);
              const totalExercises = exercises.length;
              if (stryMutAct_9fa48("1172") ? totalExercises >= 5 || correctAnswers < 3 : stryMutAct_9fa48("1171") ? false : stryMutAct_9fa48("1170") ? true : (stryCov_9fa48("1170", "1171", "1172"), (stryMutAct_9fa48("1175") ? totalExercises < 5 : stryMutAct_9fa48("1174") ? totalExercises > 5 : stryMutAct_9fa48("1173") ? true : (stryCov_9fa48("1173", "1174", "1175"), totalExercises >= 5)) && (stryMutAct_9fa48("1178") ? correctAnswers >= 3 : stryMutAct_9fa48("1177") ? correctAnswers <= 3 : stryMutAct_9fa48("1176") ? true : (stryCov_9fa48("1176", "1177", "1178"), correctAnswers < 3)))) {
                if (stryMutAct_9fa48("1179")) {
                  {}
                } else {
                  stryCov_9fa48("1179");
                  return res.status(400).json(stryMutAct_9fa48("1180") ? {} : (stryCov_9fa48("1180"), {
                    success: stryMutAct_9fa48("1181") ? true : (stryCov_9fa48("1181"), false),
                    message: stryMutAct_9fa48("1182") ? "" : (stryCov_9fa48("1182"), 'You need at least 3 out of 5 correct answers to complete this lesson'),
                    data: stryMutAct_9fa48("1183") ? {} : (stryCov_9fa48("1183"), {
                      correctAnswers,
                      totalExercises,
                      passed: stryMutAct_9fa48("1184") ? true : (stryCov_9fa48("1184"), false)
                    })
                  }));
                }
              }
            }
          }

          // Get lesson database ID from course_lessons table
          const lessonDbId = await courseRepository.findLessonDbId(courseId, foundUnitId, lessonId);
          if (stryMutAct_9fa48("1187") ? false : stryMutAct_9fa48("1186") ? true : stryMutAct_9fa48("1185") ? lessonDbId : (stryCov_9fa48("1185", "1186", "1187"), !lessonDbId)) {
            if (stryMutAct_9fa48("1188")) {
              {}
            } else {
              stryCov_9fa48("1188");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }
          const xpEarned = stryMutAct_9fa48("1191") ? foundLesson.xpReward && 50 : stryMutAct_9fa48("1190") ? false : stryMutAct_9fa48("1189") ? true : (stryCov_9fa48("1189", "1190", "1191"), foundLesson.xpReward || 50);

          // Check if lesson already completed
          const existingProgress = await progressRepository.findSpecificLessonProgress(userId, courseId, foundUnitId, lessonId);
          if (stryMutAct_9fa48("1194") ? existingProgress || existingProgress.is_completed : stryMutAct_9fa48("1193") ? false : stryMutAct_9fa48("1192") ? true : (stryCov_9fa48("1192", "1193", "1194"), existingProgress && existingProgress.is_completed)) {
            if (stryMutAct_9fa48("1195")) {
              {}
            } else {
              stryCov_9fa48("1195");
              throw ERRORS.LESSON_ALREADY_COMPLETED;
            }
          }

          // Mark lesson as complete
          await progressRepository.upsertLessonProgress(userId, courseId, foundUnitId, lessonDbId, score, xpEarned);

          // Save exercise attempts
          for (let i = 0; stryMutAct_9fa48("1198") ? i >= exercises.length : stryMutAct_9fa48("1197") ? i <= exercises.length : stryMutAct_9fa48("1196") ? false : (stryCov_9fa48("1196", "1197", "1198"), i < exercises.length); stryMutAct_9fa48("1199") ? i-- : (stryCov_9fa48("1199"), i++)) {
            if (stryMutAct_9fa48("1200")) {
              {}
            } else {
              stryCov_9fa48("1200");
              const exercise = exercises[i];
              await progressRepository.createExerciseAttempt(userId, courseId, foundUnitId, lessonDbId, i, stryMutAct_9fa48("1203") ? exercise.isCorrect && false : stryMutAct_9fa48("1202") ? false : stryMutAct_9fa48("1201") ? true : (stryCov_9fa48("1201", "1202", "1203"), exercise.isCorrect || (stryMutAct_9fa48("1204") ? true : (stryCov_9fa48("1204"), false))), stryMutAct_9fa48("1207") ? exercise.userAnswer && '' : stryMutAct_9fa48("1206") ? false : stryMutAct_9fa48("1205") ? true : (stryCov_9fa48("1205", "1206", "1207"), exercise.userAnswer || (stryMutAct_9fa48("1208") ? "Stryker was here!" : (stryCov_9fa48("1208"), ''))));
            }
          }

          // Check if all lessons in unit are completed
          const unit = courseData.course.units.find(stryMutAct_9fa48("1209") ? () => undefined : (stryCov_9fa48("1209"), u => stryMutAct_9fa48("1212") ? u.id !== foundUnitId : stryMutAct_9fa48("1211") ? false : stryMutAct_9fa48("1210") ? true : (stryCov_9fa48("1210", "1211", "1212"), u.id === foundUnitId)));
          const totalLessonsInUnit = unit.lessons.length;
          const completedLessons = await progressRepository.countCompletedLessonsInUnit(userId, courseId, foundUnitId);
          let unitCompleted = stryMutAct_9fa48("1213") ? true : (stryCov_9fa48("1213"), false);
          if (stryMutAct_9fa48("1217") ? completedLessons < totalLessonsInUnit : stryMutAct_9fa48("1216") ? completedLessons > totalLessonsInUnit : stryMutAct_9fa48("1215") ? false : stryMutAct_9fa48("1214") ? true : (stryCov_9fa48("1214", "1215", "1216", "1217"), completedLessons >= totalLessonsInUnit)) {
            if (stryMutAct_9fa48("1218")) {
              {}
            } else {
              stryCov_9fa48("1218");
              // Mark unit as complete
              await progressRepository.markUnitComplete(userId, courseId, foundUnitId);

              // Unlock next unit
              const nextUnitId = stryMutAct_9fa48("1219") ? foundUnitId - 1 : (stryCov_9fa48("1219"), foundUnitId + 1);
              const nextUnit = courseData.course.units.find(stryMutAct_9fa48("1220") ? () => undefined : (stryCov_9fa48("1220"), u => stryMutAct_9fa48("1223") ? u.id !== nextUnitId : stryMutAct_9fa48("1222") ? false : stryMutAct_9fa48("1221") ? true : (stryCov_9fa48("1221", "1222", "1223"), u.id === nextUnitId)));
              if (stryMutAct_9fa48("1225") ? false : stryMutAct_9fa48("1224") ? true : (stryCov_9fa48("1224", "1225"), nextUnit)) {
                if (stryMutAct_9fa48("1226")) {
                  {}
                } else {
                  stryCov_9fa48("1226");
                  await progressRepository.unlockUnit(userId, courseId, nextUnitId);
                }
              }
              unitCompleted = stryMutAct_9fa48("1227") ? false : (stryCov_9fa48("1227"), true);
            }
          }
          console.log(stryMutAct_9fa48("1228") ? `` : (stryCov_9fa48("1228"), `✅ Lesson ${lessonId} completed! XP: ${xpEarned}, Unit completed: ${unitCompleted}`));
          res.json(successResponse(stryMutAct_9fa48("1229") ? {} : (stryCov_9fa48("1229"), {
            xpEarned,
            unitCompleted,
            nextLessonId: stryMutAct_9fa48("1230") ? foundLesson.id - 1 : (stryCov_9fa48("1230"), foundLesson.id + 1)
          }), unitCompleted ? stryMutAct_9fa48("1231") ? "" : (stryCov_9fa48("1231"), 'Unit completed! Next unit unlocked!') : stryMutAct_9fa48("1232") ? "" : (stryCov_9fa48("1232"), 'Lesson completed!')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1233")) {
          {}
        } else {
          stryCov_9fa48("1233");
          console.error(stryMutAct_9fa48("1234") ? "" : (stryCov_9fa48("1234"), 'Error completing lesson (legacy):'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Generate exercises for a specific lesson
   * POST /api/courses/:courseId/units/:unitId/lessons/:lessonId/exercises/generate
   */
  async generateLessonExercises(req, res, next) {
    if (stryMutAct_9fa48("1235")) {
      {}
    } else {
      stryCov_9fa48("1235");
      try {
        if (stryMutAct_9fa48("1236")) {
          {}
        } else {
          stryCov_9fa48("1236");
          const {
            courseId,
            unitId,
            lessonId
          } = req.params;
          const userId = req.user.id;
          console.log(stryMutAct_9fa48("1237") ? `` : (stryCov_9fa48("1237"), `🎯 Generating exercises for lesson ${lessonId}...`));

          // Get course data to find the lesson
          const courseResult = await courseRepository.findCourseDataById(courseId, userId);
          if (stryMutAct_9fa48("1240") ? false : stryMutAct_9fa48("1239") ? true : stryMutAct_9fa48("1238") ? courseResult : (stryCov_9fa48("1238", "1239", "1240"), !courseResult)) {
            if (stryMutAct_9fa48("1241")) {
              {}
            } else {
              stryCov_9fa48("1241");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          const courseData = courseResult.course_data;
          const unit = courseData.course.units.find(stryMutAct_9fa48("1242") ? () => undefined : (stryCov_9fa48("1242"), u => stryMutAct_9fa48("1245") ? u.id !== parseInt(unitId) : stryMutAct_9fa48("1244") ? false : stryMutAct_9fa48("1243") ? true : (stryCov_9fa48("1243", "1244", "1245"), u.id === parseInt(unitId))));
          const lesson = stryMutAct_9fa48("1246") ? unit.lessons.find(l => l.id === parseInt(lessonId)) : (stryCov_9fa48("1246"), unit?.lessons.find(stryMutAct_9fa48("1247") ? () => undefined : (stryCov_9fa48("1247"), l => stryMutAct_9fa48("1250") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1249") ? false : stryMutAct_9fa48("1248") ? true : (stryCov_9fa48("1248", "1249", "1250"), l.id === parseInt(lessonId)))));
          if (stryMutAct_9fa48("1253") ? false : stryMutAct_9fa48("1252") ? true : stryMutAct_9fa48("1251") ? lesson : (stryCov_9fa48("1251", "1252", "1253"), !lesson)) {
            if (stryMutAct_9fa48("1254")) {
              {}
            } else {
              stryCov_9fa48("1254");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Generate 5 new MCQ exercises using Gemini
          const exercisesData = await geminiService.generateExercises(lesson.title, lesson.type, courseData.course.language);

          // Update the lesson exercises in the database
          const lessonDbId = await courseRepository.findLessonDbId(courseId, parseInt(unitId), parseInt(lessonId));
          if (stryMutAct_9fa48("1257") ? false : stryMutAct_9fa48("1256") ? true : stryMutAct_9fa48("1255") ? lessonDbId : (stryCov_9fa48("1255", "1256", "1257"), !lessonDbId)) {
            if (stryMutAct_9fa48("1258")) {
              {}
            } else {
              stryCov_9fa48("1258");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Update lesson with new exercises
          await courseRepository.updateLessonExercises(lessonDbId, exercisesData.exercises);

          // Also update the course_data JSON
          lesson.exercises = exercisesData.exercises;
          await courseRepository.updateCourseData(courseId, courseData);
          console.log(stryMutAct_9fa48("1259") ? `` : (stryCov_9fa48("1259"), `✅ Generated ${exercisesData.exercises.length} exercises for lesson ${lessonId}`));
          res.json(successResponse(stryMutAct_9fa48("1260") ? {} : (stryCov_9fa48("1260"), {
            exercises: exercisesData.exercises
          }), stryMutAct_9fa48("1261") ? "" : (stryCov_9fa48("1261"), 'Exercises generated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1262")) {
          {}
        } else {
          stryCov_9fa48("1262");
          console.error(stryMutAct_9fa48("1263") ? "" : (stryCov_9fa48("1263"), 'Error generating lesson exercises:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Delete a course completely (all related data)
   */
  async deleteCourse(req, res, next) {
    if (stryMutAct_9fa48("1264")) {
      {}
    } else {
      stryCov_9fa48("1264");
      try {
        if (stryMutAct_9fa48("1265")) {
          {}
        } else {
          stryCov_9fa48("1265");
          const {
            courseId
          } = req.params;
          const userId = req.user.id;
          console.log(stryMutAct_9fa48("1266") ? `` : (stryCov_9fa48("1266"), `🗑️  Deleting course ${courseId} for user ${userId}...`));
          const deleted = await courseRepository.deleteCourse(courseId, userId);
          if (stryMutAct_9fa48("1269") ? false : stryMutAct_9fa48("1268") ? true : stryMutAct_9fa48("1267") ? deleted : (stryCov_9fa48("1267", "1268", "1269"), !deleted)) {
            if (stryMutAct_9fa48("1270")) {
              {}
            } else {
              stryCov_9fa48("1270");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          console.log(stryMutAct_9fa48("1271") ? `` : (stryCov_9fa48("1271"), `✅ Course ${courseId} deleted successfully`));
          res.json(successResponse(stryMutAct_9fa48("1272") ? {} : (stryCov_9fa48("1272"), {
            courseId: parseInt(courseId)
          }), stryMutAct_9fa48("1273") ? "" : (stryCov_9fa48("1273"), 'Course and all related data deleted successfully!')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1274")) {
          {}
        } else {
          stryCov_9fa48("1274");
          console.error(stryMutAct_9fa48("1275") ? "" : (stryCov_9fa48("1275"), 'Error deleting course:'), error);
          next(error);
        }
      }
    }
  }

  // ==================== PUBLIC ENDPOINTS (For Learners) ====================

  /**
   * Get all languages with published courses (PUBLIC - No Auth Required)
   * GET /api/courses/public/languages
   */
  async getPublishedLanguages(req, res, next) {
    if (stryMutAct_9fa48("1276")) {
      {}
    } else {
      stryCov_9fa48("1276");
      try {
        if (stryMutAct_9fa48("1277")) {
          {}
        } else {
          stryCov_9fa48("1277");
          console.log(stryMutAct_9fa48("1278") ? "" : (stryCov_9fa48("1278"), '📚 Fetching published languages...'));
          const languages = await courseRepository.getPublishedLanguages();
          res.json(listResponse(languages, stryMutAct_9fa48("1279") ? "" : (stryCov_9fa48("1279"), 'Published languages retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1280")) {
          {}
        } else {
          stryCov_9fa48("1280");
          console.error(stryMutAct_9fa48("1281") ? "" : (stryCov_9fa48("1281"), 'Error fetching published languages:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get published courses for a specific language (PUBLIC - No Auth Required)
   * GET /api/courses/public/languages/:language/courses
   */
  async getPublishedCoursesByLanguage(req, res, next) {
    if (stryMutAct_9fa48("1282")) {
      {}
    } else {
      stryCov_9fa48("1282");
      try {
        if (stryMutAct_9fa48("1283")) {
          {}
        } else {
          stryCov_9fa48("1283");
          const {
            language
          } = req.params;
          console.log(stryMutAct_9fa48("1284") ? `` : (stryCov_9fa48("1284"), `📖 Fetching published courses for language: ${language}`));
          if (stryMutAct_9fa48("1287") ? false : stryMutAct_9fa48("1286") ? true : stryMutAct_9fa48("1285") ? language : (stryCov_9fa48("1285", "1286", "1287"), !language)) {
            if (stryMutAct_9fa48("1288")) {
              {}
            } else {
              stryCov_9fa48("1288");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }
          const courses = await courseRepository.getPublishedCoursesByLanguage(language);
          res.json(listResponse(courses, stryMutAct_9fa48("1289") ? `` : (stryCov_9fa48("1289"), `Published courses for ${language} retrieved successfully`)));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1290")) {
          {}
        } else {
          stryCov_9fa48("1290");
          console.error(stryMutAct_9fa48("1291") ? "" : (stryCov_9fa48("1291"), 'Error fetching published courses:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get published course details with units and lessons (PUBLIC - No Auth Required)
   * GET /api/courses/public/courses/:courseId
   */
  async getPublishedCourseDetails(req, res, next) {
    if (stryMutAct_9fa48("1292")) {
      {}
    } else {
      stryCov_9fa48("1292");
      try {
        if (stryMutAct_9fa48("1293")) {
          {}
        } else {
          stryCov_9fa48("1293");
          const {
            courseId
          } = req.params;
          console.log(stryMutAct_9fa48("1294") ? `` : (stryCov_9fa48("1294"), `📕 Fetching published course details for ID: ${courseId}`));
          if (stryMutAct_9fa48("1297") ? false : stryMutAct_9fa48("1296") ? true : stryMutAct_9fa48("1295") ? courseId : (stryCov_9fa48("1295", "1296", "1297"), !courseId)) {
            if (stryMutAct_9fa48("1298")) {
              {}
            } else {
              stryCov_9fa48("1298");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }
          const course = await courseRepository.getPublishedCourseDetails(courseId);
          if (stryMutAct_9fa48("1301") ? false : stryMutAct_9fa48("1300") ? true : stryMutAct_9fa48("1299") ? course : (stryCov_9fa48("1299", "1300", "1301"), !course)) {
            if (stryMutAct_9fa48("1302")) {
              {}
            } else {
              stryCov_9fa48("1302");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          res.json(successResponse(course, stryMutAct_9fa48("1303") ? "" : (stryCov_9fa48("1303"), 'Published course details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1304")) {
          {}
        } else {
          stryCov_9fa48("1304");
          console.error(stryMutAct_9fa48("1305") ? "" : (stryCov_9fa48("1305"), 'Error fetching published course details:'), error);
          next(error);
        }
      }
    }
  }
}
export default new CourseController();