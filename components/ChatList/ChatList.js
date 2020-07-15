import React from 'react';
import Link from 'next/link';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Typography,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import Image from '../Image';
import { useStyles } from './styles';

const ChatList = ({ chats, ...otherProps }) => {
  const classes = useStyles();

  return (
    <List {...otherProps}>
      {!chats ? (
        [...new Array(12)].map((chat, chatIndex, chats) => (
          <React.Fragment key={chatIndex}>
            <ListItem
              alignItems="center"
              className={classes.chatListItem}
              component="a"
              role="listitem"
              button
            >
              <ListItemAvatar>
                <Skeleton
                  animation="wave"
                  variant="circle"
                  width={40}
                  height={40}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Skeleton
                    className={classes.textSkeleton}
                    animation="wave"
                    variant="text"
                    width="33%"
                  />
                }
                secondary={
                  <Skeleton
                    className={classes.textSkeleton}
                    animation="wave"
                    variant="text"
                    width="45%"
                  />
                }
              />
            </ListItem>
            {chatIndex < chats.length - 1 && (
              <Divider component="li" aria-hidden="true" />
            )}
          </React.Fragment>
        ))
      ) : chats?.length === 0 ? (
        <div className={classes.noChats}>
          <Typography
            className={classes.noChatsText}
            variant="body1"
            component="p"
          >
            You are not part of any chats yet ¯\_(ツ)_/¯
          </Typography>
        </div>
      ) : (
        chats.map((chat, chatIndex) => (
          <React.Fragment key={chat?.id}>
            <Link href={`/chat?chatId=${chat?.id}`} passHref>
              <ListItem
                alignItems="center"
                className={classes.chatListItem}
                button
                component="a"
                role="listitem"
              >
                <ListItemAvatar>
                  {chat?.avatar?.preview ? (
                    <Avatar>
                      <Image
                        sources={chat?.avatar?.sources}
                        preview={chat?.avatar?.preview}
                        alt={chat?.alt}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                  ) : (
                    <Skeleton
                      animation="wave"
                      variant="circle"
                      width={40}
                      height={40}
                    />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={chat?.name}
                  secondary={chat?.lastMessage?.text}
                />
              </ListItem>
            </Link>
            {chatIndex < chats.length - 1 && (
              <Divider aria-hidden="true" component="li" />
            )}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default ChatList;
