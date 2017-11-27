import * as _ from "lodash";
import * as M from "./memory";
export const roleUpgrader = {

  run(creep: Creep): void {

    const sources = creep.room.find<Source>(FIND_SOURCES);

    if (!M.cm(creep).source) {
      for (const source in sources) {
        const upgraders = _.filter(Game.creeps, () => (
          M.cm(creep).role === "upgrader") && (
            M.cm(creep).source === source));
        if (upgraders.length !== 2) {
          M.cm(creep).source = source;
        }
      }
    }

    // const sources = creep.pos.findClosestByPath(FIND_SOURCES);
    const target = creep.room.controller as StructureController;
    const harvesting = () => {
      if (creep.harvest(sources[Number(M.cm(creep).source)]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[Number(M.cm(creep).source)], { visualizePathStyle: { stroke: "#ffaa00" } });
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
