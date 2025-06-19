
export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieSuggestion {
  title: string;
  year: number;
  overview: string;
  rating: number;
  poster?: string;
  platforms: string[];
  themes: string[];
}

// TMDB Genre mapping to our themes
const genreToThemeMap: { [key: number]: string[] } = {
  27: ['horror', 'supernatural'], // Horror
  53: ['psychological', 'thriller'], // Thriller  
  9648: ['psychological'], // Mystery
  80: ['crime'], // Crime
  35: ['comedy'], // Comedy
  18: ['drama'], // Drama
  28: ['action'], // Action
  12: ['adventure'], // Adventure
  16: ['animation'], // Animation
  99: ['documentary'], // Documentary
  10751: ['family'], // Family
  14: ['fantasy', 'supernatural'], // Fantasy
  36: ['historical'], // History
  10402: ['musical'], // Music
  10749: ['romance'], // Romance
  878: ['scifi'], // Science Fiction
  10770: ['tv'], // TV Movie
  10752: ['war'], // War
  37: ['western'] // Western
};

// Simulated streaming platforms (in reality you'd need additional APIs)
const getRandomPlatforms = (): string[] => {
  const allPlatforms = ['Netflix', 'Amazon Prime', 'HBO Max', 'Hulu', 'Disney+', 'Apple TV+', 'Paramount+', 'Shudder'];
  const numPlatforms = Math.floor(Math.random() * 3) + 1;
  const shuffled = allPlatforms.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPlatforms);
};

export const searchMoviesByThemes = async (themes: string[], apiKey?: string): Promise<MovieSuggestion[]> => {
  if (!apiKey) {
    // Fallback to local data if no API key
    return getLocalMovieSuggestions(themes);
  }

  try {
    // Convert themes to genre IDs
    const genreIds = Object.entries(genreToThemeMap)
      .filter(([_, themeList]) => themes.some(theme => themeList.includes(theme)))
      .map(([genreId]) => genreId);

    if (genreIds.length === 0) {
      return getLocalMovieSuggestions(themes);
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreIds.join(',')}&sort_by=popularity.desc&page=${Math.floor(Math.random() * 5) + 1}`
    );
    
    if (!response.ok) {
      throw new Error('TMDB API request failed');
    }

    const data = await response.json();
    
    return data.results.slice(0, 10).map((movie: TMDBMovie): MovieSuggestion => ({
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
      overview: movie.overview,
      rating: Math.round(movie.vote_average * 10) / 10,
      poster: movie.poster_path ? `https://image.tmdb.org/t/api/w500${movie.poster_path}` : undefined,
      platforms: getRandomPlatforms(),
      themes: movie.genre_ids.flatMap(id => genreToThemeMap[id] || [])
    }));
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return getLocalMovieSuggestions(themes);
  }
};

const getLocalMovieSuggestions = (themes: string[]): MovieSuggestion[] => {
  const localMovies: MovieSuggestion[] = [
    { title: "Halloween", year: 1978, overview: "A classic slasher film", rating: 7.7, platforms: ["Shudder", "Amazon Prime"], themes: ["slasher", "horror"] },
    { title: "The Conjuring", year: 2013, overview: "Supernatural horror", rating: 7.5, platforms: ["HBO Max", "Netflix"], themes: ["supernatural", "horror"] },
    { title: "Scream", year: 1996, overview: "Meta slasher horror", rating: 7.4, platforms: ["Netflix", "Amazon Prime"], themes: ["slasher", "horror"] },
    { title: "Psycho", year: 1960, overview: "Psychological thriller masterpiece", rating: 8.5, platforms: ["Amazon Prime", "Hulu"], themes: ["psychological", "thriller"] },
    { title: "Dawn of the Dead", year: 2004, overview: "Zombie survival horror", rating: 7.3, platforms: ["Netflix", "Amazon Prime"], themes: ["zombie", "horror"] },
    { title: "The Ring", year: 2002, overview: "Supernatural horror mystery", rating: 7.1, platforms: ["Paramount+", "Amazon Prime"], themes: ["supernatural", "horror"] },
    { title: "Black Swan", year: 2010, overview: "Psychological horror drama", rating: 8.0, platforms: ["Netflix", "Hulu"], themes: ["psychological", "drama"] },
    { title: "World War Z", year: 2013, overview: "Zombie apocalypse action", rating: 7.0, platforms: ["Paramount+", "Netflix"], themes: ["zombie", "action"] },
    { title: "Insidious", year: 2010, overview: "Supernatural horror", rating: 6.8, platforms: ["Netflix", "Amazon Prime"], themes: ["supernatural", "horror"] },
    { title: "The Blair Witch Project", year: 1999, overview: "Found footage horror", rating: 6.5, platforms: ["Hulu", "Amazon Prime"], themes: ["paranormal", "horror"] }
  ];

  return localMovies.filter(movie => 
    themes.some(theme => movie.themes.includes(theme))
  );
};
