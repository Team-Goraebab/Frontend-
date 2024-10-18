'use client';

import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';
import ModalButton from '@/components/button/ModalButton';

interface ContainerNameModalProps {
  open: boolean;
  containerName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
  onChange: (name: string) => void;
}

const ContainerNameModal: React.FC<ContainerNameModalProps> = ({
  open,
  containerName,
  onClose,
  onSave,
  onChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>컨테이너 이름</DialogTitle>
      <DialogContent>
        <p style={{ marginBottom: '16px', color: '#999999' }}>
          컨테이너 이름은 필수가 아니며, 입력하지 않을 경우 랜덤으로 부여됩니다.
        </p>
        <TextField
          fullWidth
          variant="outlined"
          label="컨테이너 이름"
          value={containerName}
          onChange={(e) => onChange(e.target.value)}
          sx={{ marginTop: 1 }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexGrow: 0,
        }}
      >
        <Button onClick={onClose} color="primary">
          취소
        </Button>
        <ModalButton onClick={() => onSave(containerName)}>저장</ModalButton>
      </DialogActions>
    </Dialog>
  );
};

export default ContainerNameModal;
