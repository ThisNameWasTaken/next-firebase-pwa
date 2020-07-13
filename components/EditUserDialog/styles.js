import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    padding: 12,
    '&:first-child': {
      paddingTop: 12,
    },
  },
  titleTextField: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

export { useStyles };
