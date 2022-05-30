import { url } from "inspector";
import { GetStaticProps } from "next";
import React from "react";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typing";

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  console.log(post);
  return (
    <main>
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