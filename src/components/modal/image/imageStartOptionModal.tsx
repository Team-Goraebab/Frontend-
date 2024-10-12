import React, { useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useHostStore } from '@/store/hostStore';

interface ImageStartOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: (config: ContainerConfig) => void | Promise<void>;
  imageName: string;
}

interface ContainerConfig {
  name: string;
  image: string;
  ports?: {
    '3306/tcp'?: string;
    '33060/tcp'?: string;
  };
  volumes?: {
    hostPath?: string;
    containerPath?: string;
  };
  env?: Array<{ variable: string; value: string }>;
  hostId?: string;
}

const ImageStartOptionModal: React.FC<ImageStartOptionModalProps> = ({ isOpen, onClose, onRun, imageName }) => {
  const [name, setName] = useState('');
  const [port3306, setPort3306] = useState('');
  const [port33060, setPort33060] = useState('');
  const [volumeHostPath, setVolumeHostPath] = useState('');
  const [volumeContainerPath, setVolumeContainerPath] = useState('');
  const [envVars, setEnvVars] = useState<Array<{ variable: string; value: string }>>([]);
  const [selectedHostId, setSelectedHostId] = useState('');

  const hosts = useHostStore(state => state.hosts);

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
      config.env = envVars.filter(env => env.variable && env.value);
    }

    if (selectedHostId) {
      config.hostId = selectedHostId;
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
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Run Container: {imageName}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Container Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Host Selection (Optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
                <InputLabel id="host-select-label">Host</InputLabel>
                <Select
                  labelId="host-select-label"
                  value={selectedHostId}
                  label="Host"
                  onChange={(e) => setSelectedHostId(e.target.value as string)}
                >
                  {hosts.map(host => (
                    <MenuItem key={host.id} value={host.id}>{host.hostNm}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Ports (Optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Port for 3306/tcp"
                value={port3306}
                onChange={(e) => setPort3306(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Port for 33060/tcp"
                value={port33060}
                onChange={(e) => setPort33060(e.target.value)}
                margin="normal"
              />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Volumes (Optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Volume Host Path"
                value={volumeHostPath}
                onChange={(e) => setVolumeHostPath(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Volume Container Path"
                value={volumeContainerPath}
                onChange={(e) => setVolumeContainerPath(e.target.value)}
                margin="normal"
              />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Environment Variables (Optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {envVars.map((env, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    label="Variable"
                    value={env.variable}
                    onChange={(e) => handleEnvVarChange(index, 'variable', e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Value"
                    value={env.value}
                    onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                    size="small"
                  />
                  <Button onClick={() => handleRemoveEnvVar(index)} color="error" variant="outlined" size="small">
                    Remove
                  </Button>
                </Box>
              ))}
              <Button onClick={handleAddEnvVar} variant="outlined" size="small" sx={{ mt: 1 }}>
                Add Env Var
              </Button>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleRun} variant="contained" disabled={!name}>
            Run Container
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageStartOptionModal;
