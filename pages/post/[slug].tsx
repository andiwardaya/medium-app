import { url } from "inspector";
import { GetStaticProps } from "next";
import React, { useState } from "react";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typing";
import { SubmitHandler, useForm } from "react-hook-form";

type IFormInput = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };
  console.log(post);
  return (
    <main className="py-10">
      <Header />

      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="MainImageBanner"
      />
      <article className="max-w-2xl mx-auto p-5 mt-5">
        <h1 className="font-bold text-xl uppercase">{post.title}</h1>
        <h2 className="text-gray-500 text-md">{post.description}</h2>

        <div className="flex items-center space-x-3 mt-3 pb-5">
          <img
            className="w-12 rounded-full h-12
             object-cover"
            src={urlFor(post.author.image).url()!}
            alt="authorImage"
          />
          <p>
            Blog post by <span className="font-bold">{post.author.name}</span>{" "}
            published at {new Date(post._createAt).toLocaleString()}
          </p>
        </div>

        <div className="">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a
                  href={href}
                  className="text-red-500 hover:underline target:_blank"
                >
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
      {submitted ? (
        <div className="flex flex-col py-5 space-y-2 px-10 rounded-md bg-yellow-500 text-white max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">Terima kasih sudah komen</h1>
          <h2 className="text-sm">
            setelah disetujui oleh moderator, komen akan tampil dibawah halaman
            postingan
          </h2>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col  max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm">enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below</h4>
          <hr className="py-3 mt-3" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5 px-2">
            <span className="text-gray-500">Name</span>
            <input
              {...register("name", { required: true })}
              className="block w-full shadow border rounded-xl py-2 px-3 form-input mt-1 ring-yellow-500 focus:ring outline-none"
              type="text"
              placeholder="Andiwardaya"
            />
          </label>

          <label className="block mb-5 px-2">
            <span className="text-gray-500">Email</span>
            <input
              {...register("email", { required: true })}
              className="block w-full shadow border rounded-xl py-2 px-3 form-input mt-1 ring-yellow-500 focus:ring outline-none"
              type="text"
              placeholder="Andiwardaya"
            />
          </label>

          <label className="block mb-5 px-2">
            <span className="text-gray-500">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              rows={8}
              className="block w-full shadow border rounded-xl py-2 px-3 form-input mt-1 ring-yellow-500 focus:ring outline-none"
            ></textarea>
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">nama harus dimasukan</span>
            )}
            {errors.email && (
              <span className="text-red-500">email harus dimasukan</span>
            )}
            {errors.comment && (
              <span className="text-red-500">comment harus dimasukan</span>
            )}
          </div>

          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 rounded-lg focus:shadow-outline focus:outline-none py-2 px-4 cursor-pointer"
          />
        </form>
      )}
      {/* ======COMMENT ======== */}
      <div className="max-w-2xl mx-auto flex flex-col py-3 px-5 space-y-2 border border-yellow-500">
        <h3 className="text-2xl  font-bold">Comments</h3>
        <hr />

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="font-bold">{comment.name}</span>{" "}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Post;

export async function getStaticPaths() {
  const query = `*[_type == "post"] {
        _id,
        slug {
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
         title,
         author-> {
         name,
         image
       },
       "comments": *[
        _type == "comment" &&
        post._ref == ^._id &&
        approved == true],
        description,
        mainImage,
        slug,
        body
     }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
