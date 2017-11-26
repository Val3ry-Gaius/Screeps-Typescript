export const roleUpgrader = {

  run(creep: Creep): void {
    if (creep.carry.energy < creep.carryCapacity) {
      const sources = creep.room.find<Source>(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: "#ffaa00"}});
      }
    } else {
      const targets = creep.room.controller as StructureController;
      if (creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets, {visualizePathStyle: {stroke: "#ffffff"}});
        }
    }
  }
};
