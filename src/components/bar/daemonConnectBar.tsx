'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { showSnackbar } from '@/utils/toastUtils';
import { useSnackbar } from 'notistack';
import { FaPlay, FaPause, FaStop, FaEllipsisV, FaDocker } from 'react-icons/fa';
import BarOptionModal from '../modal/barOptionModal';
import SystemInfoModal from '../modal/daemon/systemModal';
import VersionDetailModal from '../modal/daemon/versionModal';

const DaemonConnectBar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const barRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showVersionInfo, setShowVersionInfo] = useState<boolean>(false);
  const [showSystemInfo, setShowSystemInfo] = useState<boolean>(false);
  const [versionData, setVersionData] = useState<any>();
  const [systemData, setSystemData] = useState<any>();

  const [engineStatus, setEngineStatus] = useState<
    'connect' | 'disconnect' | 'connecting'
  >('disconnect');

  async function fetchConnectDaemon() {
    try {
      setEngineStatus('connecting');
      const response = await axios.get(`api/daemon/version`);
      setEngineStatus('connect');
      setVersionData(response.data);
    } catch (error) {
      console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
      setEngineStatus('disconnect');
      // 연결 실패 시 알림 표시
      showSnackbar(
        enqueueSnackbar,
        '도커 엔진이 실행되지 않았습니다.',
        'info',
        '#7F7F7F',
      );
    }
  }

  async function fetchSystemInfo() {
    try {
      const response = await axios.get(`api/daemon/system`);
      console.log('시스템 :::', response);
      setSystemData(response.data);
    } catch (error) {
      console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
    }
  }

  useEffect(() => {
    fetchConnectDaemon();
  }, []);

  const handleEngineStartStop = () => {
    if (engineStatus === 'connect' || engineStatus === 'connecting') {
      setEngineStatus('disconnect');
    } else {
      fetchConnectDaemon();
    }
  };

  const handleTopOptionClick = () => {
    setShowVersionInfo(true);
    setShowOptions(false);
  };

  const handleBottomOptionClick = () => {
    fetchSystemInfo();
    setShowSystemInfo(true);
    setShowOptions(false);
  };

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        barRef.current &&
        !barRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [barRef, modalRef]);

  return (
    <div
      ref={barRef}
      className={`z-50 px-4 p-1 flex items-center justify-between text-white ${
        engineStatus === 'connect'
          ? 'bg-green_6'
          : engineStatus === 'connecting'
            ? 'bg-yellow_6'
            : 'bg-red_6'
      }`}
    >
      <div className="flex items-center">
        <FaDocker className="mr-2 w-4 h-4" />
        <span className="font-semibold text-sm">
          {engineStatus === 'connect'
            ? 'Daemon connected'
            : engineStatus === 'connecting'
              ? 'Connecting...'
              : 'Daemon disconnected'}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {engineStatus === 'connect' ? (
          <button onClick={handleEngineStartStop}>
            <FaStop className="text-white w-3 h-3" />
          </button>
        ) : engineStatus === 'connecting' ? (
          <button onClick={handleEngineStartStop}>
            <FaPause className="text-white w-3 h-3" />
          </button>
        ) : (
          <button onClick={handleEngineStartStop}>
            <FaPlay className="text-white w-3 h-3" />
          </button>
        )}
        <button>
          <FaEllipsisV
            className="text-white w-3 h-3"
            onClick={handleOptionClick}
          />
        </button>
      </div>
      {showOptions && (
        <div ref={modalRef} className="absolute z-50 bottom-[85px] left-[264px]">
          <BarOptionModal
            onTopHandler={handleTopOptionClick}
            onMiddleHandler={() => {
            }}
            onBottomHandler={handleBottomOptionClick}
          />
        </div>
      )}
      <VersionDetailModal
        open={showVersionInfo}
        onClose={() => setShowVersionInfo(false)}
        data={versionData}
      />
      <SystemInfoModal
        open={showSystemInfo}
        onClose={() => setShowSystemInfo(false)}
        data={systemData}
      />
    </div>
  );
};

export default DaemonConnectBar;
