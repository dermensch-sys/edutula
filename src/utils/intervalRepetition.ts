// Interval Repetition System
// Implements spaced repetition algorithm with optimal timing

export interface RepetitionItem {
  id: string;
  content: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  lastReviewed: Date;
  nextReview: Date;
  repetitionCount: number;
  easeFactor: number; // 1.3 to 2.5, affects interval growth
  interval: number; // days until next review
  isCorrect?: boolean;
  context: string;
}

export interface RepetitionSession {
  id: string;
  date: Date;
  items: RepetitionItem[];
  completed: boolean;
  duration: number; // minutes
  accuracy: number; // percentage
}

export class IntervalRepetitionSystem {
  private items: Map<string, RepetitionItem> = new Map();
  private sessions: RepetitionSession[] = [];

  // Standard spaced repetition intervals (in days)
  private readonly INITIAL_INTERVALS = [1, 7, 16, 35, 62, 120, 240];

  constructor() {
    this.loadFromStorage();
  }

  // Add new item to repetition system
  addItem(content: string, category: string, difficulty: 'easy' | 'medium' | 'hard', context: string): RepetitionItem {
    const item: RepetitionItem = {
      id: this.generateId(),
      content,
      category,
      difficulty,
      createdAt: new Date(),
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      repetitionCount: 0,
      easeFactor: 2.5,
      interval: 1,
      context
    };

    this.items.set(item.id, item);
    this.saveToStorage();
    return item;
  }

