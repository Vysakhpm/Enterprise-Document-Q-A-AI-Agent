"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Trash2, Eye, Search, BarChart3, ImageIcon, BookOpen, Calendar } from "lucide-react"
import { getDocuments, deleteDocument } from "@/lib/actions"
import type { Document } from "@/lib/types"

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getDocuments()
        setDocuments(docs)
        setFilteredDocuments(docs)
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDocuments(documents)
    } else {
      const filtered = documents.filter(
        (doc) =>
          doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.authors?.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredDocuments(filtered)
    }
  }, [searchQuery, documents])

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id)
      const updatedDocs = documents.filter((doc) => doc.id !== id)
      setDocuments(updatedDocs)
      setFilteredDocuments(
        updatedDocs.filter(
          (doc) =>
            searchQuery.trim() === "" ||
            doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.authors?.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase())),
        ),
      )
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading documents...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
        <p className="text-gray-600 mb-4">Upload PDF documents to get started with AI-powered analysis</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{filteredDocuments.length} documents</span>
          <span>•</span>
          <span>{documents.reduce((acc, doc) => acc + doc.pageCount, 0)} total pages</span>
        </div>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-xs text-gray-600">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{documents.reduce((acc, doc) => acc + doc.pageCount, 0)}</p>
                <p className="text-xs text-gray-600">Total Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{documents.reduce((acc, doc) => acc + (doc.tables || 0), 0)}</p>
                <p className="text-xs text-gray-600">Tables</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{documents.reduce((acc, doc) => acc + (doc.figures || 0), 0)}</p>
                <p className="text-xs text-gray-600">Figures</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{doc.title || doc.filename}</p>
                        {doc.title && <p className="text-xs text-gray-500 truncate">{doc.filename}</p>}
                        {doc.authors && doc.authors.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            {doc.authors.slice(0, 2).join(", ")}
                            {doc.authors.length > 2 && " et al."}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                      <div>{formatFileSize(doc.fileSize)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {doc.pageCount} pages
                      </Badge>
                      {doc.sections && (
                        <Badge variant="secondary" className="text-xs">
                          {doc.sections} sections
                        </Badge>
                      )}
                      {doc.tables && doc.tables > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {doc.tables} tables
                        </Badge>
                      )}
                      {doc.figures && doc.figures > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {doc.figures} figures
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={doc.vectorized ? "default" : "secondary"}>
                      {doc.vectorized ? "Processed" : "Processing"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" title="View Document">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        title="Delete Document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
