export interface CreepMemory {
  [name: string]: any;
  role: string;
  task: string;
  sourceId: string;
  containerId: string;
}
export interface FlagMemory {
  [name: string]: any;
}
export interface SpawnMemory {
  [name: string]: any;
}
export interface RoomMemory {
  [name: string]: any;
}

export function cm(creep: Creep): CreepMemory {
  return creep.memory as CreepMemory;
}
