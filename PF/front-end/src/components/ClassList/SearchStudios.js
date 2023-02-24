import { Typeahead } from 'react-bootstrap-typeahead';
import TimePicker from 'react-bootstrap-time-picker';
import { Button, Card, Form } from 'react-bootstrap';
import styles from "./ClassCard.module.css";
import { useState } from "react";
import axios from 'axios';


function SearchStudios({ classNames, classCoaches, studioAmenities, studioNames }) {
    const [className, setClassName] = useState([]);
    const [coach, setCoach] = useState([]);
    const [studioName, setStudioName] = useState([])
    const [amenities, setAmenities] = useState([])

    const search = () => {
        const formData = new FormData();
        formData.append('name', className);
        formData.append('coach', coach);
        formData.append('studio_name', studioName);
        formData.append('amenities', amenities)
        for (const value of formData.values()) {
            console.log(value);
        }

        const searchBy = {
            name: `${className}`,
            coach: `${coach}`,
            studio_name: `${studioName}`,
            amenities: `${amenities}`,
        };

        const url = `http://127.0.0.1:8000/studios/filter-studios/`
        axios.get(url, {
            headers: {
                "Content-type": "application/json"
            }
        }).then((res) => {
            console.log(res);
        })
            // fetch("http://127.0.0.1:8000/classes/1/filter-sessions/", {
            //     method: "GET",
            //     body: JSON.stringify(searchBy),
            //     headers: {
            //         "Content-type": "application/json"
            //     },
            // })
            .then((response) =>
                console.log(response)
            )
            .catch((error) => console.log(error));
    }


    return (<Card style={{ width: '85%', margin: 'auto' }}>
        <Card.Body>
            <Card.Title>Search</Card.Title>
            <Typeahead
                id="basic-example"
                onChange={setStudioName}
                options={studioNames}
                placeholder="Choose a studio name..."
                selected={studioName}
            />
            <br />
            <Typeahead
                id="basic-example"
                onChange={setAmenities}
                options={studioAmenities}
                placeholder="Choose an amenity..."
                selected={amenities}
            />
            <br />
            <Typeahead
                id="basic-example"
                onChange={setClassName}
                options={classNames}
                placeholder="Choose a class name..."
                selected={className}
            />
            <br />
            <Typeahead
                id="basic-example"
                onChange={setCoach}
                options={classCoaches}
                placeholder="Choose a coach name..."
                selected={coach}
            />
            <br />
            <Button style={{ float: 'right' }} variant="primary" onClick={search}>Search</Button>
        </Card.Body>
    </Card>)
}

export default SearchStudios