  // Get items due for review
  getDueItems(): RepetitionItem[] {
    const now = new Date();
    return Array.from(this.items.values())
      .filter(item => item.nextReview <= now)
      .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());
  }

  // Get items for today's 15-minute session
  getTodaySessionItems(): RepetitionItem[] {
    const dueItems = this.getDueItems();
    const sessionItems: RepetitionItem[] = [];
    
    // Prioritize by urgency and difficulty
    const sortedItems = dueItems.sort((a, b) => {
      const urgencyA = this.calculateUrgency(a);
      const urgencyB = this.calculateUrgency(b);
      return urgencyB - urgencyA;
    });

    // Select items for 15-minute session (approximately 10-15 items)
    let estimatedTime = 0;
    for (const item of sortedItems) {
      const itemTime = this.estimateReviewTime(item);
      if (estimatedTime + itemTime <= 15 * 60) { // 15 minutes in seconds
        sessionItems.push(item);
        estimatedTime += itemTime;
      } else {
        break;
      }
    }

    return sessionItems;
  }

  // Process review result and update intervals
  processReview(itemId: string, isCorrect: boolean, responseTime: number): void {
    const item = this.items.get(itemId);
    if (!item) return;

    item.lastReviewed = new Date();
    item.repetitionCount++;
    item.isCorrect = isCorrect;

    if (isCorrect) {
      // Successful review - increase interval
      if (item.repetitionCount === 1) {
        item.interval = 1; // First review after 24 hours
      } else if (item.repetitionCount === 2) {
        item.interval = 7; // Second review after 7 days
      } else if (item.repetitionCount === 3) {
        item.interval = 16; // Third review after 16 days
      } else {
        // Use SM-2 algorithm for subsequent reviews
        item.interval = Math.round(item.interval * item.easeFactor);
      }

      // Adjust ease factor based on response quality
      const responseQuality = this.calculateResponseQuality(responseTime, item.difficulty);
      item.easeFactor = Math.max(1.3, item.easeFactor + (0.1 - (5 - responseQuality) * (0.08 + (5 - responseQuality) * 0.02)));
    } else {
      // Failed review - reset to beginning with shorter interval
      item.repetitionCount = 0;
      item.interval = 1;
      item.easeFactor = Math.max(1.3, item.easeFactor - 0.2);
    }

    // Set next review date
    item.nextReview = new Date(Date.now() + item.interval * 24 * 60 * 60 * 1000);
    
    this.saveToStorage();
  }

  // Create contextual variations of content
  createContextualVariations(item: RepetitionItem): RepetitionItem[] {
    const variations: RepetitionItem[] = [];
    const contexts = this.getContextualVariations(item.category);

    contexts.forEach(context => {
      if (context !== item.context) {
        const variation: RepetitionItem = {
          ...item,
          id: this.generateId(),
          context,
          content: this.adaptContentToContext(item.content, context),
          repetitionCount: 0,
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
        variations.push(variation);
      }
    });

    return variations;
  }

  // Start a new repetition session
  startSession(): RepetitionSession {
    const sessionItems = this.getTodaySessionItems();
    const session: RepetitionSession = {
      id: this.generateId(),
      date: new Date(),
      items: sessionItems,
      completed: false,
      duration: 0,
      accuracy: 0
    };

    this.sessions.push(session);
    return session;
  }

  // Complete a repetition session
  completeSession(sessionId: string, results: { itemId: string; isCorrect: boolean; responseTime: number }[]): void {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return;

    let correctCount = 0;
    const startTime = session.date.getTime();

    results.forEach(result => {
      this.processReview(result.itemId, result.isCorrect, result.responseTime);
      if (result.isCorrect) correctCount++;
    });

    session.completed = true;
    session.duration = Math.round((Date.now() - startTime) / 60000); // minutes
    session.accuracy = (correctCount / results.length) * 100;

    this.saveToStorage();
  }

  // Get statistics
  getStatistics() {
    const totalItems = this.items.size;
    const dueItems = this.getDueItems().length;
    const completedSessions = this.sessions.filter(s => s.completed).length;
    const averageAccuracy = this.sessions.length > 0 
      ? this.sessions.reduce((sum, s) => sum + s.accuracy, 0) / this.sessions.length 
      : 0;

    const categoryStats = new Map<string, { total: number; mastered: number }>();
    
    Array.from(this.items.values()).forEach(item => {
      const category = item.category;
      if (!categoryStats.has(category)) {
        categoryStats.set(category, { total: 0, mastered: 0 });
      }
      const stats = categoryStats.get(category)!;
      stats.total++;
      if (item.repetitionCount >= 3 && item.easeFactor >= 2.0) {
        stats.mastered++;
      }
    });

    return {
      totalItems,
      dueItems,
      completedSessions,
      averageAccuracy: Math.round(averageAccuracy),
      categoryStats: Object.fromEntries(categoryStats),
      streakDays: this.calculateStreak()
    };
  }

  // Private helper methods
  private calculateUrgency(item: RepetitionItem): number {
    const daysPastDue = Math.max(0, (Date.now() - item.nextReview.getTime()) / (24 * 60 * 60 * 1000));
    const difficultyMultiplier = item.difficulty === 'hard' ? 1.5 : item.difficulty === 'medium' ? 1.2 : 1.0;
    return daysPastDue * difficultyMultiplier * (1 / item.easeFactor);
  }

  private estimateReviewTime(item: RepetitionItem): number {
    // Estimate in seconds
    const baseTime = item.difficulty === 'hard' ? 90 : item.difficulty === 'medium' ? 60 : 45;
    const repetitionMultiplier = Math.max(0.5, 1 - (item.repetitionCount * 0.1));
    return Math.round(baseTime * repetitionMultiplier);
  }

  private calculateResponseQuality(responseTime: number, difficulty: 'easy' | 'medium' | 'hard'): number {
    const expectedTime = difficulty === 'hard' ? 90 : difficulty === 'medium' ? 60 : 45;
    const ratio = responseTime / expectedTime;
    
    if (ratio <= 0.5) return 5; // Very fast
    if (ratio <= 1.0) return 4; // Fast
    if (ratio <= 1.5) return 3; // Normal
    if (ratio <= 2.0) return 2; // Slow
    return 1; // Very slow
  }

  private getContextualVariations(category: string): string[] {
    const contextMap: Record<string, string[]> = {
      'ai-fundamentals': ['definition', 'application', 'comparison', 'example', 'problem-solving'],
      'machine-learning': ['algorithm', 'implementation', 'evaluation', 'optimization', 'real-world'],
      'neural-networks': ['architecture', 'training', 'backpropagation', 'applications', 'limitations'],
      'mathematics': ['formula', 'proof', 'application', 'visualization', 'word-problem'],
      'programming': ['syntax', 'debugging', 'optimization', 'design-pattern', 'testing']
    };

    return contextMap[category] || ['review', 'application', 'example'];
  }

  private adaptContentToContext(content: string, context: string): string {
    // This would contain logic to adapt content based on context
    // For now, return original content with context prefix
    const contextPrefixes: Record<string, string> = {
      'definition': 'Дайте определение: ',
      'application': 'Как применяется: ',
      'comparison': 'Сравните: ',
      'example': 'Приведите пример: ',
      'problem-solving': 'Решите задачу: '
    };

    const prefix = contextPrefixes[context] || '';
    return prefix + content;
  }

  private calculateStreak(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasSessionThisDay = this.sessions.some(session => 
        session.completed && 
        session.date >= dayStart && 
        session.date <= dayEnd
      );

      if (hasSessionThisDay) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(): void {
    const data = {
      items: Array.from(this.items.entries()),
      sessions: this.sessions
    };
    localStorage.setItem('intervalRepetition', JSON.stringify(data));
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('intervalRepetition');
      if (data) {
        const parsed = JSON.parse(data);
        this.items = new Map(parsed.items.map(([id, item]: [string, any]) => [
          id,
          {
            ...item,
            createdAt: new Date(item.createdAt),
            lastReviewed: new Date(item.lastReviewed),
            nextReview: new Date(item.nextReview)
          }
        ]));
        this.sessions = parsed.sessions.map((session: any) => ({
          ...session,
          date: new Date(session.date)
        }));
      }
    } catch (error) {
      console.error('Failed to load repetition data:', error);
    }
  }
}

// Singleton instance
export const repetitionSystem = new IntervalRepetitionSystem();