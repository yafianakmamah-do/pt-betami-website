const builtInGalleryIdPrefix = '00000000-0000-4000-8000-0000000000';

export function getBuiltInGalleryNumber(id: string) {
  if (!id.startsWith(builtInGalleryIdPrefix)) return null;

  const number = Number(id.slice(builtInGalleryIdPrefix.length));
  return Number.isInteger(number) && number >= 1 && number <= 24 ? number : null;
}
