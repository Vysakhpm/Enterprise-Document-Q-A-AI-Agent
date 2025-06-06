"use server"

import { revalidatePath } from "next/cache"
import type { Document, ArxivPaper, QuestionRequest, QuestionResponse } from "./types"

// Enhanced mock database with more realistic data
let documents: Document[] = []
let nextId = 1

// Simulate advanced PDF processing
export async function uploadDocument(formData: FormData): Promise<Document> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    // Simulate comprehensive document processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Read file content for processing simulation
    const arrayBuffer = await file.arrayBuffer()
    const fileSize = arrayBuffer.byteLength

    // Simulate advanced content extraction
    const mockProcessingResult = simulateDocumentProcessing(file.name, fileSize)

    // Create comprehensive document record
    const document: Document = {
      id: String(nextId++),
      filename: file.name,
      title: mockProcessingResult.title,
      authors: mockProcessingResult.authors,
      uploadedAt: new Date().toISOString(),
      pageCount: mockProcessingResult.pageCount,
      fileSize: fileSize,
      vectorized: true,
      sections: mockProcessingResult.sections,
      tables: mockProcessingResult.tables,
      figures: mockProcessingResult.figures,
      equations: mockProcessingResult.equations,
      references: mockProcessingResult.references,
      abstract: mockProcessingResult.abstract,
      keywords: mockProcessingResult.keywords,
      processingStatus: "completed",
    }

    documents.push(document)
    revalidatePath("/")
    return document
  } catch (error) {
    console.error("Error uploading document:", error)
    throw error
  }
}

// Simulate comprehensive document processing
function simulateDocumentProcessing(filename: string, fileSize: number) {
  const pageCount = Math.floor(Math.random() * 25) + 5 // 5-30 pages
  const sections = Math.floor(Math.random() * 8) + 3 // 3-10 sections
  const tables = Math.floor(Math.random() * 5) + 1 // 1-5 tables
  const figures = Math.floor(Math.random() * 8) + 2 // 2-9 figures
  const equations = Math.floor(Math.random() * 15) + 5 // 5-19 equations
  const references = Math.floor(Math.random() * 40) + 20 // 20-59 references

  // Generate realistic academic content
  const titles = [
    "Advanced Machine Learning Techniques for Natural Language Processing",
    "Deep Neural Networks in Computer Vision: A Comprehensive Survey",
    "Quantum Computing Applications in Cryptography and Security",
    "Blockchain Technology and Distributed Systems Architecture",
    "Artificial Intelligence in Healthcare: Challenges and Opportunities",
    "Sustainable Energy Systems and Smart Grid Technologies",
    "Robotics and Autonomous Systems in Manufacturing",
    "Data Mining and Knowledge Discovery in Large Datasets",
  ]

  const authors = [
    ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emily Rodriguez"],
    ["Prof. David Kim", "Dr. Lisa Wang", "Dr. James Thompson"],
    ["Dr. Maria Garcia", "Prof. Robert Lee", "Dr. Anna Petrov"],
    ["Prof. Ahmed Hassan", "Dr. Jennifer Liu", "Dr. Carlos Mendez"],
    ["Dr. Priya Sharma", "Prof. Thomas Anderson", "Dr. Yuki Tanaka"],
  ]

  const abstracts = [
    "This paper presents a novel approach to addressing key challenges in the field through innovative methodologies and comprehensive experimental validation. Our results demonstrate significant improvements over existing approaches.",
    "We propose a new framework that combines theoretical foundations with practical applications, achieving state-of-the-art performance across multiple benchmark datasets and real-world scenarios.",
    "This research investigates advanced techniques and their applications, providing both theoretical insights and practical solutions that advance the current state of knowledge in the domain.",
  ]

  const keywords = [
    ["machine learning", "neural networks", "deep learning", "artificial intelligence"],
    ["computer vision", "image processing", "pattern recognition", "feature extraction"],
    ["natural language processing", "text mining", "sentiment analysis", "language models"],
    ["data science", "big data", "analytics", "statistical modeling"],
    ["cybersecurity", "cryptography", "network security", "privacy protection"],
  ]

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    authors: authors[Math.floor(Math.random() * authors.length)],
    abstract: abstracts[Math.floor(Math.random() * abstracts.length)],
    keywords: keywords[Math.floor(Math.random() * keywords.length)],
    pageCount,
    sections,
    tables,
    figures,
    equations,
    references,
  }
}

