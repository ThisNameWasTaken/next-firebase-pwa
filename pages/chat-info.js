import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import head from 'next/head';

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
} from '@material-ui/core';
import { MoreVert, PersonAdd, ExitToApp, Edit } from '@material-ui/icons';
import { get as getCookie } from 'js-cookie';

import Image from '../components/Image';
import BackButton from '../components/BackButton';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';
import Head from 'next/head';
import SkipLink from '../components/SkipLink';

// Menu
const Menu = dynamic(() => import('@material-ui/core/Menu'), {
  // This has to be enabled so that the component mounts correctly the first time
  // ssr: false,
});
const MenuItem = dynamic(() => import('@material-ui/core/MenuItem'), {
  ssr: false,
});

// Dialogs
const EditChatDialog = dynamic(() => import('../components/EditChatDialog'), {
  ssr: false,
});

const AddMemberDialog = dynamic(() => import('../components/AddMemberDialog'), {
  ssr: false,
});

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
  avatarLoading: {
    background: 'transparent',
  },
  chatBannerAvatarSkeleton: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
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
  textSkeleton: {
    backgroundColor: 'currentColor',
    width: 260,
    opacity: 0.54,
    borderRadius: 8,
  },
  textSkeletonChatName: {
    opacity: 0.89,
  },
  textSkeletonMembers: {
    width: 100,
    borderRadius: 4,
  },
  memberListItemPrimaryTextSkeleton: {
    background: `rgba(0, 0, 0, .22)`,
  },
  memberListItemSecondaryTextSkeleton: {
    background: `rgba(0, 0, 0, .18)`,
  },
}));

const ChatInfo = () => {
  const { chatId } = getQueryParams();

  const { chat } = useChat();

  const { members: _members, leaveChat, addAdmin, removeMember } = useMembers({
    chatId,
  });

  const classes = useStyles();

  const [members, setMembers] = useState([]);

  const userId = getCookie('uid');
  const [isAdmin, setIsAdmin] = useState(false);

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
      addAdmin(memberIdAction);
    } else if (action === 'remove') {
      removeMember(memberIdAction);
    }
  };

  useEffect(() => {
    setMembers(
      Object.keys(_members).reduce((acc, id) => [...acc, _members[id]], [])
    );
    setIsAdmin(_members[userId]?.role === 'admin');
  }, [_members]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  function openEditDialog() {
    setIsEditDialogOpen(true);
  }

  function closeEditDialog(data) {
    setIsEditDialogOpen(false);
  }

  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  function openAddMemberDialog() {
    setIsAddMemberDialogOpen(true);
  }

  function closeAddMemberDialog(data) {
    setIsAddMemberDialogOpen(false);
  }

  return (
    <>
      <SkipLink href="#members-list">Skip to members list</SkipLink>
      <SkipLink href="#add-members">Skip to add members</SkipLink>

      <Head>
        <link rel="prefetch" href={chat?.avatar?.sources[720].initial} />
      </Head>

      <div className={classes.content}>
        <AppBar position="fixed">
          <Toolbar className={classes.toolBar}>
            <BackButton color="inherit" />
            <Button
              className={classes.leaveGroupButton}
              variant="text"
              color="inherit"
              endIcon={<ExitToApp aria-hidden="true" />}
              onClick={leaveChat}
            >
              <span className={classes.leaveGroupButtonLabel}>Leave chat</span>
            </Button>
          </Toolbar>
        </AppBar>

        <div className={classes.chatBanner}>
          <div className={classes.chatBannerAvatarContainer}>
            <Avatar
              variant="square"
              className={clsx(
                classes.chatBannerAvatar,
                !chat && classes.avatarLoading
              )}
            >
              {chat ? (
                <Image
                  preview={chat?.avatar?.preview}
                  sources={chat?.avatar?.sources}
                  alt={chat?.alt}
                  width={'min(100vw, 700px)'}
                  height={'min(100vw, 700px)'}
                />
              ) : (
                <Skeleton
                  animation="wave"
                  variant="rect"
                  className={classes.chatBannerAvatarSkeleton}
                />
              )}
            </Avatar>
          </div>
          <div className={classes.chatBannerText}>
            <div className={isAdmin && classes.hasEditButton}>
              <Typography variant="h4" component="h1">
                {chat?.name || (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    className={clsx(
                      classes.textSkeleton,
                      classes.textSkeletonChatName
                    )}
                  />
                )}
              </Typography>
              {isAdmin && (
                <IconButton
                  className={classes.editChatButton}
                  color="inherit"
                  aria-label="edit chat title and avatar"
                  onClick={openEditDialog}
                >
                  <Edit aria-hidden="true" />
                </IconButton>
              )}
            </div>
          </div>
        </div>

        <Typography
          className={classes.membersTitle}
          variant="subtitle1"
          component="h2"
        >
          {members?.length ? (
            `${members.length} members`
          ) : (
            <Skeleton
              animation="wave"
              variant="text"
              className={clsx(
                classes.textSkeleton,
                classes.textSkeletonMembers
              )}
            />
          )}
        </Typography>

        <List id="members-list" className={classes.membersList}>
          {!members?.length
            ? [...new Array(6)].map((chat, chatIndex, chats) => (
                <React.Fragment key={chatIndex}>
                  <ListItem
                    alignItems="center"
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
                          className={clsx(
                            classes.textSkeleton,
                            classes.memberListItemPrimaryTextSkeleton
                          )}
                          animation="wave"
                          variant="text"
                          width="33%"
                        />
                      }
                      secondary={
                        <Skeleton
                          className={clsx(
                            classes.textSkeleton,
                            classes.memberListItemSecondaryTextSkeleton
                          )}
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
            : members.map((member, index) => (
                <React.Fragment key={member.id}>
                  <ListItem alignItems="flex-start" role="listitem" button>
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
                          aria-label="show member actions"
                        >
                          <MoreVert aria-hidden="true" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  {index < members.length - 1 && (
                    <Divider component="li" aria-hidden="true" />
                  )}
                </React.Fragment>
              ))}
        </List>
      </div>

      <Menu
        id="edit-member-menu"
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={closeMenu}
        keepMounted
      >
        <MenuItem onClick={event => closeMenu('make admin')}>
          Make admin
        </MenuItem>
        <MenuItem onClick={event => closeMenu('remove')}>
          Remove from group
        </MenuItem>
      </Menu>

      <Fab
        id="add-members"
        className={classes.fab}
        variant="extended"
        color="secondary"
        onClick={openAddMemberDialog}
      >
        <PersonAdd className={classes.fabIcon} />
        Add member
      </Fab>

      <EditChatDialog
        open={isEditDialogOpen}
        onAccept={closeEditDialog}
        onReject={closeEditDialog}
        src={chat?.avatar?.sources[720].initial}
        name={chat?.name}
      />

      <AddMemberDialog
        open={isAddMemberDialogOpen}
        onAccept={closeAddMemberDialog}
        onReject={closeAddMemberDialog}
      />
    </>
  );
};

export default ChatInfo;
