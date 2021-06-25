import React,{useState,useEffect} from "react";
import { Button, Skeleton, Table, Tag,message } from "antd";

import axios from 'axios';
const getToken = localStorage.getItem('token')

const ApprovedPromotion = () => {

  const [loading ,setLoading] = useState(false);
  const [data, setData] = useState([]);

  const auth = {
    Authorization: "Bearer " + getToken,
  };

  const myData = () =>{
    axios({
      method: "GET",
      url: "http://localhost:5000/api/admin/approved-discount",
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setData(res.data.approved);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }


  useEffect(() => {
    setLoading(true);
    myData();
  }, []);

  const handleBanUser = (id) =>{
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "PUT",
      url: `http://localhost:5000/api/admin/disapprove-discount/${id}`,
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        message.success(res.data.message);
        myData();
      })
      .catch((err) => console.log(err));
  }

  const columns = [
    {
      title: "Full Name",
      width: "15%",
      dataIndex: "fullname",
      key: "fullname",
    },

    {
      title: "Published Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role === "Teacher" || role === "teacher") {
          return <Tag color="processing">{role}</Tag>;
        } else {
          return <Tag color="warning">{role}</Tag>;
        }
      },
    },
    {
      title: "Descriptions",
      dataIndex: "desc",
      key: "desc",
    },

    {
      title: "APPROVE",
      dataIndex: "approved",
      key: "approved",
      render: (approved, data) => {
        const {id} = data
        if(approved){
          return (
            <React.Fragment>
              <Button  type="primary" danger onClick={() => handleBanUser(id)}>Ban</Button>
            </React.Fragment>
          );
        }else{
          return (
            <React.Fragment>
              <Button  type="primary" onClick={handleBanUser}>Approve</Button>
            </React.Fragment>
          );
        }
        
      },
    },
  ];

  if(loading){
    return <Skeleton active/>
  }

  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={data} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default ApprovedPromotion;
