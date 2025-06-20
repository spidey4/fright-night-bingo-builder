
export interface Movie {
  title: string;
  year: number;
  platforms: string[];
  theme: string;
}

// Sample horror movie database - in a real app this would come from an API
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
  { title: "Shutter Island", year: 2010, platforms: ["Netflix", "Amazon Prime"], theme: "psychological" },
  { title: "Paranormal Activity", year: 2007, platforms: ["Paramount+", "Amazon Prime"], theme: "paranormal" },
  { title: "The Blair Witch Project", year: 1999, platforms: ["Hulu", "Amazon Prime"], theme: "paranormal" },
  { title: "The Exorcist", year: 1973, platforms: ["HBO Max", "Amazon Prime"], theme: "possession" },
  { title: "The Amityville Horror", year: 1979, platforms: ["Amazon Prime", "Tubi"], theme: "hauntedHouse" },
  { title: "Annabelle", year: 2014, platforms: ["HBO Max", "Netflix"], theme: "cursedDoll" }
];

export const suggestRandomMovie = (theme: string, availablePlatforms: string[]): Movie | null => {
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
