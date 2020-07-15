import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginRight: theme.spacing(1),
  },
}));

const RegisterInfo = ({ email, name, src, ...otherProps }) => {
  const classes = useStyles();

  return (
    <List {...otherProps}>
      <ListItem alignItems="center">
        <ListItemAvatar>
          <Avatar className={classes.avatar} src={src} />
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="h4">{name}</Typography>}
          secondary={<Typography variant="body1">{email}</Typography>}
        />
      </ListItem>
    </List>
  );
};

export default RegisterInfo;
