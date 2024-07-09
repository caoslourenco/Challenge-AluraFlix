import useFetch from "../hooks/useFetch";
import { useEffect } from "react";
import MovieSlider from "../components/Home/MovieSlider";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenres } from "../store/slices/genresSlice";
import PublicityPage from "../components/Home/PublicityPage";
import Slider from "../components/Slider";
import Button from "../components/Button";
import PublicityPage2 from "../components/Home/PublicityPage2";
import LoadingHome from "../components/Loading/HomeMovie/LoadingHome";
import { setHomeValue } from "../store/slices/homeMovieSlice";

const HomePage = () => {
    // Filmes mais populares
    const baseUrl = "https://api.themoviedb.org/3";
    const path = "/trending/tv/week"; // você pode modificar este caminho para mostrar outros filmes

    const dispatch = useDispatch();
    const genres = useSelector((state) => state.genresMovies); // pegar os gêneros do estado global

    const [popularMovies, getMovies, isError, loading] = useFetch(baseUrl);

    useEffect(() => {
        // obter os dados da API
        getMovies(path);
    }, []);

    useEffect(() => {
        // armazenar o filme e os gêneros no estado global
        if (!genres.length) {
            dispatch(fetchGenres("tv"));
        }
        dispatch(setHomeValue(popularMovies))
    }, [genres, popularMovies]);

    if (loading) {
        return (
            <LoadingHome/>
        );
    }

    return (
        <div>
            {isError && <p>Ocorreu um erro ao carregar os filmes</p>}
            {!loading && !isError && (
                <main>
                    {/* CABEÇALHO DA PÁGINA INICIAL */}
                    <MovieSlider
                        movies={popularMovies?.results}
                        genres={genres}
                    />

                    {/* ANÚNCIO */}
                    <section className='px-8 md:px-10 lg:px-12 2xl:px-16 mt-8 text-white sm:text-center md:flex md:text-left md:gap-8 md:items-center md:flex-row-reverse md:justify-center xl:gap-20'>
                        <div className='mb-4 lg:mb-0'>
                            <h4 className='font-semibold text-lg lg:text-xl xl:text-3xl xl:mb-2'>
                                Episódios Gratuitos
                            </h4>
                            <p className='opacity-80 text-xs md:mb-4 lg:text-base xl:text-lg lg:mb-8'>
                                Descubra a emoção nos lançamentos de filmes e séries icônicas!
                            </p>
                            <div className='hidden md:block'>
                                <Button text='VER AGORA' noNavigate={false} />
                            </div>
                        </div>
                        <PublicityPage url='/anuncio.avif' />
                    </section>

                    {/* Corpo do Slider do Filme 1 */}
                    <section className='px-8 md:px-10 lg:px-12 2xl:px-16 my-8'>
                        <div className='mb-7'>
                            <Slider
                                path='/movie/popular'
                                titulo='Mais Popular'
                                isMovie='/movie'
                            />
                        </div>
                        <div className='mb-7'>
                            <Slider
                                path='/movie/popular'
                                query={"page=2"}
                                titulo='Do cinema para sua casa'
                                subtitulo={
                                    "Culturas valiosas. Histórias diversas. Energia vibrante."
                                }
                                isMovie='/movie'
                            />
                        </div>
                    </section>

                    {/* Anúncio 2 */}
                    <div className='sm:hidden'>
                        <PublicityPage
                            url={
                                "https://art-gallery-latam.api.hbo.com/images/fzElsTTwA7Knig15UGwmN$$$LFEFOOTER$$$latam/background?v=f30a3f85c906dc49eb62955118d74cdb&format=png&size=400x400&compression=low&protection=false&scaleDownToFit=false&language=es-419"
                            }
                            btn='Categoria'
                            tittle='Descubra o cinema em casa conosco!'
                        />
                    </div>
                    <div className='hidden sm:block'>
                        <PublicityPage2
                            url={
                                "https://i.blogs.es/8cb1c2/mejores-peliculas-accion-2021/1366_2000.jpeg"
                            }
                            btn='Categoria'
                            tittle='Descubra o cinema em casa conosco!'
                        />
                    </div>

                    {/* Corpo do Slider do Filme 2 */}
                    <section className='px-8 md:px-10 lg:px-12 2xl:px-16 mt-8'>
                        <div className='mb-7'>
                            <Slider
                                path='/tv/top_rated'
                                titulo='Noite de filmes todos os dias'
                                isMovie='/tv'
                            />
                        </div>
                        <div className='pb-7'>
                            <Slider
                                path='/movie/top_rated'
                                titulo='Coleções icônicas'
                                subtitulo={
                                    "Histórias inesquecíveis que roubaram nossos corações."
                                }
                                isMovie='/movie'
                            />
                        </div>
                    </section>
                </main>
            )}
        </div>
    );
};

export default HomePage;
