import React from "react";
import { ScryfallCard, getCardAsync } from "../clients/ScryfallApi";
import { allDecks, DeckInfo } from "../data/Decks";
import { getArchetype } from "../data/Categorizer";
import { splitArray } from "../utils/ArrayUtils";

import {
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
  Grid,
} from "@material-ui/core";

export function Modern() {
  const [card, setCard] = React.useState<ScryfallCard>();
  const [decks, setDecks] = React.useState<Map<string, DeckInfo>>(
    new Map<string, DeckInfo>(),
  );

  React.useEffect(() => {
    populateDecksAsync();
  }, []);

  const populateDecksAsync = async () => {
    const newMap = new Map<string, DeckInfo>();
    const all = await allDecks;

    all.forEach((d) => {
      const archetype = getArchetype(d);
      newMap.set(archetype, d);
    });

    setDecks(newMap);
  };

  const getCardFromApiAsync = async (cardName: string) => {
    if (!cardName) {
      return;
    }

    const apiCard = (await getCardAsync(cardName)) as ScryfallCard;

    if (apiCard) {
      setCard(apiCard);
    }
  };

  return (
    <Container>
      <TextField
        placeholder="Card Name"
        onChange={(event) => getCardFromApiAsync(event?.target.value ?? "")}
      />

      {card && <pre>{JSON.stringify(card, null, 2)}</pre>}

      {[...decks.entries()].map(([name, deck]) => {
        return (
          <React.Fragment key={name}>
            <Grid container>
              <Grid item>
                <Typography component="h2" variant="h6">
                  {name}
                </Typography>
              </Grid>
            </Grid>
            <Grid container alignItems="flex-start">
              <Grid container item xs={9} alignItems="flex-start">
                {splitArray(deck.mainboard, 3).map((section, i) => {
                  return (
                    <React.Fragment key={i}>
                      {section.map(({ card, count }) => {
                        return (
                          <Grid item xs={3} key={card.name}>
                            <List style={{ padding: 0 }}>
                              <ListItem
                                key={card.name}
                                style={{ padding: 0 }}
                                disableGutters
                                dense
                                alignItems="flex-start"
                              >
                                <Tooltip
                                  placement="right"
                                  title={
                                    <img
                                      alt={card.name}
                                      src={card.image_uris.border_crop}
                                      style={{ maxWidth: "250px" }}
                                    ></img>
                                  }
                                >
                                  <ListItemText
                                    primary={
                                      <span>
                                        {`${count}x `}
                                        <a href={card.scryfall_uri}>
                                          {card.name}
                                        </a>
                                      </span>
                                    }
                                  />
                                </Tooltip>
                              </ListItem>
                            </List>
                          </Grid>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </Grid>
              <Grid item xs={3}>
                <Typography>Sideboard</Typography>
                {deck.sideboard.map(({ card, count }) => {
                  return (
                    <ListItem
                      key={card.name}
                      style={{ padding: 0 }}
                      disableGutters
                      dense
                      alignItems="flex-start"
                    >
                      <Tooltip
                        placement="right"
                        title={
                          <img
                            alt={card.name}
                            src={card.image_uris.border_crop}
                            style={{ maxWidth: "250px" }}
                          ></img>
                        }
                      >
                        <ListItemText
                          primary={
                            <span>
                              {`${count}x `}
                              <a href={card.scryfall_uri}>{card.name}</a>
                            </span>
                          }
                        />
                      </Tooltip>
                    </ListItem>
                  );
                })}
              </Grid>
            </Grid>
          </React.Fragment>
        );
      })}
    </Container>
  );
}
