const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let ingestionCounter = 0;

app.set("views engine",ejs);

app.get("/",(req,res)=>{
    res.render("index");
})

app.post('/ingest', (req, res) => {
  const ids = req.body.ids;
  if (!ids || ids.length == 0) {
    return res.status(400).send("Please send an array of ids");
  }

  ingestionCounter++;
  const ingestionId = ingestionCounter; 

  const batchSize = 3;
  const batches = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    batches.push(ids.slice(i, i + batchSize));
  }

  async function processBatches() {
    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1} of ingestion ${ingestionId}:`, batches[i]);
      await new Promise(r => setTimeout(r, 1000));

      console.log(`Batch ${i + 1} done.`);

      if (i < batches.length - 1) {
        await new Promise(r => setTimeout(r, 5000));
      }
    }
    console.log(`Ingestion ${ingestionId} all batches processed.`);
  }

  processBatches();

  res.json({ ingestion_id: ingestionId });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
