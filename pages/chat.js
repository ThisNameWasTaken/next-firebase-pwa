import React, { useEffect } from 'react';
import {
  makeStyles,
  InputAdornment,
  TextField,
  Paper,
  Typography,
  Avatar,
  Toolbar,
  List,
  AppBar,
  IconButton,
  fade,
} from '@material-ui/core';
import { Send, EmojiEmotionsOutlined, InfoOutlined } from '@material-ui/icons';
import { get as getCookie } from 'js-cookie';
import Link from 'next/link';

import useMessages from '../hooks/useMessages';
import Image from '../components/Image';
import { useForm } from 'react-hook-form';
import useMembers from '../hooks/useMembers';
import clsx from 'clsx';
import withPrivateRoute from '../hocs/withPrivateRoute';
import getQueryParams from '../utils/getQueryParams';
import BackButton from '../components/BackButton';
import useChat from '../hooks/useChat';
import ChatInfo from '../components/ChatInfo/ChatInfo';

const useChatBubbleStyles = makeStyles(theme => ({
  chatBubble: {
    display: 'flex',
    marginBottom: 8,
  },
  chatBubbleInfo: {
    margin: 'auto',
    marginBottom: 24,

    '& + &': {
      marginTop: -16,
    },
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
  paperInfo: {
    border: `2px solid ${theme.palette.info.main}`,
    background: fade(theme.palette.info.main, 0.1),
    color: theme.palette.info.main,
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
  textInfo: {
    fontWeight: 800,
  },
}));

const ChatBubble = ({
  avatar = '',
  text = '',
  photo = undefined,
  isSelf = false,
  mergePrevBubble = false,
  mergeNextBubble = false,
  isInfo = false,
}) => {
  const classes = useChatBubbleStyles();

  return (
    <>
      {isInfo ? (
        <div className={clsx(classes.chatBubble, classes.chatBubbleInfo)}>
          <Paper variant="outlined" className={classes.paperInfo}>
            <Typography
              variant="body1"
              className={clsx(classes.text, classes.textInfo)}
            >
              {text}
            </Typography>
          </Paper>
        </div>
      ) : (
        <div
          className={clsx(
            classes.chatBubble,
            isSelf ? classes.chatBubbleRight : classes.chatBubbleLeft
          )}
        >
          <Avatar
            className={clsx(
              classes.avatar,
              mergeNextBubble && classes.hideAvatar
            )}
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
      )}
    </>
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
    // padding: 0,
    marginRight: 'auto',
  },
}));

const Chats = props => {
  const userId = getCookie('uid');

  const classes = useStyles();

  const { handleSubmit, register, setValue } = useForm();

  const { chatId } = getQueryParams();

  const { chat } = useChat();

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
            <ChatInfo chat={chat} />
          </List>
          <Link href={`/chat-info?chatId=${chatId}`} passHref>
            <IconButton
              aria-label="show chat info"
              color="primary"
              component="a"
            >
              <InfoOutlined aria-hidden="true" />
            </IconButton>
          </Link>
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
              isSelf={message.authorId === userId}
              mergePrevBubble={message.authorId === prevAuthorId}
              mergeNextBubble={message.authorId === nextAuthorId}
              isInfo={!message.authorId}
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
