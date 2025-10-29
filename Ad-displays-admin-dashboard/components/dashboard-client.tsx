"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { DeviceSidebar } from "@/components/device-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { ImageUploadSection } from "@/components/image-upload-section";
import { ImageGallery } from "@/components/image-gallery";
import { Loader2 } from "lucide-react";
import type { Client } from "@/lib/types/interfaces";
import { getSocketID } from "../socket";
import type { ImageData } from "@/lib/types/interfaces";

interface DashboardClientProps {
  initialImages: ImageData[];
  locations: Client[];
}

export function DashboardClient({
  initialImages,
  locations,
}: DashboardClientProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleImageUpload = (newImages: ImageData[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const deleteImage = async (id: string) => {
    const success = await fetch(`/api/images/${id}`, { method: "DELETE" }).then(
      (res) => res.ok
    );
    if (success) setImages((prev) => prev.filter((img) => img.id !== id));
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

  useEffect(() => {
    const fetchSocketID = async () => {
      const id = await getSocketID();
      console.log("Socket ID:", id);
    };

    //fetchSocketID();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
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
                locations={locations}
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
    </>
  );
}
