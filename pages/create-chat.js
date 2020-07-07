import React, { useEffect, useRef } from 'react';
import {
  makeStyles,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Container,
  TextField,
  ListItemSecondaryAction,
  Checkbox,
  Button,
} from '@material-ui/core';
import { get as getCookie } from 'js-cookie';
import BackButton from '../components/BackButton';
import Image from '../components/Image';
import { useForm } from 'react-hook-form';
import { useFirebase } from '../hooks/useFirebase';
import useUsers from '../hooks/useUsers';
import { AddPhotoAlternate } from '@material-ui/icons';
import AvatarEdit from '../components/AvatarEdit';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  avatarEdit: {
    //
  },
  textField: {
    width: '100%',
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
    marginTop: 48,
  },
  createGroupButton: {
    margin: 'auto',
    display: 'block',
  },
}));

const CreateChat = () => {
  const classes = useStyles();
  const avatarInputRef = useRef(null);

  const { handleSubmit, register, errors, setValue } = useForm();
  const firebase = useFirebase();

  const users = useUsers({ excludeSelf: true });
  const [checked, setChecked] = React.useState([]);

  const router = useRouter();

  const handleToggle = value => () => {
    console.log('handle toggle');
    const currentIndex = checked.indexOf(value);
    console.log({ currentIndex });
    const newChecked = [...checked];
    console.log({ newChecked });

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    console.log({ checked });
  }, [checked]);

  async function createGroup({ title, avatar }) {
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
      <AppBar position="fixed" color="inherit">
        <Toolbar variant="dense" className={classes.toolBar}>
          <BackButton />
          <List className={classes.list}>
            <ListItem alignItems="center" className={classes.listItem}>
              <ListItemText primary="Create Chat" />
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <form onSubmit={handleSubmit(createGroup)}>
          <Container>
            <TextField
              className={classes.textField}
              variant="outlined"
              label="Group title"
              name="title"
              type="text"
              id="group-title"
              error={errors.title}
              helperText={errors?.title?.message}
              inputRef={register({ required: 'Group title is required' })}
            />

            <AvatarEdit
              className={classes.avatarEdit}
              inputRef={avatarInputRef}
            />

            <Button
              variant="contained"
              color="primary"
              component="label"
              startIcon={<AddPhotoAlternate />}
            >
              <input
                accept="image/*"
                type="file"
                name="avatar"
                hidden
                ref={ref => {
                  avatarInputRef.current = ref;
                  register(ref);
                }}
              />
              Add photo
            </Button>

            <List>
              {users &&
                users.map(user => {
                  const labelId = `user-${user.id}`;
                  return (
                    <ListItem
                      key={user.id}
                      button
                      onClick={handleToggle(user.id)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {/* @ts-ignore */}
                          <Image
                            preview={user.avatar.preview}
                            sources={user.avatar.sources}
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        id={labelId}
                        primary={user.name}
                        secondary={user.email}
                      />
                      <ListItemSecondaryAction tabIndex={-1}>
                        <Checkbox
                          edge="end"
                          checked={checked.indexOf(user.id) !== -1}
                          onChange={handleToggle(user.id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
            </List>

            <Button
              className={classes.createGroupButton}
              variant="contained"
              color="primary"
              size="large"
              type="submit"
            >
              Create group
            </Button>
          </Container>
        </form>
      </main>
    </>
  );
};

export default CreateChat;
