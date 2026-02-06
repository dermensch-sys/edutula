import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Upload, FileText, CheckCircle, AlertCircle, Clock, Camera, Mic } from 'lucide-react';

const HomeworkCheck: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'upload' | 'photo' | 'text' | 'voice'>('upload');
  const [isChecking, setIsChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  const recentChecks = [
    {
      id: 1,
      title: 'Задачи по мат. анализу',
      subject: 'Математика',
      score: 92,
      timestamp: '2 часа назад',
      status: 'completed',
      feedback: 'Отличная работа по производным, незначительная ошибка в 4 задании.'
    },
    {
      id: 2,
      title: 'Отчет по лабораторной работе по информатике',
      subject: 'Информатика',
      score: 88,
      timestamp: '1 день назад',
      status: 'completed',
      feedback: 'Хороший анализ. Необходимо более подробно обсудить ошибки.'
    },
    {
      id: 3,
      title: 'Алгебраические уравнения',
      subject: 'Математика',
      score: 95,
      timestamp: '2 дня назад',
      status: 'completed',
      feedback: 'Идеальное решение. Все тождества верны.'
    },
    {
      id: 4,
      title: 'Эссе по ИИ',
      subject: 'ИИ',
      score: null,
      timestamp: '10 минут назад',
      status: 'checking',
      feedback: null
    },
  ];

  const handleCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setCheckComplete(true);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const methods = [
    {
      id: 'upload' as const,
      icon: Upload,
      title: 'Отправить файл',
      description: 'Upload PDF, DOC, or image files'
    },
    {
      id: 'photo' as const,
      icon: Camera,
      title: 'Сделать фото',
      description: 'Capture homework with your camera'
    },
    {
      id: 'text' as const,
      icon: FileText,
      title: 'Ввести текст',
      description: 'Enter your homework directly'
    },
    {
      id: 'voice' as const,
      icon: Mic,
      title: 'Голосовой ввод',
      description: 'Speak your answers aloud'
    },
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Проверка домашних заданий</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
           Получите мгновенную обратную связь по выполненному домашнему заданию с помощью нашей системы проверки на основе искусственного интеллекта. Загрузите, напечатайте или сфотографируйте свою работу, чтобы получить подробный анализ и рекомендации.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submission Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Method Selection */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите cпособ отправки</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {methods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${
                          selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                        <div className="text-sm font-medium text-gray-900">{method.title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submission Area */}
              <div className="p-6">
                {!checkComplete ? (
                  <>
                    {selectedMethod === 'upload' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Загрузите домашнее задание</h4>
                        <p className="text-gray-600 mb-4">Перетащите файлы сюда или нажмите, чтобы выбрать</p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                          Выберите файлы
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Поддерживаются форматы: PDF, DOC, DOCX, JPG, PNG (максимум 10 МБ)
                        </p>
                      </div>
                    )}

                    {selectedMethod === 'photo' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Сделайте фото</h4>
                        <p className="text-gray-600 mb-4">Четко сфотографируйте свое домашнее задание</p>
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Camera className="h-4 w-4 mr-2" />
                          Запустите камеру
                        </button>
                      </div>
                    )}

                    {selectedMethod === 'text' && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Проверка домашнего задания</h4>
                        <textarea
                          placeholder="Введите или вставьте сюда текст Вашего домашнего задания."
                          rows={12}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {selectedMethod === 'voice' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Голосовой ввод</h4>
                        <p className="text-gray-600 mb-4">Четко произносите ответы</p>
                        <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          <Mic className="h-4 w-4 mr-2" />
                         Начать запись
                        </button>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleCheck}
                        disabled={isChecking}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50"
                      >
                        {isChecking ? (
                          <>
                            <Clock className="animate-spin h-4 w-4 mr-2" />
                            Идет проверка...
                          </>
                        ) : (
                          'Проверить'
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Домашняя работа проверена!</h3>
                    <p className="text-gray-600 mb-4">Ваша домашняя работа проанализирована и оценена.</p>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6">
                      <div className="text-3xl font-bold mb-2">94/100</div>
                      <div className="text-green-100">Отличная работа!</div>
                    </div>

                    <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">Сводка отзывов:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          Задачи 1-3: Идеальные решения с четкой методологией.
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          Задача 4: Правильный подход, отличная работа.
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                          Задача 5: Незначительная арифметическая ошибка на заключительном этапе.
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setCheckComplete(false)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Проверить другое задание
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Checks Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Последние проверки</h3>
              <div className="space-y-4">
                {recentChecks.map((check) => (
                  <div key={check.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{check.title}</h4>
                      {check.status === 'checking' ? (
                        <Clock className="h-4 w-4 text-yellow-600 animate-spin flex-shrink-0" />
                      ) : (
                        <span className={`px-2 py-1 text-xs rounded-lg font-medium ${getScoreColor(check.score!)}`}>
                          {check.score}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{check.subject} • {check.timestamp}</p>
                    {check.feedback && (
                      <p className="text-xs text-gray-600 line-clamp-2">{check.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeworkCheck;