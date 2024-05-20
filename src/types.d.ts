export interface Post {
  slug: string;
  body: string;
  collection: string;
  data: {
      title: string;
      description: string;
      date: string;
      keywords?: any[];
  };
  excerpt?: string;
};