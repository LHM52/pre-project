// Main.tsx
import { useEffect, useState } from "react"
import { api } from "../api/ApiFetcher"
import type { Place } from "../@types/types";
import { sortPlacesByDistance } from "../location/loc";
import {
    DndContext,
    type DragEndEvent,
} from "@dnd-kit/core";

import DraggablePlace from "../components/DraggablePlace"
import { useFavorites } from "../store/useFavorites";
import LikeList from "./LikeList";


export default function Main() {

    const [list, setList] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);

    const { addFavorite } = useFavorites()

    const handleDragEnd = async (event: DragEndEvent) => {
        const { over, active } = event;
        if (over?.id === "like-zone") {
            const dragged: Place = active.data.current?.place;

            if (!dragged) {
                console.error("드래그된 플레이스 데이터가 없습니다.");
                return; // 데이터가 없으면 함수 종료
            }

            // 서버로 보낼 데이터 구조 정의
            const dataToSend = {
                place: {
                    id: dragged.id,
                    title: dragged.title,
                    image: {
                        src: dragged.image.src,
                        alt: dragged.image.alt,
                    },
                    lat: dragged.lat,
                    lon: dragged.lon,
                    description: dragged.description
                }
            };

            console.log('서버로 보낼 데이터:', dataToSend);

            try {
                const res: { message: string } = await api.PostList('/users/places', dataToSend);
                if (res && res.message === 'User place added/updated!') {
                    addFavorite(dragged);
                    console.log("서버에 찜한 맛집 저장 성공!");
                } else {
                    console.error("서버 저장 실패: 예상치 못한 응답", res);
                    alert("서버 저장에 실패했습니다. 응답 메시지를 확인해주세요.");
                }
            } catch (error) {
                console.error("서버 저장 중 오류 발생:", error);
                alert("서버 요청 중 문제가 발생했습니다. 개발자 도구 콘솔을 확인해주세요.");
            }
        }
    };

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
                alert(`위치 접근을 허용해주세요. \n${ err.message }`)
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
                console.error("못 불러옴 ㅅㄱ ", err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaces();
    }, [location]);

    if (isLoading) {
        return (
            <div className="text-2xl text-center">ㄱㄷㄱㄷ 로딩중..</div>
        )
    }
    if (error) {
        return (
            <div className="text-2xl text-center">404 에러임.</div>
        )
    }


    return (
        <DndContext onDragEnd={handleDragEnd}>
            <LikeList />

            <div className="p-5 max-w-[1200px] m-auto bg-[lightgrey] rounded-[10px]">
                <h2 className="text-center text-2xl font-bold mb-5">맛집 목록</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {list.map((place) => (
                        <DraggablePlace key={place.id} place={place} />
                    ))}
                </div>
            </div>
        </DndContext>
    )
}