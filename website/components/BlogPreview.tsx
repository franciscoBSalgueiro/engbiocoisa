import Link from "next/link";

function BlogPreview({
  title,
  image,
  date,
  excerpt,
  slug,
}: {
  image: string;
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}) {
  return (
    <div className="flex flex-col justify-between bg-surface px-4 py-2 rounded relative">
      <div
        style={{ backgroundImage: `url(${image})`, backgroundSize: "cover" }}
        className="h-44 absolute w-full inset-0"
      />
      {/* <img src={image} alt={title} className="absolute w-full inset-0 h-44 " /> */}
      <div className="flex flex-col justify-between h-full mt-44">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <div className="flex justify-between">
          <p className="text-gray-500">{date}</p>
          {/* <p className="text-gray-500 mb-4">{excerpt}</p> */}
          <Link
            href={`/blog/${slug}`}
            className="text-accent2 hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPreview;
