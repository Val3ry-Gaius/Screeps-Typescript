export const runTowers = {
  run(room: Room): void {
    console.log("here");
    const towers: Tower[] = room.find<Tower>(FIND_STRUCTURES, {
      filter: (s: Tower) => s.structureType === STRUCTURE_TOWER
    });
    console.log("here2");
    const target = room.find<Creep>(FIND_HOSTILE_CREEPS);
    console.log("here3");
    towers.forEach((tower: Tower) => {
      console.log("here4");
      /*if (target.length > 0) {
        tower.attack(target[0]);
      } else if (tower.energy > (tower.energyCapacity / 2)) {*/
      const targetRepair = tower.pos.findInRange<Structure>(FIND_STRUCTURES, 30, {
        filter: (s: Structure) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
      });
      console.log("here5");
      if (targetRepair.length > 0) {
        console.log("here6");
        targetRepair.sort((a, b) => {
          return a.hits - b.hits;
        });
        console.log("here7");
        tower.repair(targetRepair[0]);
        console.log("here8");
      }
      // }
    });
  }
};
