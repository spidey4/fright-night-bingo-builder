
// Horror Bingo Ideas Database
export interface BingoIdea {
  ro: string;
  en: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rarity: number; // 1-100, higher = rarer
}

export const bingoIdeas: BingoIdea[] = [
  { ro: "Personajul principal intră singur într-o casă bântuită", en: "Main character enters haunted house alone", difficulty: "easy", rarity: 10 },
  { ro: "Cineva spune 'Să ne despărțim!'", en: "Someone says 'Let's split up!'", difficulty: "easy", rarity: 15 },
  { ro: "Telefoanele nu au semnal", en: "Cell phones have no signal", difficulty: "easy", rarity: 20 },
  { ro: "Mașina nu pornește", en: "Car won't start", difficulty: "easy", rarity: 25 },
  { ro: "Investigarea unui zgomot ciudat", en: "Investigating a strange noise", difficulty: "easy", rarity: 30 },
  { ro: "Pisica sare din întuneric", en: "Cat jumps out of darkness", difficulty: "easy", rarity: 35 },
  { ro: "Ușa se închide singură", en: "Door slams shut by itself", difficulty: "easy", rarity: 40 },
  { ro: "Lumina se stinge brusc", en: "Lights go out suddenly", difficulty: "easy", rarity: 45 },
  { ro: "Oglinda spartă", en: "Broken mirror", difficulty: "medium", rarity: 50 },
  { ro: "Cineva cade în timpul unei fugărit", en: "Someone trips while running", difficulty: "medium", rarity: 55 },
  { ro: "Killer-ul pare mort dar se întoarce", en: "Killer appears dead but returns", difficulty: "medium", rarity: 60 },
  { ro: "Descoperirea unei cămări secrete", en: "Discovery of secret room", difficulty: "medium", rarity: 65 },
  { ro: "Cineva spune 'Cine e acolo?'", en: "Someone says 'Who's there?'", difficulty: "easy", rarity: 70 },
  { ro: "Final girl trope", en: "Final girl trope", difficulty: "hard", rarity: 75 },
  { ro: "Twist ending cu personajul principal", en: "Twist ending with main character", difficulty: "hard", rarity: 80 },
  { ro: "Referință la alt film horror", en: "Reference to another horror movie", difficulty: "hard", rarity: 85 },
  { ro: "Cineva citește din Necronomicon", en: "Someone reads from Necronomicon", difficulty: "hard", rarity: 90 },
  { ro: "Scena post-credite", en: "Post-credits scene", difficulty: "medium", rarity: 95 },
  { ro: "Personaj care nu crede în supernatural", en: "Character who doesn't believe in supernatural", difficulty: "easy", rarity: 12 },
  { ro: "Baia înfricoșătoare", en: "Creepy bathroom scene", difficulty: "easy", rarity: 18 },
  { ro: "Cineva se uită în dulapul din dormitor", en: "Someone checks bedroom closet", difficulty: "easy", rarity: 22 },
  { ro: "Vecini ciudați", en: "Strange neighbors", difficulty: "medium", rarity: 28 },
  { ro: "Fotografii vechi misterioase", en: "Mysterious old photographs", difficulty: "medium", rarity: 32 },
  { ro: "Copil creepy care cântă", en: "Creepy child singing", difficulty: "hard", rarity: 88 },
  { ro: "Demonul din subsol", en: "Demon in the basement", difficulty: "hard", rarity: 92 }
];
