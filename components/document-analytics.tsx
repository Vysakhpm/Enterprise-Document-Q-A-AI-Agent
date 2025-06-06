"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, FileText, TrendingUp, Users, BookOpen } from "lucide-react"
import { getDocuments } from "@/lib/actions"
import type { Document } from "@/lib/types"

export function DocumentAnalytics() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getDocuments()
        setDocuments(docs)
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Analytics Available</h3>
        <p className="text-gray-600">Upload documents to see detailed analytics and insights</p>
      </div>
    )
  }

  const totalPages = documents.reduce((acc, doc) => acc + doc.pageCount, 0)
  const totalSize = documents.reduce((acc, doc) => acc + doc.fileSize, 0)
  const totalTables = documents.reduce((acc, doc) => acc + (doc.tables || 0), 0)
  const totalFigures = documents.reduce((acc, doc) => acc + (doc.figures || 0), 0)
  const totalSections = documents.reduce((acc, doc) => acc + (doc.sections || 0), 0)
  const processedDocs = documents.filter((doc) => doc.vectorized).length
  const processingRate = (processedDocs / documents.length) * 100

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getDocumentsByMonth = () => {
    const monthCounts: { [key: string]: number } = {}
    documents.forEach((doc) => {
      const month = new Date(doc.uploadedAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })
      monthCounts[month] = (monthCounts[month] || 0) + 1
    })
    return Object.entries(monthCounts).slice(-6)
  }

  const getTopAuthors = () => {
    const authorCounts: { [key: string]: number } = {}
    documents.forEach((doc) => {
      if (doc.authors) {
        doc.authors.forEach((author) => {
          authorCounts[author] = (authorCounts[author] || 0) + 1
        })
      }
    })
    return Object.entries(authorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  const monthlyData = getDocumentsByMonth()
  const topAuthors = getTopAuthors()

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalPages}</p>
                <p className="text-sm text-gray-600">Total Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{totalTables}</p>
                <p className="text-sm text-gray-600">Tables Extracted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{totalFigures}</p>
                <p className="text-sm text-gray-600">Figures Identified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Status */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Status</CardTitle>
          <CardDescription>Document analysis and vectorization progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Documents Processed</span>
            <span className="text-sm text-gray-600">
              {processedDocs} of {documents.length}
            </span>
          </div>
          <Progress value={processingRate} className="h-2" />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{Math.round(processingRate)}% Complete</span>
            <span>{documents.length - processedDocs} Pending</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Content Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Content Analysis</CardTitle>
            <CardDescription>Breakdown of extracted content elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sections</span>
                <Badge variant="secondary">{totalSections}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tables</span>
                <Badge variant="secondary">{totalTables}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Figures</span>
                <Badge variant="secondary">{totalFigures}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Pages</span>
                <Badge variant="secondary">{Math.round(totalPages / documents.length)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>Document storage and size analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{formatFileSize(totalSize)}</p>
              <p className="text-sm text-gray-600">Total Storage Used</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average File Size</span>
                <span>{formatFileSize(totalSize / documents.length)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Largest Document</span>
                <span>{formatFileSize(Math.max(...documents.map((d) => d.fileSize)))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Smallest Document</span>
                <span>{formatFileSize(Math.min(...documents.map((d) => d.fileSize)))}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Timeline */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Timeline</CardTitle>
            <CardDescription>Document uploads over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map(([month, count]) => (
                <div key={month} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600">{month}</div>
                  <div className="flex-1">
                    <Progress value={(count / Math.max(...monthlyData.map(([, c]) => c))) * 100} className="h-2" />
                  </div>
                  <div className="w-8 text-sm font-medium">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Authors */}
      {topAuthors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Authors</CardTitle>
            <CardDescription>Most frequently appearing authors in your document collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAuthors.map(([author, count]) => (
                <div key={author} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{author}</span>
                  </div>
                  <Badge variant="secondary">{count} papers</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
