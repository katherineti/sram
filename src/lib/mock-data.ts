




export type Athlete = {
  id: number;
  nombres: string;
  apellidos: string;
  edad: number;
  escuela: string;
  cinturon: string;
  ranking: number;
  cedula: string;
  oro: number;
  plata: number;
  bronce: number;
  logoUrl?: string;
  registrationDate: string; // ISO 8601 date string
};

export type School = {
  value: string;
  label: string;
  logoUrl?: string;
};

export type KarateEvent = {
    id: string;
    name: string;
    description: string;
    date: Date;
    location: string;
    type: 'competencia' | 'seminario' | 'exhibicion';
    status: 'programado' | 'en-curso' | 'finalizado' | 'cancelado';
};

export const schools: School[] = [
  { value: 'antonio-diaz-dojo', label: 'Antonio Díaz Dojo', logoUrl: 'https://storage.googleapis.com/proudcity/antoniokenpo/uploads/2020/07/antonio-diaz-logo.png' },
  { value: 'shito-ryu-karate', label: 'Shito-Ryu Karate', logoUrl: 'https://www.shitokai.com/images/logo_ishimi_shitoryu_karatedo.jpg' },
  { value: 'dojo-okinawa', label: 'Dojo Okinawa', logoUrl: 'https://dojookinawa.com/wp-content/uploads/2020/03/logo-okinawa-min.png' },
  { value: 'bushido-vzla', label: 'Bushido Vzla', logoUrl: 'https://bushidovzla.files.wordpress.com/2016/09/cropped-bushido-vzla-logo-300.png' },
  { value: 'shotokan-caracas', label: 'Shotokan Caracas', logoUrl: 'https://www.oskivenezuela.com/wp-content/uploads/2016/02/logo_oskil.png' },
  { value: 'gensei-ryu-miranda', label: 'Gensei-Ryu Miranda', logoUrl: 'https://www.genseiryu.com.ve/images/logo.png' },
  { value: 'wado-ryu-valencia', label: 'Wado-Ryu Valencia' },
  { value: 'kyokushin-maracay', label: 'Kyokushin Maracay', logoUrl: 'https://www.ikakvenezuela.com/images/logo-iko-kyokushinkaikan-venezuela.png' },
  { value: 'shorin-ryu-barquisimeto', label: 'Shorin-Ryu Barquisimeto', logoUrl: 'https://www.kobayashikaratedo.com/images/logos/logo-kobayashi-ryu-kyudokan-de-venezuela.png' },
  { value: 'goju-ryu-merida', label: 'Goju-Ryu Mérida', logoUrl: 'https://gojuryu.org.ve/wp-content/uploads/2021/08/LOGO-OGKK-DE-VENEZUELA-version-final-transparente-296x300.png' },
  { value: 'isshin-ryu-san-cristobal', label: 'Isshin-Ryu San Cristóbal', logoUrl: 'https://i.pinimg.com/736x/8f/9a/c6/8f9ac653856b68260b94427500d4586d.jpg' },
  { value: 'kenpo-karate-zulia', label: 'Kenpo Karate Zulia', logoUrl: 'https://static.wixstatic.com/media/2513f5_0710b656336a4329b350711939cb4594~mv2.png/v1/fill/w_260,h_260,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Original.png' },
  { value: 'ryuei-ryu-anzoategui', label: 'Ryuei-Ryu Anzoátegui', logoUrl: 'https://www.ryueiryu.com/en/common/images/h_logo.gif' },
  { value: 'shudokan-bolivar', label: 'Shudokan Bolívar', logoUrl: 'https://shudokan.com.ve/wp-content/uploads/2020/09/logo-shudokan-3.png' },
  { value: 'yoshukai-sucre', label: 'Yoshukai Sucre', logoUrl: 'https://yoshukai.org/wp-content/uploads/2019/11/YK-Logo-Web-Transparent.png' },
];

const firstNames = ['Pedro', 'Ana', 'Carlos', 'Valentina', 'Luis', 'Mariana', 'Diego', 'Camila', 'Andrés', 'Sofía', 'Juan', 'Gabriela', 'Elena', 'John', 'Daniel', 'Lucía', 'Mateo', 'Isabella', 'Javier', 'Valeria', 'Ricardo', 'Paula', 'Miguel', 'Daniela', 'Alejandro'];
const lastNames = ['Salas', 'González', 'Hernández', 'Romero', 'Martínez', 'Pinto', 'Suárez', 'López', 'García', 'Méndez', 'Ramírez', 'Rojas', 'Williams', 'Smith', 'Díaz', 'Moreno', 'Castillo', 'Peña', 'Acosta', 'Gil', 'Soto', 'Rivas', 'Alvarez', 'Torres', 'Mendoza'];
const belts = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Púrpura", "Marrón", "Negro"];

const generateAthletes = (year: number, count: number): Athlete[] => {
  const generated: Athlete[] = [];
  for (let i = 1; i <= count; i++) {
    const school = schools[i % schools.length];
    const rankingPoints = 1500 - (i * 70) + (i * 5);
    
    // Ensure top 3 have more gold medals
    let oro = 0;
    if (i <= 10) oro = Math.max(0, 10 - i);
    if (i === 1) oro = 10;
    if (i === 2) oro = 8;
    if (i === 3) oro = 6;
    
    const plata = (15 - i) % 5;
    const bronce = (15 - i) % 4;
    
    generated.push({
      id: (year * 100) + i,
      nombres: firstNames[i % firstNames.length],
      apellidos: lastNames[i % lastNames.length],
      edad: 10 + (i % 15),
      escuela: school.label,
      cinturon: belts[i % belts.length],
      ranking: rankingPoints,
      cedula: `${20 + (i % 10)}${100000 + i}`,
      oro: oro,
      plata: plata,
      bronce: bronce,
      logoUrl: school.logoUrl,
      registrationDate: `${year}-${(i % 12) + 1}-${(i % 28) + 1}T10:00:00Z`,
    });
  }
  return generated;
};


