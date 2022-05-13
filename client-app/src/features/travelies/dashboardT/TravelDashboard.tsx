import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import TravelFilters from './TravelFilters';
import TravelList from './TravelList';

export default observer(function TravelDashboard() {
    const {travelStore} = useStore();
    const {loadTravelies, travelRegistry} = travelStore;

    useEffect(() => {
      if (travelRegistry.size <= 1) loadTravelies();
    }, [travelRegistry.size, loadTravelies])
  
    if (travelStore.loadingInitial) return <LoadingComponent content='Loading Travelies...' />

    return (
        <Grid>
            <Grid.Column width='10'>
                <TravelList />
            </Grid.Column>
            <Grid.Column width='6'>
                <TravelFilters />
            </Grid.Column>
        </Grid>
    )
})