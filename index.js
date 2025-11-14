import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());

// 🔍 BKM KITAP
async function scrapeBkm(query) {
  try {
    const url = `https://www.bkmkitap.com/arama?q=${encodeURIComponent(query)}`;
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);
    const fiyat = $(".currentPrice").first().text().trim();

    return fiyat || null;
  } catch (err) {
    return null;
  }
}

// 🔍 KİTAPYURDU
async function scrapeKitapyurdu(query) {
  try {
    const url = `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(query)}`;
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const fiyat = $(".price > span.value").first().text().trim();
    return fiyat || null;
  } catch (err) {
    return null;
  }
}

// 🔍 D&R
async function scrapeDR(query) {
  try {
    const url = `https://www.dr.com.tr/search?q=${encodeURIComponent(query)}`;
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);
    const fiyat = $(".prd-price").first().text().trim();

    return fiyat || null;
  } catch (err) {
    return null;
  }
}

// 🔍 TRENDYOL
async function scrapeTrendyol(query) {
  try {
    const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}`;
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);
    const fiyat = $(".prc-box-dscntd").first().text().trim();

    return fiyat || null;
  } catch (err) {
    return null;
  }
}

// 🔍 AMAZON
async function scrapeAmazon(query) {
  try {
    const url = `https://www.amazon.com.tr/s?k=${encodeURIComponent(query)}`;
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);
    const fiyat = $("span.a-price-whole").first().text().trim();

    return fiyat || null;
  } catch (err) {
    return null;
  }
}

// 📌 ANA API
app.get("/api/fiyat", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json({ error: "Sorgu boş olamaz!" });
  }

  const [bkm, ky, dr, trendyol, amazon] = await Promise.all([
    scrapeBkm(query),
    scrapeKitapyurdu(query),
    scrapeDR(query),
    scrapeTrendyol(query),
    scrapeAmazon(query)
  ]);

  res.json({
    kitap: query,
    fiyatlar: {
      "BKM Kitap": bkm,
      "Kitapyurdu": ky,
      "D&R": dr,
      "Trendyol": trendyol,
      "Amazon": amazon
    }
  });
});

app.get("/", (req, res) => {
  res.send("Kitapmatik API çalışıyor ✔️");
});

app.listen(3000, () => {
  console.log("Kitapmatik API çalışıyor PORT: 3000");
});

