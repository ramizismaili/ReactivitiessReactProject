import { observer } from 'mobx-react-lite';
import {  useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button,  Header,  Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Formik,  Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';

import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { TravelFormValues } from '../../../app/models/travel';


export default observer(function TravelForm() {
    const history = useHistory();
    const {travelStore} = useStore();
    const {createTravel, updateTravel, 
             loadTravel, loadingInitial} = travelStore;
    const {id} = useParams<{id: string}>();

    const [travel, setTravel] = useState<TravelFormValues>(new TravelFormValues);

    const validationSchema = Yup.object({
        title: Yup.string().required('The travel title is required'),
        description: Yup.string().required('The travel description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    })

    useEffect(() => {
        if (id) loadTravel(id).then(travel => setTravel(new TravelFormValues(travel)))
    }, [id, loadTravel]);

     function handleFormSubmit(travel: TravelFormValues) {
        if (!travel.id) {
            let newTravel = {
                ...travel,
                id: uuid()
            };
            createTravel(newTravel).then(() => history.push(`/travelies/${newTravel.id}`))
        } else {
            updateTravel(travel).then(() => history.push(`/travelies/${travel.id}`))
        }
    }

   
    
    if (loadingInitial) return <LoadingComponent content='Loading travel...' />

    return (
        <Segment clearing>
            <Header content='Travel Details' sub color='teal' />
            <Formik 
            validationSchema={validationSchema}
            enableReinitialize 
            initialValues={travel} 
            onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty}) => (
                     <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='title' placeholder='Title' />
                     <MyTextArea rows={3} placeholder='Description'  name='description' />
                     <MySelectInput options={categoryOptions} placeholder='Category'  name='category' />
                     <MyDateInput 
                      placeholderText='Date'  
                      name='date' 
                      showTimeSelect
                      timeCaption='time'
                      dateFormat='MMMM d, yyyy h:mm aa'
                          />
                          <Header content='Location Details' sub color='teal' />
                     <MyTextInput placeholder='City'  name='city'/>
                     <MyTextInput placeholder='Venue' name='venue'/>
                     <Button 
                     disabled={isSubmitting || !dirty || !isValid}
                     loading={isSubmitting} floated='right' 
                     positive type='submit' content='Submit' />
                     <Button as={Link} to='/travelies' floated='right' type='button' content='Cancel' />
                 </Form>
                )}
            </Formik>
           
        </Segment>
    )
})