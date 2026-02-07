"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Report a Cleaning Environment",
      offer: "Easily report areas that need attention",
      buttonText1: "Report Now",
      buttonLink1: "/login", // 👈 link for first button
      buttonText2: "View Reports",
      buttonLink2: "/register", // 👈 link for second button
      imgSrc: assets.task5,
    },
    {
      id: 2,
      title: "Cleaning in Progress",
      offer: "Track ongoing cleaning tasks in real-time",
      buttonText1: "Track Task",
      buttonLink1: "/login",
      buttonText2: "Assign Cleaner",
      buttonLink2: "/register",
      imgSrc: assets.task4,
    },
    {
      id: 3,
      title: "Cleaning Completed",
      offer: "Confirm and review completed cleaning activities",
      buttonText1: "View Status",
      buttonLink1: "/login",
      buttonText2: "Generate Report",
      buttonLink2: "/register",
      imgSrc: assets.task1,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-auto md:h-screen overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <Image
          src={assets.bg}
          alt="background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-emerald-900/80"></div>
      </div>

      {/* Slider content */}
      <div
        className="relative flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between px-6 md:px-14 min-w-full h-full text-white gap-6 md:gap-0 py-12 md:py-0"
          >
            {/* Text content */}
            <div className="md:pl-8 max-w-lg text-center md:text-left">
              <p className="text-base text-yellow-400 pb-2">{slide.offer}</p>
              <h1 className="text-3xl md:text-[48px] md:leading-[56px] font-bold">
                {slide.title}
              </h1>
              <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start items-center mt-6 gap-4">
                <Link href={slide.buttonLink1}>
                  <button className="md:px-10 px-7 md:py-3 py-2 bg-yellow-400 text-emerald-900 rounded-full font-semibold hover:opacity-90 transition">
                    {slide.buttonText1}
                  </button>
                </Link>
                <Link href={slide.buttonLink2}>
                  <button className="group flex items-center gap-2 px-6 py-2 md:py-3 font-medium border border-yellow-400 rounded-full text-yellow-400 hover:bg-yellow-400 hover:text-emerald-900 transition">
                    {slide.buttonText2}
                    <Image
                      className="group-hover:translate-x-1 transition"
                      src={assets.arrow_icon}
                      alt="arrow_icon"
                    />
                  </button>
                </Link>
              </div>
            </div>

            {/* Image content */}
            <div className="flex items-center flex-1 bg-yellow-400/10 rounded-full justify-center">
              <Image
                className="md:w-96 w-52 drop-shadow-lg bg-yellow-400/10 rounded-full"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 z-10">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition ${
              currentSlide === index ? "bg-yellow-400" : "bg-yellow-400/40"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
