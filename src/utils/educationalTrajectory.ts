// Educational Trajectory System
// Builds personalized learning paths based on test results and user progress

import { supabase } from './supabase';

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in hours
  prerequisites: string[];
  skills: string[];
}

export interface TrajectoryStep {
  id: string;
  goalId: string;
  title: string;
  type: 'theory' | 'practice' | 'test' | 'project';
  content: string;
  estimatedTime: number; // in minutes
  isCompleted: boolean;
  completedAt?: Date;
  score?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
}

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  goals: LearningGoal[];
  steps: TrajectoryStep[];
  createdAt: Date;
  updatedAt: Date;
  progress: number; // 0-100
  estimatedCompletionTime: number; // in hours
  adaptations: TrajectoryAdaptation[];
}

export interface TrajectoryAdaptation {
  id: string;
  date: Date;
  reason: string;
  changes: string[];
  testResults?: any;
}

export interface TestAnalysis {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  weakAreas: string[];
  strongAreas: string[];
  recommendedTopics: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

export class EducationalTrajectoryService {
  private learningGoals: Map<string, LearningGoal> = new Map();
  private userPaths: Map<string, LearningPath> = new Map();

  constructor() {
    this.initializeLearningGoals();
    this.loadUserPaths();
  }

  // Create personalized learning path based on test results
  async createPersonalizedPath(userId: string, testResults: any[], userProfile: any): Promise<LearningPath> {
    const analysis = this.analyzeTestResults(testResults);
    const goals = this.selectGoalsBasedOnAnalysis(analysis, userProfile);
    const steps = this.generateLearningSteps(goals, analysis);

    const path: LearningPath = {
      id: this.generateId(),
      userId,
      title: this.generatePathTitle(analysis, userProfile),
      description: this.generatePathDescription(analysis),
      goals,
      steps,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      estimatedCompletionTime: this.calculateEstimatedTime(steps),
      adaptations: []
    };

    // Save to local storage
    this.userPaths.set(userId, path);
    this.saveUserPaths();

    // Save to Supabase
    try {
      await supabase
        .from('test_results')
        .insert({
          user_id: userId,
          test_type: 'entrance',
          score: Math.round((testResults.filter((r: any) => r.isCorrect).length / testResults.length) * 100),
          total_questions: testResults.length,
          correct_answers: testResults.filter((r: any) => r.isCorrect).length,
          results: testResults,
          analysis: analysis
        });

      await supabase
        .from('learning_paths')
        .upsert({
          user_id: userId,
          title: path.title,
          description: path.description,
          goals: goals,
          steps: steps,
          progress: 0,
          estimated_completion_time: path.estimatedCompletionTime,
          adaptations: []
        });
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }

    return path;
  }

  // Analyze test results to identify strengths and weaknesses
  analyzeTestResults(testResults: any[]): TestAnalysis[] {
    const categoryAnalysis = new Map<string, {
      total: number;
      correct: number;
      questions: any[];
    }>();

    // Group results by category
    testResults.forEach(result => {
      const category = result.category || 'general';
      if (!categoryAnalysis.has(category)) {
        categoryAnalysis.set(category, { total: 0, correct: 0, questions: [] });
      }
      
      const analysis = categoryAnalysis.get(category)!;
      analysis.total++;
      analysis.questions.push(result);
      if (result.isCorrect) {
        analysis.correct++;
      }
    });

    // Create analysis for each category
    return Array.from(categoryAnalysis.entries()).map(([category, data]) => {
      const accuracy = (data.correct / data.total) * 100;
      const weakAreas = this.identifyWeakAreas(data.questions);
      const strongAreas = this.identifyStrongAreas(data.questions);
      
      return {
        category,
        totalQuestions: data.total,
        correctAnswers: data.correct,
        accuracy,
        weakAreas,
        strongAreas,
        recommendedTopics: this.getRecommendedTopics(category, accuracy),
        difficultyLevel: this.determineDifficultyLevel(accuracy)
      };
    });
  }

