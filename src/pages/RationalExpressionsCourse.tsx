import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronDown, ChevronRight, Calculator, BookOpen, Target, Lightbulb } from 'lucide-react';

const RationalExpressionsCourse: React.FC = () => {
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  const sections = [
    {
      id: 1,
      title: 'Введение в рациональные выражения',
      icon: BookOpen,
      content: `
        Рациональное выражение — это выражение, которое можно записать в виде отношения двух многочленов, 
        где знаменатель не равен нулю.

        Общий вид рационального выражения:
        P(x)/Q(x), где P(x) и Q(x) — многочлены, Q(x) ≠ 0

        Примеры рациональных выражений:
        • (x + 1)/(x - 2)
        • (x² - 4)/(x² + 3x + 2)
        • (2x³ - x + 5)/(x² - 1)
        • 3x + 7 (можно записать как (3x + 7)/1)

        Область определения рационального выражения — это множество всех значений переменной, 
        при которых знаменатель не равен нулю.

        Рациональные выражения широко используются в алгебре, математическом анализе, 
        физике и других областях науки для описания различных зависимостей и процессов.
      `,
      keyPoints: [
        'Рациональное выражение = отношение двух многочленов',
        'Знаменатель не должен равняться нулю',
        'Область определения исключает нули знаменателя',
        'Любой многочлен является рациональным выражением'
      ]
    },
    {
      id: 2,
      title: 'Основное свойство рациональной дроби',
      icon: Target,
      content: `
        Основное свойство рациональной дроби является фундаментальным принципом работы с рациональными выражениями.

        Основное свойство:
        Если числитель и знаменатель рациональной дроби умножить или разделить на один и тот же 
        ненулевой многочлен, то получится дробь, равная данной.

        Математическая запись:
        P(x)/Q(x) = (P(x) · R(x))/(Q(x) · R(x)), где R(x) ≠ 0

        Применения основного свойства:

        1. Сокращение дробей:
        (x² - 4)/(x - 2) = ((x - 2)(x + 2))/(x - 2) = x + 2 (при x ≠ 2)

        2. Приведение к общему знаменателю:
        1/(x - 1) и 1/(x + 1) → (x + 1)/((x - 1)(x + 1)) и (x - 1)/((x - 1)(x + 1))

        3. Упрощение сложных выражений:
        Разложение на множители числителя и знаменателя с последующим сокращением

        Важно помнить:
        При сокращении общих множителей область определения может измениться!
        Всегда указывайте ограничения на переменную.
      `,
      keyPoints: [
        'Умножение/деление на ненулевой многочлен сохраняет равенство',
        'Основа для сокращения дробей',
        'Используется для приведения к общему знаменателю',
        'Необходимо следить за областью определения'
      ]
    },
    {
      id: 3,
      title: 'Сокращение рациональных дробей',
      icon: Calculator,
      content: `
        Сокращение рациональных дробей — это процесс упрощения дроби путем деления числителя 
        и знаменателя на их общий множитель.

        Алгоритм сокращения:

        1. Разложить числитель и знаменатель на множители
        2. Найти общие множители
        3. Сократить общие множители
        4. Записать результат с указанием ограничений

        Примеры сокращения:

        Пример 1:
        (x² - 9)/(x - 3) = ((x - 3)(x + 3))/(x - 3) = x + 3, при x ≠ 3

        Пример 2:
        (x² + 5x + 6)/(x² + 3x + 2) = ((x + 2)(x + 3))/((x + 1)(x + 2)) = (x + 3)/(x + 1), при x ≠ -2, x ≠ -1

        Пример 3:
        (2x² - 8)/(4x - 8) = (2(x² - 4))/(4(x - 2)) = (2(x - 2)(x + 2))/(4(x - 2)) = (x + 2)/2, при x ≠ 2

        Особые случаи:

        1. Противоположные выражения:
        (a - b)/(b - a) = -(b - a)/(b - a) = -1, при a ≠ b

        2. Полное сокращение:
        (x - 1)/(x - 1) = 1, при x ≠ 1

        Типичные ошибки:
        • Сокращение слагаемых вместо множителей
        • Забывание об ограничениях на переменную
        • Неправильное разложение на множители
      `,
      keyPoints: [
        'Сначала разложить на множители',
        'Сокращать только общие множители',
        'Обязательно указывать ограничения',
        'Противоположные выражения дают -1'
      ]
    },
    {
      id: 4,
      title: 'Сложение и вычитание рациональных дробей',
      icon: Calculator,
      content: `
        Сложение и вычитание рациональных дробей выполняется по тем же правилам, 
        что и для обычных дробей.

        Случай 1: Одинаковые знаменатели
        P(x)/Q(x) ± R(x)/Q(x) = (P(x) ± R(x))/Q(x)

        Пример:
        (x + 1)/(x - 2) + (x - 3)/(x - 2) = ((x + 1) + (x - 3))/(x - 2) = (2x - 2)/(x - 2) = 2, при x ≠ 2

        Случай 2: Разные знаменатели

        Алгоритм:
        1. Найти наименьший общий знаменатель (НОЗ)
        2. Привести дроби к общему знаменателю
        3. Выполнить сложение/вычитание числителей
        4. Упростить результат

        Пример 1:
        1/(x - 1) + 1/(x + 1)

        НОЗ = (x - 1)(x + 1)
        = (x + 1)/((x - 1)(x + 1)) + (x - 1)/((x - 1)(x + 1))
        = ((x + 1) + (x - 1))/((x - 1)(x + 1))
        = 2x/(x² - 1), при x ≠ ±1

        Пример 2:
        x/(x + 2) - 3/(x - 1)

        НОЗ = (x + 2)(x - 1)
        = (x(x - 1))/((x + 2)(x - 1)) - (3(x + 2))/((x + 2)(x - 1))
        = (x² - x - 3x - 6)/((x + 2)(x - 1))
        = (x² - 4x - 6)/((x + 2)(x - 1)), при x ≠ -2, x ≠ 1

        Особые случаи:

        1. Целое число и дробь:
        2 + 1/(x - 1) = (2(x - 1) + 1)/(x - 1) = (2x - 1)/(x - 1)

        2. Сложные знаменатели:
        При работе с многочленами высших степеней сначала разложите их на множители
      `,
      keyPoints: [
        'Одинаковые знаменатели: складываем числители',
        'Разные знаменатели: находим НОЗ',
        'Приводим к общему знаменателю',
        'Упрощаем результат и указываем ограничения'
      ]
    },
    {
      id: 5,
      title: 'Умножение рациональных дробей',
      icon: Calculator,
      content: `
        Умножение рациональных дробей выполняется по правилу:
        произведение дробей равно дроби, числитель которой равен произведению числителей, 
        а знаменатель — произведению знаменателей.

        Правило умножения:
        (P₁(x)/Q₁(x)) · (P₂(x)/Q₂(x)) = (P₁(x) · P₂(x))/(Q₁(x) · Q₂(x))

        Алгоритм умножения:
        1. Записать произведение числителей и знаменателей
        2. Разложить на множители (если возможно)
        3. Сократить общие множители
        4. Записать результат с ограничениями

        Примеры:

        Пример 1:
        (x + 1)/(x - 2) · (x - 3)/(x + 4) = ((x + 1)(x - 3))/((x - 2)(x + 4))
        При x ≠ 2, x ≠ -4

        Пример 2:
        (x² - 4)/(x + 3) · (x + 3)/(x - 2)
        = ((x - 2)(x + 2)(x + 3))/((x + 3)(x - 2))
        = x + 2, при x ≠ -3, x ≠ 2

        Пример 3:
        (2x)/(x² - 1) · (x - 1)/(4x²)
        = (2x(x - 1))/(4x²(x² - 1))
        = (2x(x - 1))/(4x²(x - 1)(x + 1))
        = 1/(2x(x + 1)), при x ≠ 0, x ≠ ±1

        Умножение на многочлен:
        (x + 1)/(x - 2) · (x + 3) = ((x + 1)(x + 3))/(x - 2)

        Возведение в степень:
        ((x + 1)/(x - 2))² = (x + 1)²/(x - 2)²

        Полезные советы:
        • Сокращайте до умножения, а не после
        • Всегда разлагайте на множители
        • Следите за областью определения
      `,
      keyPoints: [
        'Умножаем числители и знаменатели',
        'Разлагаем на множители перед умножением',
        'Сокращаем общие множители',
        'Область определения — объединение ограничений'
      ]
    },
    {
      id: 6,
      title: 'Деление рациональных дробей',
      icon: Calculator,
      content: `
        Деление рациональных дробей сводится к умножению на обратную дробь.

        Правило деления:
        (P₁(x)/Q₁(x)) : (P₂(x)/Q₂(x)) = (P₁(x)/Q₁(x)) · (Q₂(x)/P₂(x)) = (P₁(x) · Q₂(x))/(Q₁(x) · P₂(x))

        Условие: P₂(x) ≠ 0 (делитель не равен нулю)

        Алгоритм деления:
        1. Заменить деление умножением на обратную дробь
        2. Выполнить умножение по известному алгоритму
        3. Упростить результат
        4. Указать все ограничения

        Примеры:

        Пример 1:
        (x + 1)/(x - 2) : (x + 3)/(x - 4)
        = (x + 1)/(x - 2) · (x - 4)/(x + 3)
        = ((x + 1)(x - 4))/((x - 2)(x + 3))
        При x ≠ 2, x ≠ -3, x ≠ 4

        Пример 2:
        (x² - 9)/(x + 1) : (x - 3)/(x² - 1)
        = (x² - 9)/(x + 1) · (x² - 1)/(x - 3)
        = ((x - 3)(x + 3)(x - 1)(x + 1))/((x + 1)(x - 3))
        = (x + 3)(x - 1) = x² + 2x - 3
        При x ≠ -1, x ≠ 3

        Пример 3:
        (2x + 4)/(x² - 4) : (x + 2)
        = (2x + 4)/(x² - 4) : (x + 2)/1
        = (2x + 4)/(x² - 4) · 1/(x + 2)
        = (2(x + 2))/((x - 2)(x + 2)) · 1/(x + 2)
        = 2/((x - 2)(x + 2)) = 2/(x² - 4)
        При x ≠ ±2

        Деление на многочлен:
        (x² - 1)/(x + 3) : (x - 1) = (x² - 1)/(x + 3) · 1/(x - 1) = (x + 1)/(x + 3)
        При x ≠ -3, x ≠ 1

        Особые случаи:
        • Деление дроби на себя дает 1 (при соответствующих ограничениях)
        • Деление на 1 не изменяет дробь
        • При делении область определения расширяется за счет ограничений делителя
      `,
      keyPoints: [
        'Деление = умножение на обратную дробь',
        'Делитель не должен равняться нулю',
        'Добавляются ограничения от делителя',
        'Упрощение выполняется как при умножении'
      ]
    },
    {
      id: 7,
      title: 'Возведение в степень рациональных дробей',
      icon: Calculator,
      content: `
        Возведение рациональной дроби в степень выполняется по правилу:
        степень дроби равна дроби, числитель и знаменатель которой возведены в эту степень.

        Правило возведения в степень:
        (P(x)/Q(x))ⁿ = (P(x))ⁿ/(Q(x))ⁿ, где n — натуральное число

        Примеры:

        Пример 1:
        ((x + 1)/(x - 2))² = (x + 1)²/(x - 2)² = (x² + 2x + 1)/(x² - 4x + 4)
        При x ≠ 2

        Пример 2:
        ((2x)/(x + 1))³ = (2x)³/(x + 1)³ = 8x³/(x + 1)³
        При x ≠ -1

        Пример 3:
        ((x² - 4)/(x + 3))² = (x² - 4)²/(x + 3)² = (x⁴ - 8x² + 16)/(x + 3)²
        При x ≠ -3

        Отрицательные степени:
        (P(x)/Q(x))⁻ⁿ = (Q(x)/P(x))ⁿ = (Q(x))ⁿ/(P(x))ⁿ

        Пример:
        ((x + 1)/(x - 2))⁻² = ((x - 2)/(x + 1))² = (x - 2)²/(x + 1)²
        При x ≠ 2, x ≠ -1

        Нулевая степень:
        (P(x)/Q(x))⁰ = 1, при условии P(x) ≠ 0 и Q(x) ≠ 0

        Дробные степени:
        (P(x)/Q(x))^(m/n) = ⁿ√((P(x))ᵐ)/ⁿ√((Q(x))ᵐ)

        Свойства степеней:
        • (a/b)ᵐ · (a/b)ⁿ = (a/b)^(m+n)
        • (a/b)ᵐ : (a/b)ⁿ = (a/b)^(m-n)
        • ((a/b)ᵐ)ⁿ = (a/b)^(mn)

        Практические советы:
        • При возведении в четную степень знак результата всегда положительный
        • При работе с отрицательными степенями добавляются ограничения от числителя
        • Используйте формулы сокращенного умножения для упрощения
      `,
      keyPoints: [
        'Возводим числитель и знаменатель в степень',
        'Отрицательная степень = обращение дроби',
        'Нулевая степень равна 1 (при ограничениях)',
        'Используем свойства степеней для упрощения'
      ]
    },
    {
      id: 8,
      title: 'Преобразование сложных рациональных выражений',
      icon: Lightbulb,
      content: `
        Сложные рациональные выражения содержат дроби в числителе и/или знаменателе. 
        Их преобразование требует систематического подхода.

        Типы сложных выражений:

        1. Дроби в числителе или знаменателе:
        (1/x + 1/y)/(1/x - 1/y)

        2. Многоэтажные дроби:
        (a/b)/(c/d)

        3. Смешанные выражения:
        1 + 1/(1 + 1/x)

        Алгоритм упрощения:

        Шаг 1: Упростить числитель и знаменатель отдельно
        Шаг 2: Применить основное свойство дроби
        Шаг 3: Выполнить деление (умножение на обратную дробь)
        Шаг 4: Упростить результат

        Примеры:

        Пример 1:
        (1/x + 1/y)/(1/x - 1/y)

        Числитель: 1/x + 1/y = (y + x)/(xy)
        Знаменатель: 1/x - 1/y = (y - x)/(xy)

        Результат: ((y + x)/(xy)) : ((y - x)/(xy)) = (y + x)/(y - x)
        При x ≠ 0, y ≠ 0, y ≠ x

        Пример 2:
        (a/b)/(c/d) = (a/b) · (d/c) = ad/(bc)
        При b ≠ 0, c ≠ 0, d ≠ 0

        Пример 3:
        1 + 1/(1 + 1/x)

        Сначала упрощаем 1 + 1/x = (x + 1)/x
        Затем 1/(1 + 1/x) = 1/((x + 1)/x) = x/(x + 1)
        Наконец: 1 + x/(x + 1) = (x + 1 + x)/(x + 1) = (2x + 1)/(x + 1)
        При x ≠ 0, x ≠ -1

        Пример 4:
        (x - 1/(x + 1))/(x + 1/(x - 1))

        Числитель: x - 1/(x + 1) = (x(x + 1) - 1)/(x + 1) = (x² + x - 1)/(x + 1)
        Знаменатель: x + 1/(x - 1) = (x(x - 1) + 1)/(x - 1) = (x² - x + 1)/(x - 1)

        Результат: ((x² + x - 1)/(x + 1)) : ((x² - x + 1)/(x - 1))
        = ((x² + x - 1)(x - 1))/((x + 1)(x² - x + 1))

        Стратегии решения:
        • Работайте "изнутри наружу"
        • Приводите к общему знаменателю на каждом уровне
        • Следите за областью определения на каждом шаге
        • Проверяйте результат подстановкой
      `,
      keyPoints: [
        'Упрощаем числитель и знаменатель отдельно',
        'Работаем от внутренних дробей к внешним',
        'Применяем деление дробей',
        'Тщательно отслеживаем ограничения'
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Преобразование рациональных выражений
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
              Вы успешно изучили все разделы курса "Преобразование рациональных выражений"
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

export default RationalExpressionsCourse;