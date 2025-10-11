export interface Song {
  id: string;
  title: string;
  artist: string;
  displayName: string;
  audioUrl: string;
  genre: string;        // Género musical
  decade: string;       // Década (ej: "1970s", "1980s")
  country: string;      // País de origen
  language: string;     // Idioma de la canción
  voices: string;       // "Masculino", "Femenino", "Mixto"
}

// Base de datos ampliada de canciones
const songsData: Omit<Song, 'id' | 'audioUrl' | 'displayName'>[] = [
  // Rock Clásico
  { title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", decade: "1970s", country: "Reino Unido", language: "Inglés", voices: "Masculino" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", genre: "Rock", decade: "1970s", country: "Reino Unido", language: "Inglés", voices: "Masculino" },
  { title: "Hotel California", artist: "Eagles", genre: "Rock", decade: "1970s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", genre: "Rock", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  { title: "November Rain", artist: "Guns N' Roses", genre: "Rock", decade: "1990s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  { title: "Wonderwall", artist: "Oasis", genre: "Rock", decade: "1990s", country: "Reino Unido", language: "Inglés", voices: "Masculino" },
  { title: "Don't Stop Believin'", artist: "Journey", genre: "Rock", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  { title: "We Will Rock You", artist: "Queen", genre: "Rock", decade: "1970s", country: "Reino Unido", language: "Inglés", voices: "Masculino" },
  { title: "Another Brick in the Wall", artist: "Pink Floyd", genre: "Rock", decade: "1970s", country: "Reino Unido", language: "Inglés", voices: "Masculino" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Grunge", decade: "1990s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  
  // Pop Internacional
  { title: "Billie Jean", artist: "Michael Jackson", genre: "Pop", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  { title: "Thriller", artist: "Michael Jackson", genre: "Pop", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  { title: "Beat It", artist: "Michael Jackson", genre: "Pop", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  { title: "Like a Prayer", artist: "Madonna", genre: "Pop", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Femenino" },
  { title: "Material Girl", artist: "Madonna", genre: "Pop", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Femenino" },
  { title: "Vogue", artist: "Madonna", genre: "Pop", decade: "1990s", country: "Estados Unidos", language: "Inglés", voices: "Femenino" },
  { title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", decade: "2010s", country: "Reino Unido", language: "Inglés", voices: "Masculino" },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", genre: "Pop", decade: "2010s", country: "Reino Unido", language: "Inglés", voices: "Masculino" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Pop", decade: "2010s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
  { title: "Rolling in the Deep", artist: "Adele", genre: "Soul", decade: "2010s", country: "Reino Unido", language: "Inglés", voices: "Femenino" },
  { title: "Someone Like You", artist: "Adele", genre: "Pop", decade: "2010s", country: "Reino Unido", language: "Inglés", voices: "Femenino" },
  { title: "Hello", artist: "Adele", genre: "Pop", decade: "2010s", country: "Reino Unido", language: "Inglés", voices: "Femenino" },
  { title: "Halo", artist: "Beyoncé", genre: "Pop", decade: "2000s", country: "Estados Unidos", language: "Inglés", voices: "Femenino" },
  { title: "Single Ladies", artist: "Beyoncé", genre: "Pop", decade: "2000s", country: "Estados Unidos", language: "Inglés", voices: "Femenino" },
  { title: "Crazy in Love", artist: "Beyoncé ft. Jay-Z", genre: "Pop", decade: "2000s", country: "Estados Unidos", language: "Inglés", voices: "Mixto" },
  
  // Música Latina
  { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", genre: "Reggaeton", decade: "2010s", country: "Puerto Rico", language: "Español", voices: "Masculino" },
  { title: "La Bamba", artist: "Ritchie Valens", genre: "Rock", decade: "1950s", country: "Estados Unidos", language: "Español", voices: "Masculino" },
  { title: "Bailando", artist: "Enrique Iglesias", genre: "Pop", decade: "2010s", country: "España", language: "Español", voices: "Masculino" },
  { title: "Vivir Mi Vida", artist: "Marc Anthony", genre: "Salsa", decade: "2010s", country: "Estados Unidos", language: "Español", voices: "Masculino" },
  { title: "La Camisa Negra", artist: "Juanes", genre: "Rock", decade: "2000s", country: "Colombia", language: "Español", voices: "Masculino" },
  { title: "Livin' la Vida Loca", artist: "Ricky Martin", genre: "Pop", decade: "1990s", country: "Puerto Rico", language: "Español", voices: "Masculino" },
  { title: "Hips Don't Lie", artist: "Shakira ft. Wyclef Jean", genre: "Pop", decade: "2000s", country: "Colombia", language: "Inglés", voices: "Mixto" },
  { title: "Waka Waka", artist: "Shakira", genre: "Pop", decade: "2010s", country: "Colombia", language: "Español", voices: "Femenino" },
  { title: "Suavemente", artist: "Elvis Crespo", genre: "Merengue", decade: "1990s", country: "Puerto Rico", language: "Español", voices: "Masculino" },
  { title: "Amor Prohibido", artist: "Selena", genre: "Tejano", decade: "1990s", country: "Estados Unidos", language: "Español", voices: "Femenino" },
  
  // Baladas y Duetos
  { title: "Time of My Life", artist: "Bill Medley & Jennifer Warnes", genre: "Pop", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Mixto" },
  { title: "Shallow", artist: "Lady Gaga & Bradley Cooper", genre: "Pop", decade: "2010s", country: "Estados Unidos", language: "Inglés", voices: "Mixto" },
  { title: "Endless Love", artist: "Diana Ross & Lionel Richie", genre: "Pop", decade: "1980s", country: "Estados Unidos", language: "Inglés", voices: "Mixto" },
  { title: "Don't Go Breaking My Heart", artist: "Elton John & Kiki Dee", genre: "Pop", decade: "1970s", country: "Reino Unido", language: "Inglés", voices: "Mixto" },
  { title: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", genre: "Hip Hop", decade: "2000s", country: "Estados Unidos", language: "Inglés", voices: "Mixto" },
  
  // Música Francesa
  { title: "Non, je ne regrette rien", artist: "Édith Piaf", genre: "Chanson", decade: "1960s", country: "Francia", language: "Francés", voices: "Femenino" },
  { title: "La Vie en Rose", artist: "Édith Piaf", genre: "Chanson", decade: "1940s", country: "Francia", language: "Francés", voices: "Femenino" },
  { title: "Dernière Danse", artist: "Indila", genre: "Pop", decade: "2010s", country: "Francia", language: "Francés", voices: "Femenino" },
  { title: "Formidable", artist: "Stromae", genre: "Pop", decade: "2010s", country: "Bélgica", language: "Francés", voices: "Masculino" },
  { title: "Papaoutai", artist: "Stromae", genre: "Pop", decade: "2010s", country: "Bélgica", language: "Francés", voices: "Masculino" },
  
  // Disco y Dance
  { title: "Stayin' Alive", artist: "Bee Gees", genre: "Disco", decade: "1970s", country: "Reino Unido", language: "Inglés", voices: "Masculino" },
  { title: "Dancing Queen", artist: "ABBA", genre: "Pop", decade: "1970s", country: "Suecia", language: "Inglés", voices: "Femenino" },
  { title: "I Will Survive", artist: "Gloria Gaynor", genre: "Disco", decade: "1970s", country: "Estados Unidos", language: "Inglés", voices: "Femenino" },
  { title: "Le Freak", artist: "Chic", genre: "Disco", decade: "1970s", country: "Estados Unidos", language: "Inglés", voices: "Mixto" },
  { title: "Don't Stop 'Til You Get Enough", artist: "Michael Jackson", genre: "Disco", decade: "1970s", country: "Estados Unidos", language: "Inglés", voices: "Masculino" },
];

// Generar IDs y completar información
export const songs: Song[] = songsData.map((song, index) => ({
  ...song,
  id: (index + 1).toString(),
  audioUrl: "/audio/sample.mp3",
  displayName: `${song.title} - ${song.artist}`
}));

// La canción del día (fija para todas las ejecuciones)
// La canción correcta es "Hotel California - Eagles"
export const todaySong: Song = songs[2];
