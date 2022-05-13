import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Profile } from "../models/profile";
import { Travel, TravelFormValues } from "../models/travel";
import { store } from "./store";

export default class TravelStore {
    travelRegistry = new Map<string, Travel>();
    selectedTravel: Travel | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get traveliesByDate() {
        return Array.from(this.travelRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedTravelies() {
        return Object.entries(
            this.traveliesByDate.reduce((travelies, travel) => {
                const date = format(travel.date!, 'dd MMM yyyy'); 
                travelies[date] = travelies[date] ? [...travelies[date], travel] : [travel];
                return travelies;
            }, {} as {[key: string]: Travel[]})
        )
    }

    loadTravelies = async () => {
        this.loadingInitial = true;
        try {
            const travelies = await agent.Travelies.list();
            travelies.forEach(travel => {
                this.setTravel(travel);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadTravel = async (id: string) => {
        let travel = this.getTravel(id);
        if (travel) {
            this.selectedTravel = travel;
            return travel;
        } else {
            this.loadingInitial = true;
            try {
                travel = await agent.Travelies.details(id);
                this.setTravel(travel);
                runInAction(() => {
                    this.selectedTravel= travel;
                })
                this.setLoadingInitial(false);
                return travel;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setTravel= (travel: Travel) => {
        const user = store.userStore.user;
        if (user) {
            travel.isGoing = travel.attendees.some(a => a.username === user.username)
            travel.isHost = travel.hostUsername === user.username;
            travel.host = travel.attendees?.find(x => x.username === travel.hostUsername);
        }
        travel.date = new Date(travel.date!);
        this.travelRegistry.set(travel.id, travel);
    }

    private getTravel = (id: string) => {
        return this.travelRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createTravel = async (travel: TravelFormValues) => {
            const user = store.userStore.user;
            const attendee = new Profile(user!);
        try {
            await agent.Travelies.create(travel);
            const newTravel = new Travel(travel);
            newTravel.hostUsername = user!.username;
            newTravel.attendees = [attendee];
            this.setTravel(newTravel);
            runInAction(() => {
                
                this.selectedTravel = newTravel;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateTravel = async (travel: TravelFormValues) => {

        try {
            await agent.Travelies.update(travel);
            runInAction(() => {
                if (travel.id) {
                    let updateTravel = {...this.getTravel(travel.id), ...travel}
                    this.travelRegistry.set(travel.id, updateTravel as Travel);
                    this.selectedTravel = updateTravel as Travel;
                }
                
                
            })
        } catch (error) {
            console.log(error);
   
        }
    }

    deleteTravel = async (id: string) => {
        this.loading = true;
        try {
            await agent.Travelies.delete(id);
            runInAction(() => {
                this.travelRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Travelies.attend(this.selectedTravel!.id);
            runInAction(() => {
                if (this.selectedTravel?.isGoing) {
                    this.selectedTravel.attendees = 
                    this.selectedTravel.attendees?.filter(a => a.username !== user?.username);
                    this.selectedTravel.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedTravel?.attendees?.push(attendee);
                    this.selectedTravel!.isGoing = true;
                }
                this.travelRegistry.set(this.selectedTravel!.id, this.selectedTravel!)
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelTravelToggle = async () => {
        this.loading = true;
        try {
            await agent.Travelies.attend(this.selectedTravel!.id);
            runInAction(() => {
                this.selectedTravel!.isCancelled = !this.selectedTravel?.isCancelled;
                this.travelRegistry.set(this.selectedTravel!.id, this.selectedTravel!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }
}