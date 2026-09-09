import type { Song } from "@/app/data/songs";

export type SongContentOverride = Pick<
  Song,
  "lyricLine" | "titleRiddle" | "hookStartSec"
>;

/** Overrides por id para Tres/Cinco pistas. No hace falta anotar el catálogo entero. */
export const songOverrides: Record<string, SongContentOverride> = {
  de233f63b1e82c0e2720eae305a93ccb: {
    lyricLine: "I'm a cowboy, on a steel horse I ride",
    titleRiddle: "Llamarada de gloria",
  },
  "170a62b94724a78a7f7e01fc0063ea5c": {
    lyricLine: "Me acerco a ti y tiembla la ciudad",
    titleRiddle: "Rozando lo que no se acaba nunca",
  },
  a5a828d02411e9c96be34366fa7205ae: {
    lyricLine: "Hoy me apetece hacer el indio, yo quiero ser un vago",
    titleRiddle: "Me dispongo a disfrutar a tope",
  },
  b3ad11071dbec0d2386fe0e78c5872b4: {
    lyricLine: "Tengo un secreto que no puedo contar",
    titleRiddle: "Tóxico sobre la epidermis",
  },
  "7f6c788f3ebf4293c56bcc5190a50452": {
    lyricLine: "You can turn me on, you can turn me off",
    titleRiddle: "Rubia que se mata",
  },
  "72325d17d4821f90555e91387b7a78dd": {
    lyricLine: "Oceans apart, day after day, and I slowly go insane",
    titleRiddle: "Justo aquí, aguardándote",
  },
  "4fb4d15fbfe5a50fb2d0d95185bb4e71": {
    lyricLine: "Words are very unnecessary, they can only do harm",
    titleRiddle: "Disfruta el silencio",
  },
  ea5aea92a1f23e85280a30b46a0e358e: {
    lyricLine: "Dibujé tu nombre en la pizarra del colegio",
    titleRiddle: "Órgano de tiza para escribir",
  },
  "3dff71bfc97e81e775c9a7e4d124bdf5": {
    lyricLine: "Me gusta el sol, me gusta el mar, me gusta el viento",
    titleRiddle: "Espíritu endemoniado",
  },
  "8b76130cf79207298278aac901a84842": {
    lyricLine: "Por la noche al despertar, yo te quiero imaginar",
    titleRiddle: "¡De qué manera bailas!",
  },
  "889a3bc2592b587c0669654aaf1d6281": {
    lyricLine: "No me hables de destinos cuando se acaba la fe",
    titleRiddle: "En medio de un par de suelos",
  },
  "73416793192b512c3c9668f5a50ba31e": {
    lyricLine: "Paseabas por el parque cuando te vi llegar",
    titleRiddle: "Muchachita",
  },
  "55d96c7ad9918e052e96c1de9de7c252": {
    lyricLine: "She's homeless, she's homeless",
    titleRiddle: "Mujer nómada (no tiene casa)",
  },
  ac9c24fbfbc54c840854f5495034d6eb: {
    lyricLine: "Hoy es un día especial, no es un día cualquiera",
    titleRiddle: "El día siete del noveno mes",
  },
  "2fcfd7728f1da903acb7861baaf15875": {
    lyricLine: "Cierro los ojos y te veo sonreír",
    titleRiddle: "En el momento en que descansas",
  },
  "704b57dcd64b989f7be42b155e36798e": {
    lyricLine: "You've got that style, so enigmatic",
    titleRiddle: "Algo me puso en marcha",
  },
  a7bdc9b782d09543efea7024b70e8012: {
    lyricLine: "Voy a seguir, voy a seguir, aunque me duela",
    titleRiddle: "Caminando con paso firme",
  },
  "4816093ec6b67af7b8726f8c0300418e": {
    lyricLine: "Había una vez un hombre que se llamaba...",
    titleRiddle: "Nárrame una fábula",
  },
  "0e8f4c69244846a1e37daa4192a1aee7": {
    lyricLine: "Se le apagó la luz, se quedó a oscuras",
    titleRiddle: "Se le fue el brillo",
  },
  "4c341817367cfaf1dab6f8ac64b1437d": {
    lyricLine: "I took my baby on a Saturday bang",
    titleRiddle: "Negro o blanco",
  },
  "744f9bf601d18383cb412f1e87b7e263": {
    lyricLine: "Do you remember the time when we fell in love",
    titleRiddle: "Acuérdate de aquel momento",
  },
  "5b41defa1e7d31b6ae5e2b876efaa9b6": {
    lyricLine: "Cuando estás lejos de mí, el mundo pierde el color",
    titleRiddle: "Tenme en la cabeza",
  },
  "683e9e04e21cb751f2d93f861c4d2d36": {
    lyricLine: "Erotic, erotic, put your hands all over my body",
    titleRiddle: "Cosa sensual",
  },
  "105a9a9d3207911e02616467fd939e53": {
    lyricLine: "Si pudiera parar el reloj, me quedaría aquí",
    titleRiddle: "A sesenta segundos de ti",
  },
  c0d47f7b5dbcba7bbb868879f95511a3: {
    lyricLine: "For you, I'd steal the stars from the sky",
    titleRiddle: "Astros",
  },
  e0acc2f2166b3285559ca70f6d4aace1: {
    lyricLine: "Nunca olvidaré aquel día, bajo la lluvia de abril",
    titleRiddle: "El veinte del cuarto mes",
  },
  "32546175fa115b0e6309b96b46753aa3": {
    lyricLine: "Load up on guns, bring your friends, it's fun to lose and to pretend",
    titleRiddle: "Huele a espíritu adolescente",
  },
  "09989b60adaaecba5577e7a9ad46e0a4": {
    lyricLine: "Las olas rompen y el viento me habla de ti",
    titleRiddle: "El compás del océano",
  },
  db4016db17f0c9cff21e0ad57009f516: {
    lyricLine: "En un palacio de oro vive un hombre de paz",
    titleRiddle: "El líder espiritual del Tíbet",
  },
  a055be9c4be85325f5d748b38267f811: {
    lyricLine: "Don't tell my heart, my achy breaky heart",
    titleRiddle: "Corazón dolorido y roto",
  },
  da5e16320e3e391c06ce703df7ebd807: {
    lyricLine: "Una mirada tuya y se me olvida el mundo",
    titleRiddle: "En caso de que posaras los ojos en mí",
  },
  "2e74a5442d945baf0d8d03026b9ef9a1": {
    lyricLine: "And I said hey, what's going on",
    titleRiddle: "¿Qué pasa?",
  },
  "72d0c0dceb8f07d4e775ccb252cc04cf": {
    lyricLine: "You'll remember me when the west wind moves upon the fields of barley",
    titleRiddle: "Campos de oro",
  },
  "19766bf49163b8b9d45d3691a5809c51": {
    lyricLine: "Together we will go far, go west, life is peaceful there",
    titleRiddle: "Ve al oeste",
  },
  "928cbbd1df06b0a4766a0e90dca01f06": {
    lyricLine: "Sitting here wasted and wounded at this bed of roses",
    titleRiddle: "Cama de rosas",
  },
  "5473fcff534876c28446dab5368d3e7a": {
    lyricLine: "No me dejes solo, necesito verte otra vez",
    titleRiddle: "Deseo tenerte cerca",
  },
  "69be601d60c4bde796ebb03750c01837": {
    lyricLine: "Aunque pasen los años, yo te seguiré esperando",
    titleRiddle: "Este resplandor jamás se apagará",
  },
  "7a29a97b55171f69cfaa45dcebd4aa88": {
    lyricLine: "Vine sin papeles y me quedé por tu amor",
    titleRiddle: "Sin papeles de identidad",
  },
  "3169fb9c506fdc8fc8969018492145f6": {
    lyricLine: "She's gone tomorrow, a young girl needs to have fun",
    titleRiddle: "Todo cuanto ella desea",
  },
  b4f7d250e551f7c53cc5ce6952d770e0: {
    lyricLine: "I feel you, your sun it shines",
    titleRiddle: "Te percibo",
  },
  bd57c3ad9fa6b17b4193fc25900ee077: {
    lyricLine: "El tiempo pasa y yo te sigo esperando aquí",
    titleRiddle: "Si tú no regresas",
  },
  "335188500dc06deb7dcc064bee62016b": {
    lyricLine: "Cuando estás a mi lado todo es más fácil",
    titleRiddle: "Me sientas tan bien",
  },
  "87e9bc15f7997a6cc171b4284fa09bd9": {
    lyricLine: "Dime la verdad, no me cuentes milongas",
    titleRiddle: "Si no es más que cariño",
  },
  "17ae888bc92560cb8009590fb4f697f2": {
    lyricLine: "I was bruised and battered, I couldn't tell what I felt",
    titleRiddle: "Calles de Filadelfia",
  },
  "14370abe83564bc4a3d0936b7211681f": {
    lyricLine: "En el barrio todos conocen su fama",
    titleRiddle: "Don Matanza",
  },
  e0224f89359e8a9deb3a67e16179c4a8: {
    lyricLine: "Bebo de tu copa y vuelvo a nacer",
    titleRiddle: "Poción para no envejecer",
  },
  c2ea9f8bded2f12e0607487b3fe17b68: {
    lyricLine: "Ahora estoy aquí, sola, sin su amor",
    titleRiddle: "Se marchó",
  },
  "2cd5cb6667fec148ce6cdbe93249ab89": {
    lyricLine: "No entiendo esta extraña manera de quererme",
    titleRiddle: "Cariños raros",
  },
  bb4348fd171241eee0d175fa5f785d6d: {
    lyricLine: "El uno miraba la estrella, el otro miraba el mar",
    titleRiddle: "Canción del marino y su jefe",
  },
  be1326263b7d5824ddeacb24a99b8db0: {
    lyricLine: "I used to be a fool for you, baby",
    titleRiddle: "No más te quiero",
  },
  "3980edb21c3435c3b37d43132cbce5cf": {
    lyricLine: "The show is over, say goodbye",
    titleRiddle: "Haz una reverencia",
  },
  "23722cc39d26afab54aa572d05ecc6d1": {
    lyricLine: "I found a love, it was shining through the night",
    titleRiddle: "Feria",
  },
  "7f3be84bb33a785f38e7ec4584ee042a": {
    lyricLine: "Gato negro, gato blanco, siete vidas para amar",
    titleRiddle: "Siete existencias",
  },
  "242c52cec1d3988499f4c23ce3273ea6": {
    lyricLine: "Hay un ruido en mi cabeza que no me deja pensar",
    titleRiddle: "Estruendo",
  },
  c9ffbe1ccb6bd67185721012fa1be637: {
    lyricLine: "Tengo un problema y no sé cómo resolverlo",
    titleRiddle: "Lío",
  },
  "359da8a16a47c359787e22b781bb4954": {
    lyricLine: "Cuando todo se derrumba, tú me das la mano",
    titleRiddle: "La potencia del órgano del pecho",
  },
  "1f9db623c7334cf574f09c156292f1f2": {
    lyricLine: "Hablo con las paredes, me respondo a mí mismo",
    titleRiddle: "El vacío y este servidor",
  },
  d1ac75c3dab06a7d285095006447ed7f: {
    lyricLine: "He's a shy guy, but he loves you so",
    titleRiddle: "Chico tímido",
  },
  bc9768be31642477c56712ee1e0737bb: {
    lyricLine: "Mejor solo que mal acompañado, ya lo dice el dicho",
    titleRiddle: "Me quedaré sin compañía",
  },
  "83b7f355cbe8ddad1b38e09089922977": {
    lyricLine: "Morena de ojos negros, ven y baila conmigo",
    titleRiddle: "Morena",
  },
  "27381c296a7885909e3c6be2ea1c7342": {
    lyricLine: "I sit here in my lonely room staring at the walls",
    titleRiddle: "Árbol de limones",
  },
  "4e64f67b197c13e7e8f167d0ecdc6b1c": {
    lyricLine: "Kindness in your eyes, I guess you heard me cry",
    titleRiddle: "Jesús para un niño",
  },
  d8ee991e46684feb58b0e14dbd6b5959: {
    lyricLine: "No hay fuego que me apague ni lluvia que me rinda",
    titleRiddle: "La chispa que conviene",
  },
  "98ce178713c91ffef1d83f131544b287": {
    lyricLine: "Today is gonna be the day that they're gonna throw it back to you",
    titleRiddle: "Muro de las maravillas",
  },
  "3339b050d6c34bd2bb58ff71215d7e69": {
    lyricLine: "Where do I take this pain of mine, I run but I ride",
    titleRiddle: "Hasta que se duerma",
  },
  deba088202f2c1633e72219a7f0fd281: {
    lyricLine: "Si esto no funciona, lo dejamos estar",
    titleRiddle: "Lo dejamos al azar",
  },
  "2f6abfb328f8179062594198553111de": {
    lyricLine: "Eres la otra mitad que me faltaba",
    titleRiddle: "Astro gemelo",
  },
  "0ec1c02260b0f5f1293dc129a8bc1897": {
    lyricLine: "I step off the train, I'm walking down your street",
    titleRiddle: "Desaparecida",
  },
  "73d2b3baf6681bf80d1009fe61662bf3": {
    lyricLine: "That's the way life is, that's the way life is",
    titleRiddle: "Si la existencia es así",
  },
  f56e8739c23fd29f70172ccabd87763c: {
    lyricLine: "Gotta get up to get down, gotta get up to get down",
    titleRiddle: "Amor rápido",
  },
  bf7467a47141fdac8f064558dd2cd907: {
    lyricLine: "Needless to say, I keep her in my heart",
    titleRiddle: "Niños",
  },
  "45ee666740e2b920d05f062c7e2f9445": {
    lyricLine: "Bebo de tus labios y me enveneno despacio",
    titleRiddle: "Deseo morir en tu tósigo",
  },
  "6f3d47b6c5eb50ec83dcdea0bb275090": {
    lyricLine: "It's like rain on your wedding day, it's a free ride when you've already paid",
    titleRiddle: "Irónico",
  },
  "780a2fe2b556bf1571386b1e350ae295": {
    lyricLine: "Un, dos, tres, un pasito pa'lante María",
    titleRiddle: "María",
  },
  "4a70e081dc074ce49832ee4aa9d34d46": {
    lyricLine: "No me hagas esperar, ven y dámelo ahora",
    titleRiddle: "Dámelo",
  },
  "6b9662278e177c13f1f374a71cd4f97c": {
    lyricLine: "Cuando te miro a los ojos se me alegra el alma",
    titleRiddle: "Qué hermoso",
  },
  "8065f95b8882ee9d9febb34aa11eb53f": {
    lyricLine: "Y me da igual que sea pecado si estoy a tu lado",
    titleRiddle: "Junto a ti",
  },
  "758269c77c3004857f24812a636c8705": {
    lyricLine: "I'll tell you what I want, what I really really want",
    titleRiddle: "Quiero serlo",
  },
  "1357426f7314af09720aaea77a306bdf": {
    lyricLine: "Te quiero, y a la vez te echo de menos",
    titleRiddle: "Y aun así",
  },
  "2251166e84082d82f529340da0e254be": {
    lyricLine: "I've been looking for love in all the wrong places",
    titleRiddle: "Cañón de un arma",
  },
  dc6963b05eaab6dc7a2ce590d7eaa957: {
    lyricLine: "Everybody, yeah, rock your body, yeah",
    titleRiddle: "Todos y cada uno",
  },
  "5a315629a04f6fe16e43250aea7fe757": {
    lyricLine: "En la barra del bar nos conocimos una noche",
    titleRiddle: "Cariños de mostrador",
  },
  "83ddd7d0361525764026b3f48ce7fc81": {
    lyricLine: "The cup of life, this is the one, now or never",
    titleRiddle: "El trofeo de la existencia",
  },
  cbd04db8f9b0179a2d1d28635cbf5223: {
    lyricLine: "Los besos que te di, los tienes aún, te guste o no",
    titleRiddle: "La delgadita",
  },
  "053dead4b3017c9af35cf83b1cee39e4": {
    lyricLine: "Ya lo ves, que no hay dos sin tres",
    titleRiddle: "Órgano del pecho hecho trizas",
  },
  dbc7627c69b88ebc50292d929ccf0dbd: {
    lyricLine: "Oh baby baby, how was I supposed to know",
    titleRiddle: "Cariño, una vez más",
  },
  "18c94fa65a0393a66a9fad71871cc7b7": {
    lyricLine: "She's into superstitions, black cats and voodoo dolls",
    titleRiddle: "Viviendo la existencia chiflada",
  },
  "0e844eea9c464794297cfc741d42ef6d": {
    lyricLine: "I used to rule the world, seas would rise when I gave the word",
    titleRiddle: "Que viva la existencia",
  },
  "52fd49ccb95c19572ce140c177999e47": {
    lyricLine: "Party girls don't get hurt, can't feel anything, when will I learn",
    titleRiddle: "La lámpara del techo",
  },
  ce3ab8131bcf48339044770c9da9e3ff: {
    lyricLine: "This hit, that ice cold, Michelle Pfeiffer, that white gold",
    titleRiddle: "El ritmo de barrio rico",
  },
  "54465f3dd9796c998e45b3c13fd475c8": {
    lyricLine: "Hello from the other side, I must've called a thousand times",
    titleRiddle: "Hola, ¿sigues ahí?",
  },
  "7489ebe1b5022ffde78f6d17086841ae": {
    lyricLine: "Fue a primera vista, no lo pude evitar",
    titleRiddle: "Me prendé de ti",
  },
  "9e7907b5c796094fbc033048df5c2cf7": {
    lyricLine: "The club isn't the best place to find a lover, so the bar is where I go",
    titleRiddle: "La forma que tienes",
  },
  "1750cd7162ba40b21a5c9791dafcc0b0": {
    lyricLine: "I been tryna call, I been on my own for long enough",
    titleRiddle: "Luces que ciegan",
  },
  "23c07f90af5292585474e8c56e4aaf4b": {
    lyricLine: "Aunque no puedas olvidarme, no hay nadie como él",
    titleRiddle: "El disgusto de un despecho",
  },
  d92dc32ef28d0f9664a51f25fee7fc65: {
    lyricLine: "Y ahora que te fuiste yo me puse a beber",
    titleRiddle: "Ese baile caribeño de guitarra",
  },
  a75c4f2d9eb3f7543d38cdd54bdbea03: {
    lyricLine: "Ya no te extraño ni siento tu olor, ya no me acuerdo ni cómo era tu voz",
    titleRiddle: "La región francesa de lavanda",
  },
  "71c6572592c7d8712ff99ced9d944dc6": {
    lyricLine: "Throw dirt in your eyes, you can still see the sun",
    titleRiddle: "Gente brillante y alegre",
  },
  "24c2dd8e3ccd88e7eb5ca25dbeb9e7f7": {
    lyricLine: "The roof, the roof, the roof is on fire",
    titleRiddle: "Te voy a dejar empapado en la pista",
  },
  "6cf799870940f8a1ce6cf0b7fa681f36": {
    lyricLine: "Don't move, don't talk, I've got something to say",
    titleRiddle: "Insensible, sin sentir nada",
  },
  "9bff801a4831f746d21b1df3e2e5f068": {
    lyricLine: "I believe in love, I believe in love",
    titleRiddle: "Ten fe",
  },
  c814286b419e9f639b212bb8e9e32e58: {
    lyricLine: "Many nights we've prayed, with no proof anyone could hear",
    titleRiddle: "Cuando tienes fe",
  },
  dd7462cb2bb699930952296548c7dcac: {
    lyricLine: "Me tienes en tu cama y no me dejas ni dormir",
    titleRiddle: "Fijación que no se va",
  },
  a74e6da092077fc3399eacdabc122273: {
    lyricLine: "I'm looking for a place where I can breathe",
    titleRiddle: "Buscando el edén",
  },
  "36c84f24bf4ec602e788e75c244ede5f": {
    lyricLine: "Feeling my way through the darkness, guided by a beating heart",
    titleRiddle: "Despiértame",
  },
  ee7487396debd2072881def3532f2882: {
    lyricLine: "I wanna be contigo, and live contigo, and dance contigo",
    titleRiddle: "Mientras danzo",
  },
  "3fba7d2ca9e931597dc90535ba45df03": {
    lyricLine: "You were the shadow to my light, did you feel us",
    titleRiddle: "Desteñido, desvanecido",
  },
  "8f37bdddcec282d28dd9d10d4c18a900": {
    lyricLine: "I don't need no money, as long as I can feel the beat",
    titleRiddle: "Emociones baratas",
  },
  "15f81494c10d239f62d61c0f83d192de": {
    lyricLine: "Que si me das un aventón en tu bicicleta",
    titleRiddle: "El vehículo de dos ruedas",
  },
  b5e7019f6ebcb28070b9e1a85a065879: {
    lyricLine: "Cuando estás soltera, te doy lo que tú quieras",
    titleRiddle: "Extorsión sentimental",
  },
  "29c33ea9e731f27da1db2362f99c2c12": {
    lyricLine: "Si te pido un beso, ven, dámelo, yo sé que estás pensándolo",
    titleRiddle: "Poquito a poco, sin prisa",
  },
  c0c045dd7a0e87cbc6988bb665722857: {
    lyricLine: "Come on, let's get it, let's get it",
    titleRiddle: "Despacio, con calma",
  },
  e953086e9ed9567700dd2dac7eb530a5: {
    lyricLine: "Yo no tengo la culpa de lo que te pasa",
    titleRiddle: "Atribúyeme a mí el error",
  },
  bde7c2f7d494616b038c5ba08b789540: {
    lyricLine: "Dile que no es verdad, que yo no te he llamado",
    titleRiddle: "Tranquilidad (versión Alicia)",
  },
  "78557506b4cf085826424001d302a2b1": {
    lyricLine: "Dile que no es verdad, que yo no te he llamado",
    titleRiddle: "Sin ningún apuro",
  },
  a9b1b0edf840773ccea84ef67b9f8a45: {
    lyricLine: "Estamos en la clase, aprendiendo a ser elegantes",
    titleRiddle: "Elegancia para principiantes",
  },
  "7dadd3490ed8834b84747a20959962e0": {
    lyricLine: "Te quedó grande esta mujer, te quedó grande",
    titleRiddle: "Te resultó demasiado",
  },
  bd6d515f64ee0e6767365fd8c293e6f2: {
    lyricLine: "Don't tell the gods I left a mess, I can't undo what has been done",
    titleRiddle: "Héroes",
  },
  "690b98785a837b611bab6df9b051cc5d": {
    lyricLine: "El día que los imposibles pasen, yo te querré igual",
    titleRiddle: "El día que los anfibios se pongan a bailar",
  },
  c716db580ec45d720f6c927260c3c8b6: {
    lyricLine: "Si pudiera volver atrás, te lo diría otra vez",
    titleRiddle: "Y me gustaría",
  },
  "3d2a62076664ba4e9aa70aa35b238b01": {
    lyricLine: "Antes de irte, dame un último beso",
    titleRiddle: "Di adiós",
  },
};
