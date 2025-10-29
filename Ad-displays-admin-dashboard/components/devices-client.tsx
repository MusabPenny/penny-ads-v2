"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { DeviceSidebar } from "@/components/device-sidebar";
import { Client } from "@/lib/types/interfaces";
import {
  Monitor,
  Tv,
  Smartphone,
  Tablet,
  Search,
  Plus,
  Settings,
  Wifi,
  WifiOff,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface DevicesClientProps {
  clients: Client[];
}

const getDeviceIcon = () => {
  return Monitor;
};

const getStatusBadgeVariant = (status: Client["connected"]) => {
  return status ? "default" : "outline";
};

export function DevicesClient({ clients }: DevicesClientProps) {
  const [devices, setDevices] = useState<Client[]>(clients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  const filteredDevices = devices.filter(
    (device) =>
      (device.client_location &&
        device.client_location
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      "Unknown"
  );

  return (
    <div className="min-h-screen bg-background flex">
      <DeviceSidebar
        onDeviceSelect={setSelectedDevice}
        selectedDeviceId={selectedDevice}
      />

      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Device Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Configure and monitor display devices
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevices.map((device) => {
                const DeviceIcon = getDeviceIcon();

                return (
                  <Card
                    key={device.id}
                    className="hover:shadow-lg transition-all"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <DeviceIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {device.client_location}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {device.mac_address}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={getStatusBadgeVariant(device.connected)}
                        >
                          {device.connected ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">IP Address</p>
                          <p className="font-mono">{device.ip_address}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Seen</p>
                          <p>
                            {device.connecting_timestamp
                              ? device.connecting_timestamp instanceof Date
                                ? device.connecting_timestamp.toLocaleString()
                                : device.connecting_timestamp
                              : "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Socket ID</p>
                          <p>{device.socketId ? device.socketId : "Unknown"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
