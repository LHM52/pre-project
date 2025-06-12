import axios from "axios";
import { useEffect, useState } from "react"
import { api } from "../api/ApiFetcher"
import type { Place } from "../types/types";
import { sortPlacesByDistance } from "../location/loc";

export default Main

function Main() {

    const [list, setList] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const positionObj = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                setLocation(positionObj);
                console.log("현재 위치:", positionObj);
            },
            (err) => {
                console.error("위치 접근 거부됨", err);
                alert(`위치 접근을 허용해주세요. 
${err}`)
                setLocation(null);
            }
        );
    }, []);


    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setIsLoading(true);
                setError(false);
                const data = await api.getList<{ places: Place[] }>('/places');

                if (location) {
                    const sorted = sortPlacesByDistance(data.places, location.latitude, location.longitude);
                    setList(sorted);
                } else {
                    setList(data.places);
                }

            } catch (err: unknown) {
                console.log("못받아옴 ㅅㄱ ")
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaces();
    }, [location]);

    if (isLoading) {
        return (
            <div className="text-2xl text-center">ㄱㄷㄱㄷ 로딩중임.</div>
        )
    }
    if (error) {
        return (
            <div className="text-2xl text-center">404 에러남.</div>
        )
    }


    return (
        <>
            <div className="p-5  max-w-[1200px] m-auto bg-[lightgrey] rounded-[10px]">
                <h2 className="text-center text-2xl font-bold mb-5">맛집 목록</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {list.map((place) => (
                        <div key={place.id} className="p-3 bg-white rounded-lg shadow-md flex flex-col">
                            <img
                                className="w-full h-48 object-cover rounded-md mb-2"
                                src={`http://localhost:3000/${ place.image.src }`}
                                alt={place.title}
                            />
                            <h3 className="text-lg font-semibold mb-2">{place.title}</h3>

                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

