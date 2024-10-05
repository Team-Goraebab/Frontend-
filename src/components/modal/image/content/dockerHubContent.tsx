'use client';

import { getDockerHubImages } from '@/services/api';
import React, { useState } from 'react';
import { FaStar, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { showSnackbar } from '@/utils/toastUtils';
import { useSnackbar } from 'notistack';
import { formatNumber } from '@/utils/format';

const DockerHubContent = () => {
  const [query, setQuery] = useState<string>('');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleSearch = async () => {
    setLoading(true);
    const results = await getDockerHubImages(query);
    setImages(results);
    setLoading(false);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText('docker pull ' + text);

    showSnackbar(
      enqueueSnackbar,
      '명령어가 성공적으로 복사되었습니다!',
      'success',
      '#4C48FF'
    );
  };

  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg w-full h-full p-6">
      <div className="flex w-full mb-4">
        <input
          type="text"
          placeholder="이미지를 검색하세요"
          className="border border-gray-300 rounded-l-lg w-full pl-4 py-3 font-pretendard font-light focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue_6 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none text-nowrap font-pretendard font-medium"
        >
          검색
        </button>
      </div>
      {loading && (
        <p className="mt-4 font-pretendard font-light">이미지 검색 중...</p>
      )}
      <div className="mt-4 w-full h-48 overflow-y-auto scrollbar-hide">
        {images.length > 0
          ? images.map((image) => (
              <div
                key={image.id}
                className={`border ${
                  image.is_official ? 'border-blue_6' : 'border-gray-300'
                } rounded p-4 mb-4 flex justify-between items-center`}
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <p className="font-bold font-pretendard mr-2 text-lg">
                        {image.repo_name}
                      </p>
                      {image.is_official && (
                        <span className="bg-blue_6 text-white text-xs px-3 py-1 rounded-full flex items-center font-pretendard font-bold">
                          <FaCheckCircle className="mr-1" />
                          Official
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <FaStar className="mr-2 text-yellow-500" />
                      <span className="font-pretendard font-light text-sm">
                        {formatNumber(image.star_count)}
                      </span>
                      <FaDownload className="ml-4 mr-2 text-blue_6" />
                      <span className="font-pretendard font-light text-sm">
                        {formatNumber(image.pull_count)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 pretendard font-light mb-2">
                    {image.short_description}
                  </p>
                  <div className="flex justify-end items-center mt-4">
                    <div className="border border-blue_6 rounded-xl flex flex-row items-center gap-4">
                      <p className="text-gray-700 font-pretendard font-medium text-sm pl-4">
                        docker pull {image.repo_name}
                      </p>
                      <button
                        onClick={() => handleCopy(image.repo_name)}
                        className="flex items-center bg-blue_6 px-4 py-1.5 rounded-r-lg text-white hover:bg-blue_4 focus:outline-none"
                      >
                        <span className="font-pretendard font-bold text-sm">
                          Copy
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <p className="text-gray-500 font-pretendard font-light text-center mt-20">
                검색 결과가 없습니다.
              </p>
            )}
      </div>
    </div>
  );
};

export default DockerHubContent;
