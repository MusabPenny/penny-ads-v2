import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { fetchPosImages, fetchAllImagesForDisplays } from "./queries";

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("New client connected: ", socket.id);
  const allImages = await fetchAllImagesForDisplays();
  socket.emit("imagesOnConnection", allImages);

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });

  socket.on("getPosImages", async () => {
    const imagesUrls = await fetchPosImages();

    socket.emit("posImages", imagesUrls);
  });

  //event for POS image upload
  socket.on("imageUploaded", async () => {
    console.log("Image uploaded event received");
    //socket.emit("newImages", "prvi put");
  });
});

app.get("/", async (req, res) => {
  const imageUrls = await fetchPosImages();
  res.send(imageUrls);
});

server.listen(7010, () => {
  console.log("Server is running on http://localhost:7010");
});
