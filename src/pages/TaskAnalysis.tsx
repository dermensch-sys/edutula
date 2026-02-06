import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, CheckCircle, AlertCircle, Lightbulb, ChevronDown, ChevronRight, X, ArrowRight } from 'lucide-react';

interface PracticeTask {
  id: number;
  equation: string;
  a: number;
  b: number;
  c: number;
  solutions: number[];
  hint?: string;
}

const TaskAnalysis: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<number>(1);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showPractice, setShowPractice] = useState(false);
  const [currentPracticeTask, setCurrentPracticeTask] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '']);
  const [showSolution, setShowSolution] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const practiceTasks: PracticeTask[] = [
    {
      id: 1,
      equation: "x² - 5x + 6 = 0",
      a: 1,
      b: -5,
      c: 6,
      solutions: [2, 3],
      hint: "Найдите два числа, которые при умножении дают 6, а при сложении дают 5"
    },
    {
      id: 2,
      equation: "x² - 4 = 0",
      a: 1,
      b: 0,
      c: -4,
      solutions: [-2, 2],
      hint: "Это разность квадратов: x² - 4 = (x-2)(x+2)"
    },
    {
      id: 3,
      equation: "x² + 6x + 9 = 0",
      a: 1,
      b: 6,
      c: 9,
      solutions: [-3, -3],
      hint: "Это полный квадрат: (x + 3)²"
    },
    {
      id: 4,
      equation: "2x² - 8x + 6 = 0",
      a: 2,
      b: -8,
      c: 6,
      solutions: [1, 3],
      hint: "Сначала вынесите общий множитель 2"
    },
    {
      id: 5,
      equation: "x² + 2x - 3 = 0",
      a: 1,
      b: 2,
      c: -3,
      solutions: [-3, 1],
      hint: "Найдите два числа, которые при умножении дают -3, а при сложении дают 2"
    }
  ];

  const analysisExamples = [
    {
      id: 1,
      title: 'Оптимизация квадратного уравнения',
      subject: 'Математика',
      difficulty: 'Средний',
      timeEstimate: '30 мин',
      description: 'Найдите максимальное значение квадратичной функции с ограничениями.',
      problem: 'Прямоугольник вписан в полукруг радиусом 5. Найдите размеры, которые максимизируют площадь.',
      steps: [
        {
          id: 1,
          title: 'Постановка проблемы',
          content: 'Определите что нужно найти и заданные ограничения.',
          details: 'Нам нужно максимизировать площадь прямоугольника, вписанного в полукруг радиусом 5. Основание прямоугольника находится на диаметре полукруга.',
          keyPoints: ['Прямоугольник, вписанный в полукруг', 'Радиус = 5', 'Максимальная площадь'],
          type: 'understanding'
        },
        {
          id: 2,
          title: 'Настройка системы координат',
          content: 'Для упрощения вычислений поместите полукруг в систему кординат.',
          details: 'Расположите центр полукруга в начале координат, а диаметр — вдоль оси x в точке (-5, 5). Уравнение полукруга: x² + y² = 25 при y ≥ 0.',
          keyPoints: ['Центр происхождения', 'Диаметр по оси x', 'Уравнение: x² + y² = 25'],
          type: 'setup'
        },
        {
          id: 3,
          title: 'Определение переменных',
          content: 'Выразите размеры прямогульника через одну переменную.',
          details: 'Пусть ширина прямоугольника равна 2x, а высота — y. Площадь A = 2xy. Поскольку прямоугольник вписан в прямоугольник, y = √(25 - x²).',
          keyPoints: ['Ширина = 2x', 'Высота = y = √(25 - x²)', 'Площадь = 2xy'],
          type: 'setup'
        },
        {
          id: 4,
          title: 'Создание целевой функции',
          content: 'Выразите площадь как функцию одной переменной.',
          details: 'Пусть ширина прямоугольника равна 2x, а высота — y. Площадь A = 2xy. Поскольку прямоугольник вписан в прямоугольник, y = √(25 - x²).',
          keyPoints: ['A(x) = 2x√(25 - x²)', 'Область определения: 0 ≤ x ≤ 5', 'Оптимизация с одной переменной'],
          type: 'calculation'
        },
        {
          id: 5,
          title: 'Поиск критических точек',
          content: 'Возьмите производную и приравняйте её к нулю.',
          details: "A'(x) = 2√(25 - x²) + 2x · (-x)/√(25 - x²) = 2√(25 - x²) - 2x²/√(25 - x²) = 2(25 - 2x²)/√(25 - x²)",
          keyPoints: ["A'(x) = 2(25 - 2x²)/√(25 - x²)", 'Set A\'(x) = 0', 'Критические точки: x = 5/√2'],
          type: 'calculation'
        },
        {
          id: 6,
          title: 'Проверка макисмума',
          content: 'Возьмите производную и приравняйте её к нулю.',
          details: 'At x = 5/√2, we get maximum area. Width = 2(5/√2) = 5√2, Height = √(25 - 25/2) = 5/√2.',
          keyPoints: ['x = 5/√2 дает максимум', 'Ширина = 5√2', 'Высота = 5/√2', 'Максимальная площадь = 25'],
          type: 'verification'
        }
      ]
    },
    {
      id: 3,
      title: 'Решение квадратного уравнения',
      subject: 'Математика',
      difficulty: 'Промежуточный',
      timeEstimate: '12 мин',
      description: 'Освойте полный процесс решения квадратных уравнений с помощью нескольких методов',
      problem: 'Решите квадратное уравнение: 2x² - 8x + 6 = 0',
      steps: [
        {
          id: 1,
          title: 'Определите стандартную форму',
          content: 'Распознайте квадратное уравнение в стандартной форме ax² + bx + c = 0.',
          details: 'Квадратное уравнение записывается в стандартном виде как ax² + bx + c = 0, если a ≠ 0. В нашем уравнении 2x² - 8x + 6 = 0, мы можем определить: a = 2, b = -8, c = 6.',
          keyPoints: ['Стандартная форма: ax² + bx + c = 0', 'a = 2 (коэффициент при x²)', 'b = -8 (коэффициент при x)', 'c = 6 (постоянный член)', 'a ≠ 0 (существенное условие)'],
          type: 'understanding'
        },
        {
          id: 2,
          title: 'Выберите метод решения',
          content: 'Определите наиболее подходящий метод разложения на множители, выделение полного квадрата или формулу для решения квадратного уравнения',
          details: 'Для 2x² - 8x + 6 = 0, мы можем сначала попробовать разложить его на множители. Поскольку все коэффициенты четные, мы можем вынести за скобки 2:  2(x² - 4x + 3) = 0, что упрощается до x² - 4x + 3 = 0.',
          keyPoints: ['Сначала исключите общие факторы.', 'Упрощенная форма: x² - 4x + 3 = 0', 'Найдите два числа, которые при умножении дают 3, а в сумме -4.', 'Эти числа равны -1 и -3.'],
          type: 'setup'
        },
        {
          id: 3,
          title: 'Примените метод факторизации',
          content: 'Разложите квадратный трехчлен на два биномиальных множителя',
          details: 'Нам нужны два числа, которые при умножении дают +3, а при сложении дают -4. Эти числа -1 и -3. Следовательно, x² - 4x + 3 = (x - 1)(x - 3) = 0.',
          keyPoints: ['x² - 4x + 3 = (x - 1)(x - 3)', 'Проверка: (x - 1)(x - 3) = x² - 3x - x + 3 = x² - 4x + 3 ✓', 'Разложенное на множители выражение: (x - 1)(x - 3) = 0'],
          type: 'calculation'
        },
        {
          id: 4,
          title: 'Решите, используя свойство произведения',
          content: 'Приравняйте каждый множитель к нулю и решите уравнение относительно x.',
          details: 'Если (x - 1)(x - 3) = 0, то либо (x - 1) = 0 либо (x - 3) = 0. Решая уравнение: x - 1 = 0 получим x = 1, и x - 3 = 0 получим x = 3.',
          keyPoints: ['Свойство нулевого произведения: если ab = 0, то a = 0 или b = 0', 'x - 1 = 0 → x = 1', 'x - 3 = 0 → x = 3', 'Два решения: x = 1 and x = 3'],
          type: 'calculation'
        },
        {
          id: 5,
          title: 'Проверка решения',
          content: 'Substitute both solutions back into the original equation to verify.',
          details: 'Для x = 1: 2(1)² - 8(1) + 6 = 2 - 8 + 6 = 0 ✓. Для x = 3: 2(3)² - 8(3) + 6 = 18 - 24 + 6 = 0 ✓. Оба решения верны.',
          keyPoints: ['x = 1: 2(1) - 8(1) + 6 = 0 ✓', 'x = 3: 2(9) - 8(3) + 6 = 0 ✓', 'Оба решения проверены.', 'Множество решений: {1, 3}'],
          type: 'verification'
        },
        {
          id: 6,
          title: 'Второй способ решения',
          content: 'Используйте формулу для решения квадратных уравнений',
          details: 'Используя формулу x = (-b ± √(b² - 4ac)) / (2a) with a = 2, b = -8, c = 6: x = (8 ± √(64 - 48)) / 4 = (8 ± √16) / 4 = (8 ± 4) / 4. Это дает x = 12/4 = 3 or x = 4/4 = 1.',
          keyPoints: ['Квадратичная формула: x = (-b ± √(b² - 4ac)) / (2a)', 'Дискриминант: b² - 4ac = 64 - 48 = 16', 'x = (8 + 4)/4 = 3 или x = (8 - 4)/4 = 1', 'Аналогичные решения подтверждают наш метод факторинга'],
          type: 'verification'
        }
      ]
    },
    {
      id: 2,
      title: 'Проблема химического равновесия',
      subject: 'Математика',
      difficulty: 'Высокий',
      timeEstimate: '50 мин',
      description: 'Рассчитайте равновесные концентрации, используя метод таблицы ICE.',
      problem: 'Для реакции N₂ + 3H₂ ⇌ 2NH₃, Kc = 0,5 при 400°C. Начальные концентрации: [N₂] = 0,1 М, [H₂] = 0,3 М, [NH₃] = 0 М.',
      steps: [
        {
          id: 1,
          title: 'Понимание проблемы',
          content: 'Убедитесь, что химическое уравнение сбалансированно.',
          details: 'N₂ + 3H₂ ⇌ 2NH₃. Стехиометрические коэффициенты равны 1:3:2.',
          keyPoints: ['Сбалансированное уравнение', 'Стехиометрия: 1:3:2', 'Kc = 0.5 при 400°C'],
          type: 'understanding'
        },
        {
          id: 2,
          title: 'Настройка системы координат',
          content: 'Создайте таблицу начальное состояние, изменение состояния и состояние равновесия',
          details: 'Начальная концентрация: [N₂] = 0,1 М, [H₂] = 0,3 М, [NH₃] = 0 М. Изменение: -x, -3x, +2x. Равновесная концентрация: 0,1 -x, 0,3 -3x, 2x.',
          keyPoints: ['формат таблицы ICE', 'Изменения, основанные на стехиометрии.', 'Переменная x обозначает степень реакции'],
          type: 'setup'
        }
      ]
    }
  ];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'understanding': return <Lightbulb className="h-5 w-5" />;
      case 'setup': return <BarChart3 className="h-5 w-5" />;
      case 'calculation': return <AlertCircle className="h-5 w-5" />;
      case 'verification': return <CheckCircle className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'understanding': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'setup': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'calculation': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'verification': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const currentTask = analysisExamples.find(task => task.id === selectedTask);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Анализ задач</h1>
          <p className="text-xl text-graаy-600 max-w-3xl mx-auto">
            Изучите методики решения задач с помощью подробного пошагового анализа. Освойте методологию, лежащую в основе сложных задач.
          </p>
          <p>
            <a href="http://edutula.h1n.ru/">
              <b>Перейти к полной базе задач</b>
            </a>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Task Selection Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Примеры анализа</h3>
              <div className="space-y-3">
                {analysisExamples.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedTask === task.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-1 text-xs rounded-lg ${
                        task.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        task.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {task.difficulty}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.timeEstimate}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.subject}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Analysis Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {currentTask && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Task Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
                      {currentTask.subject}
                    </span>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {currentTask.timeEstimate}
                      </div>
                      <span className="px-2 py-1 bg-white/20 rounded-lg">
                        {currentTask.difficulty}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{currentTask.title}</h2>
                  <p className="text-blue-100">{currentTask.description}</p>
                </div>

                {/* Problem Statement */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Постановка проблемы</h3>
                  <p className="text-gray-700 leading-relaxed">{currentTask.problem}</p>
                </div>

                {/* Step-by-Step Analysis */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Пошаговый анализ</h3>
                  <div className="space-y-4">
                    {currentTask.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                          expandedStep === step.id ? getStepColor(step.type) : 'border-gray-200'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getStepColor(step.type)}`}>
                              {getStepIcon(step.type)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Шаг {index + 1}: {step.title}
                              </h4>
                              <p className="text-sm text-gray-600">{step.content}</p>
                            </div>
                          </div>
                          {expandedStep === step.id ? (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                        </button>

                        {expandedStep === step.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200 bg-white"
                          >
                            <div className="p-4">
                              <h5 className="font-medium text-gray-900 mb-3">Подробное объяснение</h5>
                              <p className="text-gray-700 mb-4 leading-relaxed">{step.details}</p>
                              
                              <h5 className="font-medium text-gray-900 mb-2">Основные положения</h5>
                              <ul className="space-y-1">
                                {step.keyPoints.map((point, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => currentTask?.id === 3 ? setShowPractice(true) : null}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                     Решение аналогичных задач
                    </button>
                    <button className="flex-1 px-4 py-3 bg-white text-blue-600 font-medium rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                      Анализ решений
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Practice Modal */}
      {showPractice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Практика: Решение квадратных уравнений
              </h2>
              <button
                onClick={() => {
                  setShowPractice(false);
                  setCurrentPracticeTask(0);
                  setUserAnswers(['', '']);
                  setShowSolution(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Задача {currentPracticeTask + 1} из {practiceTasks.length}</span>
                <span>Решено: {completedTasks.length}/{practiceTasks.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentPracticeTask + 1) / practiceTasks.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Task */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Решите уравнение: {practiceTasks[currentPracticeTask].equation}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Первый корень (x₁):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={userAnswers[0]}
                    onChange={(e) => setUserAnswers([e.target.value, userAnswers[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите x₁"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Второй корень (x₂):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={userAnswers[1]}
                    onChange={(e) => setUserAnswers([userAnswers[0], e.target.value])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите x₂"
                  />
                </div>
              </div>

              {practiceTasks[currentPracticeTask].hint && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>Подсказка:</strong> {practiceTasks[currentPracticeTask].hint}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Solution Check */}
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                {(() => {
                  const task = practiceTasks[currentPracticeTask];
                  const user1 = parseFloat(userAnswers[0]);
                  const user2 = parseFloat(userAnswers[1]);
                  const correct1 = task.solutions[0];
                  const correct2 = task.solutions[1];
                  
                  const isCorrect = (
                    (user1 === correct1 && user2 === correct2) ||
                    (user1 === correct2 && user2 === correct1)
                  );

                  return (
                    <div className={`rounded-xl p-4 ${
                      isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className={`font-medium mb-2 ${
                            isCorrect ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {isCorrect ? 'Правильно!' : 'Неправильно'}
                          </h4>
                          <p className={`text-sm mb-3 ${
                            isCorrect ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {isCorrect 
                              ? 'Отличная работа! Вы правильно решили уравнение.'
                              : `Правильные корни: x₁ = ${correct1}, x₂ = ${correct2}`
                            }
                          </p>
                          
                          {/* Show step-by-step solution */}
                          <div className="bg-white rounded-lg p-3 text-sm">
                            <h5 className="font-medium text-gray-900 mb-2">Пошаговое решение:</h5>
                            <div className="space-y-1 text-gray-700">
                              <p>1. Уравнение: {task.equation}</p>
                              <p>2. Коэффициенты: a = {task.a}, b = {task.b}, c = {task.c}</p>
                              <p>3. Дискриминант: D = b² - 4ac = {task.b}² - 4({task.a})({task.c}) = {task.b * task.b - 4 * task.a * task.c}</p>
                              <p>4. Корни: x₁ = {task.solutions[0]}, x₂ = {task.solutions[1]}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (currentPracticeTask > 0) {
                    setCurrentPracticeTask(currentPracticeTask - 1);
                    setUserAnswers(['', '']);
                    setShowSolution(false);
                  }
                }}
                disabled={currentPracticeTask === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Предыдущая
              </button>

              <div className="flex space-x-3">
                {!showSolution ? (
                  <button
                    onClick={() => {
                      setShowSolution(true);
                      const task = practiceTasks[currentPracticeTask];
                      const user1 = parseFloat(userAnswers[0]);
                      const user2 = parseFloat(userAnswers[1]);
                      const correct1 = task.solutions[0];
                      const correct2 = task.solutions[1];
                      
                      const isCorrect = (
                        (user1 === correct1 && user2 === correct2) ||
                        (user1 === correct2 && user2 === correct1)
                      );
                      
                      if (isCorrect && !completedTasks.includes(task.id)) {
                        setCompletedTasks([...completedTasks, task.id]);
                      }
                    }}
                    disabled={!userAnswers[0] || !userAnswers[1]}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Проверить
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (currentPracticeTask < practiceTasks.length - 1) {
                        setCurrentPracticeTask(currentPracticeTask + 1);
                        setUserAnswers(['', '']);
                        setShowSolution(false);
                      }
                    }}
                    disabled={currentPracticeTask === practiceTasks.length - 1}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentPracticeTask === practiceTasks.length - 1 ? 'Завершено' : 'Следующая'}
                    {currentPracticeTask < practiceTasks.length - 1 && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Completion Message */}
            {completedTasks.length === practiceTasks.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center"
              >
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-lg font-bold mb-1">Поздравляем!</h3>
                <p className="text-green-100">Вы успешно решили все задачи на квадратные уравнения!</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskAnalysis;