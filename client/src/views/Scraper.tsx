import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { parse } from "node-html-parser";

export function Scraper() {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const result = parse(html);
      });
  }, [url]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          id="outlined-basic"
          label="URL"
          variant="outlined"
          fullWidth
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
}
