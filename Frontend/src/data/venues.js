export const venues = [
    { VenueId: 1, Name: "MA Chidambaram Stadium", City: "Chennai", Country: "India", Capacity: 38000, ImageUrl: "https://example.com/chidambaram.jpg" },
    { VenueId: 2, Name: "Wankhede Stadium", City: "Mumbai", Country: "India", Capacity: 33000, ImageUrl: "https://example.com/wankhede.jpg" },
    { VenueId: 3, Name: "Rajiv Gandhi Intl. Cricket Stadium", City: "Hyderabad", Country: "India", Capacity: 40000, ImageUrl: "https://example.com/rajiv.jpg" },
    { VenueId: 4, Name: "M Chinnaswamy Stadium", City: "Bengaluru", Country: "India", Capacity: 35000, ImageUrl: "https://example.com/chinnaswamy.jpg" },
    { VenueId: 5, Name: "Eden Gardens", City: "Kolkata", Country: "India", Capacity: 68000, ImageUrl: "https://example.com/eden.jpg" },
    { VenueId: 6, Name: "Arun Jaitley Stadium", City: "Delhi", Country: "India", Capacity: 41000, ImageUrl: "https://example.com/arnj.jpg" }
  ];
  
  export const getVenues = () => Promise.resolve(venues);