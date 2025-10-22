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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Chat Sessions */}
      <div className="w-80 max-w-sm bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Cuộc trò chuyện mới
          </button>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {chatSessions.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                currentChatId === chat.id ? 'bg-blue-50 border-blue-200' : ''
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
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveTitle(chat.id);
                          if (e.key === 'Escape') cancelEditingTitle();
                        }}
                      />
                      <button
                        onClick={() => saveTitle(chat.id)}
                        className="p-1 text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditingTitle}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {chat.title}
                      </h3>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {chat.messageCount} tin nhắn
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingTitle(chat.id, chat.title);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
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
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Quay về Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentChatId 
                  ? chatSessions.find(chat => chat.id === currentChatId)?.title || 'Chat'
                  : 'Novastep AI'
                }
              </h2>
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
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chào mừng đến với Novastep!
                </h3>
                <p className="text-gray-600 mb-4">
                  Tôi sẽ giúp bạn học tập bằng phương pháp Socrates. 
                </p>
                <p className="text-sm text-gray-500">
                  Nhập câu hỏi và nhấn <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> để bắt đầu trò chuyện!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-3xl px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <MarkdownMessage content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
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
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Novastep đang suy nghĩ...</span>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi và nhấn Enter để gửi..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
