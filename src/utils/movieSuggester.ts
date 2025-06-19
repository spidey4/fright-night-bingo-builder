
export interface Movie {
  title: string;
  year: number;
  platforms: string[];
  themes: string[];
}

// Sample horror movie database - enhanced with multiple themes
const horrorMovies: Movie[] = [
  { title: "Halloween", year: 1978, platforms: ["Shudder", "Amazon Prime"], themes: ["slasher", "horror"] },
  { title: "Friday the 13th", year: 1980, platforms: ["Paramount+", "Amazon Prime"], themes: ["slasher", "horror"] },
  { title: "A Nightmare on Elm Street", year: 1984, platforms: ["HBO Max", "Hulu"], themes: ["slasher", "supernatural", "horror"] },
  { title: "Scream", year: 1996, platforms: ["Netflix", "Amazon Prime"], themes: ["slasher", "horror"] },
  { title: "The Conjuring", year: 2013, platforms: ["HBO Max", "Netflix"], themes: ["supernatural", "horror"] },
  { title: "Insidious", year: 2010, platforms: ["Netflix", "Amazon Prime"], themes: ["supernatural", "horror"] },
  { title: "The Ring", year: 2002, platforms: ["Paramount+", "Amazon Prime"], themes: ["supernatural", "horror"] },
  { title: "Dawn of the Dead", year: 2004, platforms: ["Netflix", "Amazon Prime"], themes: ["zombie", "horror"] },
  { title: "28 Days Later", year: 2002, platforms: ["Hulu", "Amazon Prime"], themes: ["zombie", "horror"] },
  { title: "World War Z", year: 2013, platforms: ["Paramount+", "Netflix"], themes: ["zombie", "action", "horror"] },
  { title: "Psycho", year: 1960, platforms: ["Amazon Prime", "Hulu"], themes: ["psychological", "thriller"] },
  { title: "Black Swan", year: 2010, platforms: ["Netflix", "Hulu"], themes: ["psychological", "drama"] },
  { title: "Shutter Island", year: 2010, platforms: ["Netflix", "Amazon Prime"], themes: ["psychological", "thriller"] },
  { title: "Paranormal Activity", year: 2007, platforms: ["Paramount+", "Amazon Prime"], themes: ["paranormal", "horror"] },
  { title: "The Blair Witch Project", year: 1999, platforms: ["Hulu", "Amazon Prime"], themes: ["paranormal", "horror"] },
  { title: "The Exorcist", year: 1973, platforms: ["HBO Max", "Amazon Prime"], themes: ["possession", "supernatural", "horror"] },
  { title: "The Amityville Horror", year: 1979, platforms: ["Amazon Prime", "Tubi"], themes: ["hauntedHouse", "supernatural", "horror"] },
  { title: "Annabelle", year: 2014, platforms: ["HBO Max", "Netflix"], themes: ["cursedDoll", "supernatural", "horror"] }
];

export const suggestRandomMovie = (themes: string[], availablePlatforms: string[]): Movie | null => {
  const matchingMovies = horrorMovies.filter(movie => 
    themes.some(theme => movie.themes.includes(theme)) &&
    movie.platforms.some(platform => availablePlatforms.includes(platform))
  );

  if (matchingMovies.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * matchingMovies.length);
  return matchingMovies[randomIndex];
};

export const suggestMultipleMovies = (themes: string[], availablePlatforms: string[], count: number = 5): Movie[] => {
  const matchingMovies = horrorMovies.filter(movie => 
    themes.some(theme => movie.themes.includes(theme)) &&
    movie.platforms.some(platform => availablePlatforms.includes(platform))
  );

  // Shuffle and return up to `count` movies
  const shuffled = matchingMovies.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
