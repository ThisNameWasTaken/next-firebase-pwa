import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  InfoOutlined,
  AddPhotoAlternate,
  Close,
  Delete,
  Reply,
} from '@material-ui/icons';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Skeleton from '@material-ui/lab/Skeleton';
import { get as getCookie } from 'js-cookie';

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
import SkipLink from '../components/SkipLink/SkipLink';
import getSrcFromImageFile from '../utils/getSrcFromImageFile';

const Dialog = dynamic(() => import('@material-ui/core/Dialog'), {
  ssr: false,
});

// const AvatarEdit = dynamic(() => import('../components/AvatarEdit'), {
//   ssr: false,
// });

const useChatBubbleStyles = makeStyles(theme => ({
  chatBubble: {
    display: 'flex',
    marginBottom: 8,
    overflowAnchor: 'none',
    '&:hover > $messageDeleteButton': {
      opacity: 1,
    },

    '&:focus > $messageDeleteButton': {
      opacity: 1,
    },

    '&:hover > $messageReplyButton': {
      opacity: 1,
    },

    '&:focus > $messageReplyButton': {
      opacity: 1,
    },
  },
  chatBubbleInfo: {
    margin: 'auto',
    marginBottom: 24,

    '& + &': {
      marginTop: -16,
    },
  },
  chatBubbleLeft: {
    alignItems: 'center',
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
    alignItems: 'center',
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
    alignSelf: 'flex-end',
  },
  hideAvatar: {
    opacity: 0,
  },
  paperLeft: {
    borderBottomLeftRadius: 4,
    transform: 'translateY(-16px)',
    overflow: 'hidden',
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
    overflow: 'hidden',
  },
  messageDeleteButton: {
    alignSelf: 'center',
    marginTop: -32,
    opacity: 0,

    '&:hover': {
      opacity: 1,
    },

    '&:focus': {
      opacity: 1,
    },
  },
  messageReplyButton: {
    alignSelf: 'center',
    marginTop: -32,
    opacity: 0,

    '&:hover': {
      opacity: 1,
    },

    '&:focus': {
      opacity: 1,
    },
  },
  paperImageContainer: {
    width: '100%',
    minWidth: 120,
    position: 'relative',
  },
  paperImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  paperImageSkeleton: {
    background: fade(theme.palette.primary.contrastText, 0.4),
    height: '100%',
  },
  text: {
    padding: '.5rem 1rem',
  },
  textInfo: {
    fontWeight: 800,
  },
  zoomImage: {
    cursor: 'zoom-in',
    outline: 'none',
    border: 'none',

    '&:focus, &:hover': {
      opacity: 0.7,
    },
  },
  repliedMessage: {
    color: 'inherit',
    textDecoration: 'none',
    background: 'rgba(255, 255, 255, .1)',
    display: 'flex',
    alignItems: 'center',
  },
  repliedMessageText: {
    padding: theme.spacing(0, 1, 0, 2),
  },
}));

