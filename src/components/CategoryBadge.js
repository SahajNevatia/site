import React from "react";
import Link from "next/link";

export default function CategoryBadge({ name, href, color, borderColor = "black", textColor = "neutral-600" }) {
  const bgColorClass = color ? `bg-${color}` : 'bg-black';
  const borderColorClass = `border-${borderColor}`;
  const textColorClass = `text-${textColor}`;

  return (
    <Link href={href} className="block w-fit">
      <div className="relative overflow-hidden w-fit px-2 py-1 text-sm group cursor-pointer">
        <span className={`relative z-10 transition-colors duration-200 group-hover:text-white ${textColorClass}`}>
          {name}
        </span>
        <div className={`absolute inset-0 ${bgColorClass} transform translate-x-full group-hover:translate-x-0 transition-transform duration-200 ease-out`}></div>
        <div className={`absolute inset-0 border-r border-b ${borderColorClass} transform translate-x-0 group-hover:translate-x-full transition-transform duration-200 ease-out`}></div>
      </div>
    </Link>
  );
}
