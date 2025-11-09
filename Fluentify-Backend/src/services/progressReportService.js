import progressReportRepository from '../repositories/progressReportRepository.js';

class ProgressReportService {
  /**
   * Generate comprehensive progress report for a user
   */
  async generateProgressReport(userId, courseId, timeRange = '30days') {
    try {
      // Calculate date range
      const { startDate, endDate } = this._calculateDateRange(timeRange);

      // Fetch all data in parallel for better performance
      const [
        overallStats,
        vocabularyTimeline,
        totalVocabulary,
        vocabularyInPeriod,
        exerciseStats,
        completionTimeline,
        topicsProgress,
        weakAreas,
        streakHistory,
        achievements,
        learningAnalytics
      ] = await Promise.all([
        progressReportRepository.getOverallStats(userId, courseId),
        progressReportRepository.getVocabularyProgressOverTime(userId, courseId, startDate, endDate),
        progressReportRepository.getTotalVocabularyLearned(userId, courseId),
        progressReportRepository.getVocabularyInPeriod(userId, courseId, startDate, endDate),
        progressReportRepository.getExerciseAccuracyStats(userId, courseId),
        progressReportRepository.getLessonCompletionTimeline(userId, courseId, startDate, endDate),
        progressReportRepository.getTimeSpentByTopic(userId, courseId),
        progressReportRepository.getWeakAreas(userId, courseId, 60),
        progressReportRepository.getStreakHistory(userId, courseId),
        progressReportRepository.getUserAchievements(userId),
        progressReportRepository.getLearningAnalytics(userId, courseId, startDate, endDate)
      ]);

      // Calculate vocabulary growth rate
      const vocabularyGrowth = this._calculateVocabularyGrowth(
        totalVocabulary,
        vocabularyInPeriod,
        timeRange
      );

      // Calculate fluency scores
      const fluencyScores = this._calculateFluencyScores(
        overallStats,
        exerciseStats,
        streakHistory,
        completionTimeline
      );

      // Build comprehensive report
      const report = {
        overview: {
          totalLessonsCompleted: parseInt(overallStats.lessons_completed || 0),
          totalUnitsCompleted: parseInt(overallStats.units_completed || 0),
          totalXP: parseInt(overallStats.total_xp || 0),
          currentStreak: parseInt(streakHistory.current_streak || 0),
          longestStreak: parseInt(streakHistory.longest_streak || 0),
          overallProgress: parseFloat(overallStats.overall_progress || 0),
          totalLessons: parseInt(overallStats.total_lessons || 0),
          totalUnits: parseInt(overallStats.total_units || 0)
        },
        vocabularyGrowth: {
          totalWordsLearned: totalVocabulary,
          newWordsInPeriod: vocabularyInPeriod,
          growthRate: vocabularyGrowth.growthRate,
          timeline: vocabularyTimeline.map(item => ({
            date: item.date,
            wordsLearned: parseInt(item.words_learned || 0)
          }))
        },
        fluencyScores: fluencyScores,
        activityTimeline: completionTimeline.map(item => ({
          date: item.date,
          lessonsCompleted: parseInt(item.lessons_completed || 0),
          xpEarned: parseInt(item.xp_earned || 0),
          timeSpentMinutes: parseInt(item.time_spent_minutes || 0)
        })),
        topicsProgress: topicsProgress.map(topic => ({
          unitId: topic.unit_id,
          topic: topic.topic,
          lessonsCompleted: parseInt(topic.lessons_completed || 0),
          totalXP: parseInt(topic.total_xp || 0),
          progress: parseFloat(topic.progress_percentage || 0),
          accuracy: parseFloat(topic.accuracy || 0)
        })),
        weakAreas: weakAreas.map(area => ({
          unitId: area.unit_id,
          topic: area.topic,
          accuracy: parseFloat(area.accuracy || 0),
          totalAttempts: parseInt(area.total_attempts || 0),
          correctAttempts: parseInt(area.correct_attempts || 0),
          needsImprovement: true
        })),
        achievements: achievements.map(achievement => ({
          type: achievement.achievement_type,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          earnedAt: achievement.earned_at
        })),
        exerciseStatistics: {
          totalAttempts: parseInt(exerciseStats.total_attempts || 0),
          correctAttempts: parseInt(exerciseStats.correct_attempts || 0),
          accuracy: parseFloat(exerciseStats.accuracy_percentage || 0)
        },
        timeRange: {
          range: timeRange,
          startDate: startDate,
          endDate: endDate
        }
      };

      return report;
    } catch (error) {
      console.error('Error generating progress report:', error);
      throw error;
    }
  }

  /**
   * Calculate vocabulary growth rate
   */
  _calculateVocabularyGrowth(totalWords, wordsInPeriod, timeRange) {
    // Calculate growth rate based on time period
    let growthRate = 0;
    
    if (totalWords > 0 && wordsInPeriod > 0) {
      const previousWords = totalWords - wordsInPeriod;
      if (previousWords > 0) {
        growthRate = ((wordsInPeriod / previousWords) * 100).toFixed(1);
      } else {
        growthRate = 100; // First time learning
      }
    }

    return {
      growthRate: `+${growthRate}%`,
      wordsPerDay: this._calculateWordsPerDay(wordsInPeriod, timeRange)
    };
  }

