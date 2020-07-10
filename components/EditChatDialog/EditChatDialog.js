import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

import { useFirebase } from '../../hooks/useFirebase';
import getQueryParams from '../../utils/getQueryParams';
import AvatarEdit from '../AvatarEdit';
import { useStyles } from './styles';

const EditChatDialog = ({
  open,
  onAccept,
  onReject,
  src = undefined,
  name: _name = undefined,
}) => {
  const classes = useStyles();
  const { handleSubmit, register, setValue } = useForm();
  const firebase = useFirebase();

  const [name, setName] = useState(_name);

  useEffect(() => {
    setName(_name);
  }, [_name]);

  function _onAccept(event) {
    onAccept(event);
  }

  function _onReject(event) {
    onReject(event);
  }

  async function updateChat({ avatar }) {
    try {
      const chatId = getQueryParams().chatId;

      const [firestore, storage] = await Promise.all([
        firebase.firestore(),
        firebase.storage(),
      ]);

      firestore.collection('chats').doc(chatId).update({
        name,
      });

      if (avatar && avatar[0]) {
        storage
          .ref()
          .child(`avatars/chats/${chatId}/${avatar[0].name}`)
          .put(avatar[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={_onReject}
      maxWidth="sm"
      fullWidth
      aria-label="Edit chat avatar and title"
    >
      <form onSubmit={handleSubmit(updateChat)}>
        <DialogContent className={classes.dialogContent}>
          <AvatarEdit register={register} src={src} />

          <TextField
            className={classes.titleTextField}
            variant="outlined"
            label="Group name"
            name="title"
            type="text"
            id="group-title"
            value={name}
            onChange={event => {
              setName(event.currentTarget.value);
              setValue('title', event.currentTarget.value);
            }}
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

export default EditChatDialog;
