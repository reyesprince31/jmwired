export async function readImage(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
    throw new Error("Choose a PNG, JPEG, or WebP image smaller than 1 MB.");
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The image could not be read. Please try again."));
    reader.readAsDataURL(file);
  });
}
