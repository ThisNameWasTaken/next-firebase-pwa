import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  chatInfo: {
    padding: 0,
  },
  textSkeleton: {
    height: '1rem',
    borderRadius: 2,
    backgroundColor: theme.palette.getContrastText(
      theme.palette.background.default
    ),
    opacity: 0.12,
  },
  circleSkeleton: {
    backgroundColor: theme.palette.getContrastText(
      theme.palette.background.default
    ),
    opacity: 0.12,
    borderRadius: '50%',
  },
}));

export { useStyles };
