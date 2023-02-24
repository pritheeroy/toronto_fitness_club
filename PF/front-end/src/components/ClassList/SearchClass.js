import { Typeahead } from 'react-bootstrap-typeahead';
import TimePicker from 'react-bootstrap-time-picker';
import { Button, Card, Form } from 'react-bootstrap';
import styles from "./ClassCard.module.css";
import { useEffect, useState } from "react";
import axios from 'axios';


function SearchClass({ classNames, classCoaches }) {
    const [date, setDate] = useState(new Date());
    const [selectedName, setSelectedName] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState([]);
    const [startTime, setStartTime] = useState([])
    const [endTime, setEndTime] = useState([])

    const search = () => {
        const startDateTime = date + "T" + startTime + "Z"
        console.log(startDateTime)
        console.log(endTime)
        const formData = new FormData();
        formData.append('name', selectedName);
        formData.append('coach', selectedCoach);
        formData.append('start_date_time', startDateTime);
        formData.append('end_time', endTime)
        for (const value of formData.values()) {
            console.log(value);
        }
        getStudios()
        const searchBy = {
            name: `${selectedName}`,
            coach: `${selectedCoach}`,
            start_date_time: `${startDateTime}`,
            end_time: `${endTime}`,
        };
    }

    let getStudios = async () => {
        const startDateTime = date + "T" + startTime + "Z"
        let res = await fetch(`http://127.0.0.1:8000/classes/1/filter-sessions/?class_name=${selectedName}&coach=${selectedCoach}&start_date_time=${startDateTime}&end_time=${endTime}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        let data = await res.data
        console.log(data)
    }

    const searchStart = (seconds) => {
        const date = new Date(null);
        date.setSeconds(seconds);
        const time = date.toISOString().slice(11, 19);
        setStartTime(time);
    };

    const searchEnd = (seconds) => {
        const date = new Date(null);
        date.setSeconds(seconds);
        const time = date.toISOString().slice(11, 19);
        setEndTime(time);
    };

    return (<Card style={{ width: '85%', margin: 'auto' }}>
        <Card.Body>
            <Card.Title>Search</Card.Title>
            <Typeahead
                id="basic-example"
                onChange={setSelectedName}
                options={classNames}
                placeholder="Choose a class name..."
                selected={selectedName}
            />
            <br />
            <Typeahead
                id="basic-example"
                onChange={setSelectedCoach}
                options={classCoaches}
                placeholder="Choose a coach name..."
                selected={selectedCoach}
            />
            <br />
            <Form.Control
                type="date"
                name="datepic"
                placeholder="DateRange"
                value={date}
                format='yyyy-MM-dd'
                onChange={(e) => setDate(e.target.value)}
            />
            <br />
            <p>Start time</p>
            <TimePicker
                label="Time"
                value={startTime}
                onChange={searchStart}
            />
            <br />
            <p>End time</p>
            <TimePicker
                label="Time"
                value={endTime}
                onChange={searchEnd}
            />
            <br />
            <Button style={{ float: 'right' }} variant="primary" onClick={search}>Search</Button>
        </Card.Body>
    </Card>)
}

export default SearchClass