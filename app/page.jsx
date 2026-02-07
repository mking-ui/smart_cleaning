'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className=" px-4 md:px-16 lg:px-32 bg-emerald-900/80">
        <HeaderSlider />

      </div>
      <Footer />
    </>
  );
};

export default Home;