export async function getDocuments(): Promise<Document[]> {
  return documents
}

export async function deleteDocument(id: string) {
  documents = documents.filter((doc) => doc.id !== id)
  revalidatePath("/")
}

// Enhanced question answering with intelligent response generation
export async function askQuestion(request: QuestionRequest): Promise<QuestionResponse> {
  const { documentId, question } = request
  const startTime = Date.now()

  // Find the document
  const document = documents.find((doc) => doc.id === documentId)
  if (!document) {
    throw new Error("Document not found")
  }

  // Simulate processing time based on question complexity
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

  // Analyze question type and generate appropriate response
  const queryType = analyzeQuestionType(question)
  const response = generateIntelligentResponse(document, question, queryType)

  const processingTime = Date.now() - startTime

  return {
    answer: response.answer,
    sources: response.sources,
    confidence: response.confidence,
    metadata: {
      processingTime,
      queryType,
      relevantSections: response.relevantSections,
      extractedData: response.extractedData,
    },
  }
}

function analyzeQuestionType(question: string): "lookup" | "summarization" | "extraction" | "analysis" {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes("summarize") || lowerQuestion.includes("summary") || lowerQuestion.includes("overview")) {
    return "summarization"
  }
  if (
    lowerQuestion.includes("extract") ||
    lowerQuestion.includes("table") ||
    lowerQuestion.includes("figure") ||
    lowerQuestion.includes("data") ||
    lowerQuestion.includes("results") ||
    lowerQuestion.includes("accuracy") ||
    lowerQuestion.includes("f1") ||
    lowerQuestion.includes("precision") ||
    lowerQuestion.includes("recall")
  ) {
    return "extraction"
  }
  if (
    lowerQuestion.includes("analyze") ||
    lowerQuestion.includes("compare") ||
    lowerQuestion.includes("evaluate") ||
    lowerQuestion.includes("assess")
  ) {
    return "analysis"
  }
  return "lookup"
}

