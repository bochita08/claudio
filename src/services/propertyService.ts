import { AGENTS, getAgentById } from '../data/agents';
import { PROPERTIES, getPropertyById } from '../data/properties';
import { Agent, Property, SortKey, TypeFilter } from '../types';
import { ApiError, networkDelay } from './api';

export interface PropertyQuery {
  sort?: SortKey;
  type?: TypeFilter;
  search?: string;
}

function applySort(list: Property[], sort?: SortKey): Property[] {
  const copy = [...list];
  switch (sort) {
    case 'price_asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'area_asc':
      return copy.sort((a, b) => a.area - b.area);
    case 'area_desc':
      return copy.sort((a, b) => b.area - a.area);
    case 'bedrooms_desc':
      return copy.sort((a, b) => b.bedrooms - a.bedrooms);
    case 'bathrooms_desc':
      return copy.sort((a, b) => b.bathrooms - a.bathrooms);
    default:
      return copy;
  }
}

/** Filtro + orden puros: reutilizables tambien en el cliente sin ir al service. */
export function filterAndSort(list: Property[], query: PropertyQuery): Property[] {
  let result = list;
  if (query.type && query.type !== 'Todos') {
    result = result.filter((p) => p.type === query.type);
  }
  if (query.search && query.search.trim()) {
    const s = query.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.address.toLowerCase().includes(s) ||
        p.city.toLowerCase().includes(s),
    );
  }
  return applySort(result, query.sort);
}

export const propertyService = {
  async list(query: PropertyQuery = {}): Promise<Property[]> {
    await networkDelay(400);
    return filterAndSort(PROPERTIES, query);
  },

  async getById(id: string): Promise<Property> {
    await networkDelay(300);
    const property = getPropertyById(id);
    if (!property) {
      throw new ApiError('NOT_FOUND', 'No encontramos la propiedad.');
    }
    return property;
  },

  async getAgent(agentId: string): Promise<Agent> {
    await networkDelay(200);
    const agent = getAgentById(agentId);
    if (!agent) {
      throw new ApiError('NOT_FOUND', 'No encontramos el agente.');
    }
    return agent;
  },

  listAgents(): Agent[] {
    return AGENTS;
  },
};
