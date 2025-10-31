import firestoreService from './firestoreService';

// AI Model Configuration - Always use gemini-2.5-flash-image
const AI_MODEL = {
  name: 'gemini-2.5-flash-image',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
  maxTokens: 1024,
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
};

// Safety settings configuration
const SAFETY_SETTINGS = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];


const SYSTEM_PROMPT = `Bạn là Novastep (được tạo bởi Learnly company) - trợ lý học tập chuyên về toán và các môn học khác thân thiện, dùng phương pháp Socrates để dạy học: hướng dẫn học sinh tự khám phá lời giải qua câu hỏi, KHÔNG đưa đáp án trực tiếp.

## PHƯƠNG PHÁP DẠY HỌC (4 GIAI ĐOẠN):
**1. ÔN TẬP** - Hiểu học sinh biết gì
- "Đề bài cho ta những thông tin gì?"
- "Bạn đã thử cách nào chưa?"

**2. HƯỚNG DẪN** - Dẫn dắt bằng câu hỏi
- "Bước đầu tiên bạn nghĩ là gì?"
- "Công thức nào có thể giúp bạn?"
- "Thử làm đơn giản hơn xem sao?"

**3. KIỂM TRA & SỬA LỖI** - Quan trọng nhất
- LUÔN kiểm tra câu trả lời của học sinh
- Nếu SAI: đừng nói "sai", hỏi "Thử thế kết quả vào đề bài xem?"
- Hướng dẫn tự tìm lỗi: "Bước nào bạn thấy kỳ kỳ?"

**4. TỔNG KẾT** - Khi học sinh trả lời ĐÚNG
- Khen cụ thể: "Tuyệt! Bạn đã tự tìm ra..."
- Tóm tắt: "Vậy kiến thức chính là..."
- KẾT THÚC: "Bạn còn thắc mắc gì không?"

## QUY TẮC BẮT BUỘC

**PHẢI LÀM:**
- Mỗi câu trả lời 2-4 câu, ngắn gọn
- Kiểm tra TẤT CẢ câu trả lời của học sinh
- Đặt 1-2 câu hỏi mỗi lần

**KHÔNG ĐƯỢC:**
- Đưa đáp án trực tiếp (kể cả khi biết)
- Tin câu trả lời mà không kiểm tra
- Lặp lại câu hỏi đã hỏi
- Kéo dài khi học sinh đã hiểu đúng

## KHI NÀO KẾT THÚC?
Học sinh đã:
- Tìm ra đáp án đúng
- Giải thích được lý do
- Tự tin với câu trả lời

→ Khen + Tổng kết + Hỏi "Còn câu hỏi nào không?" + DỪNG LẠI`;

class AIService {
  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.modelConfig = AI_MODEL;
    this.firestore = firestoreService;
    
    console.log('AI Service initialized with model:', this.modelConfig.name);
    
