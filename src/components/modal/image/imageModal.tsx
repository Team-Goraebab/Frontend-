'use client';

import React, { useState, useEffect } from 'react';
import {
  FaFolderOpen,
  FaDocker,
  FaTag,
  FaFileSignature,
  FaTrash,
} from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import { showSnackbar } from '@/utils/toastUtils';
import { DockerHubContent } from '@/components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    name: string,
    tag: string,
    file: File | null,
    size: string,
    source: 'local' | 'dockerHub',
    dockerImageInfo?: any
  ) => void;
}

/**
 * 이미지 모달
 * @param isOpen 이미지 모달 열림 유무
 * @param onClose 이미지 모달 닫기 핸들러
 * @param onSave 이미지 모달 저장 핸들러
 * @returns
 */
const ImageModal = ({ isOpen, onClose, onSave }: ModalProps) => {
  const [activeTab, setActiveTab] = useState('local');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setName('');
      setTag('');
      setSize('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (file: File | null) => {
    if (file) {
      const validExtensions = ['.tar', '.tar.gz', '.tar.bz2', '.tar.xz'];
      const fileExtension = file.name
        .slice(file.name.lastIndexOf('.'))
        .toLowerCase();

      const isValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isValidExtension) {
        showSnackbar(
          enqueueSnackbar,
          'tar, tar.gz, tar.bz2, tar.xz 파일만 업로드 가능합니다.',
          'error',
          '#FF4853'
        );
        setFile(null);
        setSize('');
        return;
      }

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      if (parseFloat(fileSizeMB) > 5000) {
        showSnackbar(
          enqueueSnackbar,
          '파일 용량이 5000MB를 초과했습니다.',
          'error',
          '#FF4853'
        );
        setFile(null);
        setSize('');
      } else {
        setFile(file);
        setSize(fileSizeMB);
      }
    } else {
      setFile(null);
      setSize('');
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setSize('');
  };

  // 유효성 검사
  const validateInputs = () => {
    if (!file && activeTab === 'local') {
      showSnackbar(
        enqueueSnackbar,
        '이미지를 선택해주세요.',
        'error',
        '#FF4853'
      );
      return false;
    }
    if (!name) {
      showSnackbar(enqueueSnackbar, '이름을 입력해주세요.', 'error', '#FF4853');
      return false;
    }
    if (!tag) {
      showSnackbar(enqueueSnackbar, '태그를 입력해주세요.', 'error', '#FF4853');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateInputs()) {
      const id = uuidv4();
      if (activeTab === 'local' && file) {
        onSave(id, name, tag, file, size, 'local');
      } else if (activeTab === 'docker') {
        const dockerImageInfo = {};
        onSave(id, name, tag, null, size, 'dockerHub', dockerImageInfo);
      }
      onClose();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'local':
        return (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              handleFileSelection(droppedFile);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col justify-start w-full h-full border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer"
          >
            {file ? (
              <div className="mt-4 p-4 bg-gray-100 rounded w-full relative">
                <p className="font-pretendard font-bold text-blue-500">
                  {file.name}
                </p>
                <p className="font-pretendard font-light text-gray-500 text-sm">
                  {size} MB
                </p>
                <button
                  onClick={handleDeleteFile}
                  className="absolute flex flex-row gap-2 items-center px-4 top-5 right-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  <FaTrash />
                  삭제
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full text-gray-400 cursor-pointer">
                <FaFolderOpen size={40} className="mb-2" />
                <span>여기에 파일을 드롭하거나 클릭하여 선택하세요</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".tar,.tar.gz,.tar.bz2,.tar.xz"
                  className="hidden"
                />
              </label>
            )}
          </div>
        );
      case 'docker':
        return <DockerHubContent />;
      default:
        return null;
    }
  };

  const handleCloseBtn = () => {
    onClose();
    setActiveTab('local');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-4xl mx-4 md:mx-0 h-full md:h-4/5 flex flex-col shadow-lg overflow-hidden">
        <button
          onClick={handleCloseBtn}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-center">
          <span className="text-blue-500 font-pretendard font-bold">
            이미지
          </span>
          <span className="text-black font-pretendard font-bold">
            를 불러올 방식을 선택하세요.
          </span>
        </h2>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center px-4 py-2 mr-2 ${
              activeTab === 'local'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            } rounded shadow`}
          >
            <FaFolderOpen className="mr-2" />
            Local Path
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center px-4 py-2 ${
              activeTab === 'docker'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            } rounded shadow`}
          >
            <FaDocker className="mr-2" />
            Docker Hub
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center overflow-auto">
          {renderTabContent()}
        </div>
        <div className="mt-2 space-y-2">
          <div className="relative">
            <FaFileSignature className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FaTag className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="태그 (쉼표로 구분)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 mt-2 bg-blue-500 font-pretendard text-white rounded shadow hover:bg-blue-600 focus:outline-none"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
