import React, { useEffect, useState, useContext } from "react";
import {
  DeleteButton,
  EditButton,
  Button,
  Input,
  SearchInput,
  Select,
  OptionsTd,
  OptionsTh,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  FormLayout,
  Tabs,
  IndexNo,
} from "../../../components";
import { RiEdit2Line } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import axios from "../../../services/axios";
import ReactPagination from "../../ReactPagination";
import { loginContext } from "../../../pages/context/auth";
import TotalNo from "../../TotalNo";
import { toast } from "react-toastify";
import ButtonPreloader from "../../ButtonPreloader";

function Patients({ role }) {
  const { user } = useContext(loginContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    sex: "",
    dob: "",
    age: "",
    bloodgroup: "",
    tor: "",
  });

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  function handleChange(e) {
    const { name, value } = e.target;
    
    if (name === "dob") {
      const calculatedAge = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        dob: value,
        age: calculatedAge
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  function getPatients() {
    axios
      .get("/patient")
      .then((response) => {
        setPatients(response.data);
      })
      .catch((response) => {
        toast.error(response.data);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure age is sent as a number
    const payload = {
      ...formData,
      age: parseInt(formData.age)
    };

    axios
      .post("/patient", payload)
      .then((res) => {
        setLoading(false);
        getPatients();
        setFormData({
          name: "",
          email: "",
          address: "",
          phone: "",
          sex: "",
          dob: "",
          age: "",
          bloodgroup: "",
          tor: "",
        });
        toast.success(res.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data || "An error occurred");
      });
  };

  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getPatients();
  }, []);

  const search = (data) => {
    axios.get(`/patient?q=${data}`).then((response) => {
      setPatients(response.data);
      setCurrentPage(1);
    });
  };

  const postsPerPage = 10;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = patients.slice(indexOfFirstPost, indexOfLastPost);
  const pageCount = Math.ceil(patients.length / postsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <Tabs
      label1="Patients"
      content1={
        <div>
          <div className="flex justify-between items-center">
            <SearchInput onSearch={search} />
            <div className="items-center flex flex-col lg:flex-row">
              <TotalNo totalnumber={patients?.length} />
              <ReactPagination pageCount={pageCount} handlePageClick={handlePageClick} />
            </div>
          </div>
          <Table>
            <Thead>
              <IndexNo>#</IndexNo>
              <Th>Reg. Id</Th>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Sex</Th>
              <Th>Age</Th>
              <Th>Blood Group</Th>
              <Th>Time Of Registration</Th>
              <OptionsTh>Options</OptionsTh>
            </Thead>
            {currentPosts.map((patient, i) => {
              return (
                <Tbody key={i}>
                  <Td>{i + 1 * (currentPage * postsPerPage - 9)}</Td>
                  <Td className="font-bold">{patient?.registrationId}</Td>
                  <Td>{patient?.name}</Td>
                  <Td>{patient?.phone}</Td>
                  <Td>{patient?.sex}</Td>
                  <Td>{patient?.age}</Td>
                  <Td>{patient?.bloodgroup}</Td>
                  <Td>{patient?.tor}</Td>
                  <OptionsTd>
                    <EditButton editFunction={`${role}/edit_patient?edit=${patient?._id}`}>
                      Edit
                      <RiEdit2Line />
                    </EditButton>
                    <DeleteButton path={"patient"} id={patient?._id} record={getPatients}>
                      Delete
                      <MdDeleteForever />
                    </DeleteButton>
                  </OptionsTd>
                </Tbody>
              );
            })}
          </Table>
        </div>
      }
      label2="Add Patient"
      content2={
        <FormLayout formName="ADD PATIENT">
          <form onSubmit={handleSubmit}>
            <Input label="Name" type="text" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Input label="Address" type="text" name="address" value={formData.address} onChange={handleChange} required />
            <Input label="Phone Number" type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            <Select label="Sex" name="sex" value={formData.sex} onChange={handleChange} required>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
            <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            <Input label="Age" type="number" name="age" value={formData.age} readOnly />
            <Select label="Blood Group" name="bloodgroup" value={formData.bloodgroup} onChange={handleChange} required>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
            <Input label="Time Of Registration" type="datetime-local" name="tor" value={formData.tor} onChange={handleChange} required />
            <Button>{loading ? <ButtonPreloader /> : "Add Patient"}</Button>
          </form>
        </FormLayout>
      }
    />
  );
}

export default Patients;