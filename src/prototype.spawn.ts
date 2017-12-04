
export function buildScaledCreep(
  energy: number,
  newName: string,
  roleName: string,
  taskName: string,
  sourceIdName: string
) {
  const numberOfBodyParts = Math.floor(energy / 200);
  const body: BodyPartConstant[] = [];
  for (let i = 0; i < numberOfBodyParts; i++) {
    body.push(WORK);
  }
  for (let i = 0; i < numberOfBodyParts; i++) {
    body.push(CARRY);
  }
  for (let i = 0; i < numberOfBodyParts; i++) {
    body.push(MOVE);
  }
  return Game.spawns.Spawn1.spawnCreep(
    body,
    newName,
    {
      memory:
      {
      role: roleName,
      task: taskName,
      sourceId: sourceIdName
      }
    });
}
