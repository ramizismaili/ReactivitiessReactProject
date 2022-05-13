import { Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

import TravelListItem from './TravelListItem';

export default observer(function TravelList() {

    

    const {travelStore} = useStore();
    const { groupedTravelies } = travelStore;

  
    return (
        <> 
            {groupedTravelies.map(([group, travelies]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                {travelies.map(travel => (
                    <TravelListItem key={travel.id} travel={travel} />
                ))}
                </Fragment>
            ))}
        </>
      
    )
})