import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Bot, 
  User,
  MessageSquare,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import aiService from '../../../services/firebase/aiService';
import { useAuth } from '../../../hooks/useAuth';
import { ENDPOINTS } from '../../../routes/endPoints';
import MarkdownMessage from '../../../components/MarkdownMessage';

const ChatInterface = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const messagesContainerRef = useRef(null);

  // Load chat sessions khi component mount (chỉ load existing chats)
  useEffect(() => {
    if (userData?.uid) {
      loadChatSessions();
    }
  }, [userData?.uid]);

  // Load messages khi chuyển chat
  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId);
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const resetScrollPosition = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
      console.log('🔄 Scroll reset to top');
    }
  };

  // Load danh sách chat sessions
  const loadChatSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const result = await aiService.getUserChatSessions(userData.uid);
      
      if (result.success) {
        console.log('📋 Loaded chat sessions:', result.sessions?.map(s => ({
          id: s.id,
          title: s.title?.slice(0, 20),
          updatedAt: s.updatedAt,
          createdAt: s.createdAt
        })));
        
        setChatSessions(result.sessions || []);
        
        // Nếu có chat, chọn chat đầu tiên (chỉ khi chưa có chat nào được chọn)
        if (result.sessions && result.sessions.length > 0 && !currentChatId) {
          setCurrentChatId(result.sessions[0].id);
        } else if (!result.sessions || result.sessions.length === 0) {
          // Không có chat nào, để trống như ChatGPT
          setCurrentChatId(null);
          setMessages([]);
        }
      } else {
        console.error('Failed to load chat sessions:', result.error);
        setChatSessions([]);
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setChatSessions([]);
      setCurrentChatId(null);
      setMessages([]);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Load tin nhắn của một chat
  const loadMessages = async (chatId) => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    
    try {
      const result = await aiService.getChatMessages(chatId);
      
      if (result.success) {
        setMessages(result.messages || []);
        // Không tự động scroll, để useEffect xử lý
      } else {
        console.error('Failed to load messages:', result.error);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  // Tạo chat mới
  const createNewChat = async () => {
    try {
      const result = await aiService.createChatSession(userData.uid);
      
      if (result.success) {
        const newChat = {
          id: result.id,
          title: 'Cuộc trò chuyện mới',
          createdAt: new Date(),
          updatedAt: new Date(),
          messageCount: 0
        };
        
        setChatSessions(prev => [newChat, ...prev]);
        setCurrentChatId(result.id);
        setMessages([]);
        
        toast.success('Đã tạo chat mới');
      } else {
        toast.error('Không thể tạo chat mới');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Có lỗi xảy ra khi tạo chat');
    }
  };


  // Xóa chat session
  const deleteChat = async (chatId) => {
    if (!confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) return;

    try {
      const result = await aiService.deleteChatSession(chatId);
      
      if (result.success) {
        setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
        
        if (currentChatId === chatId) {
          // Nếu đang xóa chat hiện tại, chuyển sang chat khác hoặc tạo mới
          const remainingChats = chatSessions.filter(chat => chat.id !== chatId);
          if (remainingChats.length > 0) {
            setCurrentChatId(remainingChats[0].id);
          } else {
            await createNewChat();
          }
        }
        
        toast.success('Đã xóa cuộc trò chuyện');
      } else {
        toast.error('Không thể xóa cuộc trò chuyện');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Có lỗi xảy ra khi xóa chat');
    }
  };

  // Bắt đầu chỉnh sửa title
  const startEditingTitle = (chatId, currentTitle) => {
    setEditingTitle(chatId);
    setNewTitle(currentTitle);
  };

  // Lưu title mới
  const saveTitle = async (chatId) => {
    if (!newTitle.trim()) return;

    try {
      const result = await aiService.updateChatTitle(chatId, newTitle.trim());
      
      if (result.success) {
        setChatSessions(prev => 
          prev.map(chat => 
            chat.id === chatId 
              ? { ...chat, title: newTitle.trim() }
              : chat
          )
        );
        setEditingTitle(null);
        toast.success('Đã cập nhật tiêu đề');
      } else {
        toast.error('Không thể cập nhật tiêu đề');
      }
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Có lỗi xảy ra khi cập nhật tiêu đề');
    }
  };

  // Hủy chỉnh sửa title
  const cancelEditingTitle = () => {
    setEditingTitle(null);
    setNewTitle('');
  };

  // Handle Enter key - Tạo chat mới khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Gửi tin nhắn (tạo chat mới nếu chưa có)
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      let chatId = currentChatId;
      
      // Nếu chưa có chat, tạo chat mới
      if (!chatId) {
        console.log('Creating new chat with message:', userMessage);
        const chatResult = await aiService.createChatSession(userData.uid, userMessage.substring(0, 50) + '...');
        
        if (chatResult.success) {
          chatId = chatResult.id;
          const newChat = {
            id: chatId,
            title: userMessage.substring(0, 50) + '...',
            createdAt: new Date(),
            updatedAt: new Date(),
            messageCount: 0
          };
          
          // Thêm chat mới vào danh sách và chọn nó
          setChatSessions(prev => [newChat, ...prev]);
          setCurrentChatId(chatId);
        } else {
          toast.error('Không thể tạo chat mới: ' + (chatResult.error || 'Unknown error'));
          return;
        }
      }

      // Thêm tin nhắn user vào UI
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, tempUserMessage]);

      console.log('Sending message to AI...');
      // Gọi AI service để gửi tin nhắn
      const result = await aiService.sendMessage(chatId, userMessage, messages);
      
      console.log('AI response result:', result);
      
      if (result.success) {
        // Thêm tin nhắn AI vào UI
        const aiMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: result.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

        // Cập nhật chat session và di chuyển lên đầu danh sách
        setChatSessions(prev => {
          const updatedChat = prev.find(chat => chat.id === chatId);
          if (updatedChat) {
            const otherChats = prev.filter(chat => chat.id !== chatId);
            const updatedChatWithNewData = {
              ...updatedChat,
              title: userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : ''),
              messageCount: (updatedChat.messageCount || 0) + 2,
              updatedAt: new Date()
            };
            
            console.log('🔄 Moving chat to top:', {
              chatId,
              oldTitle: updatedChat.title,
              newTitle: updatedChatWithNewData.title,
              newUpdatedAt: updatedChatWithNewData.updatedAt.toISOString()
            });
            
            return [updatedChatWithNewData, ...otherChats];
          }
          return prev;
        });
      } else {
        // Xóa tin nhắn user nếu gửi thất bại
        setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
        toast.error('Không thể gửi tin nhắn: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Có lỗi xảy ra khi gửi tin nhắn: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSessions) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold text-lg">Đang tải chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 flex overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Sidebar - Chat Sessions */}
      <div className="w-80 max-w-sm bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col flex-shrink-0 shadow-xl relative z-10">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/30">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Cuộc trò chuyện mới
          </button>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {chatSessions.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 mb-2 rounded-xl cursor-pointer transition-all duration-300 ${
                currentChatId === chat.id 
                  ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-2 border-blue-500/50 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/80 border-2 border-transparent hover:border-gray-200/50'
              }`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {editingTitle === chat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm font-medium"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveTitle(chat.id);
                          if (e.key === 'Escape') cancelEditingTitle();
                        }}
                      />
                      <button
                        onClick={() => saveTitle(chat.id)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditingTitle}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        currentChatId === chat.id 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <h3 className={`text-sm font-bold truncate ${
                        currentChatId === chat.id ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {chat.title}
                      </h3>
                    </div>
                  )}
                  <p className={`text-xs mt-1 font-medium ${
                    currentChatId === chat.id ? 'text-gray-600' : 'text-gray-500'
                  }`}>
                    {chat.messageCount} tin nhắn
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingTitle(chat.id, chat.title);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative">
        {/* Chat Header */}
        <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-white/20 p-4 z-10 shadow-lg shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 font-semibold shadow-md hover:shadow-lg"
                title="Quay về Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentChatId 
                    ? chatSessions.find(chat => chat.id === currentChatId)?.title || 'Chat'
                    : 'Novastep AI'
                  }
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          key={`messages-${currentChatId || 'empty'}`}
          ref={messagesContainerRef} 
          className="absolute overflow-y-auto overflow-x-hidden"
          style={{ 
            top: '73px', // Header height
            bottom: '81px', // Input area height  
            left: '0',
            right: '0'
          }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-12 px-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Chào mừng đến với Novastep!
                </h3>
                <p className="text-gray-600 mb-4 font-medium text-lg">
                  Tôi sẽ giúp bạn học tập bằng phương pháp Socrates. 
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  Nhập câu hỏi và nhấn <kbd className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg text-xs font-bold shadow-md border border-blue-200">Enter</kbd> để bắt đầu trò chuyện!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-3xl px-5 py-4 rounded-2xl shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200/50'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <MarkdownMessage content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap font-medium">{message.content}</div>
                  )}
                  <div className={`text-xs mt-3 font-semibold ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
          
          {isLoading && (
            <div className="p-4">
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 px-5 py-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-gray-700 font-semibold">Novastep đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 p-4 shadow-lg shadow-blue-500/10">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi và nhấn Enter để gửi..."
              className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
              title="Gửi tin nhắn"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