    // Debug: List available models
    this.listAvailableModels();
  }

  // Khởi tạo collections nếu chưa tồn tại (simplified)
  async initializeCollections() {
    try {
      console.log('Collections will be created automatically when first document is added');
      return true;
    } catch (error) {
      console.error('Error initializing collections:', error);
      return false;
    }
  }

  // List available models (for debugging)
  async listAvailableModels() {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.geminiApiKey}`);
      const data = await response.json();
      console.log('Available models:', data);
      return data;
    } catch (error) {
      console.error('Error listing models:', error);
      return null;
    }
  }

  // Gọi Gemini API với fallback
  async callGeminiAPI(messages) {
    try {
      if (!this.geminiApiKey) {
        console.error('Gemini API key not found');
        throw new Error('Gemini API key not found. Please check your environment variables.');
      }

      console.log('Calling Gemini API with model:', this.modelConfig.name);
      console.log('API URL:', this.modelConfig.baseUrl);
      console.log('Messages count:', messages.length);

      // Format messages for Gemini API
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(`${this.modelConfig.baseUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: this.modelConfig.temperature,
            topK: this.modelConfig.topK,
            topP: this.modelConfig.topP,
            maxOutputTokens: this.modelConfig.maxTokens,
          },
          safetySettings: SAFETY_SETTINGS
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      console.log('Gemini API response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return {
          success: true,
          content: data.candidates[0].content.parts[0].text
        };
      } else {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Gửi tin nhắn và nhận phản hồi
  async sendMessage(chatId, userMessage, messageHistory = [], includeSystemPrompt = true) {
    try {
      // Tạo messages array với system prompt (nếu cần)
      const messages = includeSystemPrompt
        ? [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messageHistory,
            { role: 'user', content: userMessage }
          ]
        : [
            ...messageHistory,
            { role: 'user', content: userMessage }
          ];

      // Gọi Gemini API
      const result = await this.callGeminiAPI(messages);
      
      if (result.success) {
        // Lưu tin nhắn vào database
        await this.saveMessage(chatId, 'user', userMessage);
        await this.saveMessage(chatId, 'assistant', result.content);
        
        // Cập nhật messageCount trong chat session
        await this.updateMessageCount(chatId, 2); // +2 vì có user message và assistant message
        
        return {
          success: true,
          content: result.content
        };
      } else {
        // Fallback response nếu Gemini API lỗi
        const fallbackResponse = "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau. Trong khi đó, bạn có thể hỏi tôi về toán học, vật lý, hóa học, hoặc các môn học khác!";
        
        // Vẫn lưu tin nhắn user và fallback response
        await this.saveMessage(chatId, 'user', userMessage);
        await this.saveMessage(chatId, 'assistant', fallbackResponse);
        
        // Cập nhật messageCount trong chat session
        await this.updateMessageCount(chatId, 2);
        
        return {
          success: true,
          content: fallbackResponse
        };
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Lưu tin nhắn vào Firestore
  async saveMessage(chatId, role, content) {
    try {
      const messageData = {
        chatId,
        role, // 'user' hoặc 'assistant'
        content,
        timestamp: new Date(),
        createdAt: new Date()
      };

      return await firestoreService.createDocument('chat_messages', messageData);
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  // Tạo chat session mới
  async createChatSession(userId, title = 'Cuộc trò chuyện mới') {
    try {
      const chatData = {
        userId,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0
      };

      const result = await firestoreService.createDocument('chat_sessions', chatData);
      
      return {
        success: true,
        id: result.id
      };
    } catch (error) {
      console.error('Error creating chat session:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Lấy danh sách chat sessions của user
  async getUserChatSessions(userId) {
    try {
      console.log('🔍 Getting chat sessions for user:', userId);
      
      // Sử dụng method đơn giản hơn
      const result = await this.firestore.getCollection('chat_sessions');
      console.log('getCollection result:', result);
      
      // Handle different return formats
      let chatSessions = [];
      if (Array.isArray(result)) {
        // Direct array return
        chatSessions = result;
      } else if (result && result.success && Array.isArray(result.data)) {
        // Object with success and data properties
        chatSessions = result.data;
      } else if (result && Array.isArray(result)) {
        // Object with array property
        chatSessions = result;
      }
      
      if (Array.isArray(chatSessions)) {
        // Filter manually
        const userSessions = chatSessions.filter(session => session.userId === userId);
        console.log(`📋 Found ${userSessions.length} sessions for user ${userId}`);
        // Sort by updatedAt desc (newest first) - simplified
        userSessions.sort((a, b) => {
          const getTimestamp = (session) => {
            // Try updatedAt first
            if (session.updatedAt) {
              if (session.updatedAt.seconds) {
                return session.updatedAt.seconds * 1000; // Firestore Timestamp
              }
              if (typeof session.updatedAt === 'string') {
                return new Date(session.updatedAt).getTime(); // ISO string
              }
              if (session.updatedAt instanceof Date) {
                return session.updatedAt.getTime(); // Date object
              }
              if (typeof session.updatedAt === 'number') {
                return session.updatedAt; // Unix timestamp
              }
            }
            
            // Fallback to createdAt
            if (session.createdAt) {
              if (session.createdAt.seconds) {
                return session.createdAt.seconds * 1000;
              }
              if (typeof session.createdAt === 'string') {
                return new Date(session.createdAt).getTime();
              }
              if (session.createdAt instanceof Date) {
                return session.createdAt.getTime();
              }
              if (typeof session.createdAt === 'number') {
                return session.createdAt;
              }
            }
            
            return 0; // Default if no timestamp
          };
          
          const aTime = getTimestamp(a);
          const bTime = getTimestamp(b);
          
          console.log('🔄 Sorting chats:', {
            a: { id: a.id, title: a.title?.slice(0, 20), time: new Date(aTime).toLocaleString('vi-VN') },
            b: { id: b.id, title: b.title?.slice(0, 20), time: new Date(bTime).toLocaleString('vi-VN') },
            result: bTime - aTime > 0 ? 'b first' : 'a first'
          });
          
          return bTime - aTime; // Newest first (larger timestamp first)
        });
        
        console.log('✅ Final sorted sessions:', userSessions.map(s => ({
          id: s.id,
          title: s.title?.slice(0, 20),
          updatedAt: s.updatedAt,
          createdAt: s.createdAt
        })));
        
        return {
          success: true,
          sessions: userSessions
        };
      } else {
        console.error('Error getting chat sessions - not an array:', result);
        return {
          success: false,
          error: 'Invalid data format',
          sessions: []
        };
      }
    } catch (error) {
      console.error('Error getting user chat sessions:', error);
      return {
        success: false,
        error: error.message,
        sessions: []
      };
    }
  }

  // Lấy tin nhắn của một chat session
  async getChatMessages(chatId) {
    try {
      console.log('Getting messages for chat:', chatId);
      
      // Load tất cả messages rồi filter thủ công (tránh cần index)
      const result = await this.firestore.getCollection('chat_messages');
      console.log(`📨 Total messages in collection:`, result?.length || 0);
      
      // Handle different return formats
      let chatMessages = [];
      if (Array.isArray(result)) {
        // Direct array return
        chatMessages = result;
      } else if (result && result.success && Array.isArray(result.data)) {
        // Object with success and data properties
        chatMessages = result.data;
      } else if (result && Array.isArray(result)) {
        // Object with array property
        chatMessages = result;
      }
      
      if (Array.isArray(chatMessages)) {
        // Filter thủ công messages của chat này
        const filteredMessages = chatMessages.filter(message => message.chatId === chatId);
        console.log(`🔍 Filtered ${filteredMessages.length} messages for chat ${chatId}`);
        
        // Sort thủ công theo timestamp (cũ nhất trước)
        filteredMessages.sort((a, b) => {
          const getTime = (msg) => {
            if (msg.timestamp?.seconds) {
              return msg.timestamp.seconds * 1000; // Firestore Timestamp
            }
            if (typeof msg.timestamp === 'string') {
              return new Date(msg.timestamp).getTime(); // ISO string
            }
            if (msg.timestamp instanceof Date) {
              return msg.timestamp.getTime(); // Date object
            }
            if (typeof msg.timestamp === 'number') {
              return msg.timestamp; // Unix timestamp
            }
            return 0; // Default
          };
          
          return getTime(a) - getTime(b); // Cũ nhất trước (ascending)
        });
        
        return {
          success: true,
          messages: filteredMessages
        };
      } else {
        console.error('Error getting chat messages - not an array:', result);
        return {
          success: false,
          error: 'Invalid data format',
          messages: []
        };
      }
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return {
        success: false,
        error: error.message,
        messages: []
      };
    }
  }

  // Xóa chat session
  async deleteChatSession(chatId) {
    try {
      // Xóa tất cả tin nhắn trong chat
      const messagesResult = await firestoreService.getCollection('chat_messages', {
        where: [
          { field: 'chatId', operator: '==', value: chatId }
        ]
      });
      
      for (const message of messagesResult) {
        await firestoreService.deleteDocument('chat_messages', message.id);
      }

      // Xóa chat session
      await firestoreService.deleteDocument('chat_sessions', chatId);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting chat session:', error);
      
      // Nếu collection chưa tồn tại, vẫn coi là thành công
      if (error.message.includes('Điều kiện tiên quyết') || error.message.includes('precondition')) {
        return { success: true };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cập nhật messageCount của chat session
  async updateMessageCount(chatId, increment = 1) {
    try {
      // Lấy chat session hiện tại để có messageCount
      const chatSessionResult = await firestoreService.getDocument('chat_sessions', chatId);
      const currentCount = chatSessionResult.success ? (chatSessionResult.data?.messageCount || 0) : 0;
      
      await firestoreService.updateDocument('chat_sessions', chatId, {
        messageCount: currentCount + increment,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating message count:', error);
      // Không throw error vì đây không phải critical operation
    }
  }

  // Cập nhật title của chat session
  async updateChatTitle(chatId, title) {
    try {
      await firestoreService.updateDocument('chat_sessions', chatId, {
        title,
        updatedAt: new Date()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating chat title:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new AIService();
