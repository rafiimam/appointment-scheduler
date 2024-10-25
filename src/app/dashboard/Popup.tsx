import { Dialog, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface PopupProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function Popup({ open, message, onClose }: PopupProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
}