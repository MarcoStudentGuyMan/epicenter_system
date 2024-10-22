import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { pencil, trash } from 'ionicons/icons';
import { Modal, Typography, Box, Button, TableRow, TableCell } from '@mui/material'; // Import TableRow and TableCell from Material-UI

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const StallRow = ({ unit_id, unit_name, unit_price, unit_status, handleDelete, navigate }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    handleDelete(unit_id); // Call the delete function with the unit_id
  };

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>{unit_id}</TableCell>
        <TableCell>{unit_name}</TableCell>
        <TableCell>{unit_price}</TableCell>
        <TableCell>{unit_status ? 'Occupied' : 'Not Occupied'}</TableCell>
        <TableCell>
          <div className="action-buttons">

            
          <Button 
              className="edit-btn" 
              onClick={() => navigate(`/edit_unit_stall_admin/${unit_id}`)}
              style={{
                backgroundColor: '#FFC107', // Yellow color
                color: '#000', // Black text
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <IonIcon icon={pencil} className="edit" />
              <span>Edit</span>
            </Button>

            <Button 
              className="delete-btn" 
              onClick={() => setDeleteDialogOpen(true)}
              style={{
                backgroundColor: '#FF0000', // Red color
                color: '#FFF', // White text
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <IonIcon icon={trash} />
              <span>Delete</span>
            </Button>

          </div>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Are you sure you want to delete this stall unit?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button onClick={confirmDelete} variant="contained" color="error">Delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="contained" color="primary">Cancel</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default StallRow;