function generateIntelligentResponse(
  document: Document,
  question: string,
  queryType: string,
): {
  answer: string
  sources: string[]
  confidence: number
  relevantSections: string[]
  extractedData?: any
} {
  const lowerQuestion = question.toLowerCase()

  // Generate contextual responses based on document content and question type
  if (
    queryType === "extraction" &&
    (lowerQuestion.includes("accuracy") || lowerQuestion.includes("f1") || lowerQuestion.includes("results"))
  ) {
    return {
      answer: `Based on the experimental results in ${document.title || document.filename}, here are the key performance metrics:

**Model Performance:**
- Accuracy: 89.3% (±1.2%)
- F1-Score: 87.6% (±0.8%)
- Precision: 88.9% (±1.0%)
- Recall: 86.4% (±1.1%)

**Comparison with Baselines:**
- Outperformed baseline by 12.7% in accuracy
- Achieved 15.3% improvement in F1-score over previous state-of-the-art
- Demonstrated consistent performance across 5 different datasets

**Statistical Significance:**
- All improvements are statistically significant (p < 0.001)
- 95% confidence intervals provided for all metrics
- Cross-validation performed with 10-fold validation

The results indicate substantial improvements over existing approaches, with particularly strong performance in precision and recall balance.`,
      sources: [
        `${document.filename}, Table 2 (Results Summary)`,
        `${document.filename}, Section 4.2 (Experimental Results)`,
      ],
      confidence: 0.92,
      relevantSections: ["Results", "Experimental Evaluation", "Performance Analysis"],
      extractedData: {
        metrics: {
          accuracy: 0.893,
          f1Score: 0.876,
          precision: 0.889,
          recall: 0.864,
        },
        improvements: {
          accuracyImprovement: 0.127,
          f1Improvement: 0.153,
        },
      },
    }
  }

  if (queryType === "extraction" && lowerQuestion.includes("table")) {
    return {
      answer: `I found ${document.tables || 3} tables in ${document.title || document.filename}. Here are the key tables:

**Table 1: Performance Comparison**
| Method | Accuracy | F1-Score | Training Time |
|--------|----------|----------|---------------|
| Baseline | 0.765 | 0.723 | 2.3h |
| Method A | 0.834 | 0.801 | 3.1h |
| Our Method | 0.893 | 0.876 | 2.8h |
| SOTA | 0.887 | 0.869 | 4.2h |

**Table 2: Dataset Statistics**
| Dataset | Samples | Features | Classes |
|---------|---------|----------|---------|
| Dataset A | 10,000 | 512 | 10 |
| Dataset B | 25,000 | 1024 | 5 |
| Dataset C | 15,000 | 256 | 8 |

**Table 3: Ablation Study Results**
| Component | Accuracy | Impact |
|-----------|----------|--------|
| Full Model | 0.893 | - |
| -Attention | 0.847 | -4.6% |
| -Regularization | 0.871 | -2.2% |
| -Feature Eng. | 0.823 | -7.0% |

These tables provide comprehensive performance analysis and experimental validation of the proposed approach.`,
      sources: [`${document.filename}, Table 1`, `${document.filename}, Table 2`, `${document.filename}, Table 3`],
      confidence: 0.95,
      relevantSections: ["Results", "Experimental Setup", "Ablation Study"],
      extractedData: {
        tableCount: document.tables || 3,
        tables: ["Performance Comparison", "Dataset Statistics", "Ablation Study Results"],
      },
    }
  }

  if (queryType === "summarization" && lowerQuestion.includes("methodology")) {
    return {
      answer: `## Methodology Summary for ${document.title || document.filename}

**1. Problem Formulation**
The authors formulate the problem as a supervised learning task with multi-class classification objectives. They define the problem space and establish mathematical foundations for their approach.

**2. Data Preprocessing**
- Data cleaning and normalization procedures
- Feature extraction using advanced techniques
- Data augmentation strategies to improve model robustness
- Train/validation/test split with stratified sampling

**3. Model Architecture**
- Novel neural network architecture with attention mechanisms
- Multi-layer feature extraction with residual connections
- Adaptive pooling and regularization techniques
- End-to-end trainable framework

**4. Training Procedure**
- Adam optimizer with learning rate scheduling
- Batch size optimization and gradient clipping
- Early stopping with validation monitoring
- Cross-validation for robust evaluation

**5. Evaluation Framework**
- Multiple evaluation metrics (accuracy, F1, precision, recall)
- Statistical significance testing
- Ablation studies to validate component contributions
- Comparison with state-of-the-art baselines

**6. Implementation Details**
- PyTorch/TensorFlow implementation
- GPU acceleration and distributed training
- Hyperparameter tuning with grid search
- Reproducibility measures and random seed control

The methodology demonstrates a systematic approach to addressing the research problem with rigorous experimental validation.`,
      sources: [`${document.filename}, Section 3 (Methodology)`, `${document.filename}, Section 3.1-3.4`],
      confidence: 0.88,
      relevantSections: ["Methodology", "Experimental Setup", "Implementation"],
    }
  }

  if (lowerQuestion.includes("conclusion") || lowerQuestion.includes("conclude")) {
    return {
      answer: `## Conclusions from ${document.title || document.filename}

**Main Contributions:**
1. **Novel Approach**: The paper introduces a groundbreaking methodology that significantly advances the state-of-the-art in the field
2. **Performance Improvements**: Achieved substantial improvements over existing methods with 12.7% accuracy gain and 15.3% F1-score improvement
3. **Theoretical Insights**: Provided new theoretical understanding of the underlying mechanisms and their implications
4. **Practical Applications**: Demonstrated real-world applicability across multiple domains and use cases

**Key Findings:**
- The proposed method consistently outperforms baselines across diverse datasets
- Ablation studies confirm the importance of each component in the overall framework
- Statistical analysis validates the significance of reported improvements
- Computational efficiency is maintained while achieving superior performance

**Limitations and Future Work:**
- Current approach has limitations in handling extremely large-scale datasets
- Future research should explore extension to multi-modal scenarios
- Integration with emerging technologies presents opportunities for further advancement
- Long-term studies needed to validate sustained performance benefits

**Impact and Significance:**
The research makes significant contributions to both theoretical understanding and practical applications. The proposed methodology opens new avenues for research and has potential for widespread adoption in industry applications.

**Final Remarks:**
This work represents a substantial step forward in the field, providing both immediate practical benefits and laying groundwork for future innovations. The comprehensive evaluation and rigorous methodology ensure the reliability and reproducibility of the results.`,
      sources: [`${document.filename}, Section 6 (Conclusions)`, `${document.filename}, Section 7 (Future Work)`],
      confidence: 0.9,
      relevantSections: ["Conclusions", "Discussion", "Future Work"],
    }
  }

  if (lowerQuestion.includes("abstract") || lowerQuestion.includes("summary")) {
    return {
      answer: `## Abstract Summary: ${document.title || document.filename}

${
  document.abstract ||
  `This research paper presents a comprehensive investigation into advanced methodologies for addressing key challenges in the field. The authors propose innovative approaches that combine theoretical foundations with practical applications, demonstrating significant improvements over existing state-of-the-art methods.

**Research Objectives:**
The study aims to develop novel techniques that overcome current limitations while maintaining computational efficiency and practical applicability.

**Methodology:**
The research employs a multi-faceted approach incorporating advanced algorithms, comprehensive experimental validation, and rigorous statistical analysis.

**Key Results:**
- Achieved 89.3% accuracy, representing a 12.7% improvement over baselines
- Demonstrated consistent performance across multiple benchmark datasets
- Validated approach through extensive ablation studies and comparative analysis

**Significance:**
This work contributes to both theoretical understanding and practical applications, providing a foundation for future research and development in the field.`
}

**Document Statistics:**
- **Pages:** ${document.pageCount}
- **Sections:** ${document.sections || "Multiple"}
- **Tables:** ${document.tables || "Several"}
- **Figures:** ${document.figures || "Multiple"}
- **References:** ${document.references || "Extensive bibliography"}

The paper represents a significant contribution to the field with immediate practical applications and long-term research implications.`,
      sources: [`${document.filename}, Abstract`, `${document.filename}, Introduction`],
      confidence: 0.85,
      relevantSections: ["Abstract", "Introduction", "Overview"],
    }
  }

  // Default comprehensive response
  return {
    answer: `Based on my analysis of ${document.title || document.filename}, I can provide the following information regarding "${question}":

**Document Overview:**
This ${document.pageCount}-page research paper presents comprehensive analysis and experimental validation in its field. The document contains ${document.sections || "multiple"} main sections, ${document.tables || "several"} tables, and ${document.figures || "multiple"} figures.

**Relevant Content:**
The document addresses your query through detailed discussion and empirical evidence. Key findings include:

- Methodological innovations that improve upon existing approaches
- Comprehensive experimental validation across multiple datasets  
- Statistical significance of reported results with confidence intervals
- Practical implications for real-world applications
- Theoretical contributions to the field

**Key Insights:**
1. **Performance**: The proposed approach demonstrates superior performance with measurable improvements
2. **Validation**: Rigorous experimental methodology ensures reliable results
3. **Applicability**: Broad applicability across different scenarios and use cases
4. **Innovation**: Novel contributions that advance the current state of knowledge

**Supporting Evidence:**
The conclusions are supported by extensive experimental validation, statistical analysis, and comparison with established baselines. The research methodology follows best practices for reproducibility and scientific rigor.

For more specific information about particular aspects, please feel free to ask about specific sections, methodologies, results, or conclusions.`,
    sources: [`${document.filename}, Multiple sections`, `${document.filename}, Overview`],
    confidence: 0.75,
    relevantSections: ["General Content", "Multiple Sections"],
  }
}

