import axios from "axios";
import { useEffect, useState } from "react"

export default LikeList

function LikeList() {

    return (
        <>
            <div className="p-5 mb-5 mt-5  max-w-[1200px] m-auto bg-[lightgrey] rounded-[10px]">
                <h2 className="text-center text-2xl font-bold mb-5">찜 목록</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* {list.map((place) => (
                        <div key={place.id} className="p-5 bg-white rounded-lg shadow-md flex flex-col">
                            <img
                                className="w-full h-48 object-cover rounded-md mb-2"
                                src={`http://localhost:3000/${ place.image.src }`}
                                alt={place.title}
                            />
                            <h3 className="text-lg font-semibold mb-2">{place.title}</h3>

                        </div>
                    ))} */}
                </div>
            </div>
        </>
    )
}