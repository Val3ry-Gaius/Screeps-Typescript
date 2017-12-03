import * as _ from "lodash";
import { roleBuilder } from "role.builder";
import * as M from "./memory";
export const roleRepairer = {

  run(creep: Creep): void {

    const sources = creep.room.find<Source>(FIND_SOURCES);

    // const sources = creep.pos.findClosestByPath(FIND_SOURCES);
    const targetRepair = creep.pos.findClosestByPath<Structure>(FIND_STRUCTURES, {
      filter: (structure: Structure) => structure.hits < structure.hitsMax &&
        structure.structureType !== STRUCTURE_WALL
    });

    const harvesting = () => {
      if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], { visualizePathStyle: { stroke: "#ffaa00" } });
        // creep.say("🔄 harvest");
      }
    };
    const repairing = () => {
      if (targetRepair) {
        if (creep.repair(targetRepair) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targetRepair, { visualizePathStyle: { stroke: "#ffffff" } });
          // creep.say("🔄 upgrade");
        }
      } else {
        M.cm(creep).task = "building";
      }
    };

    if (M.cm(creep).task === "repairing" && creep.carry.energy === 0) {
      M.cm(creep).task = "harvesting";
    } else if (M.cm(creep).task === "harvesting" && creep.carry.energy === creep.carryCapacity) {
      M.cm(creep).task = "repairing";
    } else if (M.cm(creep).task === "building") {
      roleBuilder.run(creep);
    }

    if (M.cm(creep).task === "harvesting") {
      harvesting();
    } else if (M.cm(creep).task === "repairing") {
      repairing();
    } else if (M.cm(creep).task === "building") {
      roleBuilder.run(creep);
    }
  }
};