// Enhanced ArXiv search with real-world paper simulation
export async function searchArxiv(query: string): Promise<ArxivPaper[]> {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Generate realistic ArXiv papers based on query
    const papers = generateRealisticArxivPapers(query)
    return papers
  } catch (error) {
    console.error("Error searching ArXiv:", error)
    return []
  }
}

function generateRealisticArxivPapers(query: string): ArxivPaper[] {
  const currentYear = new Date().getFullYear()
  const categories = getRelevantCategories(query)

  const paperTemplates = [
    {
      titleTemplate: `Advanced {query} Techniques: A Comprehensive Survey and Future Directions`,
      summaryTemplate: `This paper presents a comprehensive survey of recent advances in {query}. We systematically review current methodologies, identify key challenges, and propose future research directions. Our analysis covers both theoretical foundations and practical applications, providing insights for researchers and practitioners. We evaluate 150+ papers published in the last five years and identify emerging trends and opportunities.`,
    },
    {
      titleTemplate: `Novel Deep Learning Approaches for {query}: Experimental Validation and Performance Analysis`,
      summaryTemplate: `We propose novel deep learning architectures specifically designed for {query} applications. Through extensive experiments on benchmark datasets, we demonstrate significant improvements over existing methods. Our approach achieves state-of-the-art performance while maintaining computational efficiency. We provide detailed ablation studies and theoretical analysis of the proposed methods.`,
    },
    {
      titleTemplate: `Scalable {query} Solutions: From Theory to Practice in Large-Scale Systems`,
      summaryTemplate: `This work addresses scalability challenges in {query} by proposing efficient algorithms and system architectures. We present both theoretical analysis and practical implementations that can handle large-scale real-world scenarios. Our evaluation demonstrates linear scalability and robust performance across diverse deployment environments.`,
    },
    {
      titleTemplate: `Transformer-Based Models for {query}: Attention Mechanisms and Multi-Modal Integration`,
      summaryTemplate: `We investigate the application of transformer architectures to {query} problems, introducing novel attention mechanisms and multi-modal fusion techniques. Our approach leverages self-attention and cross-attention to capture complex relationships in the data. Experimental results show substantial improvements over traditional methods across multiple benchmarks.`,
    },
    {
      titleTemplate: `Federated Learning for {query}: Privacy-Preserving Distributed Training and Inference`,
      summaryTemplate: `This paper explores federated learning approaches for {query} applications, addressing privacy concerns and communication efficiency. We propose novel aggregation algorithms and privacy-preserving techniques that maintain model performance while protecting sensitive data. Our framework is evaluated on realistic federated settings with heterogeneous data distributions.`,
    },
  ]

  const authorPools = [
    ["Dr. Sarah Chen", "Prof. Michael Rodriguez", "Dr. Emily Wang"],
    ["Prof. David Kim", "Dr. Lisa Thompson", "Dr. James Anderson"],
    ["Dr. Maria Garcia", "Prof. Robert Lee", "Dr. Anna Petrov", "Dr. Carlos Mendez"],
    ["Prof. Ahmed Hassan", "Dr. Jennifer Liu", "Dr. Yuki Tanaka"],
    ["Dr. Priya Sharma", "Prof. Thomas Wilson", "Dr. Elena Kowalski"],
    ["Prof. Raj Patel", "Dr. Sophie Martin", "Dr. Alex Johnson", "Dr. Nina Volkov"],
  ]

  return paperTemplates.slice(0, 3 + Math.floor(Math.random() * 3)).map((template, index) => {
    const publishedDate = new Date(
      currentYear - Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )
    const updatedDate = new Date(publishedDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Up to 30 days later

    const arxivId = `${publishedDate.getFullYear().toString().slice(-2)}${(publishedDate.getMonth() + 1).toString().padStart(2, "0")}.${(Math.floor(Math.random() * 9000) + 1000).toString()}`

    return {
      id: arxivId,
      title: template.titleTemplate.replace(/{query}/g, query),
      authors: authorPools[index % authorPools.length],
      summary: template.summaryTemplate.replace(/{query}/g, query),
      published: publishedDate.toISOString(),
      updated: updatedDate.toISOString(),
      categories: categories,
      pdfUrl: `https://arxiv.org/pdf/${arxivId}.pdf`,
      primaryCategory: categories[0],
    }
  })
}

function getRelevantCategories(query: string): string[] {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("machine learning") || lowerQuery.includes("ml")) {
    return ["cs.LG", "stat.ML", "cs.AI"]
  }
  if (lowerQuery.includes("computer vision") || lowerQuery.includes("cv") || lowerQuery.includes("image")) {
    return ["cs.CV", "cs.AI", "eess.IV"]
  }
  if (lowerQuery.includes("natural language") || lowerQuery.includes("nlp") || lowerQuery.includes("text")) {
    return ["cs.CL", "cs.AI", "cs.LG"]
  }
  if (lowerQuery.includes("robotics") || lowerQuery.includes("robot")) {
    return ["cs.RO", "cs.AI", "cs.SY"]
  }
  if (lowerQuery.includes("security") || lowerQuery.includes("crypto")) {
    return ["cs.CR", "cs.IT", "cs.DS"]
  }
  if (lowerQuery.includes("quantum")) {
    return ["quant-ph", "cs.ET", "physics.comp-ph"]
  }
  if (lowerQuery.includes("neural") || lowerQuery.includes("deep learning")) {
    return ["cs.LG", "cs.NE", "stat.ML"]
  }

  // Default categories for general CS topics
  return ["cs.AI", "cs.LG", "cs.CL"]
}

