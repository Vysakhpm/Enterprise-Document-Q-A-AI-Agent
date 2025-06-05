"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Download, ExternalLink, Loader2, Calendar, Users, FileText, CheckCircle } from "lucide-react"
import { searchArxiv, importArxivPaper } from "@/lib/actions"
import type { ArxivPaper } from "@/lib/types"

export function ArxivSearch() {
  const [query, setQuery] = useState("")
  const [papers, setPapers] = useState<ArxivPaper[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState<string | null>(null)
  const [importedPapers, setImportedPapers] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    try {
      const results = await searchArxiv(query)
      setPapers(results)
      if (results.length === 0) {
        setError("No papers found matching your query. Try different keywords.")
      }
    } catch (error) {
      console.error("Error searching ArXiv:", error)
      setError("Failed to search ArXiv. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (paper: ArxivPaper) => {
    setImporting(paper.id)
    try {
      await importArxivPaper(paper.id)
      setImportedPapers((prev) => new Set([...prev, paper.id]))
    } catch (error) {
      console.error("Error importing paper:", error)
      setError("Failed to import paper. Please try again.")
    } finally {
      setImporting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ArXiv papers (e.g., 'machine learning', 'neural networks', 'computer vision')..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading || !query.trim()} size="lg">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </Button>
      </div>

      {/* Search Suggestions */}
      {!loading && papers.length === 0 && !error && (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Search Academic Papers</h3>
          <p className="text-gray-600 mb-4">Find and import research papers from ArXiv</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["machine learning", "computer vision", "natural language processing", "deep learning"].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(term)
                  handleSearch()
                }}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-600">Searching ArXiv database...</p>
          <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
        </div>
      )}

      {/* Search Results */}
      {papers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Search Results ({papers.length})</h3>
            <Badge variant="secondary">{query}</Badge>
          </div>

          <div className="grid gap-6">
            {papers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg leading-tight">{paper.title}</CardTitle>
                    {importedPapers.has(paper.id) && (
                      <Badge variant="default" className="flex-shrink-0">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Imported
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {paper.categories.slice(0, 3).map((category, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    {paper.categories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{paper.categories.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{paper.authors.slice(0, 2).join(", ")}</span>
                      {paper.authors.length > 2 && <span> et al.</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(paper.published)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{paper.summary}</p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>ArXiv ID: {paper.id}</span>
                    {paper.updated !== paper.published && <span>• Updated: {formatDate(paper.updated)}</span>}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-4">
                  <Button variant="outline" size="sm" onClick={() => window.open(paper.pdfUrl, "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View PDF
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleImport(paper)}
                    disabled={importing === paper.id || importedPapers.has(paper.id)}
                  >
                    {importing === paper.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Importing...
                      </>
                    ) : importedPapers.has(paper.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Imported
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Import to Library
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
