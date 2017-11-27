import * as _ from "lodash";
import * as M from "./memory";
import { roleBuilder } from "./role.builder";
export const roleHarvester = {

  run(creep: Creep): void {

    const sources = creep.room.find<Source>(FIND_SOURCES);

    if (!M.cm(creep).source) {
      for (const source in sources) {
        const harvesters = _.filter(Game.creeps, () => (
          M.cm(creep).role === "harvester") && (
            M.cm(creep).source === source));
        if (harvesters.length !== 2) {
          M.cm(creep).source = source;
        }
      }
    }

    // const sources = creep.pos.findClosestByPath(FIND_SOURCES);
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
      if (creep.harvest(sources[Number(M.cm(creep).source)]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[Number(M.cm(creep).source)], { visualizePathStyle: { stroke: "#ffaa00" } });
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
    } else if (!targetStoring) {
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
