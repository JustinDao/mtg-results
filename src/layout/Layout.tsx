import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "@material-ui/core/Link";

const drawerWidth = 240;

const drawerLinks = [
  {
    title: "Modern",
    href: "/modern",
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      paddingLeft: "24px",
      justifyContent: "center",
      display: "flex",
      flexGrow: 1,
      minHeight: "56px",
      alignItems: "flex-start",
      flexDirection: "column",
    },
    homeLink: {
      marginBottom: "4px",
      color: "rgba(0,0,0,0.54)",
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  }),
);

export default function PermanentDrawerLeft(props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar></Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div style={{ display: "flex" }}>
          <div className={classes.drawerHeader}>
            <Link
              variant="h6"
              underline="hover"
              href="/"
              color="inherit"
              className={classes.homeLink}
            >
              MTG Results
            </Link>
            <Link
              variant="caption"
              underline="hover"
              href="/"
              color="secondary"
              className={classes.homeLink}
            >
              v1
            </Link>
          </div>
        </div>
        <Divider />
        <List>
          {drawerLinks.map((link, index) => (
            <ListItem button component="a" key={link.title} href={link.href}>
              <ListItemText>
                <b>{link.title}</b>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}
