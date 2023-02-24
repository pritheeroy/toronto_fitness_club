import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";

function NavBar() {
  // TODO: FIX THIS!!!
  let navigate = useNavigate();
  const userLogout = (e) => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          <Nav className="container-fluid">
            <Nav.Item>
              <Navbar.Brand as={Link} to="/">
                <img
                  alt=""
                  src="./tfc.png"
                  width="120"
                  height="70"
                  className="d-inline-block align-middle"
                />{" "}
                Toronto Fitness Club
              </Navbar.Brand>
            </Nav.Item>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/studios">
                  Studios
                </Nav.Link>
                <Nav.Link as={Link} to="/subscriptions">
                  Subscriptions
                </Nav.Link>
              </Nav>

              {localStorage.getItem("token") ? (
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/user">
                    My Account
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/userschedule">
                    My Schedule
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/editsubscription">
                    My Subscription
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/updatepayment">
                    My Payment Details
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/paymenthistory">
                    My Payment History
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={userLogout}>
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Item className="ml-auto">
                  <Nav.Link as={Link} to="/login">
                    Login/Register
                  </Nav.Link>
                  {/* <Nav.Link>Hi fname lname!</Nav.Link> */}
                </Nav.Item>
              )}
            </Navbar.Collapse>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
