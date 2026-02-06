import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Phone, Video, Calendar, Star, Clock, User, CheckCircle, Bot } from 'lucide-react';

const Consultant: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: 1,
      sender: 'consultant',
      text: 'Здравствуйте! Я ИИ-нейроконсультант. Я могу ответить на ваши вопросы по искусственному интеллекту, машинному обучению, нейронным сетям и другим темам ИИ. Чем могу помочь?',
      timestamp: '10:30 AM',
      isRead: true
    }
  ]);

  const consultants = [
    {
      id: 1,
      name: 'Нейроконсультант',
      speciality: 'Искусственный интеллект',
      rating: 4.9,
      reviews: 156,
      status: 'online',
      avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$50/час',
      experience: '8 лет',
      languages: ['Русский', 'Английский']
    },
    {
      id: 2,
      name: 'Нейроконсультант',
      speciality: 'Информатика',
      rating: 4.8,
      reviews: 203,
      status: 'busy',
      avatar: 'https://images.pexels.com/photos/6325959/pexels-photo-6325959.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$45/час',
      experience: '12 лет',
      languages: ['Русский', 'Английский']
    },
    {
      id: 3,
      name: 'Нейроконсультант',
      speciality: 'Математика',
      rating: 4.9,
      reviews: 89,
      status: 'online',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$40/час',
      experience: '6 лет',
      languages: ['Русский', 'Английский']
    },
  ];

  // AI Knowledge Base from the document
  const aiKnowledgeBase = {
    "искусственный интеллект": "Искусственный интеллект (ИИ) — это область компьютерных наук, которая занимается созданием интеллектуальных машин, способных работать и реагировать как люди. ИИ включает в себя такие задачи, как обучение, рассуждение и самокоррекция.",
    "машинное обучение": "Машинное обучение — это подраздел ИИ, который дает компьютерам способность учиться без явного программирования. Существует три основных типа: обучение с учителем, без учителя и с подкреплением.",
    "нейронные сети": "Нейронные сети — это вычислительные модели, вдохновленные структурой и функционированием биологических нейронных сетей в мозге. Они состоят из взаимосвязанных узлов (нейронов), которые обрабатывают информацию.",
    "глубокое обучение": "Глубокое обучение — это подраздел машинного обучения, использующий нейронные сети с множественными слоями для моделирования и понимания сложных паттернов в данных.",
    "обработка естественного языка": "Обработка естественного языка (NLP) — это область ИИ, которая занимается взаимодействием между компьютерами и человеческим языком, включая понимание, интерпретацию и генерацию человеческого языка.",
    "компьютерное зрение": "Компьютерное зрение — это область ИИ, которая обучает компьютеры интерпретировать и понимать визуальный мир, включая распознавание объектов, классификацию изображений и анализ сцен.",
    "алгоритм": "Алгоритм — это четкая пошаговая процедура или набор правил для решения конкретной задачи или проблемы. В контексте ИИ, алгоритмы используются для обучения моделей и принятия решений.",
    "тест тьюринга": "Тест Тьюринга, предложенный Аланом Тьюрингом в 1950 году, используется для оценки способности машины демонстрировать интеллектуальное поведение, эквивалентное человеческому или неотличимое от него.",
    "обучение с учителем": "Обучение с учителем — это тип машинного обучения, где алгоритм обучается на размеченных данных, то есть входные данные сопровождаются правильными ответами.",
    "обучение без учителя": "Обучение без учителя — это тип машинного обучения, который не требует размеченных данных и находит скрытые закономерности в данных без предварительного знания правильных ответов.",
    "обучение с подкреплением": "Обучение с подкреплением — это тип машинного обучения, где агент учится принимать решения через взаимодействие со средой, получая награды или наказания за свои действия.",
    "переобучение": "Переобучение (overfitting) происходит, когда модель машинного обучения слишком точно подстраивается под тренировочные данные, теряя способность к обобщению на новых данных.",
    "узкий ии": "Узкий ИИ (Narrow AI) — это тип ИИ, который специализируется на конкретных задачах, таких как распознавание изображений или игра в шахматы. Весь современный ИИ относится к этой категории.",
    "общий ии": "Общий ИИ (AGI) — это гипотетический тип ИИ, который способен выполнять любые интеллектуальные задачи человека. Это долгосрочная цель исследований в области ИИ.",
    "этика ии": "Этика ИИ включает вопросы справедливости, прозрачности, ответственности и безопасности при разработке и использовании систем ИИ. Важно учитывать социальные последствия и предотвращать предвзятость.",
    "применения ии": "ИИ применяется в здравоохранении (диагностика), транспорте (автономные автомобили), финансах (обнаружение мошенничества), образовании (персонализированное обучение), развлечениях (рекомендательные системы) и многих других областях."
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific keywords and provide relevant responses
    for (const [keyword, response] of Object.entries(aiKnowledgeBase)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Check for common question patterns
    if (lowerMessage.includes('что такое') || lowerMessage.includes('что это')) {
      return "Пожалуйста, уточните, о какой концепции ИИ вы хотели бы узнать. Я могу рассказать об искусственном интеллекте, машинном обучении, нейронных сетях, глубоком обучении и многих других темах.";
    }
    
    if (lowerMessage.includes('как работает') || lowerMessage.includes('принцип работы')) {
      return "Я могу объяснить принципы работы различных технологий ИИ. Уточните, пожалуйста, о какой технологии вы хотели бы узнать: нейронные сети, машинное обучение, алгоритмы или что-то другое?";
    }
    
    if (lowerMessage.includes('применение') || lowerMessage.includes('где используется')) {
      return aiKnowledgeBase["применения ии"];
    }
    
    if (lowerMessage.includes('этика') || lowerMessage.includes('проблемы') || lowerMessage.includes('риски')) {
      return aiKnowledgeBase["этика ии"];
    }
    
    if (lowerMessage.includes('будущее') || lowerMessage.includes('развитие')) {
      return "Будущее ИИ включает развитие общего искусственного интеллекта, улучшение существующих технологий, интеграцию ИИ в повседневную жизнь, а также решение этических вопросов и обеспечение безопасности ИИ-систем.";
    }
    
    if (lowerMessage.includes('история') || lowerMessage.includes('когда появился')) {
      return "История ИИ началась в 1950-х годах с работ Алана Тьюринга. Термин 'искусственный интеллект' был введен Джоном Маккарти в 1956 году на Дартмутской конференции. С тех пор ИИ прошел через несколько периодов подъема и спада, а современный бум начался в 2000-х годах благодаря большим данным и мощным вычислениям.";
    }
    
    // Default response
    return "Интересный вопрос! Я специализируюсь на темах искусственного интеллекта. Могу рассказать о машинном обучении, нейронных сетях, глубоком обучении, обработке естественного языка, компьютерном зрении, этике ИИ и применениях ИИ. О чем именно вы хотели бы узнать?";
  };
  const recentSessions = [
    {
      id: 1,
      consultant: 'Нейроконсультант',
      subject: 'Помощь по математическому анализу',
      date: '2024-01-15',
      duration: '45 min',
      rating: 5,
      status: 'completed'
    },
    {
      id: 2,
      consultant: 'Нейроконсультант',
      subject: 'Комплексные числа',
      date: '2024-01-12',
      duration: '30 min',
      rating: 5,
      status: 'completed'
    },
    {
      id: 3,
      consultant: 'Нейроконсультант',
      subject: 'Написание эссе',
      date: '2024-01-10',
      duration: '60 min',
      rating: 4,
      status: 'completed'
    },
  ];

  const selectedConsultant = consultants.find(c => c.id === selectedChat);

  const sendMessage = () => {
    if (message.trim()) {
      const userMessage = {
        id: chatMessages.length + 1,
        sender: 'user',
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      // Generate AI response after a short delay
      setTimeout(() => {
        const aiResponse = {
          id: chatMessages.length + 2,
          sender: 'consultant',
          text: generateAIResponse(message.trim()),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
      setMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Задайте вопрос консультанту</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Получите персонализированную помощь от опытных преподавателей и консультантов, а также нейроконсультантов. Общайтесь через чат, голосовую связь или видеосвязь для индивидуальных занятий.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Consultants List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Доступные консультанты</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {consultants.map((consultant) => (
                  <button
                    key={consultant.id}
                    onClick={() => setSelectedChat(consultant.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedChat === consultant.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={consultant.avatar}
                          alt={consultant.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(consultant.status)}`}></div>
                        {consultant.id === 1 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{consultant.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{consultant.speciality}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{consultant.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{consultant.price}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-6 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Последние сессии</h3>
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="border-l-4 border-blue-200 pl-3 py-2">
                    <h4 className="font-medium text-gray-900 text-sm">{session.subject}</h4>
                    <p className="text-xs text-gray-600">{session.consultant}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{session.date}</span>
                      <div className="flex items-center">
                        {[...Array(session.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[600px] flex flex-col">
              {/* Chat Header */}
              {selectedConsultant && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedConsultant.avatar}
                          alt={selectedConsultant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedConsultant.status)}`}></div>
                        {selectedConsultant.id === 1 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="h-1.5 w-1.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConsultant.name}</h3>
                        <p className="text-sm text-gray-600">{selectedConsultant.speciality}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                        <Video className="h-5 w-5" />
                      </button>
                      {selectedConsultant.id !== 1 && (
                        <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                        <Calendar className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={selectedConsultant?.id === 1 ? "Задайте вопрос об ИИ..." : "Type your message..."}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Consultant Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            {selectedConsultant && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <img
                    src={selectedConsultant.avatar}
                    alt={selectedConsultant.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  {selectedConsultant.id === 1 && (
                    <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-2">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900">{selectedConsultant.name}</h3>
                  <p className="text-gray-600">{selectedConsultant.speciality}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Рейтинг</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{selectedConsultant.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({selectedConsultant.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Цена</span>
                    <span className="font-medium">{selectedConsultant.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Опыт</span>
                    <span className="font-medium">{selectedConsultant.experience}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Языки</span>
                    <span className="font-medium">{selectedConsultant.languages.join(', ')}</span>
                  </div>
                </div>

                {selectedConsultant.id === 1 ? (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Bot className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">ИИ-Консультант</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Доступен 24/7 для ответов на вопросы об искусственном интеллекте, машинном обучении и нейронных сетях.
                    </p>
                  </div>
                ) : (
                  <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                    Запланировать сессию
                  </button>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
                  <MessageCircle className="h-4 w-4 mr-3 text-purple-600" />
                  Начать чат
                </button>
                {selectedConsultant?.id !== 1 && (
                  <button className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
                  <Calendar className="h-4 w-4 mr-3 text-blue-600" />
                  Запланировать сессию
                  </button>
                )}
                <button className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
                  <User className="h-4 w-4 mr-3 text-green-600" />
                  Посмотреть всех консультантов
                </button>
                {selectedConsultant?.id === 1 && (
                  <button className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
                    <Bot className="h-4 w-4 mr-3 text-blue-600" />
                    Темы ИИ для изучения
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Consultant;