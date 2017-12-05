import * as _ from "lodash";
import * as M from "./memory";
export const roleStaticHarvester = {

  run(creep: Creep): void {
    const source: Source | null = Game.getObjectById(M.cm(creep).source);
    if (source) {
      const container = source.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER
      })[0];
      if (creep.pos.isEqualTo(container)) {
        creep.harvest(source);
      } else {
        creep.moveTo(container);
      }
    }
  }
};
