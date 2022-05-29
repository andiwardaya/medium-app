import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typing";

interface Props {
  posts: [Post];
}
const Home = ({ posts }: Props) => {
  console.log(posts);
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Apps</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Hero />

      {/* post */}
      <div className="grid grid-cols-1  p-6 sm:grid-cols-2  lg:grid-cols-3 gap-6  md:grid-cols-3 md:gap-6 md:p-6 ">
        {posts.map((post) => (
          <div className="">
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="group cursor-pointer  border border-gray-500  rounded-lg overflow-hidden h-50  ">
                <img
                  className=" h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                  src={urlFor(post.mainImage).url()!}
                  alt="blogMainImage"
                />
                <div className="flex justify-between p-5 bg-white">
                  <div>
                    <p className="font-bold uppercase">{post.title}</p>
                    <p className="text-sm">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt="authorImage"
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const query = `*[_type == "post"] {
    _id,
    title,
    author -> {
    name, 
    image
  },
  description,
  mainImage,
  slug
  }`;

  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    },
  };
};
