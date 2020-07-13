import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import Image from '../Image';
import { useStyles } from './styles';

const ChatInfo = ({ chat }) => {
  const classes = useStyles();

  return (
    <ListItem alignItems="center" className={classes.chatInfo}>
      <ListItemAvatar>
        {chat ? (
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
            className={classes.circleSkeleton}
            animation="wave"
            variant="circle"
            width={40}
            height={40}
          />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={
          (
            <Typography variant="h6" component="h1">
              {chat?.name}
            </Typography>
          ) || (
            <Skeleton
              className={classes.textSkeleton}
              animation="wave"
              variant="text"
              width={100}
              height={24}
            />
          )
        }
      />
    </ListItem>
  );
};

export default ChatInfo;
