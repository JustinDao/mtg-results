import leven from "fast-levenshtein";
import sortBy from "lodash/sortBy";
import data from "../data/decks.json";
import { ScryfallCard, getMatchingCardsAsync } from "../clients/ScryfallApi";

export interface DeckInfo {
  name: string;
  cards: {
    count: number;
    card: ScryfallCard;
  }[];
}

const parseDeckData = async () => {
  const deckData: DeckInfo[] = [];

  for (let deck of data) {
    const deckInfo: DeckInfo = { name: deck.name, cards: [] };

    for (let card of deck.cards) {
      const matchedCards = await getMatchingCardsAsync(card.name);
      const bestMatch = sortBy(matchedCards, (c) =>
        leven.get(c.name.toLowerCase(), card.name.toLowerCase()),
      )[0];

      deckInfo.cards.push({ card: bestMatch, count: card.count });
    }

    deckData.push(deckInfo);
  }

  console.log(deckData);

  return deckData;
};

export const allDecks = parseDeckData();
