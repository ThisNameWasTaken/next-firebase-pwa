import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import Image from '../Image';
import { useStyles } from './styles';

const UserInfo = ({ user }) => {
  const classes = useStyles();

  return (
    <ListItem alignItems="center" className={classes.userInfo}>
      <ListItemAvatar>
        {user?.avatar ? (
          <Avatar>
            <Image
              sources={user?.avatar?.sources}
              preview={user?.avatar?.preview}
              alt={user?.alt}
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
          user?.name || (
            <Skeleton
              className={classes.textSkeleton}
              animation="wave"
              variant="text"
              width={100}
              height={24}
            />
          )
        }
        secondary={
          <span className={classes.userInfoSecondary}>
            {user?.email || (
              <Skeleton
                className={classes.textSkeleton}
                animation="wave"
                variant="text"
                width={160}
                height={19}
              />
            )}
          </span>
        }
      />
    </ListItem>
  );
};

export default UserInfo;
