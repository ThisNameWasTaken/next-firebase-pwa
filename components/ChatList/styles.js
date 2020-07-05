import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  chatListItem: {
    color: 'inherit',
  },
  textSkeleton: {
    height: '1rem',
    borderRadius: 2,
  },
}));

export { useStyles };
