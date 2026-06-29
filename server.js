// Basic Node.js/Express backend scaffold
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Add API routes here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
