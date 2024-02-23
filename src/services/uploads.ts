import handleErrorMessage from "@/utils/handleErrorMessage";

class Upload {
  /**
   *
   * Get the keys of the uploaded images.
   *
   * `imagesToBeRemoved` contains the keys of those images
   * that were uploaded to Uploadthing servers but wont be used
   *
   * `imagesToBeSaved` contains the keys of those images
   * that were uploaded to Uploadthing servers and will be used
   *
   * @param keys List of keys, either `cover` or `content` images keys
   * @param source The source against which we should check if some of the listed keys exist
   *
   */
  handleImageKeys(keys: string[], source: string): string[] {
    if (!keys.length || !source) return [];

    // List of image keys that will be removed from Uploadthing
    const imagesToBeRemoved: string[] = [...keys].filter((key) => {
      return !source.includes(key);
    });

    // Send API request to delete uploaded images
    this.deleteImagesFromUploadthing(imagesToBeRemoved);

    // List of image keys that will be saved in our database
    return [...keys].filter((key) => source.includes(key));
  }

  /**
   *
   * Deletes images that were uploaded to Uploadthing servers
   * but won't be used anymore, in order to free up unused space.
   *
   * @param imageKeys List of unique `file keys` corresponding
   * to the files that will be deleted from Uploadthing servers.
   *
   */
  async deleteImagesFromUploadthing(imageKeys: string[]) {
    // Prevent sending any unnecessary API requests if there are no keys
    if (!imageKeys.length) return;

    try {
      await fetch("https://uploadthing.com/api/deleteFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Uploadthing-Api-Key": process.env.UPLOADTHING_SECRET || "",
        },
        body: JSON.stringify({ fileKeys: imageKeys }),
      });

      console.log(
        "Unused images successfully removed from Uploadthing servers."
      );
    } catch (error) {
      throw new Error(handleErrorMessage(error));
    }
  }
}

const UploadService = new Upload();

export default UploadService;
