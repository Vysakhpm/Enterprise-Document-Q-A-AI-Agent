export interface Document {
  id: string
  filename: string
  title?: string
  authors?: string[]
  uploadedAt: string
  pageCount: number
  fileSize: number
  vectorized: boolean
  sections?: number
  tables?: number
  figures?: number
  equations?: number
  references?: number
  abstract?: string
  keywords?: string[]
  processingStatus?: "pending" | "processing" | "completed" | "error"
  extractedContent?: {
    text: string
    structure: DocumentStructure
    metadata: DocumentMetadata
  }
}

export interface DocumentStructure {
  title?: string
  abstract?: string
  sections: Section[]
  tables: Table[]
  figures: Figure[]
  equations: Equation[]
  references: Reference[]
}

export interface Section {
  id: string
  title: string
  content: string
  level: number
  pageNumber: number
  subsections?: Section[]
}

export interface Table {
  id: string
  caption?: string
  headers: string[]
  rows: string[][]
  pageNumber: number
  position: { x: number; y: number; width: number; height: number }
}

export interface Figure {
  id: string
  caption?: string
  type: "image" | "chart" | "diagram"
  pageNumber: number
  position: { x: number; y: number; width: number; height: number }
  extractedText?: string
}

export interface Equation {
  id: string
  latex: string
  pageNumber: number
  context?: string
}

export interface Reference {
  id: string
  title: string
  authors: string[]
  year?: number
  journal?: string
  doi?: string
  url?: string
}

export interface DocumentMetadata {
  language: string
  wordCount: number
  readingTime: number
  complexity: "low" | "medium" | "high"
  topics: string[]
  confidence: number
}

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  sources?: string[]
  metadata?: {
    confidence?: number
    processingTime?: number
    queryType?: "lookup" | "summarization" | "extraction" | "analysis"
    relevantSections?: string[]
  }
}

export interface ArxivPaper {
  id: string
  title: string
  authors: string[]
  summary: string
  published: string
  updated: string
  categories: string[]
  pdfUrl: string
  doi?: string
  journal?: string
  primaryCategory?: string
}

export interface QuestionRequest {
  documentId: string
  question: string
  context?: string
  queryType?: "lookup" | "summarization" | "extraction" | "analysis"
}

export interface QuestionResponse {
  answer: string
  sources: string[]
  confidence: number
  metadata?: {
    processingTime: number
    queryType: string
    relevantSections: string[]
    extractedData?: any
  }
}

export interface ProcessingResult {
  success: boolean
  document: Document
  extractedContent: {
    textContent: string
    structure: DocumentStructure
    metadata: DocumentMetadata
  }
  processingTime: number
  errors?: string[]
}