  // Adapt learning path based on new test results
  async adaptPath(userId: string, newTestResults: any[]): Promise<LearningPath | null> {
    const currentPath = await this.getUserPath(userId);
    if (!currentPath) return null;

    const newAnalysis = this.analyzeTestResults(newTestResults);
    const adaptations = this.generateAdaptations(currentPath, newAnalysis);

    if (adaptations.length > 0) {
      // Apply adaptations
      const updatedSteps = this.adaptSteps(currentPath.steps, adaptations);
      const updatedGoals = this.adaptGoals(currentPath.goals, newAnalysis);

      const adaptation: TrajectoryAdaptation = {
        id: this.generateId(),
        date: new Date(),
        reason: 'Test results analysis',
        changes: adaptations,
        testResults: newTestResults
      };

      currentPath.steps = updatedSteps;
      currentPath.goals = updatedGoals;
      currentPath.adaptations.push(adaptation);
      currentPath.updatedAt = new Date();
      currentPath.estimatedCompletionTime = this.calculateEstimatedTime(updatedSteps);

      this.saveUserPaths();

      // Update in Supabase
      try {
        await supabase
          .from('learning_paths')
          .update({
            steps: updatedSteps,
            goals: updatedGoals,
            progress: currentPath.progress,
            adaptations: currentPath.adaptations,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } catch (error) {
        console.error('Error updating path in Supabase:', error);
      }
    }

    return currentPath;
  }

  // Get user's current learning path
  async getUserPath(userId: string): Promise<LearningPath | null> {
    // Check local storage first
    let path = this.userPaths.get(userId) || null;

    // If not in local, try Supabase
    if (!path) {
      try {
        const { data, error } = await supabase
          .from('learning_paths')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (data && !error) {
          path = {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            description: data.description,
            goals: data.goals,
            steps: data.steps.map((s: any) => ({
              ...s,
              completedAt: s.completedAt ? new Date(s.completedAt) : undefined
            })),
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            progress: data.progress,
            estimatedCompletionTime: data.estimated_completion_time,
            adaptations: data.adaptations || []
          };

          this.userPaths.set(userId, path);
        }
      } catch (error) {
        console.error('Error loading from Supabase:', error);
      }
    }

    return path || null;
  }

  // Synchronous version for compatibility
  getUserPathSync(userId: string): LearningPath | null {
    return this.userPaths.get(userId) || null;
  }

  // Mark step as completed
  completeStep(userId: string, stepId: string, score?: number): void {
    const path = this.userPaths.get(userId);
    if (!path) return;

    const step = path.steps.find(s => s.id === stepId);
    if (!step) return;

    step.isCompleted = true;
    step.completedAt = new Date();
    if (score !== undefined) {
      step.score = score;
    }

    // Update path progress
    const completedSteps = path.steps.filter(s => s.isCompleted).length;
    path.progress = (completedSteps / path.steps.length) * 100;
    path.updatedAt = new Date();

    this.saveUserPaths();
  }

  // Get next recommended step
  getNextStep(userId: string): TrajectoryStep | null {
    const path = this.userPaths.get(userId);
    if (!path) return null;

    return path.steps
      .filter(step => !step.isCompleted)
      .sort((a, b) => a.order - b.order)[0] || null;
  }

  // Get learning statistics
  getLearningStats(userId: string): any {
    const path = this.userPaths.get(userId);
    if (!path) return null;

    const completedSteps = path.steps.filter(s => s.isCompleted);
    const totalTime = completedSteps.reduce((sum, step) => sum + step.estimatedTime, 0);
    const averageScore = completedSteps.length > 0 
      ? completedSteps.reduce((sum, step) => sum + (step.score || 0), 0) / completedSteps.length 
      : 0;

    return {
      totalSteps: path.steps.length,
      completedSteps: completedSteps.length,
      progress: path.progress,
      timeSpent: totalTime,
      averageScore,
      currentGoal: this.getCurrentGoal(path),
      nextMilestone: this.getNextMilestone(path)
    };
  }

  // Private helper methods
  private initializeLearningGoals(): void {
    const goals: LearningGoal[] = [
      {
        id: 'ai-fundamentals',
        title: 'Основы искусственного интеллекта',
        description: 'Изучение базовых концепций ИИ, истории развития и основных направлений',
        category: 'ai-basics',
        difficulty: 'beginner',
        estimatedTime: 8,
        prerequisites: [],
        skills: ['Понимание ИИ', 'История ИИ', 'Типы ИИ']
      },
      {
        id: 'machine-learning',
        title: 'Машинное обучение',
        description: 'Изучение алгоритмов машинного обучения и их применения',
        category: 'ml',
        difficulty: 'intermediate',
        estimatedTime: 12,
        prerequisites: ['ai-fundamentals'],
        skills: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning']
      },
      {
        id: 'neural-networks',
        title: 'Нейронные сети',
        description: 'Глубокое изучение нейронных сетей и глубокого обучения',
        category: 'deep-learning',
        difficulty: 'advanced',
        estimatedTime: 16,
        prerequisites: ['machine-learning'],
        skills: ['Neural Architecture', 'Backpropagation', 'Deep Learning']
      },
      {
        id: 'mathematics-basics',
        title: 'Математические основы',
        description: 'Изучение математических концепций, необходимых для понимания ИИ',
        category: 'mathematics',
        difficulty: 'intermediate',
        estimatedTime: 10,
        prerequisites: [],
        skills: ['Linear Algebra', 'Statistics', 'Calculus']
      }
    ];

    goals.forEach(goal => {
      this.learningGoals.set(goal.id, goal);
    });
  }

  private selectGoalsBasedOnAnalysis(analysis: TestAnalysis[], userProfile: any): LearningGoal[] {
    const selectedGoals: LearningGoal[] = [];
    const userLevel = userProfile.level || 'beginner';
    const userInterests = userProfile.interests || [];

    // Always include fundamentals for beginners
    if (userLevel === 'beginner') {
      const fundamentals = this.learningGoals.get('ai-fundamentals');
      if (fundamentals) selectedGoals.push(fundamentals);
    }

    // Add goals based on weak areas
    analysis.forEach(categoryAnalysis => {
      if (categoryAnalysis.accuracy < 70) {
        const relatedGoals = this.getGoalsForCategory(categoryAnalysis.category);
        relatedGoals.forEach(goal => {
          if (!selectedGoals.find(g => g.id === goal.id)) {
            selectedGoals.push(goal);
          }
        });
      }
    });

    // Add goals based on user interests
    userInterests.forEach((interest: string) => {
      const relatedGoals = this.getGoalsForInterest(interest);
      relatedGoals.forEach(goal => {
        if (!selectedGoals.find(g => g.id === goal.id)) {
          selectedGoals.push(goal);
        }
      });
    });

    return selectedGoals.slice(0, 4); // Limit to 4 goals
  }

  private generateLearningSteps(goals: LearningGoal[], analysis: TestAnalysis[]): TrajectoryStep[] {
    const steps: TrajectoryStep[] = [];
    let order = 1;

    goals.forEach(goal => {
      // Theory step
      steps.push({
        id: this.generateId(),
        goalId: goal.id,
        title: `Изучение: ${goal.title}`,
        type: 'theory',
        content: `Теоретический материал по теме "${goal.title}"`,
        estimatedTime: 45,
        isCompleted: false,
        difficulty: 'medium',
        order: order++
      });

      // Practice step
      steps.push({
        id: this.generateId(),
        goalId: goal.id,
        title: `Практика: ${goal.title}`,
        type: 'practice',
        content: `Практические задания по теме "${goal.title}"`,
        estimatedTime: 30,
        isCompleted: false,
        difficulty: 'medium',
        order: order++
      });

      // Test step
      steps.push({
        id: this.generateId(),
        goalId: goal.id,
        title: `Тест: ${goal.title}`,
        type: 'test',
        content: `Проверочный тест по теме "${goal.title}"`,
        estimatedTime: 20,
        isCompleted: false,
        difficulty: 'hard',
        order: order++
      });
    });

    return steps;
  }

  private generatePathTitle(analysis: TestAnalysis[], userProfile: any): string {
    const weakestCategory = analysis.reduce((min, current) => 
      current.accuracy < min.accuracy ? current : min
    );

    const levelMap = {
      'beginner': 'Начальный',
      'intermediate': 'Средний', 
      'advanced': 'Продвинутый'
    };

    const level = levelMap[userProfile.level as keyof typeof levelMap] || 'Персональный';
    return `${level} курс с фокусом на ${this.getCategoryDisplayName(weakestCategory.category)}`;
  }

  private generatePathDescription(analysis: TestAnalysis[]): string {
    const weakAreas = analysis.filter(a => a.accuracy < 70).map(a => this.getCategoryDisplayName(a.category));
    const strongAreas = analysis.filter(a => a.accuracy >= 80).map(a => this.getCategoryDisplayName(a.category));

    let description = 'Персонализированный учебный план, созданный на основе анализа ваших результатов тестирования. ';
    
    if (weakAreas.length > 0) {
      description += `Особое внимание уделяется: ${weakAreas.join(', ')}. `;
    }
    
    if (strongAreas.length > 0) {
      description += `Ваши сильные стороны: ${strongAreas.join(', ')}.`;
    }

    return description;
  }

  private getCategoryDisplayName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'ai-basics': 'Основы ИИ',
      'machine-learning': 'Машинное обучение',
      'neural-networks': 'Нейронные сети',
      'deep-learning': 'Глубокое обучение',
      'mathematics': 'Математика',
      'programming': 'Программирование'
    };
    return categoryNames[category] || category;
  }

