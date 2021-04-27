import React, { useState } from "react";
import { Layout, Row, Col } from "antd";
import Countup from "react-countup";
import {
  ShoppingOutlined,
  VideoCameraOutlined,
  ControlOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const Dashboard = () => {
  // components for analysis

  const User = () => {
    return (
      <React.Fragment>
        <Row className="widget-card">
          <Col span={10}>
            <TeamOutlined size="45" className="background-image-widget" />
          </Col>
          <Col span={14}>
            <div className="container-counter">
              <h1 className="text-details">Current users</h1>
              <Countup end={1000} className="counter" />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  };
  const Courses = () => {
    return (
      <React.Fragment>
        <Row className="widget-card2">
          <Col span={10}>
            <VideoCameraOutlined className="background-image-widget2" />
          </Col>
          <Col span={14}>
            <div className="container-counter">
              <h1 className="text-details2">Current users</h1>
              <Countup end={1000} className="counter2" />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  };
  const CouresePaid = () => {
    return (
      <React.Fragment>
        <Row className="widget-card3">
          <Col span={10}>
            <ShoppingOutlined className="background-image-widget3" />
          </Col>
          <Col span={14}>
            <div className="container-counter">
              <h1 className="text-details3">Current users</h1>
              <Countup end={1000} className="counter3" />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  };
  const Admin = () => {
    return (
      <React.Fragment>
        <Row className="widget-card4">
          <Col span={10}>
            <ControlOutlined className="background-image-widget4" />
          </Col>
          <Col span={14}>
            <div className="container-counter">
              <h1 className="text-details4">Current users</h1>
              <Countup end={1000} className="counter4" />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Content>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} lg={12} xl={6}>
            <User />
          </Col>
          <Col xs={24} sm={24} lg={12} xl={6}>
            <Courses />
          </Col>
          <Col xs={24} sm={24} lg={12} xl={6}>
            <CouresePaid />
          </Col>
          <Col xs={24} sm={24} lg={12} xl={6}>
            <Admin />
          </Col>
        </Row>
      </Content>
    </React.Fragment>
  );
};

export default Dashboard;
