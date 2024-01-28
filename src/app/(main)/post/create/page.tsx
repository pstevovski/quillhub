"use client";

import Dropdown from "@/components/Dropdown/Dropdown";
import FormTextInput from "@/components/Form/FormTextInput";
import { PostsNew } from "@/db/schema/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

// Assets
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";
import { z } from "zod";

const PostCreateSchema = z.object({
  title: z.string({
    required_error: "Please provide the title for your blog post",
  }),
  content: z.string({
    required_error: "Please provide the content for your blog post",
  }),
});

export default function PostCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostsNew>({
    defaultValues: {
      title: "",
      cover_photo_url: null,
      content: "",
      status: "draft",
    },
    resolver: zodResolver(PostCreateSchema),
  });

  const handlePostCreate: SubmitHandler<PostsNew> = async (values) => {
    console.log("creating blog post...", values);
  };

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

      <form onSubmit={handleSubmit(handlePostCreate)}>
        <FormTextInput
          label="Title"
          register={register("title")}
          error={errors.title}
          placeholder=""
          autoComplete="title"
          modifierClass="max-w-lg"
        />

        <Dropdown handleDropdownSelection={(value) => alert(value)}>
          <Dropdown.Label>Test</Dropdown.Label>
          <Dropdown.Trigger loading={false} disabled={false}>
            <span className="text-sm">Select an item</span>
          </Dropdown.Trigger>
          <Dropdown.Body>
            <Dropdown.Item text="Item #1" value="item_1">
              Item #1
            </Dropdown.Item>
          </Dropdown.Body>
        </Dropdown>
      </form>
    </div>
  );
}