  /**
   * Calculate words learned per day
   */
  _calculateWordsPerDay(wordsInPeriod, timeRange) {
    const days = this._getDaysFromTimeRange(timeRange);
    return days > 0 ? (wordsInPeriod / days).toFixed(1) : 0;
  }

  /**
   * Calculate comprehensive fluency scores
   */
  _calculateFluencyScores(overallStats, exerciseStats, streakHistory, completionTimeline) {
    // Calculate individual components
    const completionRate = this._calculateCompletionRate(overallStats);
    const accuracy = parseFloat(exerciseStats.accuracy_percentage || 0);
    const consistency = this._calculateConsistency(streakHistory);
    const timeInvestment = this._calculateTimeInvestment(completionTimeline);

    // Calculate overall fluency score using weighted formula
    const overallScore = (
      completionRate * 0.30 +      // 30% weight
      accuracy * 0.40 +             // 40% weight
      consistency * 0.20 +          // 20% weight
      timeInvestment * 0.10         // 10% weight
    );

    // Calculate category-specific scores (simulated based on available data)
    const categoryScores = this._calculateCategoryScores(accuracy, completionRate);

    return {
      overall: Math.round(overallScore),
      listening: categoryScores.listening,
      reading: categoryScores.reading,
      writing: categoryScores.writing,
      speaking: categoryScores.speaking,
      breakdown: {
        completionRate: Math.round(completionRate),
        accuracy: Math.round(accuracy),
        consistency: Math.round(consistency),
        timeInvestment: Math.round(timeInvestment)
      }
    };
  }

  /**
   * Calculate completion rate
   */
  _calculateCompletionRate(overallStats) {
    const totalLessons = parseInt(overallStats.total_lessons || 0);
    const completedLessons = parseInt(overallStats.lessons_completed || 0);
    
    if (totalLessons === 0) return 0;
    return (completedLessons / totalLessons) * 100;
  }

  /**
   * Calculate consistency score based on streaks
   */
  _calculateConsistency(streakHistory) {
    const currentStreak = parseInt(streakHistory.current_streak || 0);
    const longestStreak = parseInt(streakHistory.longest_streak || 0);
    
    if (longestStreak === 0) return 0;
    
    // Score based on maintaining streak
    const streakRatio = (currentStreak / longestStreak) * 100;
    
    // Bonus for longer streaks
    const streakBonus = Math.min(currentStreak * 2, 30);
    
    return Math.min(streakRatio + streakBonus, 100);
  }

  /**
   * Calculate time investment score
   */
  _calculateTimeInvestment(completionTimeline) {
    if (!completionTimeline || completionTimeline.length === 0) return 0;
    
    const totalMinutes = completionTimeline.reduce((sum, day) => {
      return sum + parseInt(day.time_spent_minutes || 0);
    }, 0);
    
    const avgMinutesPerDay = totalMinutes / completionTimeline.length;
    
    // Score based on average daily time (ideal: 30+ minutes)
    // 0-10 min: 0-33%, 10-20 min: 33-66%, 20-30 min: 66-100%, 30+ min: 100%
    if (avgMinutesPerDay >= 30) return 100;
    if (avgMinutesPerDay >= 20) return 66 + ((avgMinutesPerDay - 20) / 10) * 34;
    if (avgMinutesPerDay >= 10) return 33 + ((avgMinutesPerDay - 10) / 10) * 33;
    return (avgMinutesPerDay / 10) * 33;
  }

  /**
   * Calculate category-specific scores
   * This is a simplified version - can be enhanced with more specific data
   */
  _calculateCategoryScores(baseAccuracy, completionRate) {
    // Simulate category scores with slight variations
    const variation = () => Math.floor(Math.random() * 10) - 5; // -5 to +5
    
    const baseScore = (baseAccuracy + completionRate) / 2;
    
    return {
      listening: Math.max(0, Math.min(100, Math.round(baseScore + variation()))),
      reading: Math.max(0, Math.min(100, Math.round(baseScore + variation()))),
      writing: Math.max(0, Math.min(100, Math.round(baseScore + variation()))),
      speaking: Math.max(0, Math.min(100, Math.round(baseScore + variation())))
    };
  }

  /**
   * Calculate date range based on time range parameter
   */
  _calculateDateRange(timeRange) {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case 'all':
        startDate.setFullYear(2000); // Far back enough to get all data
        break;
      default:
        startDate.setDate(endDate.getDate() - 30); // Default to 30 days
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  /**
   * Get number of days from time range
   */
  _getDaysFromTimeRange(timeRange) {
    switch (timeRange) {
      case '7days':
        return 7;
      case '30days':
        return 30;
      case '90days':
        return 90;
      case 'all':
        return 365; // Approximate for calculation
      default:
        return 30;
    }
  }
}

export default new ProgressReportService();
