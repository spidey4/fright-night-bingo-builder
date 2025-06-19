
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

// Enhanced platform assignment based on movie popularity and genre
const getSmartPlatforms = (movie: TMDBMovie): string[] => {
  const allPlatforms = ['Netflix', 'Amazon Prime', 'HBO Max', 'Hulu', 'Disney+', 'Apple TV+', 'Paramount+', 'Shudder'];
  
  // Horror movies are more likely to be on Shudder, HBO Max, Netflix
  if (movie.genre_ids.includes(27)) {
    const horrorPlatforms = ['Shudder', 'HBO Max', 'Netflix', 'Amazon Prime'];
    const numPlatforms = Math.floor(Math.random() * 3) + 2; // 2-4 platforms
    return horrorPlatforms.sort(() => 0.5 - Math.random()).slice(0, numPlatforms);
  }
  
  // High-rated movies more likely on premium platforms
  if (movie.vote_average > 7) {
    const premiumPlatforms = ['HBO Max', 'Apple TV+', 'Netflix', 'Amazon Prime'];
    const numPlatforms = Math.floor(Math.random() * 3) + 2;
    return premiumPlatforms.sort(() => 0.5 - Math.random()).slice(0, numPlatforms);
  }
  
  // Default random selection
  const numPlatforms = Math.floor(Math.random() * 4) + 2; // 2-5 platforms
  return allPlatforms.sort(() => 0.5 - Math.random()).slice(0, numPlatforms);
};

