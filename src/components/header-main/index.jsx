import React, { Component } from "react";
import { Col, Row, Modal, message } from "antd";
import dayjs from 'dayjs';

import { withRouter } from 'react-router-dom';
import MyButton from '../my-button';

import {reqWeather} from '../../api'
import { removeItem } from '../../utils/storage-utils';
import memory from "../../utils/memory-utils";
import menuList from '../../config/menu-config'

import './index.less';

@withRouter
class HeaderMain extends 
Component {
  state = {
    sysTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png',
    weather: '晴'
  }
  logout = () => {
    Modal.confirm({
      title: '您确认要退出登录么?',
      onOK: () => {
        memory.user = {}
        removeItem();
        this.props.history.replace('./login');
      },
      okText: '确认',
      cancelText: '取消'
    })
  }

  componentDidMount() {
    this.intervalId = setInterval (() =>{
      this.setState ({
        sysTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
    },1000)

    reqWeather('深圳')
    .then(res => {
      this.setState({
        weatherImg:res.weatherImg,
        weather: res.weather
      })
    })
    .catch(err => message.error(err), 2)
  }
  //移除定时器
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  gitTitle = () => {
    const {pathname} = this.props.location;
    for (let i = 0, length = menuList.length; i < length; i++){
      const menu = menuList[i];
      const children = menu.children;
      if(children){
        for(let j = 0, length=children.length; j<length; j++){
          const item = children[j];
          if(pathname === item.key)
        return item.title;
        }
      } else {
        if(pathname === menu.key)
        return menu.title;
        
      }
    }
  }
  

  render() {
    const { sysTime, weather, weatherImg } = this.state;
    const title = this.gitTitle();
    const username = memory.user.username;
    return (
      <div className={"header-main"}>
        <Row className="header-main-top">
          <span>欢迎,{username}</span>
          <MyButton onClick={this.logout}>退出</MyButton>
        </Row>
        <Row className="header-main-bottom">
          <Col className="header-main-left" span={6}>
            {title}
          </Col>
          <Col className="header-main-right" span={18}>
            <span>{sysTime}</span>
            <img src={weatherImg} alt="天气" />
            <span>{weather}</span>
          </Col>
        </Row>
      </div>
    );
  }
}
export default HeaderMain;