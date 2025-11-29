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
    if (stryMutAct_9fa48("814")) {
      {}
    } else {
      stryCov_9fa48("814");
      try {
        if (stryMutAct_9fa48("815")) {
          {}
        } else {
          stryCov_9fa48("815");
          const {
            language,
            expectedDuration,
            expertise = stryMutAct_9fa48("816") ? "" : (stryCov_9fa48("816"), 'Beginner')
          } = req.query;
          const userId = req.user.id;
          console.log(stryMutAct_9fa48("817") ? "" : (stryCov_9fa48("817"), '📥 Starting streaming course generation...'));
          console.log(stryMutAct_9fa48("818") ? "" : (stryCov_9fa48("818"), '🌍 Language:'), language);
          console.log(stryMutAct_9fa48("819") ? "" : (stryCov_9fa48("819"), '⏱️  Duration:'), expectedDuration);
          console.log(stryMutAct_9fa48("820") ? "" : (stryCov_9fa48("820"), '🎓 Expertise:'), expertise);
          if (stryMutAct_9fa48("823") ? !language && !expectedDuration : stryMutAct_9fa48("822") ? false : stryMutAct_9fa48("821") ? true : (stryCov_9fa48("821", "822", "823"), (stryMutAct_9fa48("824") ? language : (stryCov_9fa48("824"), !language)) || (stryMutAct_9fa48("825") ? expectedDuration : (stryCov_9fa48("825"), !expectedDuration)))) {
            if (stryMutAct_9fa48("826")) {
              {}
            } else {
              stryCov_9fa48("826");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Allow multiple courses for same language with different duration/expertise
          // Users can create multiple courses!

          // Set up SSE headers
          res.setHeader(stryMutAct_9fa48("827") ? "" : (stryCov_9fa48("827"), 'Content-Type'), stryMutAct_9fa48("828") ? "" : (stryCov_9fa48("828"), 'text/event-stream'));
          res.setHeader(stryMutAct_9fa48("829") ? "" : (stryCov_9fa48("829"), 'Cache-Control'), stryMutAct_9fa48("830") ? "" : (stryCov_9fa48("830"), 'no-cache'));
          res.setHeader(stryMutAct_9fa48("831") ? "" : (stryCov_9fa48("831"), 'Connection'), stryMutAct_9fa48("832") ? "" : (stryCov_9fa48("832"), 'keep-alive'));
          res.flushHeaders();

          // Helper function to send SSE events
          const sendEvent = (event, data) => {
            if (stryMutAct_9fa48("833")) {
              {}
            } else {
              stryCov_9fa48("833");
              res.write(stryMutAct_9fa48("834") ? `` : (stryCov_9fa48("834"), `event: ${event}\n`));
              res.write(stryMutAct_9fa48("835") ? `` : (stryCov_9fa48("835"), `data: ${JSON.stringify(data)}\n\n`));
            }
          };
          console.log(stryMutAct_9fa48("836") ? `` : (stryCov_9fa48("836"), `🚀 Generating course outline...`));

          // Generate course outline first with expertise level
          const outline = await geminiService.generateCourseOutline(language, expectedDuration, expertise);

          // Create initial course record in database
          const courseData = stryMutAct_9fa48("837") ? {} : (stryCov_9fa48("837"), {
            course: stryMutAct_9fa48("838") ? {} : (stryCov_9fa48("838"), {
              title: stryMutAct_9fa48("839") ? `` : (stryCov_9fa48("839"), `${language} Learning Journey`),
              language: language,
              duration: expectedDuration,
              totalLessons: 0,
              generatedAt: new Date().toISOString(),
              version: stryMutAct_9fa48("840") ? "" : (stryCov_9fa48("840"), '1.0'),
              units: stryMutAct_9fa48("841") ? ["Stryker was here"] : (stryCov_9fa48("841"), [])
            }),
            metadata: stryMutAct_9fa48("842") ? {} : (stryCov_9fa48("842"), {
              language,
              totalUnits: outline.units.length,
              totalLessons: 0,
              estimatedTotalTime: 0,
              createdBy: stryMutAct_9fa48("843") ? "" : (stryCov_9fa48("843"), 'ai')
            })
          });
          const courseId = await courseRepository.createCourse(userId, language, expectedDuration, courseData);

          // Initialize progress (unlock first unit)
          await progressRepository.initializeCourseProgress(courseId, userId);

          // Send course created event
          sendEvent(stryMutAct_9fa48("844") ? "" : (stryCov_9fa48("844"), 'course_created'), stryMutAct_9fa48("845") ? {} : (stryCov_9fa48("845"), {
            courseId,
            language,
            totalUnits: outline.units.length,
            message: stryMutAct_9fa48("846") ? "" : (stryCov_9fa48("846"), 'Course created, generating units...')
          }));
          console.log(stryMutAct_9fa48("847") ? `` : (stryCov_9fa48("847"), `Course ${courseId} created, generating ${outline.units.length} units...`));
          const units = stryMutAct_9fa48("848") ? ["Stryker was here"] : (stryCov_9fa48("848"), []);
          let totalLessons = 0;
          let totalTime = 0;

          // Generate each unit one by one
          for (let i = 0; stryMutAct_9fa48("851") ? i >= outline.units.length : stryMutAct_9fa48("850") ? i <= outline.units.length : stryMutAct_9fa48("849") ? false : (stryCov_9fa48("849", "850", "851"), i < outline.units.length); stryMutAct_9fa48("852") ? i-- : (stryCov_9fa48("852"), i++)) {
            if (stryMutAct_9fa48("853")) {
              {}
            } else {
              stryCov_9fa48("853");
              const unitOutline = outline.units[i];

              // Send unit generating event
              sendEvent(stryMutAct_9fa48("854") ? "" : (stryCov_9fa48("854"), 'unit_generating'), stryMutAct_9fa48("855") ? {} : (stryCov_9fa48("855"), {
                unitNumber: stryMutAct_9fa48("856") ? i - 1 : (stryCov_9fa48("856"), i + 1),
                totalUnits: outline.units.length,
                title: unitOutline.title,
                message: stryMutAct_9fa48("857") ? `` : (stryCov_9fa48("857"), `Generating Unit ${stryMutAct_9fa48("858") ? i - 1 : (stryCov_9fa48("858"), i + 1)}: ${unitOutline.title}...`)
              }));
              console.log(stryMutAct_9fa48("859") ? `` : (stryCov_9fa48("859"), `  📝 Generating Unit ${stryMutAct_9fa48("860") ? i - 1 : (stryCov_9fa48("860"), i + 1)}: ${unitOutline.title}...`));

              // Generate the unit content with expertise level
              const unit = await geminiService.generateUnit(language, unitOutline, stryMutAct_9fa48("861") ? i - 1 : (stryCov_9fa48("861"), i + 1), expertise);
              units.push(unit);
              stryMutAct_9fa48("862") ? totalLessons -= unit.lessons.length : (stryCov_9fa48("862"), totalLessons += unit.lessons.length);
              stryMutAct_9fa48("863") ? totalTime -= parseInt(unit.estimatedTime) || 150 : (stryCov_9fa48("863"), totalTime += stryMutAct_9fa48("866") ? parseInt(unit.estimatedTime) && 150 : stryMutAct_9fa48("865") ? false : stryMutAct_9fa48("864") ? true : (stryCov_9fa48("864", "865", "866"), parseInt(unit.estimatedTime) || 150));

              // Update course data with new unit
              courseData.course.units = units;
              courseData.course.totalLessons = totalLessons;
              courseData.metadata.totalLessons = totalLessons;
              courseData.metadata.estimatedTotalTime = totalTime;

              // Save unit to database immediately
              await courseRepository.updateCourseData(courseId, courseData);
              await courseRepository.populateCourseStructure(courseId, stryMutAct_9fa48("867") ? {} : (stryCov_9fa48("867"), {
                course: stryMutAct_9fa48("868") ? {} : (stryCov_9fa48("868"), {
                  units: stryMutAct_9fa48("869") ? [] : (stryCov_9fa48("869"), [unit])
                })
              }));

              // Send unit generated event
              sendEvent(stryMutAct_9fa48("870") ? "" : (stryCov_9fa48("870"), 'unit_generated'), stryMutAct_9fa48("871") ? {} : (stryCov_9fa48("871"), {
                unitNumber: stryMutAct_9fa48("872") ? i - 1 : (stryCov_9fa48("872"), i + 1),
                totalUnits: outline.units.length,
                unit: unit,
                progress: stryMutAct_9fa48("873") ? `` : (stryCov_9fa48("873"), `${stryMutAct_9fa48("874") ? i - 1 : (stryCov_9fa48("874"), i + 1)}/${outline.units.length}`),
                message: stryMutAct_9fa48("875") ? `` : (stryCov_9fa48("875"), `Unit ${stryMutAct_9fa48("876") ? i - 1 : (stryCov_9fa48("876"), i + 1)} completed!`)
              }));
              console.log(stryMutAct_9fa48("877") ? `` : (stryCov_9fa48("877"), `  ✅ Unit ${stryMutAct_9fa48("878") ? i - 1 : (stryCov_9fa48("878"), i + 1)} saved to database`));

              // Add delay between units to avoid rate limiting (except after last unit)
              if (stryMutAct_9fa48("882") ? i >= outline.units.length - 1 : stryMutAct_9fa48("881") ? i <= outline.units.length - 1 : stryMutAct_9fa48("880") ? false : stryMutAct_9fa48("879") ? true : (stryCov_9fa48("879", "880", "881", "882"), i < (stryMutAct_9fa48("883") ? outline.units.length + 1 : (stryCov_9fa48("883"), outline.units.length - 1)))) {
                if (stryMutAct_9fa48("884")) {
                  {}
                } else {
                  stryCov_9fa48("884");
                  console.log(stryMutAct_9fa48("885") ? "" : (stryCov_9fa48("885"), '  ⏳ Waiting 3 seconds before next unit to avoid rate limits...'));
                  await new Promise(stryMutAct_9fa48("886") ? () => undefined : (stryCov_9fa48("886"), resolve => setTimeout(resolve, 3000)));
                }
              }
            }
          }

          // Send course complete event
          sendEvent(stryMutAct_9fa48("887") ? "" : (stryCov_9fa48("887"), 'course_complete'), stryMutAct_9fa48("888") ? {} : (stryCov_9fa48("888"), {
            courseId,
            language,
            totalUnits: units.length,
            totalLessons,
            estimatedTotalTime: totalTime,
            message: stryMutAct_9fa48("889") ? "" : (stryCov_9fa48("889"), 'Course generation complete!')
          }));
          console.log(stryMutAct_9fa48("890") ? `` : (stryCov_9fa48("890"), `🎉 Course ${courseId} generation complete!`));

          // Track AI course generation for analytics
          try {
            if (stryMutAct_9fa48("891")) {
              {}
            } else {
              stryCov_9fa48("891");
              await analyticsService.trackAIGeneration(userId, language, stryMutAct_9fa48("892") ? false : (stryCov_9fa48("892"), true), // success
              stryMutAct_9fa48("893") ? {} : (stryCov_9fa48("893"), {
                courseId,
                unitsGenerated: units.length,
                lessonsGenerated: totalLessons
              }));
            }
          } catch (analyticsError) {
            if (stryMutAct_9fa48("894")) {
              {}
            } else {
              stryCov_9fa48("894");
              console.error(stryMutAct_9fa48("895") ? "" : (stryCov_9fa48("895"), 'Error tracking AI generation analytics:'), analyticsError);
              // Don't fail the course generation if analytics fails
            }
          }
          res.end();
        }
      } catch (error) {
        if (stryMutAct_9fa48("896")) {
          {}
        } else {
          stryCov_9fa48("896");
          console.error(stryMutAct_9fa48("897") ? "" : (stryCov_9fa48("897"), 'Error in streaming course generation:'), error);

          // Track failed AI generation for analytics (only if userId and language are available)
          try {
            if (stryMutAct_9fa48("898")) {
              {}
            } else {
              stryCov_9fa48("898");
              const userId = stryMutAct_9fa48("899") ? req.user.id : (stryCov_9fa48("899"), req.user?.id);
              const language = stryMutAct_9fa48("900") ? req.query.language : (stryCov_9fa48("900"), req.query?.language);
              if (stryMutAct_9fa48("903") ? userId || language : stryMutAct_9fa48("902") ? false : stryMutAct_9fa48("901") ? true : (stryCov_9fa48("901", "902", "903"), userId && language)) {
                if (stryMutAct_9fa48("904")) {
                  {}
                } else {
                  stryCov_9fa48("904");
                  await analyticsService.trackAIGeneration(userId, language, stryMutAct_9fa48("905") ? true : (stryCov_9fa48("905"), false), // success = false
                  stryMutAct_9fa48("906") ? {} : (stryCov_9fa48("906"), {
                    errorMessage: error.message
                  }));
                }
              }
            }
          } catch (analyticsError) {
            if (stryMutAct_9fa48("907")) {
              {}
            } else {
              stryCov_9fa48("907");
              console.error(stryMutAct_9fa48("908") ? "" : (stryCov_9fa48("908"), 'Error tracking failed AI generation analytics:'), analyticsError);
            }
          }

          // Send error event with better message
          const errorMessage = (stryMutAct_9fa48("911") ? error.message.includes('429') && error.message.includes('Too Many Requests') : stryMutAct_9fa48("910") ? false : stryMutAct_9fa48("909") ? true : (stryCov_9fa48("909", "910", "911"), error.message.includes(stryMutAct_9fa48("912") ? "" : (stryCov_9fa48("912"), '429')) || error.message.includes(stryMutAct_9fa48("913") ? "" : (stryCov_9fa48("913"), 'Too Many Requests')))) ? stryMutAct_9fa48("914") ? "" : (stryCov_9fa48("914"), 'API rate limit exceeded. Please wait a few minutes and try again.') : error.message;
          res.write(stryMutAct_9fa48("915") ? `` : (stryCov_9fa48("915"), `event: error\n`));
          res.write(stryMutAct_9fa48("916") ? `` : (stryCov_9fa48("916"), `data: ${JSON.stringify(stryMutAct_9fa48("917") ? {} : (stryCov_9fa48("917"), {
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
    if (stryMutAct_9fa48("918")) {
      {}
    } else {
      stryCov_9fa48("918");
      try {
        if (stryMutAct_9fa48("919")) {
          {}
        } else {
          stryCov_9fa48("919");
          const {
            language,
            expectedDuration,
            expertise = stryMutAct_9fa48("920") ? "" : (stryCov_9fa48("920"), 'Beginner')
          } = req.body;
          const userId = req.user.id;
          console.log(stryMutAct_9fa48("921") ? "" : (stryCov_9fa48("921"), '📥 Received request body:'), req.body);
          console.log(stryMutAct_9fa48("922") ? "" : (stryCov_9fa48("922"), '🌍 Language:'), language);
          console.log(stryMutAct_9fa48("923") ? "" : (stryCov_9fa48("923"), '⏱️  Duration:'), expectedDuration);
          console.log(stryMutAct_9fa48("924") ? "" : (stryCov_9fa48("924"), '🎓 Expertise:'), expertise);
          if (stryMutAct_9fa48("927") ? !language || !expectedDuration : stryMutAct_9fa48("926") ? false : stryMutAct_9fa48("925") ? true : (stryCov_9fa48("925", "926", "927"), (stryMutAct_9fa48("928") ? language : (stryCov_9fa48("928"), !language)) && (stryMutAct_9fa48("929") ? expectedDuration : (stryCov_9fa48("929"), !expectedDuration)))) {
            if (stryMutAct_9fa48("930")) {
              {}
            } else {
              stryCov_9fa48("930");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }
          if (stryMutAct_9fa48("933") ? false : stryMutAct_9fa48("932") ? true : stryMutAct_9fa48("931") ? language : (stryCov_9fa48("931", "932", "933"), !language)) {
            if (stryMutAct_9fa48("934")) {
              {}
            } else {
              stryCov_9fa48("934");
              throw ERRORS.LANGUAGE_REQUIRED;
            }
          }
          if (stryMutAct_9fa48("937") ? false : stryMutAct_9fa48("936") ? true : stryMutAct_9fa48("935") ? expectedDuration : (stryCov_9fa48("935", "936", "937"), !expectedDuration)) {
            if (stryMutAct_9fa48("938")) {
              {}
            } else {
              stryCov_9fa48("938");
              throw ERRORS.DURATION_REQUIRED;
            }
          }

          // Allow multiple courses for same language with different duration/expertise
          // Users can create multiple courses!

          console.log(stryMutAct_9fa48("939") ? `` : (stryCov_9fa48("939"), `🚀 Starting course generation for ${language}...`));

          // Generate course content using Gemini with expertise level
          const courseData = await geminiService.generateCourse(language, expectedDuration, expertise);
          console.log(stryMutAct_9fa48("940") ? "" : (stryCov_9fa48("940"), 'Saving course to database...'));

          // Save course to database with course_data
          const courseId = await courseRepository.createCourse(userId, language, expectedDuration, courseData);

          // Initialize progress (unlock first unit)
          await progressRepository.initializeCourseProgress(courseId, userId);
          console.log(stryMutAct_9fa48("941") ? `` : (stryCov_9fa48("941"), `Course created successfully with ID: ${courseId}`));
          res.json(createdResponse(stryMutAct_9fa48("942") ? {} : (stryCov_9fa48("942"), {
            id: courseId,
            language: language,
            title: courseData.course.title,
            totalUnits: courseData.metadata.totalUnits,
            totalLessons: courseData.metadata.totalLessons,
            estimatedTotalTime: courseData.metadata.estimatedTotalTime
          }), stryMutAct_9fa48("943") ? "" : (stryCov_9fa48("943"), 'Course generated successfully!')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("944")) {
          {}
        } else {
          stryCov_9fa48("944");
          console.error(stryMutAct_9fa48("945") ? "" : (stryCov_9fa48("945"), 'Error generating course:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get learner's courses
   */
  async getLearnerCourses(req, res, next) {
    if (stryMutAct_9fa48("946")) {
      {}
    } else {
      stryCov_9fa48("946");
      try {
        if (stryMutAct_9fa48("947")) {
          {}
        } else {
          stryCov_9fa48("947");
          const userId = req.user.id;
          const courses = await courseRepository.findLearnerCoursesWithStats(userId);
          const coursesWithDetails = courses.map(course => {
            if (stryMutAct_9fa48("948")) {
              {}
            } else {
              stryCov_9fa48("948");
              return stryMutAct_9fa48("949") ? {} : (stryCov_9fa48("949"), {
                id: course.id,
                language: course.language,
                title: stryMutAct_9fa48("952") ? course.title && `${course.language} Course` : stryMutAct_9fa48("951") ? false : stryMutAct_9fa48("950") ? true : (stryCov_9fa48("950", "951", "952"), course.title || (stryMutAct_9fa48("953") ? `` : (stryCov_9fa48("953"), `${course.language} Course`))),
                description: course.description,
                expectedDuration: course.expected_duration,
                totalUnits: stryMutAct_9fa48("956") ? course.total_units && 0 : stryMutAct_9fa48("955") ? false : stryMutAct_9fa48("954") ? true : (stryCov_9fa48("954", "955", "956"), course.total_units || 0),
                totalLessons: stryMutAct_9fa48("959") ? course.total_lessons && 0 : stryMutAct_9fa48("958") ? false : stryMutAct_9fa48("957") ? true : (stryCov_9fa48("957", "958", "959"), course.total_lessons || 0),
                estimatedTotalTime: stryMutAct_9fa48("962") ? course.estimated_total_time && 0 : stryMutAct_9fa48("961") ? false : stryMutAct_9fa48("960") ? true : (stryCov_9fa48("960", "961", "962"), course.estimated_total_time || 0),
                createdAt: course.created_at,
                progress: stryMutAct_9fa48("963") ? {} : (stryCov_9fa48("963"), {
                  totalXp: stryMutAct_9fa48("966") ? course.total_xp && 0 : stryMutAct_9fa48("965") ? false : stryMutAct_9fa48("964") ? true : (stryCov_9fa48("964", "965", "966"), course.total_xp || 0),
                  lessonsCompleted: stryMutAct_9fa48("969") ? course.lessons_completed && 0 : stryMutAct_9fa48("968") ? false : stryMutAct_9fa48("967") ? true : (stryCov_9fa48("967", "968", "969"), course.lessons_completed || 0),
                  unitsCompleted: stryMutAct_9fa48("972") ? course.units_completed && 0 : stryMutAct_9fa48("971") ? false : stryMutAct_9fa48("970") ? true : (stryCov_9fa48("970", "971", "972"), course.units_completed || 0),
                  currentStreak: stryMutAct_9fa48("975") ? course.current_streak && 0 : stryMutAct_9fa48("974") ? false : stryMutAct_9fa48("973") ? true : (stryCov_9fa48("973", "974", "975"), course.current_streak || 0),
                  progressPercentage: stryMutAct_9fa48("978") ? course.progress_percentage && 0 : stryMutAct_9fa48("977") ? false : stryMutAct_9fa48("976") ? true : (stryCov_9fa48("976", "977", "978"), course.progress_percentage || 0)
                })
              });
            }
          });
          res.json(listResponse(coursesWithDetails, stryMutAct_9fa48("979") ? "" : (stryCov_9fa48("979"), 'Courses retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("980")) {
          {}
        } else {
          stryCov_9fa48("980");
          console.error(stryMutAct_9fa48("981") ? "" : (stryCov_9fa48("981"), 'Error fetching courses:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get specific course details with progress
   */
  async getCourseDetails(req, res, next) {
    if (stryMutAct_9fa48("982")) {
      {}
    } else {
      stryCov_9fa48("982");
      try {
        if (stryMutAct_9fa48("983")) {
          {}
        } else {
          stryCov_9fa48("983");
          const {
            courseId
          } = req.params;
          const userId = req.user.id;
          // Get course data
          const course = await courseRepository.findCourseById(courseId, userId);
          if (stryMutAct_9fa48("986") ? false : stryMutAct_9fa48("985") ? true : stryMutAct_9fa48("984") ? course : (stryCov_9fa48("984", "985", "986"), !course)) {
            if (stryMutAct_9fa48("987")) {
              {}
            } else {
              stryCov_9fa48("987");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }

          // Parse course data
          let courseData;
          try {
            if (stryMutAct_9fa48("988")) {
              {}
            } else {
              stryCov_9fa48("988");
              courseData = course.course_data;
            }
          } catch (parseError) {
            if (stryMutAct_9fa48("989")) {
              {}
            } else {
              stryCov_9fa48("989");
              console.error(stryMutAct_9fa48("990") ? "" : (stryCov_9fa48("990"), 'Error parsing course_data:'), parseError);
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
            if (stryMutAct_9fa48("991")) {
              {}
            } else {
              stryCov_9fa48("991");
              unitProgressMap[up.unit_id] = stryMutAct_9fa48("992") ? {} : (stryCov_9fa48("992"), {
                isUnlocked: up.is_unlocked,
                isCompleted: up.is_completed
              });
            }
          });
          const lessonProgressMap = {};
          lessonProgressResult.forEach(lp => {
            if (stryMutAct_9fa48("993")) {
              {}
            } else {
              stryCov_9fa48("993");
              const key = stryMutAct_9fa48("994") ? `` : (stryCov_9fa48("994"), `${lp.unit_id}-${lp.lesson_id}`);
              lessonProgressMap[key] = stryMutAct_9fa48("995") ? {} : (stryCov_9fa48("995"), {
                isCompleted: lp.is_completed,
                score: lp.score,
                xpEarned: lp.xp_earned
              });
            }
          });

          // Enhance course data with progress
          const enhancedUnits = courseData.course.units.map(unit => {
            if (stryMutAct_9fa48("996")) {
              {}
            } else {
              stryCov_9fa48("996");
              const unitProg = stryMutAct_9fa48("999") ? unitProgressMap[unit.id] && {
                isUnlocked: unit.id === 1,
                isCompleted: false
              } : stryMutAct_9fa48("998") ? false : stryMutAct_9fa48("997") ? true : (stryCov_9fa48("997", "998", "999"), unitProgressMap[unit.id] || (stryMutAct_9fa48("1000") ? {} : (stryCov_9fa48("1000"), {
                isUnlocked: stryMutAct_9fa48("1003") ? unit.id !== 1 : stryMutAct_9fa48("1002") ? false : stryMutAct_9fa48("1001") ? true : (stryCov_9fa48("1001", "1002", "1003"), unit.id === 1),
                isCompleted: stryMutAct_9fa48("1004") ? true : (stryCov_9fa48("1004"), false)
              })));
              const enhancedLessons = unit.lessons.map((lesson, index) => {
                if (stryMutAct_9fa48("1005")) {
                  {}
                } else {
                  stryCov_9fa48("1005");
                  const key = stryMutAct_9fa48("1006") ? `` : (stryCov_9fa48("1006"), `${unit.id}-${lesson.id}`);
                  const lessonProg = stryMutAct_9fa48("1009") ? lessonProgressMap[key] && {
                    isCompleted: false,
                    score: 0,
                    xpEarned: 0
                  } : stryMutAct_9fa48("1008") ? false : stryMutAct_9fa48("1007") ? true : (stryCov_9fa48("1007", "1008", "1009"), lessonProgressMap[key] || (stryMutAct_9fa48("1010") ? {} : (stryCov_9fa48("1010"), {
                    isCompleted: stryMutAct_9fa48("1011") ? true : (stryCov_9fa48("1011"), false),
                    score: 0,
                    xpEarned: 0
                  })));

                  // Lesson is unlocked if:
                  // 1. Unit is unlocked AND
                  // 2. It's the first lesson OR previous lesson is completed
                  const previousLesson = (stryMutAct_9fa48("1015") ? index <= 0 : stryMutAct_9fa48("1014") ? index >= 0 : stryMutAct_9fa48("1013") ? false : stryMutAct_9fa48("1012") ? true : (stryCov_9fa48("1012", "1013", "1014", "1015"), index > 0)) ? unit.lessons[stryMutAct_9fa48("1016") ? index + 1 : (stryCov_9fa48("1016"), index - 1)] : null;
                  const previousKey = previousLesson ? stryMutAct_9fa48("1017") ? `` : (stryCov_9fa48("1017"), `${unit.id}-${previousLesson.id}`) : null;
                  const previousCompleted = previousKey ? stryMutAct_9fa48("1020") ? lessonProgressMap[previousKey]?.isCompleted && false : stryMutAct_9fa48("1019") ? false : stryMutAct_9fa48("1018") ? true : (stryCov_9fa48("1018", "1019", "1020"), (stryMutAct_9fa48("1021") ? lessonProgressMap[previousKey].isCompleted : (stryCov_9fa48("1021"), lessonProgressMap[previousKey]?.isCompleted)) || (stryMutAct_9fa48("1022") ? true : (stryCov_9fa48("1022"), false))) : stryMutAct_9fa48("1023") ? false : (stryCov_9fa48("1023"), true);
                  return stryMutAct_9fa48("1024") ? {} : (stryCov_9fa48("1024"), {
                    ...lesson,
                    isUnlocked: stryMutAct_9fa48("1027") ? unitProg.isUnlocked || index === 0 || previousCompleted : stryMutAct_9fa48("1026") ? false : stryMutAct_9fa48("1025") ? true : (stryCov_9fa48("1025", "1026", "1027"), unitProg.isUnlocked && (stryMutAct_9fa48("1029") ? index === 0 && previousCompleted : stryMutAct_9fa48("1028") ? true : (stryCov_9fa48("1028", "1029"), (stryMutAct_9fa48("1031") ? index !== 0 : stryMutAct_9fa48("1030") ? false : (stryCov_9fa48("1030", "1031"), index === 0)) || previousCompleted))),
                    isCompleted: lessonProg.isCompleted,
                    score: lessonProg.score,
                    xpEarned: lessonProg.xpEarned
                  });
                }
              });
              return stryMutAct_9fa48("1032") ? {} : (stryCov_9fa48("1032"), {
                ...unit,
                isUnlocked: unitProg.isUnlocked,
                isCompleted: unitProg.isCompleted,
                lessons: enhancedLessons
              });
            }
          });
          res.json(successResponse(stryMutAct_9fa48("1033") ? {} : (stryCov_9fa48("1033"), {
            course: stryMutAct_9fa48("1034") ? {} : (stryCov_9fa48("1034"), {
              id: course.id,
              language: course.language,
              title: courseData.course.title,
              duration: courseData.course.duration,
              units: enhancedUnits
            }),
            stats: stryMutAct_9fa48("1037") ? stats && {
              total_xp: 0,
              lessons_completed: 0,
              units_completed: 0,
              current_streak: 0,
              longest_streak: 0
            } : stryMutAct_9fa48("1036") ? false : stryMutAct_9fa48("1035") ? true : (stryCov_9fa48("1035", "1036", "1037"), stats || (stryMutAct_9fa48("1038") ? {} : (stryCov_9fa48("1038"), {
              total_xp: 0,
              lessons_completed: 0,
              units_completed: 0,
              current_streak: 0,
              longest_streak: 0
            })))
          }), stryMutAct_9fa48("1039") ? "" : (stryCov_9fa48("1039"), 'Course details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1040")) {
          {}
        } else {
          stryCov_9fa48("1040");
          console.error(stryMutAct_9fa48("1041") ? "" : (stryCov_9fa48("1041"), 'Error fetching course details:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get specific lesson details
   */
  async getLessonDetails(req, res, next) {
    if (stryMutAct_9fa48("1042")) {
      {}
    } else {
      stryCov_9fa48("1042");
      try {
        if (stryMutAct_9fa48("1043")) {
          {}
        } else {
          stryCov_9fa48("1043");
          const {
            courseId,
            unitId,
            lessonId
          } = req.params;
          const userId = req.user.id;
          // Get course data
          const courseResult = await courseRepository.findCourseDataById(courseId, userId);
          if (stryMutAct_9fa48("1046") ? false : stryMutAct_9fa48("1045") ? true : stryMutAct_9fa48("1044") ? courseResult : (stryCov_9fa48("1044", "1045", "1046"), !courseResult)) {
            if (stryMutAct_9fa48("1047")) {
              {}
            } else {
              stryCov_9fa48("1047");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          const courseData = courseResult.course_data;
          const unit = courseData.course.units.find(stryMutAct_9fa48("1048") ? () => undefined : (stryCov_9fa48("1048"), u => stryMutAct_9fa48("1051") ? u.id !== parseInt(unitId) : stryMutAct_9fa48("1050") ? false : stryMutAct_9fa48("1049") ? true : (stryCov_9fa48("1049", "1050", "1051"), u.id === parseInt(unitId))));
          const lesson = stryMutAct_9fa48("1052") ? unit.lessons.find(l => l.id === parseInt(lessonId)) : (stryCov_9fa48("1052"), unit?.lessons.find(stryMutAct_9fa48("1053") ? () => undefined : (stryCov_9fa48("1053"), l => stryMutAct_9fa48("1056") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1055") ? false : stryMutAct_9fa48("1054") ? true : (stryCov_9fa48("1054", "1055", "1056"), l.id === parseInt(lessonId)))));
          if (stryMutAct_9fa48("1059") ? false : stryMutAct_9fa48("1058") ? true : stryMutAct_9fa48("1057") ? lesson : (stryCov_9fa48("1057", "1058", "1059"), !lesson)) {
            if (stryMutAct_9fa48("1060")) {
              {}
            } else {
              stryCov_9fa48("1060");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Get lesson progress
          const progress = await progressRepository.findSpecificLessonProgress(userId, courseId, unitId, lessonId);
          res.json(successResponse(stryMutAct_9fa48("1061") ? {} : (stryCov_9fa48("1061"), {
            lesson,
            progress: stryMutAct_9fa48("1064") ? progress && null : stryMutAct_9fa48("1063") ? false : stryMutAct_9fa48("1062") ? true : (stryCov_9fa48("1062", "1063", "1064"), progress || null)
          }), stryMutAct_9fa48("1065") ? "" : (stryCov_9fa48("1065"), 'Lesson details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1066")) {
          {}
        } else {
          stryCov_9fa48("1066");
          console.error(stryMutAct_9fa48("1067") ? "" : (stryCov_9fa48("1067"), 'Error fetching lesson details:'), error);
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
    if (stryMutAct_9fa48("1068")) {
      {}
    } else {
      stryCov_9fa48("1068");
      try {
        if (stryMutAct_9fa48("1069")) {
          {}
        } else {
          stryCov_9fa48("1069");
          const {
            courseId,
            lessonId
          } = req.params;
          const userId = req.user.id;
          // Get course data
          const courseResult = await courseRepository.findCourseDataById(courseId, userId);
          if (stryMutAct_9fa48("1072") ? false : stryMutAct_9fa48("1071") ? true : stryMutAct_9fa48("1070") ? courseResult : (stryCov_9fa48("1070", "1071", "1072"), !courseResult)) {
            if (stryMutAct_9fa48("1073")) {
              {}
            } else {
              stryCov_9fa48("1073");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          const courseData = courseResult.course_data;

          // Search through all units to find the lesson
          let foundLesson = null;
          let foundUnitId = null;
          for (const unit of courseData.course.units) {
            if (stryMutAct_9fa48("1074")) {
              {}
            } else {
              stryCov_9fa48("1074");
              const lesson = unit.lessons.find(stryMutAct_9fa48("1075") ? () => undefined : (stryCov_9fa48("1075"), l => stryMutAct_9fa48("1078") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1077") ? false : stryMutAct_9fa48("1076") ? true : (stryCov_9fa48("1076", "1077", "1078"), l.id === parseInt(lessonId))));
              if (stryMutAct_9fa48("1080") ? false : stryMutAct_9fa48("1079") ? true : (stryCov_9fa48("1079", "1080"), lesson)) {
                if (stryMutAct_9fa48("1081")) {
                  {}
                } else {
                  stryCov_9fa48("1081");
                  foundLesson = lesson;
                  foundUnitId = unit.id;
                  break;
                }
              }
            }
          }
          if (stryMutAct_9fa48("1084") ? false : stryMutAct_9fa48("1083") ? true : stryMutAct_9fa48("1082") ? foundLesson : (stryCov_9fa48("1082", "1083", "1084"), !foundLesson)) {
            if (stryMutAct_9fa48("1085")) {
              {}
            } else {
              stryCov_9fa48("1085");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Get lesson progress
          const progress = await progressRepository.findSpecificLessonProgress(userId, courseId, foundUnitId, lessonId);
          res.json(successResponse(stryMutAct_9fa48("1086") ? {} : (stryCov_9fa48("1086"), {
            lesson: foundLesson,
            unitId: foundUnitId,
            progress: stryMutAct_9fa48("1089") ? progress && null : stryMutAct_9fa48("1088") ? false : stryMutAct_9fa48("1087") ? true : (stryCov_9fa48("1087", "1088", "1089"), progress || null)
          }), stryMutAct_9fa48("1090") ? "" : (stryCov_9fa48("1090"), 'Lesson details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1091")) {
          {}
        } else {
          stryCov_9fa48("1091");
          console.error(stryMutAct_9fa48("1092") ? "" : (stryCov_9fa48("1092"), 'Error fetching lesson details (legacy):'), error);
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
    if (stryMutAct_9fa48("1093")) {
      {}
    } else {
      stryCov_9fa48("1093");
      try {
        if (stryMutAct_9fa48("1094")) {
          {}
        } else {
          stryCov_9fa48("1094");
          const {
            courseId,
            lessonId
          } = req.params;
          const userId = req.user.id;
          const {
            score = 100,
            exercises = stryMutAct_9fa48("1095") ? ["Stryker was here"] : (stryCov_9fa48("1095"), [])
          } = stryMutAct_9fa48("1098") ? req.body && {} : stryMutAct_9fa48("1097") ? false : stryMutAct_9fa48("1096") ? true : (stryCov_9fa48("1096", "1097", "1098"), req.body || {});
          // Get course data to find unit ID
          const courseResult = await courseRepository.findCourseDataById(courseId, userId);
          if (stryMutAct_9fa48("1101") ? false : stryMutAct_9fa48("1100") ? true : stryMutAct_9fa48("1099") ? courseResult : (stryCov_9fa48("1099", "1100", "1101"), !courseResult)) {
            if (stryMutAct_9fa48("1102")) {
              {}
            } else {
              stryCov_9fa48("1102");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          const courseData = courseResult.course_data;

          // Find which unit contains this lesson
          let foundUnitId = null;
          let foundLesson = null;
          for (const unit of courseData.course.units) {
            if (stryMutAct_9fa48("1103")) {
              {}
            } else {
              stryCov_9fa48("1103");
              const lesson = unit.lessons.find(stryMutAct_9fa48("1104") ? () => undefined : (stryCov_9fa48("1104"), l => stryMutAct_9fa48("1107") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1106") ? false : stryMutAct_9fa48("1105") ? true : (stryCov_9fa48("1105", "1106", "1107"), l.id === parseInt(lessonId))));
              if (stryMutAct_9fa48("1109") ? false : stryMutAct_9fa48("1108") ? true : (stryCov_9fa48("1108", "1109"), lesson)) {
                if (stryMutAct_9fa48("1110")) {
                  {}
                } else {
                  stryCov_9fa48("1110");
                  foundUnitId = unit.id;
                  foundLesson = lesson;
                  break;
                }
              }
            }
          }
          if (stryMutAct_9fa48("1113") ? !foundUnitId && !foundLesson : stryMutAct_9fa48("1112") ? false : stryMutAct_9fa48("1111") ? true : (stryCov_9fa48("1111", "1112", "1113"), (stryMutAct_9fa48("1114") ? foundUnitId : (stryCov_9fa48("1114"), !foundUnitId)) || (stryMutAct_9fa48("1115") ? foundLesson : (stryCov_9fa48("1115"), !foundLesson)))) {
            if (stryMutAct_9fa48("1116")) {
              {}
            } else {
              stryCov_9fa48("1116");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Validate exercise score - must get at least 3/5 correct
          if (stryMutAct_9fa48("1119") ? exercises || exercises.length > 0 : stryMutAct_9fa48("1118") ? false : stryMutAct_9fa48("1117") ? true : (stryCov_9fa48("1117", "1118", "1119"), exercises && (stryMutAct_9fa48("1122") ? exercises.length <= 0 : stryMutAct_9fa48("1121") ? exercises.length >= 0 : stryMutAct_9fa48("1120") ? true : (stryCov_9fa48("1120", "1121", "1122"), exercises.length > 0)))) {
            if (stryMutAct_9fa48("1123")) {
              {}
            } else {
              stryCov_9fa48("1123");
              const correctAnswers = stryMutAct_9fa48("1124") ? exercises.length : (stryCov_9fa48("1124"), exercises.filter(stryMutAct_9fa48("1125") ? () => undefined : (stryCov_9fa48("1125"), ex => stryMutAct_9fa48("1128") ? ex.isCorrect !== true : stryMutAct_9fa48("1127") ? false : stryMutAct_9fa48("1126") ? true : (stryCov_9fa48("1126", "1127", "1128"), ex.isCorrect === (stryMutAct_9fa48("1129") ? false : (stryCov_9fa48("1129"), true))))).length);
              const totalExercises = exercises.length;
              if (stryMutAct_9fa48("1132") ? totalExercises >= 5 || correctAnswers < 3 : stryMutAct_9fa48("1131") ? false : stryMutAct_9fa48("1130") ? true : (stryCov_9fa48("1130", "1131", "1132"), (stryMutAct_9fa48("1135") ? totalExercises < 5 : stryMutAct_9fa48("1134") ? totalExercises > 5 : stryMutAct_9fa48("1133") ? true : (stryCov_9fa48("1133", "1134", "1135"), totalExercises >= 5)) && (stryMutAct_9fa48("1138") ? correctAnswers >= 3 : stryMutAct_9fa48("1137") ? correctAnswers <= 3 : stryMutAct_9fa48("1136") ? true : (stryCov_9fa48("1136", "1137", "1138"), correctAnswers < 3)))) {
                if (stryMutAct_9fa48("1139")) {
                  {}
                } else {
                  stryCov_9fa48("1139");
                  return res.status(400).json(stryMutAct_9fa48("1140") ? {} : (stryCov_9fa48("1140"), {
                    success: stryMutAct_9fa48("1141") ? true : (stryCov_9fa48("1141"), false),
                    message: stryMutAct_9fa48("1142") ? "" : (stryCov_9fa48("1142"), 'You need at least 3 out of 5 correct answers to complete this lesson'),
                    data: stryMutAct_9fa48("1143") ? {} : (stryCov_9fa48("1143"), {
                      correctAnswers,
                      totalExercises,
                      passed: stryMutAct_9fa48("1144") ? true : (stryCov_9fa48("1144"), false)
                    })
                  }));
                }
              }
            }
          }

          // Get lesson database ID from course_lessons table
          const lessonDbId = await courseRepository.findLessonDbId(courseId, foundUnitId, lessonId);
          if (stryMutAct_9fa48("1147") ? false : stryMutAct_9fa48("1146") ? true : stryMutAct_9fa48("1145") ? lessonDbId : (stryCov_9fa48("1145", "1146", "1147"), !lessonDbId)) {
            if (stryMutAct_9fa48("1148")) {
              {}
            } else {
              stryCov_9fa48("1148");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }
          const xpEarned = stryMutAct_9fa48("1151") ? foundLesson.xpReward && 50 : stryMutAct_9fa48("1150") ? false : stryMutAct_9fa48("1149") ? true : (stryCov_9fa48("1149", "1150", "1151"), foundLesson.xpReward || 50);

          // Check if lesson already completed
          const existingProgress = await progressRepository.findSpecificLessonProgress(userId, courseId, foundUnitId, lessonId);
          if (stryMutAct_9fa48("1154") ? existingProgress || existingProgress.is_completed : stryMutAct_9fa48("1153") ? false : stryMutAct_9fa48("1152") ? true : (stryCov_9fa48("1152", "1153", "1154"), existingProgress && existingProgress.is_completed)) {
            if (stryMutAct_9fa48("1155")) {
              {}
            } else {
              stryCov_9fa48("1155");
              throw ERRORS.LESSON_ALREADY_COMPLETED;
            }
          }

          // Mark lesson as complete
          await progressRepository.upsertLessonProgress(userId, courseId, foundUnitId, lessonDbId, score, xpEarned);

          // Save exercise attempts
          for (let i = 0; stryMutAct_9fa48("1158") ? i >= exercises.length : stryMutAct_9fa48("1157") ? i <= exercises.length : stryMutAct_9fa48("1156") ? false : (stryCov_9fa48("1156", "1157", "1158"), i < exercises.length); stryMutAct_9fa48("1159") ? i-- : (stryCov_9fa48("1159"), i++)) {
            if (stryMutAct_9fa48("1160")) {
              {}
            } else {
              stryCov_9fa48("1160");
              const exercise = exercises[i];
              await progressRepository.createExerciseAttempt(userId, courseId, foundUnitId, lessonDbId, i, stryMutAct_9fa48("1163") ? exercise.isCorrect && false : stryMutAct_9fa48("1162") ? false : stryMutAct_9fa48("1161") ? true : (stryCov_9fa48("1161", "1162", "1163"), exercise.isCorrect || (stryMutAct_9fa48("1164") ? true : (stryCov_9fa48("1164"), false))), stryMutAct_9fa48("1167") ? exercise.userAnswer && '' : stryMutAct_9fa48("1166") ? false : stryMutAct_9fa48("1165") ? true : (stryCov_9fa48("1165", "1166", "1167"), exercise.userAnswer || (stryMutAct_9fa48("1168") ? "Stryker was here!" : (stryCov_9fa48("1168"), ''))));
            }
          }

          // Check if all lessons in unit are completed
          const unit = courseData.course.units.find(stryMutAct_9fa48("1169") ? () => undefined : (stryCov_9fa48("1169"), u => stryMutAct_9fa48("1172") ? u.id !== foundUnitId : stryMutAct_9fa48("1171") ? false : stryMutAct_9fa48("1170") ? true : (stryCov_9fa48("1170", "1171", "1172"), u.id === foundUnitId)));
          const totalLessonsInUnit = unit.lessons.length;
          const completedLessons = await progressRepository.countCompletedLessonsInUnit(userId, courseId, foundUnitId);
          let unitCompleted = stryMutAct_9fa48("1173") ? true : (stryCov_9fa48("1173"), false);
          if (stryMutAct_9fa48("1177") ? completedLessons < totalLessonsInUnit : stryMutAct_9fa48("1176") ? completedLessons > totalLessonsInUnit : stryMutAct_9fa48("1175") ? false : stryMutAct_9fa48("1174") ? true : (stryCov_9fa48("1174", "1175", "1176", "1177"), completedLessons >= totalLessonsInUnit)) {
            if (stryMutAct_9fa48("1178")) {
              {}
            } else {
              stryCov_9fa48("1178");
              // Mark unit as complete
              await progressRepository.markUnitComplete(userId, courseId, foundUnitId);

              // Unlock next unit
              const nextUnitId = stryMutAct_9fa48("1179") ? foundUnitId - 1 : (stryCov_9fa48("1179"), foundUnitId + 1);
              const nextUnit = courseData.course.units.find(stryMutAct_9fa48("1180") ? () => undefined : (stryCov_9fa48("1180"), u => stryMutAct_9fa48("1183") ? u.id !== nextUnitId : stryMutAct_9fa48("1182") ? false : stryMutAct_9fa48("1181") ? true : (stryCov_9fa48("1181", "1182", "1183"), u.id === nextUnitId)));
              if (stryMutAct_9fa48("1185") ? false : stryMutAct_9fa48("1184") ? true : (stryCov_9fa48("1184", "1185"), nextUnit)) {
                if (stryMutAct_9fa48("1186")) {
                  {}
                } else {
                  stryCov_9fa48("1186");
                  await progressRepository.unlockUnit(userId, courseId, nextUnitId);
                }
              }
              unitCompleted = stryMutAct_9fa48("1187") ? false : (stryCov_9fa48("1187"), true);
            }
          }

          // Update user stats (only streak tracking now)
          const today = new Date().toISOString().split(stryMutAct_9fa48("1188") ? "" : (stryCov_9fa48("1188"), 'T'))[0];
          const stats = await progressRepository.findUserStats(userId, courseId);
          if (stryMutAct_9fa48("1191") ? false : stryMutAct_9fa48("1190") ? true : stryMutAct_9fa48("1189") ? stats : (stryCov_9fa48("1189", "1190", "1191"), !stats)) {
            if (stryMutAct_9fa48("1192")) {
              {}
            } else {
              stryCov_9fa48("1192");
              // Create new stats (only for streak tracking)
              await progressRepository.createUserStats(userId, courseId, 0, 0, today);
            }
          } else {
            if (stryMutAct_9fa48("1193")) {
              {}
            } else {
              stryCov_9fa48("1193");
              // Update only streak information
              const lastDate = stats.last_activity_date ? new Date(stats.last_activity_date).toISOString().split(stryMutAct_9fa48("1194") ? "" : (stryCov_9fa48("1194"), 'T'))[0] : null;
              const yesterday = new Date();
              stryMutAct_9fa48("1195") ? yesterday.setTime(yesterday.getDate() - 1) : (stryCov_9fa48("1195"), yesterday.setDate(stryMutAct_9fa48("1196") ? yesterday.getDate() + 1 : (stryCov_9fa48("1196"), yesterday.getDate() - 1)));
              const yesterdayStr = yesterday.toISOString().split(stryMutAct_9fa48("1197") ? "" : (stryCov_9fa48("1197"), 'T'))[0];
              let newStreak = 1;
              if (stryMutAct_9fa48("1200") ? lastDate !== yesterdayStr : stryMutAct_9fa48("1199") ? false : stryMutAct_9fa48("1198") ? true : (stryCov_9fa48("1198", "1199", "1200"), lastDate === yesterdayStr)) {
                if (stryMutAct_9fa48("1201")) {
                  {}
                } else {
                  stryCov_9fa48("1201");
                  newStreak = stryMutAct_9fa48("1202") ? stats.current_streak - 1 : (stryCov_9fa48("1202"), stats.current_streak + 1);
                }
              } else if (stryMutAct_9fa48("1205") ? lastDate !== today : stryMutAct_9fa48("1204") ? false : stryMutAct_9fa48("1203") ? true : (stryCov_9fa48("1203", "1204", "1205"), lastDate === today)) {
                if (stryMutAct_9fa48("1206")) {
                  {}
                } else {
                  stryCov_9fa48("1206");
                  newStreak = stats.current_streak;
                }
              }
              await progressRepository.updateUserStreak(userId, courseId, newStreak, today);
            }
          }
          console.log(stryMutAct_9fa48("1207") ? `` : (stryCov_9fa48("1207"), `✅ Lesson ${lessonId} completed! XP: ${xpEarned}, Unit completed: ${unitCompleted}`));
          res.json(successResponse(stryMutAct_9fa48("1208") ? {} : (stryCov_9fa48("1208"), {
            xpEarned,
            unitCompleted,
            nextLessonId: stryMutAct_9fa48("1209") ? foundLesson.id - 1 : (stryCov_9fa48("1209"), foundLesson.id + 1)
          }), unitCompleted ? stryMutAct_9fa48("1210") ? "" : (stryCov_9fa48("1210"), 'Unit completed! Next unit unlocked!') : stryMutAct_9fa48("1211") ? "" : (stryCov_9fa48("1211"), 'Lesson completed!')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1212")) {
          {}
        } else {
          stryCov_9fa48("1212");
          console.error(stryMutAct_9fa48("1213") ? "" : (stryCov_9fa48("1213"), 'Error completing lesson (legacy):'), error);
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
    if (stryMutAct_9fa48("1214")) {
      {}
    } else {
      stryCov_9fa48("1214");
      try {
        if (stryMutAct_9fa48("1215")) {
          {}
        } else {
          stryCov_9fa48("1215");
          const {
            courseId,
            unitId,
            lessonId
          } = req.params;
          const userId = req.user.id;
          console.log(stryMutAct_9fa48("1216") ? `` : (stryCov_9fa48("1216"), `🎯 Generating exercises for lesson ${lessonId}...`));

          // Get course data to find the lesson
          const courseResult = await courseRepository.findCourseDataById(courseId, userId);
          if (stryMutAct_9fa48("1219") ? false : stryMutAct_9fa48("1218") ? true : stryMutAct_9fa48("1217") ? courseResult : (stryCov_9fa48("1217", "1218", "1219"), !courseResult)) {
            if (stryMutAct_9fa48("1220")) {
              {}
            } else {
              stryCov_9fa48("1220");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          const courseData = courseResult.course_data;
          const unit = courseData.course.units.find(stryMutAct_9fa48("1221") ? () => undefined : (stryCov_9fa48("1221"), u => stryMutAct_9fa48("1224") ? u.id !== parseInt(unitId) : stryMutAct_9fa48("1223") ? false : stryMutAct_9fa48("1222") ? true : (stryCov_9fa48("1222", "1223", "1224"), u.id === parseInt(unitId))));
          const lesson = stryMutAct_9fa48("1225") ? unit.lessons.find(l => l.id === parseInt(lessonId)) : (stryCov_9fa48("1225"), unit?.lessons.find(stryMutAct_9fa48("1226") ? () => undefined : (stryCov_9fa48("1226"), l => stryMutAct_9fa48("1229") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1228") ? false : stryMutAct_9fa48("1227") ? true : (stryCov_9fa48("1227", "1228", "1229"), l.id === parseInt(lessonId)))));
          if (stryMutAct_9fa48("1232") ? false : stryMutAct_9fa48("1231") ? true : stryMutAct_9fa48("1230") ? lesson : (stryCov_9fa48("1230", "1231", "1232"), !lesson)) {
            if (stryMutAct_9fa48("1233")) {
              {}
            } else {
              stryCov_9fa48("1233");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Generate 5 new MCQ exercises using Gemini
          const exercisesData = await geminiService.generateExercises(lesson.title, lesson.type, courseData.course.language);

          // Update the lesson exercises in the database
          const lessonDbId = await courseRepository.findLessonDbId(courseId, parseInt(unitId), parseInt(lessonId));
          if (stryMutAct_9fa48("1236") ? false : stryMutAct_9fa48("1235") ? true : stryMutAct_9fa48("1234") ? lessonDbId : (stryCov_9fa48("1234", "1235", "1236"), !lessonDbId)) {
            if (stryMutAct_9fa48("1237")) {
              {}
            } else {
              stryCov_9fa48("1237");
              throw ERRORS.LESSON_NOT_FOUND;
            }
          }

          // Update lesson with new exercises
          await courseRepository.updateLessonExercises(lessonDbId, exercisesData.exercises);

          // Also update the course_data JSON
          lesson.exercises = exercisesData.exercises;
          await courseRepository.updateCourseData(courseId, courseData);
          console.log(stryMutAct_9fa48("1238") ? `` : (stryCov_9fa48("1238"), `✅ Generated ${exercisesData.exercises.length} exercises for lesson ${lessonId}`));
          res.json(successResponse(stryMutAct_9fa48("1239") ? {} : (stryCov_9fa48("1239"), {
            exercises: exercisesData.exercises
          }), stryMutAct_9fa48("1240") ? "" : (stryCov_9fa48("1240"), 'Exercises generated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1241")) {
          {}
        } else {
          stryCov_9fa48("1241");
          console.error(stryMutAct_9fa48("1242") ? "" : (stryCov_9fa48("1242"), 'Error generating lesson exercises:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Delete a course completely (all related data)
   */
  async deleteCourse(req, res, next) {
    if (stryMutAct_9fa48("1243")) {
      {}
    } else {
      stryCov_9fa48("1243");
      try {
        if (stryMutAct_9fa48("1244")) {
          {}
        } else {
          stryCov_9fa48("1244");
          const {
            courseId
          } = req.params;
          const userId = req.user.id;
          console.log(stryMutAct_9fa48("1245") ? `` : (stryCov_9fa48("1245"), `🗑️  Deleting course ${courseId} for user ${userId}...`));
          const deleted = await courseRepository.deleteCourse(courseId, userId);
          if (stryMutAct_9fa48("1248") ? false : stryMutAct_9fa48("1247") ? true : stryMutAct_9fa48("1246") ? deleted : (stryCov_9fa48("1246", "1247", "1248"), !deleted)) {
            if (stryMutAct_9fa48("1249")) {
              {}
            } else {
              stryCov_9fa48("1249");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          console.log(stryMutAct_9fa48("1250") ? `` : (stryCov_9fa48("1250"), `✅ Course ${courseId} deleted successfully`));
          res.json(successResponse(stryMutAct_9fa48("1251") ? {} : (stryCov_9fa48("1251"), {
            courseId: parseInt(courseId)
          }), stryMutAct_9fa48("1252") ? "" : (stryCov_9fa48("1252"), 'Course and all related data deleted successfully!')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1253")) {
          {}
        } else {
          stryCov_9fa48("1253");
          console.error(stryMutAct_9fa48("1254") ? "" : (stryCov_9fa48("1254"), 'Error deleting course:'), error);
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
    if (stryMutAct_9fa48("1255")) {
      {}
    } else {
      stryCov_9fa48("1255");
      try {
        if (stryMutAct_9fa48("1256")) {
          {}
        } else {
          stryCov_9fa48("1256");
          console.log(stryMutAct_9fa48("1257") ? "" : (stryCov_9fa48("1257"), '📚 Fetching published languages...'));
          const languages = await courseRepository.getPublishedLanguages();
          res.json(listResponse(languages, stryMutAct_9fa48("1258") ? "" : (stryCov_9fa48("1258"), 'Published languages retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1259")) {
          {}
        } else {
          stryCov_9fa48("1259");
          console.error(stryMutAct_9fa48("1260") ? "" : (stryCov_9fa48("1260"), 'Error fetching published languages:'), error);
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
    if (stryMutAct_9fa48("1261")) {
      {}
    } else {
      stryCov_9fa48("1261");
      try {
        if (stryMutAct_9fa48("1262")) {
          {}
        } else {
          stryCov_9fa48("1262");
          const {
            language
          } = req.params;
          console.log(stryMutAct_9fa48("1263") ? `` : (stryCov_9fa48("1263"), `📖 Fetching published courses for language: ${language}`));
          if (stryMutAct_9fa48("1266") ? false : stryMutAct_9fa48("1265") ? true : stryMutAct_9fa48("1264") ? language : (stryCov_9fa48("1264", "1265", "1266"), !language)) {
            if (stryMutAct_9fa48("1267")) {
              {}
            } else {
              stryCov_9fa48("1267");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }
          const courses = await courseRepository.getPublishedCoursesByLanguage(language);
          res.json(listResponse(courses, stryMutAct_9fa48("1268") ? `` : (stryCov_9fa48("1268"), `Published courses for ${language} retrieved successfully`)));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1269")) {
          {}
        } else {
          stryCov_9fa48("1269");
          console.error(stryMutAct_9fa48("1270") ? "" : (stryCov_9fa48("1270"), 'Error fetching published courses:'), error);
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
    if (stryMutAct_9fa48("1271")) {
      {}
    } else {
      stryCov_9fa48("1271");
      try {
        if (stryMutAct_9fa48("1272")) {
          {}
        } else {
          stryCov_9fa48("1272");
          const {
            courseId
          } = req.params;
          console.log(stryMutAct_9fa48("1273") ? `` : (stryCov_9fa48("1273"), `📕 Fetching published course details for ID: ${courseId}`));
          if (stryMutAct_9fa48("1276") ? false : stryMutAct_9fa48("1275") ? true : stryMutAct_9fa48("1274") ? courseId : (stryCov_9fa48("1274", "1275", "1276"), !courseId)) {
            if (stryMutAct_9fa48("1277")) {
              {}
            } else {
              stryCov_9fa48("1277");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }
          const course = await courseRepository.getPublishedCourseDetails(courseId);
          if (stryMutAct_9fa48("1280") ? false : stryMutAct_9fa48("1279") ? true : stryMutAct_9fa48("1278") ? course : (stryCov_9fa48("1278", "1279", "1280"), !course)) {
            if (stryMutAct_9fa48("1281")) {
              {}
            } else {
              stryCov_9fa48("1281");
              throw ERRORS.COURSE_NOT_FOUND;
            }
          }
          res.json(successResponse(course, stryMutAct_9fa48("1282") ? "" : (stryCov_9fa48("1282"), 'Published course details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1283")) {
          {}
        } else {
          stryCov_9fa48("1283");
          console.error(stryMutAct_9fa48("1284") ? "" : (stryCov_9fa48("1284"), 'Error fetching published course details:'), error);
          next(error);
        }
      }
    }
  }
}
export default new CourseController();