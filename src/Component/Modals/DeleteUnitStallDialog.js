import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

function DeleteDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="cancel-dialog-title"
    >
      <DialogTitle id="cancel-dialog-title">{"Delete Stall Unit"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to TRASH this Stall Unit? Data will be lost forever.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          No
        </Button>
        <Button onClick={onClose} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
