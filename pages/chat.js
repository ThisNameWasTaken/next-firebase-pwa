import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-fetch';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

import {
  makeStyles,
  InputAdornment,
  TextField,
  Paper,
  Typography,
  Avatar,
  Toolbar,
  List,
  ListItemAvatar,
  ListItemText,
  AppBar,
  ListItem,
  IconButton,
} from '@material-ui/core';

import {
  ArrowBack,
  EmojiEmotions,
  Send,
  EmojiEmotionsOutlined,
} from '@material-ui/icons';
import useMessages from '../hooks/useMessages';
import Image from '../components/Image';
import { useForm } from 'react-hook-form';
import useMembers from '../hooks/useMembers';
import clsx from 'clsx';
import withPrivateRoute from '../hocs/withPrivateRoute';
import getQueryParams from '../utils/getQueryParams';

const BackButton = () => (
  <IconButton aria-label="back" color="primary" onClick={Router.back}>
    <ArrowBack />
  </IconButton>
);

const useChatBubbleStyles = makeStyles(theme => ({
  chatBubble: {
    display: 'flex',
    marginBottom: 8,
  },
  chatBubbleLeft: {
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginRight: 48,
  },
  mergePrevLeft: {
    borderTopLeftRadius: 4,
    marginTop: -4,
  },
  mergeNextLeft: {
    borderBottomLeftRadius: 4,
  },
  chatBubbleRight: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    marginLeft: 48,
  },
  mergePrevRight: {
    borderTopRightRadius: 4,
    marginTop: -4,
  },
  mergeNextRight: {
    borderBottomRightRadius: 4,
  },
  avatar: {
    width: 30,
    height: 30,
    margin: '0px 8px',
  },
  hideAvatar: {
    opacity: 0,
  },
  paperLeft: {
    borderBottomLeftRadius: 4,
    transform: 'translateY(-16px)',
  },
  paperRight: {
    background: '#8338EC',
    color: '#fff',
    borderBottomRightRadius: 4,
    transform: 'translateY(-16px)',
  },
  text: {
    padding: '.5rem 1rem',
  },
}));

const ChatBubble = ({
  avatar = '',
  text = '',
  photo = undefined,
  isSelf,
  mergePrevBubble = false,
  mergeNextBubble = false,
}) => {
  const classes = useChatBubbleStyles();

  return (
    <div
      className={clsx(
        classes.chatBubble,
        isSelf ? classes.chatBubbleRight : classes.chatBubbleLeft
      )}
    >
      <Avatar
        className={clsx(classes.avatar, mergeNextBubble && classes.hideAvatar)}
      >
        {avatar && !mergeNextBubble && (
          <Image
            sources={avatar.sources}
            preview={avatar.preview}
            alt=""
            width={64}
            height={64}
          />
        )}
      </Avatar>
      <Paper
        variant="outlined"
        className={clsx(
          isSelf ? classes.paperRight : classes.paperLeft,
          mergePrevBubble &&
            (isSelf ? classes.mergePrevRight : classes.mergePrevLeft),
          mergeNextBubble &&
            (isSelf ? classes.mergeNextRight : classes.mergeNextLeft)
        )}
      >
        <Typography variant="body1" className={classes.text}>
          {text}
        </Typography>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing(1),
    position: 'fixed',
    width: `calc(100% - ${theme.spacing(2)}px)`,
    bottom: 0,
    left: 0,
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
}));

const Chats = props => {
  const classes = useStyles();

  const { handleSubmit, register, setValue } = useForm();

  const { chatId } = getQueryParams();

  const { messages, sendMessage } = useMessages({
    chatId,
  });

  const { members } = useMembers({ chatId });

  function onSubmit({ message }) {
    sendMessage({ text: message });
    setValue('message', '');
  }

  console.log({ props });

  useEffect(() => {
    console.log({ members });
  }, [members]);

  useEffect(() => {
    console.log({ messages });
  }, [messages]);

  return (
    <>
      <AppBar position="fixed" color="inherit">
        <Toolbar variant="dense" className={classes.toolBar}>
          <BackButton />
          <List className={classes.list}>
            <ListItem alignItems="center" className={classes.listItem}>
              <ListItemAvatar>
                <Avatar src="https://firebasestorage.googleapis.com/v0/b/auth-b7a6c.appspot.com/o/avatars%2Fchats%2F7AWjx17DPlPLj7rJvvVq%2F06c83741-9be8-4577-b82b-161871e9b504--64w.webp?alt=media&token=82afea32-14e7-4ea6-a65c-ee43601b37e0"></Avatar>
              </ListItemAvatar>
              <ListItemText primary="Hello Group" />
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 78 }}>
        {messages.map((message, index) => {
          const nextAuthorId =
            index < messages.length - 1
              ? messages[index + 1].authorId
              : undefined;

          const prevAuthorId =
            index > 0 ? messages[index - 1].authorId : undefined;

          return (
            <ChatBubble
              key={message.id}
              text={message.text}
              avatar={members[message.authorId]?.avatar}
              // isSelf={message.authorId === props.decodedToken.uid}
              mergePrevBubble={message.authorId === prevAuthorId}
              mergeNextBubble={message.authorId === nextAuthorId}
            />
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          placeholder="Type..."
          variant="outlined"
          className={classes.textField}
          name="message"
          id="message"
          inputRef={register}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmojiEmotionsOutlined style={{ opacity: 0.87 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="send message" type="submit">
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </>
  );
};

export default withPrivateRoute(Chats);
