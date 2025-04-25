"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

type PlacePrediction = google.maps.places.AutocompletePrediction;
type PlaceResult = google.maps.places.PlaceResult;

const AutocompleteInput = ({
    apiKey,
    onSelect,
    placeholder = "",
    value,
    showIcon,
    className,
}: {
    apiKey: string;
    onSelect: (place: PlaceResult) => void;
    placeholder?: string;
    value: string;
    showIcon: boolean
    className?: string
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);

    useEffect(() => {
        setInputValue(value)
    }, [value])

    useEffect(() => {
        const loader = new Loader({
            apiKey,
            libraries: ["places"],
        });

        loader.load().then(() => {
            autocompleteService.current = new google.maps.places.AutocompleteService();
            const dummyMap = document.createElement("div");
            placesService.current = new google.maps.places.PlacesService(dummyMap);
        });
    }, [apiKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
       
        if (!value) {
            setPredictions([]);
            return;
        }

        if (autocompleteService.current) {
            autocompleteService.current.getPlacePredictions(
                {
                    input: value,
                    componentRestrictions: { country: "ng" },
                    types: ["geocode"],
                },
                (preds) => {
                    setPredictions(preds || []);
                }
            );
        }
    };

    const handleSelect = (prediction: PlacePrediction) => {
        setInputValue(prediction.description);
        setPredictions([]);

        if (placesService.current) {
            placesService.current.getDetails(
                {
                    placeId: prediction.place_id,
                    //fields: ["formatted_address", "geometry.location", "name"],
                },
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                        onSelect(place);
                    }
                }
            );
        }
    };

    return (
        (<div className={`relative z-4 w-56 border border-primary-400 rounded-xl ${className}`}>
            <div className="flex items-center h-full">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full p-3 text-sm h-9 outline-none rounded-xl border-none`}
                />
                {
                    showIcon &&
                    <Button
                        className={`shadow-none cursor-default border-l border-l-primary-400 rounded-none`}
                    >
                        <Search className="w-4 h-4" />
                    </Button>
                }
            </div>
            {predictions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                    {predictions.map((prediction) => (
                        <li
                            key={prediction.place_id}
                            onClick={() => handleSelect(prediction)}
                            className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm truncate"
                        >
                            {prediction.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>)
    );
};

export default AutocompleteInput;