import { useDraggable } from "@dnd-kit/core";
import type { Place } from "../@types/types";
import { useFavorites } from "../store/useFavorites";

interface DraggablePlaceProps {
    place: Place;
    className?: string;
    children?: React.ReactNode;
}

export function DraggablePlace({ place, children}: DraggablePlaceProps) {
    const { favorites = [] } = useFavorites(); 
    const isFavorite = favorites.some(fav => fav.id === place.id); 

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `draggable-${ place.id }`,
        data: { place },
        disabled: isFavorite, 
    });

    const style = transform ? {
        transform: `translate3d(${ transform.x }px, ${ transform.y }px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                bg-white p-4 rounded-lg shadow-md
                flex flex-col items-center justify-center text-center
                relative 
                ${isFavorite ? 'opacity-50 cursor-not-allowed border-2 border-green-500' : 'cursor-grab'}
            `}
        >
            {isFavorite && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    찜 완료
                </span>
            )}
            <img
                className="w-full h-48 object-cover rounded-md mb-2"
                src={`http://localhost:3000/${ place.image.src }`}
                alt={place.title}
            />
            <h3 className="text-lg font-semibold mb-2">{place.title}</h3>
            {children}
        </div>
    );
}

export default DraggablePlace;
