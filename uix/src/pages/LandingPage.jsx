import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Navbar from "../components/Navbar";

const LandingPage = ({ setLogin }) => {
  const navigateTo = useNavigate();
  const [show, setShow] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loginInfo, setLoginInfo] = useState(null);
  const handlePrivilegeChange = (event) => {
    setSelectedPrivilege(event.target.value);
  };

  const register = async (event) => {
    event.preventDefault();

    const user_id = document.querySelector("#r_userid").value;
    const name = document.querySelector("#r_name").value;
    const email = document.querySelector("#r_email").value;
    const password = document.querySelector("#r_password").value;
    const phone_number = document.querySelector("#r_phoneNumber").value;
    const privilege = selectedPrivilege;

    try {
      if (!user_id || !name || !email || !password || !privilege) {
        alert("Please fill all the fields!");
        return;
      }

      const res = await fetch(
        `http://localhost:3300/registration/${user_id}/${name}/${email}/${password}/${phone_number}/${privilege}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.status === 200) {
        alert(`${data.msg}`);

        handleClose();
      } else {
        alert(
          "Similar credentials already exist in our database, hence choose new credentials and try again."
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const user_id = document.querySelector("#user_id").value;
      const password = document.querySelector("#password").value;

      if (!user_id || !password) {
        alert("Please fill all the fields!");
        return;
      }

      const res = await fetch(
        `http://localhost:3300/authenticate/${user_id}/${password}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );

      const data = await res.json();
      
      console.log(data.userdata);
      if (data.status === 200 && data.userdata.status == "Active") {
        setLogin(data.userdata);
        alert(`Logged in as ${data.userdata.privilege}`);
        navigateTo(`/${data.userdata.privilege}-portal`);
      }
      else if (data.userdata.status == "Suspended") {
        alert(`Your account is suspended, please contact an admin immediately.`);
      } else {
        alert("Please rectify your credentials and try logging in again.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />
      {/* Body */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Codetribute - A seamless, collaborative tool for programmers
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Are you looking for a platform which enhances open-source
              contribution process and gives edge to all the stakeholders in the
              process through it's diverse technology powered by SQL and
              Ethereum Blockchain.
            </p>
          </div>
          <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">
            <div className="relative flex-grow w-full">
              <label for="email" className="leading-7 text-sm text-gray-600">
                User ID
              </label>
              <input
                type="user_id"
                id="user_id"
                name="user_id"
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative flex-grow w-full">
              <label for="passcode" className="leading-7 text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button
              className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              onClick={login}
            >
              Login
            </button>
            <button
              className="text-white bg-green-500 border-0 py-2 my-8 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
              onClick={handleShow}
            >
              Signup
            </button>
          </div>
        </div>
      </section>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Register to Codetribute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                id="r_userid"
                type="userid"
                placeholder="CXX | PXX | AXX | e.g A10"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                id="r_name"
                type="name"
                placeholder="First Last"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                id="r_email"
                type="email"
                placeholder="name@example.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                id="r_password"
                type="password"
                placeholder="*********"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                id="r_phoneNumber"
                type="phoneNumber"
                placeholder="92XXXXXXXXXX"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>As</Form.Label>
              <Form.Control
                as="select"
                onChange={handlePrivilegeChange}
                value={selectedPrivilege}
              >
                <option value="">Select Privilege</option>
                <option value="Contributor">Contributor</option>
                <option value="Publisher">Publisher</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={register}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LandingPage;