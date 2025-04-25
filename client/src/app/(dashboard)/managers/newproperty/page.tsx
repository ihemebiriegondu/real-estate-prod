"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: "",
      highlights: "",
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      throw new Error("No manager ID found");
    }
    
    setLoading(true)
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "photoUrls") {
        const files = value as File[];
        files.forEach((file: File) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    formData.append("managerCognitoId", authUser.cognitoInfo.userId);
    console.log(formData)
   
    await createProperty(formData).then(() => {
      router.push("/managers/properties")
    }).then(() => {
      setLoading(false)
    })
  };

  const getLocation = () => {
    if (!isLoaded) {
      toast.info("Google Maps API is not loaded yet.", { duration: 1500 })
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(latitude, longitude);

        geocoder.geocode({ location: latLng }, (results, status) => {
          setLocationLoading(false);
          if (status === "OK" && results && results[0]) {
            const addressComponents = results[0].address_components;

            const street = addressComponents.find((component) =>
              component.types.includes("route")
            )?.long_name || "";
            const city = addressComponents.find((component) =>
              component.types.includes("locality")
            )?.long_name || "";
            const state = addressComponents.find((component) =>
              component.types.includes("administrative_area_level_1")
            )?.long_name || "";
            const postalCode = addressComponents.find((component) =>
              component.types.includes("postal_code")
            )?.long_name || "";
            const country = addressComponents.find((component) =>
              component.types.includes("country")
            )?.long_name || "";

            form.setValue("address", street);
            form.setValue("city", city);
            form.setValue("state", state);
            form.setValue("postalCode", postalCode);
            form.setValue("country", country);
          } else {
            alert("Unable to retrieve your address. Please try again.");
          }
        });
      },
      (error) => {
        setLocationLoading(false);
        alert("Error getting location: " + error.message);
      }
    );
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField name="name" label="Property Name" />
                <CustomFormField
                  name="description"
                  label="Description"
                  type="textarea"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Fees */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Fees</h2>
              <CustomFormField
                name="pricePerMonth"
                label="Price per Month"
                type="number"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="securityDeposit"
                  label="Security Deposit"
                  type="number"
                />
                <CustomFormField
                  name="applicationFee"
                  label="Application Fee"
                  type="number"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="beds"
                  label="Number of Beds"
                  type="number"
                />
                <CustomFormField
                  name="baths"
                  label="Number of Baths"
                  type="number"
                />
                <CustomFormField
                  name="squareFeet"
                  label="Square Feet"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomFormField
                  name="isPetsAllowed"
                  label="Pets Allowed"
                  type="switch"
                />
                <CustomFormField
                  name="isParkingIncluded"
                  label="Parking Included"
                  type="switch"
                />
              </div>
              <div className="mt-4">
                <CustomFormField
                  name="propertyType"
                  label="Property Type"
                  type="select"
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Amenities and Highlights */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Amenities and Highlights
              </h2>
              <div className="space-y-6">
                <CustomFormField
                  name="amenities"
                  label="Amenities"
                  type="select"
                  options={Object.keys(AmenityEnum).map((amenity) => ({
                    value: amenity,
                    label: amenity,
                  }))}
                />
                <CustomFormField
                  name="highlights"
                  label="Highlights"
                  type="select"
                  options={Object.keys(HighlightEnum).map((highlight) => ({
                    value: highlight,
                    label: highlight,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <CustomFormField
                name="photoUrls"
                label="Property Photos"
                type="file"
                accept="image/*"
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Additional Information */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold mb-4">
                  Additional Information
                </h2>

                <Button
                  type="button"
                  onClick={getLocation}
                  className="bg-primary-700 text-white"
                  disabled={locationLoading}
                >
                  {locationLoading ? "Getting Location..." : "Use Current Location"}
                </Button>
              </div>

              <CustomFormField name="address" label="Address" />
              <div className="flex justify-between gap-4">
                <CustomFormField name="city" label="City" className="w-full" />
                <CustomFormField
                  name="state"
                  label="State"
                  className="w-full"
                />
                <CustomFormField
                  name="postalCode"
                  label="Postal Code"
                  className="w-full"
                />
              </div>
              <CustomFormField name="country" label="Country" />
            </div>

            <Button
              type="submit"
              className="bg-primary-700 text-white w-full mt-8"
            >
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
