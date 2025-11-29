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
import courseRepository from '../repositories/courseRepository.js';
import progressRepository from '../repositories/progressRepository.js';
import analyticsService from '../services/analyticsService.js';
import { successResponse, listResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';

/**
 * Get user's course progress
 */
const getCourseProgress = async (req, res, next) => {
  if (stryMutAct_9fa48("1487")) {
    {}
  } else {
    stryCov_9fa48("1487");
    try {
      if (stryMutAct_9fa48("1488")) {
        {}
      } else {
        stryCov_9fa48("1488");
        const userId = req.user.id;
        const {
          courseId
        } = req.params;

        // Get course data
        const course = await courseRepository.findCourseById(courseId, userId);
        if (stryMutAct_9fa48("1491") ? false : stryMutAct_9fa48("1490") ? true : stryMutAct_9fa48("1489") ? course : (stryCov_9fa48("1489", "1490", "1491"), !course)) {
          if (stryMutAct_9fa48("1492")) {
            {}
          } else {
            stryCov_9fa48("1492");
            throw ERRORS.COURSE_NOT_FOUND;
          }
        }

        // Get unit progress
        const unitProgress = await progressRepository.findUnitProgress(userId, courseId);

        // Get lesson progress
        const lessonProgress = await progressRepository.findLessonProgress(userId, courseId);

        // Get user stats
        const stats = await progressRepository.findUserStats(userId, courseId);
        res.json(successResponse(stryMutAct_9fa48("1493") ? {} : (stryCov_9fa48("1493"), {
          course: stryMutAct_9fa48("1496") ? course.course_data && {} : stryMutAct_9fa48("1495") ? false : stryMutAct_9fa48("1494") ? true : (stryCov_9fa48("1494", "1495", "1496"), course.course_data || {}),
          unitProgress: unitProgress,
          lessonProgress: lessonProgress,
          stats: stryMutAct_9fa48("1499") ? stats && {
            total_xp: 0,
            lessons_completed: 0,
            units_completed: 0,
            current_streak: 0,
            longest_streak: 0
          } : stryMutAct_9fa48("1498") ? false : stryMutAct_9fa48("1497") ? true : (stryCov_9fa48("1497", "1498", "1499"), stats || (stryMutAct_9fa48("1500") ? {} : (stryCov_9fa48("1500"), {
            total_xp: 0,
            lessons_completed: 0,
            units_completed: 0,
            current_streak: 0,
            longest_streak: 0
          })))
        }), stryMutAct_9fa48("1501") ? "" : (stryCov_9fa48("1501"), 'Course progress retrieved successfully')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1502")) {
        {}
      } else {
        stryCov_9fa48("1502");
        console.error(stryMutAct_9fa48("1503") ? "" : (stryCov_9fa48("1503"), 'Error fetching course progress:'), error);
        next(error);
      }
    }
  }
};

/**
 * Mark lesson as complete
 */
const markLessonComplete = async (req, res, next) => {
  if (stryMutAct_9fa48("1504")) {
    {}
  } else {
    stryCov_9fa48("1504");
    try {
      if (stryMutAct_9fa48("1505")) {
        {}
      } else {
        stryCov_9fa48("1505");
        const userId = req.user.id;
        const {
          courseId,
          unitId,
          lessonId
        } = req.params;
        const {
          score = 100,
          exercises = stryMutAct_9fa48("1506") ? ["Stryker was here"] : (stryCov_9fa48("1506"), [])
        } = stryMutAct_9fa48("1509") ? req.body && {} : stryMutAct_9fa48("1508") ? false : stryMutAct_9fa48("1507") ? true : (stryCov_9fa48("1507", "1508", "1509"), req.body || {});

        // Get course data to calculate XP
        const courseResult = await courseRepository.findCourseDataById(courseId, userId);
        if (stryMutAct_9fa48("1512") ? false : stryMutAct_9fa48("1511") ? true : stryMutAct_9fa48("1510") ? courseResult : (stryCov_9fa48("1510", "1511", "1512"), !courseResult)) {
          if (stryMutAct_9fa48("1513")) {
            {}
          } else {
            stryCov_9fa48("1513");
            throw ERRORS.COURSE_NOT_FOUND;
          }
        }
        const courseData = courseResult.course_data;
        const unit = courseData.course.units.find(stryMutAct_9fa48("1514") ? () => undefined : (stryCov_9fa48("1514"), u => stryMutAct_9fa48("1517") ? u.id !== parseInt(unitId) : stryMutAct_9fa48("1516") ? false : stryMutAct_9fa48("1515") ? true : (stryCov_9fa48("1515", "1516", "1517"), u.id === parseInt(unitId))));
        const lesson = stryMutAct_9fa48("1518") ? unit.lessons.find(l => l.id === parseInt(lessonId)) : (stryCov_9fa48("1518"), unit?.lessons.find(stryMutAct_9fa48("1519") ? () => undefined : (stryCov_9fa48("1519"), l => stryMutAct_9fa48("1522") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1521") ? false : stryMutAct_9fa48("1520") ? true : (stryCov_9fa48("1520", "1521", "1522"), l.id === parseInt(lessonId)))));
        if (stryMutAct_9fa48("1525") ? false : stryMutAct_9fa48("1524") ? true : stryMutAct_9fa48("1523") ? lesson : (stryCov_9fa48("1523", "1524", "1525"), !lesson)) {
          if (stryMutAct_9fa48("1526")) {
            {}
          } else {
            stryCov_9fa48("1526");
            throw ERRORS.LESSON_NOT_FOUND;
          }
        }

        // Validate exercise score - must get at least 3/5 correct
        if (stryMutAct_9fa48("1529") ? exercises || exercises.length > 0 : stryMutAct_9fa48("1528") ? false : stryMutAct_9fa48("1527") ? true : (stryCov_9fa48("1527", "1528", "1529"), exercises && (stryMutAct_9fa48("1532") ? exercises.length <= 0 : stryMutAct_9fa48("1531") ? exercises.length >= 0 : stryMutAct_9fa48("1530") ? true : (stryCov_9fa48("1530", "1531", "1532"), exercises.length > 0)))) {
          if (stryMutAct_9fa48("1533")) {
            {}
          } else {
            stryCov_9fa48("1533");
            const correctAnswers = stryMutAct_9fa48("1534") ? exercises.length : (stryCov_9fa48("1534"), exercises.filter(stryMutAct_9fa48("1535") ? () => undefined : (stryCov_9fa48("1535"), ex => stryMutAct_9fa48("1538") ? ex.isCorrect !== true : stryMutAct_9fa48("1537") ? false : stryMutAct_9fa48("1536") ? true : (stryCov_9fa48("1536", "1537", "1538"), ex.isCorrect === (stryMutAct_9fa48("1539") ? false : (stryCov_9fa48("1539"), true))))).length);
            const totalExercises = exercises.length;
            if (stryMutAct_9fa48("1542") ? totalExercises >= 5 || correctAnswers < 3 : stryMutAct_9fa48("1541") ? false : stryMutAct_9fa48("1540") ? true : (stryCov_9fa48("1540", "1541", "1542"), (stryMutAct_9fa48("1545") ? totalExercises < 5 : stryMutAct_9fa48("1544") ? totalExercises > 5 : stryMutAct_9fa48("1543") ? true : (stryCov_9fa48("1543", "1544", "1545"), totalExercises >= 5)) && (stryMutAct_9fa48("1548") ? correctAnswers >= 3 : stryMutAct_9fa48("1547") ? correctAnswers <= 3 : stryMutAct_9fa48("1546") ? true : (stryCov_9fa48("1546", "1547", "1548"), correctAnswers < 3)))) {
              if (stryMutAct_9fa48("1549")) {
                {}
              } else {
                stryCov_9fa48("1549");
                return res.status(400).json(stryMutAct_9fa48("1550") ? {} : (stryCov_9fa48("1550"), {
                  success: stryMutAct_9fa48("1551") ? true : (stryCov_9fa48("1551"), false),
                  message: stryMutAct_9fa48("1552") ? "" : (stryCov_9fa48("1552"), 'You need at least 3 out of 5 correct answers to complete this lesson'),
                  data: stryMutAct_9fa48("1553") ? {} : (stryCov_9fa48("1553"), {
                    correctAnswers,
                    totalExercises,
                    passed: stryMutAct_9fa48("1554") ? true : (stryCov_9fa48("1554"), false)
                  })
                }));
              }
            }
          }
        }
        const xpEarned = stryMutAct_9fa48("1557") ? lesson.xpReward && 50 : stryMutAct_9fa48("1556") ? false : stryMutAct_9fa48("1555") ? true : (stryCov_9fa48("1555", "1556", "1557"), lesson.xpReward || 50);

        // Calculate vocabulary from lesson data
        const vocabularyCount = stryMutAct_9fa48("1560") ? lesson.vocabulary?.length && 0 : stryMutAct_9fa48("1559") ? false : stryMutAct_9fa48("1558") ? true : (stryCov_9fa48("1558", "1559", "1560"), (stryMutAct_9fa48("1561") ? lesson.vocabulary.length : (stryCov_9fa48("1561"), lesson.vocabulary?.length)) || 0);
        const vocabularyMastered = Math.round(stryMutAct_9fa48("1562") ? vocabularyCount / (score / 100) : (stryCov_9fa48("1562"), vocabularyCount * (stryMutAct_9fa48("1563") ? score * 100 : (stryCov_9fa48("1563"), score / 100)))); // Mastered based on score

        // Get lesson database ID from course_lessons table
        const lessonDbId = await courseRepository.findLessonDbId(courseId, parseInt(unitId), parseInt(lessonId));
        if (stryMutAct_9fa48("1566") ? false : stryMutAct_9fa48("1565") ? true : stryMutAct_9fa48("1564") ? lessonDbId : (stryCov_9fa48("1564", "1565", "1566"), !lessonDbId)) {
          if (stryMutAct_9fa48("1567")) {
            {}
          } else {
            stryCov_9fa48("1567");
            throw ERRORS.LESSON_NOT_FOUND;
          }
        }

        // Check if lesson already completed
        const existingProgress = await progressRepository.findSpecificLessonProgress(userId, courseId, parseInt(unitId), parseInt(lessonId));
        if (stryMutAct_9fa48("1570") ? existingProgress || existingProgress.is_completed : stryMutAct_9fa48("1569") ? false : stryMutAct_9fa48("1568") ? true : (stryCov_9fa48("1568", "1569", "1570"), existingProgress && existingProgress.is_completed)) {
          if (stryMutAct_9fa48("1571")) {
            {}
          } else {
            stryCov_9fa48("1571");
            throw ERRORS.LESSON_ALREADY_COMPLETED;
          }
        }

        // Mark lesson as complete with vocabulary data
        await progressRepository.upsertLessonProgress(userId, courseId, parseInt(unitId), lessonDbId, score, xpEarned, vocabularyMastered, vocabularyCount);

        // Determine module type based on course metadata
        const moduleType = (stryMutAct_9fa48("1574") ? courseResult.course_data?.metadata?.createdBy !== 'admin' : stryMutAct_9fa48("1573") ? false : stryMutAct_9fa48("1572") ? true : (stryCov_9fa48("1572", "1573", "1574"), (stryMutAct_9fa48("1576") ? courseResult.course_data.metadata?.createdBy : stryMutAct_9fa48("1575") ? courseResult.course_data?.metadata.createdBy : (stryCov_9fa48("1575", "1576"), courseResult.course_data?.metadata?.createdBy)) === (stryMutAct_9fa48("1577") ? "" : (stryCov_9fa48("1577"), 'admin')))) ? stryMutAct_9fa48("1578") ? "" : (stryCov_9fa48("1578"), 'ADMIN') : stryMutAct_9fa48("1579") ? "" : (stryCov_9fa48("1579"), 'AI');
        // Resolve language reliably (row column or embedded course_data)
        const languageName = stryMutAct_9fa48("1582") ? (courseResult.language || courseData?.course?.language || courseData?.metadata?.language) && null : stryMutAct_9fa48("1581") ? false : stryMutAct_9fa48("1580") ? true : (stryCov_9fa48("1580", "1581", "1582"), (stryMutAct_9fa48("1584") ? (courseResult.language || courseData?.course?.language) && courseData?.metadata?.language : stryMutAct_9fa48("1583") ? false : (stryCov_9fa48("1583", "1584"), (stryMutAct_9fa48("1586") ? courseResult.language && courseData?.course?.language : stryMutAct_9fa48("1585") ? false : (stryCov_9fa48("1585", "1586"), courseResult.language || (stryMutAct_9fa48("1588") ? courseData.course?.language : stryMutAct_9fa48("1587") ? courseData?.course.language : (stryCov_9fa48("1587", "1588"), courseData?.course?.language)))) || (stryMutAct_9fa48("1590") ? courseData.metadata?.language : stryMutAct_9fa48("1589") ? courseData?.metadata.language : (stryCov_9fa48("1589", "1590"), courseData?.metadata?.language)))) || null);

        // Track lesson completion for analytics
        try {
          if (stryMutAct_9fa48("1591")) {
            {}
          } else {
            stryCov_9fa48("1591");
            console.log(stryMutAct_9fa48("1592") ? "" : (stryCov_9fa48("1592"), '🔍 Analytics Debug - Tracking lesson completion:'), stryMutAct_9fa48("1593") ? {} : (stryCov_9fa48("1593"), {
              userId,
              language: languageName,
              moduleType,
              lessonId: parseInt(lessonId),
              courseId: parseInt(courseId)
            }));
            await analyticsService.trackLessonCompletion(userId, languageName, moduleType, null, // duration - we don't track this yet
            stryMutAct_9fa48("1594") ? {} : (stryCov_9fa48("1594"), {
              lessonId: parseInt(lessonId),
              unitId: parseInt(unitId),
              courseId: parseInt(courseId),
              score,
              xpEarned,
              exercisesCompleted: exercises.length
            }));
            console.log(stryMutAct_9fa48("1595") ? "" : (stryCov_9fa48("1595"), '✅ Analytics - Lesson completion tracked successfully'));
          }
        } catch (analyticsError) {
          if (stryMutAct_9fa48("1596")) {
            {}
          } else {
            stryCov_9fa48("1596");
            console.error(stryMutAct_9fa48("1597") ? "" : (stryCov_9fa48("1597"), '❌ Error tracking lesson completion analytics:'), analyticsError);
            // Don't fail the lesson completion if analytics fails
          }
        }

        // Save exercise attempts
        for (let i = 0; stryMutAct_9fa48("1600") ? i >= exercises.length : stryMutAct_9fa48("1599") ? i <= exercises.length : stryMutAct_9fa48("1598") ? false : (stryCov_9fa48("1598", "1599", "1600"), i < exercises.length); stryMutAct_9fa48("1601") ? i-- : (stryCov_9fa48("1601"), i++)) {
          if (stryMutAct_9fa48("1602")) {
            {}
          } else {
            stryCov_9fa48("1602");
            const exercise = exercises[i];
            await progressRepository.createExerciseAttempt(userId, courseId, parseInt(unitId), lessonDbId, i, exercise.isCorrect, exercise.userAnswer);
          }
        }

        // Check if all lessons in unit are completed
        const totalLessonsInUnit = unit.lessons.length;
        const completedLessons = await progressRepository.countCompletedLessonsInUnit(userId, courseId, parseInt(unitId));
        let unitCompleted = stryMutAct_9fa48("1603") ? true : (stryCov_9fa48("1603"), false);
        if (stryMutAct_9fa48("1607") ? completedLessons < totalLessonsInUnit : stryMutAct_9fa48("1606") ? completedLessons > totalLessonsInUnit : stryMutAct_9fa48("1605") ? false : stryMutAct_9fa48("1604") ? true : (stryCov_9fa48("1604", "1605", "1606", "1607"), completedLessons >= totalLessonsInUnit)) {
          if (stryMutAct_9fa48("1608")) {
            {}
          } else {
            stryCov_9fa48("1608");
            // Mark unit as complete
            await progressRepository.markUnitComplete(userId, courseId, parseInt(unitId));

            // Unlock next unit
            const nextUnitId = stryMutAct_9fa48("1609") ? parseInt(unitId) - 1 : (stryCov_9fa48("1609"), parseInt(unitId) + 1);
            const nextUnit = courseData.course.units.find(stryMutAct_9fa48("1610") ? () => undefined : (stryCov_9fa48("1610"), u => stryMutAct_9fa48("1613") ? u.id !== nextUnitId : stryMutAct_9fa48("1612") ? false : stryMutAct_9fa48("1611") ? true : (stryCov_9fa48("1611", "1612", "1613"), u.id === nextUnitId)));
            if (stryMutAct_9fa48("1615") ? false : stryMutAct_9fa48("1614") ? true : (stryCov_9fa48("1614", "1615"), nextUnit)) {
              if (stryMutAct_9fa48("1616")) {
                {}
              } else {
                stryCov_9fa48("1616");
                await progressRepository.unlockUnit(userId, courseId, nextUnitId);
              }
            }
            unitCompleted = stryMutAct_9fa48("1617") ? false : (stryCov_9fa48("1617"), true);
          }
        }

        /// Update user stats (only streak tracking now)
        const today = new Date().toISOString().split(stryMutAct_9fa48("1618") ? "" : (stryCov_9fa48("1618"), 'T'))[0];
        const stats = await progressRepository.findUserStats(userId, courseId);
        if (stryMutAct_9fa48("1621") ? false : stryMutAct_9fa48("1620") ? true : stryMutAct_9fa48("1619") ? stats : (stryCov_9fa48("1619", "1620", "1621"), !stats)) {
          if (stryMutAct_9fa48("1622")) {
            {}
          } else {
            stryCov_9fa48("1622");
            // Create new stats (only for streak tracking)
            await progressRepository.createUserStats(userId, courseId, 0, 0, today);
          }
        } else {
          if (stryMutAct_9fa48("1623")) {
            {}
          } else {
            stryCov_9fa48("1623");
            // Update only streak information
            const lastDate = stats.last_activity_date ? new Date(stats.last_activity_date).toISOString().split(stryMutAct_9fa48("1624") ? "" : (stryCov_9fa48("1624"), 'T'))[0] : null;
            const yesterday = new Date();
            stryMutAct_9fa48("1625") ? yesterday.setTime(yesterday.getDate() - 1) : (stryCov_9fa48("1625"), yesterday.setDate(stryMutAct_9fa48("1626") ? yesterday.getDate() + 1 : (stryCov_9fa48("1626"), yesterday.getDate() - 1)));
            const yesterdayStr = yesterday.toISOString().split(stryMutAct_9fa48("1627") ? "" : (stryCov_9fa48("1627"), 'T'))[0];
            let newStreak = 1;
            if (stryMutAct_9fa48("1630") ? lastDate !== yesterdayStr : stryMutAct_9fa48("1629") ? false : stryMutAct_9fa48("1628") ? true : (stryCov_9fa48("1628", "1629", "1630"), lastDate === yesterdayStr)) {
              if (stryMutAct_9fa48("1631")) {
                {}
              } else {
                stryCov_9fa48("1631");
                newStreak = stryMutAct_9fa48("1632") ? stats.current_streak - 1 : (stryCov_9fa48("1632"), stats.current_streak + 1);
              }
            } else if (stryMutAct_9fa48("1635") ? lastDate !== today : stryMutAct_9fa48("1634") ? false : stryMutAct_9fa48("1633") ? true : (stryCov_9fa48("1633", "1634", "1635"), lastDate === today)) {
              if (stryMutAct_9fa48("1636")) {
                {}
              } else {
                stryCov_9fa48("1636");
                newStreak = stats.current_streak;
              }
            }
            await progressRepository.updateUserStreak(userId, courseId, newStreak, today);
          }
        }
        res.json(successResponse(stryMutAct_9fa48("1637") ? {} : (stryCov_9fa48("1637"), {
          xpEarned,
          unitCompleted
        }), unitCompleted ? stryMutAct_9fa48("1638") ? "" : (stryCov_9fa48("1638"), 'Unit completed! Next unit unlocked!') : stryMutAct_9fa48("1639") ? "" : (stryCov_9fa48("1639"), 'Lesson completed!')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1640")) {
        {}
      } else {
        stryCov_9fa48("1640");
        console.error(stryMutAct_9fa48("1641") ? "" : (stryCov_9fa48("1641"), 'Error marking lesson complete:'), error);
        next(error);
      }
    }
  }
};

/**
 * Get available courses for user
 */
const getUserCourses = async (req, res, next) => {
  if (stryMutAct_9fa48("1642")) {
    {}
  } else {
    stryCov_9fa48("1642");
    try {
      if (stryMutAct_9fa48("1643")) {
        {}
      } else {
        stryCov_9fa48("1643");
        const userId = req.user.id;
        console.log(stryMutAct_9fa48("1644") ? "" : (stryCov_9fa48("1644"), '👤 getUserCourses called for userId:'), userId);
        const courses = await courseRepository.findAllActiveCourses(userId);
        const coursesWithProgress = courses.map(stryMutAct_9fa48("1645") ? () => undefined : (stryCov_9fa48("1645"), course => stryMutAct_9fa48("1646") ? {} : (stryCov_9fa48("1646"), {
          id: course.id,
          language: course.language,
          title: course.title,
          description: course.description,
          sourceType: course.source_type,
          // 'ai' or 'admin' - important for frontend!
          totalLessons: course.total_lessons,
          totalUnits: course.total_units,
          createdAt: course.created_at,
          progress: stryMutAct_9fa48("1647") ? {} : (stryCov_9fa48("1647"), {
            totalXp: stryMutAct_9fa48("1650") ? course.total_xp && 0 : stryMutAct_9fa48("1649") ? false : stryMutAct_9fa48("1648") ? true : (stryCov_9fa48("1648", "1649", "1650"), course.total_xp || 0),
            lessonsCompleted: stryMutAct_9fa48("1653") ? course.lessons_completed && 0 : stryMutAct_9fa48("1652") ? false : stryMutAct_9fa48("1651") ? true : (stryCov_9fa48("1651", "1652", "1653"), course.lessons_completed || 0),
            unitsCompleted: stryMutAct_9fa48("1656") ? course.units_completed && 0 : stryMutAct_9fa48("1655") ? false : stryMutAct_9fa48("1654") ? true : (stryCov_9fa48("1654", "1655", "1656"), course.units_completed || 0),
            currentStreak: stryMutAct_9fa48("1659") ? course.current_streak && 0 : stryMutAct_9fa48("1658") ? false : stryMutAct_9fa48("1657") ? true : (stryCov_9fa48("1657", "1658", "1659"), course.current_streak || 0)
          })
        })));
        console.log(stryMutAct_9fa48("1660") ? `` : (stryCov_9fa48("1660"), `📦 Returning ${coursesWithProgress.length} courses to user ${userId}`));
        res.json(listResponse(coursesWithProgress, stryMutAct_9fa48("1661") ? "" : (stryCov_9fa48("1661"), 'User courses retrieved successfully')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1662")) {
        {}
      } else {
        stryCov_9fa48("1662");
        console.error(stryMutAct_9fa48("1663") ? "" : (stryCov_9fa48("1663"), 'Error fetching user courses:'), error);
        next(error);
      }
    }
  }
};

/**
 * Initialize progress for a new course
 */
const initializeCourseProgress = async (courseId, userId) => {
  if (stryMutAct_9fa48("1664")) {
    {}
  } else {
    stryCov_9fa48("1664");
    try {
      if (stryMutAct_9fa48("1665")) {
        {}
      } else {
        stryCov_9fa48("1665");
        await progressRepository.initializeCourseProgress(courseId, userId);
      }
    } catch (error) {
      if (stryMutAct_9fa48("1666")) {
        {}
      } else {
        stryCov_9fa48("1666");
        console.error(stryMutAct_9fa48("1667") ? "" : (stryCov_9fa48("1667"), 'Error initializing course progress:'), error);
        throw error;
      }
    }
  }
};

/**
 * Get progress report with summary, timeline, and recent activity
 * Can be filtered by course
 */
const getProgressReport = async (req, res, next) => {
  if (stryMutAct_9fa48("1668")) {
    {}
  } else {
    stryCov_9fa48("1668");
    try {
      if (stryMutAct_9fa48("1669")) {
        {}
      } else {
        stryCov_9fa48("1669");
        const userId = req.user.id;
        const {
          range = stryMutAct_9fa48("1670") ? "" : (stryCov_9fa48("1670"), 'all'),
          courseId
        } = req.query;

        // Convert range to days (7d -> 7, 30d -> 30, all -> null)
        const days = (stryMutAct_9fa48("1673") ? range !== 'all' : stryMutAct_9fa48("1672") ? false : stryMutAct_9fa48("1671") ? true : (stryCov_9fa48("1671", "1672", "1673"), range === (stryMutAct_9fa48("1674") ? "" : (stryCov_9fa48("1674"), 'all')))) ? null : parseInt(range.replace(stryMutAct_9fa48("1675") ? "" : (stryCov_9fa48("1675"), 'd'), stryMutAct_9fa48("1676") ? "Stryker was here!" : (stryCov_9fa48("1676"), '')));
        const summary = await progressRepository.getSummaryKPIs(userId, days, courseId);
        const timeline = await progressRepository.getProgressOverTime(userId, days, courseId);
        const recentActivity = await progressRepository.getRecentActivity(userId, 5, courseId);
        res.json(successResponse(stryMutAct_9fa48("1677") ? {} : (stryCov_9fa48("1677"), {
          summary,
          timeline,
          recentActivity
        }), stryMutAct_9fa48("1678") ? "" : (stryCov_9fa48("1678"), 'Progress report retrieved successfully')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1679")) {
        {}
      } else {
        stryCov_9fa48("1679");
        console.error(stryMutAct_9fa48("1680") ? "" : (stryCov_9fa48("1680"), 'Error fetching progress report:'), error);
        next(error);
      }
    }
  }
};
export { getCourseProgress, markLessonComplete, getUserCourses, initializeCourseProgress, getProgressReport };