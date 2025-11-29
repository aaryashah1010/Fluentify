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
    if (stryMutAct_9fa48("2716")) {
      {}
    } else {
      stryCov_9fa48("2716");
      try {
        if (stryMutAct_9fa48("2717")) {
          {}
        } else {
          stryCov_9fa48("2717");
          console.log(stryMutAct_9fa48("2718") ? "" : (stryCov_9fa48("2718"), '📊 Analytics Service - trackLessonCompletion called:'), stryMutAct_9fa48("2719") ? {} : (stryCov_9fa48("2719"), {
            userId,
            language,
            moduleType,
            duration,
            lessonDetails
          }));
          const metadata = stryMutAct_9fa48("2720") ? {} : (stryCov_9fa48("2720"), {
            lessonId: lessonDetails.lessonId,
            unitId: lessonDetails.unitId,
            courseId: lessonDetails.courseId,
            score: lessonDetails.score,
            xpEarned: lessonDetails.xpEarned,
            exercisesCompleted: lessonDetails.exercisesCompleted
          });
          const result = await analyticsRepository.logEvent(userId, stryMutAct_9fa48("2721") ? "" : (stryCov_9fa48("2721"), 'LESSON_COMPLETED'), language, moduleType, duration, metadata);
          console.log(stryMutAct_9fa48("2722") ? "" : (stryCov_9fa48("2722"), '✅ Analytics Service - Event logged successfully:'), result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("2723")) {
          {}
        } else {
          stryCov_9fa48("2723");
          console.error(stryMutAct_9fa48("2724") ? "" : (stryCov_9fa48("2724"), '❌ Analytics Service - Error tracking lesson completion:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Track AI module generation
   */
  async trackAIGeneration(userId, language, success = stryMutAct_9fa48("2725") ? false : (stryCov_9fa48("2725"), true), generationDetails = {}) {
    if (stryMutAct_9fa48("2726")) {
      {}
    } else {
      stryCov_9fa48("2726");
      try {
        if (stryMutAct_9fa48("2727")) {
          {}
        } else {
          stryCov_9fa48("2727");
          const metadata = stryMutAct_9fa48("2728") ? {} : (stryCov_9fa48("2728"), {
            success,
            courseId: generationDetails.courseId,
            unitsGenerated: generationDetails.unitsGenerated,
            lessonsGenerated: generationDetails.lessonsGenerated,
            generationTime: generationDetails.generationTime,
            errorMessage: generationDetails.errorMessage
          });
          await analyticsRepository.logEvent(userId, stryMutAct_9fa48("2729") ? "" : (stryCov_9fa48("2729"), 'AI_MODULE_GENERATED'), language, stryMutAct_9fa48("2730") ? "" : (stryCov_9fa48("2730"), 'AI'), generationDetails.generationTime, metadata);
        }
      } catch (error) {
        if (stryMutAct_9fa48("2731")) {
          {}
        } else {
          stryCov_9fa48("2731");
          console.error(stryMutAct_9fa48("2732") ? "" : (stryCov_9fa48("2732"), 'Error tracking AI generation:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Track admin module usage
   */
  async trackAdminModuleUsage(userId, language, actionType, moduleDetails = {}) {
    if (stryMutAct_9fa48("2733")) {
      {}
    } else {
      stryCov_9fa48("2733");
      try {
        if (stryMutAct_9fa48("2734")) {
          {}
        } else {
          stryCov_9fa48("2734");
          const metadata = stryMutAct_9fa48("2735") ? {} : (stryCov_9fa48("2735"), {
            actionType,
            // 'CREATE_COURSE', 'CREATE_UNIT', 'CREATE_LESSON', 'UPDATE_COURSE', etc.
            courseId: moduleDetails.courseId,
            unitId: moduleDetails.unitId,
            lessonId: moduleDetails.lessonId,
            details: moduleDetails.details
          });
          await analyticsRepository.logEvent(userId, stryMutAct_9fa48("2736") ? "" : (stryCov_9fa48("2736"), 'ADMIN_MODULE_USED'), language, stryMutAct_9fa48("2737") ? "" : (stryCov_9fa48("2737"), 'ADMIN'), null, metadata);
        }
      } catch (error) {
        if (stryMutAct_9fa48("2738")) {
          {}
        } else {
          stryCov_9fa48("2738");
          console.error(stryMutAct_9fa48("2739") ? "" : (stryCov_9fa48("2739"), 'Error tracking admin module usage:'), error);
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
    if (stryMutAct_9fa48("2740")) {
      {}
    } else {
      stryCov_9fa48("2740");
      try {
        if (stryMutAct_9fa48("2741")) {
          {}
        } else {
          stryCov_9fa48("2741");
          const [realTimeStats, languageDistribution, moduleUsage, aiPerformance, dailyActivity, userEngagement, lessonCompletionTrends, averageDuration] = await Promise.all(stryMutAct_9fa48("2742") ? [] : (stryCov_9fa48("2742"), [analyticsRepository.getRealTimeStats().catch(err => {
            if (stryMutAct_9fa48("2743")) {
              {}
            } else {
              stryCov_9fa48("2743");
              console.warn(stryMutAct_9fa48("2744") ? "" : (stryCov_9fa48("2744"), 'Error getting real-time stats:'), err.message);
              return stryMutAct_9fa48("2745") ? {} : (stryCov_9fa48("2745"), {
                total_lessons: 0,
                active_users: 0,
                popular_language: stryMutAct_9fa48("2746") ? "" : (stryCov_9fa48("2746"), 'N/A'),
                ai_courses_generated: 0,
                avg_generation_time: 0,
                total_xp_earned: 0
              });
            }
          }), analyticsRepository.getLanguageDistribution().catch(err => {
            if (stryMutAct_9fa48("2747")) {
              {}
            } else {
              stryCov_9fa48("2747");
              console.warn(stryMutAct_9fa48("2748") ? "" : (stryCov_9fa48("2748"), 'Error getting language distribution:'), err.message);
              return stryMutAct_9fa48("2749") ? ["Stryker was here"] : (stryCov_9fa48("2749"), []);
            }
          }), analyticsRepository.getModuleUsage().catch(err => {
            if (stryMutAct_9fa48("2750")) {
              {}
            } else {
              stryCov_9fa48("2750");
              console.warn(stryMutAct_9fa48("2751") ? "" : (stryCov_9fa48("2751"), 'Error getting module usage:'), err.message);
              return stryMutAct_9fa48("2752") ? ["Stryker was here"] : (stryCov_9fa48("2752"), []);
            }
          }), analyticsRepository.getAIPerformance().catch(err => {
            if (stryMutAct_9fa48("2753")) {
              {}
            } else {
              stryCov_9fa48("2753");
              console.warn(stryMutAct_9fa48("2754") ? "" : (stryCov_9fa48("2754"), 'Error getting AI performance:'), err.message);
              return stryMutAct_9fa48("2755") ? {} : (stryCov_9fa48("2755"), {
                total_generations: 0,
                success_count: 0,
                failure_count: 0
              });
            }
          }), analyticsRepository.getDailyActivity(30).catch(err => {
            if (stryMutAct_9fa48("2756")) {
              {}
            } else {
              stryCov_9fa48("2756");
              console.warn(stryMutAct_9fa48("2757") ? "" : (stryCov_9fa48("2757"), 'Error getting daily activity:'), err.message);
              return stryMutAct_9fa48("2758") ? ["Stryker was here"] : (stryCov_9fa48("2758"), []);
            }
          }), analyticsRepository.getUserEngagement().catch(err => {
            if (stryMutAct_9fa48("2759")) {
              {}
            } else {
              stryCov_9fa48("2759");
              console.warn(stryMutAct_9fa48("2760") ? "" : (stryCov_9fa48("2760"), 'Error getting user engagement:'), err.message);
              return stryMutAct_9fa48("2761") ? {} : (stryCov_9fa48("2761"), {
                total_active_users: 0,
                avg_lessons_per_user: 0,
                max_lessons_per_user: 0
              });
            }
          }), analyticsRepository.getLessonCompletionTrends(30).catch(err => {
            if (stryMutAct_9fa48("2762")) {
              {}
            } else {
              stryCov_9fa48("2762");
              console.warn(stryMutAct_9fa48("2763") ? "" : (stryCov_9fa48("2763"), 'Error getting lesson completion trends:'), err.message);
              return stryMutAct_9fa48("2764") ? ["Stryker was here"] : (stryCov_9fa48("2764"), []);
            }
          }), analyticsRepository.getAverageLessonDuration().catch(err => {
            if (stryMutAct_9fa48("2765")) {
              {}
            } else {
              stryCov_9fa48("2765");
              console.warn(stryMutAct_9fa48("2766") ? "" : (stryCov_9fa48("2766"), 'Error getting average lesson duration:'), err.message);
              return stryMutAct_9fa48("2767") ? ["Stryker was here"] : (stryCov_9fa48("2767"), []);
            }
          })]));
          return stryMutAct_9fa48("2768") ? {} : (stryCov_9fa48("2768"), {
            realTimeStats,
            languageDistribution,
            moduleUsage,
            aiPerformance,
            dailyActivity,
            userEngagement,
            lessonCompletionTrends,
            averageDuration,
            summary: this._generateSummary(stryMutAct_9fa48("2769") ? {} : (stryCov_9fa48("2769"), {
              realTimeStats,
              languageDistribution,
              moduleUsage,
              aiPerformance,
              userEngagement
            }))
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("2770")) {
          {}
        } else {
          stryCov_9fa48("2770");
          console.error(stryMutAct_9fa48("2771") ? "" : (stryCov_9fa48("2771"), 'Error getting analytics:'), error);
          // If it's a "relation does not exist" error, provide helpful message
          if (stryMutAct_9fa48("2774") ? error.message || error.message.includes('does not exist') : stryMutAct_9fa48("2773") ? false : stryMutAct_9fa48("2772") ? true : (stryCov_9fa48("2772", "2773", "2774"), error.message && error.message.includes(stryMutAct_9fa48("2775") ? "" : (stryCov_9fa48("2775"), 'does not exist')))) {
            if (stryMutAct_9fa48("2776")) {
              {}
            } else {
              stryCov_9fa48("2776");
              throw new Error(stryMutAct_9fa48("2777") ? "" : (stryCov_9fa48("2777"), 'Analytics table not found. Please run the analytics migration script.'));
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
    if (stryMutAct_9fa48("2778")) {
      {}
    } else {
      stryCov_9fa48("2778");
      try {
        if (stryMutAct_9fa48("2779")) {
          {}
        } else {
          stryCov_9fa48("2779");
          const [dailyActivity, lessonCompletionTrends] = await Promise.all(stryMutAct_9fa48("2780") ? [] : (stryCov_9fa48("2780"), [analyticsRepository.getDailyActivity(days), analyticsRepository.getLessonCompletionTrends(days)]));
          return stryMutAct_9fa48("2781") ? {} : (stryCov_9fa48("2781"), {
            dailyActivity,
            lessonCompletionTrends,
            period: stryMutAct_9fa48("2782") ? `` : (stryCov_9fa48("2782"), `${days} days`)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("2783")) {
          {}
        } else {
          stryCov_9fa48("2783");
          console.error(stryMutAct_9fa48("2784") ? "" : (stryCov_9fa48("2784"), 'Error getting analytics for period:'), error);
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
    if (stryMutAct_9fa48("2785")) {
      {}
    } else {
      stryCov_9fa48("2785");
      const {
        realTimeStats,
        languageDistribution,
        moduleUsage,
        aiPerformance,
        userEngagement
      } = data;

      // Use real-time stats as primary source
      const mostPopularLanguage = stryMutAct_9fa48("2788") ? realTimeStats.popular_language && (languageDistribution.length > 0 ? languageDistribution[0].language_name : 'N/A') : stryMutAct_9fa48("2787") ? false : stryMutAct_9fa48("2786") ? true : (stryCov_9fa48("2786", "2787", "2788"), realTimeStats.popular_language || ((stryMutAct_9fa48("2792") ? languageDistribution.length <= 0 : stryMutAct_9fa48("2791") ? languageDistribution.length >= 0 : stryMutAct_9fa48("2790") ? false : stryMutAct_9fa48("2789") ? true : (stryCov_9fa48("2789", "2790", "2791", "2792"), languageDistribution.length > 0)) ? languageDistribution[0].language_name : stryMutAct_9fa48("2793") ? "" : (stryCov_9fa48("2793"), 'N/A')));
      const totalLessons = stryMutAct_9fa48("2796") ? realTimeStats.total_lessons && languageDistribution.reduce((sum, lang) => sum + parseInt(lang.count || 0), 0) : stryMutAct_9fa48("2795") ? false : stryMutAct_9fa48("2794") ? true : (stryCov_9fa48("2794", "2795", "2796"), realTimeStats.total_lessons || languageDistribution.reduce(stryMutAct_9fa48("2797") ? () => undefined : (stryCov_9fa48("2797"), (sum, lang) => stryMutAct_9fa48("2798") ? sum - parseInt(lang.count || 0) : (stryCov_9fa48("2798"), sum + parseInt(stryMutAct_9fa48("2801") ? lang.count && 0 : stryMutAct_9fa48("2800") ? false : stryMutAct_9fa48("2799") ? true : (stryCov_9fa48("2799", "2800", "2801"), lang.count || 0)))), 0));

      // Module preference
      const adminLessons = stryMutAct_9fa48("2804") ? moduleUsage.find(m => m.module_type === 'ADMIN')?.count && 0 : stryMutAct_9fa48("2803") ? false : stryMutAct_9fa48("2802") ? true : (stryCov_9fa48("2802", "2803", "2804"), (stryMutAct_9fa48("2805") ? moduleUsage.find(m => m.module_type === 'ADMIN').count : (stryCov_9fa48("2805"), moduleUsage.find(stryMutAct_9fa48("2806") ? () => undefined : (stryCov_9fa48("2806"), m => stryMutAct_9fa48("2809") ? m.module_type !== 'ADMIN' : stryMutAct_9fa48("2808") ? false : stryMutAct_9fa48("2807") ? true : (stryCov_9fa48("2807", "2808", "2809"), m.module_type === (stryMutAct_9fa48("2810") ? "" : (stryCov_9fa48("2810"), 'ADMIN')))))?.count)) || 0);
      const aiLessons = stryMutAct_9fa48("2813") ? moduleUsage.find(m => m.module_type === 'AI')?.count && 0 : stryMutAct_9fa48("2812") ? false : stryMutAct_9fa48("2811") ? true : (stryCov_9fa48("2811", "2812", "2813"), (stryMutAct_9fa48("2814") ? moduleUsage.find(m => m.module_type === 'AI').count : (stryCov_9fa48("2814"), moduleUsage.find(stryMutAct_9fa48("2815") ? () => undefined : (stryCov_9fa48("2815"), m => stryMutAct_9fa48("2818") ? m.module_type !== 'AI' : stryMutAct_9fa48("2817") ? false : stryMutAct_9fa48("2816") ? true : (stryCov_9fa48("2816", "2817", "2818"), m.module_type === (stryMutAct_9fa48("2819") ? "" : (stryCov_9fa48("2819"), 'AI')))))?.count)) || 0);
      const preferredModule = (stryMutAct_9fa48("2823") ? adminLessons <= aiLessons : stryMutAct_9fa48("2822") ? adminLessons >= aiLessons : stryMutAct_9fa48("2821") ? false : stryMutAct_9fa48("2820") ? true : (stryCov_9fa48("2820", "2821", "2822", "2823"), adminLessons > aiLessons)) ? stryMutAct_9fa48("2824") ? "" : (stryCov_9fa48("2824"), 'ADMIN') : (stryMutAct_9fa48("2828") ? aiLessons <= 0 : stryMutAct_9fa48("2827") ? aiLessons >= 0 : stryMutAct_9fa48("2826") ? false : stryMutAct_9fa48("2825") ? true : (stryCov_9fa48("2825", "2826", "2827", "2828"), aiLessons > 0)) ? stryMutAct_9fa48("2829") ? "" : (stryCov_9fa48("2829"), 'AI') : stryMutAct_9fa48("2830") ? "" : (stryCov_9fa48("2830"), 'N/A');

      // AI success rate - use real-time data if available
      const totalGenerations = stryMutAct_9fa48("2833") ? (realTimeStats.ai_courses_generated || aiPerformance.total_generations) && 0 : stryMutAct_9fa48("2832") ? false : stryMutAct_9fa48("2831") ? true : (stryCov_9fa48("2831", "2832", "2833"), (stryMutAct_9fa48("2835") ? realTimeStats.ai_courses_generated && aiPerformance.total_generations : stryMutAct_9fa48("2834") ? false : (stryCov_9fa48("2834", "2835"), realTimeStats.ai_courses_generated || aiPerformance.total_generations)) || 0);
      const aiSuccessRate = (stryMutAct_9fa48("2839") ? aiPerformance.total_generations <= 0 : stryMutAct_9fa48("2838") ? aiPerformance.total_generations >= 0 : stryMutAct_9fa48("2837") ? false : stryMutAct_9fa48("2836") ? true : (stryCov_9fa48("2836", "2837", "2838", "2839"), aiPerformance.total_generations > 0)) ? (stryMutAct_9fa48("2840") ? aiPerformance.success_count / aiPerformance.total_generations / 100 : (stryCov_9fa48("2840"), (stryMutAct_9fa48("2841") ? aiPerformance.success_count * aiPerformance.total_generations : (stryCov_9fa48("2841"), aiPerformance.success_count / aiPerformance.total_generations)) * 100)).toFixed(1) : (stryMutAct_9fa48("2845") ? totalGenerations <= 0 : stryMutAct_9fa48("2844") ? totalGenerations >= 0 : stryMutAct_9fa48("2843") ? false : stryMutAct_9fa48("2842") ? true : (stryCov_9fa48("2842", "2843", "2844", "2845"), totalGenerations > 0)) ? stryMutAct_9fa48("2846") ? "" : (stryCov_9fa48("2846"), '100') : stryMutAct_9fa48("2847") ? "" : (stryCov_9fa48("2847"), '0');
      return stryMutAct_9fa48("2848") ? {} : (stryCov_9fa48("2848"), {
        mostPopularLanguage,
        totalLessons,
        totalActiveUsers: stryMutAct_9fa48("2851") ? (realTimeStats.active_users || userEngagement.total_active_users) && 0 : stryMutAct_9fa48("2850") ? false : stryMutAct_9fa48("2849") ? true : (stryCov_9fa48("2849", "2850", "2851"), (stryMutAct_9fa48("2853") ? realTimeStats.active_users && userEngagement.total_active_users : stryMutAct_9fa48("2852") ? false : (stryCov_9fa48("2852", "2853"), realTimeStats.active_users || userEngagement.total_active_users)) || 0),
        preferredModule,
        aiSuccessRate: stryMutAct_9fa48("2854") ? `` : (stryCov_9fa48("2854"), `${aiSuccessRate}%`),
        avgLessonsPerUser: (stryMutAct_9fa48("2858") ? realTimeStats.active_users <= 0 : stryMutAct_9fa48("2857") ? realTimeStats.active_users >= 0 : stryMutAct_9fa48("2856") ? false : stryMutAct_9fa48("2855") ? true : (stryCov_9fa48("2855", "2856", "2857", "2858"), realTimeStats.active_users > 0)) ? (stryMutAct_9fa48("2859") ? totalLessons * realTimeStats.active_users : (stryCov_9fa48("2859"), totalLessons / realTimeStats.active_users)).toFixed(1) : parseFloat(stryMutAct_9fa48("2862") ? userEngagement.avg_lessons_per_user && 0 : stryMutAct_9fa48("2861") ? false : stryMutAct_9fa48("2860") ? true : (stryCov_9fa48("2860", "2861", "2862"), userEngagement.avg_lessons_per_user || 0)).toFixed(1)
      });
    }
  }
}
export default new AnalyticsService();