export const searchMoviesByThemes = async (themes: string[], apiKey?: string): Promise<MovieSuggestion[]> => {
  if (!apiKey) {
    console.log('No API key provided, using local data');
    return getLocalMovieSuggestions(themes);
  }

  try {
    // Convert themes to genre IDs
    const genreIds = Object.entries(genreToThemeMap)
      .filter(([_, themeList]) => themes.some(theme => themeList.includes(theme)))
      .map(([genreId]) => genreId);

    if (genreIds.length === 0) {
      console.log('No matching genre IDs found for themes:', themes);
      return getLocalMovieSuggestions(themes);
    }

    console.log('Searching TMDB with genre IDs:', genreIds);

    // Fetch multiple pages to get more movies
    const allMovies: TMDBMovie[] = [];
    const maxPages = 5; // Fetch up to 5 pages (100 movies)
    
    for (let page = 1; page <= maxPages; page++) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreIds.join(',')}&sort_by=popularity.desc&page=${page}&vote_count.gte=50`
        );
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid API key');
          }
          throw new Error(`TMDB API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Page ${page}: ${data.results.length} movies`);
        allMovies.push(...data.results);
        
        // If we got fewer than 20 results, no more pages
        if (data.results.length < 20) break;
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`Total movies fetched from TMDB: ${allMovies.length}`);

    if (allMovies.length === 0) {
      return getLocalMovieSuggestions(themes);
    }

    // Convert to our format with better platform assignment
    const suggestions = allMovies.map((movie: TMDBMovie): MovieSuggestion => ({
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
      overview: movie.overview || 'No description available.',
      rating: Math.round(movie.vote_average * 10) / 10,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
      platforms: getSmartPlatforms(movie),
      themes: movie.genre_ids.flatMap(id => genreToThemeMap[id] || [])
    }));

    console.log(`Converted ${suggestions.length} movie suggestions`);
    return suggestions;

  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return getLocalMovieSuggestions(themes);
  }
};

// Enhanced local movie database with more variety
const getLocalMovieSuggestions = (themes: string[]): MovieSuggestion[] => {
  const localMovies: MovieSuggestion[] = [
    { title: "Halloween", year: 1978, overview: "On Halloween night in 1963, six-year-old Michael Myers brutally murdered his 17-year-old sister. He was sentenced and locked away for 15 years. But on October 30, 1978, while being transferred for a court date, a 21-year-old Michael Myers steals a car and escapes Smith's Grove.", rating: 7.7, platforms: ["Shudder", "Amazon Prime", "Paramount+"], themes: ["slasher", "horror"] },
    { title: "The Conjuring", year: 2013, overview: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.", rating: 7.5, platforms: ["HBO Max", "Netflix", "Amazon Prime"], themes: ["supernatural", "horror"] },
    { title: "Scream", year: 1996, overview: "A year after the murder of her mother, Sidney Prescott is terrorized by a masked killer who targets her and her friends by using scary movies as part of a deadly game.", rating: 7.4, platforms: ["Netflix", "Amazon Prime", "Paramount+"], themes: ["slasher", "horror"] },
    { title: "Psycho", year: 1960, overview: "A Phoenix secretary embezzles $40,000 from her employer's client, goes on the run, and checks into a remote motel run by a young man under the domination of his mother.", rating: 8.5, platforms: ["Amazon Prime", "Hulu", "Apple TV+"], themes: ["psychological", "thriller"] },
    { title: "Dawn of the Dead", year: 2004, overview: "A nurse, a policeman, a young married couple, a salesman and other survivors of a worldwide plague that is producing aggressive, flesh-eating zombies, take refuge in a mega Midwestern shopping mall.", rating: 7.3, platforms: ["Netflix", "Amazon Prime", "HBO Max"], themes: ["zombie", "horror"] },
    { title: "The Ring", year: 2002, overview: "A journalist must investigate a mysterious videotape which seems to cause the death of anyone one week to the day after they view it.", rating: 7.1, platforms: ["Paramount+", "Amazon Prime", "Hulu"], themes: ["supernatural", "horror"] },
    { title: "Black Swan", year: 2010, overview: "A committed dancer struggles to maintain her sanity after winning the lead role in a production of Tchaikovsky's Swan Lake.", rating: 8.0, platforms: ["Netflix", "Hulu", "HBO Max"], themes: ["psychological", "drama"] },
    { title: "World War Z", year: 2013, overview: "Former United Nations employee Gerry Lane traverses the world in a race against time to stop a zombie pandemic that is toppling armies and governments and threatens to destroy humanity itself.", rating: 7.0, platforms: ["Paramount+", "Netflix", "Amazon Prime"], themes: ["zombie", "action"] },
    { title: "Insidious", year: 2010, overview: "A family looks to prevent evil spirits from trapping their comatose child in a realm called The Further.", rating: 6.8, platforms: ["Netflix", "Amazon Prime", "HBO Max"], themes: ["supernatural", "horror"] },
    { title: "The Blair Witch Project", year: 1999, overview: "Three film students vanish after traveling into a Maryland forest to film a documentary on the local Blair Witch legend, leaving only their footage behind.", rating: 6.5, platforms: ["Hulu", "Amazon Prime", "Shudder"], themes: ["paranormal", "horror"] },
    { title: "A Nightmare on Elm Street", year: 1984, overview: "The monstrous spirit of a slain child murderer seeks revenge by invading the dreams of teenagers whose parents were responsible for his untimely death.", rating: 7.4, platforms: ["HBO Max", "Hulu", "Amazon Prime"], themes: ["slasher", "supernatural", "horror"] },
    { title: "Friday the 13th", year: 1980, overview: "A group of camp counselors trying to reopen a summer camp called Crystal Lake, which has a grim past, are stalked by a mysterious killer.", rating: 6.4, platforms: ["Paramount+", "Amazon Prime", "Shudder"], themes: ["slasher", "horror"] },
    { title: "The Exorcist", year: 1973, overview: "When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.", rating: 8.1, platforms: ["HBO Max", "Amazon Prime", "Hulu"], themes: ["possession", "supernatural", "horror"] },
    { title: "Hereditary", year: 2018, overview: "A grieving family is haunted by tragedy and disturbing secrets.", rating: 7.3, platforms: ["Netflix", "Amazon Prime", "HBO Max"], themes: ["supernatural", "horror", "psychological"] },
    { title: "Get Out", year: 2017, overview: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.", rating: 7.7, platforms: ["Netflix", "Hulu", "Amazon Prime"], themes: ["psychological", "thriller", "horror"] },
    { title: "It Follows", year: 2014, overview: "A young woman is followed by an unknown supernatural force after getting involved in a sexual encounter.", rating: 6.8, platforms: ["Netflix", "Amazon Prime", "Shudder"], themes: ["supernatural", "horror"] },
    { title: "The Babadook", year: 2014, overview: "A single mother and her child fall into a deep well of paranoia when an eerie children's book titled 'Mister Babadook' manifests in their home.", rating: 6.8, platforms: ["Netflix", "Hulu", "Amazon Prime"], themes: ["supernatural", "psychological", "horror"] },
    { title: "Midsommar", year: 2019, overview: "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition at the hands of a pagan cult.", rating: 7.1, platforms: ["Amazon Prime", "Apple TV+", "HBO Max"], themes: ["horror", "psychological"] },
    { title: "The Witch", year: 2015, overview: "A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession.", rating: 6.9, platforms: ["Netflix", "Amazon Prime", "Hulu"], themes: ["supernatural", "horror"] },
    { title: "Sinister", year: 2012, overview: "A true-crime writer finds a cache of 8mm home movies films that suggest the murder case he is currently researching could be the work of an unknown serial killer whose legacy dates back to the 1960s.", rating: 6.8, platforms: ["Netflix", "Amazon Prime", "Shudder"], themes: ["supernatural", "horror"] }
  ];

  const matchingMovies = localMovies.filter(movie => 
    themes.some(theme => movie.themes.includes(theme))
  );

  console.log(`Local database: ${matchingMovies.length} movies match themes:`, themes);
  return matchingMovies;
};