const ChatBubble = ({
  id,
  avatar = '',
  text = '',
  photo = undefined,
  photoAlt = 'media',
  repliedMessage = undefined,
  isSelf = false,
  mergePrevBubble = false,
  mergeNextBubble = false,
  isInfo = false,
  alt = '',
  onZoomImage = () => {},
  onDelete = () => {},
  onReply = () => {},
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
                alt={alt}
                width={64}
                height={64}
              />
            )}
          </Avatar>

          <Paper
            id={id}
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
                className={classes.paperImageContainer}
                style={{
                  paddingTop: `${(photo.height / photo.width) * 100}%`,
                }}
              >
                {!photo?.sources ? (
                  <Skeleton
                    animation="pulse"
                    variant="rect"
                    className={clsx(
                      classes.paperImage,
                      classes.paperImageSkeleton
                    )}
                  />
                ) : (
                  <Image
                    tabindex="0"
                    role="button"
                    onKeyPress={event =>
                      (event.key === 'Enter' || event.key === 'Space') &&
                      onZoomImage(photo)
                    }
                    onClick={() => onZoomImage(photo)}
                    aria-label="zoom image"
                    className={clsx(classes.paperImage, classes.zoomImage)}
                    sources={photo?.sources}
                    alt={photoAlt || 'media'}
                    preview={photo?.preview}
                    width={photo?.width}
                    height={photo?.height}
                  />
                )}
              </div>
            )}
            {repliedMessage && (
              <a
                href={`#${repliedMessage.id}`}
                className={classes.repliedMessage}
                aria-label="scroll to the message"
              >
                <Typography
                  className={classes.repliedMessageText}
                  variant="body2"
                  noWrap
                >
                  {repliedMessage.text}
                </Typography>
                {repliedMessage.photo && (
                  <Avatar variant="square">
                    <Image
                      sources={repliedMessage.photo?.sources}
                      alt={repliedMessage.photo?.alt || 'media'}
                      preview={repliedMessage.photo?.preview}
                      width={64}
                      height={64}
                    />
                  </Avatar>
                )}
              </a>
            )}
            {text && (
              <Typography variant="body1" className={classes.text}>
                {text}
              </Typography>
            )}
          </Paper>

          {isSelf && (
            <IconButton
              aria-label="delete message"
              aria-labelledby={`#${id}`}
              className={classes.messageDeleteButton}
              color="primary"
              onClick={() => onDelete()}
            >
              <Delete aria-hidden="true" />
            </IconButton>
          )}
          <IconButton
            aria-label="reply to message"
            aria-labelledby={`#${id}`}
            className={classes.messageDeleteButton}
            color="primary"
            onClick={() => onReply()}
          >
            <Reply aria-hidden="true" />
          </IconButton>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles(theme => ({
  form: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    background: theme.palette.background.paper,
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    zIndex: 9,
    position: 'relative',
    padding: theme.spacing(1),
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
  closeImageDialogButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 1,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, .1)',

    '&:hover, &:focus': {
      backgroundColor: 'rgba(0, 0, 0, .24)',
    },
  },
  replyPreview: {
    background: theme.palette.background.paper,
    padding: theme.spacing(1, 2),
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'fixed',
    bottom: 72,
    left: 0,
    right: 0,
    margin: theme.spacing(1, 1, 0.5, 1),
    zIndex: 2,
    transform: 'translateY(100px)',
    willChange: 'transform',
    transition: theme.transitions.create('transform'),
  },
  showReply: {
    transform: 'translateY(0)',
  },
  replyCancelButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    color: '#fff',
    background: 'rgba(0, 0, 0, .45)',
    '&:hover, &:focus': {
      background: 'rgba(0, 0, 0, .65)',
    },
  },
  replyPhoto: {
    margin: -16,
    width: 64,
    height: 64,
  },
  photoUpload: {
    position: 'fixed',
    bottom: 72,
    left: 16,
    zIndex: 1,
    transform: 'translateY(200px)',
    willChange: 'transform',
    transition: theme.transitions.create('transform'),
  },
  photoUploadShow: {
    transform: 'translateY(0px)',
  },
  photoUploadShowWithReply: {
    transform: 'translateY(-72px)',
  },
  photoUploadAvatar: {
    width: 86,
    height: 86,
    borderRadius: 16,
  },
}));

