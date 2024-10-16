'use client';

import Image from 'next/image';
import Button from '@/components/button/button';

interface HelpProps {
  title: string;
  description: string;
  image: string;
  buttonVisible: boolean;
  buttonTitle?: string;
}

const HelpContent = ({
  title,
  description,
  image,
  buttonVisible,
  buttonTitle,
}: HelpProps) => {
  return (
    <div className="py-8 px-12">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-grey_7 mb-4">{description}</p>
        <div className="flex justify-center">
          <Image
            src={image}
            alt="Help image"
            width={340}
            height={200}
            className="rounded-md border"
          />
        </div>
      </div>
      {buttonVisible && (
        <div className="text-center mt-8">
          <Button title={buttonTitle || '버튼 이름'} onClick={() => {}} />
        </div>
      )}
    </div>
  );
};

export default HelpContent;
