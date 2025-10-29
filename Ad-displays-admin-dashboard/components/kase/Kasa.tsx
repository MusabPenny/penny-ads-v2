"use client";
import { DashboardHeader } from "@/components/dashboard-header";
import { DeviceSidebar } from "@/components/device-sidebar";
import { ImageUploadSection } from "@/components/image-upload-section";
import { useState } from "react";
import type { ImageData } from "@/lib/types/interfaces";
import { ImageGallery } from "../image-gallery";
import { posImageUploadedSocket } from "@/socket";

export default function Kase(props: { initialImages: ImageData[] }) {
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [images, setImages] = useState<ImageData[]>(props.initialImages);

  const handleImageUpload = async (newImages: ImageData[]) => {
    posImageUploadedSocket();
    setImages((prev) => [...prev, ...newImages]);
  };

  const deleteImage = async (id: string) => {
    console.log("Deleting image with id:", id);
    // Send DELETE request to server
    const response = await fetch(`/api/images/${id}`, { method: "DELETE" });
    const success = response.ok;

    if (!success) {
      console.error("Failed to delete image with id:", id);
      return;
    }

    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const updateImageEndDate = async (id: string, date: Date | undefined) => {
    const success = await fetch(`/api/images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endDate: date ? date.toISOString() : null }),
    }).then((res) => res.ok);
    if (!success) return;
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, endDate: date } : img))
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DeviceSidebar
        onDeviceSelect={setSelectedDevice}
        selectedDeviceId={selectedDevice}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          selectedDevice={selectedDevice}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ImageUploadSection
                posLocation={true}
                onImageUpload={handleImageUpload}
              />
            </div>
            <div className="lg:col-span-2">
              <ImageGallery
                images={images}
                selectedDevice={selectedDevice}
                viewMode={viewMode}
                onDeleteImage={deleteImage}
                onUpdateImageEndDate={updateImageEndDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
