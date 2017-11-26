export const roleHarvester = {

  run(creep: Creep): void {
    if (creep.carry.energy < creep.carryCapacity) {
      const sources = creep.room.find<Source>(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: "#ffaa00"}});
      }
    } else {
      const targets = creep.room.find<Structure>(FIND_STRUCTURES, {
        filter: (structure: StructureExtension | StructureSpawn | StructureTower) => {
          if (structure.structureType === STRUCTURE_EXTENSION || STRUCTURE_SPAWN || STRUCTURE_TOWER) {
            return structure.energy < structure.energyCapacity;
          } else {
            return false;
          }
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: "#ffffff"}});
        }
      }
    }
  }
};
