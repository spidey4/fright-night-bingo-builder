
export interface Movie {
  title: string;
  year: number;
  platforms: string[];
  theme: string;
  description?: string;
  poster?: string;
  tmdbId?: number;
}

// TMDB API configuration
const TMDB_API_KEY = 'your_tmdb_api_key_here'; // User needs to replace this
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Platform mapping to TMDB provider IDs
const PLATFORM_PROVIDERS: { [key: string]: number } = {
  'Netflix': 8,
  'Amazon Prime': 119,
  'HBO Max': 384,
  'Hulu': 15,
  'Disney+': 337,
  'Apple TV+': 350,
  'Paramount+': 531,
  'Shudder': 99,
  'Tubi': 73
};

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
}

interface TMDBResponse {
  results: TMDBMovie[];
}

export const suggestRandomMovie = async (theme: string, availablePlatforms: string[]): Promise<Movie | null> => {
  try {
    // Get provider IDs for selected platforms
    const providerIds = availablePlatforms
      .map(platform => PLATFORM_PROVIDERS[platform])
      .filter(id => id !== undefined);

    if (providerIds.length === 0) {
      console.log('No valid providers selected');
      return null;
    }

    // Build TMDB API URL for horror movies
    const providersQuery = providerIds.join('|');
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&with_watch_providers=${providersQuery}&watch_region=US&sort_by=popularity.desc&page=1`;

    console.log('Fetching from TMDB:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('TMDB API error:', response.status, response.statusText);
      return null;
    }

    const data: TMDBResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('No movies found for selected platforms');
      return null;
    }

    // Pick a random movie from results
    const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 20)); // Limit to first 20 results
    const tmdbMovie = data.results[randomIndex];

    // Convert to our Movie interface
    const movie: Movie = {
      title: tmdbMovie.title,
      year: new Date(tmdbMovie.release_date).getFullYear(),
      platforms: availablePlatforms,
      theme: theme,
      description: tmdbMovie.overview,
      poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}` : undefined,
      tmdbId: tmdbMovie.id
    };

    return movie;
  } catch (error) {
    console.error('Error fetching movie from TMDB:', error);
    return null;
  }
};

// Fallback function for when API is not available
export const suggestRandomMovieFallback = (theme: string, availablePlatforms: string[]): Movie | null => {
  const horrorMovies: Movie[] = [
    { title: "Halloween", year: 1978, platforms: ["Shudder", "Amazon Prime"], theme: "slasher" },
    { title: "Friday the 13th", year: 1980, platforms: ["Paramount+", "Amazon Prime"], theme: "slasher" },
    { title: "A Nightmare on Elm Street", year: 1984, platforms: ["HBO Max", "Hulu"], theme: "slasher" },
    { title: "Scream", year: 1996, platforms: ["Netflix", "Amazon Prime"], theme: "slasher" },
    { title: "The Conjuring", year: 2013, platforms: ["HBO Max", "Netflix"], theme: "supernatural" },
    { title: "Insidious", year: 2010, platforms: ["Netflix", "Amazon Prime"], theme: "supernatural" },
    { title: "The Ring", year: 2002, platforms: ["Paramount+", "Amazon Prime"], theme: "supernatural" },
    { title: "Dawn of the Dead", year: 2004, platforms: ["Netflix", "Amazon Prime"], theme: "zombie" },
    { title: "28 Days Later", year: 2002, platforms: ["Hulu", "Amazon Prime"], theme: "zombie" },
    { title: "World War Z", year: 2013, platforms: ["Paramount+", "Netflix"], theme: "zombie" },
    { title: "Psycho", year: 1960, platforms: ["Amazon Prime", "Hulu"], theme: "psychological" },
    { title: "Black Swan", year: 2010, platforms: ["Netflix", "Hulu"], theme: "psychological" },
    { title: "Shutter Island", year: 2010, platforms: ["Netflix", "Amazon Prime"], theme: "psychological" }
  ];

  const matchingMovies = horrorMovies.filter(movie => 
    movie.theme === theme && 
    movie.platforms.some(platform => availablePlatforms.includes(platform))
  );

  if (matchingMovies.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * matchingMovies.length);
  return matchingMovies[randomIndex];
};
