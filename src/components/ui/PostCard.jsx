import React from 'react';

export function PostCard({ image, category, title, summary, author, date, onClick }) {
  return (
    <article
      className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="h-40 overflow-hidden bg-gray-100 shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-bold text-[#4c5b71]/90 uppercase tracking-wider mb-1.5">
          {category}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{author}</span>
          </div>
          <time>{date}</time>
        </div>
      </div>
    </article>
  );
}
