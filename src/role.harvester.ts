import * as _ from "lodash";
import * as M from "./memory";
import { roleBuilder } from "./role.builder";
export const roleHarvester = {

  run(creep: Creep): void {

    const sources = creep.room.find<Source>(FIND_SOURCES);

    // const sources = creep.pos.findClosestByPath(FIND_SOURCES);
    const targetStoring = creep.room.find<Structure>(FIND_STRUCTURES, {
      filter: (structure: StructureExtension | StructureSpawn | StructureTower | StructureStorage) => {
        if (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_TOWER) {
          return structure.energy < structure.energyCapacity;
        } else if (structure.structureType === STRUCTURE_STORAGE) {
          return _.sum(structure.store) < structure.storeCapacity;
          } else {
          return false;
        }
      }
    });
    const harvesting = () => {
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
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
    }

    if (M.cm(creep).task === "harvesting") {
      harvesting();
    } else if (M.cm(creep).task === "storing") {
      storing();
    }
  }
};
