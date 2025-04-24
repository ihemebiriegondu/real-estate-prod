import { Button } from "@aws-amplify/ui-react";
import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CardCompact = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardCompactProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );
  const router = useRouter()

  return (
    (<div className="bg-white rounded-lg overflow-hidden shadow-lg text-primary-700 font-inter p-3 w-full flex min-h-40 h-fit mb-5">
      <div className="relative w-1/2">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.jpg")}
        />
        <div className="absolute bottom-2 left-2 flex gap-1 flex-col">
          {property.isPetsAllowed && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full w-fit">
              Pets
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Parking
            </span>
          )}
        </div>
      </div>
      <div className="w-2/3 ps-4 flex flex-col justify-between">
        <div>
          <p className="mb-1 uppercase text-sm">
            {property?.location?.address}, {property?.location?.city}
          </p>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold mb-1">
              {propertyLink ? (
                <Link
                  href={propertyLink}
                  className="hover:underline hover:text-blue-600"
                  scroll={false}
                >
                  {property.name}
                </Link>
              ) : (
                property.name
              )}
            </h2>
            {showFavoriteButton && (
              <button
                className="bg-white rounded-full p-1"
                onClick={onFavoriteToggle}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                    }`}
                />
              </button>
            )}
          </div>
          {
            /* 
           <div className="flex text-sm items-center">
            <Star className="w-3 h-3 text-yellow-400 mr-1" />
            <span className="font-semibold">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-1">
              ({property.numberOfReviews})
            </span>
          </div> 
            */
          }
        </div>
        <div className="flex gap-6">
          <span className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {property.beds}
          </span>
          <span className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.baths}
          </span>
          <span className="flex items-center">
            <House className="w-4 h-4 mr-1" />
            {property.squareFeet}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm mt-3">
          <div className="flex flex-col">
            <p className="uppercase">Price:</p>
            <p className="text-base font-bold">
              ${property.pricePerMonth.toFixed(0)}
              <span className="text-gray-600 text-xs font-normal"> /mo</span>
            </p>
          </div>
        </div>
      </div>
    </div>)
  );
};

export default CardCompact;
