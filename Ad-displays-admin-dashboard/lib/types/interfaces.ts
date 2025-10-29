export interface Client {
  id: number;
  mac_address: string;
  ip_address: string | null;
  connecting_timestamp: Date | null;
  client_location: string | null;
  socketId: string | null;
  connected: boolean | null;
  enableWakeOnLan: boolean | null;
}

export interface Image {
  id: number;
  filename: string | null;
  imageUrl: string | null;
  isActive: boolean | null;
  updatedAt: Date | null;
  isImageForAllLocations: boolean | null;
  expirationDate: Date | null;
}

export interface images_clients {
  image_id: number;
  client_id: number;
  isClientImageActive: boolean | null;
  image: Image;
  client: Client;
}

export interface ImageData {
  id: string
  name: string
  url: string
  location: string
  uploadDate: Date
  endDate?: Date
  size: string
  type: "image" | "video"
  groupName?: string
  imageUrl: string
}
