import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import {format} from 'date-fns';
import TravelListItemAttendee from "./TravelListItemAttendee";
import { Travel } from "../../../app/models/travel";

interface Props{
    travel: Travel
}

export default function TravelListItem({travel}: Props) {
   
    return (
        <Segment.Group>
            <Segment>
                {travel.isCancelled &&
                <Label attached="top" color="red" content='Cancelled' style={{textAlign: 'center'}} />
            }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/travelies/${travel.id}`}>
                                {travel.title}
                                </Item.Header>
                                <Item.Description>Hosted by {travel.host?.displayName}</Item.Description>
                                {travel.isHost && (
                                    <Item.Description>
                                        <Label basic color="orange">
                                            You are hosting this travel
                                        </Label>
                                    </Item.Description>
                                )}
                                 {travel.isGoing && !travel.isHost &&(
                                    <Item.Description>
                                        <Label basic color="green">
                                            You are hosting to this travel
                                        </Label>
                                    </Item.Description>
                                )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {format(travel.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name="marker" /> {travel.venue}
                </span>
            </Segment>
            <Segment secondary>
                <TravelListItemAttendee attendees={travel.attendees} />
            </Segment>
            <Segment clearing>
                <span>{travel.description}</span>
                <Button as={Link} to={`/travelies/${travel.id}`}
                color='teal'
                floated="right"
                content='View'
                />
            </Segment>
        </Segment.Group>
    )
}