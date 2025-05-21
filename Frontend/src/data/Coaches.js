export const coaches = [
    { CoachId: 1, Name: "Stephen Fleming", Role: "Head Coach", CountryCode: "NZ", ImageUrl: "https://example.com/fleming.jpg", TeamId: 1 },
    { CoachId: 2, Name: "Mark Boucher", Role: "Head Coach", CountryCode: "SA", ImageUrl: "https://example.com/boucher.jpg", TeamId: 2 },
    { CoachId: 3, Name: "Daniel Vettori", Role: "Head Coach", CountryCode: "NZ", ImageUrl: "https://example.com/vettori.jpg", TeamId: 3 },
    { CoachId: 4, Name: "Andy Flower", Role: "Head Coach", CountryCode: "ZW", ImageUrl: "https://example.com/flower.jpg", TeamId: 4 },
    { CoachId: 5, Name: "Gautam Gambhir", Role: "Head Coach", CountryCode: "IN", ImageUrl: "https://example.com/gambhir.jpg", TeamId: 5 },
    { CoachId: 6, Name: "Ricky Ponting", Role: "Head Coach", CountryCode: "AU", ImageUrl: "https://example.com/ponting.jpg", TeamId: 6 },
  ];
  
  export const getCoaches = () => Promise.resolve(coaches);