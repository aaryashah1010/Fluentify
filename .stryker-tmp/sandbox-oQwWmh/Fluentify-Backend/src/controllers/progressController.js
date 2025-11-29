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
  if (stryMutAct_9fa48("1508")) {
    {}
  } else {
    stryCov_9fa48("1508");
    try {
      if (stryMutAct_9fa48("1509")) {
        {}
      } else {
        stryCov_9fa48("1509");
        const userId = req.user.id;
        const {
          courseId
        } = req.params;

        // Get course data
        const course = await courseRepository.findCourseById(courseId, userId);
        if (stryMutAct_9fa48("1512") ? false : stryMutAct_9fa48("1511") ? true : stryMutAct_9fa48("1510") ? course : (stryCov_9fa48("1510", "1511", "1512"), !course)) {
          if (stryMutAct_9fa48("1513")) {
            {}
          } else {
            stryCov_9fa48("1513");
            throw ERRORS.COURSE_NOT_FOUND;
          }
        }

        // Get unit progress
        const unitProgress = await progressRepository.findUnitProgress(userId, courseId);

        // Get lesson progress
        const lessonProgress = await progressRepository.findLessonProgress(userId, courseId);

        // Get user stats
        const stats = await progressRepository.findUserStats(userId, courseId);
        res.json(successResponse(stryMutAct_9fa48("1514") ? {} : (stryCov_9fa48("1514"), {
          course: stryMutAct_9fa48("1517") ? course.course_data && {} : stryMutAct_9fa48("1516") ? false : stryMutAct_9fa48("1515") ? true : (stryCov_9fa48("1515", "1516", "1517"), course.course_data || {}),
          unitProgress: unitProgress,
          lessonProgress: lessonProgress,
          stats: stryMutAct_9fa48("1520") ? stats && {
            total_xp: 0,
            lessons_completed: 0,
            units_completed: 0,
            current_streak: 0,
            longest_streak: 0
          } : stryMutAct_9fa48("1519") ? false : stryMutAct_9fa48("1518") ? true : (stryCov_9fa48("1518", "1519", "1520"), stats || (stryMutAct_9fa48("1521") ? {} : (stryCov_9fa48("1521"), {
            total_xp: 0,
            lessons_completed: 0,
            units_completed: 0,
            current_streak: 0,
            longest_streak: 0
          })))
        }), stryMutAct_9fa48("1522") ? "" : (stryCov_9fa48("1522"), 'Course progress retrieved successfully')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1523")) {
        {}
      } else {
        stryCov_9fa48("1523");
        console.error(stryMutAct_9fa48("1524") ? "" : (stryCov_9fa48("1524"), 'Error fetching course progress:'), error);
        next(error);
      }
    }
  }
};

/**
 * Mark lesson as complete
 */
const markLessonComplete = async (req, res, next) => {
  if (stryMutAct_9fa48("1525")) {
    {}
  } else {
    stryCov_9fa48("1525");
    try {
      if (stryMutAct_9fa48("1526")) {
        {}
      } else {
        stryCov_9fa48("1526");
        const userId = req.user.id;
        const {
          courseId,
          unitId,
          lessonId
        } = req.params;
        const {
          score = 100,
          exercises = stryMutAct_9fa48("1527") ? ["Stryker was here"] : (stryCov_9fa48("1527"), [])
        } = stryMutAct_9fa48("1530") ? req.body && {} : stryMutAct_9fa48("1529") ? false : stryMutAct_9fa48("1528") ? true : (stryCov_9fa48("1528", "1529", "1530"), req.body || {});

        // Get course data to calculate XP
        const courseResult = await courseRepository.findCourseDataById(courseId, userId);
        if (stryMutAct_9fa48("1533") ? false : stryMutAct_9fa48("1532") ? true : stryMutAct_9fa48("1531") ? courseResult : (stryCov_9fa48("1531", "1532", "1533"), !courseResult)) {
          if (stryMutAct_9fa48("1534")) {
            {}
          } else {
            stryCov_9fa48("1534");
            throw ERRORS.COURSE_NOT_FOUND;
          }
        }
        const courseData = courseResult.course_data;
        const unit = courseData.course.units.find(stryMutAct_9fa48("1535") ? () => undefined : (stryCov_9fa48("1535"), u => stryMutAct_9fa48("1538") ? u.id !== parseInt(unitId) : stryMutAct_9fa48("1537") ? false : stryMutAct_9fa48("1536") ? true : (stryCov_9fa48("1536", "1537", "1538"), u.id === parseInt(unitId))));
        const lesson = stryMutAct_9fa48("1539") ? unit.lessons.find(l => l.id === parseInt(lessonId)) : (stryCov_9fa48("1539"), unit?.lessons.find(stryMutAct_9fa48("1540") ? () => undefined : (stryCov_9fa48("1540"), l => stryMutAct_9fa48("1543") ? l.id !== parseInt(lessonId) : stryMutAct_9fa48("1542") ? false : stryMutAct_9fa48("1541") ? true : (stryCov_9fa48("1541", "1542", "1543"), l.id === parseInt(lessonId)))));
        if (stryMutAct_9fa48("1546") ? false : stryMutAct_9fa48("1545") ? true : stryMutAct_9fa48("1544") ? lesson : (stryCov_9fa48("1544", "1545", "1546"), !lesson)) {
          if (stryMutAct_9fa48("1547")) {
            {}
          } else {
            stryCov_9fa48("1547");
            throw ERRORS.LESSON_NOT_FOUND;
          }
        }

        // Validate exercise score - must get at least 3/5 correct
        if (stryMutAct_9fa48("1550") ? exercises || exercises.length > 0 : stryMutAct_9fa48("1549") ? false : stryMutAct_9fa48("1548") ? true : (stryCov_9fa48("1548", "1549", "1550"), exercises && (stryMutAct_9fa48("1553") ? exercises.length <= 0 : stryMutAct_9fa48("1552") ? exercises.length >= 0 : stryMutAct_9fa48("1551") ? true : (stryCov_9fa48("1551", "1552", "1553"), exercises.length > 0)))) {
          if (stryMutAct_9fa48("1554")) {
            {}
          } else {
            stryCov_9fa48("1554");
            const correctAnswers = stryMutAct_9fa48("1555") ? exercises.length : (stryCov_9fa48("1555"), exercises.filter(stryMutAct_9fa48("1556") ? () => undefined : (stryCov_9fa48("1556"), ex => stryMutAct_9fa48("1559") ? ex.isCorrect !== true : stryMutAct_9fa48("1558") ? false : stryMutAct_9fa48("1557") ? true : (stryCov_9fa48("1557", "1558", "1559"), ex.isCorrect === (stryMutAct_9fa48("1560") ? false : (stryCov_9fa48("1560"), true))))).length);
            const totalExercises = exercises.length;
            if (stryMutAct_9fa48("1563") ? totalExercises >= 5 || correctAnswers < 3 : stryMutAct_9fa48("1562") ? false : stryMutAct_9fa48("1561") ? true : (stryCov_9fa48("1561", "1562", "1563"), (stryMutAct_9fa48("1566") ? totalExercises < 5 : stryMutAct_9fa48("1565") ? totalExercises > 5 : stryMutAct_9fa48("1564") ? true : (stryCov_9fa48("1564", "1565", "1566"), totalExercises >= 5)) && (stryMutAct_9fa48("1569") ? correctAnswers >= 3 : stryMutAct_9fa48("1568") ? correctAnswers <= 3 : stryMutAct_9fa48("1567") ? true : (stryCov_9fa48("1567", "1568", "1569"), correctAnswers < 3)))) {
              if (stryMutAct_9fa48("1570")) {
                {}
              } else {
                stryCov_9fa48("1570");
                return res.status(400).json(stryMutAct_9fa48("1571") ? {} : (stryCov_9fa48("1571"), {
                  success: stryMutAct_9fa48("1572") ? true : (stryCov_9fa48("1572"), false),
                  message: stryMutAct_9fa48("1573") ? "" : (stryCov_9fa48("1573"), 'You need at least 3 out of 5 correct answers to complete this lesson'),
                  data: stryMutAct_9fa48("1574") ? {} : (stryCov_9fa48("1574"), {
                    correctAnswers,
                    totalExercises,
                    passed: stryMutAct_9fa48("1575") ? true : (stryCov_9fa48("1575"), false)
                  })
                }));
              }
            }
          }
        }
        const xpEarned = stryMutAct_9fa48("1578") ? lesson.xpReward && 50 : stryMutAct_9fa48("1577") ? false : stryMutAct_9fa48("1576") ? true : (stryCov_9fa48("1576", "1577", "1578"), lesson.xpReward || 50);

        // Calculate vocabulary from lesson data
        const vocabularyCount = stryMutAct_9fa48("1581") ? lesson.vocabulary?.length && 0 : stryMutAct_9fa48("1580") ? false : stryMutAct_9fa48("1579") ? true : (stryCov_9fa48("1579", "1580", "1581"), (stryMutAct_9fa48("1582") ? lesson.vocabulary.length : (stryCov_9fa48("1582"), lesson.vocabulary?.length)) || 0);
        const vocabularyMastered = Math.round(stryMutAct_9fa48("1583") ? vocabularyCount / (score / 100) : (stryCov_9fa48("1583"), vocabularyCount * (stryMutAct_9fa48("1584") ? score * 100 : (stryCov_9fa48("1584"), score / 100)))); // Mastered based on score

        // Get lesson database ID from course_lessons table
        const lessonDbId = await courseRepository.findLessonDbId(courseId, parseInt(unitId), parseInt(lessonId));
        if (stryMutAct_9fa48("1587") ? false : stryMutAct_9fa48("1586") ? true : stryMutAct_9fa48("1585") ? lessonDbId : (stryCov_9fa48("1585", "1586", "1587"), !lessonDbId)) {
          if (stryMutAct_9fa48("1588")) {
            {}
          } else {
            stryCov_9fa48("1588");
            throw ERRORS.LESSON_NOT_FOUND;
          }
        }

        // Check if lesson already completed
        const existingProgress = await progressRepository.findSpecificLessonProgress(userId, courseId, parseInt(unitId), parseInt(lessonId));
        if (stryMutAct_9fa48("1591") ? existingProgress || existingProgress.is_completed : stryMutAct_9fa48("1590") ? false : stryMutAct_9fa48("1589") ? true : (stryCov_9fa48("1589", "1590", "1591"), existingProgress && existingProgress.is_completed)) {
          if (stryMutAct_9fa48("1592")) {
            {}
          } else {
            stryCov_9fa48("1592");
            throw ERRORS.LESSON_ALREADY_COMPLETED;
          }
        }

        // Mark lesson as complete with vocabulary data
        await progressRepository.upsertLessonProgress(userId, courseId, parseInt(unitId), lessonDbId, score, xpEarned, vocabularyMastered, vocabularyCount);

        // Determine module type based on course metadata
        const moduleType = (stryMutAct_9fa48("1595") ? courseResult.course_data?.metadata?.createdBy !== 'admin' : stryMutAct_9fa48("1594") ? false : stryMutAct_9fa48("1593") ? true : (stryCov_9fa48("1593", "1594", "1595"), (stryMutAct_9fa48("1597") ? courseResult.course_data.metadata?.createdBy : stryMutAct_9fa48("1596") ? courseResult.course_data?.metadata.createdBy : (stryCov_9fa48("1596", "1597"), courseResult.course_data?.metadata?.createdBy)) === (stryMutAct_9fa48("1598") ? "" : (stryCov_9fa48("1598"), 'admin')))) ? stryMutAct_9fa48("1599") ? "" : (stryCov_9fa48("1599"), 'ADMIN') : stryMutAct_9fa48("1600") ? "" : (stryCov_9fa48("1600"), 'AI');
        // Resolve language reliably (row column or embedded course_data)
        const languageName = stryMutAct_9fa48("1603") ? (courseResult.language || courseData?.course?.language || courseData?.metadata?.language) && null : stryMutAct_9fa48("1602") ? false : stryMutAct_9fa48("1601") ? true : (stryCov_9fa48("1601", "1602", "1603"), (stryMutAct_9fa48("1605") ? (courseResult.language || courseData?.course?.language) && courseData?.metadata?.language : stryMutAct_9fa48("1604") ? false : (stryCov_9fa48("1604", "1605"), (stryMutAct_9fa48("1607") ? courseResult.language && courseData?.course?.language : stryMutAct_9fa48("1606") ? false : (stryCov_9fa48("1606", "1607"), courseResult.language || (stryMutAct_9fa48("1609") ? courseData.course?.language : stryMutAct_9fa48("1608") ? courseData?.course.language : (stryCov_9fa48("1608", "1609"), courseData?.course?.language)))) || (stryMutAct_9fa48("1611") ? courseData.metadata?.language : stryMutAct_9fa48("1610") ? courseData?.metadata.language : (stryCov_9fa48("1610", "1611"), courseData?.metadata?.language)))) || null);

        // Track lesson completion for analytics
        try {
          if (stryMutAct_9fa48("1612")) {
            {}
          } else {
            stryCov_9fa48("1612");
            console.log(stryMutAct_9fa48("1613") ? "" : (stryCov_9fa48("1613"), '🔍 Analytics Debug - Tracking lesson completion:'), stryMutAct_9fa48("1614") ? {} : (stryCov_9fa48("1614"), {
              userId,
              language: languageName,
              moduleType,
              lessonId: parseInt(lessonId),
              courseId: parseInt(courseId)
            }));
            await analyticsService.trackLessonCompletion(userId, languageName, moduleType, null, // duration - we don't track this yet
            stryMutAct_9fa48("1615") ? {} : (stryCov_9fa48("1615"), {
              lessonId: parseInt(lessonId),
              unitId: parseInt(unitId),
              courseId: parseInt(courseId),
              score,
              xpEarned,
              exercisesCompleted: exercises.length
            }));
            console.log(stryMutAct_9fa48("1616") ? "" : (stryCov_9fa48("1616"), '✅ Analytics - Lesson completion tracked successfully'));
          }
        } catch (analyticsError) {
          if (stryMutAct_9fa48("1617")) {
            {}
          } else {
            stryCov_9fa48("1617");
            console.error(stryMutAct_9fa48("1618") ? "" : (stryCov_9fa48("1618"), '❌ Error tracking lesson completion analytics:'), analyticsError);
            // Don't fail the lesson completion if analytics fails
          }
        }

        // Save exercise attempts
        for (let i = 0; stryMutAct_9fa48("1621") ? i >= exercises.length : stryMutAct_9fa48("1620") ? i <= exercises.length : stryMutAct_9fa48("1619") ? false : (stryCov_9fa48("1619", "1620", "1621"), i < exercises.length); stryMutAct_9fa48("1622") ? i-- : (stryCov_9fa48("1622"), i++)) {
          if (stryMutAct_9fa48("1623")) {
            {}
          } else {
            stryCov_9fa48("1623");
            const exercise = exercises[i];
            await progressRepository.createExerciseAttempt(userId, courseId, parseInt(unitId), lessonDbId, i, exercise.isCorrect, exercise.userAnswer);
          }
        }

        // Check if all lessons in unit are completed
        const totalLessonsInUnit = unit.lessons.length;
        const completedLessons = await progressRepository.countCompletedLessonsInUnit(userId, courseId, parseInt(unitId));
        let unitCompleted = stryMutAct_9fa48("1624") ? true : (stryCov_9fa48("1624"), false);
        if (stryMutAct_9fa48("1628") ? completedLessons < totalLessonsInUnit : stryMutAct_9fa48("1627") ? completedLessons > totalLessonsInUnit : stryMutAct_9fa48("1626") ? false : stryMutAct_9fa48("1625") ? true : (stryCov_9fa48("1625", "1626", "1627", "1628"), completedLessons >= totalLessonsInUnit)) {
          if (stryMutAct_9fa48("1629")) {
            {}
          } else {
            stryCov_9fa48("1629");
            // Mark unit as complete
            await progressRepository.markUnitComplete(userId, courseId, parseInt(unitId));

            // Unlock next unit
            const nextUnitId = stryMutAct_9fa48("1630") ? parseInt(unitId) - 1 : (stryCov_9fa48("1630"), parseInt(unitId) + 1);
            const nextUnit = courseData.course.units.find(stryMutAct_9fa48("1631") ? () => undefined : (stryCov_9fa48("1631"), u => stryMutAct_9fa48("1634") ? u.id !== nextUnitId : stryMutAct_9fa48("1633") ? false : stryMutAct_9fa48("1632") ? true : (stryCov_9fa48("1632", "1633", "1634"), u.id === nextUnitId)));
            if (stryMutAct_9fa48("1636") ? false : stryMutAct_9fa48("1635") ? true : (stryCov_9fa48("1635", "1636"), nextUnit)) {
              if (stryMutAct_9fa48("1637")) {
                {}
              } else {
                stryCov_9fa48("1637");
                await progressRepository.unlockUnit(userId, courseId, nextUnitId);
              }
            }
            unitCompleted = stryMutAct_9fa48("1638") ? false : (stryCov_9fa48("1638"), true);
          }
        }
        res.json(successResponse(stryMutAct_9fa48("1639") ? {} : (stryCov_9fa48("1639"), {
          xpEarned,
          unitCompleted
        }), unitCompleted ? stryMutAct_9fa48("1640") ? "" : (stryCov_9fa48("1640"), 'Unit completed! Next unit unlocked!') : stryMutAct_9fa48("1641") ? "" : (stryCov_9fa48("1641"), 'Lesson completed!')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1642")) {
        {}
      } else {
        stryCov_9fa48("1642");
        console.error(stryMutAct_9fa48("1643") ? "" : (stryCov_9fa48("1643"), 'Error marking lesson complete:'), error);
        next(error);
      }
    }
  }
};

/**
 * Get available courses for user
 */
const getUserCourses = async (req, res, next) => {
  if (stryMutAct_9fa48("1644")) {
    {}
  } else {
    stryCov_9fa48("1644");
    try {
      if (stryMutAct_9fa48("1645")) {
        {}
      } else {
        stryCov_9fa48("1645");
        const userId = req.user.id;
        console.log(stryMutAct_9fa48("1646") ? "" : (stryCov_9fa48("1646"), '👤 getUserCourses called for userId:'), userId);
        const courses = await courseRepository.findAllActiveCourses(userId);
        const coursesWithProgress = courses.map(stryMutAct_9fa48("1647") ? () => undefined : (stryCov_9fa48("1647"), course => stryMutAct_9fa48("1648") ? {} : (stryCov_9fa48("1648"), {
          id: course.id,
          language: course.language,
          title: course.title,
          description: course.description,
          sourceType: course.source_type,
          // 'ai' or 'admin' - important for frontend!
          totalLessons: course.total_lessons,
          totalUnits: course.total_units,
          createdAt: course.created_at,
          progress: stryMutAct_9fa48("1649") ? {} : (stryCov_9fa48("1649"), {
            totalXp: stryMutAct_9fa48("1652") ? course.total_xp && 0 : stryMutAct_9fa48("1651") ? false : stryMutAct_9fa48("1650") ? true : (stryCov_9fa48("1650", "1651", "1652"), course.total_xp || 0),
            lessonsCompleted: stryMutAct_9fa48("1655") ? course.lessons_completed && 0 : stryMutAct_9fa48("1654") ? false : stryMutAct_9fa48("1653") ? true : (stryCov_9fa48("1653", "1654", "1655"), course.lessons_completed || 0),
            unitsCompleted: stryMutAct_9fa48("1658") ? course.units_completed && 0 : stryMutAct_9fa48("1657") ? false : stryMutAct_9fa48("1656") ? true : (stryCov_9fa48("1656", "1657", "1658"), course.units_completed || 0),
            currentStreak: stryMutAct_9fa48("1661") ? course.current_streak && 0 : stryMutAct_9fa48("1660") ? false : stryMutAct_9fa48("1659") ? true : (stryCov_9fa48("1659", "1660", "1661"), course.current_streak || 0)
          })
        })));
        console.log(stryMutAct_9fa48("1662") ? `` : (stryCov_9fa48("1662"), `📦 Returning ${coursesWithProgress.length} courses to user ${userId}`));
        res.json(listResponse(coursesWithProgress, stryMutAct_9fa48("1663") ? "" : (stryCov_9fa48("1663"), 'User courses retrieved successfully')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1664")) {
        {}
      } else {
        stryCov_9fa48("1664");
        console.error(stryMutAct_9fa48("1665") ? "" : (stryCov_9fa48("1665"), 'Error fetching user courses:'), error);
        next(error);
      }
    }
  }
};

/**
 * Initialize progress for a new course
 */
const initializeCourseProgress = async (courseId, userId) => {
  if (stryMutAct_9fa48("1666")) {
    {}
  } else {
    stryCov_9fa48("1666");
    try {
      if (stryMutAct_9fa48("1667")) {
        {}
      } else {
        stryCov_9fa48("1667");
        await progressRepository.initializeCourseProgress(courseId, userId);
      }
    } catch (error) {
      if (stryMutAct_9fa48("1668")) {
        {}
      } else {
        stryCov_9fa48("1668");
        console.error(stryMutAct_9fa48("1669") ? "" : (stryCov_9fa48("1669"), 'Error initializing course progress:'), error);
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
  if (stryMutAct_9fa48("1670")) {
    {}
  } else {
    stryCov_9fa48("1670");
    try {
      if (stryMutAct_9fa48("1671")) {
        {}
      } else {
        stryCov_9fa48("1671");
        const userId = req.user.id;
        const {
          range = stryMutAct_9fa48("1672") ? "" : (stryCov_9fa48("1672"), 'all'),
          courseId
        } = req.query;

        // Convert range to days (7d -> 7, 30d -> 30, all -> null)
        const days = (stryMutAct_9fa48("1675") ? range !== 'all' : stryMutAct_9fa48("1674") ? false : stryMutAct_9fa48("1673") ? true : (stryCov_9fa48("1673", "1674", "1675"), range === (stryMutAct_9fa48("1676") ? "" : (stryCov_9fa48("1676"), 'all')))) ? null : parseInt(range.replace(stryMutAct_9fa48("1677") ? "" : (stryCov_9fa48("1677"), 'd'), stryMutAct_9fa48("1678") ? "Stryker was here!" : (stryCov_9fa48("1678"), '')));
        const summary = await progressRepository.getSummaryKPIs(userId, days, courseId);
        const timeline = await progressRepository.getProgressOverTime(userId, days, courseId);
        const recentActivity = await progressRepository.getRecentActivity(userId, 5, courseId);
        res.json(successResponse(stryMutAct_9fa48("1679") ? {} : (stryCov_9fa48("1679"), {
          summary,
          timeline,
          recentActivity
        }), stryMutAct_9fa48("1680") ? "" : (stryCov_9fa48("1680"), 'Progress report retrieved successfully')));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1681")) {
        {}
      } else {
        stryCov_9fa48("1681");
        console.error(stryMutAct_9fa48("1682") ? "" : (stryCov_9fa48("1682"), 'Error fetching progress report:'), error);
        next(error);
      }
    }
  }
};
export { getCourseProgress, markLessonComplete, getUserCourses, initializeCourseProgress, getProgressReport };