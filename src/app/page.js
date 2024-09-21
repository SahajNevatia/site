import Image from "next/image";
import { format, parseISO } from "date-fns";
import CategoryBadge from "@/components/CategoryBadge";
import Link from "next/link";
import Date from "@/components/Date";
import TournamentPosts from "@/components/TournamentPosts";
import EsportsCarousel from "@/components/EsportsCarousel";

export async function generateMetadata({}){

  const seoquery=`query NewQuery {
  pageBy(uri: "/") {

    seo {
      canonicalUrl
      description
      openGraph {
        image {
          height
          url
          width
        }
        locale
        siteName
        slackEnhancedData {
          data
          label
        }
        title
        updatedTime
        twitterMeta {
          card
        }
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
 
  const  seodata  = seoresult.data.pageBy.seo;

  

return {title:seodata.openGraph.title,
  description:seodata.description,
  alternates:{canonical:seodata.canonicalUrl},
  publisher:"https://facebook.com/fordelviden",
  openGraph:{images:{url:seodata.openGraph.image.url,width:seodata.openGraph.image.width,height:seodata.openGraph.image.height}},
  twitter:{card:seodata.openGraph.twitterMeta.card,title:seodata.title,images:{url:seodata.openGraph.image.url,width:seodata.openGraph.image.width,height:seodata.openGraph.image.height}},
  locale:seodata.openGraph.locale,
  siteName:seodata.openGraph.siteName,
  type:"website"


}

}

export default async function Home() {
  const top5postsquery = `
    query top5postsquery {
      posts (first:5) {
    nodes {
      id
      title
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
        }
      }
      dateGmt
      games {
        nodes {
          name
          slug
        }
      }
      categories {
        nodes {
          slug
          name
        }
      }
    }
  }
    }
  `;

  const top5postsqueryresponse = await fetch(
    "https://fordelviden.com/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: top5postsquery }),
    }
  );

  const top5postsqueryresult = await top5postsqueryresponse.json();
  const top5posts = top5postsqueryresult.data.posts.nodes;

  //New Release Data fetch
  const newreleasesquery = `
  query GetLatestPosts {
    
  posts(first: 5, where: {categoryName: "New Release"}) {
    nodes {
      id
      title
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
        }
      }
      dateGmt
      games {
        nodes {
          name
          slug
        }
      }
      categories {
        nodes {
          slug
          name
        }
      }
    }
  }

  }
`;

  const newreleasesresponse = await fetch("https://fordelviden.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: newreleasesquery }),
  });

  const newreleasesresult = await newreleasesresponse.json();
  const newreleases = newreleasesresult.data.posts.nodes;

  // Fetch tournament posts
  const tournamentQueries = [
    { name: 'ESL Pro League', slug: 'esl-pro-league', categoryName: 'ESL Pro Leauge' },
    { name: 'The International Dota', slug: 'the-international-dota', categoryName: 'The International Dota' },
    { name: 'VALORANT Champions Tour', slug: 'valorant-champions-tour', categoryName: 'vct' },
    // Add more tournaments as needed
  ];

  const tournamentPosts = {};

  for (const tournament of tournamentQueries) {
    const query = `
      query GetLatestPosts {
        posts(first: 5, where: {categoryName: "${tournament.categoryName}"}) {
          nodes {
            id
            title
            slug
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
              }
            }
            dateGmt
            games {
              nodes {
                name
                slug
              }
            }
            categories {
              nodes {
                slug
                name
              }
            }
            games {
              nodes {
                name
          }
        }
          }
        }
      }
    `;

    const response = await fetch("https://fordelviden.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    tournamentPosts[tournament.slug] = {
      name: tournament.name,
      slug: tournament.slug,
      posts: result.data.posts.nodes,
    };
  }

  //New Release Data fetch
  const esportsquery = `
  query GetLatestPosts {
    
  posts(first: 12, where: {categoryName: "Esports"}) {
    nodes {
      id
      title
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
        }
      }
      dateGmt
      games {
        nodes {
          name
          slug
        }
      }
      categories {
        nodes {
          slug
          name
        }
      }
    }
  }

  }
`;

  const esportsResponse = await fetch("https://fordelviden.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: esportsquery }),
  });

  const esportsResult = await esportsResponse.json();
  const esportsposts = esportsResult.data.posts.nodes;

  return (
    <>
      <div className="grid grid-cols-12  pt-20 md:pt-16 ">
        <div className="md:col-span-8  md:sticky md:top-20 h-screen overflow-y-auto flex flex-col col-span-12">
          <div className="px-4 pb-4">
            <CategoryBadge name={top5posts[0].categories.nodes[0].name} href={top5posts[0].categories.nodes[0].slug} />
            <Link href={`${top5posts[0].categories.nodes[0].slug}/news/${top5posts[0].slug}`}>
              <h2 className="text-3xl md:text-5xl font-medium font-poppins tracking-normal leading-snug hover:underline py-2">
                {top5posts[0].title}
              </h2>
            </Link>
            <p className="text-sm font-poppins font-normal text-neutral-500">
              <Date date={top5posts[0].dateGmt} /> |{" "}
              {top5posts[0].author.node.name}
            </p>
          </div>
          <div className="flex-grow relative px-4 pb-4">
            <Link href={`${top5posts[0].categories.nodes[0].slug}/news/${top5posts[0].slug}`} className="block h-full">
              <div className="relative h-full">
                <Image
                  src={top5posts[0].featuredImage.node.sourceUrl}
                  alt={top5posts[0].title}
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
          {top5posts.slice(1).map((post, index) => (
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
        {newreleases.map((post, index) => (
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

      <div className="bg-black w-full p-4">
        <h2 className="text-white text-[15vw] md:text-9xl uppercase font-semibold tracking-wider max-w-[90vw] mx-auto">
          Esports
        </h2>
      </div>

      <TournamentPosts tournamentPosts={tournamentPosts} />
      <EsportsCarousel esportsposts={esportsposts} />
      <div className="h-screen"></div>
    </>
  );
}
