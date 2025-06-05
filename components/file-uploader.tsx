"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, File, CheckCircle, AlertCircle, FileText, ImageIcon, BarChart3 } from "lucide-react"
import { uploadDocument } from "@/lib/actions"

interface ProcessingStatus {
  stage: string
  progress: number
  details: string
}

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const [uploadResults, setUploadResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter((file) => file.type === "application/pdf")
      setFiles(selectedFiles)
      setError(null)
      setUploadResults([])
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)
    setUploadResults([])

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProcessingStatus({
          stage: `Processing ${file.name}`,
          progress: (i / files.length) * 100,
          details: "Uploading and analyzing document structure...",
        })

        const formData = new FormData()
        formData.append("file", file)

        // Simulate detailed processing stages
        const stages = [
          "Uploading document...",
          "Extracting text content...",
          "Analyzing document structure...",
          "Identifying sections and headings...",
          "Processing tables and figures...",
          "Extracting equations and formulas...",
          "Creating vector embeddings...",
          "Finalizing document analysis...",
        ]

        for (let j = 0; j < stages.length; j++) {
          setProcessingStatus({
            stage: `Processing ${file.name}`,
            progress: ((i + (j + 1) / stages.length) / files.length) * 100,
            details: stages[j],
          })
          await new Promise((resolve) => setTimeout(resolve, 500))
        }

        const result = await uploadDocument(formData)
        setUploadResults((prev) => [...prev, result])
      }

      setProcessingStatus({
        stage: "Complete",
        progress: 100,
        details: "All documents processed successfully!",
      })

      // Reset after success
      setTimeout(() => {
        setFiles([])
        setProcessingStatus(null)
      }, 3000)
    } catch (error) {
      setError("Error processing documents. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">PDF files only (max 50MB per file)</p>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="hidden"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
          <div className="grid gap-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Badge variant="secondary">PDF</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {processingStatus && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{processingStatus.stage}</h3>
            <span className="text-sm text-gray-500">{Math.round(processingStatus.progress)}%</span>
          </div>
          <Progress value={processingStatus.progress} className="h-2" />
          <p className="text-xs text-gray-600">{processingStatus.details}</p>
        </div>
      )}

      {uploadResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-green-600">Processing Results</h3>
          {uploadResults.map((result, index) => (
            <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{result.filename}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{result.pageCount} pages</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  <span>{result.sections} sections</span>
                </div>
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  <span>{result.figures} figures</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  <span>{result.tables} tables</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleUpload} disabled={files.length === 0 || uploading} className="w-full" size="lg">
        {uploading ? "Processing Documents..." : `Process ${files.length} Document${files.length !== 1 ? "s" : ""}`}
      </Button>
    </div>
  )
}
