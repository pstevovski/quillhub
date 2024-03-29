"use client";

// Utilities & Hooks
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import handleErrorMessage from "@/utils/handleErrorMessage";
import fetchHandler from "@/utils/fetchHandler";
import useWarnForUnsavedChanges from "@/hooks/useWarnForUnsavedChanges";

// Form
import { PostsNew } from "@/db/schema/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { VALIDATION_SCHEMA_BLOG_POSTS_NEW } from "@/zod/blog-posts";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

// Assets
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";

// Uploadthing
import { UploadFileResponse } from "uploadthing/client";
import { UploadButton } from "@/components/UploadThing";

// Components
import Tiptap from "@/components/WYSIWYG/TipTap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import Loader from "@/components/Loaders/Loader";
import TopicsSelection from "@/components/Topics/TopicsSelection";

export default function PostCreate() {
  const form = useForm<PostsNew>({
    defaultValues: {
      title: "",
      content: "",
      status: undefined,
      cover_photo: undefined,
      topic_id: null,
    },
    resolver: zodResolver(VALIDATION_SCHEMA_BLOG_POSTS_NEW),
  });
  const watchCoverPhoto = form.watch("cover_photo");
  const [isUploadingCoverPhoto, setIsUploadingCoverPhoto] =
    useState<boolean>(false);

  /*================================
    COVER PHOTO
  ==================================*/
  const handleUploadCoverPhoto = (response: UploadFileResponse<unknown>[]) => {
    form.setValue("cover_photo", response[0].url, { shouldDirty: true });
    setIsUploadingCoverPhoto(false);
    handleUploadedCoverImagesKeys(response[0].key);
  };

  /*===============================
    UPLOADED IMAGES
  ================================*/
  const [uploadedContentImagesKeys, setUploadedContentImagesKeys] = useState<
    string[]
  >([]);
  const [uploadedCoverImagesKeys, setUploadedCoverImagesKeys] = useState<
    string[]
  >([]);

  const handleUploadedContentImagesKeys = (imageKey: string) => {
    const copyContentImages = [...uploadedContentImagesKeys];
    copyContentImages.push(imageKey);
    setUploadedContentImagesKeys(copyContentImages);
  };

  const handleUploadedCoverImagesKeys = (imageKey: string) => {
    const copyCoverImages = [...uploadedCoverImagesKeys];
    copyCoverImages.push(imageKey);
    setUploadedCoverImagesKeys(copyCoverImages);
  };

  /*===============================
    SEND API REQUEST
  ================================*/
  const handlePostCreate: SubmitHandler<PostsNew> = async (values) => {
    try {
      const { message } = await fetchHandler("POST", "blog", {
        ...values,
        uploaded_content_images_keys: uploadedContentImagesKeys,
        uploaded_cover_images_keys: uploadedCoverImagesKeys,
      });

      toast.success(message);
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  useWarnForUnsavedChanges(form.formState.isDirty);

  return (
    <div>
      <Link
        href="/"
        prefetch
        className="flex items-center text-slate-400 hover:text-teal-500 duration-300 text-xl mt-10 mb-20"
      >
        <GoBackIcon className="mr-2" />
        Go Back
      </Link>

      <h1 className="text-teal-500 text-5xl font-bold mb-2">
        Write your blog post
      </h1>
      <p className="text-sm text-slate-400 mb-14">
        Unfold your imagination and make your stories come to life.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePostCreate)}>
          <FormField
            control={form.control}
            name="cover_photo"
            render={() => (
              <FormItem className="mb-8">
                <FormLabel className="text-sm text-slate-400">
                  Cover Photo
                </FormLabel>

                <FormControl>
                  <UploadButton
                    endpoint="blogPostCoverPhoto"
                    onUploadBegin={() => setIsUploadingCoverPhoto(true)}
                    onClientUploadComplete={handleUploadCoverPhoto}
                    onUploadError={() => {
                      toast.error(
                        "Failed uploading cover photo. Please try again!"
                      );
                      setIsUploadingCoverPhoto(false);
                    }}
                    appearance={{
                      button: ({ isUploading }) =>
                        `bg-teal-400 hover:bg-teal-500 duration-300 ${
                          isUploading ? "bg-slate-200 cursor-not-allowed" : ""
                        }`,
                      container: "items-start",
                      allowedContent: "hidden",
                    }}
                  />
                </FormControl>
                <FormDescription className="text-xs text-slate-400 mb-4">
                  Upload a cover photo for your blog post
                  <span className="block text-xs text-teal-600 font-medium">
                    Maximum allowed image size: 4MB
                  </span>
                </FormDescription>

                {watchCoverPhoto ? (
                  <img width="300" height="300" src={watchCoverPhoto} />
                ) : null}
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    id="title"
                    placeholder="e.g. Using NextJS 14"
                    className="max-w-lg placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* STATUS */}
          <FormField
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`max-w-[200px] text-slate-400 mb-10 ${
                        fieldState.error ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem className="text-slate-400" value="draft">
                      Draft
                    </SelectItem>
                    <SelectItem className="text-slate-400" value="published">
                      Published
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* TOPIC */}
          <FormField
            control={form.control}
            name="topic_id"
            render={({ fieldState }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">Topics</FormLabel>
                <TopicsSelection
                  selectionLimit={1}
                  handleSelectedTopics={(topics) => {
                    form.setValue("topic_id", topics[0]?.id || null, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  modifierClass={
                    fieldState.error ? `[&>div>input]:border-red-500` : ""
                  }
                />

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* CONTENT */}
          <FormField
            control={form.control}
            name="content"
            render={() => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">Content</FormLabel>
                <FormControl>
                  <Tiptap
                    defaultContent=""
                    handleEditorUpdate={(text) =>
                      form.setValue("content", text, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    handleUploadedImageKey={handleUploadedContentImagesKeys}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            disabled={
              !form.formState.isDirty ||
              isUploadingCoverPhoto ||
              form.formState.isSubmitting
            }
            className="my-10"
          >
            Create Blog Post
            {form.formState.isSubmitting ? (
              <Loader modifierClass="ml-3" />
            ) : null}
          </Button>
        </form>
      </Form>
    </div>
  );
}
