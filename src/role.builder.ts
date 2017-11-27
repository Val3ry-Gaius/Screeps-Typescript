import * as _ from "lodash";
import * as M from "./memory";
import { roleHarvester } from "./role.harvester";
import { roleUpgrader } from "./role.upgrader";

export const roleBuilder = {

  run(creep: Creep): void {
    const sources = creep.room.find<Source>(FIND_SOURCES);

    if (!M.cm(creep).source) {
      for (const source in sources) {
        const builders = _.filter(Game.creeps, () => (
          M.cm(creep).role === "builder") && (
            M.cm(creep).source === source));
        const totalBuilders = _.filter(Game.creeps, () =>
          M.cm(creep).role === "builder");
        if (builders.length !== (Math.ceil(totalBuilders.length / 2))) {
          M.cm(creep).source = source;
        }
      }
    }

    // const sources = creep.pos.findClosestByPath(FIND_SOURCES);
    const targetConsSite = creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
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
    const building = () => {
      if (targetConsSite.length > 0) {
        if (creep.build(targetConsSite[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targetConsSite[0], { visualizePathStyle: { stroke: "#ffffff" } });
          // creep.say("🔄 build");
        }
      } else if (targetStoring.length > 0) {
        M.cm(creep).task = "storing";
      } else {
        M.cm(creep).task = "upgrading";
      }
    };

    if (M.cm(creep).task === "building" && creep.carry.energy === 0) {
      M.cm(creep).task = "harvesting";
    } else if (M.cm(creep).task === "harvesting" && creep.carry.energy === creep.carryCapacity) {
      M.cm(creep).task = "building";
    }

    if (M.cm(creep).task === "harvesting") {
      harvesting();
    } else if (M.cm(creep).task === "building") {
      building();
    } else if (M.cm(creep).task === "storing") {
      roleHarvester.run(creep);
    } else if (M.cm(creep).task === "upgrading") {
      roleUpgrader.run(creep);
    }
  }
};
