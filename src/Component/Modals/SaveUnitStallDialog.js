import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

function SaveUnitStallDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="save-dialog-title"
    >
      <DialogTitle id="save-dialog-title">{"Save Stall Unit"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to save these Stall Unit changes?
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

export default SaveUnitStallDialog;
