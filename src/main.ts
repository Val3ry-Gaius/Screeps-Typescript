import * as _ from "lodash";
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
  const minUpgraders = 10;
  const minBuilders = 10;

  if (harvesters.length < minHarvesters) {
    const newName = "Harvester" + Game.time;
    // console.log("Spawning new harvester: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
      { memory: { role: "harvester", task: "harvesting", source: "" } });
  } else if (upgraders.length < minUpgraders) {
    const newName = "Upgrader" + Game.time;
    // console.log("Spawning new upgrader: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
      { memory: { role: "upgrader", task: "harvesting" } });
  } else if (builders.length < minBuilders) {
    const newName = "Builder" + Game.time;
    // console.log("Spawning new builder: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
      { memory: { role: "builder", task: "harvesting" } });
  } else {
    const newName = "Builder" + Game.time;
    // console.log("Spawning new builder: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
      { memory: { role: "builder", task: "harvesting" } });
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
