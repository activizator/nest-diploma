export interface HotelRoom {
  id: string;
  title: string;
  description: string;
  images: [string];
  isEnabled: boolean;
  hotel: {
    id: string;
    title: string;
    description: string;
  };
}
