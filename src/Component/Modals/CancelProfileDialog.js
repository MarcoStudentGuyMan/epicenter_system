import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

function CancelDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="cancel-dialog-title"
    >
      <DialogTitle id="cancel-dialog-title">{"Cancel Profile"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to cancel these profile changes?
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

export default CancelDialog;
