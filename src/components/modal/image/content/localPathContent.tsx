'use client';

import React, { useEffect } from 'react';
import { FaFolderOpen } from 'react-icons/fa';

interface LocalPathContentProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
  onClose: () => void;
}

/**
 * 로컬에서 이미지 가져오기
 * @param onFileChange 선택한 파일 변경 핸들러
 * @param file 선택한 파일
 * @param onClose 로컬 이미지 컨텐츠 닫기 핸들러
 * @returns
 */
const LocalPathContent = ({
  onFileChange,
  file,
  onClose,
}: LocalPathContentProps) => {
  useEffect(() => {
    if (!file) {
      onFileChange(null);
    }
  }, [onClose, file, onFileChange]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg w-full h-full p-6 cursor-pointer hover:border-blue-500 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <FaFolderOpen className="text-gray-400 mb-4 w-20 h-20" />
      <p className="font-bold text-xl text-gray-400">Local Path</p>
      <p className="text-base text-gray-400 mt-2">
        내 컴퓨터에서 도커 이미지를 가져옵니다.
      </p>
      <input
        type="file"
        onChange={handleFileInputChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="mt-4 px-4 py-2 bg-gray-200 text-black rounded shadow hover:bg-gray-300 focus:outline-none transition-colors"
      >
        파일 찾기
      </label>
      {file && (
        <div className="mt-4 text-center w-full">
          <p className="text-gray-600">파일 이름: {file.name}</p>
          <p className="text-gray-600 mb-2">
            이미지 용량: {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}
    </div>
  );
};

export default LocalPathContent;
