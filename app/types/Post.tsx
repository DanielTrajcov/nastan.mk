// Make sure the Post type is correctly defined in your types
export interface Post {
  id: string;
  title: string;
  location: string;
  image: string;
  [key: string]: any; // If you're using 'any', consider using a more specific type if possible
}

// Correctly define PageProps
interface PageProps {
  posts: Post[]; // Ensure this aligns with how you're passing props to Profile
}
