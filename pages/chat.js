import React, { useEffect, useState } from 'react';
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
import {
  Send,
  EmojiEmotionsOutlined,
  InfoOutlined,
  AddPhotoAlternate,
} from '@material-ui/icons';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
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
import { delayCallback, cancelDelayCallback } from '../utils/delayCallback';

const useChatBubbleStyles = makeStyles(theme => ({
  chatBubble: {
    display: 'flex',
    marginBottom: 8,
    overflowAnchor: 'none',
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
    border: `2px solid ${'#1870c9'}`,
    background: fade(theme.palette.info.light, 0.1),
    color: '#1870c9',
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
  alt = '',
}) => {
  const classes = useChatBubbleStyles();

  console.log({ photo });

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
                alt={alt}
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
            {photo && (
              <div
                style={{
                  width: '100%',
                  paddingTop: `${(photo.width / photo.height) * 100}%`,
                }}
              >
                <Image
                  style={{ minWidth: 120, display: 'block' }}
                  sources={photo?.sources}
                  alt={photo?.alt}
                  preview={photo?.preview}
                  width={photo?.width}
                  height={photo?.height}
                />
              </div>
            )}
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
    padding: theme.spacing(1),
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    background: theme.palette.background.default,
  },
  toolBar: {
    padding: 0,
  },
  list: {
    // padding: 0,
    marginRight: 'auto',
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 68,
    paddingBottom: 80,
  },
  typingUsers: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 6px',
    transition: theme.transitions.create('transform'),
    willChange: 'transform',
    transform: 'translateX(-100%)',
  },
  typingUsersSlide: {
    transform: 'translateX(0%)',
  },
  typingUsersAvatar: {
    width: 30,
    height: 30,
    marginRight: theme.spacing(1),
  },
  typingUsersAvatarContainer: {
    position: 'relative',
  },
  avatarBreathe: {
    width: 30,
    height: 30,
    willChange: 'transform',
    background: fade(theme.palette.primary.main, 0.2),
    transform: 'scale(1)',
    borderRadius: '50%',
    position: 'absolute',
    animation: `$breathe ${theme.transitions.easing.easeInOut} 2300ms infinite`,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  '@keyframes breathe': {
    '0%, 100%': {
      transform: 'scale(1)',
    },

    '50%': {
      transform: 'scale(1.35)',
    },
  },
  anchor: {
    overflowAnchor: 'auto',
    height: '1px',
  },
}));

const Chats = props => {
  const userId = getCookie('uid');

  const classes = useStyles();

  const { handleSubmit, register, setValue } = useForm();

  const { chatId } = getQueryParams();

  const { chat } = useChat();

  const { messages, sendMessage, typingUsers, showIsTyping } = useMessages({
    chatId,
  });

  function handleTyping(event) {
    if (!window.isTyping) {
      showIsTyping(true);
      window.isTyping = true;
    }

    if (window.typingTimeout) {
      cancelDelayCallback(window.typingTimeout);
    }

    window.typingTimeout = delayCallback(() => {
      window.isTyping = false;
      showIsTyping(false);
    }, 600);
  }

  const { members } = useMembers({ chatId });

  function onSubmit({ message, photo }) {
    console.log({ message, photo: photo[0] });
    sendMessage({ text: message, photo: photo[0] });
    setValue('message', '');
    setValue('photo', undefined);
  }

  useEffect(() => {
    if (!window.didScrollToBottom) {
      window.scrollTo(0, document.body.scrollHeight);
      window.didScrollToBottom = messages && messages.length > 0;
    }
  }, [messages]);

  useEffect(() => {
    document
      .querySelector('#message')
      .setAttribute('aria-label', 'type message');
  }, []);

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

      <div className={classes.messagesContainer} role="log">
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
              photo={message.photo}
              avatar={members[message.authorId]?.avatar}
              isSelf={message.authorId === userId}
              mergePrevBubble={message.authorId === prevAuthorId}
              mergeNextBubble={message.authorId === nextAuthorId}
              isInfo={!message.authorId}
              alt={members[message.authorId]?.alt}
            />
          );
        })}

        <div
          className={clsx(
            classes.typingUsers,
            typingUsers?.length > 0 && classes.typingUsersSlide
          )}
        >
          {typingUsers && typingUsers?.length > 0 && (
            <>
              <AvatarGroup max={3}>
                {typingUsers.map(memberId => {
                  if (!members[memberId]) return <></>;

                  return (
                    <div className={classes.typingUsersAvatarContainer}>
                      <div className={classes.avatarBreathe} />
                      <Avatar
                        key={memberId}
                        className={classes.typingUsersAvatar}
                      >
                        <Image
                          sources={members[memberId].avatar.sources}
                          preview={members[memberId].avatar.preview}
                          alt={members[memberId]?.alt}
                          width={30}
                          height={30}
                        />
                      </Avatar>
                    </div>
                  );
                })}
              </AvatarGroup>
              <Typography variant="body1">is typing ...</Typography>
            </>
          )}
        </div>

        <div className={classes.anchor} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          placeholder="Type..."
          variant="outlined"
          className={classes.textField}
          name="message"
          id="message"
          onKeyDown={handleTyping}
          inputRef={register}
          InputProps={{
            'aria-label': 'type message',
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  aria-label="upload image"
                  role="button"
                  component="label"
                >
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    ref={register}
                    hidden
                  />
                  <AddPhotoAlternate aria-hidden="true" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="send message" type="submit">
                  <Send aria-hidden="true" />
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
