"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, Download, Eye } from "lucide-react"
import { uploadFile, getFileUrl, deleteFile } from "@/lib/supabase"

interface FileUploadProps {
  projectId?: string
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxSize?: number // in MB
}

interface UploadedFile {
  id: string
  name: string
  path: string
  size: number
  type: string
  url: string
  isMainFile: boolean
}

export function FileUpload({
  projectId,
  onFilesChange,
  maxFiles = 10,
  acceptedTypes = [".zip", ".rar", ".tar.gz", ".pdf", ".doc", ".docx"],
  maxSize = 100,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = async (fileList: File[]) => {
    if (files.length + fileList.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = fileList.map(async (file, index) => {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize}MB`)
        }

        // Validate file type
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
        if (!acceptedTypes.includes(fileExtension)) {
          throw new Error(`File type ${fileExtension} is not allowed`)
        }

        const timestamp = Date.now()
        const fileName = `${timestamp}-${file.name}`
        const filePath = projectId ? `${projectId}/${fileName}` : `temp/${fileName}`

        // Upload file to Supabase Storage
        const uploadData = await uploadFile(file, filePath)
        const fileUrl = getFileUrl(uploadData.path)

        // Update progress
        setUploadProgress(((index + 1) / fileList.length) * 100)

        return {
          id: `temp-${timestamp}-${index}`,
          name: file.name,
          path: uploadData.path,
          size: file.size,
          type: file.type,
          url: fileUrl,
          isMainFile: index === 0 && files.length === 0,
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      const newFiles = [...files, ...uploadedFiles]
      setFiles(newFiles)
      onFilesChange(newFiles)
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFile = async (fileToRemove: UploadedFile) => {
    try {
      await deleteFile(fileToRemove.path)
      const newFiles = files.filter((file) => file.id !== fileToRemove.id)
      setFiles(newFiles)
      onFilesChange(newFiles)
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete file")
    }
  }

  const setMainFile = (fileId: string) => {
    const newFiles = files.map((file) => ({
      ...file,
      isMainFile: file.id === fileId,
    }))
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Upload Project Files</h3>
        <p className="text-gray-400 mb-4">Drag and drop files here, or click to select files</p>
        <p className="text-sm text-gray-500 mb-4">
          Accepted formats: {acceptedTypes.join(", ")} • Max size: {maxSize}MB per file
        </p>

        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
          disabled={uploading || files.length >= maxFiles}
          className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Files
        </Button>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <Card className="glass-card border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">Uploading files...</span>
              <span className="text-gray-400 text-sm">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          {files.map((file) => (
            <Card key={file.id} className="glass-card border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                    </div>
                    {file.isMainFile && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Main File</Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(file.url, "_blank")}
                      className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = file.url
                        link.download = file.name
                        link.click()
                      }}
                      className="border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    {!file.isMainFile && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMainFile(file.id)}
                        className="border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-400"
                      >
                        Set Main
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile(file)}
                      className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
