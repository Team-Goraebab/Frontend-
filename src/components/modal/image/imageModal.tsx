'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tab,
  Tabs,
  TextField,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FolderOpen, Label, Description, Delete, Hub } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import { showSnackbar } from '@/utils/toastUtils';
import { DockerHubContent } from '@/components';
import ModalButton from '@/components/button/ModalButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    name: string,
    tag: string,
    file: File | null,
    size: string,
    source: 'local' | 'dockerHub',
    dockerImageInfo?: any
  ) => void;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageModal = ({ isOpen, onClose, onSave }: ModalProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setName('');
      setTag('');
      setSize('');
      setActiveTab(0);
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (file: File | null) => {
    if (file) {
      const validExtensions = ['.tar', '.tar.gz', '.tar.bz2', '.tar.xz'];
      const isValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isValidExtension) {
        showSnackbar(
          enqueueSnackbar,
          'tar, tar.gz, tar.bz2, tar.xz 파일만 업로드 가능합니다.',
          'error',
          '#FF4853'
        );
        return;
      }

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      if (parseFloat(fileSizeMB) > 5000) {
        showSnackbar(
          enqueueSnackbar,
          '파일 용량이 5000MB를 초과했습니다.',
          'error',
          '#FF4853'
        );
      } else {
        setFile(file);
        setSize(fileSizeMB);
      }
    } else {
      setFile(null);
      setSize('');
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setSize('');
  };

  const validateInputs = () => {
    if (!file && activeTab === 0) {
      showSnackbar(enqueueSnackbar, '이미지를 선택해주세요.', 'error', '#FF4853');
      return false;
    }
    if (!name) {
      showSnackbar(enqueueSnackbar, '이름을 입력해주세요.', 'error', '#FF4853');
      return false;
    }
    if (!tag) {
      showSnackbar(enqueueSnackbar, '태그를 입력해주세요.', 'error', '#FF4853');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateInputs()) {
      const id = uuidv4();
      if (activeTab === 0 && file) {
        onSave(id, name, tag, file, size, 'local');
      } else if (activeTab === 1) {
        const dockerImageInfo = {};
        onSave(id, name, tag, null, size, 'dockerHub', dockerImageInfo);
      }
      onClose();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (file && newValue === 1) {
      setIsWarningModalOpen(true);
    } else {
      setActiveTab(newValue);
    }
  };

  const handleWarningConfirm = () => {
    setFile(null);
    setSize('');
    setActiveTab(1);
    setIsWarningModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            {file ? (
              <Paper elevation={3} sx={{ p: 2, width: '100%', position: 'relative' }}>
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {size} MB
                </Typography>
                <Button
                  startIcon={<Delete />}
                  onClick={handleDeleteFile}
                  color="error"
                  variant="contained"
                  size="small"
                  sx={{ position: 'absolute', top: 25, right: 25 }}
                >
                  삭제
                </Button>
              </Paper>
            ) : (<Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              component="label"
            >
              <FolderOpen sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
              <Typography>파일을 드래그하거나 클릭하여 선택하세요</Typography>
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                accept=".tar,.tar.gz,.tar.bz2,.tar.xz"
              />
            </Box>
        )}
            </>);
      case 1:
        return <DockerHubContent />;
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" align="center">
            <Box component="span" fontWeight="bold" className="text-blue_6 font-pretendard">이미지</Box>
            <Box component="span" className="font-pretendard">를 불러올 방식을 선택하세요.</Box>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 2 }}>
            <Tab icon={<FolderOpen className="text-blue_6" />} label="Local Path" className="text-blue_6" />
            <Tab icon={<Hub className="text-blue_6" />} label="Docker Hub" className="text-blue_6" />
          </Tabs>
          {renderTabContent()}
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: <Description sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="태그 (쉼표로 구분)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              InputProps={{
                startAdornment: <Label sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button onClick={onClose} color="primary">
            취소
          </Button>
          <ModalButton onClick={handleSave}>저장하기</ModalButton>
        </DialogActions>
      </Dialog>

      <Dialog open={isWarningModalOpen} onClose={() => setIsWarningModalOpen(false)} sx={{ p:2 }}>
        <DialogTitle>경고</DialogTitle>
        <DialogContent>
          <Typography>
            로컬 파일이 이미 존재합니다. Docker Hub로 전환하면 현재 선택된 파일이 삭제됩니다. 계속하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p:2 }}>
          <Button onClick={() => setIsWarningModalOpen(false)} color="primary">
            취소
          </Button>
          <Button onClick={handleWarningConfirm} color="primary" variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ImageModal;
