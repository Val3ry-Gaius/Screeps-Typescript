import * as M from "./memory";
import { roleBuilder } from "./role.builder";
export const roleHarvester = {

  run(creep: Creep): void {
    const sources = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    const targetStoring = creep.room.find<Structure>(FIND_STRUCTURES, {
      filter: (structure: StructureExtension | StructureSpawn | StructureTower) => {
        if (structure.structureType === STRUCTURE_EXTENSION || STRUCTURE_SPAWN || STRUCTURE_TOWER) {
          return structure.energy < structure.energyCapacity;
        } else {
          return false;
        }
      }
    });
    const harvesting = () => {
      if (creep.harvest(sources as Source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources as Source, { visualizePathStyle: { stroke: "#ffaa00" } });
        // creep.say("🔄 harvest");
      }
    };
    const storing = () => {
      if (targetStoring.length > 0) {
      if (creep.transfer(targetStoring[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targetStoring[0], { visualizePathStyle: { stroke: "#ffffff" } });
        // creep.say("🔄 storing");
      }
    }
    };

    if (M.cm(creep).task === "storing" && creep.carry.energy === 0) {
      M.cm(creep).task = "harvesting";
    } else if (M.cm(creep).task === "harvesting" && creep.carry.energy === creep.carryCapacity) {
      M.cm(creep).task = "storing";
    } else if (targetStoring.length === 0) {
      M.cm(creep).task = "building";
    }

    if (M.cm(creep).task === "harvesting") {
      harvesting();
    } else if (M.cm(creep).task === "storing") {
      storing();
    } else if (M.cm(creep).task === "building") {
      roleBuilder.run(creep);
    }
  }
};
