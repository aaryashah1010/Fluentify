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
    if (stryMutAct_9fa48("3043")) {
      {}
    } else {
      stryCov_9fa48("3043");
      try {
        if (stryMutAct_9fa48("3044")) {
          {}
        } else {
          stryCov_9fa48("3044");
          console.log(stryMutAct_9fa48("3045") ? "" : (stryCov_9fa48("3045"), '📊 Analytics Service - trackLessonCompletion called:'), stryMutAct_9fa48("3046") ? {} : (stryCov_9fa48("3046"), {
            userId,
            language,
            moduleType,
            duration,
            lessonDetails
          }));
          const metadata = stryMutAct_9fa48("3047") ? {} : (stryCov_9fa48("3047"), {
            lessonId: lessonDetails.lessonId,
            unitId: lessonDetails.unitId,
            courseId: lessonDetails.courseId,
            score: lessonDetails.score,
            xpEarned: lessonDetails.xpEarned,
            exercisesCompleted: lessonDetails.exercisesCompleted
          });
          const result = await analyticsRepository.logEvent(userId, stryMutAct_9fa48("3048") ? "" : (stryCov_9fa48("3048"), 'LESSON_COMPLETED'), language, moduleType, duration, metadata);
          console.log(stryMutAct_9fa48("3049") ? "" : (stryCov_9fa48("3049"), '✅ Analytics Service - Event logged successfully:'), result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3050")) {
          {}
        } else {
          stryCov_9fa48("3050");
          console.error(stryMutAct_9fa48("3051") ? "" : (stryCov_9fa48("3051"), '❌ Analytics Service - Error tracking lesson completion:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Track AI module generation
   */
  async trackAIGeneration(userId, language, success = stryMutAct_9fa48("3052") ? false : (stryCov_9fa48("3052"), true), generationDetails = {}) {
    if (stryMutAct_9fa48("3053")) {
      {}
    } else {
      stryCov_9fa48("3053");
      try {
        if (stryMutAct_9fa48("3054")) {
          {}
        } else {
          stryCov_9fa48("3054");
          const metadata = stryMutAct_9fa48("3055") ? {} : (stryCov_9fa48("3055"), {
            success,
            courseId: generationDetails.courseId,
            unitsGenerated: generationDetails.unitsGenerated,
            lessonsGenerated: generationDetails.lessonsGenerated,
            generationTime: generationDetails.generationTime,
            errorMessage: generationDetails.errorMessage
          });
          await analyticsRepository.logEvent(userId, stryMutAct_9fa48("3056") ? "" : (stryCov_9fa48("3056"), 'AI_MODULE_GENERATED'), language, stryMutAct_9fa48("3057") ? "" : (stryCov_9fa48("3057"), 'AI'), generationDetails.generationTime, metadata);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3058")) {
          {}
        } else {
          stryCov_9fa48("3058");
          console.error(stryMutAct_9fa48("3059") ? "" : (stryCov_9fa48("3059"), 'Error tracking AI generation:'), error);
          throw error;
        }
      }
    }
  }

  /**
   * Track admin module usage
   */
  async trackAdminModuleUsage(userId, language, actionType, moduleDetails = {}) {
    if (stryMutAct_9fa48("3060")) {
      {}
    } else {
      stryCov_9fa48("3060");
      try {
        if (stryMutAct_9fa48("3061")) {
          {}
        } else {
          stryCov_9fa48("3061");
          const metadata = stryMutAct_9fa48("3062") ? {} : (stryCov_9fa48("3062"), {
            actionType,
            // 'CREATE_COURSE', 'CREATE_UNIT', 'CREATE_LESSON', 'UPDATE_COURSE', etc.
            courseId: moduleDetails.courseId,
            unitId: moduleDetails.unitId,
            lessonId: moduleDetails.lessonId,
            details: moduleDetails.details
          });
          await analyticsRepository.logEvent(userId, stryMutAct_9fa48("3063") ? "" : (stryCov_9fa48("3063"), 'ADMIN_MODULE_USED'), language, stryMutAct_9fa48("3064") ? "" : (stryCov_9fa48("3064"), 'ADMIN'), null, metadata);
        }
      } catch (error) {
        if (stryMutAct_9fa48("3065")) {
          {}
        } else {
          stryCov_9fa48("3065");
          console.error(stryMutAct_9fa48("3066") ? "" : (stryCov_9fa48("3066"), 'Error tracking admin module usage:'), error);
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
    if (stryMutAct_9fa48("3067")) {
      {}
    } else {
      stryCov_9fa48("3067");
      try {
        if (stryMutAct_9fa48("3068")) {
          {}
        } else {
          stryCov_9fa48("3068");
          const [realTimeStats, languageDistribution, moduleUsage, aiPerformance, dailyActivity, userEngagement, lessonCompletionTrends, averageDuration] = await Promise.all(stryMutAct_9fa48("3069") ? [] : (stryCov_9fa48("3069"), [analyticsRepository.getRealTimeStats().catch(err => {
            if (stryMutAct_9fa48("3070")) {
              {}
            } else {
              stryCov_9fa48("3070");
              console.warn(stryMutAct_9fa48("3071") ? "" : (stryCov_9fa48("3071"), 'Error getting real-time stats:'), err.message);
              return stryMutAct_9fa48("3072") ? {} : (stryCov_9fa48("3072"), {
                total_lessons: 0,
                active_users: 0,
                popular_language: stryMutAct_9fa48("3073") ? "" : (stryCov_9fa48("3073"), 'N/A'),
                ai_courses_generated: 0,
                avg_generation_time: 0,
                total_xp_earned: 0
              });
            }
          }), analyticsRepository.getLanguageDistribution().catch(err => {
            if (stryMutAct_9fa48("3074")) {
              {}
            } else {
              stryCov_9fa48("3074");
              console.warn(stryMutAct_9fa48("3075") ? "" : (stryCov_9fa48("3075"), 'Error getting language distribution:'), err.message);
              return stryMutAct_9fa48("3076") ? ["Stryker was here"] : (stryCov_9fa48("3076"), []);
            }
          }), analyticsRepository.getModuleUsage().catch(err => {
            if (stryMutAct_9fa48("3077")) {
              {}
            } else {
              stryCov_9fa48("3077");
              console.warn(stryMutAct_9fa48("3078") ? "" : (stryCov_9fa48("3078"), 'Error getting module usage:'), err.message);
              return stryMutAct_9fa48("3079") ? ["Stryker was here"] : (stryCov_9fa48("3079"), []);
            }
          }), analyticsRepository.getAIPerformance().catch(err => {
            if (stryMutAct_9fa48("3080")) {
              {}
            } else {
              stryCov_9fa48("3080");
              console.warn(stryMutAct_9fa48("3081") ? "" : (stryCov_9fa48("3081"), 'Error getting AI performance:'), err.message);
              return stryMutAct_9fa48("3082") ? {} : (stryCov_9fa48("3082"), {
                total_generations: 0,
                success_count: 0,
                failure_count: 0
              });
            }
          }), analyticsRepository.getDailyActivity(30).catch(err => {
            if (stryMutAct_9fa48("3083")) {
              {}
            } else {
              stryCov_9fa48("3083");
              console.warn(stryMutAct_9fa48("3084") ? "" : (stryCov_9fa48("3084"), 'Error getting daily activity:'), err.message);
              return stryMutAct_9fa48("3085") ? ["Stryker was here"] : (stryCov_9fa48("3085"), []);
            }
          }), analyticsRepository.getUserEngagement().catch(err => {
            if (stryMutAct_9fa48("3086")) {
              {}
            } else {
              stryCov_9fa48("3086");
              console.warn(stryMutAct_9fa48("3087") ? "" : (stryCov_9fa48("3087"), 'Error getting user engagement:'), err.message);
              return stryMutAct_9fa48("3088") ? {} : (stryCov_9fa48("3088"), {
                total_active_users: 0,
                avg_lessons_per_user: 0,
                max_lessons_per_user: 0
              });
            }
          }), analyticsRepository.getLessonCompletionTrends(30).catch(err => {
            if (stryMutAct_9fa48("3089")) {
              {}
            } else {
              stryCov_9fa48("3089");
              console.warn(stryMutAct_9fa48("3090") ? "" : (stryCov_9fa48("3090"), 'Error getting lesson completion trends:'), err.message);
              return stryMutAct_9fa48("3091") ? ["Stryker was here"] : (stryCov_9fa48("3091"), []);
            }
          }), analyticsRepository.getAverageLessonDuration().catch(err => {
            if (stryMutAct_9fa48("3092")) {
              {}
            } else {
              stryCov_9fa48("3092");
              console.warn(stryMutAct_9fa48("3093") ? "" : (stryCov_9fa48("3093"), 'Error getting average lesson duration:'), err.message);
              return stryMutAct_9fa48("3094") ? ["Stryker was here"] : (stryCov_9fa48("3094"), []);
            }
          })]));
          return stryMutAct_9fa48("3095") ? {} : (stryCov_9fa48("3095"), {
            realTimeStats,
            languageDistribution,
            moduleUsage,
            aiPerformance,
            dailyActivity,
            userEngagement,
            lessonCompletionTrends,
            averageDuration,
            summary: this._generateSummary(stryMutAct_9fa48("3096") ? {} : (stryCov_9fa48("3096"), {
              realTimeStats,
              languageDistribution,
              moduleUsage,
              aiPerformance,
              userEngagement
            }))
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3097")) {
          {}
        } else {
          stryCov_9fa48("3097");
          console.error(stryMutAct_9fa48("3098") ? "" : (stryCov_9fa48("3098"), 'Error getting analytics:'), error);
          // If it's a "relation does not exist" error, provide helpful message
          if (stryMutAct_9fa48("3101") ? error.message || error.message.includes('does not exist') : stryMutAct_9fa48("3100") ? false : stryMutAct_9fa48("3099") ? true : (stryCov_9fa48("3099", "3100", "3101"), error.message && error.message.includes(stryMutAct_9fa48("3102") ? "" : (stryCov_9fa48("3102"), 'does not exist')))) {
            if (stryMutAct_9fa48("3103")) {
              {}
            } else {
              stryCov_9fa48("3103");
              throw new Error(stryMutAct_9fa48("3104") ? "" : (stryCov_9fa48("3104"), 'Analytics table not found. Please run the analytics migration script.'));
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
    if (stryMutAct_9fa48("3105")) {
      {}
    } else {
      stryCov_9fa48("3105");
      try {
        if (stryMutAct_9fa48("3106")) {
          {}
        } else {
          stryCov_9fa48("3106");
          const [dailyActivity, lessonCompletionTrends] = await Promise.all(stryMutAct_9fa48("3107") ? [] : (stryCov_9fa48("3107"), [analyticsRepository.getDailyActivity(days), analyticsRepository.getLessonCompletionTrends(days)]));
          return stryMutAct_9fa48("3108") ? {} : (stryCov_9fa48("3108"), {
            dailyActivity,
            lessonCompletionTrends,
            period: stryMutAct_9fa48("3109") ? `` : (stryCov_9fa48("3109"), `${days} days`)
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("3110")) {
          {}
        } else {
          stryCov_9fa48("3110");
          console.error(stryMutAct_9fa48("3111") ? "" : (stryCov_9fa48("3111"), 'Error getting analytics for period:'), error);
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
    if (stryMutAct_9fa48("3112")) {
      {}
    } else {
      stryCov_9fa48("3112");
      const {
        realTimeStats,
        languageDistribution,
        moduleUsage,
        aiPerformance,
        userEngagement
      } = data;

      // Use real-time stats as primary source, but ignore placeholder 'N/A'
      let mostPopularLanguage = (stryMutAct_9fa48("3115") ? realTimeStats && typeof realTimeStats.popular_language === 'string' && realTimeStats.popular_language.trim() || realTimeStats.popular_language.trim() !== 'N/A' : stryMutAct_9fa48("3114") ? false : stryMutAct_9fa48("3113") ? true : (stryCov_9fa48("3113", "3114", "3115"), (stryMutAct_9fa48("3117") ? realTimeStats && typeof realTimeStats.popular_language === 'string' || realTimeStats.popular_language.trim() : stryMutAct_9fa48("3116") ? true : (stryCov_9fa48("3116", "3117"), (stryMutAct_9fa48("3119") ? realTimeStats || typeof realTimeStats.popular_language === 'string' : stryMutAct_9fa48("3118") ? true : (stryCov_9fa48("3118", "3119"), realTimeStats && (stryMutAct_9fa48("3121") ? typeof realTimeStats.popular_language !== 'string' : stryMutAct_9fa48("3120") ? true : (stryCov_9fa48("3120", "3121"), typeof realTimeStats.popular_language === (stryMutAct_9fa48("3122") ? "" : (stryCov_9fa48("3122"), 'string')))))) && (stryMutAct_9fa48("3123") ? realTimeStats.popular_language : (stryCov_9fa48("3123"), realTimeStats.popular_language.trim())))) && (stryMutAct_9fa48("3125") ? realTimeStats.popular_language.trim() === 'N/A' : stryMutAct_9fa48("3124") ? true : (stryCov_9fa48("3124", "3125"), (stryMutAct_9fa48("3126") ? realTimeStats.popular_language : (stryCov_9fa48("3126"), realTimeStats.popular_language.trim())) !== (stryMutAct_9fa48("3127") ? "" : (stryCov_9fa48("3127"), 'N/A')))))) ? stryMutAct_9fa48("3128") ? realTimeStats.popular_language : (stryCov_9fa48("3128"), realTimeStats.popular_language.trim()) : undefined;
      if (stryMutAct_9fa48("3131") ? false : stryMutAct_9fa48("3130") ? true : stryMutAct_9fa48("3129") ? mostPopularLanguage : (stryCov_9fa48("3129", "3130", "3131"), !mostPopularLanguage)) {
        if (stryMutAct_9fa48("3132")) {
          {}
        } else {
          stryCov_9fa48("3132");
          mostPopularLanguage = (stryMutAct_9fa48("3135") ? Array.isArray(languageDistribution) || languageDistribution.length > 0 : stryMutAct_9fa48("3134") ? false : stryMutAct_9fa48("3133") ? true : (stryCov_9fa48("3133", "3134", "3135"), Array.isArray(languageDistribution) && (stryMutAct_9fa48("3138") ? languageDistribution.length <= 0 : stryMutAct_9fa48("3137") ? languageDistribution.length >= 0 : stryMutAct_9fa48("3136") ? true : (stryCov_9fa48("3136", "3137", "3138"), languageDistribution.length > 0)))) ? languageDistribution[0].language_name : stryMutAct_9fa48("3139") ? "" : (stryCov_9fa48("3139"), 'N/A');
        }
      }
      const totalLessons = stryMutAct_9fa48("3142") ? realTimeStats.total_lessons && languageDistribution.reduce((sum, lang) => sum + parseInt(lang.count || 0), 0) : stryMutAct_9fa48("3141") ? false : stryMutAct_9fa48("3140") ? true : (stryCov_9fa48("3140", "3141", "3142"), realTimeStats.total_lessons || languageDistribution.reduce(stryMutAct_9fa48("3143") ? () => undefined : (stryCov_9fa48("3143"), (sum, lang) => stryMutAct_9fa48("3144") ? sum - parseInt(lang.count || 0) : (stryCov_9fa48("3144"), sum + parseInt(stryMutAct_9fa48("3147") ? lang.count && 0 : stryMutAct_9fa48("3146") ? false : stryMutAct_9fa48("3145") ? true : (stryCov_9fa48("3145", "3146", "3147"), lang.count || 0)))), 0));

      // Module preference
      const adminLessons = stryMutAct_9fa48("3150") ? moduleUsage.find(m => m.module_type === 'ADMIN')?.count && 0 : stryMutAct_9fa48("3149") ? false : stryMutAct_9fa48("3148") ? true : (stryCov_9fa48("3148", "3149", "3150"), (stryMutAct_9fa48("3151") ? moduleUsage.find(m => m.module_type === 'ADMIN').count : (stryCov_9fa48("3151"), moduleUsage.find(stryMutAct_9fa48("3152") ? () => undefined : (stryCov_9fa48("3152"), m => stryMutAct_9fa48("3155") ? m.module_type !== 'ADMIN' : stryMutAct_9fa48("3154") ? false : stryMutAct_9fa48("3153") ? true : (stryCov_9fa48("3153", "3154", "3155"), m.module_type === (stryMutAct_9fa48("3156") ? "" : (stryCov_9fa48("3156"), 'ADMIN')))))?.count)) || 0);
      const aiLessons = stryMutAct_9fa48("3159") ? moduleUsage.find(m => m.module_type === 'AI')?.count && 0 : stryMutAct_9fa48("3158") ? false : stryMutAct_9fa48("3157") ? true : (stryCov_9fa48("3157", "3158", "3159"), (stryMutAct_9fa48("3160") ? moduleUsage.find(m => m.module_type === 'AI').count : (stryCov_9fa48("3160"), moduleUsage.find(stryMutAct_9fa48("3161") ? () => undefined : (stryCov_9fa48("3161"), m => stryMutAct_9fa48("3164") ? m.module_type !== 'AI' : stryMutAct_9fa48("3163") ? false : stryMutAct_9fa48("3162") ? true : (stryCov_9fa48("3162", "3163", "3164"), m.module_type === (stryMutAct_9fa48("3165") ? "" : (stryCov_9fa48("3165"), 'AI')))))?.count)) || 0);
      const preferredModule = (stryMutAct_9fa48("3169") ? adminLessons <= aiLessons : stryMutAct_9fa48("3168") ? adminLessons >= aiLessons : stryMutAct_9fa48("3167") ? false : stryMutAct_9fa48("3166") ? true : (stryCov_9fa48("3166", "3167", "3168", "3169"), adminLessons > aiLessons)) ? stryMutAct_9fa48("3170") ? "" : (stryCov_9fa48("3170"), 'ADMIN') : (stryMutAct_9fa48("3174") ? aiLessons <= 0 : stryMutAct_9fa48("3173") ? aiLessons >= 0 : stryMutAct_9fa48("3172") ? false : stryMutAct_9fa48("3171") ? true : (stryCov_9fa48("3171", "3172", "3173", "3174"), aiLessons > 0)) ? stryMutAct_9fa48("3175") ? "" : (stryCov_9fa48("3175"), 'AI') : stryMutAct_9fa48("3176") ? "" : (stryCov_9fa48("3176"), 'N/A');

      // AI success rate - use real-time data if available
      const totalGenerations = stryMutAct_9fa48("3179") ? (realTimeStats.ai_courses_generated || aiPerformance.total_generations) && 0 : stryMutAct_9fa48("3178") ? false : stryMutAct_9fa48("3177") ? true : (stryCov_9fa48("3177", "3178", "3179"), (stryMutAct_9fa48("3181") ? realTimeStats.ai_courses_generated && aiPerformance.total_generations : stryMutAct_9fa48("3180") ? false : (stryCov_9fa48("3180", "3181"), realTimeStats.ai_courses_generated || aiPerformance.total_generations)) || 0);
      const aiSuccessRate = (stryMutAct_9fa48("3185") ? aiPerformance.total_generations <= 0 : stryMutAct_9fa48("3184") ? aiPerformance.total_generations >= 0 : stryMutAct_9fa48("3183") ? false : stryMutAct_9fa48("3182") ? true : (stryCov_9fa48("3182", "3183", "3184", "3185"), aiPerformance.total_generations > 0)) ? (stryMutAct_9fa48("3186") ? aiPerformance.success_count / aiPerformance.total_generations / 100 : (stryCov_9fa48("3186"), (stryMutAct_9fa48("3187") ? aiPerformance.success_count * aiPerformance.total_generations : (stryCov_9fa48("3187"), aiPerformance.success_count / aiPerformance.total_generations)) * 100)).toFixed(1) : (stryMutAct_9fa48("3191") ? totalGenerations <= 0 : stryMutAct_9fa48("3190") ? totalGenerations >= 0 : stryMutAct_9fa48("3189") ? false : stryMutAct_9fa48("3188") ? true : (stryCov_9fa48("3188", "3189", "3190", "3191"), totalGenerations > 0)) ? stryMutAct_9fa48("3192") ? "" : (stryCov_9fa48("3192"), '100') : stryMutAct_9fa48("3193") ? "" : (stryCov_9fa48("3193"), '0');
      return stryMutAct_9fa48("3194") ? {} : (stryCov_9fa48("3194"), {
        mostPopularLanguage,
        totalLessons,
        totalActiveUsers: stryMutAct_9fa48("3197") ? (realTimeStats.active_users || userEngagement.total_active_users) && 0 : stryMutAct_9fa48("3196") ? false : stryMutAct_9fa48("3195") ? true : (stryCov_9fa48("3195", "3196", "3197"), (stryMutAct_9fa48("3199") ? realTimeStats.active_users && userEngagement.total_active_users : stryMutAct_9fa48("3198") ? false : (stryCov_9fa48("3198", "3199"), realTimeStats.active_users || userEngagement.total_active_users)) || 0),
        preferredModule,
        aiSuccessRate: stryMutAct_9fa48("3200") ? `` : (stryCov_9fa48("3200"), `${aiSuccessRate}%`),
        avgLessonsPerUser: (stryMutAct_9fa48("3204") ? realTimeStats.active_users <= 0 : stryMutAct_9fa48("3203") ? realTimeStats.active_users >= 0 : stryMutAct_9fa48("3202") ? false : stryMutAct_9fa48("3201") ? true : (stryCov_9fa48("3201", "3202", "3203", "3204"), realTimeStats.active_users > 0)) ? (stryMutAct_9fa48("3205") ? totalLessons * realTimeStats.active_users : (stryCov_9fa48("3205"), totalLessons / realTimeStats.active_users)).toFixed(1) : parseFloat(stryMutAct_9fa48("3208") ? userEngagement.avg_lessons_per_user && 0 : stryMutAct_9fa48("3207") ? false : stryMutAct_9fa48("3206") ? true : (stryCov_9fa48("3206", "3207", "3208"), userEngagement.avg_lessons_per_user || 0)).toFixed(1)
      });
    }
  }
}
export default new AnalyticsService();