'use client';

import React, { useState } from 'react';
import { Add } from '@mui/icons-material';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FiTrash } from 'react-icons/fi';
import MountDetail from './mountDetail';

interface MountConfigProps {
  type: 'bind' | 'volume';
  alias?: string;
  source: string;
  destination: string;
  name: string;
  driver: string;
  // mode: string;
}

interface MountSettingsProps {
  mountConfig: MountConfigProps;
  setMountConfig: React.Dispatch<React.SetStateAction<MountConfigProps>>;
  addMount: () => void;
  removeMount: (index: number) => void;
  mounts: MountConfigProps[];
  handleMountTypeChange: (type: 'bind' | 'volume') => void;
}

const MountSettings: React.FC<MountSettingsProps> = ({
  mountConfig,
  setMountConfig,
  addMount,
  removeMount,
  mounts,
  handleMountTypeChange,
}) => {
  const [errors, setErrors] = useState({
    source: '',
    destination: '',
    name: '',
  });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const validate = () => {
    const newErrors: any = {};
    if (mountConfig.type === 'bind' && !mountConfig.source) {
      newErrors.source = '소스 경로를 입력해 주세요.';
    }
    if (mountConfig.type === 'volume' && !mountConfig.name) {
      newErrors.name = '볼륨 이름을 입력해 주세요.';
    }
    if (!mountConfig.destination) {
      newErrors.destination = '대상 경로를 입력해 주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMount = () => {
    if (validate()) {
      addMount();
    }
  };

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex">
      <div className="w-1/2 pr-4">
        <div className="mb-6 space-y-1">
          <label className="text-base">
            <input
              type="radio"
              name="mountType"
              value="bind"
              checked={mountConfig.type === 'bind'}
              onChange={() => handleMountTypeChange('bind')}
              className="cursor-pointer mr-1"
            />
            바인드 마운트
          </label>
          <label className="text-base ml-4">
            <input
              type="radio"
              name="mountType"
              value="volume"
              checked={mountConfig.type === 'volume'}
              onChange={() => handleMountTypeChange('volume')}
              className="cursor-pointer mr-1"
            />
            볼륨 마운트
          </label>
        </div>
        <div className="mb-6 space-y-1">
          <label className="text-base">별칭 (선택)</label>
          <input
            type="text"
            value={mountConfig.alias || ''}
            placeholder="예시) 데이터 백업"
            onChange={(e) =>
              setMountConfig({ ...mountConfig, alias: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        {mountConfig.type === 'bind' && (
          <div className="mb-6 space-y-1">
            <label className="text-base">소스 경로 (필수)</label>
            <input
              type="text"
              value={mountConfig.source}
              placeholder="예시) /path/to/source"
              onChange={(e) =>
                setMountConfig({ ...mountConfig, source: e.target.value })
              }
              className={`w-full p-2 border rounded ${
                errors.source ? 'border-red_6' : ''
              }`}
              required
            />
            {errors.source && (
              <p className="text-red_6 text-xs">{errors.source}</p>
            )}
          </div>
        )}
        {mountConfig.type === 'volume' && (
          <div className="mb-6 space-y-1">
            <label className="text-base">볼륨 이름 (필수)</label>
            <input
              type="text"
              value={mountConfig.name}
              placeholder="예시) volume-name"
              onChange={(e) =>
                setMountConfig({ ...mountConfig, name: e.target.value })
              }
              className={`w-full p-2 border rounded ${
                errors.name ? 'border-red_6' : ''
              }`}
              required
            />
            {errors.name && <p className="text-red_6 text-xs">{errors.name}</p>}
          </div>
        )}
        <div className="mb-6 space-y-1">
          <label className="text-base">대상 경로 (필수)</label>
          <input
            type="text"
            value={mountConfig.destination}
            placeholder="예시) /path/to/destination"
            onChange={(e) =>
              setMountConfig({ ...mountConfig, destination: e.target.value })
            }
            className={`w-full p-2 border rounded ${
              errors.destination ? 'border-red_6' : ''
            }`}
            required
          />
          {errors.destination && (
            <p className="text-red_6">{errors.destination}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="text-base">드라이버</label>
          <input
            type="text"
            value={mountConfig.driver}
            placeholder="예시) local"
            onChange={(e) =>
              setMountConfig({ ...mountConfig, driver: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddMount}
            className="px-2 py-1 flex items-center bg-grey_1 hover:bg-blue-100 rounded text-sm"
          >
            <Add className="mr-1" fontSize="small" />
            추가
          </button>
        </div>
      </div>

      <div className="w-1/2 pl-2">
        <div className="mb-6">mounts 목록</div>
        <ul className="h-[460px] overflow-y-auto p-1">
          {mounts.map((mount, index) => (
            <li
              key={index}
              className="p-3 mb-1 bg-white rounded shadow-sm border border-grey_2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xs py-1 px-2 rounded-md font-bold bg-blue-100 text-blue_5">
                    {mount.type}
                  </span>
                  {mount.alias && (
                    <span className="ml-2 text-grey_5">({mount.alias})</span>
                  )}
                </div>
                <div className="flex">
                  <div className="">
                    <button
                      onClick={() => removeMount(index)}
                      className="p-1 text-red_6 rounded hover:bg-red_1 transition-colors text-md"
                    >
                      <FiTrash />
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggle(index)}
                    className="text-grey_4 hover:text-blue_3 ml-2"
                  >
                    {expandedIndex === index ? (
                      <FaChevronUp size={16} />
                    ) : (
                      <FaChevronDown size={16} />
                    )}
                  </button>
                </div>
              </div>
              {expandedIndex === index && (
                <div className="mt-2 text-xs text-grey_6 p-2 border-t border-grey_1">
                  <MountDetail mount={mount} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MountSettings;
