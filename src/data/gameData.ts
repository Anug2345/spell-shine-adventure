export interface WordItem {
  word: string;
  emoji: string;
  hint: string;
}

export interface Level {
  id: number;
  name: string;
  theme: string;
  emoji: string;
  description: string;
  bgGradient: string;
  bgColor: string;
  words: WordItem[];
  minLetters: number;
  pointsPerWord: number;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Enchanted Forest",
    theme: "forest",
    emoji: "🌲",
    description: "3-letter words",
    bgGradient: "from-green-400 to-emerald-600",
    bgColor: "hsl(142 60% 45%)",
    minLetters: 3,
    pointsPerWord: 5,
    words: [
      { word: "cat", emoji: "🐱", hint: "A furry pet that meows" },
      { word: "sun", emoji: "☀️", hint: "It shines in the sky" },
      { word: "pen", emoji: "🖊️", hint: "You write with this" },
      { word: "hat", emoji: "🎩", hint: "You wear this on your head" },
      { word: "dog", emoji: "🐶", hint: "A furry pet that barks" },
      { word: "cup", emoji: "☕", hint: "You drink from this" },
      { word: "bat", emoji: "🦇", hint: "A flying animal" },
      { word: "ant", emoji: "🐜", hint: "A tiny insect" },
      { word: "map", emoji: "🗺️", hint: "Shows you where to go" },
      { word: "fox", emoji: "🦊", hint: "A clever orange animal" },
    ],
  },
  {
    id: 2,
    name: "Rushing River",
    theme: "river",
    emoji: "🌊",
    description: "4-letter words",
    bgGradient: "from-blue-400 to-cyan-500",
    bgColor: "hsl(210 80% 50%)",
    minLetters: 4,
    pointsPerWord: 5,
    words: [
      { word: "fish", emoji: "🐟", hint: "Lives in water and swims" },
      { word: "tree", emoji: "🌳", hint: "It has leaves and branches" },
      { word: "book", emoji: "📚", hint: "You read this" },
      { word: "rain", emoji: "🌧️", hint: "Water falling from the sky" },
      { word: "frog", emoji: "🐸", hint: "It jumps and croaks" },
      { word: "duck", emoji: "🦆", hint: "A bird that swims" },
      { word: "star", emoji: "⭐", hint: "Shines in the night sky" },
      { word: "cake", emoji: "🎂", hint: "Sweet food for birthdays" },
      { word: "kite", emoji: "🪁", hint: "You fly this in the wind" },
      { word: "bird", emoji: "🐦", hint: "It has wings and can fly" },
    ],
  },
  {
    id: 3,
    name: "Magic Castle",
    theme: "castle",
    emoji: "🏰",
    description: "5-letter words",
    bgGradient: "from-purple-500 to-violet-700",
    bgColor: "hsl(270 50% 45%)",
    minLetters: 5,
    pointsPerWord: 5,
    words: [
      { word: "apple", emoji: "🍎", hint: "A red or green fruit" },
      { word: "chair", emoji: "🪑", hint: "You sit on this" },
      { word: "house", emoji: "🏠", hint: "People live here" },
      { word: "grape", emoji: "🍇", hint: "Small purple fruit" },
      { word: "plane", emoji: "✈️", hint: "It flies in the sky" },
      { word: "shark", emoji: "🦈", hint: "A big fish in the ocean" },
      { word: "clock", emoji: "🕐", hint: "It tells you the time" },
      { word: "bread", emoji: "🍞", hint: "You make sandwiches with this" },
      { word: "tiger", emoji: "🐯", hint: "A striped wild cat" },
      { word: "horse", emoji: "🐴", hint: "You can ride this animal" },
    ],
  },
  {
    id: 4,
    name: "Outer Space",
    theme: "space",
    emoji: "🚀",
    description: "5-6 letter words",
    bgGradient: "from-indigo-900 to-purple-900",
    bgColor: "hsl(240 50% 15%)",
    minLetters: 5,
    pointsPerWord: 5,
    words: [
      { word: "earth", emoji: "🌍", hint: "Our home planet" },
      { word: "comet", emoji: "☄️", hint: "A ball of ice in space" },
      { word: "robot", emoji: "🤖", hint: "A machine that can move" },
      { word: "orbit", emoji: "🌐", hint: "Going around a planet" },
      { word: "alien", emoji: "👾", hint: "A creature from space" },
      { word: "lunar", emoji: "🌙", hint: "Related to the moon" },
      { word: "laser", emoji: "🔦", hint: "A beam of light" },
      { word: "venus", emoji: "🌟", hint: "A planet in our solar system" },
      { word: "stars", emoji: "✨", hint: "They twinkle at night" },
      { word: "solar", emoji: "☀️", hint: "Related to the sun" },
    ],
  },
];

export const AVATARS = [
  { id: "dragon", emoji: "🐉", name: "Dragon" },
  { id: "cat", emoji: "🐱", name: "Kitty" },
  { id: "robot", emoji: "🤖", name: "Robo" },
  { id: "fox", emoji: "🦊", name: "Foxy" },
  { id: "owl", emoji: "🦉", name: "Owly" },
];

export const BADGES = [
  { id: "word_explorer", name: "Word Explorer", emoji: "🗺️", description: "Complete your first level", threshold: 1 },
  { id: "spelling_star", name: "Spelling Star", emoji: "⭐", description: "Get 10 correct words", threshold: 10 },
  { id: "sentence_master", name: "Sentence Master", emoji: "👑", description: "Score 100+ points", threshold: 100 },
  { id: "speed_reader", name: "Speed Reader", emoji: "⚡", description: "Complete 3 words in a row", threshold: 3 },
  { id: "champion", name: "Champion", emoji: "🏆", description: "Complete all levels", threshold: 4 },
];
