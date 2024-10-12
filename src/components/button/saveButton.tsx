'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box
} from '@mui/material';

const SaveButton = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');

  const handleSave = async () => {
    const mainContent = document.querySelector('main')?.innerHTML;

    if (!mainContent) {
      showSnackbar(
        enqueueSnackbar,
        '빈 설계도는 저장할 수 없습니다.',
        'error',
        '#FF4848'
      );
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(mainContent, 'text/html');

    const wrapper = doc.querySelector('.react-transform-wrapper');
    const component = doc.querySelector('.react-transform-component');

    if (wrapper && component) {
      const hasOtherContent =
        wrapper.innerHTML.trim().length > 0 ||
        component.innerHTML.trim().length > 0;

      if (!hasOtherContent) {
        showSnackbar(
          enqueueSnackbar,
          '유효하지 않은 설계도는 저장할 수 없습니다.',
          'error',
          '#FF4848'
        );
        return;
      }
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!blueprintName.trim()) {
      showSnackbar(
        enqueueSnackbar,
        '설계도 이름을 입력해주세요.',
        'error',
        '#FF4848'
      );
      return;
    }

    const mainContent = document.querySelector('main')?.innerHTML;
    if (!mainContent) return;

    try {
      const response = await fetch('/storage/{storageId}/blueprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: blueprintName,
          data: mainContent,
        }),
      });

      if (response.ok) {
        showSnackbar(
          enqueueSnackbar,
          '설계도가 성공적으로 저장되었습니다!',
          'success',
          '#254b7a'
        );
        setIsModalOpen(false);
        setBlueprintName('');
      } else {
        throw new Error('서버 응답 오류');
      }
    } catch (error) {
      showSnackbar(
        enqueueSnackbar,
        '설계도 저장 중 오류가 발생했습니다.',
        'error',
        '#FF4848'
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 8,
          right: '40px',
          transform: 'translateX(4px)',
          bgcolor: 'white',
          color: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'white',
          },
          '&:active': {
            bgcolor: 'primary.dark',
          },
          borderRadius: '8px',
          boxShadow: 3,
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Button
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            height: '40px',
            px: 2,
            fontWeight: 'medium',
          }}
        >
          Save
        </Button>
      </Box>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>설계도 저장</DialogTitle>
        <DialogContent>
          <DialogContentText>
            설계도의 이름을 입력해주세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="설계도 이름"
            type="text"
            fullWidth
            variant="standard"
            value={blueprintName}
            onChange={(e) => setBlueprintName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>취소</Button>
          <Button onClick={handleSubmit}>저장</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaveButton;