  private identifyWeakAreas(questions: any[]): string[] {
    // Analyze incorrect answers to identify specific weak areas
    return questions
      .filter(q => !q.isCorrect)
      .map(q => q.topic || q.category)
      .filter((topic, index, array) => array.indexOf(topic) === index);
  }

  private identifyStrongAreas(questions: any[]): string[] {
    // Analyze correct answers to identify strong areas
    return questions
      .filter(q => q.isCorrect)
      .map(q => q.topic || q.category)
      .filter((topic, index, array) => array.indexOf(topic) === index);
  }

  private getRecommendedTopics(category: string, accuracy: number): string[] {
    const topicMap: { [key: string]: string[] } = {
      'ai-basics': ['История ИИ', 'Типы ИИ', 'Применения ИИ'],
      'machine-learning': ['Алгоритмы обучения', 'Оценка моделей', 'Переобучение'],
      'neural-networks': ['Архитектура сетей', 'Функции активации', 'Оптимизация']
    };

    return topicMap[category] || [];
  }

  private determineDifficultyLevel(accuracy: number): 'beginner' | 'intermediate' | 'advanced' {
    if (accuracy < 60) return 'beginner';
    if (accuracy < 80) return 'intermediate';
    return 'advanced';
  }

  private generateAdaptations(currentPath: LearningPath, newAnalysis: TestAnalysis[]): string[] {
    const adaptations: string[] = [];
    
    // Check if user improved in weak areas
    newAnalysis.forEach(analysis => {
      if (analysis.accuracy < 60) {
        adaptations.push(`Добавлены дополнительные материалы по теме: ${analysis.category}`);
      } else if (analysis.accuracy > 90) {
        adaptations.push(`Ускорен темп изучения темы: ${analysis.category}`);
      }
    });

    return adaptations;
  }

