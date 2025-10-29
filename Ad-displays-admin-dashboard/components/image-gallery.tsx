"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  CalendarIcon,
  Trash2,
  ImageIcon,
  MapPin,
  Clock,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageData } from "@/lib/types/interfaces";

interface ImageGroup {
  groupName: string;
  images: ImageData[];
  isExpanded: boolean;
}

interface ImageGalleryProps {
  images: ImageData[];
  selectedDevice: string;
  viewMode: "grid" | "list";
  onDeleteImage: (id: string) => void;
  onUpdateImageEndDate: (id: string, date: Date | undefined) => void;
}

export function ImageGallery({
  images,
  selectedDevice,
  viewMode,
  onDeleteImage,
  onUpdateImageEndDate,
}: ImageGalleryProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const getBaseName = (filename: string): string => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    return nameWithoutExt.replace(/-\d+$/, "").replace(/_\d+$/, "");
  };

  const groupedImages = useMemo(() => {
    const filtered = selectedDevice
      ? images.filter((img) => img.location === selectedDevice)
      : images;

    const groups: Record<string, ImageData[]> = {};

    filtered.forEach((image) => {
      const groupKey = image.groupName || image.name;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(image);
    });

    const result: (ImageData | ImageGroup)[] = [];

    Object.entries(groups).forEach(([groupKey, groupImages]) => {
      if (groupImages.length === 1 && !groupImages[0].groupName) {
        result.push(groupImages[0]);
      } else {
        result.push({
          groupName: groupKey,
          images: groupImages,
          isExpanded: expandedGroups.has(groupKey),
        });
      }
    });

    return result;
  }, [images, selectedDevice, expandedGroups]);

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const isImageGroup = (item: ImageData | ImageGroup): item is ImageGroup => {
    return "groupName" in item;
  };

  const renderImageCard = (image: ImageData) => (
    <div
      key={image.id}
      className={cn(
        "group border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all",
        viewMode === "list" && "flex items-center gap-4 p-4"
      )}
    >
      <div
        className={cn(
          "relative",
          viewMode === "grid" ? "aspect-video" : "w-24 h-16 flex-shrink-0"
        )}
      >
        {image.type === "video" ? (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <video
              src={image.url}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
              onClick={(e) => e.stopPropagation()}
            >
              <source src={image.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <img
            src={image.url || "/placeholder.svg"}
            alt={image.name}
            className="w-full h-full object-cover"
          />
        )}
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDeleteImage(image.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className={cn("p-4 flex-1", viewMode === "list" && "p-0")}>
        <h3 className="font-semibold text-foreground mb-2 text-balance">
          {image.name}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <Badge variant="secondary">{image.location}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Uploaded {format(image.uploadDate, "MMM dd, yyyy")}
          </div>
          <div className="text-sm text-muted-foreground">
            Size: {image.size}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Label className="text-xs">End Date:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs",
                    !image.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {image.endDate ? format(image.endDate, "MMM dd") : "Set date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={image.endDate}
                  onSelect={(date) => onUpdateImageEndDate(image.id, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            {selectedDevice ? "Device Media" : "Active Media"} ({images.length})
          </CardTitle>
          {selectedDevice && (
            <Button variant="outline" size="sm" onClick={() => {}}>
              Show All Media
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {groupedImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {selectedDevice
                ? "No media for this device"
                : "No media uploaded yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedImages.map((item, index) => {
              if (isImageGroup(item)) {
                return (
                  <div
                    key={item.groupName}
                    className="border border-border border-gray-600 rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-3 p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleGroup(item.groupName)}
                    >
                      {item.isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      {item.isExpanded ? (
                        <FolderOpen className="h-5 w-5 text-primary" />
                      ) : (
                        <Folder className="h-5 w-5 text-primary" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.groupName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.images?.length} files
                        </p>
                      </div>
                      <Badge variant="secondary">{item.images?.length}</Badge>
                    </div>

                    {item.isExpanded && (
                      <div
                        className={cn(
                          "p-4 border-t border-border",
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                            : "space-y-4"
                        )}
                      >
                        {item.images.map((image) => renderImageCard(image))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return renderImageCard(item as ImageData);
              }
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
