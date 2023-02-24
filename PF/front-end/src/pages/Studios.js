import axios from 'axios';
import React, { useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import GeoLocation from '../components/GeoLocation';
import ChangePage from "../components/ClassList/ChangePage";
import { ToggleButtonGroup, ToggleButton, Card, Button } from 'react-bootstrap';
import SearchStudios from '../components/ClassList/SearchStudios';

const Studios = () => {
    const [studios, setStudios] = useState([])
    const [classNames, setClassNames] = useState([]);
    const [classCoaches, setClassCoaches] = useState([]);
    const [studioAmenities, setStudioAmenities] = useState([]);
    const [studioNames, setStudioNames] = useState([])

    const location = GeoLocation();

    const [nextCall, setNextCall] = useState("http://127.0.0.1:8000/studios/list/");
    const [prevCall, setPrevCall] = useState("http://127.0.0.1:8000/studios/list/");
    const [currCall, setCurrCall] = useState("http://127.0.0.1:8000/studios/list/");
    const [radioValue, setRadioValue] = useState(0);

    // const getStudios = async () => {
    //     const response = await axios.get('http://127.0.0.1:8000/studios/list/')
    //     setStudios(response.data.results)
    //     console.log(studios)
    // }

    // useEffect(() => {
    //     getStudios();
    // }, [])


    const handleRadio = (e) => {
        setRadioValue(e);
    }

    const changePage = (call) => {
        fetch(call, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(response => response.json()
                .then(json => {
                    setStudios(json.results);
                    setCurrCall(call);
                    setPrevCall(json.previous);
                    setNextCall(json.next);
                }))
            .catch(error => console.log(error))
    }

    const nextPage = () => {
        if (nextCall != null) {
            changePage(nextCall);
        }
    };

    const prevPage = () => {
        if (prevCall != null) {
            changePage(prevCall);
        }
    }

    // AXIOS _________________________________________________________________________________________________________
    // const distanceList = () => {
    //     console.log('______________________________AXIOS______________________________')
    //     console.log(params)

    //     const formData = new FormData();
    //     formData.append('lat', location.coordinates['lat']);
    //     formData.append('long', location.coordinates['long']);

    //     // for (const value of formData.values()) {
    //     //     console.log(value);
    //     // }

    //     const url = 'http://127.0.0.1:8000/studios/distancelist/'
    //     axios.get(url, formData, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json',
    //         },
    //     }).then((response) => {
    //         console.log(response);
    //     })
    //     // e.preventDefault();
    //     // navigate('/');

    //     // const response = await axios.get('http://127.0.0.1:8000/studios/distancelist/', { body: JSON.stringify(location.coordinates) })
    //     // setStudios(response.data.results)
    //     // console.log(studios)
    // }

    // useEffect(() => {
    //     getStudios();
    // }, [])


    // FETCH _________________________________________________________________________________________________________
    const distanceList = () => {
        console.log('YAY')
        console.log(
            location.loaded ? JSON.stringify(location.coordinates) : "No location available rn"
        )

        fetch("http://127.0.0.1:8000/studios/distancelist/", {
            method: "POST",
            body: JSON.stringify(location.coordinates),
            headers: {
                "Content-type": "application/json",
            },
        })
            .then(response => response.json()
                .then(json => setStudios(json)))
            .catch(error => console.log(error))
        console.log(studios);

        // return (
        //     <div>
        //         {location.loaded ? JSON.stringify(location.coordinates) : "No location available rn"}
        //     </div>
        // )

    }

    const list = () => {
        console.log("list")

        fetch("http://127.0.0.1:8000/studios/list/", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then(response => response.json()
                .then(json => {
                    // console.log(json.results)
                    setStudios(json.results);
                    GetStudioNames(json.results);
                    GetAmenityNames()
                    GetClassInfo()
                }))
            .catch(error => console.log(error))
        console.log(studios);
    }

    // useEffect(() => {
    //     list();
    // }, [])

    useEffect(() => {
        changePage(currCall);
    }, [])

    const GetAmenityNames = () => {
        fetch("http://127.0.0.1:8000/studios/amenities/", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then(response => response.json()
                .then(json => {
                    let amenitiesList = []
                    const amenitiesResults = json.results
                    amenitiesResults.map(amenity => {
                        if (amenitiesList.indexOf(amenity.type) === -1) amenitiesList.push(amenity.type)
                    })
                    setStudioAmenities(amenitiesList)
                }))
            .catch(error => console.log(error))
    }

    const GetClassInfo = () => {
        fetch("http://127.0.0.1:8000/classes/class-info/", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then(response => response.json()
                .then(json => {
                    setClassNames(json.name)
                    setClassCoaches(json.coaches)
                }))
            .catch(error => console.log(error))
    }

    const GetStudioNames = (results) => {
        let studiosList = []
        const studiosResults = results
        studiosResults.map(studio => {
            if (studiosList.indexOf(studio.name) === -1) studiosList.push(studio.name)
        })
        setStudioNames(studiosList)
    }
    return (
        <div>
            <ChangePage
                prev={prevPage}
                title="Studios"
                next={nextPage}
            />

            <div style={{ textAlign: "center" }}>
                <ToggleButtonGroup type='radio' defaultValue={radioValue} name='option' onChange={handleRadio}>
                    <ToggleButton variant='outline-light' id="radio-1" onClick={list} value={0}>All Studios</ToggleButton>
                    <ToggleButton variant='outline-light' id="radio-2" onClick={distanceList} value={1}>Nearest Studios</ToggleButton>
                </ToggleButtonGroup>
            </div>

            <br />

            <SearchStudios
                classNames={classNames}
                classCoaches={classCoaches}
                studioAmenities={studioAmenities}
                studioNames={studioNames}
            />
            <div className='studios-card-info'>
                {
                    studios?.map((studio, index) => (
                        // <div>
                        //     <h3>{studio.name}</h3>
                        //     <p></p>
                        //     <p><b>Phone:</b> {studio.phone_num}</p>
                        // </div>
                        <Card className='m-2 rounded shadow-lg' style={{ width: '50vh' }}>
                            <Card.Body style={{ flex: 2 }}>
                                <Card.Title class="text-capitalize h4"><b>{studio.name}</b></Card.Title>
                                <Card.Text> <b>Address:</b> {studio.address}, {studio.postal_code} </Card.Text>
                                <Card.Text> <b>Phone:</b> {studio.phone_num} </Card.Text>
                                <Link className="btn btn-primary m-2" to={`/studios/${studio.id}/`}>View Studio!</Link>
                            </Card.Body>
                        </Card>
                    ))
                }
            </div>
        </div>

    );
};

export default Studios;