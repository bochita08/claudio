import { Agent } from '../types';

export const AGENTS: Agent[] = [
  {
    id: 'ag-1',
    name: 'Lucía Fernández',
    phone: '+541145550101',
    email: 'lucia.fernandez@propplus.com',
    photo: 'https://i.pravatar.cc/300?img=47',
    agency: 'PROP+ Palermo',
    license: 'CUCICBA 5821',
  },
  {
    id: 'ag-2',
    name: 'Martín Gómez',
    phone: '+541145550202',
    email: 'martin.gomez@propplus.com',
    photo: 'https://i.pravatar.cc/300?img=12',
    agency: 'PROP+ Núñez',
    license: 'CUCICBA 6410',
  },
  {
    id: 'ag-3',
    name: 'Sofía Ramírez',
    phone: '+541145550303',
    email: 'sofia.ramirez@propplus.com',
    photo: 'https://i.pravatar.cc/300?img=32',
    agency: 'PROP+ Caballito',
    license: 'CUCICBA 7233',
  },
];

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}