  private adaptSteps(currentSteps: TrajectoryStep[], adaptations: string[]): TrajectoryStep[] {
    // This would contain logic to modify steps based on adaptations
    return currentSteps;
  }

  private adaptGoals(currentGoals: LearningGoal[], newAnalysis: TestAnalysis[]): LearningGoal[] {
    // This would contain logic to modify goals based on new analysis
    return currentGoals;
  }

  private getGoalsForCategory(category: string): LearningGoal[] {
    return Array.from(this.learningGoals.values())
      .filter(goal => goal.category === category);
  }

  private getGoalsForInterest(interest: string): LearningGoal[] {
    return Array.from(this.learningGoals.values())
      .filter(goal => goal.skills.some(skill => 
        skill.toLowerCase().includes(interest.toLowerCase())
      ));
  }

  private getCurrentGoal(path: LearningPath): LearningGoal | null {
    const nextStep = path.steps.find(step => !step.isCompleted);
    if (!nextStep) return null;
    
    return this.learningGoals.get(nextStep.goalId) || null;
  }

  private getNextMilestone(path: LearningPath): any {
    const completedSteps = path.steps.filter(s => s.isCompleted).length;
    const totalSteps = path.steps.length;
    const nextMilestoneAt = Math.ceil(totalSteps * 0.25) * Math.floor(completedSteps / (totalSteps * 0.25) + 1);
    
    return {
      stepsToGo: Math.max(0, nextMilestoneAt - completedSteps),
      percentage: Math.min(100, (nextMilestoneAt / totalSteps) * 100)
    };
  }

  private calculateEstimatedTime(steps: TrajectoryStep[]): number {
    return Math.round(steps.reduce((sum, step) => sum + step.estimatedTime, 0) / 60);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveUserPaths(): void {
    const pathsData = Array.from(this.userPaths.entries()).map(([userId, path]) => [userId, path]);
    localStorage.setItem('userLearningPaths', JSON.stringify(pathsData));
  }

  private loadUserPaths(): void {
    try {
      const data = localStorage.getItem('userLearningPaths');
      if (data) {
        const pathsData = JSON.parse(data);
        this.userPaths = new Map(pathsData.map(([userId, path]: [string, any]) => [
          userId,
          {
            ...path,
            createdAt: new Date(path.createdAt),
            updatedAt: new Date(path.updatedAt),
            adaptations: path.adaptations.map((adaptation: any) => ({
              ...adaptation,
              date: new Date(adaptation.date)
            }))
          }
        ]));
      }
    } catch (error) {
      console.error('Failed to load user paths:', error);
    }
  }
}

// Singleton instance
export const educationalTrajectoryService = new EducationalTrajectoryService();