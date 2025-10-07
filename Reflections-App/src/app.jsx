import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertTriangle } from 'lucide-react';

// --- Configuration and Utilities ---

// FastAPI endpoint hosted on Render
const FASTAPI_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const FASTAPI_ENDPOINT = `${FASTAPI_BASE_URL}/chat`;

// Define companions with roles and styling
const companions = [
  { id: 'JADE', name: 'Jade', role: 'Strategic Advisor', color: 'bg-indigo-600', iconColor: 'text-indigo-600', persona: 'You are Jade, a wise and strategic advisor.' },
  { id: 'HERMES', name: 'Hermes', role: 'Quick Insights Guide', color: 'bg-green-600', iconColor: 'text-green-600', persona: 'You are Hermes, the swift messenger of quick insights.' },
  { id: 'EVE', name: 'Eve', role: 'Wellness Guide', color: 'bg-pink-600', iconColor: 'text-pink-600', persona: 'You are Eve, the nurturing wellness guide.' },
  { id: 'ZEUS', name: 'Zeus', role: 'Action Coach', color: 'bg-red-600', iconColor: 'text-red-600', persona: 'You are Zeus, the action and motivation coach.' }
];

// Map companion ID to Tailwind classes for message styling
const companionMessageStyleMap = {
  'JADE': 'border-indigo-400 bg-indigo-50 text-indigo-900',
  'HERMES': 'border-green-400 bg-green-50 text-green-900',
  'EVE': 'border-pink-400 bg-pink-50 text-pink-900',
  'ZEUS': 'border-red-400 bg-red-50 text-red-900',
  'ERROR': 'border-yellow-400 bg-yellow-50 text-yellow-900'
};

/**
 * Custom hook to manage textarea height automatically.
 */
const useAutoResizeTextarea = (value, minRows = 1, maxRows = 10) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to recalculate the scrollHeight
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight;

      // Calculate height constraints
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = lineHeight * minRows + parseInt(getComputedStyle(textarea).paddingTop) + parseInt(getComputedStyle(textarea).paddingBottom);
      const maxHeight = lineHeight * maxRows + parseInt(getComputedStyle(textarea).paddingTop) + parseInt(getComputedStyle(textarea).paddingBottom);

      if (newHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'scroll';
      } else if (newHeight > minHeight) {
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.height = `${minHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [value, minRows, maxRows]);

  return textareaRef;
};

/**
 * Main application component.
 */
const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your Reflections companion. Select a persona on the left to start a focused discussion.',
      timestamp: new Date(),
      companion: 'JADE'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanionId, setSelectedCompanionId] = useState('JADE');
  const messagesEndRef = useRef(null);

  // Auto-resize textarea logic
  const textareaRef = useAutoResizeTextarea(input, 1, 8);

  const selectedCompanion = companions.find(c => c.id === selectedCompanionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !selectedCompanion) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      companion: selectedCompanionId
    };

    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Prepare chat history for API payload (assuming FastAPI needs it)
      // We strip down the history for the API to simple role/content pairs
      const historyForApi = messages
        .filter(m => m.content && m.role !== 'system_notification')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      // 2. Add the current user prompt
      historyForApi.push({ role: 'user', content: currentInput });

      // 3. Construct the API payload for your FastAPI
      const payload = {
        message: currentInput,
        companion: selectedCompanionId,
        history: historyForApi
      };

      // 4. Call your custom FastAPI endpoint
      const response = await fetch(FASTAPI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Throw an error if the HTTP status code is not 2xx
        const errorBody = await response.json().catch(() => ({ detail: 'Unknown error occurred on the server.' }));
        throw new Error(errorBody.detail || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      // Assume your FastAPI returns an object with a 'response_text' key
      const responseText = data.response_text || data.content || "The server returned an empty response.";

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        companion: selectedCompanionId,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error fetching from custom API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, there was an issue connecting to or getting a response from your backend server. Error: ${error.message}`,
        companion: 'ERROR',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    // Check for Enter key without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompanionSelect = (id) => {
    setSelectedCompanionId(id);
    // Add a message indicating the companion change
    const companionName = companions.find(c => c.id === id)?.name;
    const changeMessage = {
      id: Date.now(),
      role: 'system_notification',
      content: `Companion changed to ${companionName}. The conversation context has been reset.`,
      timestamp: new Date()
    };
    // Reset the message history when switching companions for fresh context
    setMessages([changeMessage]);
  };

  // --- Message Component (Inline for Single File Mandate) ---
  const Message = ({ message }) => {
    if (message.role === 'system_notification') {
      return (
        <div className="flex justify-center my-4">
          <div className="text-sm px-4 py-2 rounded-full bg-gray-100 text-gray-500 italic">
            {message.content}
          </div>
        </div>
      );
    }

    const isUser = message.role === 'user';
    const companionName = companions.find(c => c.id === message.companion)?.name || 'Bot';
    const messageStyle = companionMessageStyleMap[message.companion] || companionMessageStyleMap['ERROR'];
    const iconColor = companions.find(c => c.id === message.companion)?.iconColor || 'text-gray-900';

    return (
      <div
        key={message.id}
        className={`flex gap-3 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}
      >
        {!isUser && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${message.companion === 'ERROR' ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-gray-200'}`}>
            {message.companion === 'ERROR' ? (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            ) : (
              <Bot className={`w-5 h-5 ${iconColor}`} />
            )}
          </div>
        )}

        <div
          className={`max-w-2xl p-4 rounded-2xl transition-all duration-300 shadow-md ${
            isUser
              ? 'bg-gray-900 text-white'
              : `border ${messageStyle}`
          }`}
        >
          {!isUser && (
            <div className="font-bold mb-1 text-sm">
              {companionName}
            </div>
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
          <p className={`text-xs mt-2 ${isUser ? 'opacity-70' : 'opacity-80'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    );
  };
  // --- End Message Component ---

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-1">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Reflections
          </h1>
          <p className="text-sm text-gray-500">Choose your AI companion</p>
        </div>

        <div className="space-y-3 flex-1">
          {companions.map(companion => (
            <button
              key={companion.id}
              onClick={() => handleCompanionSelect(companion.id)}
              className={`w-full p-3 rounded-xl transition-all duration-200 text-left ${
                selectedCompanionId === companion.id
                  ? `bg-gray-900 text-white shadow-lg ring-4 ${companion.color.replace('bg-', 'ring-')} ring-opacity-20`
                  : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${companion.color}`}></div>
                <div className="text-left">
                  <div className="font-semibold">{companion.name}</div>
                  <div className={`text-xs ${selectedCompanionId === companion.id ? 'text-gray-300' : 'text-gray-500'}`}>{companion.role}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-semibold text-gray-900">Companion Active</span>
          </div>
          <p className="text-xs text-gray-600">
            You are currently reflecting with <span className={`font-medium ${selectedCompanion?.iconColor}`}>{selectedCompanion?.name}</span>.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
              <Bot className={`w-5 h-5 ${selectedCompanion?.iconColor}`} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">
                {selectedCompanion?.name}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedCompanion?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                <Bot className={`w-5 h-5 ${selectedCompanion?.iconColor}`} />
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-white rounded-2xl border border-gray-300 focus-within:border-gray-500 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Chat with ${selectedCompanion?.name}...`}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-400 p-4 resize-none outline-none overflow-hidden"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gray-900 hover:bg-indigo-600 disabled:bg-gray-300 text-white rounded-2xl p-4 transition-all duration-200 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
