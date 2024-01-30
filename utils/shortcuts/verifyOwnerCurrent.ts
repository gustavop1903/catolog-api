
export function verifyOwnerCurrent(ownerId: string, userSession: string) {
  if (ownerId !== userSession) {
    throw new Error("Only the owner can update this field");
  }
}


