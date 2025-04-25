import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import React from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  if (isLoading || !isLoaded) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  const center = {
    lat: property.location.coordinates.latitude,
    lng: property.location.coordinates.longitude,
  };

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
        Map and Location
      </h3>
      <div className="flex justify-between items-center text-sm text-primary-500 mt-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>
      <div className="relative mt-4 rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          options={{
            fullscreenControl: false,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            scaleControl: false,
            rotateControl: false,
            disableDefaultUI: true,
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default PropertyLocation;