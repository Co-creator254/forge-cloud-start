
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from './types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading }) => {
  return (
    <div className="space-y-4 h-[300px] overflow-y-auto p-2">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div 
            className={`flex max-w-[80%] md:max-w-[70%] items-start gap-2 ${
              message.role === 'assistant' 
                ? 'bg-muted rounded-lg p-3' 
                : 'bg-primary text-primary-foreground rounded-lg p-3'
            }`}
          >
            {message.role === 'assistant' && <Bot className="h-5 w-5 mt-0.5" />}
            <div>
              <p className="whitespace-pre-line text-sm md:text-base">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            {message.role === 'user' && <User className="h-5 w-5 mt-0.5" />}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
