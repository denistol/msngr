import { Types } from "mongoose";

export const toObjectId = (id: string) => new Types.ObjectId(id);

export const uniqBy = (array, key: string) => {
  const seen = new Set();
  return array.filter(item => {
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
