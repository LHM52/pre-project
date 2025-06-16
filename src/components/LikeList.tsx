import { useEffect, useState } from "react"
import { useFavorites } from "../store/useFavorites"
import { useDroppable } from "@dnd-kit/core"
import { api } from "../api/ApiFetcher"

export default function LikeList() {
    const { favorites, removeFavorite, setFavorites } = useFavorites()
    const { setNodeRef } = useDroppable({ id: "like-zone" })
    const [isModal, setIsModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        await api.DeleteFavorite(id);
        removeFavorite(id);
    };

    useEffect(() => {
        api.GetFavorites().then((data) => {
            setFavorites(data);
        });
    }, [setFavorites]);

    return (
        <>
            {isModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="w-[400px] bg-white p-10 rounded-lg shadow-lg text-center">
                        <div>삭제 하시겠습니까?</div>
                        <div className="flex justify-evenly mt-5">
                            <button className="p-2 w-[100px] bg-[red] rounded-2xl" onClick={() => {
                                if (deleteId) handleDelete(deleteId);
                                setIsModal(false);
                                setDeleteId(null);
                            }}>네</button>
                            <button className="p-2 w-[100px] h-[50px] border-[1px]" onClick={() => setIsModal(false)}>아니오</button>
                        </div>
                    </div>
                </div>
            )}
            <div
                ref={setNodeRef}
                className="p-5 mb-5 mt-5 max-w-[1200px] m-auto bg-[lightgrey] rounded-[10px] min-h-[200px]"
            >
                <h2 className="text-center text-2xl font-bold mb-5">찜 목록</h2>
                {(favorites?.length ?? 0) === 0 ? (
                    <p className="text-center">이곳에 드래그 해주세요.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {favorites.map((place) => (
                            <div
                                key={place.id}
                                className="p-5 bg-white rounded-lg shadow-md flex flex-col"
                            >
                                <img
                                    className="w-full h-48 object-cover rounded-md mb-2"
                                    src={`http://localhost:3000/${ place.image.src }`}
                                    alt={place.title}
                                />
                                <h3 className="text-lg font-semibold mb-2">{place.title}</h3>
                                <button
                                    onClick={() => {
                                        setIsModal(true);
                                        setDeleteId(place.id);
                                    }}
                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
