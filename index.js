import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
app.use(cors());

async function scrapeBkmkitap(query) {
  try {
    const url = `https://www.bkmkitap.com/index.php?p=Products&q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const price = $(".currentPrice").first().text().trim();
    return price || null;
  } catch {
    return null;
  }
}

async function scrapeKitapyurdu(query) {
  try {
    const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const price = $(".price-new").first().text().trim();
    return price || null;
  } catch {
    return null;
  }
}

app.get("/fiyat", async (req, res) => {
  const q = req.query.q;

  if (!q) return res.json({ error: "Sorgu girilmedi." });

  const results = {
    bkm: await scrapeBkmkitap(q),
    kitapyurdu: await scrapeKitapyurdu(q),
  };

  res.json(results);
});

app.listen(3000, () => console.log("API ÇALIŞIYOR: http://localhost:3000"));
