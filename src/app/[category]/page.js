import Date from "@/components/Date";
import CategoryBadge from "@/components/CategoryBadge";
import Link from "next/link"; 
import Image from "next/image";


export async function generateMetadata({params}){
  const slug = params.category

  const seoquery=`query NewQuery {
  categories(where: {slug: "${slug}"}) {
    edges {
      node {
        seo {
          canonicalUrl
          openGraph {
            type
            title
            siteName
            locale
            image {
              height
              secureUrl
              type
              width
              url
            }
            articleMeta {
              publisher
            }
            twitterMeta {
              image
              card
            }
          }
          title
        }
        slug
      }
    }
  }
}
`

  const seoresponse = await fetch("https://fordelviden.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query:seoquery,
    }),
  });

  const seoresult = await seoresponse.json();
 
  const  seodata  = seoresult.data.categories.edges[0].node.seo;
  console.log

  

return {title:seodata.title,
  alternates:{canonical:seodata.canonicalUrl},
  publisher:seodata.openGraph.articleMeta.publisher,
  openGraph:{images:{url:seodata.openGraph.image.url,width:seodata.openGraph.image.width,height:seodata.openGraph.image.height}},
  twitter:{card:seodata.openGraph.twitterMeta.card,title:seodata.title,images:{url:seodata.openGraph.image.url,width:seodata.openGraph.image.width,height:seodata.openGraph.image.height}},
  locale:seodata.openGraph.locale,
  siteName:seodata.openGraph.siteName,
  type:"website"


}

}


export default async function page({params}) {
  const categoryquery = `
query NewQuery {
posts(first:10 where: {categoryName: "${params.category}"}) {
  nodes {
    title
    slug
    games {
      nodes {
        name
      }
    }
    author {
      node {
        name
      }
    }
    featuredImage {
      node {
        sourceUrl
      }
    }
    dateGmt
    categories {
      nodes {
        name
        slug
      }
    }
  }
}
}`

const categoryResponse = await fetch("https://fordelviden.com/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: categoryquery }),
});

const categoryResult = await categoryResponse.json();
const posts=categoryResult.data.posts.nodes;
console.log(posts)
return (
  <>
  <div className="grid grid-cols-12  pt-20 md:pt-16 ">
        <div className="md:col-span-8  md:sticky md:top-20 h-screen overflow-y-auto flex flex-col col-span-12">
          <div className="px-4 pb-4">
            <CategoryBadge name={posts[0].categories.nodes[0].name} href={posts[0].categories.nodes[0].slug} />
            <Link href={`${posts[0].categories.nodes[0].slug}/news/${posts[0].slug}`}>
              <h2 className="text-3xl md:text-5xl font-medium font-poppins tracking-normal leading-snug hover:underline py-2">
                {posts[0].title}
              </h2>
            </Link>
            <p className="text-sm font-poppins font-normal text-neutral-500">
              <Date date={posts[0].dateGmt} /> |{" "}
              {posts[0].author.node.name}
            </p>
          </div>
          <div className="flex-grow relative px-4 pb-4">
            <Link href={`${posts[0].categories.nodes[0].slug}/news/${posts[0].slug}`} className="block h-full">
              <div className="relative h-full">
                <Image
                  src={posts[0].featuredImage.node.sourceUrl}
                  alt={posts[0].title}
                  fill
                  priority
                  quality={100}
                  className="object-cover object-center"
                />
              </div>
            </Link>
          </div>
        </div>
        <div className="md:col-span-4  col-span-12">
          {posts.slice(1,5).map((post, index) => (
            <div key={post.id} className="px-4">
              <div className="py-4">
                <div className="pb-4">
                  <div className="flex flex-row gap-2">
                  {post.categories.nodes.map((category) => (
                    <CategoryBadge
                      name={category.name}
                      href={category.slug}
                      key={category.name}
                    />
                  ))}
                  </div>
                  <Link href={`${post.categories.nodes[0].slug}/news/${post.slug}`}>
                    <h2 className="text-xl font-medium font-poppins tracking-normal leading-snug pt-2 hover:underline ">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm font-poppins font-normal pt-2 text-neutral-500">
                    <Date date={post.dateGmt} /> | {post.author.node.name}
                  </p>
                </div>
                <div>
                  <Link href={`${post.categories.nodes[0].slug}/news/${post.slug}`}>
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title}
                      width={1500}
                      height={500}
                    />
                  </Link>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>

<div className="bg-black flex flex-row text-white text-4xl p-4">
New & Upcoming Releases
</div>
<div>
{posts.slice(6).map((post, index) => (
  <div
    key={index}
    className="w-full grid grid-cols-1 sm:grid-cols-3 p-4 gap-4"
  >
    <div className="col-span-1 sm:col-span-1">
      <Link href={`${post.categories.nodes[0].slug}/news/${post.slug}`}>
        <Image
          src={post.featuredImage.node.sourceUrl}
          alt={post.title}
          width={1000}
          height={1000}
          className="w-full h-auto"
        />
      </Link>
    </div>
    <div className="col-span-1 sm:col-span-2">
      <div className="flex gap-2 w-full flex-wrap pb-2">
        {post.categories.nodes.map((category) => (
          <CategoryBadge
            name={category.name}
            href={category.slug}
            key={category.name}
          />
        ))}
      </div>
      <Link href={`${post.categories.nodes[0].slug}/news/${post.slug}`}>
        <h3 className="text-4xl font-medium font-poppins mt-4 sm:mt-0 hover:underline">
          {post.title}
        </h3>
      </Link>
      <p className="text-sm font-poppins font-normal pt-2 text-neutral-500">
        <Date date={post.dateGmt} /> | {post.author.node.name}
      </p>
    </div>
  </div>
))}
</div>
</>
)
}