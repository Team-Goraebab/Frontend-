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
import { Button } from '@/components';
import { useState } from 'react';
import { formatDateTime } from '@/utils/formatTimestamp';

interface VolumeDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const VolumeDetailModal = ({ open, onClose, data }: VolumeDetailModalProps) => {
  const [copied, setCopied] = useState(false);

  const truncateId = (id: string | undefined, length = 20) => {
    if (!id) return 'N/A';
    return id.length > length ? `${id.substring(0, length)}...` : id;
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{`${data?.Name}`}</DialogTitle>
      <DialogContent dividers>
        {/* General Information */}
        <div className="p-5 font-pretendard border-b border-grey_1 bg-white">
          <h2 className="text-lg font-bold">General Information</h2>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <strong>Driver:</strong> {data?.Driver || 'N/A'}
            </div>
            <div>
              <strong>Created:</strong> {formatDateTime(data.CreatedAt)}
            </div>
            <div className="flex items-center">
              <strong>Name: &nbsp;</strong> {truncateId(data?.Name)}
              <Tooltip title="Copy ID">
                <IconButton onClick={() => handleCopyToClipboard(data?.Name)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            <p className="break-all">
              <strong>Mountpoint:</strong> {data?.Mountpoint || 'N/A'}
            </p>
          </div>

          {copied && (
            <p className="text-green_6 text-sm">ID copied to clipboard!</p>
          )}
        </div>

        <Divider />

        {/* Labels */}
        <Box my={2}>
          <Typography variant="h6">Labels</Typography>
          {data?.Labels && Object.keys(data.Labels).length > 0 ? (
            <Box mt={1}>
              {Object.entries(data.Labels).map(([key, value], index) => (
                <Typography key={index} variant="body2">
                  <strong>{key}:</strong>
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography variant="body2">No labels available</Typography>
          )}
        </Box>

        <Divider />

        {/* Options */}
        <Box my={2}>
          <Typography variant="h6">Options</Typography>
          {data?.Options ? (
            <Box mt={1}>
              <Typography variant="body2">
                <strong>Scope:</strong> {data?.Options?.Scope || 'N/A'}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2">No options available</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button title={'닫기'} onClick={onClose} color="grey" />
      </DialogActions>
    </Dialog>
  );
};

export default VolumeDetailModal;
