import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Button } from '@/components';
import { formatDateTime } from '@/utils/formatTimestamp';

interface ImageDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const ImageDetailModal = ({ open, onClose, data }: ImageDetailModalProps) => {
  const [name, tag] =
    data?.RepoTags?.length > 0
      ? data.RepoTags[0].split(':')
      : ['<none>', '<none>'];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      classes={{ paper: 'h-[90vh] flex flex-col' }}
    >
      {/* Fixed Header */}
      <div className="p-5 font-pretendard border-b border-grey_1 bg-white">
        <h2 className="text-lg font-bold">{`Image Details - ${name}`}</h2>

        {/* General Information */}
        <div className="flex justify-between mt-3">
          <p>
            <strong>Repository:</strong> {name}
          </p>
          <p>
            <strong>Tag:</strong> {tag}
          </p>
        </div>
        <div className="flex justify-between mt-2">
          <p>
            <strong>Size:</strong> {(data.Size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p>
            <strong>Created:</strong> {formatDateTime(data.Created)}
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <DialogContent className="overflow-y-auto flex-grow bg-grey_0">
        {/* Layers Section */}
        <div className="my-5">
          <h3 className="text-base font-semibold text-grey_6">Layers</h3>
          {data?.RootFS?.Layers?.length > 0 ? (
            <TableContainer className="mt-3 bg-white">
              <Table>
                <TableHead>
                  <TableRow className="bg-grey_0">
                    <TableCell className="py-2 px-3 border-b border-grey_2">
                      <strong>Layer Index</strong>
                    </TableCell>
                    <TableCell className="py-2 px-3 border-b border-grey_2">
                      <strong>Layer ID</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.RootFS.Layers.map((layer: string, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="py-2 px-3 border-b border-grey_2">{`Layer ${
                        index + 1
                      }`}</TableCell>
                      <TableCell className="py-2 px-3 border-b border-grey_2">
                        {layer}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p className="text-sm text-grey_4 mt-2">No layers available</p>
          )}
        </div>

        {/* Metadata Section */}
        <div className="my-5">
          <h3 className="text-base font-semibold text-grey_6">Metadata</h3>
          <div className="flex justify-between mt-2">
            <p>
              <strong>Architecture:</strong> {data?.Architecture || 'N/A'}
            </p>
            <p>
              <strong>OS:</strong> {data?.Os || 'N/A'}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p>
              <strong>Docker Version:</strong> {data?.DockerVersion || 'N/A'}
            </p>
            <p>
              <strong>ID:</strong> {data?.Id || 'N/A'}
            </p>
          </div>
        </div>
      </DialogContent>

      {/* Fixed Footer */}
      <DialogActions className="p-5 border-t border-grey_1 bg-white">
        <Button title={'닫기'} onClick={onClose} color="grey" />
      </DialogActions>
    </Dialog>
  );
};

export default ImageDetailModal;
