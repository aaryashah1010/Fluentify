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
    if (stryMutAct_9fa48("2714")) {
      {}
    } else {
      stryCov_9fa48("2714");
      try {
        if (stryMutAct_9fa48("2715")) {
          {}
        } else {
          stryCov_9fa48("2715");
          console.log(stryMutAct_9fa48("2716") ? "" : (stryCov_9fa48("2716"), '📊 Analytics Service - trackLessonCompletion called:'), stryMutAct_9fa48("2717") ? {} : (stryCov_9fa48("2717"), {
            userId,
            language,
            moduleType,
            duration,
            lessonDetails
          }));
          const metadata = stryMutAct_9fa48("2718") ? {} : (stryCov_9fa48("2718"), {
            lessonId: lessonDetails.lessonId,
            unitId: lessonDetails.unitId,
            courseId: lessonDetails.courseId,
            score: lessonDetails.score,
            xpEarned: lessonDetails.xpEarned,
            exercisesCompleted: lessonDetails.exercisesCompleted
          });
          const result = await analyticsRepository.logEvent(userId, stryMutAct_9fa48("2719") ? "" : (stryCov_9fa48("2719"), 'LESSON_COMPLETED'), language, moduleType, duration, metadata);
          console.log(stryMutAct_9fa48("2720") ? "" : (stryCov_9fa48("2720"), '✅ Analytics Service - Event logged successfully:'), result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("2721")) {
          {}
        } else {
          stryCov_9fa48("2721");
          console.error(stryMutAct_9fa48("2722") ? "" : (stryCov_9fa48("2722"), '❌ Analytics Service - Error tracking lesson completion:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Track AI module generation
   */
  async trackAIGeneration(userId, language, success = stryMutAct_9fa48("2723") ? false : (stryCov_9fa48("2723"), true), generationDetails = {}) {
    if (stryMutAct_9fa48("2724")) {
      {}
    } else {
      stryCov_9fa48("2724");
      try {
        if (stryMutAct_9fa48("2725")) {
          {}
        } else {
          stryCov_9fa48("2725");
          const metadata = stryMutAct_9fa48("2726") ? {} : (stryCov_9fa48("2726"), {
            success,
            courseId: generationDetails.courseId,
            unitsGenerated: generationDetails.unitsGenerated,
            lessonsGenerated: generationDetails.lessonsGenerated,
            generationTime: generationDetails.generationTime,
            errorMessage: generationDetails.errorMessage
          });
          await analyticsRepository.logEvent(userId, stryMutAct_9fa48("2727") ? "" : (stryCov_9fa48("2727"), 'AI_MODULE_GENERATED'), language, stryMutAct_9fa48("2728") ? "" : (stryCov_9fa48("2728"), 'AI'), generationDetails.generationTime, metadata);
        }
      } catch (error) {
        if (stryMutAct_9fa48("2729")) {
          {}
        } else {
          stryCov_9fa48("2729");
          console.error(stryMutAct_9fa48("2730") ? "" : (stryCov_9fa48("2730"), 'Error tracking AI generation:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Track admin module usage
   */
  async trackAdminModuleUsage(userId, language, actionType, moduleDetails = {}) {
    if (stryMutAct_9fa48("2731")) {
      {}
    } else {
      stryCov_9fa48("2731");
      try {
        if (stryMutAct_9fa48("2732")) {
          {}
        } else {
          stryCov_9fa48("2732");
          const metadata = stryMutAct_9fa48("2733") ? {} : (stryCov_9fa48("2733"), {
            actionType,
            // 'CREATE_COURSE', 'CREATE_UNIT', 'CREATE_LESSON', 'UPDATE_COURSE', etc.
            courseId: moduleDetails.courseId,
            unitId: moduleDetails.unitId,
            lessonId: moduleDetails.lessonId,
            details: moduleDetails.details
          });
          await analyticsRepository.logEvent(userId, stryMutAct_9fa48("2734") ? "" : (stryCov_9fa48("2734"), 'ADMIN_MODULE_USED'), language, stryMutAct_9fa48("2735") ? "" : (stryCov_9fa48("2735"), 'ADMIN'), null, metadata);
        }
      } catch (error) {
        if (stryMutAct_9fa48("2736")) {
          {}
        } else {
          stryCov_9fa48("2736");
          console.error(stryMutAct_9fa48("2737") ? "" : (stryCov_9fa48("2737"), 'Error tracking admin module usage:'), error);
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
    if (stryMutAct_9fa48("2738")) {
      {}
    } else {
      stryCov_9fa48("2738");
      try {
        if (stryMutAct_9fa48("2739")) {
          {}
        } else {
          stryCov_9fa48("2739");
          const [realTimeStats, languageDistribution, moduleUsage, aiPerformance, dailyActivity, userEngagement, lessonCompletionTrends, averageDuration] = await Promise.all(stryMutAct_9fa48("2740") ? [] : (stryCov_9fa48("2740"), [analyticsRepository.getRealTimeStats().catch(err => {
            if (stryMutAct_9fa48("2741")) {
              {}
            } else {
              stryCov_9fa48("2741");
              console.warn(stryMutAct_9fa48("2742") ? "" : (stryCov_9fa48("2742"), 'Error getting real-time stats:'), err.message);
              return stryMutAct_9fa48("2743") ? {} : (stryCov_9fa48("2743"), {
                total_lessons: 0,
                active_users: 0,
                popular_language: stryMutAct_9fa48("2744") ? "" : (stryCov_9fa48("2744"), 'N/A'),
                ai_courses_generated: 0,
                avg_generation_time: 0,
                total_xp_earned: 0
              });
            }
          }), analyticsRepository.getLanguageDistribution().catch(err => {
            if (stryMutAct_9fa48("2745")) {
              {}
            } else {
              stryCov_9fa48("2745");
              console.warn(stryMutAct_9fa48("2746") ? "" : (stryCov_9fa48("2746"), 'Error getting language distribution:'), err.message);
              return stryMutAct_9fa48("2747") ? ["Stryker was here"] : (stryCov_9fa48("2747"), []);
            }
          }), analyticsRepository.getModuleUsage().catch(err => {
            if (stryMutAct_9fa48("2748")) {
              {}
            } else {
              stryCov_9fa48("2748");
              console.warn(stryMutAct_9fa48("2749") ? "" : (stryCov_9fa48("2749"), 'Error getting module usage:'), err.message);
              return stryMutAct_9fa48("2750") ? ["Stryker was here"] : (stryCov_9fa48("2750"), []);
            }
          }), analyticsRepository.getAIPerformance().catch(err => {
            if (stryMutAct_9fa48("2751")) {
              {}
            } else {
              stryCov_9fa48("2751");
              console.warn(stryMutAct_9fa48("2752") ? "" : (stryCov_9fa48("2752"), 'Error getting AI performance:'), err.message);
              return stryMutAct_9fa48("2753") ? {} : (stryCov_9fa48("2753"), {
                total_generations: 0,
                success_count: 0,
                failure_count: 0
              });
            }
          }), analyticsRepository.getDailyActivity(30).catch(err => {
            if (stryMutAct_9fa48("2754")) {
              {}
            } else {
              stryCov_9fa48("2754");
              console.warn(stryMutAct_9fa48("2755") ? "" : (stryCov_9fa48("2755"), 'Error getting daily activity:'), err.message);
              return stryMutAct_9fa48("2756") ? ["Stryker was here"] : (stryCov_9fa48("2756"), []);
            }
          }), analyticsRepository.getUserEngagement().catch(err => {
            if (stryMutAct_9fa48("2757")) {
              {}
            } else {
              stryCov_9fa48("2757");
              console.warn(stryMutAct_9fa48("2758") ? "" : (stryCov_9fa48("2758"), 'Error getting user engagement:'), err.message);
              return stryMutAct_9fa48("2759") ? {} : (stryCov_9fa48("2759"), {
                total_active_users: 0,
                avg_lessons_per_user: 0,
                max_lessons_per_user: 0
              });
            }
          }), analyticsRepository.getLessonCompletionTrends(30).catch(err => {
            if (stryMutAct_9fa48("2760")) {
              {}
            } else {
              stryCov_9fa48("2760");
              console.warn(stryMutAct_9fa48("2761") ? "" : (stryCov_9fa48("2761"), 'Error getting lesson completion trends:'), err.message);
              return stryMutAct_9fa48("2762") ? ["Stryker was here"] : (stryCov_9fa48("2762"), []);
            }
          }), analyticsRepository.getAverageLessonDuration().catch(err => {
            if (stryMutAct_9fa48("2763")) {
              {}
            } else {
              stryCov_9fa48("2763");
              console.warn(stryMutAct_9fa48("2764") ? "" : (stryCov_9fa48("2764"), 'Error getting average lesson duration:'), err.message);
              return stryMutAct_9fa48("2765") ? ["Stryker was here"] : (stryCov_9fa48("2765"), []);
            }
          })]));
          return stryMutAct_9fa48("2766") ? {} : (stryCov_9fa48("2766"), {
            realTimeStats,
            languageDistribution,
            moduleUsage,
            aiPerformance,
            dailyActivity,
            userEngagement,
            lessonCompletionTrends,
            averageDuration,
            summary: this._generateSummary(stryMutAct_9fa48("2767") ? {} : (stryCov_9fa48("2767"), {
              realTimeStats,
              languageDistribution,
              moduleUsage,
              aiPerformance,
              userEngagement
            }))
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("2768")) {
          {}
        } else {
          stryCov_9fa48("2768");
          console.error(stryMutAct_9fa48("2769") ? "" : (stryCov_9fa48("2769"), 'Error getting analytics:'), error);
          // If it's a "relation does not exist" error, provide helpful message
          if (stryMutAct_9fa48("2772") ? error.message || error.message.includes('does not exist') : stryMutAct_9fa48("2771") ? false : stryMutAct_9fa48("2770") ? true : (stryCov_9fa48("2770", "2771", "2772"), error.message && error.message.includes(stryMutAct_9fa48("2773") ? "" : (stryCov_9fa48("2773"), 'does not exist')))) {
            if (stryMutAct_9fa48("2774")) {
              {}
            } else {
              stryCov_9fa48("2774");
              throw new Error(stryMutAct_9fa48("2775") ? "" : (stryCov_9fa48("2775"), 'Analytics table not found. Please run the analytics migration script.'));
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
    if (stryMutAct_9fa48("2776")) {
      {}
    } else {
      stryCov_9fa48("2776");
      try {
        if (stryMutAct_9fa48("2777")) {
          {}
        } else {
          stryCov_9fa48("2777");
          const [dailyActivity, lessonCompletionTrends] = await Promise.all(stryMutAct_9fa48("2778") ? [] : (stryCov_9fa48("2778"), [analyticsRepository.getDailyActivity(days), analyticsRepository.getLessonCompletionTrends(days)]));
          return stryMutAct_9fa48("2779") ? {} : (stryCov_9fa48("2779"), {
            dailyActivity,
            lessonCompletionTrends,
            period: stryMutAct_9fa48("2780") ? `` : (stryCov_9fa48("2780"), `${days} days`)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("2781")) {
          {}
        } else {
          stryCov_9fa48("2781");
          console.error(stryMutAct_9fa48("2782") ? "" : (stryCov_9fa48("2782"), 'Error getting analytics for period:'), error);
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
    if (stryMutAct_9fa48("2783")) {
      {}
    } else {
      stryCov_9fa48("2783");
      const {
        realTimeStats,
        languageDistribution,
        moduleUsage,
        aiPerformance,
        userEngagement
      } = data;

      // Use real-time stats as primary source, but ignore placeholder 'N/A'
      let mostPopularLanguage = (stryMutAct_9fa48("2786") ? realTimeStats && typeof realTimeStats.popular_language === 'string' && realTimeStats.popular_language.trim() || realTimeStats.popular_language.trim() !== 'N/A' : stryMutAct_9fa48("2785") ? false : stryMutAct_9fa48("2784") ? true : (stryCov_9fa48("2784", "2785", "2786"), (stryMutAct_9fa48("2788") ? realTimeStats && typeof realTimeStats.popular_language === 'string' || realTimeStats.popular_language.trim() : stryMutAct_9fa48("2787") ? true : (stryCov_9fa48("2787", "2788"), (stryMutAct_9fa48("2790") ? realTimeStats || typeof realTimeStats.popular_language === 'string' : stryMutAct_9fa48("2789") ? true : (stryCov_9fa48("2789", "2790"), realTimeStats && (stryMutAct_9fa48("2792") ? typeof realTimeStats.popular_language !== 'string' : stryMutAct_9fa48("2791") ? true : (stryCov_9fa48("2791", "2792"), typeof realTimeStats.popular_language === (stryMutAct_9fa48("2793") ? "" : (stryCov_9fa48("2793"), 'string')))))) && (stryMutAct_9fa48("2794") ? realTimeStats.popular_language : (stryCov_9fa48("2794"), realTimeStats.popular_language.trim())))) && (stryMutAct_9fa48("2796") ? realTimeStats.popular_language.trim() === 'N/A' : stryMutAct_9fa48("2795") ? true : (stryCov_9fa48("2795", "2796"), (stryMutAct_9fa48("2797") ? realTimeStats.popular_language : (stryCov_9fa48("2797"), realTimeStats.popular_language.trim())) !== (stryMutAct_9fa48("2798") ? "" : (stryCov_9fa48("2798"), 'N/A')))))) ? stryMutAct_9fa48("2799") ? realTimeStats.popular_language : (stryCov_9fa48("2799"), realTimeStats.popular_language.trim()) : undefined;
      if (stryMutAct_9fa48("2802") ? false : stryMutAct_9fa48("2801") ? true : stryMutAct_9fa48("2800") ? mostPopularLanguage : (stryCov_9fa48("2800", "2801", "2802"), !mostPopularLanguage)) {
        if (stryMutAct_9fa48("2803")) {
          {}
        } else {
          stryCov_9fa48("2803");
          mostPopularLanguage = (stryMutAct_9fa48("2806") ? Array.isArray(languageDistribution) || languageDistribution.length > 0 : stryMutAct_9fa48("2805") ? false : stryMutAct_9fa48("2804") ? true : (stryCov_9fa48("2804", "2805", "2806"), Array.isArray(languageDistribution) && (stryMutAct_9fa48("2809") ? languageDistribution.length <= 0 : stryMutAct_9fa48("2808") ? languageDistribution.length >= 0 : stryMutAct_9fa48("2807") ? true : (stryCov_9fa48("2807", "2808", "2809"), languageDistribution.length > 0)))) ? languageDistribution[0].language_name : stryMutAct_9fa48("2810") ? "" : (stryCov_9fa48("2810"), 'N/A');
        }
      }
      const totalLessons = stryMutAct_9fa48("2813") ? realTimeStats.total_lessons && languageDistribution.reduce((sum, lang) => sum + parseInt(lang.count || 0), 0) : stryMutAct_9fa48("2812") ? false : stryMutAct_9fa48("2811") ? true : (stryCov_9fa48("2811", "2812", "2813"), realTimeStats.total_lessons || languageDistribution.reduce(stryMutAct_9fa48("2814") ? () => undefined : (stryCov_9fa48("2814"), (sum, lang) => stryMutAct_9fa48("2815") ? sum - parseInt(lang.count || 0) : (stryCov_9fa48("2815"), sum + parseInt(stryMutAct_9fa48("2818") ? lang.count && 0 : stryMutAct_9fa48("2817") ? false : stryMutAct_9fa48("2816") ? true : (stryCov_9fa48("2816", "2817", "2818"), lang.count || 0)))), 0));

      // Module preference
      const adminLessons = stryMutAct_9fa48("2821") ? moduleUsage.find(m => m.module_type === 'ADMIN')?.count && 0 : stryMutAct_9fa48("2820") ? false : stryMutAct_9fa48("2819") ? true : (stryCov_9fa48("2819", "2820", "2821"), (stryMutAct_9fa48("2822") ? moduleUsage.find(m => m.module_type === 'ADMIN').count : (stryCov_9fa48("2822"), moduleUsage.find(stryMutAct_9fa48("2823") ? () => undefined : (stryCov_9fa48("2823"), m => stryMutAct_9fa48("2826") ? m.module_type !== 'ADMIN' : stryMutAct_9fa48("2825") ? false : stryMutAct_9fa48("2824") ? true : (stryCov_9fa48("2824", "2825", "2826"), m.module_type === (stryMutAct_9fa48("2827") ? "" : (stryCov_9fa48("2827"), 'ADMIN')))))?.count)) || 0);
      const aiLessons = stryMutAct_9fa48("2830") ? moduleUsage.find(m => m.module_type === 'AI')?.count && 0 : stryMutAct_9fa48("2829") ? false : stryMutAct_9fa48("2828") ? true : (stryCov_9fa48("2828", "2829", "2830"), (stryMutAct_9fa48("2831") ? moduleUsage.find(m => m.module_type === 'AI').count : (stryCov_9fa48("2831"), moduleUsage.find(stryMutAct_9fa48("2832") ? () => undefined : (stryCov_9fa48("2832"), m => stryMutAct_9fa48("2835") ? m.module_type !== 'AI' : stryMutAct_9fa48("2834") ? false : stryMutAct_9fa48("2833") ? true : (stryCov_9fa48("2833", "2834", "2835"), m.module_type === (stryMutAct_9fa48("2836") ? "" : (stryCov_9fa48("2836"), 'AI')))))?.count)) || 0);
      const preferredModule = (stryMutAct_9fa48("2840") ? adminLessons <= aiLessons : stryMutAct_9fa48("2839") ? adminLessons >= aiLessons : stryMutAct_9fa48("2838") ? false : stryMutAct_9fa48("2837") ? true : (stryCov_9fa48("2837", "2838", "2839", "2840"), adminLessons > aiLessons)) ? stryMutAct_9fa48("2841") ? "" : (stryCov_9fa48("2841"), 'ADMIN') : (stryMutAct_9fa48("2845") ? aiLessons <= 0 : stryMutAct_9fa48("2844") ? aiLessons >= 0 : stryMutAct_9fa48("2843") ? false : stryMutAct_9fa48("2842") ? true : (stryCov_9fa48("2842", "2843", "2844", "2845"), aiLessons > 0)) ? stryMutAct_9fa48("2846") ? "" : (stryCov_9fa48("2846"), 'AI') : stryMutAct_9fa48("2847") ? "" : (stryCov_9fa48("2847"), 'N/A');

      // AI success rate - use real-time data if available
      const totalGenerations = stryMutAct_9fa48("2850") ? (realTimeStats.ai_courses_generated || aiPerformance.total_generations) && 0 : stryMutAct_9fa48("2849") ? false : stryMutAct_9fa48("2848") ? true : (stryCov_9fa48("2848", "2849", "2850"), (stryMutAct_9fa48("2852") ? realTimeStats.ai_courses_generated && aiPerformance.total_generations : stryMutAct_9fa48("2851") ? false : (stryCov_9fa48("2851", "2852"), realTimeStats.ai_courses_generated || aiPerformance.total_generations)) || 0);
      const aiSuccessRate = (stryMutAct_9fa48("2856") ? aiPerformance.total_generations <= 0 : stryMutAct_9fa48("2855") ? aiPerformance.total_generations >= 0 : stryMutAct_9fa48("2854") ? false : stryMutAct_9fa48("2853") ? true : (stryCov_9fa48("2853", "2854", "2855", "2856"), aiPerformance.total_generations > 0)) ? (stryMutAct_9fa48("2857") ? aiPerformance.success_count / aiPerformance.total_generations / 100 : (stryCov_9fa48("2857"), (stryMutAct_9fa48("2858") ? aiPerformance.success_count * aiPerformance.total_generations : (stryCov_9fa48("2858"), aiPerformance.success_count / aiPerformance.total_generations)) * 100)).toFixed(1) : (stryMutAct_9fa48("2862") ? totalGenerations <= 0 : stryMutAct_9fa48("2861") ? totalGenerations >= 0 : stryMutAct_9fa48("2860") ? false : stryMutAct_9fa48("2859") ? true : (stryCov_9fa48("2859", "2860", "2861", "2862"), totalGenerations > 0)) ? stryMutAct_9fa48("2863") ? "" : (stryCov_9fa48("2863"), '100') : stryMutAct_9fa48("2864") ? "" : (stryCov_9fa48("2864"), '0');
      return stryMutAct_9fa48("2865") ? {} : (stryCov_9fa48("2865"), {
        mostPopularLanguage,
        totalLessons,
        totalActiveUsers: stryMutAct_9fa48("2868") ? (realTimeStats.active_users || userEngagement.total_active_users) && 0 : stryMutAct_9fa48("2867") ? false : stryMutAct_9fa48("2866") ? true : (stryCov_9fa48("2866", "2867", "2868"), (stryMutAct_9fa48("2870") ? realTimeStats.active_users && userEngagement.total_active_users : stryMutAct_9fa48("2869") ? false : (stryCov_9fa48("2869", "2870"), realTimeStats.active_users || userEngagement.total_active_users)) || 0),
        preferredModule,
        aiSuccessRate: stryMutAct_9fa48("2871") ? `` : (stryCov_9fa48("2871"), `${aiSuccessRate}%`),
        avgLessonsPerUser: (stryMutAct_9fa48("2875") ? realTimeStats.active_users <= 0 : stryMutAct_9fa48("2874") ? realTimeStats.active_users >= 0 : stryMutAct_9fa48("2873") ? false : stryMutAct_9fa48("2872") ? true : (stryCov_9fa48("2872", "2873", "2874", "2875"), realTimeStats.active_users > 0)) ? (stryMutAct_9fa48("2876") ? totalLessons * realTimeStats.active_users : (stryCov_9fa48("2876"), totalLessons / realTimeStats.active_users)).toFixed(1) : parseFloat(stryMutAct_9fa48("2879") ? userEngagement.avg_lessons_per_user && 0 : stryMutAct_9fa48("2878") ? false : stryMutAct_9fa48("2877") ? true : (stryCov_9fa48("2877", "2878", "2879"), userEngagement.avg_lessons_per_user || 0)).toFixed(1)
      });
    }
  }
}
export default new AnalyticsService();