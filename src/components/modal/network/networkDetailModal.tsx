import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  DialogTitle,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from '@/components';

interface NetworkDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const NetworkDetailModal = ({
  open,
  onClose,
  data,
}: NetworkDetailModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      (err) => {
        console.error('Error copying text: ', err);
      }
    );
  };

  const truncateId = (id: string | undefined, length = 20) => {
    if (!id) return 'N/A';
    return id.length > length ? `${id.substring(0, length)}...` : id;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      classes={{ paper: 'h-[90vh] flex flex-col' }}
    >
      <DialogTitle>{`${data?.Name || 'Unknown Network'}`}</DialogTitle>
      <DialogContent dividers>
        {/* Fixed Header */}
        <div className="p-5 font-pretendard border-b border-grey_1 bg-white">
          <div className="grid grid-cols-2 gap-4 mt-3">
            {/* Scope and Driver */}
            <div>
              <strong>Scope:</strong> {data?.Options?.Scope || 'N/A'}
            </div>
            <div>
              <strong>Driver:</strong> {data?.Driver || 'N/A'}
            </div>
            <div className="flex items-center space-x-1">
              <strong>ID:&nbsp;</strong> {truncateId(data?.Id)}
              <Tooltip title="Copy ID">
                <IconButton onClick={() => handleCopyToClipboard(data?.Id)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            <div>
              <p>
                <strong>Created:</strong>{' '}
                {new Date(data?.Created).toLocaleString()}
              </p>
            </div>
          </div>
          {copied && (
            <p className="text-green_6 text-sm mt-2">ID copied to clipboard!</p>
          )}
        </div>
        <Divider />

        {/* Scrollable Content */}
        <DialogContent className="overflow-y-auto flex-grow bg-grey_0">
          {/* Containers Section */}
          <div className="my-5">
            <h3 className="text-base font-semibold text-grey_6">Containers</h3>
            {Object.keys(data?.Containers || {}).length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Container Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>IPv4 Address</strong>
                      </TableCell>
                      <TableCell>
                        <strong>MAC Address</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(data.Containers).map(
                      (container: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{container.Name || 'N/A'}</TableCell>
                          <TableCell>
                            {container.IPv4Address || 'N/A'}
                          </TableCell>
                          <TableCell>{container.MacAddress || 'N/A'}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <p className="text-sm text-grey_4 mt-2">
                No containers available
              </p>
            )}
          </div>

          <Divider />

          {/* IPAM Section */}
          <div className="my-5">
            <h3 className="text-base font-semibold text-grey_6">IPAM</h3>
            {data?.IPAM?.Config?.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Subnet</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Gateway</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.IPAM.Config.map((config: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{config.Subnet || 'N/A'}</TableCell>
                        <TableCell>{config.Gateway || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <p className="text-sm text-grey_4 mt-2">
                No IPAM configuration available
              </p>
            )}
          </div>

          <Divider />

          {/* Labels Section */}
          <div className="my-5">
            <h3 className="text-base font-semibold text-grey_6">Labels</h3>
            {Object.keys(data?.Labels || {}).length > 0 ? (
              <Box mt={1}>
                {Object.entries(data.Labels).map(([key, value], index) => (
                  <Typography key={index} variant="body2">
                    <strong>{key}:</strong>
                  </Typography>
                ))}
              </Box>
            ) : (
              <p className="text-sm text-grey_4 mt-2">No labels available</p>
            )}
          </div>
        </DialogContent>
      </DialogContent>

      {/* Fixed Footer */}
      <DialogActions className="p-5 border-t border-grey_1 bg-white">
        <Button title={'닫기'} onClick={onClose} color="grey" />
      </DialogActions>
    </Dialog>
  );
};

export default NetworkDetailModal;
