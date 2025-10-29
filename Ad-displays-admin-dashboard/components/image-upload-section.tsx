"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, ImageIcon, Video, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client } from "@/lib/types/interfaces";
import type { ImageData } from "@/lib/types/interfaces";

interface ImageUploadSectionProps {
  locations?: Client[];
  posLocation?: boolean;
  onImageUpload: (images: ImageData[]) => void;
}

export function ImageUploadSection({
  locations,
  onImageUpload,
  posLocation,
}: ImageUploadSectionProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>();
  const [dragActive, setDragActive] = useState(false);
  const [groupName, setGroupName] = useState<string>("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPendingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: FileList) => {
    setPendingFiles(Array.from(files));
  };

  const handleSubmitUpload = async () => {
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();

      pendingFiles.forEach((file) => {
        formData.append("files", file);
      });

      if (groupName) formData.append("groupName", groupName);
      if (selectedLocation)
        formData.append("selectedLocation", selectedLocation);
      if (endDate) formData.append("endDate", endDate.toISOString());
      if (posLocation) formData.append("posLocation", String(posLocation));

      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });


      if (response.ok) {
        const result = await response.json();
        onImageUpload(result.images);

        // Reset form
        setPendingFiles([]);
        setGroupName("");
        setSelectedLocation("");
        setEndDate(undefined);
      } else {
        const error = await response.json();
        console.error("Upload failed:", error.error);
        alert("Upload failed: " + error.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Media
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop images or videos here, or click to select
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="sr-only"
            id="file-upload"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <Label htmlFor="file-upload">
            <Button
              variant="outline"
              className="cursor-pointer bg-transparent"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </Label>
        </div>

        {pendingFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Selected Files ({pendingFiles.length})
            </Label>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {pendingFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded"
                >
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <Video className="h-4 w-4 text-primary" />
                  )}
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {pendingFiles.length > 1 && (
            <div>
              <Label htmlFor="groupName" className="text-sm font-medium">
                Catalog Name (Optional)
              </Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., bazeni-katalog, marketi katalog..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Files will be named: {groupName || "filename"}-1,{" "}
                {groupName || "filename"}-2, etc.
              </p>
            </div>
          )}

          {!posLocation && (
            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Display Location
              </Label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations &&
                    locations.length > 0 &&
                    locations.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.client_location || ""}
                      >
                        {location.client_location}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "No end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={handleSubmitUpload}
            disabled={pendingFiles.length === 0 || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Upload {pendingFiles.length}{" "}
                {pendingFiles.length === 1 ? "File" : "Files"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
