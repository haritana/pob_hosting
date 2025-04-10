
const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");

const app = express();
const port = 80;

const allowedIPs = [
  "192.168.1.8",
  "127.0.0.1",
];

app.use((req, res, next) => {
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(`Request dari IP: ${clientIP}`);

  if (!allowedIPs.includes(clientIP.replace("::ffff:", ""))) {
    return res.status(403).send('<h1>404 Not Found</h1><p>Halaman yang Anda cari tidak ditemukan.</p>');
  }

  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin request:", origin);

    if (!origin || allowedIPs.includes(origin.replace("http://", "").split(":")[0])) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "apps/pob")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "apps/pob/index.html"));
});

const server = http.createServer(app);
server.listen(port, "0.0.0.0", () => {
  console.log(`Hosting berjalan di localhost:${port}`);
});
