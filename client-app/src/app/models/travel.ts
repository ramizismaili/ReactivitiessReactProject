import { Profile } from "./profile";

export interface Travel {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees: Profile[]
  }

  export class Travel implements Travel {
    constructor(init?: TravelFormValues) {
      Object.assign(this, init);
    }
  }

  export class TravelFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date: Date | null = null;
    city: string = '';
    venue: string = '';

    constructor(travel?: TravelFormValues) {
      if (travel) {
        this.id = travel.id;
        this.title = travel.title;
        this.category = travel.category;
        this.description = travel.description;
        this.date = travel.date;
        this.venue = travel.venue;
        this.city = travel.city;
      }
    }
  }