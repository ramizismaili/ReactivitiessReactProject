import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import TravelDetailedChat from './TravelDetailedChat';
import TravelDetailedHeader from './TravelDetailedHeader';
import TravelDetailedInfo from './TravelDetailedInfo';
import TravelDetailedSidebar from './TravelDetailedSidebar';

export default observer(function TravelDetails() {
    const {travelStore} = useStore();
    const {selectedTravel: travel, loadTravel, loadingInitial} = travelStore;
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if (id) loadTravel(id);
    }, [id, loadTravel]);

    if (loadingInitial || !travel) return <LoadingComponent />;

    return (
    <Grid>
        <Grid.Column width={10}>
            <TravelDetailedHeader travel={travel} />
            <TravelDetailedInfo travel={travel}/>
            <TravelDetailedChat  />
        </Grid.Column>
        <Grid.Column width={6}>
            <TravelDetailedSidebar travel={travel}/>
        </Grid.Column>
    </Grid>
    )
})