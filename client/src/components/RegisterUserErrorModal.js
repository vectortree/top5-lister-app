import * as React from 'react';
import Alert from '@mui/material/Alert';
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

export default function RegisterUserErrorModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const { errorMsg, setRegisterUserErrorCallback, registerUserError } = props;
  const handleClose = () => {
      setOpen(false);
      setRegisterUserErrorCallback();
  }

  return (
    <div>
      <Modal
        open={registerUserError}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          <Alert severity="warning">Registration Error</Alert>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {errorMsg}
          </Typography>
          <Grid container justifyContent="flex-end">
          <Button onClick={handleClose} variant="contained">OK</Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
