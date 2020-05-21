import leven from "fast-levenshtein";
import sortBy from "lodash/sortBy";
import data from "./decks.json";
import { ScryfallCard, getMatchingCardsAsync } from "../clients/ScryfallApi";
import { sleep } from "../utils/Utils";

export interface DeckInfo {
  name: string;
  mainboard: {
    count: number;
    card: ScryfallCard;
  }[];
  sideboard: {
    count: number;
    card: ScryfallCard;
  }[];
}

const parseDeckData = async () => {
  const deckData: DeckInfo[] = [];

  for (let deck of data) {
    const deckInfo: DeckInfo = {
      name: deck.name,
      mainboard: [],
      sideboard: [],
    };

    for (let card of deck.mainboard) {
      const matchedCards = await getMatchingCardsAsync(card.name);
      const bestMatch = sortBy(matchedCards, (c) =>
        leven.get(c.name.toLowerCase(), card.name.toLowerCase()),
      )[0];

      deckInfo.mainboard.push({ card: bestMatch, count: card.count });

      // wait for scryfall api
      await sleep(100);
    }

    for (let card of deck.sideboard) {
      const matchedCards = await getMatchingCardsAsync(card.name);
      const bestMatch = sortBy(matchedCards, (c) =>
        leven.get(c.name.toLowerCase(), card.name.toLowerCase()),
      )[0];

      deckInfo.sideboard.push({ card: bestMatch, count: card.count });

      // wait for scryfall api
      await sleep(100);
    }

    deckData.push(deckInfo);
  }

  console.log(deckData);

  return deckData;
};

export const allDecks = parseDeckData();
