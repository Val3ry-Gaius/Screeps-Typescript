import * as _ from "lodash";
import { buildScaledCreep } from "prototype.spawn";
import { roleRepairer } from "role.repairer";
import { ErrorMapper } from "utils/ErrorMapper";
import * as M from "./memory";
import { roleBuilder } from "./role.builder";
import { roleHarvester } from "./role.harvester";
import { roleUpgrader } from "./role.upgrader";
import { runTowers } from "./tower";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const spawns = Game.rooms.room.find<Spawn>(FIND_MY_SPAWNS);
  const allRooms = Game.rooms.room;
  const sources = allRooms.find<Source>(FIND_SOURCES);
  const creepsTotalInRoom = allRooms.find<Creep>(FIND_MY_CREEPS);
  const totalRoomEnergy = allRooms.energyCapacityAvailable;
  for (const source of sources) {
    if (_.some(creepsTotalInRoom, (creep: Creep) =>
    M.cm(creep).role === "staticHarvester" &&
    M.cm(creep).source === source.id)) {
      const containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER
      });
      if (containers.length > 0) {
        const assignedRole = "staticHarvester";
        const newName = assignedRole + Game.time;
        buildScaledCreep(totalRoomEnergy, newName, assignedRole, "harvesting", source.id);
      }
    }
}

  // console.log(`Current tick is ${Game.time}`);
  // const totalHarvesters = +(M.cm(Game.creeps.creep).role === "harvester");
  const harvesters = _.filter(Game.creeps, (creep) => M.cm(creep).role === "harvester");
  const upgraders = _.filter(Game.creeps, (creep) => M.cm(creep).role === "upgrader");
  const builders = _.filter(Game.creeps, (creep) => M.cm(creep).role === "builder");
  const repairers = _.filter(Game.creeps, (creep) => M.cm(creep).role === "repairer");
  const minHarvesters = 2;
  const minUpgraders = 2;
  const minBuilders = 2;
  const minRepairers = 1;

  if (harvesters.length < minHarvesters) {
    const newName = "Harvester" + Game.time;
    // console.log("Spawning new harvester: " + newName);
    if (buildScaledCreep(totalRoomEnergy, newName, "harvester", "harvesting", "") === ERR_NOT_ENOUGH_ENERGY &&
      harvesters.length === 0) {
      buildScaledCreep(200, newName, "harvester", "harvesting", "");
    } else {
      buildScaledCreep(totalRoomEnergy, newName, "harvester", "harvesting", "");
    }
  } else if (upgraders.length < minUpgraders) {
    const newName = "Upgrader" + Game.time;
    // console.log("Spawning new upgrader: " + newName);
    buildScaledCreep(totalRoomEnergy, newName, "upgrader", "harvesting", "");
  } else if (builders.length < minBuilders) {
    const newName = "Builder" + Game.time;
    // console.log("Spawning new builder: " + newName);
    buildScaledCreep(totalRoomEnergy, newName, "builder", "harvesting", "");
  } else if (repairers.length < minRepairers) {
    const newName = "Repairer" + Game.time;
    // console.log("Spawning new Repairer: " + newName);
    buildScaledCreep(totalRoomEnergy, newName, "repairer", "harvesting", "");
  }

  if (Game.spawns.Spawn1.spawning) {
    const spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];
    Game.spawns.Spawn1.room.visual.text(
      "🛠️",
      Game.spawns.Spawn1.pos.x + 1,
      Game.spawns.Spawn1.pos.y,
      { align: "left", opacity: 0.8 });
  }
  // require('role.' + creep.memory.role).run(creep);
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (M.cm(creep).role === "harvester") {
      roleHarvester.run(creep);
    }
    if (M.cm(creep).role === "upgrader") {
      roleUpgrader.run(creep);
    }
    if (M.cm(creep).role === "builder") {
      roleBuilder.run(creep);
    }
    if (M.cm(creep).role === "repairer") {
      roleRepairer.run(creep);
    }
  }
  // runTowers.run(Game.rooms.room);
  const towers: Tower[] = Game.rooms.W34N12.find<StructureTower>(FIND_STRUCTURES, {
    filter: (s: StructureTower) => s.structureType === STRUCTURE_TOWER
  });
  for (const tower of towers) {
    const target: Creep | null = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
      tower.attack(target);
    }
  }
});
