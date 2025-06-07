"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { X, ImageIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void
  maxImages?: number
}

export function ImageUpload({ onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const handleFiles = (fileList: File[]) => {
    const imageFiles = fileList.filter((file) => file.type.startsWith("image/"))
    const remainingSlots = maxImages - images.length
    const newImages = imageFiles.slice(0, remainingSlots)

    if (newImages.length > 0) {
      setUploading(true)
      // Simulate upload delay
      setTimeout(() => {
        const updatedImages = [...images, ...newImages]
        setImages(updatedImages)
        onImagesChange(updatedImages)
        setUploading(false)
      }, 1000)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-blue-500 hover:bg-blue-500/5"
        } ${uploading ? "pointer-events-none opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />

        <div className={`transition-all duration-300 ${uploading ? "scale-110" : ""}`}>
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-400">Uploading images...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">
                {images.length >= maxImages
                  ? `Maximum ${maxImages} images reached`
                  : "Click to upload images or drag and drop"}
              </p>
              <p className="text-gray-500 text-sm">
                PNG, JPG, GIF up to 10MB each ({images.length}/{maxImages})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-all duration-300 ease-out opacity-100 translate-y-0">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group transition-all duration-300 ease-out opacity-100 scale-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
