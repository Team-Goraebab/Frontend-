'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showSnackbar } from '@/utils/toastUtils';
import { useSnackbar } from 'notistack';
import { BASE_URL, REMOTE_DEAMONS } from '@/app/api/urlPath';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaEllipsisV,
  FaDocker,
  FaPowerOff,
} from 'react-icons/fa';

const DaemonConnectBar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [engineStatus, setEngineStatus] = useState<
    'connect' | 'disconnect' | 'connecting'
  >('disconnect');

  async function fetchData() {
    try {
      setEngineStatus('connecting');
      const response = await axios.get(`${BASE_URL}${REMOTE_DEAMONS}`);
      console.log('원격 데몬 연결', response);
      setEngineStatus('connect');
    } catch (error) {
      console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
      setEngineStatus('disconnect');
      // 연결 실패 시 알림 표시
      showSnackbar(
        enqueueSnackbar,
        '도커 엔진이 실행되지 않았습니다.',
        'info',
        '#7F7F7F'
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleEngineStartStop = () => {
    if (engineStatus === 'connect' || engineStatus === 'connecting') {
      setEngineStatus('disconnect');
    } else {
      fetchData();
    }
  };
  // rounded-md
  return (
    <div
      className={`px-4 p-1 flex items-center justify-between text-white ${
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
        {/* <button>
          <FaPowerOff className="text-white" />
        </button> */}
        <button>
          <FaEllipsisV className="text-white w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default DaemonConnectBar;
