import axios from "axios";
import cors from "cors";
import express from "express";
import { JSDOM } from "jsdom";

const PORT = process.env.PORT || "1992";

async function main() {
  const app = express();
  app.use(cors());

  app.get("/test", async (req, res) => {
    console.log("hitting wizards");
    const response = await axios.get(
      "https://magic.wizards.com/en/articles/archive/mtgo-standings/modern-challenge-2020-05-18"
    );
    console.log("wizards hit");
    const dom = new JSDOM(response.data);
    const mainContentNode = dom.window.document.querySelector<HTMLDivElement>(
      "div#main-content"
    );
    console.log(mainContentNode);
    const json = {
      bodyText: mainContentNode?.textContent?.replace(/\s+/g, " ") ?? null,
    };
    res.json(json);
  });

  app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
});
