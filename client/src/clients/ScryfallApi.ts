import sortBy from "lodash/sortBy";
import leven from "fast-levenshtein";

const scryfallEndpoint = "https://api.scryfall.com";

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
  if (localStorage.getItem(cardName) !== null) {
    return Promise.resolve(
      JSON.parse(localStorage.getItem(cardName)!) as ScryfallCard[],
    );
  }

  return fetch(
    `${scryfallEndpoint}/cards/search?q=${encodeURIComponent(
      cardName,
    )}&unique=cards`,
  )
    .then((response) => {
      if (response.status === 404) {
        return new Response("[]");
      }
      return response;
    })
    .then((result) => result.json())
    .then((data) => {
      const list = data as ScryfallList;
      // Cache data
      localStorage.setItem(cardName, JSON.stringify(list.data));
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
  card: ScryfallCard,
): Promise<ScryfallCard> {
  return getMatchingCardsAsync(card.name).then((matchedCards) => {
    const bestMatch = sortBy(matchedCards, (c) =>
      leven.get(c.name.toLowerCase(), card.name.toLowerCase()),
    )[0];

    return bestMatch;
  });
}
