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
import analyticsRepository from '../repositories/analyticsRepository.js';
class AnalyticsService {
  /**
   * Track lesson completion
   */
  async trackLessonCompletion(userId, language, moduleType, duration = null, lessonDetails = {}) {
    if (stryMutAct_9fa48("160")) {
      {}
    } else {
      stryCov_9fa48("160");
      try {
        if (stryMutAct_9fa48("161")) {
          {}
        } else {
          stryCov_9fa48("161");
          console.log(stryMutAct_9fa48("162") ? "" : (stryCov_9fa48("162"), '📊 Analytics Service - trackLessonCompletion called:'), stryMutAct_9fa48("163") ? {} : (stryCov_9fa48("163"), {
            userId,
            language,
            moduleType,
            duration,
            lessonDetails
          }));
          const metadata = stryMutAct_9fa48("164") ? {} : (stryCov_9fa48("164"), {
            lessonId: lessonDetails.lessonId,
            unitId: lessonDetails.unitId,
            courseId: lessonDetails.courseId,
            score: lessonDetails.score,
            xpEarned: lessonDetails.xpEarned,
            exercisesCompleted: lessonDetails.exercisesCompleted
          });
          const result = await analyticsRepository.logEvent(userId, stryMutAct_9fa48("165") ? "" : (stryCov_9fa48("165"), 'LESSON_COMPLETED'), language, moduleType, duration, metadata);
          console.log(stryMutAct_9fa48("166") ? "" : (stryCov_9fa48("166"), '✅ Analytics Service - Event logged successfully:'), result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("167")) {
          {}
        } else {
          stryCov_9fa48("167");
          console.error(stryMutAct_9fa48("168") ? "" : (stryCov_9fa48("168"), '❌ Analytics Service - Error tracking lesson completion:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Track AI module generation
   */
  async trackAIGeneration(userId, language, success = stryMutAct_9fa48("169") ? false : (stryCov_9fa48("169"), true), generationDetails = {}) {
    if (stryMutAct_9fa48("170")) {
      {}
    } else {
      stryCov_9fa48("170");
      try {
        if (stryMutAct_9fa48("171")) {
          {}
        } else {
          stryCov_9fa48("171");
          const metadata = stryMutAct_9fa48("172") ? {} : (stryCov_9fa48("172"), {
            success,
            courseId: generationDetails.courseId,
            unitsGenerated: generationDetails.unitsGenerated,
            lessonsGenerated: generationDetails.lessonsGenerated,
            generationTime: generationDetails.generationTime,
            errorMessage: generationDetails.errorMessage
          });
          await analyticsRepository.logEvent(userId, stryMutAct_9fa48("173") ? "" : (stryCov_9fa48("173"), 'AI_MODULE_GENERATED'), language, stryMutAct_9fa48("174") ? "" : (stryCov_9fa48("174"), 'AI'), generationDetails.generationTime, metadata);
        }
      } catch (error) {
        if (stryMutAct_9fa48("175")) {
          {}
        } else {
          stryCov_9fa48("175");
          console.error(stryMutAct_9fa48("176") ? "" : (stryCov_9fa48("176"), 'Error tracking AI generation:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Track admin module usage
   */
  async trackAdminModuleUsage(userId, language, actionType, moduleDetails = {}) {
    if (stryMutAct_9fa48("177")) {
      {}
    } else {
      stryCov_9fa48("177");
      try {
        if (stryMutAct_9fa48("178")) {
          {}
        } else {
          stryCov_9fa48("178");
          const metadata = stryMutAct_9fa48("179") ? {} : (stryCov_9fa48("179"), {
            actionType,
            // 'CREATE_COURSE', 'CREATE_UNIT', 'CREATE_LESSON', 'UPDATE_COURSE', etc.
            courseId: moduleDetails.courseId,
            unitId: moduleDetails.unitId,
            lessonId: moduleDetails.lessonId,
            details: moduleDetails.details
          });
          await analyticsRepository.logEvent(userId, stryMutAct_9fa48("180") ? "" : (stryCov_9fa48("180"), 'ADMIN_MODULE_USED'), language, stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), 'ADMIN'), null, metadata);
        }
      } catch (error) {
        if (stryMutAct_9fa48("182")) {
          {}
        } else {
          stryCov_9fa48("182");
          console.error(stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), 'Error tracking admin module usage:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Get comprehensive analytics data
   * FIX: Now includes real-time stats from database tables
   */
  async getAnalytics() {
    if (stryMutAct_9fa48("184")) {
      {}
    } else {
      stryCov_9fa48("184");
      try {
        if (stryMutAct_9fa48("185")) {
          {}
        } else {
          stryCov_9fa48("185");
          const [realTimeStats, languageDistribution, moduleUsage, aiPerformance, dailyActivity, userEngagement, lessonCompletionTrends, averageDuration] = await Promise.all(stryMutAct_9fa48("186") ? [] : (stryCov_9fa48("186"), [analyticsRepository.getRealTimeStats().catch(err => {
            if (stryMutAct_9fa48("187")) {
              {}
            } else {
              stryCov_9fa48("187");
              console.warn(stryMutAct_9fa48("188") ? "" : (stryCov_9fa48("188"), 'Error getting real-time stats:'), err.message);
              return stryMutAct_9fa48("189") ? {} : (stryCov_9fa48("189"), {
                total_lessons: 0,
                active_users: 0,
                popular_language: stryMutAct_9fa48("190") ? "" : (stryCov_9fa48("190"), 'N/A'),
                ai_courses_generated: 0,
                avg_generation_time: 0,
                total_xp_earned: 0
              });
            }
          }), analyticsRepository.getLanguageDistribution().catch(err => {
            if (stryMutAct_9fa48("191")) {
              {}
            } else {
              stryCov_9fa48("191");
              console.warn(stryMutAct_9fa48("192") ? "" : (stryCov_9fa48("192"), 'Error getting language distribution:'), err.message);
              return stryMutAct_9fa48("193") ? ["Stryker was here"] : (stryCov_9fa48("193"), []);
            }
          }), analyticsRepository.getModuleUsage().catch(err => {
            if (stryMutAct_9fa48("194")) {
              {}
            } else {
              stryCov_9fa48("194");
              console.warn(stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), 'Error getting module usage:'), err.message);
              return stryMutAct_9fa48("196") ? ["Stryker was here"] : (stryCov_9fa48("196"), []);
            }
          }), analyticsRepository.getAIPerformance().catch(err => {
            if (stryMutAct_9fa48("197")) {
              {}
            } else {
              stryCov_9fa48("197");
              console.warn(stryMutAct_9fa48("198") ? "" : (stryCov_9fa48("198"), 'Error getting AI performance:'), err.message);
              return stryMutAct_9fa48("199") ? {} : (stryCov_9fa48("199"), {
                total_generations: 0,
                success_count: 0,
                failure_count: 0
              });
            }
          }), analyticsRepository.getDailyActivity(30).catch(err => {
            if (stryMutAct_9fa48("200")) {
              {}
            } else {
              stryCov_9fa48("200");
              console.warn(stryMutAct_9fa48("201") ? "" : (stryCov_9fa48("201"), 'Error getting daily activity:'), err.message);
              return stryMutAct_9fa48("202") ? ["Stryker was here"] : (stryCov_9fa48("202"), []);
            }
          }), analyticsRepository.getUserEngagement().catch(err => {
            if (stryMutAct_9fa48("203")) {
              {}
            } else {
              stryCov_9fa48("203");
              console.warn(stryMutAct_9fa48("204") ? "" : (stryCov_9fa48("204"), 'Error getting user engagement:'), err.message);
              return stryMutAct_9fa48("205") ? {} : (stryCov_9fa48("205"), {
                total_active_users: 0,
                avg_lessons_per_user: 0,
                max_lessons_per_user: 0
              });
            }
          }), analyticsRepository.getLessonCompletionTrends(30).catch(err => {
            if (stryMutAct_9fa48("206")) {
              {}
            } else {
              stryCov_9fa48("206");
              console.warn(stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), 'Error getting lesson completion trends:'), err.message);
              return stryMutAct_9fa48("208") ? ["Stryker was here"] : (stryCov_9fa48("208"), []);
            }
          }), analyticsRepository.getAverageLessonDuration().catch(err => {
            if (stryMutAct_9fa48("209")) {
              {}
            } else {
              stryCov_9fa48("209");
              console.warn(stryMutAct_9fa48("210") ? "" : (stryCov_9fa48("210"), 'Error getting average lesson duration:'), err.message);
              return stryMutAct_9fa48("211") ? ["Stryker was here"] : (stryCov_9fa48("211"), []);
            }
          })]));
          return stryMutAct_9fa48("212") ? {} : (stryCov_9fa48("212"), {
            realTimeStats,
            languageDistribution,
            moduleUsage,
            aiPerformance,
            dailyActivity,
            userEngagement,
            lessonCompletionTrends,
            averageDuration,
            summary: this._generateSummary(stryMutAct_9fa48("213") ? {} : (stryCov_9fa48("213"), {
              realTimeStats,
              languageDistribution,
              moduleUsage,
              aiPerformance,
              userEngagement
            }))
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("214")) {
          {}
        } else {
          stryCov_9fa48("214");
          console.error(stryMutAct_9fa48("215") ? "" : (stryCov_9fa48("215"), 'Error getting analytics:'), error);
          // If it's a "relation does not exist" error, provide helpful message
          if (stryMutAct_9fa48("218") ? error.message || error.message.includes('does not exist') : stryMutAct_9fa48("217") ? false : stryMutAct_9fa48("216") ? true : (stryCov_9fa48("216", "217", "218"), error.message && error.message.includes(stryMutAct_9fa48("219") ? "" : (stryCov_9fa48("219"), 'does not exist')))) {
            if (stryMutAct_9fa48("220")) {
              {}
            } else {
              stryCov_9fa48("220");
              throw new Error(stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), 'Analytics table not found. Please run the analytics migration script.'));
            }
          }
          throw error;
        }
      }
    }
  }

  /**
   * Get analytics for a specific time period
   */
  async getAnalyticsForPeriod(days = 30) {
    if (stryMutAct_9fa48("222")) {
      {}
    } else {
      stryCov_9fa48("222");
      try {
        if (stryMutAct_9fa48("223")) {
          {}
        } else {
          stryCov_9fa48("223");
          const [dailyActivity, lessonCompletionTrends] = await Promise.all(stryMutAct_9fa48("224") ? [] : (stryCov_9fa48("224"), [analyticsRepository.getDailyActivity(days), analyticsRepository.getLessonCompletionTrends(days)]));
          return stryMutAct_9fa48("225") ? {} : (stryCov_9fa48("225"), {
            dailyActivity,
            lessonCompletionTrends,
            period: stryMutAct_9fa48("226") ? `` : (stryCov_9fa48("226"), `${days} days`)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("227")) {
          {}
        } else {
          stryCov_9fa48("227");
          console.error(stryMutAct_9fa48("228") ? "" : (stryCov_9fa48("228"), 'Error getting analytics for period:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Generate summary statistics
   * FIX: Now uses real-time stats as primary source
   */
  _generateSummary(data) {
    if (stryMutAct_9fa48("229")) {
      {}
    } else {
      stryCov_9fa48("229");
      const {
        realTimeStats,
        languageDistribution,
        moduleUsage,
        aiPerformance,
        userEngagement
      } = data;

      // Use real-time stats as primary source
      const mostPopularLanguage = stryMutAct_9fa48("232") ? realTimeStats.popular_language && (languageDistribution.length > 0 ? languageDistribution[0].language_name : 'N/A') : stryMutAct_9fa48("231") ? false : stryMutAct_9fa48("230") ? true : (stryCov_9fa48("230", "231", "232"), realTimeStats.popular_language || ((stryMutAct_9fa48("236") ? languageDistribution.length <= 0 : stryMutAct_9fa48("235") ? languageDistribution.length >= 0 : stryMutAct_9fa48("234") ? false : stryMutAct_9fa48("233") ? true : (stryCov_9fa48("233", "234", "235", "236"), languageDistribution.length > 0)) ? languageDistribution[0].language_name : stryMutAct_9fa48("237") ? "" : (stryCov_9fa48("237"), 'N/A')));
      const totalLessons = stryMutAct_9fa48("240") ? realTimeStats.total_lessons && languageDistribution.reduce((sum, lang) => sum + parseInt(lang.count || 0), 0) : stryMutAct_9fa48("239") ? false : stryMutAct_9fa48("238") ? true : (stryCov_9fa48("238", "239", "240"), realTimeStats.total_lessons || languageDistribution.reduce(stryMutAct_9fa48("241") ? () => undefined : (stryCov_9fa48("241"), (sum, lang) => stryMutAct_9fa48("242") ? sum - parseInt(lang.count || 0) : (stryCov_9fa48("242"), sum + parseInt(stryMutAct_9fa48("245") ? lang.count && 0 : stryMutAct_9fa48("244") ? false : stryMutAct_9fa48("243") ? true : (stryCov_9fa48("243", "244", "245"), lang.count || 0)))), 0));

      // Module preference
      const adminLessons = stryMutAct_9fa48("248") ? moduleUsage.find(m => m.module_type === 'ADMIN')?.count && 0 : stryMutAct_9fa48("247") ? false : stryMutAct_9fa48("246") ? true : (stryCov_9fa48("246", "247", "248"), (stryMutAct_9fa48("249") ? moduleUsage.find(m => m.module_type === 'ADMIN').count : (stryCov_9fa48("249"), moduleUsage.find(stryMutAct_9fa48("250") ? () => undefined : (stryCov_9fa48("250"), m => stryMutAct_9fa48("253") ? m.module_type !== 'ADMIN' : stryMutAct_9fa48("252") ? false : stryMutAct_9fa48("251") ? true : (stryCov_9fa48("251", "252", "253"), m.module_type === (stryMutAct_9fa48("254") ? "" : (stryCov_9fa48("254"), 'ADMIN')))))?.count)) || 0);
      const aiLessons = stryMutAct_9fa48("257") ? moduleUsage.find(m => m.module_type === 'AI')?.count && 0 : stryMutAct_9fa48("256") ? false : stryMutAct_9fa48("255") ? true : (stryCov_9fa48("255", "256", "257"), (stryMutAct_9fa48("258") ? moduleUsage.find(m => m.module_type === 'AI').count : (stryCov_9fa48("258"), moduleUsage.find(stryMutAct_9fa48("259") ? () => undefined : (stryCov_9fa48("259"), m => stryMutAct_9fa48("262") ? m.module_type !== 'AI' : stryMutAct_9fa48("261") ? false : stryMutAct_9fa48("260") ? true : (stryCov_9fa48("260", "261", "262"), m.module_type === (stryMutAct_9fa48("263") ? "" : (stryCov_9fa48("263"), 'AI')))))?.count)) || 0);
      const preferredModule = (stryMutAct_9fa48("267") ? adminLessons <= aiLessons : stryMutAct_9fa48("266") ? adminLessons >= aiLessons : stryMutAct_9fa48("265") ? false : stryMutAct_9fa48("264") ? true : (stryCov_9fa48("264", "265", "266", "267"), adminLessons > aiLessons)) ? stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), 'ADMIN') : (stryMutAct_9fa48("272") ? aiLessons <= 0 : stryMutAct_9fa48("271") ? aiLessons >= 0 : stryMutAct_9fa48("270") ? false : stryMutAct_9fa48("269") ? true : (stryCov_9fa48("269", "270", "271", "272"), aiLessons > 0)) ? stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), 'AI') : stryMutAct_9fa48("274") ? "" : (stryCov_9fa48("274"), 'N/A');

      // AI success rate - use real-time data if available
      const totalGenerations = stryMutAct_9fa48("277") ? (realTimeStats.ai_courses_generated || aiPerformance.total_generations) && 0 : stryMutAct_9fa48("276") ? false : stryMutAct_9fa48("275") ? true : (stryCov_9fa48("275", "276", "277"), (stryMutAct_9fa48("279") ? realTimeStats.ai_courses_generated && aiPerformance.total_generations : stryMutAct_9fa48("278") ? false : (stryCov_9fa48("278", "279"), realTimeStats.ai_courses_generated || aiPerformance.total_generations)) || 0);
      const aiSuccessRate = (stryMutAct_9fa48("283") ? aiPerformance.total_generations <= 0 : stryMutAct_9fa48("282") ? aiPerformance.total_generations >= 0 : stryMutAct_9fa48("281") ? false : stryMutAct_9fa48("280") ? true : (stryCov_9fa48("280", "281", "282", "283"), aiPerformance.total_generations > 0)) ? (stryMutAct_9fa48("284") ? aiPerformance.success_count / aiPerformance.total_generations / 100 : (stryCov_9fa48("284"), (stryMutAct_9fa48("285") ? aiPerformance.success_count * aiPerformance.total_generations : (stryCov_9fa48("285"), aiPerformance.success_count / aiPerformance.total_generations)) * 100)).toFixed(1) : (stryMutAct_9fa48("289") ? totalGenerations <= 0 : stryMutAct_9fa48("288") ? totalGenerations >= 0 : stryMutAct_9fa48("287") ? false : stryMutAct_9fa48("286") ? true : (stryCov_9fa48("286", "287", "288", "289"), totalGenerations > 0)) ? stryMutAct_9fa48("290") ? "" : (stryCov_9fa48("290"), '100') : stryMutAct_9fa48("291") ? "" : (stryCov_9fa48("291"), '0');
      return stryMutAct_9fa48("292") ? {} : (stryCov_9fa48("292"), {
        mostPopularLanguage,
        totalLessons,
        totalActiveUsers: stryMutAct_9fa48("295") ? (realTimeStats.active_users || userEngagement.total_active_users) && 0 : stryMutAct_9fa48("294") ? false : stryMutAct_9fa48("293") ? true : (stryCov_9fa48("293", "294", "295"), (stryMutAct_9fa48("297") ? realTimeStats.active_users && userEngagement.total_active_users : stryMutAct_9fa48("296") ? false : (stryCov_9fa48("296", "297"), realTimeStats.active_users || userEngagement.total_active_users)) || 0),
        preferredModule,
        aiSuccessRate: stryMutAct_9fa48("298") ? `` : (stryCov_9fa48("298"), `${aiSuccessRate}%`),
        avgLessonsPerUser: (stryMutAct_9fa48("302") ? realTimeStats.active_users <= 0 : stryMutAct_9fa48("301") ? realTimeStats.active_users >= 0 : stryMutAct_9fa48("300") ? false : stryMutAct_9fa48("299") ? true : (stryCov_9fa48("299", "300", "301", "302"), realTimeStats.active_users > 0)) ? (stryMutAct_9fa48("303") ? totalLessons * realTimeStats.active_users : (stryCov_9fa48("303"), totalLessons / realTimeStats.active_users)).toFixed(1) : parseFloat(stryMutAct_9fa48("306") ? userEngagement.avg_lessons_per_user && 0 : stryMutAct_9fa48("305") ? false : stryMutAct_9fa48("304") ? true : (stryCov_9fa48("304", "305", "306"), userEngagement.avg_lessons_per_user || 0)).toFixed(1)
      });
    }
  }
}
export default new AnalyticsService();