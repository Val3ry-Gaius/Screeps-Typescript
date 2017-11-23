const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");

export function loop() {

  // Clear non-existing creep memory.
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory[name];
    }
  }

  console.log(`Current tick is ${Game.time}`);

  let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === "harvester");
  console.log("Harvesters: " + harvesters.length);

  if (harvesters.length < 2) {
    let newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName,
      { memory: { role: "harvester" } });
  }

  if (Game.spawns.Spawn1.spawning) {
    const spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];
    Game.spawns.Spawn1.room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns.Spawn1.pos.x + 1,
      Game.spawns.Spawn1.pos.y,
      { align: "left", opacity: 0.8 });
  }

  for(let name in Game.creeps) {
    const creep = Game.creeps[name];
    if(creep.memory.role === "harvester") {
      roleHarvester.run(creep);
    }
    if(creep.memory.role === "upgrader") {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role === "builder") {
      roleBuilder.run(creep);
    }
  }
}
}
