import { BASE_URL } from '@/app/lib/constants'
 
export async function generateSitemaps() {

    
      
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}
 
export default async function sitemap({ id }) {
  // Google's limit is 50,000 URLs per sitemap
  const sitemapquery=`query NewQuery {
    posts(first: 1000) {
  
      nodes {
        slug
        title
        link
        modifiedGmt
      }
      pageInfo{
        hasNextPage
        startCursor
        endCursor
  
      }
    }
  }
        `
        
          const sitemapresponse = await fetch("https://fordelviden.com/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query:sitemapquery,
            }),
          });
        
          const sitemapresult = await sitemapresponse.json();
         
          const  sitemapdata  = sitemapresult.data.posts.nodes;

          console.log(sitemapresult)
  return products.map((product) => ({
    url: `${BASE_URL}/product/${id}`,
    lastModified: product.date,
  }))
}