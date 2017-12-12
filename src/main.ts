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
  const listOfAllRoles = ["staticHarvester", "cargoCarrier", "harvester", "upgrader", "repairer", "builder"];

  for (const eachRm in allRms) {
    const curRm: Room | undefined = Game.rooms[eachRm]; console.log(JSON.stringify(curRm, null, 4));
    const curRmName = curRm.name; console.log(JSON.stringify(curRmName, null, 4));
    const allCurRmSources: Source[] = curRm.find<Source>(FIND_SOURCES);
    console.log(JSON.stringify(allCurRmSources, null, 4));
    const allCurRmCreeps: Creep[] = curRm.find<Creep>(FIND_MY_CREEPS);
    console.log(JSON.stringify(allCurRmCreeps, null, 4));
    const allCurRmSpawns: Spawn[] = _.filter(allSpawns, (spawn) => spawn.room.name === curRmName);
    console.log(JSON.stringify(allCurRmSpawns, null, 4));
    const maxCurRmEnergy: number = curRm.energyCapacityAvailable;
    console.log(JSON.stringify(maxCurRmEnergy, null, 4));
    const availableCurRmEnergy: number = curRm.energyAvailable;
    console.log(JSON.stringify(availableCurRmEnergy, null, 4));
    let availableCurRmStorageEnergy: number = 0;
    let maxCurRmStorageEnergy: number = 0;
    if (curRm.storage) {
      availableCurRmStorageEnergy = curRm.storage.store[RESOURCE_ENERGY];
      maxCurRmStorageEnergy = curRm.storage.storeCapacity;
    }
    console.log(JSON.stringify(availableCurRmStorageEnergy, null, 4));
    console.log(JSON.stringify(maxCurRmStorageEnergy, null, 4));
    const totalAvailableCurRmEnergy: number = availableCurRmEnergy + availableCurRmStorageEnergy;
    console.log(JSON.stringify(totalAvailableCurRmEnergy, null, 4));
    const allCurRmContainers: StructureContainer[] = curRm.find<StructureContainer>(FIND_STRUCTURES, {
      filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER
    });

    /*const allRoles: {} = {
      staticHarvester: allCurRmSources.length as number,
      cargoCarrier: allRmContainers.length as number,
      harvester: 2 as number,
      upgrader: 1 as number,
      repairer: 1 as number,
      builder: 1 as number
    };
    const allRolesKeys: string[] = Object.keys(allRoles);

    let numberOfCurRmCreeps = {};
    for (const role of allRolesKeys) {
        numberOfCurRmCreeps = role[_.sum(allCurRmCreeps, (creep) => M.cm(creep).role === role );
    }*/

    const allCurRmHarvesters = _.filter(Game.creeps, (creep) => M.cm(creep).role === "harvester");
    const allCurRmStaticHarvesters = _.filter(Game.creeps, (creep) => M.cm(creep).role === "staticHarvester");
    const allCurRmCargoCarriers = _.filter(Game.creeps, (creep) => M.cm(creep).role === "cargoCarrier");
    const allCurRmUpgraders = _.filter(Game.creeps, (creep) => M.cm(creep).role === "upgrader");
    const allCurRmBuilders = _.filter(Game.creeps, (creep) => M.cm(creep).role === "builder");
    const allCurRmRepairers = _.filter(Game.creeps, (creep) => M.cm(creep).role === "repairer");
    const minNoOfCurRmHarvesters = allCurRmSources.length - allCurRmStaticHarvesters.length;
    const minNoOfCurRmStaticHarvesters = allCurRmSources.length;
    const minNoOfCargoCarriers = allCurRmSources.length;
    const minNoOfCurRmUpgraders = 2;
    const minNoOfCurRmBuilders = 2;
    const minNoOfCurRmRepairers = 1;

    const initialTask = "harvesting";

    if (allCurRmStaticHarvesters.length === 0 &&
      availableCurRmEnergy < 900) {
      for (const indevSource of allCurRmSources) {
        const role = "harvester";
        buildScaledCreep(
          availableCurRmEnergy,
          role,
          initialTask,
          indevSource.id);
      }
    } else if (availableCurRmEnergy > 900 &&
      allCurRmStaticHarvesters.length < minNoOfCurRmStaticHarvesters) {
      for (const indevSource of allCurRmSources) {
        const sourceContainer = _.filter(allCurRmContainers, (c) =>
          c.pos.isNearTo(indevSource));
        const sourceContainerId = sourceContainer[0].id;
        if (!_.some(allCurRmCreeps, (creep: Creep) =>
          M.cm(creep).role === "staticHarvester" &&
          M.cm(creep).source === indevSource.id)) {
          if (sourceContainer.length > 0) {
            const roleSh = "staticHarvester";
            buildScaledCreep(
              maxCurRmEnergy,
              roleSh,
              initialTask,
              indevSource.id,
              sourceContainerId);
            if (!_.some(allCurRmCreeps, (creep: Creep) =>
              M.cm(creep).role === "cargoCarrier" &&
              M.cm(creep).containerId === sourceContainer[0].id)) {
              const roleCc = "cargoCarrier";
              buildScaledCreep(
                maxCurRmEnergy,
                roleCc,
                initialTask,
                indevSource.id,
                sourceContainerId);

            }
          }
        }
      }
    }

    if (allCurRmHarvesters.length === 0 && allCurRmCargoCarriers.length === 0) {
      if (allCurRmStaticHarvesters.length < allCurRmSources.length) {
        if (curRm.storage) {
          const storageEnoughEnergy = curRm.storage.store[RESOURCE_ENERGY] >= 150 + 550;
          if (storageEnoughEnergy) {
            const role = "hauler";
            buildScaledCreep(availableCurRmEnergy, role, initialTask);
          }
        }
      } else {
        const role = "harvester";
        buildScaledCreep(availableCurRmEnergy, role, initialTask);
      }
    } else {
      for (const indevSource of allCurRmSources) {
        if (!_.some(allCurRmCreeps, (creep: Creep) =>
          M.cm(creep).role === "staticHarvester" &&
          M.cm(creep).source === indevSource.id)) {
          const containers = indevSource.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
            filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER
          });
          if (containers.length > 0) {
            const role = "staticHarvester";
            const containerId = containers[0].id;
            buildScaledCreep(maxCurRmEnergy, role, initialTask, indevSource.id, containerId);
            break;
          }
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
