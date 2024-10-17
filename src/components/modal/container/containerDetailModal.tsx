'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import { FiRefreshCw, FiXSquare } from 'react-icons/fi';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';
import { FaPlay, FaStop } from 'react-icons/fa';
import axios from 'axios';
import { showSnackbar } from '@/utils/toastUtils';
import { formatDateTime } from '@/utils/formatTimestamp';

interface ContainerDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const ContainerDetailModal = ({
                                open,
                                onClose,
                                data,
                              }: ContainerDetailModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSnackbar(
      enqueueSnackbar,
      'Container ID copied to clipboard!',
      'info',
      '#254b7a',
    );
  };

  const truncateId = (id: string | undefined, length = 20) => {
    if (!id) return 'N/A';
    return id.length > length ? `${id.substring(0, length)}...` : id;
  };

  const handleAction = async (action: string) => {
    try {
      const response = await axios.post(
        `/api/container/${action}?id=${data?.Id}`,
      );
      showSnackbar(
        enqueueSnackbar,
        `Container ${action} successfully!`,
        'success',
        '#254b7a',
      );
    } catch (error) {
      showSnackbar(
        enqueueSnackbar,
        `Failed to ${action} container`,
        'error',
        '#d32f2f',
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{
      sx: {
        borderRadius: 3,
        padding: 3,
        backgroundColor: '#f9fafb',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
      },
    }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
          {`${data?.Name || 'Unknown Container'}`}
        </Typography>
        <div>
          <Tooltip title="Start Container">
            <IconButton onClick={() => handleAction('start')} size="small">
              <FaPlay style={{ color: '#4caf50' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Stop Container">
            <IconButton onClick={() => handleAction('stop')} size="small">
              <FaStop style={{ color: '#f44336' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Restart Container">
            <IconButton onClick={() => handleAction('restart')} size="small">
              <FiRefreshCw style={{ color: '#ff9800' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Kill Container">
            <IconButton onClick={() => handleAction('kill')} size="small">
              <FiXSquare style={{ color: '#d32f2f' }} />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333', mb: 1 }}>
            General Information
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ color: '#666', mr: 1 }}>
                Container ID:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                {truncateId(data?.Id)}
              </Typography>
              <Tooltip title="Copy ID">
                <IconButton onClick={() => handleCopyToClipboard(data?.Id)} size="small" sx={{ ml: 1 }}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Created: {formatDateTime(data?.Created)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: '#666' }}>
              Status: <strong>{data?.State?.Status || 'Unknown'}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Platform: {data?.Platform || 'Unknown'}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box my={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333', mb: 1 }}>
            Host Configuration
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: '#666' }}>
              Hostname Path: {truncateId(data?.HostConfig?.HostnamePath)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Hosts Path: {truncateId(data?.HostConfig?.HostsPath)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Log Path: {truncateId(data?.HostConfig?.LogPath)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Network Mode: {data?.HostConfig?.NetworkMode || 'Unknown'}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box my={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333', mb: 1 }}>
            Network Settings
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: '#666' }}>
              Sandbox ID: {truncateId(data?.NetworkSettings?.SandboxID)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              IP Address: {data?.NetworkSettings?.IPAddress || 'N/A'}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box my={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333', mb: 1 }}>
            State Information
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: '#666' }}>
              Started At: {formatDateTime(data?.State?.StartedAt)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Finished At: {formatDateTime(data?.State?.FinishedAt)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Restart Count: {data?.RestartCount || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Exit Code: {data?.State?.ExitCode || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ borderRadius: 2, mt: 2 }}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContainerDetailModal;
