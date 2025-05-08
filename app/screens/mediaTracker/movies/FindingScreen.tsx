import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import MovieSection from '../../components/MovieSection';
import { fetchTrendingMovies, fetchMoviesByGenre } from '../../../api/tmdb';
import { GradientBackground } from '../../components/GradientBackground';
import { Searchbar } from 'react-native-paper';


const genreList = [
  { id: 27, title: 'Horror' },
  { id: 35, title: 'Comedy' },
  { id: 16, title: 'Animation' },
  { id: 28, title: 'Action' },
  { id: 53, title: 'Thriller' },
  { id: 18, title: 'Drama' },
  { id: 878, title: 'Sci-Fi' },
  { id: 10749, title: 'Romance' },
  { id: 80, title: 'Crime' },
  { id: 14, title: 'Fantasy' },
  { id: 10751, title: 'Family' },
];

const FindingScreen = () => {
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState<{ title: string; data: any[] }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const trendingData = await fetchTrendingMovies();
      setTrending(trendingData.results);

      const genreResults = await Promise.all(
        genreList.map(async ({ id, title }) => {
          const data = await fetchMoviesByGenre(id);
          return { title, data: data.results };
        })
      );

      setGenres(genreResults);
    })();
  }, []);

  return (
    
    <GradientBackground>
      <ScrollView>
      <Searchbar
        placeholder="Search movies..."
        value={searchQuery}
        onChangeText={setSearchQuery}

        style={{ 
          margin: 10, 
          borderRadius: 8,

        }}
        inputStyle={{ 
          color: '#fff',
          fontSize: 24,
         }}
        iconColor="#fff"
        placeholderTextColor="#f3e9d2"
        
      />
        <MovieSection title="Trending" data={trending} />
        {genres.map((genre) => (
          <MovieSection key={genre.title} title={genre.title} data={genre.data} />
        ))}
      </ScrollView>
    </GradientBackground>

  );
};

export default FindingScreen;
