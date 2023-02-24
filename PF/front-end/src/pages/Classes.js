import { useState, useEffect } from "react";
import ClassCard from "../components/ClassList/ClassCard";
import ChangePage from "../components/ClassList/ChangePage";
import Popup from "../components/Popup";
import SearchClass from "../components/ClassList/SearchClass";

function Classes({ id }) {
  const [classSets, setClassSet] = useState([]);
  const [nextCall, setNextCall] = useState(
    `http://127.0.0.1:8000/classes/${id}/class-list/`
  );
  const [prevCall, setPrevCall] = useState(
    `http://127.0.0.1:8000/classes/${id}/class-list/`
  );
  const [currCall, setCurrCall] = useState(
    `http://127.0.0.1:8000/classes/${id}/class-list/`
  );
  const [popUpShow, setpopUpShow] = useState(false);
  const [message, setMessage] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [classCoaches, setClassCoaches] = useState([]);

  useEffect(() => {
    changePage(currCall);
  }, []);

  const changePage = (call) => {
    fetch(call, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) =>
        response.json().then((json) => {
          setClassSet(json.results);
          setCurrCall(call);
          setPrevCall(json.previous);
          setNextCall(json.next);
          GetClassNames(json.results);
          GetCoachNames(json.results);
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

  const EnrolClassSet = (id) => {
    fetch(`http://127.0.0.1:8000/classes/${id}/enrol-class-set/`, {
      method: "GET",
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

  const EnrolClassSession = (id) => {
    console.log("Class Session");
    fetch(`http://127.0.0.1:8000/classes/${id}/enrol-class-session/`, {
      method: "POST",
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

  const GetClassNames = (classes) => {
    let names = [];
    classes.map((classes) => {
      if (names.indexOf(classes.name) === -1) names.push(classes.name);
    });
    setClassNames(names);
  };

  const GetCoachNames = (classes) => {
    let names = [];
    classes.map((classes) => {
      if (names.indexOf(classes.coach) === -1) names.push(classes.coach);
    });
    setClassCoaches(names);
  };
  const refresh = () => {
    setpopUpShow(false);
    changePage(currCall);
  };

  return (
    <>
      <br />
      <ChangePage prev={prevPage} title="Classes" next={nextPage} />
      <SearchClass classNames={classNames} classCoaches={classCoaches} />
      <br />
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
              enrolSet={() => EnrolClassSet(classSet.id)}
              enrolSession={() => EnrolClassSession(classSet.id)}
              btnSession={"Enrol Class Session"}
              btnSet={"Enrol Class Set"}
            />
          </>
        );
      })}
      <Popup
        show={popUpShow}
        onHide={refresh}
        title="Class Enrollment Status"
        message={message}
      />
    </>
  );
}

export default Classes;
