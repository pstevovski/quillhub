import { Image as ImageIcon } from "lucide-react";
import { Toggle } from "@/ui/toggle";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/ui/alert-dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { toast } from "sonner";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { UploadButton } from "@/components/UploadThing";
import { TipTapExtensionComponentProps } from "../TipTap";
import { UploadFileResponse } from "uploadthing/client";

const VALIDATION_SCHEMA_EDITOR_IMAGE = z.object({
  url: z
    .string()
    .url(
      "Please enter a valid URL for the image. It must start with http(s)://"
    ),
  title: z.string().min(1, "Please provide a title for the image image"),
  alt: z.string().optional(),
});
type ImageUpload = z.infer<typeof VALIDATION_SCHEMA_EDITOR_IMAGE>;

export default function Image({
  editor,
  handleUploadedImageKey,
}: TipTapExtensionComponentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] =
    useState<UploadFileResponse<unknown> | null>(null);

  const form = useForm<ImageUpload>({
    resolver: zodResolver(VALIDATION_SCHEMA_EDITOR_IMAGE),
    defaultValues: {
      url: "",
      title: "",
      alt: "",
    },
  });

  const handleAttachImage = (image: any) => {
    try {
      editor.commands.setImage({
        src: image.url,
        title: image.title,
        alt: image.alt,
      });

      // Close the dialog box
      setIsMenuOpen(false);
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  // Update the list of uploaded image keys
  useEffect(() => {
    if (!uploadedImage || !handleUploadedImageKey) return;
    handleUploadedImageKey(uploadedImage.key);
  }, [uploadedImage]);

  // Reset the form when the menu gets closed
  useEffect(() => {
    if (form.formState.isDirty && isMenuOpen === false) form.reset();
  }, [isMenuOpen]);

  return (
    <div>
      <AlertDialog open={isMenuOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-500 text-2xl font-bold">
              Attach Image
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Select the image that you'd like to be part of your blog post.{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form
              onSubmit={(event) => {
                event.stopPropagation();
                form.handleSubmit(handleAttachImage)(event);
              }}
            >
              <div className="flex justify-start">
                <UploadButton
                  endpoint="blogPostAttchedImage"
                  onUploadBegin={() => setIsUploadingImage(true)}
                  onClientUploadComplete={(response) => {
                    setUploadedImage(response[0]);
                    setIsUploadingImage(false);
                    form.setValue("url", response[0].url);
                  }}
                  onUploadError={() => {
                    toast.error(
                      "Failed uploading selected image. Please try again!"
                    );
                    setIsUploadingImage(false);
                  }}
                  appearance={{
                    button: ({ isUploading }) =>
                      `bg-teal-400 hover:bg-teal-500 duration-300 ${
                        isUploading ? "bg-slate-200 cursor-not-allowed" : ""
                      }`,
                    allowedContent: "w-full text-slate-400 font-medium",
                  }}
                />
              </div>

              <h5 className="text-slate-400 my-4 text-sm">
                Or provide a direct URL to the image:
              </h5>

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-slate-600">URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="url"
                        placeholder="https://picsum.photos/200/300"
                        className="placeholder:text-slate-300 focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-slate-600">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="title"
                        placeholder="e.g. Mona Lisa"
                        className="placeholder:text-slate-300 focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <FormLabel className="text-slate-600">Alt</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="alt"
                        placeholder="e.g. A picture by Leonardo Da Vinci portraying a woman"
                        className="placeholder:text-slate-300 focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400 text-xs">
                      Alternative text that will be used as a fallback
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                <AlertDialogCancel
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  disabled={!form.formState.isDirty || isUploadingImage}
                  className={`bg-teal-400 hover:bg-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed`}
                >
                  Attach Image
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={() => setIsMenuOpen(true)}
      >
        <ImageIcon className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
    </div>
  );
}
