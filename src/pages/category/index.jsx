import React, { Component } from 'react';
import { Card, Button, Icon,Table } from 'antd';
import MyButton  from '../../components/my-button';

import './index.less';
export default class Category extends Component {
  render() {
    const columns = [
      {
      title: '品类名称',
      dataIndex: 'name',
    }, {
      title: '操作',
      className: 'operator',
      dataIndex: 'operator',
      render: text => <div>
        <MyButton>修改名称</MyButton>
        <MyButton>查看其子品类</MyButton>
        </div>
    }];
    
    const data = [{
      key: '1',
      name: '手机1',
     
      
    }, {
      key: '2',
      name: '电脑2',
     
    
    }, {
      key: '3',
      name: '鼠标3',
   
     
    }, {
      key: '4',
      name: '手机4',
     
      
    }, {
      key: '5',
      name: '电脑5',
     
    
    }, {
      key: '6',
      name: '鼠标6',
   
     
    },{
      key: '7',
      name: '手机7',
     
      
    }, {
      key: '8',
      name: '电脑8',
     
    
    }, {
      key: '9',
      name: '鼠标9',
   
     
    }, {
      key: '10',
      name: '手机10',
     
      
    }, {
      key: '11',
      name: '电脑11',
     
    
    }, {
      key: '12',
      name: '鼠标12',
     
    }
  ];
    
    
    return (
     
      <Card className="category"
        title="一级分类列表"
        extra={<Button type='primary'><Icon type='plus'/>添加品类</Button>}
     >
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination ={{
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          showQuickJumper: true,
        }}
      
      />
      </Card>

    )
  }
}