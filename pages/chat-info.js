import React, { useState, useEffect } from 'react';

import useMembers from '../hooks/useMembers';
import useChat from '../hooks/useChat';
import getQueryParams from '../utils/getQueryParams';

import {
  makeStyles,
  fade,
  Fab,
  AppBar,
  Toolbar,
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
import { MoreVert, PersonAdd, ExitToApp, Edit } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';
import { get as getCookie } from 'js-cookie';

import Image from '../components/Image';
import BackButton from '../components/BackButton';

const useStyles = makeStyles(theme => ({
  toolBar: {
    color: theme.palette.primary.main,
    background: theme.palette.primary.contrastText,
    padding: 0,
  },
  content: {
    marginTop: 56,
    marginBottom: 64,
    maxWidth: 700,
    margin: 'auto',
    display: 'block',
  },
  membersList: {
    padding: 0,
  },
  adminBadge: {
    // border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.main,
    background: fade(theme.palette.primary.main, 0.08),
    padding: theme.spacing(0.5, 1),
  },
  chatBanner: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
  },
  chatBannerAvatarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chatBannerAvatar: {
    width: '100%',
    height: '100%',
  },
  chatBannerText: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, .4)',
    padding: theme.spacing(1, 2),
    zIndex: 1,
    color: '#fff',

    '& > div': {
      position: 'relative',
    },
  },
  editChatButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  hasEditButton: {
    paddingRight: 48,
  },
  leaveGroupButton: {
    color: theme.palette.error.dark,
    // marginLeft: 'auto',
    // display: 'block',
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
  },
  leaveGroupButtonLabel: {
    transform: 'translateY(2px)',
  },
  membersTitle: {
    color: theme.palette.primary.main,
    margin: theme.spacing(1, 2, -1, 2),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1,
  },
  fabIcon: {
    marginRight: theme.spacing(1),
  },
  memberActions: {
    marginRight: theme.spacing(-2),
  },
}));

const ChatInfo = () => {
  const { chatId } = getQueryParams();

  const { chat } = useChat();

  const { members: _members } = useMembers({ chatId });

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
    console.log(event.currentTarget);
    setMenuAnchor(event.currentTarget);
    setMemberIdAction(memberId);
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
    <>
      <div className={classes.content}>
        <AppBar position="fixed">
          <Toolbar className={classes.toolBar}>
            <BackButton color="inherit" />
            {/* <div style={{ marginLeft: 'auto' }} /> */}
            <Button
              className={classes.leaveGroupButton}
              variant="text"
              color="inherit"
              endIcon={<ExitToApp aria-hidden="true" />}
            >
              <span className={classes.leaveGroupButtonLabel}>Leave group</span>
            </Button>
          </Toolbar>
        </AppBar>
        {chat ? (
          <div className={classes.chatBanner}>
            <div className={classes.chatBannerAvatarContainer}>
              <Avatar variant="square" className={classes.chatBannerAvatar}>
                <Image
                  preview={chat?.avatar?.preview}
                  sources={chat?.avatar?.sources}
                  alt=""
                  width={'min(100vw, 700px'}
                  height={'min(100vw, 700px'}
                />
              </Avatar>
            </div>
            <div className={classes.chatBannerText}>
              <div className={isAdmin && classes.hasEditButton}>
                <Typography variant="h4" component="h1">
                  {chat.name}
                </Typography>
                {isAdmin && (
                  <IconButton
                    className={classes.editChatButton}
                    color="inherit"
                    aria-label="edit chat title and avatar"
                  >
                    <Edit aria-hidden="true" />
                  </IconButton>
                )}
              </div>
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

      <Fab className={classes.fab} variant="extended" color="primary">
        <PersonAdd className={classes.fabIcon} />
        Add member
      </Fab>
    </>
  );
};

export default ChatInfo;
