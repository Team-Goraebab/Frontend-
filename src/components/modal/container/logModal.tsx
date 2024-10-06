import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Button } from '@/components';

interface LogModalProps {
  open: boolean;
  onClose: () => void;
  containerId: string;
  containerName: string;
}

const LogModal = ({
  open,
  onClose,
  containerId,
  containerName,
}: LogModalProps) => {
  const [logs, setLogs] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/container/logs?id=${containerId}`);
      const data = await response.json();
      setLogs(data.logs || 'No logs available');
    } catch (error) {
      setLogs('Failed to fetch logs');
    }
  };

  useEffect(() => {
    if (open) {
      fetchLogs();
      if (logRef.current) {
        // 모달이 열릴 때 스크롤을 맨 아래로 설정
        setTimeout(() => {
          logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
        }, 100);
      }
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchLogs();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{containerName} Logs</DialogTitle>
      <DialogContent dividers>
        <div
          ref={logRef}
          className="overflow-y-auto bg-black_1 text-grey_2 text-sm p-3 rounded"
        >
          <pre className="whitespace-pre-wrap">
            {logs || 'Fetching logs...'}
          </pre>
        </div>
      </DialogContent>
      <DialogActions>
        <Button title="Close" onClick={onClose} color="grey" />
      </DialogActions>
    </Dialog>
  );
};

export default LogModal;
