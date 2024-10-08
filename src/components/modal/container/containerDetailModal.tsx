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
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { formatDateTime } from '@/utils/formatTimestamp';
import { Button } from '@/components';

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
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('ID copied to clipboard!');
  };

  const truncateId = (id: string | undefined, length = 20) => {
    if (!id) return 'N/A';
    return id.length > length ? `${id.substring(0, length)}...` : id;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{`${data?.Name || 'Unknown Container'}`}</DialogTitle>
      <DialogContent dividers>
        {/* Container General Information */}
        <Box mb={2}>
          <Typography variant="h6">General Information</Typography>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <p>
              <strong>Container ID:</strong> {truncateId(data?.Id)}
              <Tooltip title="Copy ID">
                <IconButton onClick={() => handleCopyToClipboard(data?.Id)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </p>
            <p>
              <strong>Created:</strong> {formatDateTime(data?.Created)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p>
              <strong>Status:</strong> {data?.State?.Status || 'Unknown'}
            </p>
            <p>
              <strong>Platform:</strong> {data?.Platform || 'Unknown'}
            </p>
          </div>
        </Box>
        <Divider />
        {/* Host Configuration */}
        <Box my={2}>
          <Typography variant="h6">Host Configuration</Typography>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <strong>Hostname Path:</strong>{' '}
            {truncateId(data?.HostConfig?.HostnamePath)}
            <p>
              <strong>Hosts Path:</strong>{' '}
              {truncateId(data?.HostConfig?.HostsPath)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <strong>Log Path:</strong> {truncateId(data?.HostConfig?.LogPath)}
            <strong>Network Mode:</strong>{' '}
            {data?.HostConfig?.NetworkMode || 'Unknown'}
          </div>
        </Box>

        <Divider />

        {/* Network Settings */}
        <Box my={2}>
          <Typography variant="h6">Network Settings</Typography>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <p>
              <strong>Sandbox ID:</strong>{' '}
              {truncateId(data?.NetworkSettings?.SandboxID)}
            </p>
            <p>
              <strong>IP Address:</strong>{' '}
              {data?.NetworkSettings?.IPAddress || 'N/A'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p>
              <strong>Platform:</strong> {data?.Platform || 'Unknown'}
            </p>
            <p>
              <strong>Process Label:</strong>{' '}
              {data?.NetworkSettings?.ProcessLabel || 'N/A'}
            </p>
          </div>
        </Box>

        <Divider />

        {/* State Information */}
        <Box my={2}>
          <Typography variant="h6">State Information</Typography>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <p>
              <strong>Started At:</strong>{' '}
              {formatDateTime(data?.State?.StartedAt)}
            </p>
            <p>
              <strong>Finished At:</strong>{' '}
              {formatDateTime(data?.State?.FinishedAt)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p>
              <strong>Restart Count:</strong> {data?.RestartCount || 0}
            </p>
            <p>
              <strong>Exit Code:</strong> {data?.State?.ExitCode || 'N/A'}
            </p>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button title="Close" onClick={onClose} color="grey" />
      </DialogActions>
    </Dialog>
  );
};

export default ContainerDetailModal;
