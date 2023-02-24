import { useState, useEffect } from "react";
import ClassCard from "../components/ClassList/ClassCard";
import ChangePage from "../components/ClassList/ChangePage";
import Popup from "../components/Popup";

function UserSchedule() {
  const [classSets, setClassSet] = useState([]);
  const [nextCall, setNextCall] = useState(
    "http://127.0.0.1:8000/classes/user-schedule/"
  );
  const [prevCall, setPrevCall] = useState(
    "http://127.0.0.1:8000/classes/user-schedule/"
  );
  const [currCall, setCurrCall] = useState(
    "http://127.0.0.1:8000/classes/user-schedule/"
  );
  const [popUpShow, setpopUpShow] = useState(false);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    changePage(currCall);
  }, []);

  const changePage = (call) => {
    fetch(call, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) =>
        response.json().then((json) => {
          setClassSet(json.results);
          setCurrCall(call);
          setPrevCall(json.previous);
          setNextCall(json.next);
        })
      )
      .catch((error) => console.log(error));
  };
  const nextPage = () => {
    if (nextCall != null) {
      changePage(nextCall);
    }
  };
  const prevPage = () => {
    if (prevCall != null) {
      changePage(prevCall);
    }
  };

  const DropClassSet = (id) => {
    console.log("HEREEE");
    console.log(id);
    fetch(`http://127.0.0.1:8000/classes/${id}/drop-class-set/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) =>
        response.json().then((json) => {
          setMessage(json);
        })
      )
      .catch((error) => console.log(error));

    setpopUpShow(true);
  };

  const DropClassSession = (id) => {
    console.log("Class Session");
    fetch(`http://127.0.0.1:8000/classes/${id}/drop-class-session/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) =>
        response.json().then((json) => {
          setMessage(json);
        })
      )
      .catch((error) => console.log(error));

    setpopUpShow(true);
  };

  const refresh = () => {
    setpopUpShow(false);
    changePage(currCall);
  };

  return (
    <>
      <ChangePage prev={prevPage} title="My Schedule" next={nextPage} />
      {classSets.map((classSet) => {
        return (
          <>
            <ClassCard
              name={classSet.name}
              description={classSet.description}
              coach={classSet.coach}
              enrolled={classSet.enrolled}
              date={classSet.start_date_time.slice(0, 10)}
              startTime={classSet.start_date_time.slice(11, 16)}
              endTime={classSet.end_time.slice(0, 5)}
              enrolSet={() => DropClassSet(classSet.id)}
              enrolSession={() => DropClassSession(classSet.id)}
              btnSession={"Drop Class Session"}
              btnSet={"Drop Class Set"}
            />
          </>
        );
      })}
      <Popup
        show={popUpShow}
        onHide={refresh}
        title="Drop Class Status"
        message={message}
      />
    </>
  );
}

export default UserSchedule;
