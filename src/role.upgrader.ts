import * as _ from "lodash";
import * as M from "./memory";
export const roleUpgrader = {

  run(creep: Creep): void {

    const sources = creep.room.find<Source>(FIND_SOURCES);

    // const sources = creep.pos.findClosestByPath(FIND_SOURCES);
    const target = creep.room.controller as StructureController;
    const harvesting = () => {
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
        // creep.say("🔄 harvest");
      }
    };
    const upgrading = () => {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        // creep.say("🔄 upgrade");
      }
    };

    if (M.cm(creep).task === "upgrading" && creep.carry.energy === 0) {
      M.cm(creep).task = "harvesting";
    } else if (M.cm(creep).task === "harvesting" && creep.carry.energy === creep.carryCapacity) {
      M.cm(creep).task = "upgrading";
    }

    if (M.cm(creep).task === "harvesting") {
      harvesting();
    } else if (M.cm(creep).task === "upgrading") {
      upgrading();
    }
  }
};
