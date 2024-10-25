'use client';

import { getDockerHubImages } from '@/services/api';
import React, { useState } from 'react';
import { FaStar, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { formatNumber } from '@/utils/format';

interface DockerImage {
  id: string;
  repo_name: string;
  is_official: boolean;
  star_count: number;
  pull_count: number;
  short_description: string;
  tags?: string[];
}

interface DockerHubContentProps {
  onSelectImage: (image: DockerImage) => void;
}

const DockerHubContent: React.FC<DockerHubContentProps> = ({
  onSelectImage,
}) => {
  const [query, setQuery] = useState<string>('');
  const [images, setImages] = useState<DockerImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    const results = await getDockerHubImages(query);
    setImages(results);
    setLoading(false);
  };

  const handleSelectImage = (image: DockerImage) => {
    setSelectedImage(image.repo_name);
    onSelectImage(image);
  };

  return (
    <div className="flex flex-col border border-dashed border-grey_2 rounded-lg w-full h-full p-6">
      <div className="flex w-full mb-4">
        <input
          type="text"
          placeholder="이미지를 검색하세요"
          className="border border-grey_2 rounded-l-lg w-full pl-4 py-3 font-pretendard font-light focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue_6 text-white rounded-r-lg focus:outline-none text-nowrap font-pretendard font-medium"
        >
          검색
        </button>
      </div>
      {loading && (
        <p className="mt-4 font-pretendard font-light">이미지 검색 중...</p>
      )}
      <div className="mt-4 w-full h-48 overflow-y-auto scrollbar-hide space-y-4">
        {images.length > 0
          ? images.map((image) => (
              <div
                key={image.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                  selectedImage === image.repo_name
                    ? 'border-blue_6 bg-blue-50'
                    : 'border-grey_2 hover:border-blue_6'
                }`}
                onClick={() => handleSelectImage(image)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <p className="font-bold font-pretendard text-lg truncate">
                      {image.repo_name}
                    </p>
                    {image.is_official && (
                      <span className="bg-blue_6 text-white text-xs px-2 py-1 rounded-full flex items-center font-pretendard font-bold">
                        <FaCheckCircle className="mr-1" />
                        Official
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FaStar className="mr-1 text-yellow-500" />
                      <span className="font-pretendard font-light text-sm">
                        {formatNumber(image.star_count)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaDownload className="mr-1 text-blue_6" />
                      <span className="font-pretendard font-light text-sm">
                        {formatNumber(image.pull_count)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-grey_5 pretendard font-light mb-2">
                  {image.short_description}
                </p>
              </div>
            ))
          : !loading && (
              <p className="text-grey_4 font-pretendard font-light text-center mt-20">
                검색 결과가 없습니다.
              </p>
            )}
      </div>
    </div>
  );
};

export default DockerHubContent;