export async function importArxivPaper(paperId: string): Promise<Document> {
  try {
    // Simulate downloading and processing ArXiv paper
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate realistic document data for imported paper
    const mockPaper = generateImportedPaperData(paperId)

    const document: Document = {
      id: String(nextId++),
      filename: `arxiv-${paperId}.pdf`,
      title: mockPaper.title,
      authors: mockPaper.authors,
      uploadedAt: new Date().toISOString(),
      pageCount: mockPaper.pageCount,
      fileSize: mockPaper.fileSize,
      vectorized: true,
      sections: mockPaper.sections,
      tables: mockPaper.tables,
      figures: mockPaper.figures,
      equations: mockPaper.equations,
      references: mockPaper.references,
      abstract: mockPaper.abstract,
      keywords: mockPaper.keywords,
      processingStatus: "completed",
    }

    documents.push(document)
    revalidatePath("/")
    return document
  } catch (error) {
    console.error("Error importing ArXiv paper:", error)
    throw error
  }
}

function generateImportedPaperData(paperId: string) {
  const titles = [
    "Attention Is All You Need: Transformer Networks for Sequence Modeling",
    "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    "GPT-3: Language Models are Few-Shot Learners",
    "ResNet: Deep Residual Learning for Image Recognition",
    "YOLO: Real-Time Object Detection with Deep Neural Networks",
    "GAN: Generative Adversarial Networks for Image Synthesis",
    "AlphaGo: Mastering the Game of Go with Deep Neural Networks",
    "Word2Vec: Efficient Estimation of Word Representations in Vector Space",
  ]

  const authorSets = [
    ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"],
    ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
    ["Tom B. Brown", "Benjamin Mann", "Nick Ryder", "Melanie Subbiah"],
    ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
    ["Joseph Redmon", "Santosh Divvala", "Ross Girshick", "Ali Farhadi"],
  ]

  const abstracts = [
    "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
    "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
    "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples.",
  ]

  const keywords = [
    ["transformer", "attention mechanism", "neural networks", "sequence modeling"],
    ["BERT", "bidirectional", "pre-training", "language understanding"],
    ["GPT", "few-shot learning", "language models", "natural language processing"],
    ["ResNet", "residual learning", "computer vision", "image recognition"],
    ["object detection", "real-time", "YOLO", "computer vision"],
  ]

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    authors: authorSets[Math.floor(Math.random() * authorSets.length)],
    abstract: abstracts[Math.floor(Math.random() * abstracts.length)],
    keywords: keywords[Math.floor(Math.random() * keywords.length)],
    pageCount: Math.floor(Math.random() * 20) + 8, // 8-27 pages
    fileSize: Math.floor(Math.random() * 8000000) + 2000000, // 2-10 MB
    sections: Math.floor(Math.random() * 6) + 5, // 5-10 sections
    tables: Math.floor(Math.random() * 4) + 2, // 2-5 tables
    figures: Math.floor(Math.random() * 8) + 4, // 4-11 figures
    equations: Math.floor(Math.random() * 20) + 10, // 10-29 equations
    references: Math.floor(Math.random() * 60) + 30, // 30-89 references
  }
}
