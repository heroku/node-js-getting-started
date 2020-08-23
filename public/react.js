const LittleApp = () => {
  return (
    <AppBar position="static">
  <Toolbar>
    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" className={classes.title}>
      News
    </Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
  </AppBar>
  );
};

ReactDOM.render(<LittleApp />, document.getElementById("like_button_container"));
