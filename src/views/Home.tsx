import React from "react";
import {
  ScryfallCard,
  getCardAsync,
  getMatchingCardsAsync,
} from "../clients/ScryfallApi";
import { allDecks, DeckInfo } from "../data/Decks";

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

export default function Home() {
  const [card, setCard] = React.useState<ScryfallCard>();
  // const [cards, setCards] = React.useState<ScryfallCard[]>();
  const [decks, setDecks] = React.useState<DeckInfo[]>([]);

  React.useEffect(() => {
    populateDecksAsync();
  }, []);

  const populateDecksAsync = async () => {
    const d = await allDecks;
    setDecks(d);
  };

  const getCardFromApiAsync = async (cardName: string) => {
    if (!cardName) {
      return;
    }

    const apiCard = (await getCardAsync(cardName)) as ScryfallCard;

    if (apiCard) {
      setCard(apiCard);
    }

    // const apiCards = (await getMatchingCardsAsync(cardName)) as ScryfallCard[];

    // if (apiCards) {
    //   setCards(apiCards);
    // }
  };

  return (
    <Container>
      <Grid>
        {decks.map((deck: DeckInfo) => {
          return (
            <Grid item xs={3} key={deck.name}>
              <Typography component="h2" variant="h6">
                {deck.name}
              </Typography>
              <List>
                {deck.cards.map(({ card, count }) => {
                  return (
                    <ListItem key={card.name}>
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
              </List>
            </Grid>
          );
        })}
      </Grid>

      <TextField
        placeholder="Card Name"
        onChange={(event) => getCardFromApiAsync(event?.target.value ?? "")}
      />

      {card && <pre>{JSON.stringify(card, null, 2)}</pre>}
    </Container>
  );
}