const athletes2025 = generateAthletes(2025, 50);
const athletes2024 = generateAthletes(2024, 25);
const athletes2023 = generateAthletes(2023, 25);
const athletes2022 = generateAthletes(2022, 25);


export const athletes: Athlete[] = [
    ...athletes2025,
    ...athletes2024,
    ...athletes2023,
    ...athletes2022
];

export const events: KarateEvent[] = [
    {
        id: 'evt-001',
        name: 'Campeonato Nacional Juvenil',
        description: 'El campeonato nacional que reúne a los mejores talentos juveniles del país.',
        date: new Date(new Date().getFullYear(), 7, 15),
        location: 'Caracas, Distrito Capital',
        type: 'competencia',
        status: 'programado',
    },
    {
        id: 'evt-002',
        name: 'Seminario con Antonio Díaz',
        description: 'Oportunidad única para aprender del múltiple campeón mundial de kata.',
        date: new Date(new Date().getFullYear(), 8, 5),
        location: 'Valencia, Carabobo',
        type: 'seminario',
        status: 'programado',
    },
     {
        id: 'evt-002-repeat',
        name: 'Seminario con Antonio Díaz',
        description: 'Oportunidad única para aprender del múltiple campeón mundial de kata.',
        date: new Date(new Date().getFullYear(), 8, 6),
        location: 'Valencia, Carabobo',
        type: 'seminario',
        status: 'programado',
    },
    {
        id: 'evt-003',
        name: 'Torneo "Copa Bushido"',
        description: 'Competencia abierta para todas las categorías en la modalidad de kumite.',
        date: new Date(new Date().getFullYear(), 6, 20),
        location: 'Maracay, Aragua',
        type: 'competencia',
        status: 'en-curso',
    },
    {
        id: 'evt-004',
        name: 'Copa Internacional Simón Bolívar',
        description: 'Prestigioso torneo con participación de atletas de toda Latinoamérica.',
        date: new Date(new Date().getFullYear() - 1, 10, 10),
        location: 'Caracas, Distrito Capital',
        type: 'competencia',
        status: 'finalizado',
    },
    {
        id: 'evt-005',
        name: 'Exhibición de Artes Marciales',
        description: 'Muestra de las diferentes disciplinas de artes marciales practicadas en el país.',
        date: new Date(new Date().getFullYear(), 5, 1),
        location: 'Barquisimeto, Lara',
        type: 'exhibicion',
        status: 'finalizado',
    },
    {
        id: 'evt-006',
        name: 'Campamento de Verano',
        description: 'Campamento intensivo de entrenamiento para atletas de alto rendimiento.',
        date: new Date(new Date().getFullYear(), 7, 1),
        location: 'Mérida, Mérida',
        type: 'seminario',
        status: 'programado',
    },
     {
        id: 'evt-007',
        name: 'Torneo Regional de Los Andes',
        description: 'Competencia para los dojos de la región andina.',
        date: new Date(new Date().getFullYear(), 9, 26),
        location: 'San Cristóbal, Táchira',
        type: 'competencia',
        status: 'programado',
    },
    {
        id: 'evt-008',
        name: 'Examen de Grado Dan',
        description: 'Examen de grado para aspirantes a cinturón negro y danes superiores.',
        date: new Date(new Date().getFullYear(), 11, 7),
        location: 'Caracas, Distrito Capital',
        type: 'seminario',
        status: 'programado',
    },
     {
        id: 'evt-009',
        name: 'Campeonato Estadal de Karate',
        description: 'El campeonato que reúne a los mejores talentos del estado.',
        date: new Date(new Date().getFullYear(), 4, 15),
        location: 'Caracas, Distrito Capital',
        type: 'competencia',
        status: 'finalizado',
    },
    {
        id: 'evt-010',
        name: 'Campeonato Nacional Infantil',
        description: 'El campeonato que reúne a los mejores talentos infantiles del país.',
        date: new Date(new Date().getFullYear(), 2, 15),
        location: 'Caracas, Distrito Capital',
        type: 'competencia',
        status: 'cancelado',
    },
    {
        id: 'evt-011',
        name: 'Curso de Arbitraje',
        description: 'Curso de formación y actualización para árbitros de karate.',
        date: new Date(new Date().getFullYear(), 6, 10),
        location: 'Online',
        type: 'seminario',
        status: 'programado',
    },
    {
        id: 'evt-012',
        name: 'Gasshuku Nacional de Verano',
        description: 'Encuentro nacional para entrenamiento conjunto y convivencia.',
        date: new Date(new Date().getFullYear(), 7, 25),
        location: 'Higuerote, Miranda',
        type: 'seminario',
        status: 'programado',
    },
    {
        id: 'evt-013',
        name: 'Competencia de Kata y Kumite',
        description: 'Competencia interna del Dojo Okinawa.',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
        location: 'Dojo Okinawa',
        type: 'competencia',
        status: 'programado',
    },
    {
        id: 'evt-014',
        name: 'Exhibición Aniversario',
        description: 'Celebración del aniversario de Shito-Ryu Karate.',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
        location: 'Shito-Ryu Karate',
        type: 'exhibicion',
        status: 'programado',
    },
    {
        id: 'evt-015',
        name: 'Seminario de Defensa Personal',
        description: 'Taller práctico de técnicas de defensa personal.',
        date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
        location: 'Gimnasio Municipal',
        type: 'seminario',
        status: 'programado',
    }
];
