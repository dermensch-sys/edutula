import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, ChevronDown, ChevronRight, Brain, Lightbulb, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIFundamentals: React.FC = () => {
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  const sections = [
    {
      id: 1,
      title: 'Введение в искусственный интеллект',
      icon: Brain,
      content: `
        Искусственный интеллект (ИИ) — это область компьютерных наук, которая занимается созданием 
        интеллектуальных машин, способных работать и реагировать как люди. ИИ стремится к созданию 
        систем, которые могут выполнять задачи, обычно требующие человеческого интеллекта.

        Основные характеристики ИИ:
        • Способность к обучению и адаптации
        • Решение сложных проблем
        • Распознавание образов
        • Принятие решений в условиях неопределенности
        • Обработка естественного языка

        ИИ не является новой концепцией — его корни уходят в древние мифы и философские размышления 
        о создании искусственных существ, наделенных интеллектом.
      `,
      keyPoints: [
        'ИИ — междисциплинарная область науки',
        'Цель: создание машин, способных мыслить',
        'Включает обучение, рассуждение и самокоррекцию',
        'Применяется во многих сферах жизни'
      ]
    },
    {
      id: 2,
      title: 'История развития ИИ',
      icon: BookOpen,
      content: `
        Развитие искусственного интеллекта можно разделить на несколько ключевых этапов:

        1940-1950е годы - Зарождение:
        • Алан Тьюринг предложил тест Тьюринга (1950)
        • Создание первых компьютеров
        • Формирование теоретических основ

        1956 год - Рождение термина:
        • Дартмутская конференция
        • Джон Маккарти ввел термин "искусственный интеллект"
        • Оптимистичные прогнозы развития

        1960-1970е годы - Первые успехи и разочарования:
        • Создание экспертных систем
        • Первая "зима ИИ" из-за завышенных ожиданий
        • Ограничения вычислительных мощностей

        1980-1990е годы - Возрождение:
        • Развитие нейронных сетей
        • Машинное обучение
        • Практические применения

        2000е годы - наше время - Революция:
        • Глубокое обучение
        • Большие данные
        • Мощные вычислительные ресурсы
        • ИИ в повседневной жизни
      `,
      keyPoints: [
        'Более 70 лет развития',
        'Периоды подъема и спада интереса',
        'Ключевые фигуры: Тьюринг, Маккарти, Минский',
        'Современный бум благодаря данным и вычислениям'
      ]
    },
    {
      id: 3,
      title: 'Основные направления ИИ',
      icon: Target,
      content: `
        Искусственный интеллект включает множество направлений и подходов:

        Машинное обучение (Machine Learning):
        • Обучение с учителем (Supervised Learning)
        • Обучение без учителя (Unsupervised Learning)
        • Обучение с подкреплением (Reinforcement Learning)

        Глубокое обучение (Deep Learning):
        • Нейронные сети с множественными слоями
        • Сверточные нейронные сети (CNN)
        • Рекуррентные нейронные сети (RNN)
        • Трансформеры

        Обработка естественного языка (NLP):
        • Понимание и генерация текста
        • Машинный перевод
        • Анализ тональности
        • Чат-боты и виртуальные ассистенты

        Компьютерное зрение:
        • Распознавание объектов
        • Классификация изображений
        • Детекция и сегментация
        • Генерация изображений

        Робототехника:
        • Автономные роботы
        • Планирование движений
        • Взаимодействие с окружающей средой

        Экспертные системы:
        • Системы, основанные на знаниях
        • Логический вывод
        • Принятие решений в специализированных областях
      `,
      keyPoints: [
        'Машинное обучение — основа современного ИИ',
        'Глубокое обучение показывает лучшие результаты',
        'NLP революционизирует взаимодействие с компьютерами',
        'Компьютерное зрение находит широкое применение'
      ]
    },
    {
      id: 4,
      title: 'Типы искусственного интеллекта',
      icon: Zap,
      content: `
        ИИ можно классифицировать по различным критериям:

        По уровню развития:

        1. Узкий ИИ (Narrow AI/Weak AI):
        • Специализирован на конкретных задачах
        • Превосходит человека в ограниченной области
        • Примеры: шахматные программы, рекомендательные системы
        • Весь современный ИИ относится к этой категории

        2. Общий ИИ (General AI/Strong AI):
        • Способен выполнять любые интеллектуальные задачи человека
        • Обладает сознанием и самосознанием
        • Пока не существует, цель исследований

        3. Сверхинтеллект (Superintelligence):
        • Превосходит человеческий интеллект во всех областях
        • Теоретическая концепция
        • Предмет дискуссий о будущем ИИ

        По способу функционирования:

        Реактивные машины:
        • Реагируют на текущую ситуацию
        • Не имеют памяти о прошлом
        • Пример: Deep Blue

        Ограниченная память:
        • Используют прошлый опыт для принятия решений
        • Большинство современных ИИ-систем
        • Пример: автономные автомобили

        Теория разума:
        • Понимают эмоции и мысли других
        • Пока не реализованы

        Самосознание:
        • Обладают сознанием и пониманием себя
        • Гипотетический уровень развития
      `,
      keyPoints: [
        'Современный ИИ — это узкий ИИ',
        'Общий ИИ — цель долгосрочных исследований',
        'Классификация помогает понять возможности',
        'Развитие идет от простого к сложному'
      ]
    },
    {
      id: 5,
      title: 'Применения ИИ в современном мире',
      icon: Lightbulb,
      content: `
        Искусственный интеллект уже сейчас широко применяется в различных сферах:

        Здравоохранение:
        • Диагностика заболеваний по медицинским изображениям
        • Разработка новых лекарств
        • Персонализированная медицина
        • Роботизированная хирургия
        • Анализ генетических данных

        Транспорт:
        • Автономные автомобили
        • Оптимизация маршрутов
        • Управление трафиком
        • Предиктивное обслуживание

        Финансы:
        • Алгоритмическая торговля
        • Оценка кредитных рисков
        • Обнаружение мошенничества
        • Роботы-консультанты
        • Автоматизация процессов

        Образование:
        • Персонализированное обучение
        • Автоматическая проверка работ
        • Интеллектуальные обучающие системы
        • Анализ успеваемости студентов

        Развлечения и медиа:
        • Рекомендательные системы (Netflix, Spotify)
        • Генерация контента
        • Игровой ИИ
        • Создание спецэффектов

        Производство:
        • Предиктивное обслуживание оборудования
        • Контроль качества
        • Оптимизация производственных процессов
        • Роботизация

        Розничная торговля:
        • Персонализированные рекомендации
        • Управление запасами
        • Ценообразование
        • Чат-боты для клиентского сервиса

        Безопасность:
        • Системы видеонаблюдения
        • Кибербезопасность
        • Биометрическая идентификация
        • Анализ угроз
      `,
      keyPoints: [
        'ИИ проникает во все сферы жизни',
        'Наибольший эффект в обработке данных',
        'Автоматизация рутинных задач',
        'Улучшение качества принятия решений'
      ]
    },
    {
      id: 6,
      title: 'Этические аспекты и вызовы ИИ',
      icon: Target,
      content: `
        Развитие ИИ поднимает важные этические вопросы и создает новые вызовы:

        Основные этические проблемы:

        Предвзятость и справедливость:
        • ИИ может усиливать существующие предрассудки
        • Дискриминация в алгоритмах найма, кредитования
        • Необходимость обеспечения справедливости

        Прозрачность и объяснимость:
        • "Черный ящик" — непонятно, как ИИ принимает решения
        • Право на объяснение решений ИИ
        • Важность интерпретируемых моделей

        Приватность и безопасность данных:
        • Сбор и использование персональных данных
        • Защита конфиденциальности
        • Согласие на обработку данных

        Ответственность:
        • Кто несет ответственность за решения ИИ?
        • Правовые аспекты использования ИИ
        • Страхование рисков ИИ

        Социально-экономические вызовы:

        Влияние на рынок труда:
        • Автоматизация может привести к потере рабочих мест
        • Необходимость переквалификации
        • Создание новых профессий

        Цифровое неравенство:
        • Доступ к технологиям ИИ
        • Разрыв между развитыми и развивающимися странами
        • Концентрация власти у технологических гигантов

        Безопасность ИИ:
        • Потенциальные риски сильного ИИ
        • Военное применение ИИ
        • Кибербезопасность систем ИИ

        Регулирование и управление:
        • Необходимость международного сотрудничества
        • Разработка стандартов и норм
        • Баланс между инновациями и безопасностью
      `,
      keyPoints: [
        'Этика ИИ — критически важная область',
        'Необходимо учитывать социальные последствия',
        'Важность прозрачности и подотчетности',
        'Требуется международное регулирование'
      ]
    },
    {
      id: 7,
      title: 'Будущее искусственного интеллекта',
      icon: Brain,
      content: `
        Будущее ИИ полно возможностей и неопределенностей:

        Краткосрочные перспективы (5-10 лет):

        Улучшение существующих технологий:
        • Более точные и эффективные модели
        • Снижение требований к вычислительным ресурсам
        • Улучшение интерпретируемости

        Новые области применения:
        • Персонализированная медицина
        • Умные города
        • Климатические технологии
        • Образовательные технологии

        Интеграция ИИ:
        • ИИ как сервис (AIaaS)
        • Встроенный ИИ в устройства
        • Гибридные человеко-машинные системы

        Долгосрочные перспективы (10+ лет):

        Общий искусственный интеллект:
        • Системы, способные к обобщению
        • Многозадачное обучение
        • Самообучающиеся системы

        Квантовые вычисления и ИИ:
        • Экспоненциальное ускорение вычислений
        • Новые алгоритмы машинного обучения
        • Решение ранее неразрешимых задач

        Нейроморфные вычисления:
        • Чипы, имитирующие работу мозга
        • Энергоэффективные ИИ-системы
        • Новые архитектуры обучения

        Вызовы и риски:

        Технические вызовы:
        • Проблема выравнивания ИИ с человеческими ценностями
        • Контроль над сильным ИИ
        • Обеспечение безопасности

        Социальные изменения:
        • Трансформация экономики
        • Изменение природы работы
        • Новые формы социального взаимодействия

        Подготовка к будущему:
        • Образование и переквалификация
        • Развитие этических стандартов
        • Международное сотрудничество
        • Инвестиции в исследования безопасности ИИ
      `,
      keyPoints: [
        'Быстрое развитие технологий ИИ',
        'Общий ИИ — долгосрочная цель',
        'Необходимость подготовки к изменениям',
        'Важность безопасного развития ИИ'
      ]
    }
  ];

  const toggleSection = (sectionId: number) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const markAsCompleted = (sectionId: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const progress = (completedSections.length / sections.length) * 100;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/theory"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к теории
            
          </Link>
          <br></br>
          <Link
            to="http://edutula.h1n.ru/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Изучить полный курс
            
          </Link>
          
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Основы искусственного интеллекта
          </h1>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Прогресс изучения</span>
              <span className="text-sm text-gray-600">{completedSections.length} из {sections.length} разделов</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isCompleted = completedSections.includes(section.id);
            const isExpanded = expandedSection === section.id;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
                  isExpanded ? 'border-blue-200' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isCompleted ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Icon className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Раздел {section.id} из {sections.length}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6">
                      <div className="prose max-w-none mb-6">
                        {section.content.split('\n').map((paragraph, idx) => {
                          if (paragraph.trim() === '') return null;
                          
                          if (paragraph.trim().endsWith(':')) {
                            return (
                              <h4 key={idx} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                                {paragraph.trim()}
                              </h4>
                            );
                          }
                          
                          if (paragraph.trim().startsWith('•')) {
                            return (
                              <li key={idx} className="text-gray-700 ml-4">
                                {paragraph.trim().substring(1).trim()}
                              </li>
                            );
                          }
                          
                          return (
                            <p key={idx} className="text-gray-700 mb-3 leading-relaxed">
                              {paragraph.trim()}
                            </p>
                          );
                        })}
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h5 className="font-semibold text-blue-900 mb-2">Ключевые моменты:</h5>
                        <ul className="space-y-1">
                          {section.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-blue-800 text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {!isCompleted && (
                        <button
                          onClick={() => markAsCompleted(section.id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        >
                          Отметить как изученное
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedSections.length === sections.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center"
          >
            <CheckCircle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Поздравляем!</h3>
            <p className="text-green-100 mb-4">
              Вы успешно изучили все разделы курса "Основы искусственного интеллекта"
            </p>
            <Link
              to="/tasks"
              className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Перейти к практическим заданиям
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIFundamentals;