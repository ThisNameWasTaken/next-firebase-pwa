import React from 'react';
import { useRouter } from 'next/router';
import {
  makeStyles,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Container,
  TextField,
  Fab,
  Typography,
} from '@material-ui/core';
import { get as getCookie } from 'js-cookie';
import BackButton from '../components/BackButton';
import { useForm } from 'react-hook-form';
import { useFirebase } from '../hooks/useFirebase';
import useUsers from '../hooks/useUsers';
import AvatarEdit from '../components/AvatarEdit';
import UserCheckList from '../components/UserCheckList';
import { GroupAdd } from '@material-ui/icons';
import SkipLink from '../components/SkipLink';

const useStyles = makeStyles(theme => ({
  avatarEditContainer: {
    margin: theme.spacing(2, 0, 1, 0),
  },
  textField: {
    width: '100%',
    margin: theme.spacing(1, 0),
  },
  toolBar: {
    padding: 0,
  },
  list: {
    padding: 0,
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  content: {
    paddingTop: 48,
    paddingBottom: theme.spacing(2) + 48,
    maxWidth: 700,
  },
  createGroupButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  createGroupButtonIcon: {
    marginRight: theme.spacing(1),
  },
  membersText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(-1),
  },
}));

const CreateChat = () => {
  const classes = useStyles();

  const { handleSubmit, register, errors } = useForm();
  const firebase = useFirebase();

  const users = useUsers({ excludeSelf: true });
  const [checked, setChecked] = React.useState([]);

  const router = useRouter();

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  async function createGroup({ title, avatar, alt }) {
    console.log({ title, avatar, checked });

    const userId = getCookie('uid');

    const members = checked.map(id => ({ id, role: 'member' }));
    members.push({ id: userId, role: 'admin' });

    const [firestore, storage] = await Promise.all([
      firebase.firestore(),
      firebase.storage(),
    ]);

    const newChatDoc = await firestore.collection('chats').add({
      name: title,
      alt,
    });

    if (avatar && avatar[0]) {
      storage
        .ref()
        .child(`avatars/chats/${newChatDoc.id}/${avatar[0].name}`)
        .put(avatar[0]);
    }

    members.forEach(({ id, role }) => {
      newChatDoc.collection('members').doc(id).set({ role });
    });

    router.push('/');
  }

  return (
    <>
      <SkipLink href="#select-members">Skip to select members</SkipLink>
      <SkipLink href="#create-chat">Skip to create chat</SkipLink>

      <AppBar position="fixed" color="inherit">
        <Toolbar variant="dense" className={classes.toolBar}>
          <BackButton />
          <List className={classes.list}>
            <ListItem alignItems="center" className={classes.listItem}>
              <ListItemText
                primary={
                  <Typography variant="h6" component="h1">
                    Create Chat
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>

      <Container className={classes.content} component="main">
        <form onSubmit={handleSubmit(createGroup)}>
          <div className={classes.avatarEditContainer}>
            <AvatarEdit register={register} />
          </div>

          <TextField
            className={classes.textField}
            variant="outlined"
            label="Chat name"
            name="title"
            type="text"
            id="group-title"
            error={errors.title}
            helperText={errors?.title?.message}
            inputRef={register({ required: 'Group title is required' })}
          />

          <Typography
            className={classes.membersText}
            variant="h6"
            component="h2"
          >
            Select members
          </Typography>

          <UserCheckList
            id="select-members"
            users={users}
            checked={checked}
            onCheck={handleToggle}
          />

          <Fab
            id="create-chat"
            variant="extended"
            className={classes.createGroupButton}
            color="secondary"
            type="submit"
          >
            <GroupAdd className={classes.createGroupButtonIcon} />
            Create chat
          </Fab>
        </form>
      </Container>
    </>
  );
};

export default CreateChat;
