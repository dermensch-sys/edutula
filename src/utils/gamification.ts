// Gamification System
// Implements points, badges, and personal progress tracking

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'consistency' | 'mastery' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  requirements: {
    type: 'streak' | 'score' | 'completion' | 'time' | 'accuracy' | 'category_mastery' | 'total_points';
    value: number;
    category?: string;
  };
}

export interface UserStats {
  totalPoints: number;
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  averageAccuracy: number;
  timeSpentLearning: number; // in minutes
  categoriesCompleted: string[];
  lastActivityDate: Date;
  joinDate: Date;
}

export interface ProgressEntry {
  date: Date;
  points: number;
  activity: string;
  category: string;
  details?: any;
}

export class GamificationSystem {
  private userStats: UserStats;
  private achievements: Map<string, Achievement> = new Map();
  private unlockedAchievements: Set<string> = new Set();
  private progressHistory: ProgressEntry[] = [];

  constructor() {
    this.initializeAchievements();
    this.loadUserData();
  }

  // Initialize all available achievements
  private initializeAchievements(): void {
    const achievements: Achievement[] = [
      // Learning Achievements
      {
        id: 'first_steps',
        name: 'Первые шаги',
        description: 'Завершите первый тест',
        icon: '🎯',
        category: 'learning',
        rarity: 'common',
        points: 50,
        requirements: { type: 'completion', value: 1 }
      },
      {
        id: 'knowledge_seeker',
        name: 'Искатель знаний',
        description: 'Ответьте правильно на 100 вопросов',
        icon: '📚',
        category: 'learning',
        rarity: 'common',
        points: 200,
        requirements: { type: 'score', value: 100 }
      },
      {
        id: 'scholar',
        name: 'Учёный',
        description: 'Ответьте правильно на 500 вопросов',
        icon: '🎓',
        category: 'learning',
        rarity: 'rare',
        points: 500,
        requirements: { type: 'score', value: 500 }
      },
      {
        id: 'master_mind',
        name: 'Мастер разума',
        description: 'Ответьте правильно на 1000 вопросов',
        icon: '🧠',
        category: 'learning',
        rarity: 'epic',
        points: 1000,
        requirements: { type: 'score', value: 1000 }
      },

      // Consistency Achievements
      {
        id: 'daily_learner',
        name: 'Ежедневное обучение',
        description: 'Занимайтесь 3 дня подряд',
        icon: '📅',
        category: 'consistency',
        rarity: 'common',
        points: 100,
        requirements: { type: 'streak', value: 3 }
      },
      {
        id: 'week_warrior',
        name: 'Воин недели',
        description: 'Занимайтесь 7 дней подряд',
        icon: '⚡',
        category: 'consistency',
        rarity: 'rare',
        points: 300,
        requirements: { type: 'streak', value: 7 }
      },
      {
        id: 'month_master',
        name: 'Мастер месяца',
        description: 'Занимайтесь 30 дней подряд',
        icon: '🔥',
        category: 'consistency',
        rarity: 'epic',
        points: 1000,
        requirements: { type: 'streak', value: 30 }
      },
      {
        id: 'unstoppable',
        name: 'Неудержимый',
        description: 'Занимайтесь 100 дней подряд',
        icon: '💎',
        category: 'consistency',
        rarity: 'legendary',
        points: 3000,
        requirements: { type: 'streak', value: 100 }
      },

      // Mastery Achievements
      {
        id: 'ai_novice',
        name: 'Новичок ИИ',
        description: 'Освойте основы искусственного интеллекта',
        icon: '🤖',
        category: 'mastery',
        rarity: 'common',
        points: 250,
        requirements: { type: 'category_mastery', value: 80, category: 'ai-fundamentals' }
      },
      {
        id: 'ml_expert',
        name: 'Эксперт МО',
        description: 'Освойте машинное обучение',
        icon: '🧮',
        category: 'mastery',
        rarity: 'rare',
        points: 400,
        requirements: { type: 'category_mastery', value: 85, category: 'machine-learning' }
      },
      {
        id: 'neural_master',
        name: 'Мастер нейросетей',
        description: 'Освойте нейронные сети',
        icon: '🕸️',
        category: 'mastery',
        rarity: 'epic',
        points: 600,
        requirements: { type: 'category_mastery', value: 90, category: 'neural-networks' }
      },
      {
        id: 'math_genius',
        name: 'Математический гений',
        description: 'Освойте математические концепции',
        icon: '∑',
        category: 'mastery',
        rarity: 'rare',
        points: 500,
        requirements: { type: 'category_mastery', value: 85, category: 'mathematics' }
      },

      // Accuracy Achievements
      {
        id: 'perfectionist',
        name: 'Перфекционист',
        description: 'Достигните 100% точности в тесте',
        icon: '💯',
        category: 'milestone',
        rarity: 'rare',
        points: 300,
        requirements: { type: 'accuracy', value: 100 }
      },
      {
        id: 'consistent_excellence',
        name: 'Стабильное превосходство',
        description: 'Поддерживайте точность выше 90% в 10 тестах',
        icon: '⭐',
        category: 'milestone',
        rarity: 'epic',
        points: 800,
        requirements: { type: 'accuracy', value: 90 }
      },

      // Time-based Achievements
      {
        id: 'speed_learner',
        name: 'Быстрый ученик',
        description: 'Проведите 10 часов в обучении',
        icon: '⏱️',
        category: 'milestone',
        rarity: 'common',
        points: 200,
        requirements: { type: 'time', value: 600 } // 10 hours in minutes
      },
      {
        id: 'dedicated_student',
        name: 'Преданный студент',
        description: 'Проведите 50 часов в обучении',
        icon: '📖',
        category: 'milestone',
        rarity: 'rare',
        points: 750,
        requirements: { type: 'time', value: 3000 } // 50 hours in minutes
      },

      // Special Achievements
      {
        id: 'early_bird',
        name: 'Ранняя пташка',
        description: 'Завершите сессию до 8:00 утра',
        icon: '🌅',
        category: 'special',
        rarity: 'common',
        points: 100,
        requirements: { type: 'completion', value: 1 }
      },
      {
        id: 'night_owl',
        name: 'Сова',
        description: 'Завершите сессию после 22:00',
        icon: '🦉',
        category: 'special',
        rarity: 'common',
        points: 100,
        requirements: { type: 'completion', value: 1 }
      },
      {
        id: 'comeback_kid',
        name: 'Возвращение',
        description: 'Вернитесь к обучению после перерыва в 7 дней',
        icon: '🔄',
        category: 'special',
        rarity: 'rare',
        points: 200,
        requirements: { type: 'completion', value: 1 }
      }
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  // Award points for various activities
  awardPoints(activity: string, category: string, basePoints: number, multiplier: number = 1): number {
    const points = Math.round(basePoints * multiplier);
    this.userStats.totalPoints += points;
    this.userStats.experiencePoints += points;

    // Add to progress history
    this.progressHistory.push({
      date: new Date(),
      points,
      activity,
      category,
      details: { multiplier }
    });

    // Check for level up
    this.checkLevelUp();

    // Check for new achievements
    this.checkAchievements();

    this.saveUserData();
    return points;
  }

  // Calculate points for different activities
  calculatePoints(activityType: string, details: any): { points: number; multiplier: number } {
    let basePoints = 0;
    let multiplier = 1;

    switch (activityType) {
      case 'correct_answer':
        basePoints = 10;
        if (details.difficulty === 'hard') multiplier = 1.5;
        else if (details.difficulty === 'medium') multiplier = 1.2;
        if (details.responseTime && details.responseTime < 30) multiplier += 0.2; // Quick response bonus
        break;

      case 'test_completion':
        basePoints = 50;
        if (details.accuracy >= 90) multiplier = 1.5;
        else if (details.accuracy >= 80) multiplier = 1.3;
        else if (details.accuracy >= 70) multiplier = 1.1;
        break;

      case 'repetition_session':
        basePoints = 30;
        if (details.accuracy >= 85) multiplier = 1.3;
        if (details.streak >= 7) multiplier += 0.2;
        break;

      case 'course_completion':
        basePoints = 200;
        if (details.timeSpent < details.estimatedTime * 0.8) multiplier = 1.2; // Efficiency bonus
        break;

      case 'daily_streak':
        basePoints = 20;
        multiplier = Math.min(2.0, 1 + (details.streakDays * 0.1)); // Increasing bonus up to 2x
        break;

      case 'perfect_score':
        basePoints = 100;
        break;

      default:
        basePoints = 5;
    }

    return { points: basePoints, multiplier };
  }

  // Check for level up
  private checkLevelUp(): void {
    const requiredExp = this.getRequiredExperienceForLevel(this.userStats.level + 1);
    
    if (this.userStats.experiencePoints >= requiredExp) {
      this.userStats.level++;
      this.userStats.experiencePoints -= requiredExp;
      
      // Award level up bonus
      const levelBonus = this.userStats.level * 50;
      this.userStats.totalPoints += levelBonus;
      
      this.progressHistory.push({
        date: new Date(),
        points: levelBonus,
        activity: 'level_up',
        category: 'milestone',
        details: { newLevel: this.userStats.level }
      });
    }

    this.userStats.experienceToNextLevel = this.getRequiredExperienceForLevel(this.userStats.level + 1);
  }

  // Calculate required experience for level
  private getRequiredExperienceForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  // Check for new achievements
  private checkAchievements(): void {
    this.achievements.forEach((achievement, id) => {
      if (this.unlockedAchievements.has(id)) return;

      let isUnlocked = false;

      switch (achievement.requirements.type) {
        case 'streak':
          isUnlocked = this.userStats.currentStreak >= achievement.requirements.value;
          break;
        case 'score':
          isUnlocked = this.userStats.totalCorrectAnswers >= achievement.requirements.value;
          break;
        case 'completion':
          isUnlocked = this.userStats.totalSessions >= achievement.requirements.value;
          break;
        case 'time':
          isUnlocked = this.userStats.timeSpentLearning >= achievement.requirements.value;
          break;
        case 'accuracy':
          isUnlocked = this.userStats.averageAccuracy >= achievement.requirements.value;
          break;
        case 'total_points':
          isUnlocked = this.userStats.totalPoints >= achievement.requirements.value;
          break;
        case 'category_mastery':
          // This would need category-specific tracking
          isUnlocked = false; // Placeholder
          break;
      }

      if (isUnlocked) {
        this.unlockAchievement(id);
      }
    });
  }

  // Unlock achievement
  private unlockAchievement(achievementId: string): void {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || this.unlockedAchievements.has(achievementId)) return;

    this.unlockedAchievements.add(achievementId);
    achievement.unlockedAt = new Date();
    
    // Award achievement points
    this.userStats.totalPoints += achievement.points;
    
    this.progressHistory.push({
      date: new Date(),
      points: achievement.points,
      activity: 'achievement_unlocked',
      category: 'achievement',
      details: { achievementId, name: achievement.name }
    });

    this.saveUserData();
  }

  // Update user statistics
  updateStats(updates: Partial<UserStats>): void {
    Object.assign(this.userStats, updates);
    this.userStats.lastActivityDate = new Date();
    
    // Update streak
    const today = new Date();
    const lastActivity = new Date(this.userStats.lastActivityDate);
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      this.userStats.currentStreak++;
      if (this.userStats.currentStreak > this.userStats.longestStreak) {
        this.userStats.longestStreak = this.userStats.currentStreak;
      }
    } else if (daysDiff > 1) {
      this.userStats.currentStreak = 1;
    }

    this.checkAchievements();
    this.saveUserData();
  }

