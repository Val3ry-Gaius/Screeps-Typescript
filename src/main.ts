import * as _ from "lodash";
import { buildScaledCreep } from "prototype.spawn";
import { roleRepairer } from "role.repairer";
import * as M from "./memory";
import { roleBuilder } from "./role.builder";
import { roleHarvester } from "./role.harvester";
import { roleUpgrader } from "./role.upgrader";
import { runTowers } from "./tower";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = () => {
  // console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  const allSpawns = Game.spawns;
  const allRms = Game.rooms;

  for (const eachRm in allRms) {
    const curRm: Room | undefined = Game.rooms[eachRm];
    console.log(JSON.stringify(curRm, null, 4));

    const curRmName = curRm.name;
    console.log(JSON.stringify(curRmName, null, 4));

    const allRmSources = curRm.find<Source>(FIND_SOURCES);
    console.log(JSON.stringify(allRmSources, null, 4));

    const allRmCreeps = curRm.find<Creep>(FIND_MY_CREEPS);
    console.log(JSON.stringify(allRmCreeps, null, 4));

    const curRmSpawns = _.filter(allSpawns, (spawn) => spawn.room.name === curRmName);
    console.log(JSON.stringify(curRmSpawns, null, 4));

    const maxRmEnergy = curRm.energyCapacityAvailable;
    console.log(JSON.stringify(maxRmEnergy, null, 4));
    const availableRmEnergy = curRm.energyAvailable;
    console.log(JSON.stringify(availableRmEnergy, null, 4));

    const allHarvesters = _.filter(Game.creeps, (creep) => M.cm(creep).role === "harvester");
    const allStaticHarvesters = _.filter(Game.creeps, (creep) => M.cm(creep).role === "staticHarvester");
    const allHaulers = _.filter(Game.creeps, (creep) => M.cm(creep).role === "hauler");
    const allUpgraders = _.filter(Game.creeps, (creep) => M.cm(creep).role === "upgrader");
    const allBuilders = _.filter(Game.creeps, (creep) => M.cm(creep).role === "builder");
    const allRepairers = _.filter(Game.creeps, (creep) => M.cm(creep).role === "repairer");
    const minNoOfHarvesters = 2;
    // const minNoOfStaticHarvesters = 2;
    // const minNoOfHaulers = 2;
    const minNoOfUpgraders = 2;
    const minNoOfBuilders = 2;
    const minNoOfRepairers = 1;

    const initialTask = "harvesting";

    if (allHarvesters.length === 0 && allHaulers.length === 0) {
      if (allStaticHarvesters.length > 0) {
        if (curRm.storage) {
          const storageEnoughEnergy = curRm.storage.store[RESOURCE_ENERGY] >= 150 + 550;
          if (storageEnoughEnergy) {
            const role = "hauler";
            buildScaledCreep(availableRmEnergy, role, initialTask);
          }
        }
      } else {
        const role = "harvester";
        buildScaledCreep(availableRmEnergy, role, initialTask, indevSource.id);
      }
    } else {
      for (const indevSource of allRmSources) {
        if (!_.some(allRmCreeps, (creep: Creep) =>
          M.cm(creep).role === "staticHarvester" &&
          M.cm(creep).source === indevSource.id)) {
          const containers = indevSource.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
            filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER
          });
          if (containers.length > 0) {
            const role = "staticHarvester";
            const containerId = containers[0].id;
            buildScaledCreep(maxRmEnergy, role, initialTask, indevSource.id, containerId);
            break;
          }
        }
      }

    }

    /*for (const source of allRmSources) {
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
  }*/
    const totalRoomEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;
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
      // console.log("Spawning new harvester: " + newName);
      if (buildScaledCreep(totalRoomEnergy, "harvester", "harvesting") === ERR_NOT_ENOUGH_ENERGY &&
        harvesters.length === 0) {
        buildScaledCreep(200, "harvester", "harvesting");
      } else {
        buildScaledCreep(totalRoomEnergy, "harvester", "harvesting");
      }
    } else if (upgraders.length < minUpgraders) {
      // console.log("Spawning new upgrader: " + newName);
      buildScaledCreep(totalRoomEnergy, "upgrader", "harvesting");
    } else if (builders.length < minBuilders) {
      // console.log("Spawning new builder: " + newName);
      buildScaledCreep(totalRoomEnergy, "builder", "harvesting");
    } else if (repairers.length < minRepairers) {
      // console.log("Spawning new Repairer: " + newName);
      buildScaledCreep(totalRoomEnergy, "repairer", "harvesting");
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
    /*const towers: Tower[] = Game.rooms.W34N12.find<StructureTower>(FIND_STRUCTURES, {
      filter: (s: StructureTower) => s.structureType === STRUCTURE_TOWER
    });
    for (const tower of towers) {
      const target: Creep | null = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (target) {
        tower.attack(target);
      }
    }*/
  };
