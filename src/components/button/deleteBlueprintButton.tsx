'use client';

import { useHostStore } from '@/store/hostStore';
import { AiOutlineDelete } from 'react-icons/ai';

const DeleteBlueprintButton = () => {
  const deleteAllHosts = useHostStore((state) => state.deleteAllHosts);

  const handleDelete = () => {
    if (confirm('설계도를 삭제하시겠습니까?')) {
      deleteAllHosts();
    }
  };

  return (
    <div className="fixed bottom-8 right-[150px] transform translate-x-4 h-[40px] px-4 bg-white text-red_6 hover:text-white hover:bg-red_5 active:bg-red_6 rounded-lg border-gray-300 border flex items-center justify-center transition duration-200 ease-in-out">
      <button
        className="flex items-center gap-2 text-center"
        onClick={handleDelete}
      >
        <AiOutlineDelete size={20} />
        <span className="font-medium font-pretendard">삭제</span>
      </button>
    </div>
  );
};

export default DeleteBlueprintButton;
