import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeType: 'container' | 'image' | 'network' | 'volume';
}

const HelpModal = ({ isOpen, onClose, activeType }: HelpModalProps) => {
  const helpData = {
    container: {
      title: '컨테이너',
      description: '컨테이너는 애플리케이션을 실행하는 단위입니다. Docker에서 애플리케이션과 그 종속성을 함께 묶어 독립적인 환경에서 실행할 수 있습니다.',
    },
    image: {
      title: '이미지',
      description: '이미지는 컨테이너의 실행 환경을 제공합니다. 애플리케이션의 소스코드와 모든 의존성을 포함하고 있어, 이를 기반으로 컨테이너를 실행할 수 있습니다.',
    },
    network: {
      title: '네트워크',
      description: '네트워크는 컨테이너 간의 통신을 관리합니다. 컨테이너가 서로 통신할 수 있도록 가상 네트워크를 설정할 수 있습니다.',
    },
    volume: {
      title: '볼륨',
      description: '볼륨은 컨테이너 간에 공유되는 데이터를 저장하는 장소입니다. 데이터를 유지하고 공유하기 위한 방법으로 사용됩니다.',
    },
  };

  // activeType에 맞는 데이터만 표시
  const activeHelp = helpData[activeType];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
        },
      }}
    >
      <DialogTitle>
        {activeHelp.title} 도움말
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">{activeHelp.title}</h3>
          <p className="mt-2">{activeHelp.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
