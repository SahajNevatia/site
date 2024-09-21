'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Add this import
import CategoryBadge from '@/components/CategoryBadge';
import Date from '@/components/Date';

export default function TournamentPosts({ tournamentPosts }) {
  const [activeTournament, setActiveTournament] = useState(Object.keys(tournamentPosts)[0]);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      const postSections = document.querySelectorAll('[id$="-posts"]');
      let activeSection = postSections[0];

      postSections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top + scrollPosition;
        if (sectionTop <= scrollPosition + 100) {
          activeSection = section;
        }
      });

      setActiveTournament(activeSection.id.replace('-posts', ''));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tournamentPosts]);

  function scrollToTournament(tournamentId) {
    const section = document.getElementById(`${tournamentId}-posts`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div ref={containerRef} className="border-x border-black">
      {/* Mobile tabs */}
      <div className="md:hidden overflow-x-auto whitespace-nowrap border-b border-black sticky top-16 bg-white z-20">
        {Object.keys(tournamentPosts).map((tournamentId) => (
          <button
            key={tournamentId}
            className={`p-2 ${activeTournament === tournamentId ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => scrollToTournament(tournamentId)}
          >
            {tournamentPosts[tournamentId].name}
          </button>
        ))}
      </div>

      {/* Desktop layout */}
      <div className="md:grid md:grid-cols-12 border-b border-black">
        {/* Sticky tournament names column */}
        <div className="hidden md:block col-span-3 sticky top-16 self-start ">
          <div className="flex flex-col">
            {Object.keys(tournamentPosts).map((tournamentId) => (
              <div
                key={tournamentId}
                className={`tournament-name cursor-pointer p-4 ${
                  activeTournament === tournamentId ? 'bg-black text-white' : ''
                }`}
                onClick={() => scrollToTournament(tournamentId)}
              >
                {tournamentPosts[tournamentId].name}
              </div>
            ))}
          </div>
        </div>
        
        {/* Posts column */}
        <div className="col-span-12 md:col-span-9 md:border-l border-black">
          {renderPosts()}
        </div>
      </div>
    </div>
  );

  function renderPosts() {
    const tournamentEntries = Object.entries(tournamentPosts);
    return tournamentEntries.map(([tournamentId, tournament], tournamentIndex) => (
      <div key={tournamentId} id={`${tournamentId}-posts`}>
        {tournament.posts.map((post, postIndex) => {
          const isLastPost = tournamentIndex === tournamentEntries.length - 1 && postIndex === tournament.posts.length - 1;
          return (
            <div 
              key={post.id} 
              className={`p-4 flex flex-col md:flex-row md:items-center ${
                !isLastPost ? 'border-b border-black' : ''
              }`}
            >
              <div className="flex-grow">
                <div className="flex flex-row gap-2 flex-wrap">
                  <CategoryBadge name={post.games.nodes[0].name} href={tournament.slug} />
                  <CategoryBadge name={post.categories.nodes[0].name} href={tournament.slug} />
                </div>
                <Link href={post.slug}>
                  <h3 className="text-xl md:text-2xl font-medium font-poppins mt-2 hover:underline">{post.title}</h3>
                </Link>
                <p className="text-sm font-poppins font-normal pt-2 text-neutral-500">
                  <Date date={post.dateGmt} /> | {post.author.node.name}
                </p>
              </div>
              {post.featuredImage && (
                <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0 w-full md:w-[300px] ">
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  }
}