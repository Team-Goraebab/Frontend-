'use client';

import React from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiBox,
} from 'react-icons/fi';

interface ContainerListProps {
  containers: any[];
  onContainerClick: (id: string, name: string) => void;
}

const ContainerTable = ({
                          containers,
                          onContainerClick,
                        }: ContainerListProps) => {
  const renderStatusBadge = (status: string) => {

    let color = '';
    let icon = null;

    switch (status.toLowerCase()) {
      case 'running':
        color = 'bg-green_1 text-green_6';
        icon = <FiCheckCircle className="inline mr-1" />;
        break;
      case 'paused':
        color = 'bg-yellow_1 text-yellow_6';
        icon = <FiAlertTriangle className="inline mr-1" />;
        break;
      case 'exited':
        color = 'bg-grey_1 text-grey_6';
        icon = <FiXCircle className="inline mr-1" />;
        break;
      case 'dead':
        color = 'bg-red_1 text-red_6';
        icon = <FiXCircle className="inline mr-1" />;
        break;
      default:
        color = 'bg-blue_1 text-blue_6';
        icon = null;
    }

    return (
      <span className={`px-2 py-1 rounded-lg text-sm font-medium ${color}`}>
        {icon} {status}
      </span>
    );
  };

  return (
    <div className="mb-4 max-h-64 overflow-y-auto scrollbar-custom shadow-md rounded-lg border border-grey_2">
      <table className="table-auto w-full">
        <thead
          className="sticky top-0 bg-white dark:bg-black_5 z-10 border-t border-b border-grey_3 dark:border-grey_7">
        <tr>
          <th className="px-4 py-3 text-left text-grey_7 dark:text-grey_3 font-semibold">
            Name
          </th>
          <th className="px-4 py-3 text-left text-grey_7 dark:text-grey_3 font-semibold">
            ID
          </th>
          <th className="px-4 py-3 text-left text-grey_7 dark:text-grey_3 font-semibold">
            Status
          </th>
          <th className="px-4 py-3 text-left text-grey_7 dark:text-grey_3 font-semibold">
            State
          </th>
        </tr>
        </thead>
        <tbody>
        {containers.length > 0 ? (
          containers.map((container) => (
            <tr
              key={container.Id}
              onClick={() =>
                onContainerClick(container.Id, container.Names[0])
              }
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-grey_7 transition-all"
            >
              <td className="border px-4 py-3">
                <div className="flex items-center space-x-2">
                  <FiBox className="text-blue-500" />
                  <span>{container.Names[0] || 'Unnamed Container'}</span>
                </div>
              </td>
              <td className="border px-4 py-3">
                <code className="text-grey_6 dark:text-grey_3">
                  {container.Id.slice(0, 12)}
                </code>
              </td>
              <td className="border px-4 py-3">
                  <span className="text-grey_6 dark:text-grey_3">
                    {container.Status}
                  </span>
              </td>
              <td className="border px-4 py-3">
                {renderStatusBadge(container.State)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center py-4">
              No containers available
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default ContainerTable;
