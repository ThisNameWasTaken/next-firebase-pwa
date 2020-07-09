import { makeStyles, fade } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  drawerContent: {
    width: 300,
    position: 'relative',
    height: 'calc(100% - 54px)',
    overflowY: 'scroll',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 99,
    color: '#fff',
    background: 'rgba(0, 0, 0, .2)',

    '&:focus, &:hover': {
      background: 'rgba(0, 0, 0, .4)',
    },
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
  },
  membersTitle: {
    color: theme.palette.primary.main,
    margin: theme.spacing(2, 2, -1, 2),
  },
  bottomButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
    color: theme.palette.error.main,
    background: theme.palette.background.default,
  },
}));

export { useStyles };
