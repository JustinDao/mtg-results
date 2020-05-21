import { DeckInfo } from "./Decks";
import modern_archetypes from "./modern_archetypes.json";
import maxBy from "lodash/maxBy";
import filter from "lodash/filter";

export function getArchetype(deckInfo: DeckInfo): string {
  const deckMatchMap = new Map<string, [number, number]>();

  modern_archetypes.forEach((mc) => {
    let points = 0;
    const totalPoints = mc.mainboard.length + mc.sideboard.length;

    const mainboardInclude = mc.mainboard.filter(
      (archCard) => !archCard.startsWith("~") && !archCard.startsWith("!"),
    );
    const sideboardInclude = mc.sideboard.filter(
      (archCard) => !archCard.startsWith("~") && !archCard.startsWith("!"),
    );
    const mainboardExclude = mc.mainboard
      .filter((archCard) => archCard.startsWith("~"))
      .map((c) => c.substring(1));
    const sideboardExclude = mc.sideboard
      .filter((archCard) => archCard.startsWith("~"))
      .map((c) => c.substring(1));
    const mainboardRequired = mc.mainboard
      .filter((archCard) => archCard.startsWith("!"))
      .map((c) => c.substring(1));
    const sideboardRequired = mc.sideboard
      .filter((archCard) => archCard.startsWith("!"))
      .map((c) => c.substring(1));

    // check mainboard
    // Check for required cards
    const mainboardFoundRequiredCards = deckInfo.mainboard.filter(
      (c) => mainboardRequired.indexOf(c.card.name) > -1,
    ).length;

    const sideboardFoundRequiredCards = deckInfo.sideboard.filter(
      (c) => sideboardRequired.indexOf(c.card.name) > -1,
    ).length;

    const mainboardRequiredMissing =
      mainboardRequired.length - mainboardFoundRequiredCards;
    const sideboardRequiredMissing =
      sideboardRequired.length - sideboardFoundRequiredCards;

    if (mainboardRequiredMissing !== 0 || sideboardRequiredMissing !== 0) {
      // If we're missing any required cards, it cannot be this deck.
      points = 0;
    } else {
      // Check for included cards
      deckInfo.mainboard.forEach((c) => {
        if (
          mainboardInclude
            .concat(mainboardRequired)
            .filter((cardName) => c.card.name === cardName).length > 0
        ) {
          points++;
        }
      });

      // Check for excluded cards
      if (points > 0) {
        const mainboardFoundExcludedCards = deckInfo.mainboard.filter(
          (c) => mainboardExclude.indexOf(c.card.name) > -1,
        ).length;
        points += mainboardExclude.length - mainboardFoundExcludedCards;
      }

      // check sideboard
      // Check for included cards
      deckInfo.sideboard.forEach((c) => {
        if (
          sideboardInclude
            .concat(sideboardRequired)
            .filter((cardName) => c.card.name === cardName).length > 0
        ) {
          points++;
        }
      });

      // Check for excluded cards
      if (points > 0) {
        const sideboardFoundExcludedCards = deckInfo.sideboard.filter(
          (c) => sideboardExclude.indexOf(c.card.name) > -1,
        ).length;
        points += sideboardExclude.length - sideboardFoundExcludedCards;
      }
    }

    deckMatchMap.set(mc.name, [points / totalPoints, totalPoints]);
  });

  console.log(deckMatchMap);

  const maxPoints = maxBy([...deckMatchMap.entries()], (d) => d[1][0])![1][0];

  // If nothing matches, return Unknown
  if (maxPoints === 0) {
    return "Unknown";
  }

  const decksWithMaxPonts = filter(
    [...deckMatchMap.entries()],
    (d) => d[1][0] === maxPoints,
  );

  // Return deck with most points AND most total points to ensure most likely match
  return maxBy(decksWithMaxPonts, (d) => d[1][1])![0];
}
