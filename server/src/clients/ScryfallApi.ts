import sortBy from "lodash/sortBy";
import leven from "fast-levenshtein";
import axios from "axios";

const scryfallEndpoint = "https://api.scryfall.com";
const cache = new Map<string, ScryfallCard[]>();

export type ScryfallList = {
  data: ScryfallCard[];
};

export type ScryfallCard = {
  id: string;
  name: string;
  scryfall_uri: string;
  image_uris: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
};

export function getMatchingCardsAsync(
  cardName: string,
): Promise<ScryfallCard[]> {
  // Get Cards from cache if available
  if (cache.has(cardName)) {
    return Promise.resolve(cache.get(cardName)!);
  }

  return axios
    .get(
      `${scryfallEndpoint}/cards/search?q=${encodeURIComponent(
        cardName,
      )}&unique=cards`,
    )
    .then((response) => {
      if (response.status == 404) {
        return [];
      }

      const list = response.data as ScryfallList;
      // Cache data
      cache.set(cardName, list.data);
      return list.data;
    })
    .catch(() => {
      return [];
    });
}

export function getCardAsync(cardName: string): Promise<ScryfallCard | null> {
  return getMatchingCardsAsync(cardName).then((result) => {
    if (result.length !== 1) {
      return null;
    }

    return result[0];
  });
}

export function getBestMatchingCardAsync(
  cardName: string,
): Promise<ScryfallCard> {
  return getMatchingCardsAsync(cardName).then((matchedCards) => {
    const bestMatch = sortBy(matchedCards, (c) =>
      leven.get(c.name.toLowerCase(), cardName.toLowerCase()),
    )[0];

    return bestMatch;
  });
}
