"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Bot, User, Loader2, FileText, Search, BarChart3, BookOpen } from "lucide-react"
import { getDocuments, askQuestion } from "@/lib/actions"
import type { Document, Message } from "@/lib/types"

const SUGGESTED_QUERIES = [
  {
    icon: Search,
    text: "What is the main conclusion of this paper?",
    category: "Content Lookup",
  },
  {
    icon: BookOpen,
    text: "Summarize the methodology section",
    category: "Summarization",
  },
  {
    icon: BarChart3,
    text: "What are the accuracy and F1-score results?",
    category: "Data Extraction",
  },
  {
    icon: FileText,
    text: "Extract all tables from the document",
    category: "Structure Analysis",
  },
]

export function ChatInterface() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getDocuments()
        setDocuments(docs)
        if (docs.length > 0) {
          setSelectedDocId(docs[0].id)
        }
      } catch (error) {
        console.error("Error fetching documents:", error)
      }
    }

    fetchDocuments()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (messageText?: string) => {
    const questionText = messageText || input
    if (!questionText.trim() || !selectedDocId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: questionText,
      role: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await askQuestion({
        documentId: selectedDocId,
        question: questionText,
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: "assistant",
        timestamp: new Date().toISOString(),
        sources: response.sources,
        metadata: response.metadata,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error asking question:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I encountered an error while processing your question. Please try again or rephrase your query.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const selectedDocument = documents.find((doc) => doc.id === selectedDocId)

  return (
    <div className="flex flex-col h-[700px]">
      {/* Document Selection */}
      <div className="mb-4 space-y-3">
        <Select value={selectedDocId || ""} onValueChange={(value) => setSelectedDocId(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a document to analyze" />
          </SelectTrigger>
          <SelectContent>
            {documents.map((doc) => (
              <SelectItem key={doc.id} value={doc.id}>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{doc.filename}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {doc.pageCount} pages
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedDocument && (
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span>
                    <strong>Pages:</strong> {selectedDocument.pageCount}
                  </span>
                  <span>
                    <strong>Sections:</strong> {selectedDocument.sections}
                  </span>
                  <span>
                    <strong>Tables:</strong> {selectedDocument.tables}
                  </span>
                  <span>
                    <strong>Figures:</strong> {selectedDocument.figures}
                  </span>
                </div>
                <Badge variant={selectedDocument.vectorized ? "default" : "secondary"}>
                  {selectedDocument.vectorized ? "Processed" : "Processing"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto border rounded-md p-4 mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <Bot className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">AI Document Assistant Ready</p>
              <p className="text-sm text-gray-500">Select a document and ask questions about its content</p>
            </div>

            {selectedDocId && (
              <div className="w-full max-w-2xl">
                <h3 className="text-sm font-medium mb-3 text-center">Suggested Queries</h3>
                <div className="grid gap-2">
                  {SUGGESTED_QUERIES.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto p-3 text-left"
                      onClick={() => handleSendMessage(query.text)}
                    >
                      <query.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm">{query.text}</div>
                        <div className="text-xs text-gray-500">{query.category}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg p-4 ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white border shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    <span className="text-xs font-medium">{msg.role === "user" ? "You" : "AI Assistant"}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium mb-2">Sources:</p>
                      <div className="space-y-1">
                        {msg.sources.map((source, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {source}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.metadata && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {msg.metadata.confidence && (
                          <Badge variant="secondary" className="text-xs">
                            Confidence: {Math.round(msg.metadata.confidence * 100)}%
                          </Badge>
                        )}
                        {msg.metadata.processingTime && (
                          <Badge variant="secondary" className="text-xs">
                            {msg.metadata.processingTime}ms
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm rounded-lg p-4 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs font-medium">AI Assistant</span>
                    <Loader2 className="h-3 w-3 animate-spin ml-auto" />
                  </div>
                  <div className="text-sm text-gray-500 mt-2">Analyzing document and generating response...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about conclusions, methodology, results, tables, or any specific content..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          disabled={loading || !selectedDocId}
          className="flex-1"
        />
        <Button onClick={() => handleSendMessage()} disabled={loading || !selectedDocId} size="lg">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {!selectedDocId && documents.length === 0 && (
        <p className="text-xs text-gray-500 text-center mt-2">Upload documents first to start asking questions</p>
      )}
    </div>
  )
}
