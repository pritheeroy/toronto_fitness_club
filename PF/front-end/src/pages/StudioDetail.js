import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Classes from "./Classes";
// import imagee from '/Users/dalshekerchi/group_11159/PF/front-end/src/pages/StudioDetail.js';

const StudioDetail = () => {
  const [studio, setStudio] = useState("");
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const { id } = useParams();

  // const getSingleStudio = async () => {
  //     const { data } = await axios.get(`http://127.0.0.1:8000/studios/${id}/`)
  //     console.log(data)
  //     setStudio(data)
  // }

  // useEffect(() => {
  //     getSingleStudio();
  // }, [])

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/studios/${id}/`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        // "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then((response) =>
        response.json().then((json) => {
          console.log(json);
          setStudio(json);
          setImages(json.images);
          setAmenities(json.amenities);
          console.log(json.amenities.length);
        })
      )
      .catch((error) => console.log(error));
    console.log(studio);
  }, []);

  return (
    <div>
      <div
        style={{ width: "90%", margin: "auto" }}
        className="single-studio-info"
      >
        <br />
        <Card style={{ width: "85%", margin: "auto" }}>
          <Card.Body>
            <Card.Title class="text-capitalize h4">
              <b>{studio.name}</b>
            </Card.Title>
            <Card.Text>
              <b> Address: </b> {studio.address}, {studio.postal_code}
            </Card.Text>
            <Card.Text>
              <b>Phone Number:</b> {studio.phone_num}
            </Card.Text>
            {amenities.length != 0 ? (
              <>
                <Card.Text>
                  <b>Amenities:</b>
                </Card.Text>
                <ListGroup>
                  {amenities.map((amenity) => {
                    return (
                      <>
                        <ListGroupItem>
                          {amenity.type} ({amenity.quantity})
                        </ListGroupItem>
                      </>
                    );
                  })}
                </ListGroup>
                <br />
              </>
            ) : (
              <></>
            )}
            <Button href={studio.directions} target="_blank">
              Directions
            </Button>
          </Card.Body>
        </Card>

        <Classes id={id} />
      </div>
    </div>
  );
};

export default StudioDetail;
