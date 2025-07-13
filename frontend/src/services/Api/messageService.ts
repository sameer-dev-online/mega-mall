import axiosInstance from '@/lib/axious';
import {
  ApiResponse,
  Message,
  SendMessageData
} from '@/types/api';

class MessageService {
  // Message Management
  async sendMessageByUser(data: SendMessageData): Promise<ApiResponse<Message>> {
    const response = await axiosInstance.post('/message/send-message-by-user', data);
    return response.data;
  }

  async getMessages(): Promise<ApiResponse<Message[]>> {
    const response = await axiosInstance.get('/message/get-messages');
    return response.data;
  }

  // Utility methods for message management
  sortMessagesByDate(messages: Message[], ascending: boolean = true): Message[] {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
    const grouped: Record<string, Message[]> = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    
    return grouped;
  }

  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatMessageDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }

  getUnreadMessagesCount(messages: Message[]): number {
    // This would depend on your backend implementation
    // You might need to add an 'isRead' field to your Message interface
    return messages.filter(message => message.isFromAdmin && !message.isRead).length;
  }

  getLastMessage(messages: Message[]): Message | null {
    if (messages.length === 0) return null;
    
    const sortedMessages = this.sortMessagesByDate(messages, false);
    return sortedMessages[0];
  }

  // Search messages
  searchMessages(messages: Message[], query: string): Message[] {
    const lowercaseQuery = query.toLowerCase();
    return messages.filter(message =>
      message.message.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Filter messages by sender type
  getMessagesByType(messages: Message[], isFromAdmin: boolean): Message[] {
    return messages.filter(message => message.isFromAdmin === isFromAdmin);
  }

  // Get conversation summary
  getConversationSummary(messages: Message[]): {
    totalMessages: number;
    userMessages: number;
    adminMessages: number;
    lastMessageDate: string | null;
  } {
    const userMessages = this.getMessagesByType(messages, false);
    const adminMessages = this.getMessagesByType(messages, true);
    const lastMessage = this.getLastMessage(messages);

    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      adminMessages: adminMessages.length,
      lastMessageDate: lastMessage ? lastMessage.createdAt : null
    };
  }
}

export const messageService = new MessageService();
