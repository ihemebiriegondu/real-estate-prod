"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FiltersState, initialState, setFilters } from "@/state";
import { FaHouseUser, FaMapLocationDot } from "react-icons/fa6";
import { MdPriceChange } from "react-icons/md";
import Link from "next/link";
import { useGetAuthUserQuery } from "@/state/api";
import AutocompleteInput from "@/components/AutoCompleteInput";
import { useAppSelector } from "@/state/redux";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyTypeIcons } from "@/lib/constants";
import { formatPriceValue } from "@/lib/utils";

type FiltersKey = keyof FiltersState;

const HeroSection = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: authUser } = useGetAuthUserQuery();
  const filters = useAppSelector((state) => state.global.filters);

  const handleFilterChange = (
    keyOrObj: FiltersKey | Partial<FiltersState>,
    value?: any,
    isMin?: boolean
  ) => {
    const newFilters: FiltersState = { ...filters };

    if (typeof keyOrObj === "object") {
      Object.entries(keyOrObj).forEach(([key, val]) => {
        newFilters[key as FiltersKey] = val as any;
      });
    } else {
      if (keyOrObj === "priceRange") {
        const currentRange = filters.priceRange || [null, null];
        const updatedRange: [number | null, number | null] = [...currentRange];

        if (value === "any") {
          value = null;
        } else {
          value = Number(value);
        }

        if (isMin) {
          updatedRange[0] = value;
        } else {
          updatedRange[1] = value;
        }

        newFilters[keyOrObj] = updatedRange as any;
      } else {
        newFilters[keyOrObj] = value;
      }
    }
    console.log(newFilters)
    dispatch(setFilters(newFilters));
  };

  const handleLocationSearch = async () => {
    const lat = Number(filters.coordinates[0]) || 9.0338725;
    const lng = Number(filters.coordinates[1]) || 8.6774567;
    const name = filters.location || "Nigeria";

    const params = new URLSearchParams({
      location: name,
      lat: lat.toString(),
      lng: lng.toString(),
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    (<div className="relative md:h-screen h-fit md:mt-0  mt-[90px] flex md:flex-row flex-col overflow-hidden bg-primary-700">
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
              className="bg-teal-400 hover:bg-teal-500 text-black md:!py-7 !py-5 md:!px-9 !px-6 rounded-none text-base"
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
                <Button className="bg-white text-black md:!py-7 !py-5 md:!px-9 !px-6 rounded-none shadow-md text-base">
                  Login
                </Button>
              </Link>
            }
          </div>
        </motion.div>
      </div>
      <div className="md:w-[45%] relative h-full flex items-end pb-6 md:pb-12 md:ps-0 sm:ps-4 ps-1 sm:pr-4 pr-1 md:pr-12 pt-16 md:pt-40">
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

        <div className="relative z-20 w-full max-w-[30rem] ml-auto mb-8 mr-auto md:mr-5 font-nunito">
          <div className="flex sm:gap-6 gap-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-primary-700 flex flex-col sm:gap-6 gap-2 h-full"
            >
              <div className="bg-white py-4 sm:px-6 px-3 grow flex items-center justify-center">
                <FaMapLocationDot className="sm:w-8 w-6 sm:h-8 h-6" />
              </div>
              <div className="bg-white py-4 sm:px-6 px-3 grow flex items-center justify-center">
                <MdPriceChange className="sm:w-8 w-6 sm:h-8 h-6" />
              </div>
              <div className="bg-white py-4 sm:px-6 px-3 grow flex items-center justify-center">
                <FaHouseUser className="sm:w-8 w-6 sm:h-8 h-6" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white text-primary-700 sm:p-7 p-5 shadow-xl grow"
            >
              <h2 className="text-xl font-bold mb-4">Find a Property</h2>
              <div className="space-y-4">
                <AutocompleteInput
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                  value={searchQuery || filters.location === 'Nigeria' ? "" : filters.location}
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
                  placeholder="Type Location: Lagos, Akure, Ibadan"
                  className="bg-white border-primary-700 h-12 text-base !w-full !rounded-md"
                  showIcon={false}
                />
                <div className="flex gap-1">
                  {/* Minimum Price Selector */}
                  <Select
                    value={filters.priceRange[0]?.toString() || "any"}
                    onValueChange={(value) =>
                      handleFilterChange("priceRange", value, true)
                    }
                  >
                    <SelectTrigger className={`w-1/2 rounded-md h-12 border-primary-700 !ring-0 ${filters.priceRange[0] === null && 'text-black/40'}`}>
                      <SelectValue>
                        {formatPriceValue(filters.priceRange[0], true)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="any">Any Min Price</SelectItem>
                      {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
                        <SelectItem key={price} value={price.toString()}>
                          ₦{price / 1000}k+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Maximum Price Selector */}
                  <Select
                    value={filters.priceRange[1]?.toString() || "any"}
                    onValueChange={(value) =>
                      handleFilterChange("priceRange", value, false)
                    }
                  >
                    <SelectTrigger className={`w-1/2 rounded-md h-12 border-primary-700 !ring-0 ${filters.priceRange[1] === null && 'text-black/40'}`}>
                      <SelectValue>
                        {formatPriceValue(filters.priceRange[1], false)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="any">Any Max Price</SelectItem>
                      {[1000, 2000, 3000, 5000, 10000].map((price) => (
                        <SelectItem key={price} value={price.toString()}>
                          &lt;₦{price / 1000}k
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select
                  value={filters.propertyType || "any"}
                  onValueChange={(value) => {
                    handleFilterChange("propertyType", value)
                  }}
                >
                  <SelectTrigger className={`w-full rounded-md border-primary-700 h-12 !ring-0 ${filters.propertyType === 'any' && "text-black/40"}`}>
                    <SelectValue placeholder="Home Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="any">Property Type</SelectItem>
                    {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          <span>{type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
    </div>)
  );
};

export default HeroSection;