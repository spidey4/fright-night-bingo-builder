
export interface BingoIdea {
  ro: string;
  en: string;
}

export interface BingoTheme {
  name: {
    ro: string;
    en: string;
  };
  ideas: BingoIdea[];
}

export const bingoThemes: Record<string, BingoTheme> = {
  slasher: {
    name: { ro: "Slasher", en: "Slasher" },
    ideas: [
      { ro: "Cineva moare în primele 10 minute", en: "Someone dies in the first 10 minutes" },
      { ro: "Personajul principal este virgin", en: "Main character is a virgin" },
      { ro: "Telefonul nu are semnal", en: "Phone has no signal" },
      { ro: "Mașina nu pornește", en: "Car won't start" },
      { ro: "Se duce singur să investigheze", en: "Goes alone to investigate" },
      { ro: "Ucigașul pare mort dar nu e", en: "Killer appears dead but isn't" },
      { ro: "Cineva se uită în oglindă și apare ucigașul", en: "Someone looks in mirror and killer appears" },
      { ro: "Pisica sare din întuneric", en: "Cat jumps out of darkness" },
      { ro: "Lumina se stinge", en: "Lights go out" },
      { ro: "Cineva se ascunde în dulap", en: "Someone hides in closet" },
      { ro: "Ucigașul poartă mască", en: "Killer wears a mask" },
      { ro: "Violinist dramatic în fundal", en: "Dramatic violin in background" },
      { ro: "Cineva urlă 'Cine e acolo?'", en: "Someone yells 'Who's there?'" },
      { ro: "Sângele împroașcă camera", en: "Blood splatters the camera" },
      { ro: "Prietena cea mai bună moare", en: "Best friend dies" },
      { ro: "Ucigașul vine din spate", en: "Killer comes from behind" },
      { ro: "Cineva se împiedică când fuge", en: "Someone trips while running" },
      { ro: "Arma nu are gloanțe", en: "Gun is out of bullets" },
      { ro: "Ușa e închisă", en: "Door is locked" },
      { ro: "Final twist - ucigașul era altcineva", en: "Final twist - killer was someone else" },
      { ro: "Victima se târăște rănită", en: "Victim crawls while injured" },
      { ro: "Cineva moare în timp ce face sex", en: "Someone dies while having sex" },
      { ro: "Ucigașul nu vorbește", en: "Killer doesn't speak" },
      { ro: "Se folosește un cuțit de bucătărie", en: "Kitchen knife is used" },
      { ro: "Cineva se ascunde sub pat", en: "Someone hides under bed" }
    ]
  },
  supernatural: {
    name: { ro: "Supernatural", en: "Supernatural" },
    ideas: [
      { ro: "Casa e bântuită", en: "House is haunted" },
      { ro: "Obiecte se mișcă singure", en: "Objects move by themselves" },
      { ro: "Temperatura scade brusc", en: "Temperature drops suddenly" },
      { ro: "Cineva posedează pe altcineva", en: "Someone possesses someone else" },
      { ro: "Oglinda se sparge singură", en: "Mirror breaks by itself" },
      { ro: "Copil vorbește cu prieteni imaginari", en: "Child talks to imaginary friends" },
      { ro: "Se aude plâns de copil", en: "Child crying is heard" },
      { ro: "Ușile se închid singure", en: "Doors close by themselves" },
      { ro: "Cineva vede o umbră", en: "Someone sees a shadow" },
      { ro: "Spiritul comunică prin scris", en: "Spirit communicates through writing" },
      { ro: "Animalele simt prezența", en: "Animals sense the presence" },
      { ro: "Lumânările se sting singure", en: "Candles blow out by themselves" },
      { ro: "Se folosește o placă Ouija", en: "Ouija board is used" },
      { ro: "Cineva levitează", en: "Someone levitates" },
      { ro: "Sânge curge din pereți", en: "Blood flows from walls" },
      { ro: "Vocea spiritului e înregistrată", en: "Spirit's voice is recorded" },
      { ro: "Televizorul se aprinde singur", en: "TV turns on by itself" },
      { ro: "Cineva e tras din pat", en: "Someone is pulled from bed" },
      { ro: "Fotografiile se schimbă", en: "Photographs change" },
      { ro: "Spiritul era odat viu în casă", en: "Spirit once lived in the house" },
      { ro: "Exorcist e chemat", en: "Exorcist is called" },
      { ro: "Crucifix se întoarce cu susul în jos", en: "Crucifix turns upside down" },
      { ro: "Cineva vorbește în limbi străine", en: "Someone speaks in foreign tongues" },
      { ro: "Familia are un secret întunecat", en: "Family has a dark secret" },
      { ro: "Copilul desenează lucruri îngrozitoare", en: "Child draws horrifying things" }
    ]
  },
  zombie: {
    name: { ro: "Zombie", en: "Zombie" },
    ideas: [
      { ro: "Cineva e mușcat", en: "Someone gets bitten" },
      { ro: "Munție se termină", en: "Ammunition runs out" },
      { ro: "Cineva se transformă", en: "Someone transforms" },
      { ro: "Grup se barricadează", en: "Group barricades themselves" },
      { ro: "Cineva e infectat dar ascunde", en: "Someone is infected but hides it" },
      { ro: "Lovitură la cap omoară zombi", en: "Head shot kills zombie" },
      { ro: "Hoardă de zombi", en: "Zombie horde" },
      { ro: "Cineva e sacrificat pentru grup", en: "Someone is sacrificed for the group" },
      { ro: "Medicamentele se termină", en: "Medicine runs out" },
      { ro: "Cineva încearcă să găsească un leac", en: "Someone tries to find a cure" },
      { ro: "Zombi lent dar persistent", en: "Slow but persistent zombie" },
      { ro: "Refugiu temporar e compromis", en: "Temporary shelter is compromised" },
      { ro: "Cineva e separat de grup", en: "Someone gets separated from group" },
      { ro: "Radio transmite mesaj de ajutor", en: "Radio broadcasts help message" },
      { ro: "Copil zombie", en: "Child zombie" },
      { ro: "Persoană dragă e infectată", en: "Loved one gets infected" },
      { ro: "Cineva refuză să ucidă pe cineva drag", en: "Someone refuses to kill loved one" },
      { ro: "Mâncare se termină", en: "Food runs out" },
      { ro: "Cineva devine nebun", en: "Someone goes insane" },
      { ro: "Zombi în apă", en: "Underwater zombie" },
      { ro: "Supraviețuitor singuratic", en: "Lone survivor" },
      { ro: "Militarii sunt și ei infectați", en: "Military is also infected" },
      { ro: "Origine virus e explicată", en: "Virus origin is explained" },
      { ro: "False speranță de salvare", en: "False hope of rescue" },
      { ro: "Cineva se jertfește pentru alții", en: "Someone sacrifices themselves for others" }
    ]
  },
  psychological: {
    name: { ro: "Psihologic", en: "Psychological" },
    ideas: [
      { ro: "Protagonist nu e de încredere", en: "Unreliable narrator" },
      { ro: "Cineva vede lucruri care nu sunt reale", en: "Someone sees things that aren't real" },
      { ro: "Medicamentele psihiatrice", en: "Psychiatric medication" },
      { ro: "Spital de psihiatrie", en: "Psychiatric hospital" },
      { ro: "Personalitate multiplă", en: "Multiple personality" },
      { ro: "Cineva își pierde memoria", en: "Someone loses memory" },
      { ro: "Twist final schimbă totul", en: "Final twist changes everything" },
      { ro: "Cineva e manipulat psihologic", en: "Someone is psychologically manipulated" },
      { ro: "Paranoia extremă", en: "Extreme paranoia" },
      { ro: "Realitatea e pusă la îndoială", en: "Reality is questioned" },
      { ro: "Halucinații", en: "Hallucinations" },
      { ro: "Experimente psihologice", en: "Psychological experiments" },
      { ro: "Izolare socială", en: "Social isolation" },
      { ro: "Obsesie nesănătoasă", en: "Unhealthy obsession" },
      { ro: "Cineva e găslighted", en: "Someone is gaslighted" },
      { ro: "Trauma din copilărie", en: "Childhood trauma" },
      { ro: "Terapeut malefic", en: "Evil therapist" },
      { ro: "Cineva încearcă să scape din realitate", en: "Someone tries to escape reality" },
      { ro: "Vise și realitate se amestecă", en: "Dreams and reality blend" },
      { ro: "Protagonist e răufăcătorul", en: "Protagonist is the villain" },
      { ro: "Sinucidere sau tentativă", en: "Suicide or attempt" },
      { ro: "Cineva e urmărit/stalked", en: "Someone is being stalked" },
      { ro: "Familie disfuncțională", en: "Dysfunctional family" },
      { ro: "Secrete întunecate din trecut", en: "Dark secrets from the past" },
      { ro: "Cineva pierde contactul cu realitatea", en: "Someone loses touch with reality" }
    ]
  }
};
