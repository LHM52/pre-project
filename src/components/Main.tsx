import axios from "axios";
import { useEffect, useState } from "react"

export default Main

interface Place {
    id: string
    title: string
    image: {
        src: string
        alt:string
    }
    lat: number
    lon: number
    description: string
}

class ApiFetcher {
    private baseUrl: string;

    constructor() {
        this.baseUrl = "http://localhost:3000"
    }

    async getList<T>(endpoint: string): Promise<T> {
        try {
            const res = await axios.get(`${ this.baseUrl }${ endpoint }`)
            return res.data;
        }
        catch (error: unknown) {
            console.log("응 못받아옴 ㅅㄱ");
            throw error;
        }
    }
}

const api = new ApiFetcher();

function Main() {

    const [list, setList] = useState<Place[]>([]);


    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const data = await api.getList<{ places: Place[] }>('/places');
                setList(data.places);
                console.log(data.places[0].image.src);
            } catch (err: any) {
                console.log("응 못받아옴 ㅅㄱ ")
            }
        };

        fetchPlaces();
    }, []);



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