"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Monitor, Tv, Smartphone, Tablet, ArrowRight, Settings, Copy, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface ImageData {
  id: string
  name: string
  url: string
  location: string
  uploadDate: Date
  endDate?: Date
  size: string
}

interface Device {
  id: string
  name: string
  type: "monitor" | "tv" | "tablet" | "smartphone"
  location: string
  status: "online" | "offline" | "maintenance"
}

const mockDevices: Device[] = [
  { id: "1", name: "Main Lobby Display", type: "monitor", location: "Main Lobby", status: "online" },
  { id: "2", name: "Conference Room A", type: "tv", location: "Conference Room A", status: "online" },
  { id: "3", name: "Reception Area", type: "tablet", location: "Reception", status: "offline" },
  { id: "4", name: "Cafeteria Screen", type: "monitor", location: "Cafeteria", status: "maintenance" },
  { id: "5", name: "Elevator Display", type: "smartphone", location: "Elevator", status: "online" },
]

const getDeviceIcon = (type: Device["type"]) => {
  switch (type) {
    case "monitor":
      return Monitor
    case "tv":
      return Tv
    case "tablet":
      return Tablet
    case "smartphone":
      return Smartphone
    default:
      return Monitor
  }
}

interface DeviceImageManagerProps {
  images: ImageData[]
  onMoveImage: (imageId: string, newLocation: string) => void
  onDeleteImage: (imageId: string) => void
  onDuplicateImage: (imageId: string, targetLocation: string) => void
}

export function DeviceImageManager({ images, onMoveImage, onDeleteImage, onDuplicateImage }: DeviceImageManagerProps) {
  const [selectedSourceDevice, setSelectedSourceDevice] = useState<string>("")
  const [selectedTargetDevice, setSelectedTargetDevice] = useState<string>("")

  const getImagesForDevice = (deviceName: string) => {
    return images.filter((img) => img.location === deviceName)
  }

  const handleBulkMove = () => {
    if (!selectedSourceDevice || !selectedTargetDevice) return

    const sourceDevice = mockDevices.find((d) => d.id === selectedSourceDevice)
    const targetDevice = mockDevices.find((d) => d.id === selectedTargetDevice)

    if (!sourceDevice || !targetDevice) return

    const imagesToMove = getImagesForDevice(sourceDevice.name)
    imagesToMove.forEach((image) => {
      onMoveImage(image.id, targetDevice.name)
    })

    setSelectedSourceDevice("")
    setSelectedTargetDevice("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Manage Device Images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Device-Specific Image Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bulk Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">From Device</label>
                  <Select value={selectedSourceDevice} onValueChange={setSelectedSourceDevice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source device" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDevices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name} ({getImagesForDevice(device.name).length} images)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground mt-6" />

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">To Device</label>
                  <Select value={selectedTargetDevice} onValueChange={setSelectedTargetDevice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target device" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDevices
                        .filter((d) => d.id !== selectedSourceDevice)
                        .map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleBulkMove}
                  disabled={!selectedSourceDevice || !selectedTargetDevice}
                  className="mt-6"
                >
                  Move All Images
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Device Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDevices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type)
              const deviceImages = getImagesForDevice(device.name)

              return (
                <Card key={device.id} className="h-fit">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <DeviceIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{device.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{deviceImages.length} images</p>
                      </div>
                      <Badge variant={device.status === "online" ? "default" : "secondary"}>{device.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ScrollArea className="h-48">
                      {deviceImages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">No images assigned</div>
                      ) : (
                        <div className="space-y-2">
                          {deviceImages.map((image) => (
                            <div
                              key={image.id}
                              className="group flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                            >
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt={image.name}
                                className="w-12 h-8 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{image.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {image.endDate ? `Until ${format(image.endDate, "MMM dd")}` : "No end date"}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Duplicate Image</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <p className="text-sm text-muted-foreground">
                                        Duplicate "{image.name}" to another device:
                                      </p>
                                      <Select
                                        onValueChange={(value) => {
                                          const targetDevice = mockDevices.find((d) => d.id === value)
                                          if (targetDevice) {
                                            onDuplicateImage(image.id, targetDevice.name)
                                          }
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select target device" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {mockDevices
                                            .filter((d) => d.name !== device.name)
                                            .map((targetDevice) => (
                                              <SelectItem key={targetDevice.id} value={targetDevice.id}>
                                                {targetDevice.name}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={() => onDeleteImage(image.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
