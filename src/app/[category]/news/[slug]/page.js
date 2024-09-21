
import Image from 'next/image';

export async function generateMetadata({params}){
  const slug = params.slug

  const seoquery=`query NewQuery {
    postBy(
      slug: "${slug}"
    ) {
      seo {
        description
        canonicalUrl
  
        openGraph {
  
          description
          image {
            height
            secureUrl
            type
            url
            width
          }
          locale
          siteName
          title
          twitterMeta {
            card
  
            description
            image
            site
            title
          }
          updatedTime
          url
        }
        robots
        title
      }
      author {
        node {
          name
        }
      }
    }
  }`

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
  const  seodata  = seoresult.data.postBy.seo;

return {title:seodata.title,
        description:seodata.description,
        alternates:{canonical:seodata.canonicalUrl},
        author:seoresult.data.postBy.author,
        publisher:"https://fordelviden.com",
        openGraph:{images:{url:seodata.openGraph.image.url,width:seodata.openGraph.image.width,height:seodata.openGraph.image.height}},
        twitter:{card:seodata.openGraph.twitterMeta.card,title:seodata.title,images:{url:seodata.openGraph.image.url,width:seodata.openGraph.image.width,height:seodata.openGraph.image.height}},
        publishedTime:seodata.openGraph.updatedTime

}

}


export default async function page({params}) {
    const query = `
    query {
  postBy(
    slug: "${params.slug}"
  ) {
    id
    author {
      node {
        name
      }
    }
    content
    dateGmt
    featuredImage {
      node {
        sourceUrl
      }
    }
    categories {
      nodes {
        name
      }
    }
      title
  }
}
  `;

  const response = await fetch("https://fordelviden.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  });

  const result = await response.json();
  const { data } = result;
  const post = data.postBy;


  return (
    <>
    <div className="pt-20 md:pt-16">{params.slug}
    <div className="w-full max-w-4xl mx-auto"> 
      <h1 className="text-center text-6xl font-black tracking-wide">{post.title}</h1>
    </div>
  
    <div className="w-full max-w-screen-2xl mx-auto my-8 overflow-hidden relative h-[600px]"> 
        <Image
          src={post.featuredImage.node.sourceUrl}
          alt={post.title}
          width={1100}  
          height={700}  
          className="w-full h-auto parallax-image object-cover"
        />
      </div>
      
  
    <div dangerouslySetInnerHTML={{__html:post.content}} className="prose prose-lg w-full max-w-4xl mx-auto"> 
    </div>
    </div>
    </>
  )
}
