import React from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
}

const Blog: React.FC = () => {
  // This would typically come from an API
  const posts: BlogPost[] = [
    {
      id: 1,
      title: "Company Update Q1 2024",
      excerpt: "An overview of our achievements and milestones in the first quarter of 2024.",
      author: "John Doe",
      date: "2024-03-15",
      category: "Company News"
    },
    {
      id: 2,
      title: "New Office Opening in Berlin",
      excerpt: "We're excited to announce the opening of our new office in Berlin's tech hub.",
      author: "Jane Smith",
      date: "2024-03-10",
      category: "Announcements"
    },
    // Add more sample posts as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Blog</h1>
      
      <div className="grid gap-8">
        {posts.map((post) => (
          <article 
            key={post.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                {post.category}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">By {post.author}</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
              Read More →
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog; 