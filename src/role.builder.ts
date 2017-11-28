import * as _ from "lodash";
import * as M from "./memory";
import { roleUpgrader } from "./role.upgrader";

export const roleBuilder = {

  run(creep: Creep): void {
    const sources = creep.room.find<Source>(FIND_SOURCES);

    // const sources = creep.pos.findClosestByPath(FIND_SOURCES);
    const targetConsSite = creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
    const targetRepair = creep.room.find<Structure>(FIND_STRUCTURES, {
      filter: (s: Structure) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
    });

    const harvesting = () => {
      if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], { visualizePathStyle: { stroke: "#ffaa00" } });
        // creep.say("🔄 harvest");
      }
    };
    const building = () => {
      if (targetConsSite.length > 0) {
        if (creep.build(targetConsSite[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targetConsSite[0], { visualizePathStyle: { stroke: "#ffffff" } });
          // creep.say("🔄 build");
        }
      } else {
        M.cm(creep).task = "repairing";
      }
    };
    const repairing = () => {
      if (targetRepair.length > 0) {
        if (creep.repair(targetRepair[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targetRepair[0], { visualizePathStyle: { stroke: "#ffffff" } });
          // creep.say("🔄 repair");
        }
      } else {
        M.cm(creep).task = "upgrading";
      }
    };

    if (M.cm(creep).task === "building" ||
        M.cm(creep).task === "repairing" &&
        creep.carry.energy === 0) {
      M.cm(creep).task = "harvesting";
    } else if (M.cm(creep).task === "harvesting" && creep.carry.energy === creep.carryCapacity) {
      M.cm(creep).task = "building";
    }

    if (M.cm(creep).task === "harvesting") {
      harvesting();
    } else if (M.cm(creep).task === "building") {
      building();
    } else if (M.cm(creep).task === "repairing") {
      repairing();
    } else if (M.cm(creep).task === "upgrading") {
      roleUpgrader.run(creep);
    }
  }
};
