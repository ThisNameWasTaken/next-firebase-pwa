import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  chatListItem: {
    color: 'inherit',
  },
  textSkeleton: {
    height: '1rem',
    borderRadius: 2,
  },
  noChats: {
    height: 'calc(var(--vh, 1vh) * 100 - 72px - 48px - 72px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    color: theme.palette.grey[600],
  },
}));

export { useStyles };
