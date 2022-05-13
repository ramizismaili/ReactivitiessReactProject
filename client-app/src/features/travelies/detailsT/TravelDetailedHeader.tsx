import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import { Travel } from '../../../app/models/travel';
import { useStore } from '../../../app/stores/store';

const travelImageStyle = {
    filter: 'brightness(30%)'
};

const travelImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    travel: Travel
}

export default observer (function TravelDetailedHeader({travel}: Props) {
    const {travelStore: {updateAttendance, loading, cancelTravelToggle}} = useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {travel.isCancelled && 
                <Label style={{position: 'absolute', zIndex: 1000, left: -14, top: 20}}
                ribbon color='red' content='Cancelled' />
                }
                <Image src={`/assets/categoryImages/${travel.category}.jpg`} fluid style={travelImageStyle}/>
                <Segment style={travelImageTextStyle} basic> // tt T
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={travel.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(travel.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profiles/${travel.host?.username}`}>{travel.host?.displayName}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {travel.isHost ? (
                    <>
                    <Button 
                        color={travel.isCancelled ? 'green' : 'red'}
                        floated='left'
                        basic
                        content={travel.isCancelled ? 'Re-activate' : 'Cancel Travel'}
                        onClick={cancelTravelToggle}
                        loading ={loading}
                    />
                         <Button as={Link}
                         disabled={travel.isCancelled}
                          to={`/manage/${travel.id}`}
                           color='orange' 
                           floated='right'>
                            Manage Event
                        </Button>
                    </>
                 
                ) : travel.isGoing ? (
                    <Button loading={loading} onClick={updateAttendance}>Cancel attendance</Button>
                ) : (
                    <Button disabled={travel.isCancelled}
                     loading={loading} onClick={updateAttendance} color='teal'>Join Travel</Button>
                )}
            </Segment>
        </Segment.Group>
    )
})