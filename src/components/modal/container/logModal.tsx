import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Button } from '@/components';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import TimelineIcon from '@mui/icons-material/Timeline';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredLogs, setFilteredLogs] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const logRef = useRef<HTMLDivElement>(null);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied Successfully!');
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/container/logs?id=${containerId}`);
      const data = await response.json();
      setLogs(data.logs || 'No logs available');
      setFilteredLogs(data.logs || 'No logs available');
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filtered = logs
        ?.split('\n')
        .filter((line) => line.toLowerCase().includes(term.toLowerCase()))
        .join('\n');
      setFilteredLogs(filtered || 'No matching logs found');
    } else {
      setFilteredLogs(logs);
    }
  };

  // 최신 로그로 스크롤 이동
  const scrollToBottom = () => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const clearLogs = () => {
    setLogs('');
    setFilteredLogs('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <strong>{containerName} Logs</strong>
        <p className="text-sm">
          Container ID:
          {containerId}
          <Tooltip title="Copy ID">
            <IconButton onClick={() => handleCopyToClipboard(containerId)}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </p>
        <div className="absolute right-4 top-2 flex space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Enter search term"
              onChange={handleSearch}
              value={searchTerm}
              className="pl-2 border border-grey_2 rounded focus:outline-none focus:border-grey_4 text-sm"
            />
          )}
          {/* 검색 아이콘 */}
          <Tooltip title="Search Logs">
            <IconButton onClick={() => setShowSearch(!showSearch)}>
              <SearchIcon className="text-grey_6" />
            </IconButton>
          </Tooltip>
          {/* 복사 아이콘 */}
          <Tooltip title="Copy Logs">
            <IconButton
              onClick={() => handleCopyToClipboard(filteredLogs || '')}
            >
              <ContentCopyIcon className="text-grey_6" />
            </IconButton>
          </Tooltip>
          {/* 타임라인 아이콘 (최신 로그로 스크롤) */}
          <Tooltip title="Scroll to Latest Logs">
            <IconButton onClick={scrollToBottom}>
              <TimelineIcon className="text-grey_6" />
            </IconButton>
          </Tooltip>
          {/* 휴지통 아이콘 (로그 초기화) */}
          <Tooltip title="Clear Logs">
            <IconButton onClick={clearLogs}>
              <DeleteIcon className="text-grey_6" />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <div
          ref={logRef}
          className="overflow-y-auto scrollbar-custom bg-grey_0 text-black_6 text-sm p-3 rounded min-h-64"
        >
          <pre className="whitespace-pre-wrap">
            {filteredLogs || 'Fetching logs...'}
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
