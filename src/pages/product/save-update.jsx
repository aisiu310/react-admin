import React, { Component } from 'react';
import { Card, Icon, Form, Input, Button, Cascader, InputNumber, message } from 'antd';

import { reqGetCategories } from '../../api'
import './save-update.less'
import RichTextEditor from './rich-text-editor';

const Item = Form.Item

@Form.create()
class SaveUpdate extends Component {
  constructor(props){
    super(props);

    this.state = {
      options: [],
    }
    this.richtTextEditor = React.createRef();
  }

   formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };

  goBack = () => {
    this.props.history.goBack()
  }

  onChange = (value) => {
    console.log(value)
  }

  submit = (e) => {
    e.preventDefault();

    this.props.from.validateFields((err, value)=> {
      if(!err) {
       
      }
    })
  }

  //加载2级数据
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    this.getCategories(targetOption.value);
  }

  getCategories = async ( parentId ) => {
    
    const result = await reqGetCategories(parentId);

    if (result.status === 0) {
      if (parentId === "0") {
        this.setState({
          options: result.data.map((item) => {
            return {
              label: item.name,
              value: item._id,
              isLeaf: false,
            }
          })
        })
      } else {
        console.log(result.data);
       this.setState({
         options: this.state.options.map((option) => {
           if(option.value === parentId){
             option.children = result.data.map((item) => {
               return {
                 label: item.name,
                 value: item._id
               }
             })
             option.loading = false;
             option.isLeaf = true;
           }
           return option;
         })
       })
      }
    } else {
      message.error(result.msg);
    }
    
  };

  componentDidMount(){
    this.getCategories("0")
  }
  render(){
    const {options} = this.state;
    const { getFieldDecorator } = this.props.form;
    return <Card
    title={<div className="save-update-title" onClick={this.goBack}>
      <Icon className="save-update-icon" type="arrow-left"/>
      <span>添加商品</span>
    </div>}
    >
    <Form {...this.formItemLayout} onSubmit={this.submit}>
      <Item label="商品名称">
       {
         getFieldDecorator('name', 
          {
           rules: [{required: true,
            whiteSpace: true, message: '商品名称不能为空'}]
          })(
          <Input placeholder="请输入商品名称"/>
         )
       }
      </Item>
      <Item label="商品描述">
        {
          getFieldDecorator('desc',
           {
            rules: [{required: true, whiteSpace: true, message: '商品描述不能为空'}]
          })( <Input placeholder="请输入商品描述"></Input>)
        }
      </Item>
      <Item label="选择分类"
        wrapperCol={{
        xs: { span: 24},
        sm: { span: 5 },
      }}
      >
        {
          getFieldDecorator('category',
          {
            rules: [{required: true, 
            message: '请选择商品分类'}]
          })( 
             <Cascader 
            options={options} 
            onChange={this.onChange} 
            placeholder="请选择分类" 
            changeOnSelect
            loadData={this.loadData}
            />
            )
        }
      </Item>

      <Item label="商品价格"
      wrapperCol={{
        xs: { span: 24},
        sm: { span: 5 },
      }}>
        {
          getFieldDecorator('price',
          {
            rules: [{
              required: true,message: '请输入商品价格'}]
          })(
          <InputNumber 
            className="save-update-input-number" 
            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/￥\s?|(,*)/g, '')}
           />)
        }
  
      </Item>
      <Item label="商品详情"
       wrapperCol={{
        xs: { span: 24 },
        sm: { span: 22 },
      }}>
        <RichTextEditor ref={this.richtTextEditor}/>
      </Item>
      <Item>
        <Button className="save-update-button" htmlType="submit" type="primary">提交</Button>
      </Item>
    </Form>
    </Card>
  }
}
export default SaveUpdate