  // Get user progress data
  getProgressData(days: number = 30): ProgressEntry[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.progressHistory
      .filter(entry => entry.date >= cutoffDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Get achievements by category
  getAchievementsByCategory(category?: string): Achievement[] {
    const achievements = Array.from(this.achievements.values());
    
    if (category) {
      return achievements.filter(a => a.category === category);
    }
    
    return achievements;
  }

  // Get unlocked achievements
  getUnlockedAchievements(): Achievement[] {
    return Array.from(this.unlockedAchievements)
      .map(id => this.achievements.get(id))
      .filter(Boolean) as Achievement[];
  }

  // Get achievement progress
  getAchievementProgress(achievementId: string): number {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return 0;

    if (this.unlockedAchievements.has(achievementId)) return 100;

    let progress = 0;
    const req = achievement.requirements;

    switch (req.type) {
      case 'streak':
        progress = (this.userStats.currentStreak / req.value) * 100;
        break;
      case 'score':
        progress = (this.userStats.totalCorrectAnswers / req.value) * 100;
        break;
      case 'completion':
        progress = (this.userStats.totalSessions / req.value) * 100;
        break;
      case 'time':
        progress = (this.userStats.timeSpentLearning / req.value) * 100;
        break;
      case 'accuracy':
        progress = (this.userStats.averageAccuracy / req.value) * 100;
        break;
      case 'total_points':
        progress = (this.userStats.totalPoints / req.value) * 100;
        break;
    }

    return Math.min(100, Math.max(0, progress));
  }

  // Get user statistics
  getUserStats(): UserStats {
    return { ...this.userStats };
  }

  // Get recent achievements (last 7 days)
  getRecentAchievements(): Achievement[] {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return this.getUnlockedAchievements()
      .filter(achievement => achievement.unlockedAt && achievement.unlockedAt >= weekAgo)
      .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0));
  }

