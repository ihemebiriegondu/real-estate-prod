"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setFilters } from "@/state";
import { FaHouseUser, FaMapLocationDot } from "react-icons/fa6";
import { MdPriceChange } from "react-icons/md";
import Link from "next/link";
import { useGetAuthUserQuery } from "@/state/api";
import AutocompleteInput from "@/components/AutoCompleteInput";
import { useAppSelector } from "@/state/redux";

const HeroSection = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: authUser } = useGetAuthUserQuery();
  const filters = useAppSelector((state) => state.global.filters);

  const handleLocationSearch = async () => {
    const lat = Number(filters.coordinates[0]) || 3.2468617;
    const lng = Number(filters.coordinates[1]) || 6.535408;
    const name = filters.location || "Lagos";

    const params = new URLSearchParams({
      location: name,
      lat: lat.toString(),
      lng: lng.toString(),
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative md:h-screen h-fit md:mt-0  mt-[90px] flex md:flex-row flex-col overflow-hidden bg-primary-700">
      <div className="md:w-[55%] flex items-center md:justify-start justify-center px-4 md:px-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-lg md:pt-0 pt-10"
        >
          <span className="md:text-xs text-[10px] uppercase tracking-widest text-gray-400 mb-2 block font-inter font-light md:text-start text-center">
            Discover homes, rentals, and short-lets with ease
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading:![3rem] md:leading:![4rem] lg:!leading-[5rem] mb-4 font-playFair md:text-start text-center">
            Your Home Search, Simplified
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 font-nunito sm:text-start text-center">
            From cozy apartments to spacious family homes, explore listings that match your lifestyle, location, and budget — all in one place.
          </p>
          <div className="flex md:justify-start justify-center gap-4">
            <Button
              className="bg-teal-400 hover:bg-teal-500 text-black md:!py-7 !py-5 md:!px-9 !px-6 rounded-none"
              onClick={() => {
                if (authUser) {
                  router.push('/search')
                } else {
                  router.push('/signup')
                }
              }}
            >
              Get Started
            </Button>
            {
              !authUser &&
              <Link href="/signin">
                <Button className="bg-white text-black md:!py-7 !py-5 md:!px-9 !px-6 rounded-none shadow-md">
                  Login
                </Button>
              </Link>
            }
          </div>
        </motion.div>
      </div>


      <div className="md:w-[45%] relative h-full flex items-end pb-6 md:pb-12 md:ps-0 ps-4 pr-4 md:pr-12 pt-16 md:pt-40">
        <div className="absolute top-40 bottom-1 left-10 right-10 z-0 overflow-hidden">
          <Image
            src="/landing-splash.jpg"
            alt="Hero Image"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary-700 to-transparent z-10" />
        </div>

        <div className="relative z-20 w-full max-w-md ml-auto mb-8 mr-auto md:mr-5 font-nunito">
          <div className="flex gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-primary-700 flex flex-col gap-6 h-full"
            >
              <div className="bg-white py-4 px-6 grow flex items-center justify-center">
                <FaMapLocationDot className="w-8 h-8" />
              </div>
              <div className="bg-white py-4 px-6 grow flex items-center justify-center">
                <MdPriceChange className="w-8 h-8" />
              </div>
              <div className="bg-white py-4 px-6 grow flex items-center justify-center">
                <FaHouseUser className="w-8 h-8" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white text-primary-700 p-7 shadow-xl grow"
            >
              <h2 className="text-xl font-bold mb-4">Find a Property</h2>
              <div className="space-y-4">
                <AutocompleteInput
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                  value={searchQuery}
                  onSelect={(place) => {
                    const lat = Number(place.geometry?.location?.lat()) || 3.2468617;
                    const lng = Number(place.geometry?.location?.lng()) || 6.535408;

                    setSearchQuery(place.name || "")

                    dispatch(
                      setFilters({
                        location: place.name,
                        coordinates: [lng, lat],
                      })
                    );
                  }}
                  placeholder="Search by location"
                  className="bg-white border-primary-700 h-12 text-base w-full !rounded-md"
                  showIcon={false}
                />
                <Input
                  type="text"
                  placeholder="Price Range"
                  className="bg-white border-primary-700 h-12"
                  disabled
                />
                <Input
                  type="text"
                  placeholder="Property Type"
                  className="bg-white border-primary-700 h-12"
                  disabled
                />
                <Button
                  onClick={handleLocationSearch}
                  className="w-full bg-primary-700 hover:bg-[#D4AF37] hover:text-primary-700 text-teal-300 h-12"
                >
                  Search
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;