import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

import { useFirebase } from '../../hooks/useFirebase';
import { useStyles } from './styles';
import useUsers from '../../hooks/useUsers';
import UserCheckList from '../UserCheckList';
import useMembers from '../../hooks/useMembers';
import getQueryParams from '../../utils/getQueryParams';

const AddMemberDialog = ({ open, onAccept, onReject }) => {
  const classes = useStyles();
  const firebase = useFirebase();

  const { chatId } = getQueryParams();

  const users = useUsers({ excludeSelf: true });
  const [checked, setChecked] = React.useState([]);
  const { members } = useMembers({ chatId });
  const [nonMembers, setNonMembers] = useState([]);

  useEffect(() => {
    if (users && members) {
      setNonMembers(users.filter(user => !members[user.id]));
    }
  }, [users, members]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  function _onAccept(event) {
    onAccept(event);
  }

  function _onReject(event) {
    onReject(event);
  }

  async function updateMembers(event) {
    event.preventDefault();

    console.log({ nonMembers });
    console.log({ checked });

    const firestore = await firebase.firestore();

    checked.forEach(id => {
      firestore
        .collection('chats')
        .doc(chatId)
        .collection('members')
        .doc(id)
        .set({ role: 'member' })
        .then(data => {
          console.log('added', data);
        })
        .catch(console.error);
    });
  }

  return (
    <Dialog
      open={open}
      onClose={_onReject}
      maxWidth="sm"
      fullWidth
      aria-label="Edit chat avatar and title"
    >
      <form onSubmit={updateMembers}>
        <DialogContent className={classes.dialogContent}>
          <UserCheckList
            users={nonMembers}
            checked={checked}
            onCheck={handleToggle}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={_onReject} color="primary">
            Cancel
          </Button>
          <Button onClick={_onAccept} color="primary" type="submit">
            Confirm changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMemberDialog;
