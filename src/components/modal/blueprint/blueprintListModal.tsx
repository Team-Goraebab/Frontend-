'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@nextui-org/react';
import axios from 'axios';
import { showSnackbar } from '@/utils/toastUtils';
import { useHostStore } from '@/store/hostStore';
import { useSnackbar } from 'notistack';
import { deleteBlueprint } from '@/services/blueprint/api';
import { useBlueprintAllStore } from '@/store/blueprintAllStore';
import { getRandomThemeColor } from '@/utils/randomTemeColor';
import { colorsOption } from '@/data/color';

interface BlueprintListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

const BlueprintListModal = ({ isOpen, onClose }: BlueprintListModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { hosts, isHostExist } = useHostStore();
  const { setHosts } = useBlueprintAllStore.getState();

  const fetchBlueprints = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/blueprint/list`);
      setBlueprints(response.data || []);
    } catch (error) {
      console.error('Error fetching blueprints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlueprint = async (
    blueprintId: string,
    blueprintName: string,
  ) => {
    try {
      await deleteBlueprint(blueprintId);
      showSnackbar(
        enqueueSnackbar,
        `${blueprintName} 설계도를 삭제했습니다.`,
        'success',
        '#4CAF50',
      );
      setBlueprints((prev) =>
        prev.filter((bp) => bp.blueprintId !== blueprintId),
      );
    } catch (error) {
      showSnackbar(enqueueSnackbar, '삭제 실패했습니다.', 'error', '#d32f2f');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBlueprints();
    }
  }, [isOpen]);

  const handleLoadBlueprint = (blueprint: any) => {
    if (hosts.length >= 5) {
      showSnackbar(
        enqueueSnackbar,
        '호스트는 최대 5개까지만 추가할 수 있습니다.',
        'error',
        '#d32f2f',
      );
      return;
    }

    const isDuplicate = blueprint.data.host.some((hostData: any) =>
      isHostExist(hostData.id),
    );

    if (isDuplicate) {
      showSnackbar(
        enqueueSnackbar,
        '이미 불러온 설계도입니다.',
        'error',
        '#d32f2f',
      );
      return;
    }

    const newHosts = blueprint.data.host.map((hostData: any) => ({
      ...hostData,
      themeColor: hostData.themeColor || getRandomThemeColor(colorsOption),
    }));

    setHosts(newHosts);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent className="p-4" style={{ overflow: 'hidden' }}>
        <ModalHeader className="flex flex-col gap-1">설계도 목록</ModalHeader>
        <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              로딩 중...
            </div>
          ) : blueprints.length === 0 ? (
            <div className="flex justify-center items-center p-4">
              데이터가 없습니다.
            </div>
          ) : (
            <Table aria-label="Blueprint list">
              <TableHeader>
                <TableColumn>설계도 이름</TableColumn>
                <TableColumn>생성일</TableColumn>
                <TableColumn>로컬/리모트</TableColumn>
                <TableColumn>작업</TableColumn>
              </TableHeader>
              <TableBody>
                {blueprints.map((blueprint) => (
                  <TableRow key={blueprint.blueprintId}>
                    <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {blueprint.name}
                    </TableCell>
                    <TableCell>{formatDate(blueprint.dateCreated)}</TableCell>
                    <TableCell>
                      {blueprint.data.host[0]?.isRemote ? 'Remote' : 'Local'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => handleLoadBlueprint(blueprint)}
                        className="mr-3"
                      >
                        불러오기
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() =>
                          handleDeleteBlueprint(
                            blueprint.blueprintId,
                            blueprint.name,
                          )
                        }
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BlueprintListModal;
