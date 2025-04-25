"use client";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "@/state/redux";
import { Loader } from "@googlemaps/js-api-loader";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

const Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      libraries: ["places"],
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(mapRef.current!, {
        center: {
          lat: filters.coordinates?.[1] || 9.0338725,
          lng: filters.coordinates?.[0] || 8.6774567,
        },
        zoom: 7,
        clickableIcons: false,
        fullscreenControl: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        scaleControl: false,
        rotateControl: false,
      });

      let currentInfoWindow: google.maps.InfoWindow | null = null;

      properties.forEach((property) => {
        createGoogleMarker(property, map, () => currentInfoWindow, (newWindow) => {
          currentInfoWindow = newWindow;
        });
      });

      const bounds = new google.maps.LatLngBounds();
      if (properties.length > 0) {
        properties.forEach((property) => {
          bounds.extend({
            lat: property.location.coordinates.latitude || 9.0338725,
            lng: property.location.coordinates.longitude || 8.6774567,
          });
        });
        map.fitBounds(bounds);
      } else {
        map.setCenter({ lat: 9.0338725, lng: 8.6774567 });
        map.setZoom(6);
      }

      setTimeout(() => {
        google.maps.event.trigger(map, "resize");
      }, 700);
    })
  }, [isLoading, isError, properties, filters]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createGoogleMarker = (
  property: Property,
  map: google.maps.Map,
  getCurrentInfoWindow: () => google.maps.InfoWindow | null,
  setCurrentInfoWindow: (iw: google.maps.InfoWindow | null) => void
) => {
  const marker = new google.maps.Marker({
    position: {
      lat: property.location.coordinates.latitude,
      lng: property.location.coordinates.longitude,
    },
    map,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div class="marker-popup">
        <div class="marker-popup-image">
          <img
            src=${property.photoUrls[0]}
            alt=${property.name}
            fill
            class="object-cover !h-10 !w-10 rounded-lg"
            sizes="40px"
          />  
        </div>
        <div>
          <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
          <p class="marker-popup-price">
            ₦${property.pricePerMonth}
            <span class="marker-popup-price-unit"> / month</span>
          </p>
        </div>
      </div>
    `,
  });

  marker.addListener("click", () => {
    const current = getCurrentInfoWindow();

    if (current === infoWindow) {
      infoWindow.close();
      setCurrentInfoWindow(null);
    } else {
      if (current) {
        current.close();
      }
      infoWindow.open(map, marker);
      setCurrentInfoWindow(infoWindow);
    }
  });
};



export default Map;