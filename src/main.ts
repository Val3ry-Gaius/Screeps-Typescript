import * as _ from "lodash";
import { buildScaledCreep } from "prototype.spawn";
import * as M from "./memory";
import { roleBuilder } from "./role.builder";
import { roleHarvester } from "./role.harvester";
import { roleUpgrader } from "./role.upgrader";
import { runTowers } from "./tower";

export function loop() {

  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory[name];
    }
  }

  // console.log(`Current tick is ${Game.time}`);
  const harvesters = _.filter(Game.creeps, (creep) => M.cm(creep).role === "harvester");
  const upgraders = _.filter(Game.creeps, (creep) => M.cm(creep).role === "upgrader");
  const builders = _.filter(Game.creeps, (creep) => M.cm(creep).role === "builder");
  const minHarvesters = 10;
  const minUpgraders = 5;
  const minBuilders = 5;
  const totalRoomEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;

  if (harvesters.length < minHarvesters) {
    const newName = "Harvester" + Game.time;
    // console.log("Spawning new harvester: " + newName);
    buildScaledCreep(totalRoomEnergy, newName, "harvester", "harvesting");
    if (buildScaledCreep(totalRoomEnergy, newName, "harvester", "harvesting") === ERR_NOT_ENOUGH_ENERGY &&
    harvesters.length === 0) {
      buildScaledCreep(200, newName, "harvester", "harvesting");
    } else {
      buildScaledCreep(totalRoomEnergy, newName, "harvester", "harvesting");
    }
  } else if (upgraders.length < minUpgraders) {
    const newName = "Upgrader" + Game.time;
    // console.log("Spawning new upgrader: " + newName);
    buildScaledCreep(totalRoomEnergy, newName, "upgrader", "harvesting");
  } else if (builders.length < minBuilders) {
    const newName = "Builder" + Game.time;
    // console.log("Spawning new builder: " + newName);
    buildScaledCreep(totalRoomEnergy, newName, "builder", "harvesting");
  } else {
    const newName = "Builder" + Game.time;
    // console.log("Spawning new builder: " + newName);
    buildScaledCreep(totalRoomEnergy, newName, "builder", "harvesting");
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
}
