import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  IconButton, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHostStore } from '@/store/hostStore';

interface ImageStartOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: (config: ContainerConfig) => void | Promise<void>;
  imageName: string;
  DNDNetworkIp?: string;
}

interface ContainerConfig {
  name: string;
  image: string;
  ports?: { [key: string]: string };
  volumes?: { hostPath?: string; containerPath?: string };
  env?: Array<{ variable: string; value: string }>;
  hostId?: string;
  networkIp?: string;
}

const ImageStartOptionModal: React.FC<ImageStartOptionModalProps> = ({
                                                                       isOpen,
                                                                       onClose,
                                                                       onRun,
                                                                       imageName,
                                                                       DNDNetworkIp,
                                                                     }) => {
  const [name, setName] = useState('');
  const [port3306, setPort3306] = useState('');
  const [port33060, setPort33060] = useState('');
  const [volumeHostPath, setVolumeHostPath] = useState('');
  const [volumeContainerPath, setVolumeContainerPath] = useState('');
  const [envVars, setEnvVars] = useState<Array<{ variable: string; value: string }>>([]);
  const [selectedHostId, setSelectedHostId] = useState('');
  const [selectedNetworkIp, setSelectedNetworkIp] = useState('');

  const hosts = useHostStore((state) => state.hosts);

  // DNDNetworkIp가 있을 경우 해당 IP를 가진 호스트를 기본 선택값으로 설정
  useEffect(() => {
    if (DNDNetworkIp) {
      const matchingHost = hosts.find((host) => host.networkIp === DNDNetworkIp);
      if (matchingHost) {
        setSelectedHostId(matchingHost.id);
        setSelectedNetworkIp(matchingHost.networkIp);
      }
    }
  }, [DNDNetworkIp, hosts]);

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { variable: '', value: '' }]);
  };

  const handleEnvVarChange = (index: number, field: 'variable' | 'value', value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  const handleRemoveEnvVar = (index: number) => {
    const newEnvVars = envVars.filter((_, i) => i !== index);
    setEnvVars(newEnvVars);
  };

  const handleHostChange = (hostId: string) => {
    setSelectedHostId(hostId);
    const selectedHost = hosts.find((host) => host.id === hostId);
    if (selectedHost) {
      setSelectedNetworkIp(selectedHost.networkIp);
    }
  };

  const handleRun = () => {
    const config: ContainerConfig = {
      name,
      image: imageName,
    };

    if (port3306 || port33060) {
      config.ports = {};
      if (port3306) config.ports['3306/tcp'] = port3306;
      if (port33060) config.ports['33060/tcp'] = port33060;
    }

    if (volumeHostPath || volumeContainerPath) {
      config.volumes = {};
      if (volumeHostPath) config.volumes.hostPath = volumeHostPath;
      if (volumeContainerPath) config.volumes.containerPath = volumeContainerPath;
    }

    if (envVars.length > 0) {
      config.env = envVars.filter((env) => env.variable && env.value);
    }

    if (selectedHostId) {
      config.hostId = selectedHostId;
    }

    if (selectedNetworkIp) {
      config.networkIp = selectedNetworkIp;
    }

    const result = onRun(config);

    if (result instanceof Promise) {
      result.then(() => onClose());
    } else {
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480,
          bgcolor: '#f8fafc',
          p: 3,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            textAlign: 'center',
            color: '#333',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        >
          Start New Container
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: '#333', textAlign: 'center', mb: 3 }}
        >
          {imageName}
        </Typography>

        <Box sx={{ mt: 2, px: 1 }}>
          <TextField
            fullWidth
            label="Container Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                backgroundColor: '#ffffff',
                borderRadius: 2,
              },
            }}
          />

          <Accordion
            disableGutters
            elevation={0}
            sx={{
              mb: 2,
              backgroundColor: 'transparent',
              '&:before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#333' }} />}>
              <Typography sx={{ color: '#333' }}>Host Selection</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
                <InputLabel id="host-select-label">Host</InputLabel>
                <Select
                  labelId="host-select-label"
                  value={selectedHostId}
                  label="Host"
                  onChange={(e) => handleHostChange(e.target.value as string)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#333',
                      borderRadius: 2,
                    },
                  }}
                >
                  {hosts.map((host) => (
                    <MenuItem key={host.id} value={host.id}>
                      {host.hostNm} ({host.networkIp})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            elevation={0}
            sx={{
              mb: 2,
              backgroundColor: 'transparent',
              '&:before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#333' }} />}>
              <Typography sx={{ color: '#333' }}>Ports</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Port for 3306/tcp"
                  value={port3306}
                  onChange={(e) => setPort3306(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Port for 33060/tcp"
                  value={port33060}
                  onChange={(e) => setPort33060(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                    },
                  }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            elevation={0}
            sx={{
              mb: 2,
              backgroundColor: 'transparent',
              '&:before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#333' }} />}>
              <Typography sx={{ color: '#333' }}>Volumes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Volume Host Path"
                  value={volumeHostPath}
                  onChange={(e) => setVolumeHostPath(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Volume Container Path"
                  value={volumeContainerPath}
                  onChange={(e) => setVolumeContainerPath(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                    },
                  }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            elevation={0}
            sx={{
              mb: 2,
              backgroundColor: 'transparent',
              '&:before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#333' }} />}>
              <Typography sx={{ color: '#333' }}>Environment Variables</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {envVars.map((env, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TextField
                    label="Variable"
                    value={env.variable}
                    onChange={(e) => handleEnvVarChange(index, 'variable', e.target.value)}
                    size="small"
                    sx={{
                      flex: 1,
                      '& .MuiInputBase-root': {
                        backgroundColor: '#ffffff',
                        borderRadius: 2,
                      },
                    }}
                  />
                  <TextField
                    label="Value"
                    value={env.value}
                    onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                    size="small"
                    sx={{
                      flex: 1,
                      '& .MuiInputBase-root': {
                        backgroundColor: '#ffffff',
                        borderRadius: 2,
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveEnvVar(index)}
                    size="small"
                    sx={{ color: '#ef4444' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                onClick={handleAddEnvVar}
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Add Variable
              </Button>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: '#ef4444',
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleRun}
            sx={{
              backgroundColor: '#f8fafc',
              color: '#3b82f6',
              borderRadius: 2,
              px: 4,
            }}
          >
            실행
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageStartOptionModal;
