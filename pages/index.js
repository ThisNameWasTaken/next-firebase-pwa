import { AppBar, Toolbar, makeStyles, List, Fab } from '@material-ui/core';
import { Search, Chat } from '@material-ui/icons';

import withPrivateRoute from '../hocs/withPrivateRoute';
import useCurrentUser from '../hooks/useCurrentUser';
import ChatList from '../components/ChatList';
import UserInfo from '../components/UserInfo/UserInfo';
import Link from 'next/link';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  searchBar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
  },
  searchIcon: {
    marginRight: theme.spacing(1),
  },
  fab: {
    position: 'fixed',
    // 56 is bottom navigation's height
    bottom: 56 + theme.spacing(1),
    right: theme.spacing(2),
  },
  fabIcon: {
    marginRight: theme.spacing(1),
  },
  bottomNavigation: {
    position: 'fixed',
    // display: 'block',
    width: '100%',
    bottom: 0,
    left: 0,
  },
}));

const Index = () => {
  const classes = useStyles();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const testWorker = new Worker('./test.worker.js');

    testWorker.postMessage('my message from the main thread');
    testWorker.addEventListener('message', console.log);
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <List>
            <UserInfo user={currentUser} />
          </List>
        </Toolbar>
        <Toolbar variant="dense" className={classes.searchBar}>
          <Search className={classes.searchIcon} />
          Search ...
        </Toolbar>
      </AppBar>
      <ChatList />
      <Link href="/create-chat" passHref>
        <Fab
          variant="extended"
          className={classes.fab}
          color="secondary"
          component="a"
        >
          <Chat className={classes.fabIcon} />
          Create Chat
        </Fab>
      </Link>
    </>
  );
};

export default withPrivateRoute(Index);
