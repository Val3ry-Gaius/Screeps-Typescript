import * as _ from "lodash";
import * as M from "./memory";
export const roleStaticHarvester = {

  run(creep: Creep): void {
    const source = creep.room.find<Source>(FIND_SOURCES);
    const container = source[0].pos.findInRange(FIND_STRUCTURES, 1, {
      filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER
    })[0];
    if (creep.pos.isEqualTo(container)) {
      creep.harvest(source[0]);
    } else {
      creep.moveTo(container);
    }
  }
};
