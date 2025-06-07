'use client'

import { useChat } from 'ai/react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MessageCircle,
  Zap,
  Brain,
  ArrowUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Coffee
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

// Custom markdown components with coffee theme
const MarkdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-2xl font-bold text-[#6F4E37] mb-4 border-b border-[#ECB176] pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-xl font-semibold text-[#6F4E37] mb-3 mt-6">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-lg font-medium text-[#6F4E37] mb-2 mt-4">{children}</h3>
  ),
  p: ({ children }: any) => (
    <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 ml-4">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 ml-4">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="text-gray-700">{children}</li>
  ),
  code: ({ inline, children }: any) =>
    inline ? (
      <code className="bg-[#F5F5DC] text-[#6F4E37] px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ) : (
      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-3">
        {children}
      </code>
    ),
  pre: ({ children }: any) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-3">
      {children}
    </pre>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-[#ECB176] pl-4 italic text-gray-600 mb-3">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      className="text-[#6F4E37] hover:text-[#ECB176] underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold text-[#6F4E37]">{children}</strong>
  ),
}

// Suggested prompts
const suggestedPrompts = [
  {
    icon: <Sparkles className="h-4 w-4" />,
    text: "Help me improve my product description",
    category: "Content Creation"
  },
  {
    icon: <Zap className="h-4 w-4" />,
    text: "Generate pricing strategy ideas",
    category: "Business Strategy"
  },
  {
    icon: <Brain className="h-4 w-4" />,
    text: "Analyze my target market",
    category: "Market Analysis"
  },
  {
    icon: <MessageCircle className="h-4 w-4" />,
    text: "Create compelling testimonials",
    category: "Content Creation"
  }
]

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-[#6F4E37] rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-[#6F4E37] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-2 h-2 bg-[#6F4E37] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  </div>
)

// Streaming cursor indicator
const StreamingCursor = () => (
  <span className="inline-block w-2 h-5 bg-[#6F4E37] ml-1 animate-pulse"></span>
)

