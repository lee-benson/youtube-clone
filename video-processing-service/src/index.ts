import express from "express";
import ffmpeg from "fluent-ffmpeg";


const app = express();
app.use(express.json()); // Middleware to handle the json requests

app.post("/process-video", (req, res) => {
  // Need to get the input video file from the request
  const inputFilePath = req.body.inputFilePath; // Local dev
  const outputFilePath = req.body.outputFilePath; // For cloud


  // Need appropriate handling of errors if the above parameters are not given
  if (!inputFilePath || !outputFilePath) {
    res.status(400).send("Bad Request: Missing file path.");
  }

});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Video processing service listening at http://localhost:${port}`)
});
