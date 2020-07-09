import React, { useState } from 'react';
import {
  Drawer,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Typography,
  Button,
  List,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';

import { useStyles } from './styles';
import Image from '../Image';
import { Close } from '@material-ui/icons';

const ChatDrawer = ({
  chat,
  members: _members,
  open,
  onClose,
  className = undefined,
  ...otherProps
}) => {
  const classes = useStyles();

  const members = Object.keys(_members).reduce(
    (acc, id) => [...acc, _members[id]],
    []
  );

  console.log({ chat });
  console.log({ members });

  return (
    <Drawer anchor="right" open={open} onClose={onClose} {...otherProps}>
      <div className={classes.drawerContent}>
        <IconButton
          className={classes.closeButton}
          aria-label="close group info drawer"
          onClick={onClose}
          color="inherit"
        >
          <Close aria-hidden="true" />
        </IconButton>
        {chat ? (
          <div className={classes.chatBanner}>
            <div className={classes.chatBannerAvatarContainer}>
              <Avatar variant="square" className={classes.chatBannerAvatar}>
                <Image
                  preview={chat?.avatar?.preview}
                  sources={chat?.avatar?.sources}
                  alt=""
                  width={200}
                  height={200}
                />
              </Avatar>
            </div>
            <div className={classes.chatBannerText}>
              <Typography variant="h5" component="h1">
                {chat.name}
              </Typography>
            </div>
          </div>
        ) : (
          <></>
        )}

        <Typography
          className={classes.membersTitle}
          variant="subtitle1"
          component="h2"
        >
          {members.length} members
        </Typography>
        <List className={classes.membersList}>
          {members.map(member => (
            <ListItem alignItems="flex-start" key={member.id}>
              <ListItemAvatar>
                <Avatar>
                  <Image
                    preview={member?.avatar?.preview}
                    sources={member?.avatar?.sources}
                    alt=""
                    width={64}
                    height={64}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    {member.name}
                    {member.role === 'admin' && (
                      <>
                        {' '}
                        <span className={classes.adminBadge}>admin</span>
                      </>
                    )}
                  </>
                }
                secondary={member.email}
              />
            </ListItem>
          ))}
        </List>
      </div>

      <div className={classes.bottomButtons}>
        <Button color="inherit" variant="outlined">
          Leave group
        </Button>
        <Button color="primary" variant="contained">
          Add member
        </Button>
      </div>
    </Drawer>
  );
};

export default ChatDrawer;
