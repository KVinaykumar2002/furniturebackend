export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  mapEmbedUrl: string;
  mapLink: string;
  phone?: string;
  hours?: string;
}

export const stores: Store[] = [
  {
    id: "kondapur",
    name: "Kondapur",
    address: "Survey No. 64, Kondapur",
    city: "Hyderabad",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0!2d78.39!3d17.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI4JzQ4LjAiTiA3OMKwMjMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1",
    mapLink: "https://maps.google.com/?q=Kondapur+Hyderabad",
  },
  {
    id: "kothapet",
    name: "Kothapet",
    address: "Kothapet, Hyderabad",
    city: "Hyderabad",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.56!3d17.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDIyJzEyLjAiTiA3OMKwMzMnMzYuMCJF!5e0!3m2!1sen!2sin!4v1",
    mapLink: "https://maps.google.com/?q=Kothapet+Hyderabad",
  },
];

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id);
}
