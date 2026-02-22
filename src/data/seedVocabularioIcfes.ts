/**
 * Datos de prueba - Vocabulario ICFES Premium
 * Importado como módulo para garantizar disponibilidad sin fetch
 */

export interface SeedCard {
  word: string;
  translation: string;
  definition?: string;
  example?: string;
  category?: string;
  group?: string;
}

export const SEED_VOCABULARIO_ICFES: SeedCard[] = [
  {
    "word": "Where",
    "translation": "Donde",
    "definition": "Se usa para preguntar por una ubicación física o lógica",
    "example": "Where is the source code?",
    "group": "Wh- Questions"
  },
  {
    "word": "What",
    "translation": "Que / Cual",
    "definition": "Se usa para pedir información sobre algo",
    "example": "What is the primary key in this table?",
    "group": "Wh- Questions"
  },
  {
    "word": "Who",
    "translation": "Quien",
    "definition": "Para identificar a una persona",
    "example": "Who is the project manager?",
    "group": "Wh- Questions"
  },
  {
    "word": "Why",
    "translation": "Por qué",
    "definition": "Para preguntar la razón o el motivo de algo",
    "example": "Why did the server crash?",
    "group": "Wh- Questions"
  },
  {
    "word": "When",
    "translation": "Cuando",
    "definition": "Se refiere al tiempo o momento de un evento",
    "example": "When is the deadline?",
    "group": "Wh- Questions"
  },
  {
    "word": "How",
    "translation": "Como",
    "definition": "Indica el modo, la forma o el estado",
    "example": "How can I optimize this function?",
    "group": "Wh- Questions"
  },
  {
    "word": "Whom",
    "translation": "A quien",
    "definition": "Forma objeto de who, usada tras preposiciones",
    "example": "To whom should I send the report?",
    "group": "Wh- Questions"
  },
  {
    "word": "Whose",
    "translation": "De quien / Cuyo",
    "definition": "Indica posesión o pertenencia",
    "example": "Whose laptop is this?",
    "group": "Wh- Questions"
  },
  {
    "word": "How many",
    "translation": "Cuantos",
    "definition": "Para cantidades contables",
    "example": "How many bugs did you find?",
    "group": "Wh- Questions"
  },
  {
    "word": "How much",
    "translation": "Cuanto",
    "definition": "Para cantidades no contables o precios",
    "example": "How much memory does it use?",
    "group": "Wh- Questions"
  },
  {
    "word": "How long",
    "translation": "Cuanto tiempo",
    "definition": "Mide duración o longitud",
    "example": "How long does the backup take?",
    "group": "Wh- Questions"
  },
  {
    "word": "How often",
    "translation": "Con que frecuencia",
    "definition": "Pregunta por la periodicidad",
    "example": "How often do you commit changes?",
    "group": "Wh- Questions"
  },
  {
    "word": "Which",
    "translation": "Cual / Cuales",
    "definition": "Se usa cuando hay opciones para elegir",
    "example": "Which framework do you prefer?",
    "group": "Wh- Questions"
  },
  {
    "word": "How far",
    "translation": "Cuan lejos",
    "definition": "Pregunta por distancia física o de avance",
    "example": "How far is the office?",
    "group": "Wh- Questions"
  },
  {
    "word": "What time",
    "translation": "A que hora",
    "definition": "Para preguntar por una hora específica",
    "example": "What time is the daily meeting?",
    "group": "Wh- Questions"
  },
  {
    "word": "How come",
    "translation": "Por qué",
    "definition": "Forma informal de preguntar la razón",
    "example": "How come the app is so slow?",
    "group": "Wh- Questions"
  },
  {
    "word": "To",
    "translation": "A / Para",
    "definition": "Indica dirección, destino o propósito",
    "example": "Send the data to the server.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "For",
    "translation": "Por / Para",
    "definition": "Indica beneficio, motivo o duración",
    "example": "This tool is for testing.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "From",
    "translation": "De (origen)",
    "definition": "Indica el origen o punto de partida",
    "example": "Download the library from the site.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Of",
    "translation": "De",
    "definition": "Indica pertenencia o material",
    "example": "This is a list of all users.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "By",
    "translation": "Por / Al lado de",
    "definition": "Indica autoría, cercanía o medio",
    "example": "The script was written by me.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Because",
    "translation": "Porque",
    "definition": "Introduce una razón o causa",
    "example": "I am late because the train stopped.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "And",
    "translation": "Y",
    "definition": "Conecta ideas similares",
    "example": "I like Python and JavaScript.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Or",
    "translation": "O",
    "definition": "Presenta alternativas",
    "example": "You can use a laptop or a tablet.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "But",
    "translation": "Pero",
    "definition": "Indica contraste o excepción",
    "example": "The logic is correct, but syntax is wrong.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Also",
    "translation": "También",
    "definition": "Añade información",
    "example": "He is a dev and also a designer.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "As",
    "translation": "Como / Cuando / Ya que",
    "definition": "Tiene múltiples usos comparativos o causales",
    "example": "Use this variable as a counter.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Yet",
    "translation": "Todavía / Sin embargo",
    "definition": "Indica algo pendiente o un contraste",
    "example": "I haven't finished the module yet.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "However",
    "translation": "Sin embargo",
    "definition": "Contraste fuerte entre dos ideas",
    "example": "The system is old; however, it works.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Nevertheless",
    "translation": "No obstante",
    "definition": "Similar a however pero más formal",
    "example": "Errors occurred; nevertheless, it finished.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Beside",
    "translation": "Al lado de",
    "definition": "Indica posición física",
    "example": "My desk is beside the window.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Besides",
    "translation": "Además",
    "definition": "Añade información extra",
    "example": "Besides the UI, we need to fix the backend.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Next to",
    "translation": "Al lado de",
    "definition": "Indica cercanía inmediata",
    "example": "Put the printer next to the computer.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Near",
    "translation": "Cerca",
    "definition": "Indica proximidad",
    "example": "Is there a cafeteria near the office?",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Therefore",
    "translation": "Por lo tanto",
    "definition": "Indica consecuencia lógica",
    "example": "It's raining; therefore, the event is canceled.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Since",
    "translation": "Desde / Ya que",
    "definition": "Indica tiempo o razón",
    "example": "I have lived here since 2020.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Although",
    "translation": "Aunque",
    "definition": "Introduce una concesión",
    "example": "Although it was difficult, he solved it.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "In fact",
    "translation": "De hecho",
    "definition": "Para enfatizar una realidad",
    "example": "In fact, this is the most efficient solution.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Instead",
    "translation": "En lugar de",
    "definition": "Indica sustitución",
    "example": "Use a constant instead of a hardcoded value.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Whether",
    "translation": "Si (condicional)",
    "definition": "Expresa duda entre opciones",
    "example": "I don't know whether the API is public.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "If",
    "translation": "Si (condicional)",
    "definition": "Introduce una condición lógica",
    "example": "If the condition is true, run this code.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Furthermore",
    "translation": "Además",
    "definition": "Conector formal para añadir información",
    "example": "The app is fast. Furthermore, it is secure.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Moreover",
    "translation": "Es más",
    "definition": "Agrega un punto importante a un argumento",
    "example": "The code is clean; moreover, it is tested.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "On the other hand",
    "translation": "Por otro lado",
    "definition": "Introduce un punto de vista opuesto",
    "example": "It is expensive. On the other hand, it's fast.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Despite",
    "translation": "A pesar de",
    "definition": "Indica que algo sucede contra lo esperado",
    "example": "Despite the bug, the system works.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "In spite of",
    "translation": "A pesar de",
    "definition": "Sinónimo de despite",
    "example": "She finished the task in spite of the issues.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Even though",
    "translation": "Aunque",
    "definition": "Da énfasis a una concesión",
    "example": "Even though it rained, we went out.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "Otherwise",
    "translation": "De lo contrario",
    "definition": "Indica la consecuencia de no hacer algo",
    "example": "Save the file, otherwise you'll lose data.",
    "group": "Connectors & Prepositions"
  },
  {
    "word": "My",
    "translation": "Mi / Mis",
    "definition": "Posesivo de la primera persona",
    "example": "This is my keyboard.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Your",
    "translation": "Tu / Tus",
    "definition": "Posesivo de la segunda persona",
    "example": "What is your name?",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Her",
    "translation": "Su (de ella) / Ella",
    "definition": "Posesivo femenino o pronombre de objeto",
    "example": "I like her style.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "His",
    "translation": "Su (de él)",
    "definition": "Posesivo masculino",
    "example": "His car is red.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Its",
    "translation": "Su (cosa o animal)",
    "definition": "Posesivo neutro",
    "example": "The system restarted its services.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Our",
    "translation": "Nuestro(s)",
    "definition": "Posesivo de nosotros",
    "example": "This is our repository.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Their",
    "translation": "Su (de ellos)",
    "definition": "Posesivo plural",
    "example": "Their code is open source.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Me",
    "translation": "Me / A mí",
    "definition": "Pronombre de objeto",
    "example": "Can you help me?",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Him",
    "translation": "Lo / A él",
    "definition": "Pronombre de objeto masculino",
    "example": "I called him yesterday.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "You",
    "translation": "Te / Tú",
    "definition": "Pronombre personal o de objeto",
    "example": "I will go with you.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "It",
    "translation": "Lo / La (cosa)",
    "definition": "Pronombre neutro",
    "example": "I bought a phone; I love it.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Us",
    "translation": "Nos / Nosotros",
    "definition": "Pronombre de objeto de primera persona plural",
    "example": "Join us for lunch.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Them",
    "translation": "Los / A ellos",
    "definition": "Pronombre de objeto plural",
    "example": "Look at them coding.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Myself",
    "translation": "Yo mismo",
    "definition": "Pronombre reflexivo",
    "example": "I taught myself Python.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Herself",
    "translation": "Ella misma",
    "definition": "Pronombre reflexivo femenino",
    "example": "She fixed the bug herself.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Themselves",
    "translation": "Ellos mismos",
    "definition": "Pronombre reflexivo plural",
    "example": "They deployed the app themselves.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "This",
    "translation": "Este / Esta",
    "definition": "Demostrativo singular cercano",
    "example": "This is a great tool.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "That",
    "translation": "Ese / Esa",
    "definition": "Demostrativo singular lejano",
    "example": "That server is offline.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "These",
    "translation": "Estos / Estas",
    "definition": "Demostrativo plural cercano",
    "example": "These files are corrupted.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Those",
    "translation": "Esos / Esas",
    "definition": "Demostrativo plural lejano",
    "example": "Those endpoints need auth.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Some",
    "translation": "Algunos / Unos",
    "definition": "Cantidad indefinida positiva",
    "example": "I have some ideas for the UI.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Any",
    "translation": "Ninguno / Cualquier",
    "definition": "Cantidad indefinida en negaciones o preguntas",
    "example": "I don't have any errors.",
    "group": "Pronouns & Possessives"
  },
  {
    "word": "Kick",
    "translation": "Patear",
    "definition": "Acción física con el pie",
    "example": "Kick the ball into the net.",
    "group": "Verbs"
  },
  {
    "word": "Smell",
    "translation": "Oler",
    "definition": "Sentido del olfato",
    "example": "These flowers smell wonderful.",
    "group": "Verbs"
  },
  {
    "word": "Scold",
    "translation": "Regañar",
    "definition": "Reprender a alguien",
    "example": "The boss had to scold the intern.",
    "group": "Verbs"
  },
  {
    "word": "Kill",
    "translation": "Matar / Detener",
    "definition": "Terminar con la vida o detener un proceso",
    "example": "Kill the background process.",
    "group": "Verbs"
  },
  {
    "word": "Start",
    "translation": "Empezar",
    "definition": "Iniciar algo",
    "example": "Let's start the sprint.",
    "group": "Verbs"
  },
  {
    "word": "Begin",
    "translation": "Empezar",
    "definition": "Sinónimo de start",
    "example": "The meeting begins at 8.",
    "group": "Verbs"
  },
  {
    "word": "Enjoy",
    "translation": "Disfrutar",
    "definition": "Sentir placer haciendo algo",
    "example": "I enjoy coding in Python.",
    "group": "Verbs"
  },
  {
    "word": "Try",
    "translation": "Intentar / Probar",
    "definition": "Hacer un esfuerzo o testear algo",
    "example": "Try to reload the page.",
    "group": "Verbs"
  },
  {
    "word": "Train",
    "translation": "Entrenar",
    "definition": "Prepararse físicamente o enseñar una habilidad",
    "example": "We must train the new model.",
    "group": "Verbs"
  },
  {
    "word": "Forget",
    "translation": "Olvidar",
    "definition": "No recordar algo",
    "example": "Don't forget to save.",
    "group": "Verbs"
  },
  {
    "word": "Buy",
    "translation": "Comprar",
    "definition": "Adquirir algo por dinero",
    "example": "I need to buy a new license.",
    "group": "Verbs"
  },
  {
    "word": "Work",
    "translation": "Trabajar / Funcionar",
    "definition": "Realizar una labor o estar operativo",
    "example": "The new script doesn't work.",
    "group": "Verbs"
  },
  {
    "word": "Watch",
    "translation": "Observar",
    "definition": "Mirar con atención por un tiempo",
    "example": "Watch the console for errors.",
    "group": "Verbs"
  },
  {
    "word": "See",
    "translation": "Ver",
    "definition": "Percibir con los ojos",
    "example": "I see the problem now.",
    "group": "Verbs"
  },
  {
    "word": "Win",
    "translation": "Ganar",
    "definition": "Ser victorioso",
    "example": "We will win the hackathon.",
    "group": "Verbs"
  },
  {
    "word": "Get",
    "translation": "Obtener",
    "definition": "Conseguir o recibir algo",
    "example": "Get the data from the API.",
    "group": "Verbs"
  },
  {
    "word": "Take",
    "translation": "Tomar",
    "definition": "Agarrar o llevar algo",
    "example": "Take a screenshot of the bug.",
    "group": "Verbs"
  },
  {
    "word": "Have",
    "translation": "Tener",
    "definition": "Posesión o verbo auxiliar",
    "example": "I have two monitors.",
    "group": "Verbs"
  },
  {
    "word": "Be",
    "translation": "Ser / Estar",
    "definition": "Verbo básico de estado",
    "example": "The server must be online.",
    "group": "Verbs"
  },
  {
    "word": "Say",
    "translation": "Decir",
    "definition": "Expresar con palabras",
    "example": "Say what you think.",
    "group": "Verbs"
  },
  {
    "word": "Tell",
    "translation": "Contar / Decir",
    "definition": "Dar información a alguien",
    "example": "Tell me the error message.",
    "group": "Verbs"
  },
  {
    "word": "Eat",
    "translation": "Comer",
    "definition": "Ingerir alimentos",
    "example": "I eat lunch at my desk.",
    "group": "Verbs"
  },
  {
    "word": "Drink",
    "translation": "Beber",
    "definition": "Ingerir líquidos",
    "example": "Drink water while you code.",
    "group": "Verbs"
  },
  {
    "word": "Read",
    "translation": "Leer",
    "definition": "Procesar texto",
    "example": "Read the documentation.",
    "group": "Verbs"
  },
  {
    "word": "Write",
    "translation": "Escribir",
    "definition": "Crear texto o código",
    "example": "Write a clean function.",
    "group": "Verbs"
  },
  {
    "word": "Open",
    "translation": "Abrir",
    "definition": "Iniciar o destapar algo",
    "example": "Open the terminal.",
    "group": "Verbs"
  },
  {
    "word": "Cry",
    "translation": "Llorar",
    "definition": "Derramar lágrimas",
    "example": "Don't cry over deleted files.",
    "group": "Verbs"
  },
  {
    "word": "Fly",
    "translation": "Volar",
    "definition": "Moverse por el aire",
    "example": "Time flies when you code.",
    "group": "Verbs"
  },
  {
    "word": "Throw",
    "translation": "Lanzar",
    "definition": "Arrojar algo",
    "example": "Throw an exception if it fails.",
    "group": "Verbs"
  },
  {
    "word": "Reject",
    "translation": "Rechazar",
    "definition": "No aceptar algo",
    "example": "Reject the unauthorized request.",
    "group": "Verbs"
  },
  {
    "word": "Regret",
    "translation": "Lamentar",
    "definition": "Sentir pena por algo hecho",
    "example": "I regret pushing to production on Friday.",
    "group": "Verbs"
  },
  {
    "word": "Hesitate",
    "translation": "Dudar",
    "definition": "No estar seguro al actuar",
    "example": "Do not hesitate to ask.",
    "group": "Verbs"
  },
  {
    "word": "Get married",
    "translation": "Casarse",
    "definition": "Unirse en matrimonio",
    "example": "They will get married next month.",
    "group": "Verbs"
  },
  {
    "word": "Wait",
    "translation": "Esperar",
    "definition": "Esperar físicamente",
    "example": "Wait for the query to execute.",
    "group": "Verbs"
  },
  {
    "word": "Hope",
    "translation": "Esperar (con deseo)",
    "definition": "Deseo de que algo suceda",
    "example": "I hope it compiles.",
    "group": "Verbs"
  },
  {
    "word": "Expect",
    "translation": "Esperar (probabilidad)",
    "definition": "Creer que algo pasará lógicamente",
    "example": "I expect a fast response time.",
    "group": "Verbs"
  },
  {
    "word": "Change",
    "translation": "Cambiar",
    "definition": "Modificar algo",
    "example": "Change the root password.",
    "group": "Verbs"
  },
  {
    "word": "Leak",
    "translation": "Filtrar / Gotear",
    "definition": "Escape de líquido o memoria",
    "example": "Fix the memory leak.",
    "group": "Verbs"
  },
  {
    "word": "Store",
    "translation": "Almacenar",
    "definition": "Guardar datos",
    "example": "Store the token safely.",
    "group": "Verbs"
  },
  {
    "word": "Live",
    "translation": "Vivir",
    "definition": "Residir o estar vivo",
    "example": "Where do you live?",
    "group": "Verbs"
  },
  {
    "word": "Last",
    "translation": "Durar",
    "definition": "Tiempo de ejecución",
    "example": "The session will last one hour.",
    "group": "Verbs"
  },
  {
    "word": "Develop",
    "translation": "Desarrollar",
    "definition": "Crear o mejorar algo",
    "example": "We need to develop a new feature.",
    "group": "Verbs"
  },
  {
    "word": "Improve",
    "translation": "Mejorar",
    "definition": "Hacer que algo sea mejor",
    "example": "Improve the algorithm speed.",
    "group": "Verbs"
  },
  {
    "word": "Achieve",
    "translation": "Lograr",
    "definition": "Alcanzar una meta",
    "example": "We achieved the sprint goals.",
    "group": "Verbs"
  },
  {
    "word": "Avoid",
    "translation": "Evitar",
    "definition": "Prevenir que algo suceda",
    "example": "Avoid infinite loops.",
    "group": "Verbs"
  },
  {
    "word": "Allow",
    "translation": "Permitir",
    "definition": "Dar permiso",
    "example": "Allow CORS in the backend.",
    "group": "Verbs"
  },
  {
    "word": "Let",
    "translation": "Dejar",
    "definition": "Permitir que algo pase",
    "example": "Let the user download the file.",
    "group": "Verbs"
  },
  {
    "word": "Solve",
    "translation": "Resolver",
    "definition": "Encontrar la solución",
    "example": "Solve the merge conflict.",
    "group": "Verbs"
  },
  {
    "word": "Manage",
    "translation": "Administrar",
    "definition": "Controlar o dirigir",
    "example": "Manage the AWS instances.",
    "group": "Verbs"
  },
  {
    "word": "Wake up",
    "translation": "Despertar",
    "definition": "Salir del sueño",
    "example": "I wake up early to study.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Take out",
    "translation": "Sacar",
    "definition": "Remover de un lugar",
    "example": "Take out the trash.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Take off",
    "translation": "Quitar / Despegar",
    "definition": "Remover ropa o iniciar vuelo",
    "example": "The plane will take off soon.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Break up",
    "translation": "Terminar relación",
    "definition": "Finalizar un vínculo",
    "example": "They decided to break up.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Go on",
    "translation": "Continuar",
    "definition": "Seguir adelante",
    "example": "Please, go on with the demo.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Call off",
    "translation": "Cancelar",
    "definition": "Suspender algo programado",
    "example": "We had to call off the meeting.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Look after",
    "translation": "Cuidar",
    "definition": "Estar a cargo",
    "example": "Look after the servers.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Look at",
    "translation": "Mirar",
    "definition": "Fijar la vista en algo",
    "example": "Look at this error log.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Come back",
    "translation": "Regresar",
    "definition": "Volver a un lugar",
    "example": "Come back when it is ready.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Look for",
    "translation": "Buscar",
    "definition": "Tratar de encontrar",
    "example": "I am looking for a bug.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Find out",
    "translation": "Descubrir",
    "definition": "Enterarse de algo",
    "example": "Find out why it failed.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Give up",
    "translation": "Rendirse",
    "definition": "Dejar de intentar",
    "example": "Never give up coding.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Carry out",
    "translation": "Llevar a cabo",
    "definition": "Ejecutar una tarea",
    "example": "Carry out the deployment.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Set up",
    "translation": "Configurar",
    "definition": "Instalar o preparar",
    "example": "Set up your environment.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Bring up",
    "translation": "Mencionar",
    "definition": "Sacar un tema a colación",
    "example": "Bring up the issue in the meeting.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Turn into",
    "translation": "Convertirse",
    "definition": "Cambiar de estado",
    "example": "The warning turned into an error.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Get along",
    "translation": "Llevarse bien",
    "definition": "Tener buena relación",
    "example": "I get along with my team.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Check out",
    "translation": "Revisar",
    "definition": "Mirar algo o salir del hotel",
    "example": "Check out this new repo.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Keep on",
    "translation": "Continuar",
    "definition": "Seguir haciendo algo",
    "example": "Keep on learning.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Pick up",
    "translation": "Recoger",
    "definition": "Levantar algo o alguien",
    "example": "Pick up the package.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Run out of",
    "translation": "Quedarse sin",
    "definition": "Agotar existencias",
    "example": "We ran out of server space.",
    "group": "Phrasal Verbs"
  },
  {
    "word": "Old",
    "translation": "Viejo",
    "definition": "De mucha edad o tiempo",
    "example": "This framework is too old.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Thick",
    "translation": "Grueso",
    "definition": "De gran espesor",
    "example": "The manual is very thick.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Strong",
    "translation": "Fuerte",
    "definition": "Con mucha fuerza o seguridad",
    "example": "Use a strong encryption.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Weak",
    "translation": "Débil",
    "definition": "Sin fuerza o vulnerable",
    "example": "The connection is weak.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Great",
    "translation": "Genial",
    "definition": "Algo muy bueno",
    "example": "That is a great logic.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "A lot of",
    "translation": "Mucho(s)",
    "definition": "Gran cantidad",
    "example": "A lot of data needs parsing.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Many",
    "translation": "Muchos",
    "definition": "Para sustantivos contables",
    "example": "Many variables are unused.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Much",
    "translation": "Mucho",
    "definition": "Para sustantivos no contables",
    "example": "Too much traffic crashed it.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "A few",
    "translation": "Unos pocos",
    "definition": "Cantidad pequeña contable",
    "example": "I need a few more days.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "A little",
    "translation": "Un poco",
    "definition": "Cantidad pequeña no contable",
    "example": "Add a little margin to the div.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Quite",
    "translation": "Bastante",
    "definition": "Intensificador",
    "example": "The query is quite slow.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Quiet",
    "translation": "Silencio",
    "definition": "Falta de ruido",
    "example": "Keep the office quiet.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "More",
    "translation": "Más",
    "definition": "Aumento",
    "example": "We need more RAM.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Less",
    "translation": "Menos",
    "definition": "Disminución",
    "example": "Use less dependencies.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "At least",
    "translation": "Al menos",
    "definition": "Mínimo requerido",
    "example": "Test it at least twice.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Reliable",
    "translation": "Confiable",
    "definition": "Que no falla seguido",
    "example": "This API is very reliable.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Useful",
    "translation": "Útil",
    "definition": "Que sirve para algo",
    "example": "This script is useful.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Main",
    "translation": "Principal",
    "definition": "El más importante",
    "example": "The main function runs first.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Common",
    "translation": "Común",
    "definition": "Que pasa frecuentemente",
    "example": "It is a common error.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Current",
    "translation": "Actual",
    "definition": "Del momento presente",
    "example": "Check the current version.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Accurate",
    "translation": "Exacto",
    "definition": "Libre de errores",
    "example": "The geolocation is accurate.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Dangerous",
    "translation": "Peligroso",
    "definition": "Que puede causar daño",
    "example": "Deleting the DB is dangerous.",
    "group": "Adjectives & Amounts"
  },
  {
    "word": "Zoo",
    "translation": "Zoológico",
    "definition": "Lugar con animales",
    "example": "We visited the zoo.",
    "group": "Places & Environment"
  },
  {
    "word": "Theater",
    "translation": "Teatro",
    "definition": "Lugar para obras",
    "example": "The movie theater is full.",
    "group": "Places & Environment"
  },
  {
    "word": "Shop",
    "translation": "Tienda",
    "definition": "Lugar de compras",
    "example": "Buy it at the shop.",
    "group": "Places & Environment"
  },
  {
    "word": "Store",
    "translation": "Almacén",
    "definition": "Sinónimo de tienda",
    "example": "The app store is down.",
    "group": "Places & Environment"
  },
  {
    "word": "Classroom",
    "translation": "Salón de clase",
    "definition": "Lugar de estudio",
    "example": "The classroom has Wi-Fi.",
    "group": "Places & Environment"
  },
  {
    "word": "Home",
    "translation": "Hogar",
    "definition": "Lugar de residencia",
    "example": "Work from home is great.",
    "group": "Places & Environment"
  },
  {
    "word": "Living room",
    "translation": "Sala",
    "definition": "Cuarto de descanso",
    "example": "The TV is in the living room.",
    "group": "Places & Environment"
  },
  {
    "word": "Kitchen",
    "translation": "Cocina",
    "definition": "Cuarto para cocinar",
    "example": "I left my coffee in the kitchen.",
    "group": "Places & Environment"
  },
  {
    "word": "Dining room",
    "translation": "Comedor",
    "definition": "Cuarto para comer",
    "example": "Eat in the dining room.",
    "group": "Places & Environment"
  },
  {
    "word": "Road",
    "translation": "Carretera",
    "definition": "Vía de transporte",
    "example": "The road is blocked.",
    "group": "Places & Environment"
  },
  {
    "word": "Library",
    "translation": "Biblioteca",
    "definition": "Lugar de libros",
    "example": "Study in the library.",
    "group": "Places & Environment"
  },
  {
    "word": "Environment",
    "translation": "Medio ambiente",
    "definition": "El entorno natural o técnico",
    "example": "Set the dev environment.",
    "group": "Places & Environment"
  },
  {
    "word": "Issue",
    "translation": "Problema",
    "definition": "Asunto a resolver",
    "example": "Open an issue on GitHub.",
    "group": "Places & Environment"
  },
  {
    "word": "Health",
    "translation": "Salud",
    "definition": "Estado físico",
    "example": "Check the health of the server.",
    "group": "Places & Environment"
  },
  {
    "word": "Society",
    "translation": "Sociedad",
    "definition": "Comunidad de personas",
    "example": "Tech changes society.",
    "group": "Places & Environment"
  },
  {
    "word": "Goal",
    "translation": "Meta",
    "definition": "Objetivo a lograr",
    "example": "Our goal is zero downtime.",
    "group": "Places & Environment"
  },
  {
    "word": "Advice",
    "translation": "Consejo",
    "definition": "Sugerencia",
    "example": "Take my technical advice.",
    "group": "Places & Environment"
  },
  {
    "word": "Knowledge",
    "translation": "Conocimiento",
    "definition": "Sabiduría o información",
    "example": "Share your knowledge with juniors.",
    "group": "Places & Environment"
  },
  {
    "word": "Research",
    "translation": "Investigación",
    "definition": "Búsqueda de datos",
    "example": "Do research before coding.",
    "group": "Places & Environment"
  },
  {
    "word": "River",
    "translation": "Río",
    "definition": "Corriente de agua",
    "example": "The river is clean.",
    "group": "Nature & Weather"
  },
  {
    "word": "Lake",
    "translation": "Lago",
    "definition": "Masa de agua estancada",
    "example": "Swim in the lake.",
    "group": "Nature & Weather"
  },
  {
    "word": "Sea",
    "translation": "Mar",
    "definition": "Agua salada",
    "example": "The sea is rough today.",
    "group": "Nature & Weather"
  },
  {
    "word": "Beach",
    "translation": "Playa",
    "definition": "Costa del mar",
    "example": "I want to code on the beach.",
    "group": "Nature & Weather"
  },
  {
    "word": "Weather",
    "translation": "Clima",
    "definition": "Estado atmosférico",
    "example": "The weather is nice.",
    "group": "Nature & Weather"
  },
  {
    "word": "Sunny",
    "translation": "Soleado",
    "definition": "Día con sol",
    "example": "It's a sunny day.",
    "group": "Nature & Weather"
  },
  {
    "word": "Cloudy",
    "translation": "Nublado",
    "definition": "Cielo con nubes",
    "example": "It's too cloudy to see stars.",
    "group": "Nature & Weather"
  },
  {
    "word": "Rainy",
    "translation": "Lluvioso",
    "definition": "Día con lluvia",
    "example": "A rainy day is perfect for coding.",
    "group": "Nature & Weather"
  },
  {
    "word": "Snowy",
    "translation": "Nevado",
    "definition": "Día con nieve",
    "example": "The snowy mountains look great.",
    "group": "Nature & Weather"
  },
  {
    "word": "Foggy",
    "translation": "Niebla",
    "definition": "Visibilidad reducida",
    "example": "The road is foggy.",
    "group": "Nature & Weather"
  },
  {
    "word": "Hot",
    "translation": "Caliente",
    "definition": "Alta temperatura",
    "example": "The CPU is too hot.",
    "group": "Nature & Weather"
  },
  {
    "word": "Warm",
    "translation": "Cálido",
    "definition": "Temperatura agradable",
    "example": "The water is warm.",
    "group": "Nature & Weather"
  },
  {
    "word": "Cool",
    "translation": "Fresco",
    "definition": "Moderadamente frío",
    "example": "Keep the servers in a cool room.",
    "group": "Nature & Weather"
  },
  {
    "word": "Cold",
    "translation": "Frío",
    "definition": "Baja temperatura",
    "example": "It is freezing cold outside.",
    "group": "Nature & Weather"
  },
  {
    "word": "Summer",
    "translation": "Verano",
    "definition": "Estación calurosa",
    "example": "We travel in summer.",
    "group": "Nature & Weather"
  },
  {
    "word": "Winter",
    "translation": "Invierno",
    "definition": "Estación fría",
    "example": "It snows in winter.",
    "group": "Nature & Weather"
  },
  {
    "word": "Spring",
    "translation": "Primavera",
    "definition": "Estación de flores",
    "example": "Spring is beautiful.",
    "group": "Nature & Weather"
  },
  {
    "word": "Autumn",
    "translation": "Otoño",
    "definition": "Caída de hojas",
    "example": "Leaves fall in autumn.",
    "group": "Nature & Weather"
  },
  {
    "word": "Head",
    "translation": "Cabeza",
    "definition": "Parte superior del cuerpo",
    "example": "My head hurts from debugging.",
    "group": "Body Parts"
  },
  {
    "word": "Hair",
    "translation": "Cabello",
    "definition": "Pelo en la cabeza",
    "example": "He has dark hair.",
    "group": "Body Parts"
  },
  {
    "word": "Face",
    "translation": "Cara",
    "definition": "Parte frontal",
    "example": "Wash your face.",
    "group": "Body Parts"
  },
  {
    "word": "Hands",
    "translation": "Manos",
    "definition": "Extremidades superiores",
    "example": "Keep your hands on the keyboard.",
    "group": "Body Parts"
  },
  {
    "word": "Legs",
    "translation": "Piernas",
    "definition": "Extremidades inferiores",
    "example": "Stretch your legs after coding.",
    "group": "Body Parts"
  },
  {
    "word": "Knees",
    "translation": "Rodillas",
    "definition": "Articulación de la pierna",
    "example": "My knees ache.",
    "group": "Body Parts"
  },
  {
    "word": "Skin",
    "translation": "Piel",
    "definition": "Órgano externo",
    "example": "Protect your skin.",
    "group": "Body Parts"
  },
  {
    "word": "Eyes",
    "translation": "Ojos",
    "definition": "Órgano de la vista",
    "example": "Use dark mode for your eyes.",
    "group": "Body Parts"
  },
  {
    "word": "Shoulders",
    "translation": "Hombros",
    "definition": "Unión del brazo",
    "example": "Relax your shoulders.",
    "group": "Body Parts"
  },
  {
    "word": "Shirt",
    "translation": "Camisa",
    "definition": "Prenda superior",
    "example": "I bought a new shirt.",
    "group": "Clothing"
  },
  {
    "word": "Skirt",
    "translation": "Falda",
    "definition": "Prenda inferior",
    "example": "She wore a skirt.",
    "group": "Clothing"
  },
  {
    "word": "Socks",
    "translation": "Medias",
    "definition": "Prenda para los pies",
    "example": "I need warm socks.",
    "group": "Clothing"
  },
  {
    "word": "Shoes",
    "translation": "Zapatos",
    "definition": "Calzado",
    "example": "Put your shoes on.",
    "group": "Clothing"
  },
  {
    "word": "Hat",
    "translation": "Sombrero",
    "definition": "Prenda para la cabeza",
    "example": "The sun is hot, wear a hat.",
    "group": "Clothing"
  },
  {
    "word": "Blouse",
    "translation": "Blusa",
    "definition": "Camisa de mujer",
    "example": "That blouse looks nice.",
    "group": "Clothing"
  },
  {
    "word": "Glasses",
    "translation": "Gafas",
    "definition": "Lentes para ver",
    "example": "I need my glasses to code.",
    "group": "Clothing"
  },
  {
    "word": "Jacket",
    "translation": "Chaqueta",
    "definition": "Prenda de abrigo",
    "example": "Wear a jacket, it's cold.",
    "group": "Clothing"
  },
  {
    "word": "Pot",
    "translation": "Olla",
    "definition": "Recipiente de cocina",
    "example": "Boil water in the pot.",
    "group": "Kitchenware"
  },
  {
    "word": "Knife",
    "translation": "Cuchillo",
    "definition": "Para cortar",
    "example": "Use a sharp knife.",
    "group": "Kitchenware"
  },
  {
    "word": "Fork",
    "translation": "Tenedor",
    "definition": "Utensilio de púas",
    "example": "Eat the salad with a fork.",
    "group": "Kitchenware"
  },
  {
    "word": "Spoon",
    "translation": "Cuchara",
    "definition": "Utensilio cóncavo",
    "example": "A spoon for the soup.",
    "group": "Kitchenware"
  },
  {
    "word": "Dish",
    "translation": "Plato",
    "definition": "Vajilla",
    "example": "Wash the dish.",
    "group": "Kitchenware"
  },
  {
    "word": "Bike",
    "translation": "Bicicleta",
    "definition": "Vehículo de dos ruedas",
    "example": "Ride a bike to work.",
    "group": "Transportation"
  },
  {
    "word": "Ship",
    "translation": "Barco",
    "definition": "Vehículo acuático",
    "example": "The ship is massive.",
    "group": "Transportation"
  },
  {
    "word": "Plane",
    "translation": "Avión",
    "definition": "Vehículo aéreo",
    "example": "I travel by plane.",
    "group": "Transportation"
  },
  {
    "word": "Car",
    "translation": "Carro",
    "definition": "Automóvil",
    "example": "Park the car.",
    "group": "Transportation"
  },
  {
    "word": "Train",
    "translation": "Tren",
    "definition": "Vehículo en rieles",
    "example": "Take the morning train.",
    "group": "Transportation"
  },
  {
    "word": "Today",
    "translation": "Hoy",
    "definition": "Día presente",
    "example": "Today is launch day.",
    "group": "Time"
  },
  {
    "word": "Yesterday",
    "translation": "Ayer",
    "definition": "Día anterior",
    "example": "I pushed the code yesterday.",
    "group": "Time"
  },
  {
    "word": "Ago",
    "translation": "Hace",
    "definition": "Tiempo pasado",
    "example": "It crashed two hours ago.",
    "group": "Time"
  },
  {
    "word": "Week",
    "translation": "Semana",
    "definition": "Siete días",
    "example": "Deploy once a week.",
    "group": "Time"
  },
  {
    "word": "Month",
    "translation": "Mes",
    "definition": "30 días aprox",
    "example": "Pay the server next month.",
    "group": "Time"
  },
  {
    "word": "Year",
    "translation": "Año",
    "definition": "365 días",
    "example": "It takes a year to master.",
    "group": "Time"
  },
  {
    "word": "Day",
    "translation": "Día",
    "definition": "24 horas",
    "example": "Have a nice day.",
    "group": "Time"
  },
  {
    "word": "Nowadays",
    "translation": "Hoy en día",
    "definition": "En la actualidad",
    "example": "Nowadays, everyone uses APIs.",
    "group": "Time"
  },
  {
    "word": "As soon as",
    "translation": "Tan pronto como",
    "definition": "Inmediatamente después",
    "example": "Run it as soon as possible.",
    "group": "Time"
  },
  {
    "word": "Hardly ever",
    "translation": "Casi nunca",
    "definition": "Frecuencia muy baja",
    "example": "I hardly ever use Internet Explorer.",
    "group": "Time"
  },
  {
    "word": "Soon",
    "translation": "Pronto",
    "definition": "En poco tiempo",
    "example": "The update comes out soon.",
    "group": "Time"
  },
  {
    "word": "Still",
    "translation": "Todavía",
    "definition": "Acción que continúa",
    "example": "It is still compiling.",
    "group": "Time"
  }
]
