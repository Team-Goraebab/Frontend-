'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { colorsOption } from '@/data/color';
import { Network, ThemeColor } from '@/types/type';

interface HostModalProps {
  onClose: () => void;
  onSave: (
    id: string,
    hostNm: string,
    hostIp: string | undefined,
    isRemote: boolean,
    themeColor: ThemeColor,
    networkName: string,
    networkIp: string
  ) => void;
  availableNetworks: Network[];
}

const HostModal = ({ onClose, onSave, availableNetworks }: HostModalProps) => {
  const id = uuidv4();
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [hostNm, setHostNm] = useState<string>('');
  const [hostIp, setHostIp] = useState<string | undefined>(undefined);
  const [networkName, setNetworkName] = useState<string>('');
  const [networkIp, setNetworkIp] = useState<string>('');

  const defaultColor = colorsOption.find((color) => !color.sub);
  const defaultSubColor = colorsOption.find(
    (color) => color.label === defaultColor?.label && color.sub
  );

  const [selectedColor, setSelectedColor] = useState<ThemeColor>({
    label: defaultColor?.label || '',
    bgColor: defaultSubColor?.color || '',
    borderColor: defaultColor?.color || '',
    textColor: defaultColor?.color || '',
  });

  useEffect(() => {
    if (availableNetworks.length > 0) {
      const firstNetwork = availableNetworks[0];
      setNetworkName(firstNetwork.Name);
      setNetworkIp(firstNetwork.IPAM?.Config?.[0]?.Gateway || '');
    }
  }, [availableNetworks]);

  const isSaveDisabled = useMemo(() => {
    return !hostNm || !networkName || !networkIp || (isRemote && !hostIp);
  }, [hostNm, networkName, networkIp, isRemote, hostIp]);

  const handleSave = () => {
    if (isSaveDisabled) {
      return;
    }

    onSave(
      id,
      hostNm,
      isRemote ? hostIp : undefined,
      isRemote,
      selectedColor,
      networkName,
      networkIp
    );
    onClose();
  };

  const handleNetworkChange = (selectedNetworkName: string) => {
    const selectedNetwork = availableNetworks.find(
      (net) => net.Name === selectedNetworkName
    );
    setNetworkName(selectedNetworkName);
    setNetworkIp(selectedNetwork?.IPAM?.Config?.[0]?.Gateway || '');
  };

  const handleColorSelection = (colorLabel: string) => {
    const mainColor = colorsOption.find(
      (color) => color.label === colorLabel && !color.sub
    );
    const subColor = colorsOption.find(
      (color) => color.label === colorLabel && color.sub
    );

    setSelectedColor({
      label: colorLabel,
      bgColor: subColor?.color || '',
      borderColor: mainColor?.color || '',
      textColor: mainColor?.color || '',
    });
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Create New Host
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={2}>
          <TextField
            label="Host Name"
            fullWidth
            value={hostNm}
            onChange={(e) => setHostNm(e.target.value)}
            variant="outlined"
            required
          />
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Host Type</Typography>
            <RadioGroup
              row
              value={isRemote ? 'remote' : 'local'}
              onChange={(e) => {
                setIsRemote(e.target.value === 'remote');
                if (e.target.value !== 'remote') {
                  setHostIp(undefined); // Clear hostIp if not remote
                }
              }}
            >
              <FormControlLabel
                value="local"
                control={<Radio />}
                label="Local"
              />
              <FormControlLabel
                value="remote"
                control={<Radio />}
                label="Remote"
              />
            </RadioGroup>
          </FormControl>
          {isRemote && (
            <TextField
              label="Host IP"
              fullWidth
              value={hostIp || ''}
              onChange={(e) => setHostIp(e.target.value)}
              variant="outlined"
              required
            />
          )}
          <FormControl fullWidth>
            <InputLabel>Select Network</InputLabel>
            <Select
              value={networkName}
              onChange={(e) => handleNetworkChange(e.target.value)}
              label="Select Network"
              fullWidth
            >
              {availableNetworks.map((net) => (
                <MenuItem key={net.Id} value={net.Name}>
                  {net.Name} (IP: {net.IPAM?.Config?.[0]?.Gateway || 'None'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="subtitle1" mb={1}>
              Select Color Theme
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              {colorsOption
                .filter((color) => !color.sub)
                .map((color) => (
                  <Box
                    key={color.id}
                    onClick={() => handleColorSelection(color.label)}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: color.color,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      outline:
                        selectedColor.label === color.label
                          ? '3px solid #D2D2D2'
                          : 'none',
                      outlineOffset: '3px',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.1)' },
                    }}
                  />
                ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'end', p: 3 }}>
        <Button onClick={onClose}>취소</Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={isSaveDisabled}
        >
          생성
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostModal;
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { colorsOption } from '@/data/color';
import { Network, ThemeColor } from '@/types/type';

interface HostModalProps {
  onClose: () => void;
  onSave: (
    id: string,
    hostNm: string,
    hostIp: string | undefined,
    isRemote: boolean,
    themeColor: ThemeColor,
    networkName: string,
    networkIp: string
  ) => void;
  availableNetworks: Network[];
}

const HostModal = ({ onClose, onSave, availableNetworks }: HostModalProps) => {
  const id = uuidv4();
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [hostNm, setHostNm] = useState<string>('');
  const [hostIp, setHostIp] = useState<string | undefined>(undefined);
  const [networkName, setNetworkName] = useState<string>('');
  const [networkIp, setNetworkIp] = useState<string>('');

  const defaultColor = colorsOption.find((color) => !color.sub);
  const defaultSubColor = colorsOption.find(
    (color) => color.label === defaultColor?.label && color.sub
  );

  const [selectedColor, setSelectedColor] = useState<ThemeColor>({
    label: defaultColor?.label || '',
    bgColor: defaultSubColor?.color || '',
    borderColor: defaultColor?.color || '',
    textColor: defaultColor?.color || '',
  });

  useEffect(() => {
    if (availableNetworks.length > 0) {
      const firstNetwork = availableNetworks[0];
      setNetworkName(firstNetwork.Name);
      setNetworkIp(firstNetwork.IPAM?.Config?.[0]?.Gateway || '');
    }
  }, [availableNetworks]);

  const isSaveDisabled = useMemo(() => {
    return !hostNm || !networkName || !networkIp || (isRemote && !hostIp);
  }, [hostNm, networkName, networkIp, isRemote, hostIp]);

  const handleSave = () => {
    if (isSaveDisabled) {
      return;
    }

    onSave(
      id,
      hostNm,
      isRemote ? hostIp : undefined,
      isRemote,
      selectedColor,
      networkName,
      networkIp
    );
    onClose();
  };

  const handleNetworkChange = (selectedNetworkName: string) => {
    const selectedNetwork = availableNetworks.find(
      (net) => net.Name === selectedNetworkName
    );
    setNetworkName(selectedNetworkName);
    setNetworkIp(selectedNetwork?.IPAM?.Config?.[0]?.Gateway || '');
  };

  const handleColorSelection = (colorLabel: string) => {
    const mainColor = colorsOption.find(
      (color) => color.label === colorLabel && !color.sub
    );
    const subColor = colorsOption.find(
      (color) => color.label === colorLabel && color.sub
    );

    setSelectedColor({
      label: colorLabel,
      bgColor: subColor?.color || '',
      borderColor: mainColor?.color || '',
      textColor: mainColor?.color || '',
    });
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Create New Host
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={2}>
          <TextField
            label="Host Name"
            fullWidth
            value={hostNm}
            onChange={(e) => setHostNm(e.target.value)}
            variant="outlined"
            required
          />
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Host Type</Typography>
            <RadioGroup
              row
              value={isRemote ? 'remote' : 'local'}
              onChange={(e) => {
                setIsRemote(e.target.value === 'remote');
                if (e.target.value !== 'remote') {
                  setHostIp(undefined); // Clear hostIp if not remote
                }
              }}
            >
              <FormControlLabel
                value="local"
                control={<Radio />}
                label="Local"
              />
              <FormControlLabel
                value="remote"
                control={<Radio />}
                label="Remote"
              />
            </RadioGroup>
          </FormControl>
          {isRemote && (
            <TextField
              label="Host IP"
              fullWidth
              value={hostIp || ''}
              onChange={(e) => setHostIp(e.target.value)}
              variant="outlined"
              required
            />
          )}
          <FormControl fullWidth>
            <InputLabel>Select Network</InputLabel>
            <Select
              value={networkName}
              onChange={(e) => handleNetworkChange(e.target.value)}
              label="Select Network"
              fullWidth
            >
              {availableNetworks.map((net) => (
                <MenuItem key={net.Id} value={net.Name}>
                  {net.Name} (IP: {net.IPAM?.Config?.[0]?.Gateway || 'None'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="subtitle1" mb={1}>
              Select Color Theme
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              {colorsOption
                .filter((color) => !color.sub)
                .map((color) => (
                  <Box
                    key={color.id}
                    onClick={() => handleColorSelection(color.label)}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: color.color,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      outline:
                        selectedColor.label === color.label
                          ? '3px solid #D2D2D2'
                          : 'none',
                      outlineOffset: '3px',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.1)' },
                    }}
                  />
                ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'end', p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={isSaveDisabled}
        >
          
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostModal;