const Chats = props => {
  const userId = getCookie('uid');

  const classes = useStyles();

  const { handleSubmit, register, setValue } = useForm();

  const { chatId } = getQueryParams();

  const { chat } = useChat();

  const {
    messages,
    sendMessage,
    typingUsers,
    showIsTyping,
    deleteMessage,
  } = useMessages({
    chatId,
  });

  const [photoDialogState, setPhotoDialogState] = useState({
    open: false,
    sources: undefined,
    preview: undefined,
    width: undefined,
    height: undefined,
    alt: undefined,
  });

  const [replyState, setReplyState] = useState({
    show: false,
    message: undefined,
    author: undefined,
  });

  const [photoUploadPreviewState, setPhotoUploadPreviewState] = useState({
    show: false,
    src: undefined,
  });

  async function showPhotoUploadPreview() {
    const photoUploadElement = document.getElementById('photo-upload');

    const src = await getSrcFromImageFile(photoUploadElement.files[0]);

    setPhotoUploadPreviewState(prevState => ({
      src,
      show: true,
    }));
  }

  function closePhotoUpload() {
    const photoUploadElement = document.getElementById('photo-upload');

    photoUploadElement.value = '';

    setPhotoUploadPreviewState(prevState => ({
      ...prevState,
      show: false,
    }));
  }

  function openImageDialog({ sources, preview, width, height, alt }) {
    setPhotoDialogState({ open: true, sources, preview, width, height, alt });
  }

  function closeImageDialog() {
    setPhotoDialogState(prevState => ({
      ...prevState,
      open: false,
    }));
  }

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
    console.log({ replyState });

    const repliedMessage = replyState.show ? replyState.message : undefined;

    sendMessage({
      text: message,
      photo: photo[0],
      repliedMessage,
    });

    setReplyState(prevState => ({ ...prevState, show: false }));
    closePhotoUpload();
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

  function reply({ author, message }) {
    console.log({ author, message });
    setReplyState({ show: true, author, message });
    document.getElementById('message')?.focus();
  }

  function cancelReply() {
    setReplyState(prevState => ({ ...prevState, show: false }));
  }

  return (
    <>
      <SkipLink href="#message">Skip to message textfield</SkipLink>

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
              id={message.id}
              text={message.text}
              photo={message.photo}
              photoAlt={message.photoAlt}
              repliedMessage={message.repliedMessage}
              avatar={members[message.authorId]?.avatar}
              isSelf={message.authorId === userId}
              mergePrevBubble={message.authorId === prevAuthorId}
              mergeNextBubble={message.authorId === nextAuthorId}
              isInfo={!message.authorId}
              alt={members[message.authorId]?.alt}
              onZoomImage={openImageDialog}
              onDelete={() => deleteMessage(message.id)}
              onReply={() =>
                reply({
                  author: members[message.authorId],
                  message,
                })
              }
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

      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Paper
          variant="outlined"
          className={clsx(
            classes.replyPreview,
            replyState.show && classes.showReply
          )}
        >
          <div>
            <Typography noWrap color="primary" variant="subtitle2">
              {replyState?.author?.name}
            </Typography>
            <Typography noWrap variant="body1">
              {replyState?.message?.text}
            </Typography>
          </div>

          {replyState?.message?.photo && (
            <div>
              <Avatar className={classes.replyPhoto} variant="square">
                <Image width={64} height={64} {...replyState.message.photo} />
              </Avatar>
            </div>
          )}

          <IconButton
            aria-label="cancel reply"
            className={classes.replyCancelButton}
            size="small"
            onClick={cancelReply}
            color="inherit"
          >
            <Close aria-hidden="true"></Close>
          </IconButton>
        </Paper>

        <Paper
          variant="outlined"
          className={clsx(
            classes.photoUpload,
            photoUploadPreviewState.show && classes.photoUploadShow,
            photoUploadPreviewState.show &&
              replyState.show &&
              classes.photoUploadShowWithReply
          )}
        >
          <Avatar
            variant="square"
            className={classes.photoUploadAvatar}
            alt="photo upload preview"
            src={photoUploadPreviewState.src}
          />

          <IconButton
            aria-label="cancel photo upload"
            className={classes.replyCancelButton}
            size="small"
            onClick={closePhotoUpload}
          >
            <Close aria-hidden="true" />
          </IconButton>
        </Paper>

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
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    name="photo"
                    ref={register}
                    hidden
                    onChange={event => {
                      if (event.target.value) {
                        showPhotoUploadPreview();
                      }
                      console.log(event.target.value);
                    }}
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

      <Dialog
        fullScreen
        open={photoDialogState.open}
        onClose={closeImageDialog}
      >
        <IconButton
          aria-label="close dialog"
          className={classes.closeImageDialogButton}
          onClick={closeImageDialog}
          color="inherit"
        >
          <Close aria-hidden="true" />
        </IconButton>
        <Image
          alt={photoDialogState.alt || 'media'}
          preview={photoDialogState.preview}
          sources={photoDialogState.sources}
          width={photoDialogState.width}
          height={photoDialogState.height}
        />
      </Dialog>
    </>
  );
};

export default withPrivateRoute(Chats);
