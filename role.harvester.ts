/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

const roleHarvester = {

  run(creep: Creep): void {
    if (creep.carry.energy < creep.carryCapacity) {
      const sources = creep.room.find<Source>(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: "#ffaa00"}});
      }
    } else {
      const targets = creep.room.find<Structure>(FIND_STRUCTURES, {
        filter: (structure: Structure) => {
          if (structure.structureType === STRUCTURE_EXTENSION) {
            if (structure) {

            }
          }
          return (structure.structureType === STRUCTURE_EXTENSION ||
                  structure.structureType === STRUCTURE_SPAWN ||
                  structure.structureType === STRUCTURE_TOWER) &&
                  structure.structureType < structure.structureType;
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: "#ffffff"}});
        }
      }
    }
  }
};

module.exports = roleHarvester;


export function run(creep: Creep): void
{
    const spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
    const energySource = creep.room.find<Source>(FIND_SOURCES_ACTIVE)[0];

    // if (creepActions.needsRenew(creep)) {
    // creepActions.moveToRenew(creep, spawn);
    // } else
    if (_.sum(creep.carry) === creep.carryCapacity)
    {
        _moveToDropEnergy(creep, spawn);
    } else
    {
        _moveToHarvest(creep, energySource);
    }
}

function _tryHarvest(creep: Creep, target: Source): number
{
    return creep.harvest(target);
}

function _moveToHarvest(creep: Creep, target: Source): void
{
    if (_tryHarvest(creep, target) === ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target.pos);
    }
}

function _tryEnergyDropOff(creep: Creep, target: Spawn | Structure): number
{
    return creep.transfer(target, RESOURCE_ENERGY);
}

function _moveToDropEnergy(creep: Creep, target: Spawn | Structure): void
{
    if (_tryEnergyDropOff(creep, target) === ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target.pos);
    }
}
