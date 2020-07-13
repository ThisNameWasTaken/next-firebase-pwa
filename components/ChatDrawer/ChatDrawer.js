import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Typography,
  Button,
  List,
  Divider,
  ListItemSecondaryAction,
  MenuItem,
  Menu,
} from '@material-ui/core';
import { Close, MoreVert } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';
import { get as getCookie } from 'js-cookie';

import { useStyles } from './styles';
import Image from '../Image';

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

  const userId = getCookie('uid');
  const isAdmin = _members[userId]?.role === 'admin';

  const [menuAnchor, setMenuAnchor] = useState(undefined);

  const [memberIdAction, setMemberIdAction] = useState(undefined);

  const openMenu = (event, memberId) => {
    console.log('open menu');
    console.log(event);
    console.log(event.target);
    console.log(event.currentTarget);
    setMenuAnchor(event.target);
    // setMemberIdAction(memberId);
  };

  const closeMenu = action => {
    console.log('close menu');
    setMenuAnchor(undefined);

    if (action === 'make admin') {
      // memberIdAction
    } else if (action === 'remove') {
      // memberIdAction
    }
  };

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
                  alt={chat?.alt}
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
          {members.map((member, index) => (
            <React.Fragment key={member.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <Image
                      preview={member?.avatar?.preview}
                      sources={member?.avatar?.sources}
                      alt={member?.alt}
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
                {isAdmin && (
                  <ListItemSecondaryAction>
                    <IconButton
                      className={classes.memberActions}
                      onClick={event => openMenu(event, member.id)}
                      aria-controls="edit-member-menu"
                      aria-haspopup="true"
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {index < members.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </div>

      {console.log({ menuAnchor })}
      <Menu
        id="edit-member-menu"
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={closeMenu}
      >
        <MenuItem onClick={event => closeMenu('make admin')}>
          Make admin
        </MenuItem>
        <MenuItem onClick={event => closeMenu('remove')}>
          Remove from group
        </MenuItem>
      </Menu>

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
