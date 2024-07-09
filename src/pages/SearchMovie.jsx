import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGenres } from "../store/slices/genresSlice";
import useFetch from "../hooks/useFetch";
import useSearchMovie from "../hooks/useSearchMovie";
import SliderGenre from "../components/Search/SliderGenre";
import { Input } from "../components/Search/Input";
import GridMovie from "../components/Search/GridMovie";
import LoadingSearch from "../components/Loading/SearchMovie/LoadingSearch";
import MovieNaoEncontrado from "../components/Search/MovieNaoEncontrado";

const SearchMovie = () => {
    // Buscando os gêneros e o tipo de série (movie ou tv)
    const genres = useSelector((state) => state.genresMovies);
    const searchType = useSelector((state) => state.type);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Buscando filmes ou séries mais populares
    const baseUrl = "https://api.themoviedb.org/3";
    const [seriesOrMovies, getSeriesOrMovies, isError, loading] =
        useFetch(baseUrl);

    // Buscando a pesquisa do usuário
    const [dados, getMovie, , resetValue, loadingSearchUser] = useSearchMovie(searchType);
    const [inputValue, setInputValue] = useState("");

    const [userGenre, setUserGenre] = useState("");

    useEffect(() => {
        dispatch(fetchGenres(searchType));
        const genreQueryParam = `with_genres=${userGenre}`;
        const url = `/discover/${searchType}`;
        const query = `${genreQueryParam}`;

        getSeriesOrMovies(url, query);
        resetValue(null);
    }, [searchType, userGenre]);

    const goSearch = (e) => {
        e.preventDefault();
        getMovie(inputValue);
        setInputValue("");
    };

    const handleNavigate = (id) => {
        navigate(`/${searchType}/${id}`);
    };

    if (loading || loadingSearchUser) {
        return <LoadingSearch />;
    }

    return (
        <div className='px-8 md:px-10 lg:px-12 2xl:px-16 pt-[80px] flex-grow'>
            {isError && <p>Ocorreu um erro ao carregar os filmes</p>}
            {!loading && !isError && (
                <>
                    <Input
                        text='O que você está procurando?'
                        goSearch={goSearch}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                    />
                    {/* GÊNEROS */}
                    <div className='my-6'>
                        <SliderGenre
                            genres={genres}
                            setUserGenre={setUserGenre}
                        />
                    </div>
                    {/* MOSTRAR FILMES POPULARES */}
                    {
                        dados?.results.length === 0 
                        ? <MovieNaoEncontrado/>
                        : 
                        <main className='mt-10'>
                            <h2 className='text-white font-semibold text-lg mb-6'>
                                Pesquisas Populares
                            </h2>
                            <GridMovie
                                moviesToUse={dados ? dados : seriesOrMovies}
                                handleNavigate={handleNavigate}
                            />
                        </main>
                    }

                </>
            )}
        </div>
    );
};

export default SearchMovie;
