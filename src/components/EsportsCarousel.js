'use client';

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import CategoryBadge from "@/components/CategoryBadge";
import Date from "@/components/Date";

export default function EsportsCarousel({ esportsposts }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const totalPages = Math.ceil(esportsposts.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextPage();
    } else if (isRightSwipe) {
      prevPage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        let newItemsPerPage = 1;
        if (containerWidth >= 1280) newItemsPerPage = 4;
        else if (containerWidth >= 1024) newItemsPerPage = 3;
        else if (containerWidth >= 768) newItemsPerPage = 2;

        setItemsPerPage(newItemsPerPage);
        setCurrentPage(0); // Reset to first page when resizing

        const itemWidth = containerWidth / newItemsPerPage;
        carouselRef.current.style.transform = `translateX(0px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const itemWidth = containerWidth / itemsPerPage;
      carouselRef.current.style.transform = `translateX(-${currentPage * containerWidth}px)`;
    }
  }, [currentPage, itemsPerPage]);

  return (
    <div className="bg-neutral-900 pt-4 px-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-2xl md:text-4xl font-medium font-poppins tracking-wider">Trending Posts</h3>
        <div className="flex items-center space-x-4">
          <button onClick={prevPage} className="text-white text-xl md:text-2xl">&larr;</button>
          <span className="text-white text-sm md:text-base">{currentPage + 1} / {totalPages}</span>
          <button onClick={nextPage} className="text-white text-xl md:text-2xl">&rarr;</button>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {esportsposts.map((post, index) => (
            <div key={post.id} className="w-full flex-shrink-0 md:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
              <div className="text-white transition-all pb-8 duration-300 hover:bg-neutral-800 border-l border-r border-t border-neutral-700 hover:border-t-green-500 pt-4 px-4 h-full flex flex-col">
                <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight font-poppins mb-2">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <CategoryBadge name={post.categories.nodes[0].name} href={post.categories.nodes[0].slug} borderColor='green-500' textColor='white'/>
                <Link href={post.slug} className="block mt-2 flex-shrink-0">
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.title}
                    width={1000}
                    height={500}
                    className="w-full h-36 md:h-48 object-cover"
                  />
                </Link>
                <div className="flex flex-col flex-grow">
                  <Link href={post.slug} className="flex-grow">
                    <h4 className="text-lg md:text-xl font-medium font-poppins mt-2 hover:underline">{post.title}</h4>
                  </Link>
                  <p className="text-xs font-poppins font-normal mt-2 mb-4 text-neutral-400">
                    <Date date={post.dateGmt} /> | {post.author.node.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}