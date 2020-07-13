import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from '@material-ui/core';

import Image from '../Image';

const UserCheckList = ({ users, checked, onCheck, ...otherProps }) => {
  return (
    <List {...otherProps}>
      {users &&
        users.map(user => {
          const labelId = `user-${user.id}`;
          return (
            <ListItem key={user.id} button onClick={onCheck(user.id)}>
              <ListItemAvatar>
                <Avatar>
                  {user && (
                    <Image
                      preview={user.avatar?.preview}
                      sources={user.avatar?.sources}
                      alt={user?.alt}
                      width={40}
                      height={40}
                    />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                id={labelId}
                primary={user.name}
                secondary={user.email}
              />
              <ListItemSecondaryAction tabIndex={-1}>
                <Checkbox
                  edge="end"
                  checked={checked.indexOf(user.id) !== -1}
                  onChange={onCheck(user.id)}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
    </List>
  );
};

export default UserCheckList;
