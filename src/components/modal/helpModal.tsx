'use client';

import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from 'react-icons/ai';
import Help1 from '../contents/help/help1';
import Help2 from '../contents/help/help2';
import Help3 from '../contents/help/help3';

const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pages = [<Help1 key={1} />, <Help2 key={2} />, <Help3 key={3} />];

  //   페이지를 동적으로 관리하려면 아래 코드 사용
  //   const [pages, setPages] = useState([
  //     <Help1 key={1} />,
  //     <Help2 key={2} />,
  //     <Help3 key={3} />,
  //   ]);

  const settings = {
    dots: true, // 하단의 점 네비게이션
    infinite: true, // 무한 반복 여부
    speed: 500, // 넘기는 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
    slidesToScroll: 1, // 한 번에 넘길 슬라이드 수
    nextArrow: <NextArrow />, // 커스텀 화살표
    prevArrow: <PrevArrow />,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-8 rounded-lg w-full max-w-3xl">
        <button
          className="absolute top-4 right-4 text-black"
          onClick={() => setIsOpen(false)}
        >
          <AiOutlineClose size={24} />
        </button>
        <Slider {...settings}>{pages.map((page) => page)}</Slider>
      </div>
    </div>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-0 transform -translate-y-1/2 text-black cursor-pointer"
      onClick={onClick}
    >
      <AiOutlineRight size={30} />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-0 transform -translate-y-1/2 text-black cursor-pointer"
      onClick={onClick}
    >
      <AiOutlineLeft size={30} />
    </div>
  );
};

export default HelpModal;