  // Get next achievements to unlock
  getNextAchievements(limit: number = 5): Array<Achievement & { progress: number }> {
    return Array.from(this.achievements.values())
      .filter(achievement => !this.unlockedAchievements.has(achievement.id))
      .map(achievement => ({
        ...achievement,
        progress: this.getAchievementProgress(achievement.id)
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, limit);
  }

  // Save user data to localStorage
  private saveUserData(): void {
    const data = {
      userStats: this.userStats,
      unlockedAchievements: Array.from(this.unlockedAchievements),
      progressHistory: this.progressHistory
    };
    localStorage.setItem('gamificationData', JSON.stringify(data));
  }

  // Load user data from localStorage
  private loadUserData(): void {
    try {
      const data = localStorage.getItem('gamificationData');
      if (data) {
        const parsed = JSON.parse(data);
        this.userStats = {
          ...parsed.userStats,
          lastActivityDate: new Date(parsed.userStats.lastActivityDate),
          joinDate: new Date(parsed.userStats.joinDate)
        };
        this.unlockedAchievements = new Set(parsed.unlockedAchievements);
        this.progressHistory = parsed.progressHistory.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
      } else {
        this.initializeUserStats();
      }
    } catch (error) {
      console.error('Failed to load gamification data:', error);
      this.initializeUserStats();
    }
  }

  // Initialize default user stats
  private initializeUserStats(): void {
    this.userStats = {
      totalPoints: 0,
      level: 1,
      experiencePoints: 0,
      experienceToNextLevel: 100,
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      totalCorrectAnswers: 0,
      totalQuestions: 0,
      averageAccuracy: 0,
      timeSpentLearning: 0,
      categoriesCompleted: [],
      lastActivityDate: new Date(),
      joinDate: new Date()
    };
  }
}

// Singleton instance
export const gamificationSystem = new GamificationSystem();