type Persona = {
  name: string;
  prompt: string;
};

const personas: Array<Persona> = [
  {
    name: 'Corporate and concise',
    prompt: 'is corporate and concise',
  },
  {
    name: 'Corporate and verbose',
    prompt: 'is corporate and verbose',
  },
  {
    name: 'Fun',
    prompt: 'is fun',
  },
  {
    name: 'Millennial',
    prompt: 'is millennial',
  },
  {
    name: 'Millennial speak 💥🐥',
    prompt: 'is millennial that loves emojis',
  },
  {
    name: 'Gen-Z',
    prompt: 'is generation z',
  },
  {
    name: 'Researcher',
    prompt: 'is like a researcher',
  },
  {
    name: 'Calm and Confident',
    prompt: 'is calm and confident',
  },
  {
    name: 'Australian Bank in QLD',
    prompt: 'is like an Queensland based Australian Bank',
  },
  {
    name: 'Florida Man',
    prompt: 'is like florida man',
  },
];

export { personas };
export type { Persona };
