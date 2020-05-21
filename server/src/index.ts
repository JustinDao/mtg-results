import axios from "axios";
import cors from "cors";
import express from "express";
import { parse } from "node-html-parser";
import { DeckInfo } from "./data/Decks";
import { ScryfallCard, getBestMatchingCardAsync } from "./clients/ScryfallApi";
import { sleep as sleepAsync } from "./utils/Utils";
import { getArchetype } from "./data/Categorizer";

const PORT = process.env.PORT || "1992";

async function main() {
  const app = express();
  app.use(cors());

  app.get("/scrape", async (req, res) => {
    const url = req.query.url as string;
    const urlResponse = await axios.get(url);
    const root = (parse(urlResponse.data) as unknown) as HTMLElement;

    const decklistsRoot = root.querySelectorAll(".decklists div")!;
    var promises = [...decklistsRoot.values()].map(async (n) => {
      try {
        const username = n.querySelector(".deck-meta h4")!.innerHTML;

        const mainboardCards = n.querySelectorAll(
          ".deck-list-text .sorted-by-overview-container .row",
        );
        const sideboardCards = n.querySelectorAll(
          ".deck-list-text .sorted-by-sideboard-container .row",
        );

        const mainboardPromises = [...mainboardCards.values()].map(
          async (c) => {
            const cardCount = parseInt(
              c.querySelector(".card-count")!.innerHTML,
            );
            const cardName = c.querySelector(".card-name a")!.innerHTML;

            const card = await getBestMatchingCardAsync(cardName);
            await sleepAsync(100); // wait inbetween scryfall calls

            return { count: cardCount, card: card };
          },
        );
        const mainboard: {
          count: number;
          card: ScryfallCard;
        }[] = [];
        for (const p of mainboardPromises) {
          mainboard.push(await p);
        }

        const sideboardPromises = [...sideboardCards.values()].map(
          async (c) => {
            const cardCount = parseInt(
              c.querySelector(".card-count")!.innerHTML,
            );
            const cardName = c.querySelector(".card-name a")!.innerHTML;

            const card = await getBestMatchingCardAsync(cardName);
            await sleepAsync(100); // wait inbetween scryfall calls

            return { count: cardCount, card: card };
          },
        );
        const sideboard: {
          count: number;
          card: ScryfallCard;
        }[] = [];
        for (const p of sideboardPromises) {
          sideboard.push(await p);
        }

        const deckInfo: DeckInfo = {
          mainboard: mainboard,
          sideboard: sideboard,
          name: "",
        };

        const archetype = getArchetype(deckInfo);

        return {
          username: username,
          deckName: archetype,
        };
      } catch (_) {
        console.log(_);
        return {};
      }
    });

    const returnValue = await Promise.all(promises);
    res.send("<pre>" + JSON.stringify(returnValue, null, 2) + "</pre>");
  });

  app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
});
