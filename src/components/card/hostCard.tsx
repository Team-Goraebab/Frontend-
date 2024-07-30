import { FaHome } from 'react-icons/fa';

type HostCardProps = {
  hostNm?: string;
  ip: string;
  /**
   * connect: true
   * disconnect: false
   */
  status?: boolean;
};

const HostCard = ({ hostNm, ip, status = true }: HostCardProps) => {
  const borderColor = status ? 'border-blue_2' : 'border-red_2';
  const bgColor = status ? 'bg-blue_1' : 'bg-red_1';
  const textColor = status ? 'text-blue_2' : 'text-red_2';

  return (
    <div className="flex flex-col items-center p-[10px] border bg-white border-grey_3 rounded-lg shadow-lg w-72 h-28">
      <div
        className={`flex items-center justify-center w-full space-x-2 rounded-md border-solid border-2 ${borderColor} ${bgColor} py-2 mb-3`}
      >
        <FaHome className={`w-6 h-6 ${textColor}`} />
        <div className={`text-sm font-semibold ${textColor}`}>
          {hostNm || 'HOST'}
        </div>
      </div>
      <div className="text-lg font-semibold">{`eth0 : ${ip}`}</div>
    </div>
  );
};

export default HostCard;
