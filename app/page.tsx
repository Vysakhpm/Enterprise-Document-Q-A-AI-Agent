import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import { DocumentList } from "@/components/document-list"
import { ChatInterface } from "@/components/chat-interface"
import { ArxivSearch } from "@/components/arxiv-search"
import { DocumentAnalytics } from "@/components/document-analytics"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Enterprise Document Q&A Agent</h1>
        <p className="text-lg text-muted-foreground">
          Advanced AI-powered document analysis with multi-modal LLM capabilities
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="upload">Upload & Process</TabsTrigger>
          <TabsTrigger value="documents">Document Library</TabsTrigger>
          <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          <TabsTrigger value="arxiv">ArXiv Search</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Ingestion Pipeline</CardTitle>
              <CardDescription>
                Upload PDF documents for advanced AI-powered analysis with structure extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Manage and analyze your processed documents</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Document Assistant</CardTitle>
              <CardDescription>
                Ask questions, get summaries, and extract specific information from your documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arxiv">
          <Card>
            <CardHeader>
              <CardTitle>ArXiv Research Integration</CardTitle>
              <CardDescription>Search and import academic papers directly from ArXiv</CardDescription>
            </CardHeader>
            <CardContent>
              <ArxivSearch />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Document Analytics</CardTitle>
              <CardDescription>Insights and statistics about your document collection</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