// Loading skeleton for AI response
const LoadingSkeleton = () => (
  <div className="flex items-start gap-4">
    <Avatar className="h-9 w-9 flex-shrink-0">
      <AvatarFallback className="bg-gradient-to-br from-[#6F4E37] to-[#ECB176] text-white">
        <Bot className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 space-y-3 bg-white/70 backdrop-blur-sm border border-[#ECB176]/30 rounded-2xl rounded-bl-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <TypingIndicator />
        <span className="text-sm text-[#6F4E37]/70">AI is thinking...</span>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gradient-to-r from-[#F5F5DC] via-[#ECB176]/30 to-[#F5F5DC] rounded animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-[#F5F5DC] via-[#ECB176]/30 to-[#F5F5DC] rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-gradient-to-r from-[#F5F5DC] via-[#ECB176]/30 to-[#F5F5DC] rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  </div>
)

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
    },
    onFinish: (message) => {
      console.log('Message finished:', message)
    }
  })
  
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (messages.length > 0) {
      setShowSuggestions(false)
    }
  }, [messages])

  const handleSuggestedPrompt = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as any)
    setShowSuggestions(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setShowSuggestions(false)
    handleSubmit(e)
  }

  const startNewChat = () => {
    reload()
    setShowSuggestions(true)
  }

  // Check if the last message is from assistant and still streaming
  const lastMessage = messages[messages.length - 1]
  const isStreaming = isLoading && lastMessage?.role === 'assistant'

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#F5F5DC] to-white">
      {/* Enhanced Header */}
      <div className="backdrop-blur-sm border-b border-[#ECB176]/30 shadow-sm flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-[#6F4E37] to-[#ECB176] rounded-xl flex items-center justify-center shadow-lg">
                  <Coffee  size={8} className="size-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6F4E37]">AI Product Assistant</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-[#ECB176] to-[#6F4E37] text-white border-0 px-3 py-1 shadow-md">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
              <div className="text-right">
                <div className="text-sm font-medium text-[#6F4E37]">Ready to Help</div>
                <div className="text-xs text-emerald-600 flex items-center gap-1 justify-end">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - with proper flex and padding for sticky input */}
      <div className="flex-1 overflow-hidden pb-4">
        <div className="h-full max-w-5xl mx-auto">
          <ScrollArea className="h-full px-6 py-2">
            {messages.length === 0 && showSuggestions ? (
              <div className="space-y-12">
                {/* Welcome Section */}
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6F4E37] to-[#ECB176] rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                      <Bot className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#ECB176] to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-[#6F4E37]">
                      Welcome to Your AI Assistant
                    </h2>
                    <p className="text-[#6F4E37]/80 max-w-2xl mx-auto text-lg leading-relaxed">
                      I'm here to elevate your product showcase, craft winning business strategies, 
                      and create compelling content that converts. Let's build something amazing together.
                    </p>
                  </div>
                </div>

                {/* Enhanced Suggested Prompts */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-[#6F4E37] mb-2">
                      Start with these popular requests
                    </h3>
                    <p className="text-[#6F4E37]/60">Click any suggestion to get started</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedPrompts.map((prompt, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestedPrompt(prompt.text)}
                        className="group relative p-6 bg-white/70 backdrop-blur-sm border border-[#ECB176]/30 rounded-2xl hover:bg-white hover:border-[#ECB176] hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#ECB176] to-[#6F4E37] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                            {prompt.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#6F4E37] mb-2 group-hover:text-[#ECB176] transition-colors">
                              {prompt.text}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-[#F5F5DC] text-[#6F4E37] rounded-full">
                                {prompt.category}
                              </span>
                            </div>
                          </div>
                          <ArrowUp className="h-4 w-4 text-[#6F4E37]/40 group-hover:text-[#ECB176] transform rotate-45 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {messages.map((message, index) => (
                  <div key={message.id} className="space-y-2">
                    {message.role === 'user' ? (
                      /* User Message */
                      <div className="flex justify-end">
                        <div className="max-w-[75%] flex items-start gap-3">
                          <div className="bg-gradient-to-r from-[#6F4E37] to-[#ECB176] text-white px-6 py-4 rounded-2xl rounded-br-md shadow-md">
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          </div>
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ) : (
                      /* AI Message */
                      <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-[#6F4E37] to-[#ECB176] text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={MarkdownComponents}
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeHighlight]}
                            >
                              {message.content}
                            </ReactMarkdown>
                            {/* Show streaming cursor if this is the last message and still streaming */}
                            {isStreaming && index === messages.length - 1 && <StreamingCursor />}
                          </div>
                          
                          {/* Enhanced Action Buttons - only show when not streaming */}
                          {!isStreaming && (
                            <div className="flex items-center gap-1 mt-4 opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-3 text-xs text-[#6F4E37]/60 hover:text-[#6F4E37] hover:bg-[#F5F5DC]"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-3 text-xs text-[#6F4E37]/60 hover:text-emerald-600 hover:bg-emerald-50"
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-3 text-xs text-[#6F4E37]/60 hover:text-red-500 hover:bg-red-50"
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <div className={`text-xs text-[#6F4E37]/40 ${
                      message.role === 'user' ? 'text-right pr-12' : 'text-left pl-13'
                    }`}>
                      {new Date().toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}

                {/* Loading skeleton - appears after user message when AI is responding */}
                {isLoading && (!lastMessage || lastMessage.role === 'user') && (
                  <LoadingSkeleton />
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>
      </div>

      {/* Sticky Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0  backdrop-blur-sm border-t border-[#ECB176]/30 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <form onSubmit={onSubmit}>
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything about your product or business..."
                  className="pr-14 py-3 border-[#ECB176]/50 focus:border-[#6F4E37] focus:ring-[#6F4E37] bg-white rounded-xl text-base shadow-sm"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      onSubmit(e as any)
                    }
                  }}
                />
                {input.trim() && (
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0 bg-gradient-to-r from-[#6F4E37] to-[#ECB176] hover:from-[#ECB176] hover:to-[#6F4E37] shadow-md"
                    disabled={isLoading}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {messages.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={startNewChat}
                  className="border-[#ECB176] text-[#6F4E37] hover:bg-[#F5F5DC] px-4 py-3"
                  disabled={isLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              )}
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}