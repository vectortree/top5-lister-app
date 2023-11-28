import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DeleteListModal(props) {
  const [open, setOpen] = React.useState(false);
  const { listMarkedForDeletion, deleteMarkedListCallback, unmarkListForDeletionCallback } = props;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let name = "";
  if (listMarkedForDeletion !== null) {
    name = listMarkedForDeletion.name;
  }
  let flag = false;
  if(listMarkedForDeletion !== null) {
    flag = true;
  }
  function handleDeleteList(event) {
    deleteMarkedListCallback();
  }
  function handleCloseModal(event) {
    handleClose();
    unmarkListForDeletionCallback();
  }

  return (
    <div>
      <Modal
        open={flag}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography style={{display: 'block', maxWidth: 400, wordBreak: 'break-word'}} id="modal-modal-title" variant="h6" component="h2">
              Delete the {name} Top 5 List?
          </Typography>
          <Grid container justifyContent="flex-end">
          <Button onClick={handleDeleteList} variant="contained">Confirm</Button>
          <Button onClick={handleCloseModal} variant="contained">Cancel</Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
