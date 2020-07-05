import React from 'react';
import Link from 'next/link';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import Image from '../Image';
import useChats from '../../hooks/useChats';
import { useStyles } from './styles';

const ChatList = () => {
  const classes = useStyles();
  const chats = useChats();

  return (
    <List>
      {!chats
        ? [...new Array(12)].map((chat, chatIndex, chats) => (
            <React.Fragment key={chatIndex}>
              <ListItem
                alignItems="center"
                className={classes.chatListItem}
                component="a"
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
              {chatIndex < chats.length - 1 && <Divider />}
            </React.Fragment>
          ))
        : chats.map((chat, chatIndex) => (
            <React.Fragment key={chat.id}>
              <Link href="/chats/[id]" as={`/chats/${chat.id}`} passHref>
                <ListItem
                  alignItems="center"
                  className={classes.chatListItem}
                  component="a"
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Image
                        sources={chat.avatar.sources}
                        preview={chat.avatar.preview}
                        alt=""
                        width={64}
                        height={64}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={chat.name} />
                </ListItem>
              </Link>
              {chatIndex < chats.length - 1 && <Divider />}
            </React.Fragment>
          ))}
    </List>
  );
};

export default ChatList;