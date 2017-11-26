import * as M from "./memory";

export const roleBuilder = {

  run(creep: Creep) {
    if (M.cm(creep).building && creep.carry.energy === 0) {
      M.cm(creep).building = false;
      creep.say("🔄 harvest");
    }
    if (!M.cm(creep).building && creep.carry.energy === creep.carryCapacity) {
      M.cm(creep).building = true;
      creep.say("🚧 build");
    }
    if (M.cm(creep).building) {
      const targets = creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } }
          );
        }
      }
    } else {
      const sources = creep.room.find<Source>(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } }
        );
      }
    }
  }
};
