"use client";

import { io } from "socket.io-client";

export const socket = io(`http://${process.env.NEXT_PUBLIC_BASE_URL}`);

socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

export const posImageUploadedSocket = () => {
  console.log("Emitting imageUploaded");
  socket.emit("imageUploaded", "new image uploaded");
}


export async function getSocketID() {
  return socket.id;
}
