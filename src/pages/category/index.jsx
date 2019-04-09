import React, { Component } from "react";
import { Card, Button, Icon, Table, message, Modal } from "antd";
import MyButton from "../../components/my-button";
import AddCategoryForm from "./add-category-form";
import UpdateCategoryNameForm from "./update-category-name-form";

import {
  reqGetCategories,
  reqAddCategory,
  reqUpdateCategoryName
} from "../../api";

import "./index.less";
export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      subCategories: [],
      isShowAddCategoryModal: false,
      isShowUpdateCategoryNameModal: false,
      category: {},
      parentCategory: {},
      isShowSubCategories: false,
      isLoading: true,
    };
    this.createAddForm = React.createRef();
    this.createUpdateForm = React.createRef();
  }

  

  columns = [
    {
      title: "品类名称",
      dataIndex: "name"
    },
    {
      title: "操作",
      className: "operator",
      // dataIndex: "operator",
      render: category => {
        return (
          <div>
            <MyButton onClick={this.showUpdateCategoryNameModal(category)}>
              修改名称
            </MyButton>
            {
              this.state.isShowSubCategories ? null :  <MyButton onClick={this.showSubCategory(category)}>
              查看其子品类
            </MyButton>
            }
          </div>
        );
      }
    }
  ];
  showSubCategory = (parentCategory) => {
    return () => {
      this.setState({
        parentCategory,
        isShowSubCategories: true
      });
      this.getCategories(parentCategory._id);
    };
  };

  showUpdateCategoryNameModal = ( category ) => {
    return () => {
      this.setState({
        category
      });
      this.changeModal("isShowUpdateCategoryNameModal", true)();
    };
  };

  getCategories = async ( parentId ) => {
    this.setState({isLoading: true});

    const result = await reqGetCategories(parentId);
    const options ={isLoading: false};

    if (result.status === 0) {

      // const options = {};

      // if(result.data.length === 0){
      //   this.isLoading = false;

      //   setTimeout (() => {
      //     this.isLoading = true;
      //   },0)
      // }

     
      if (parentId === "0") {
        options.categories = result.data;
      
      } else {
        options.subCategories = result.data;
      }
    } else {
      message.error(result.msg);
    }
    this.setState(options);
  };

  componentDidMount() {
    this.getCategories("0");
  }

  addCategory = () => {
    const { validateFields } = this.createAddForm.current.props.form;
 
    validateFields(async (err, values) => {
      console.log(err, values);

      if (!err) {
        const { parentId, categoryName } = values;
        const result = await reqAddCategory(parentId, categoryName);
        if (result.status === 0) {
          message.success("添加分类成功~");

          const options = {isShowAddCategoryModal: false}
          if(parentId === '0') {
            options.categories= [...this.state.categories, result.data]
         
        }else if(parentId === this.state.parentCategory._id){  
              options.subCategories=
              [...this.state.subCategories, result.data]
          }
          this.setState(options);
        } else {
          message.error(result.msg);
        }
      } else {
        //校验失败
      }
    });
  };

  // 修改分类名称
  updateCategoryName = () => {
    const { validateFields, resetFields } = this.createUpdateForm.current.props.form;
    validateFields(async (err, values) => {
      if (!err) {
        const { categoryName } = values;
        const {
          category: { _id }, isShowSubCategories
        } = this.state;
        const result = await reqUpdateCategoryName(_id, categoryName);
        if (result.status === 0) {
          message.success("更新分类名称成功");
          let name = "categories";
          if (isShowSubCategories) {
            name = 'subCategories'
          }
          this.setState({
            isShowUpdateCategoryNameModal: false,
           [name]:this.state[name].map((category) => {
              if (category._id === _id)
                return { ...category, name: categoryName };
              return category;
            })
          });
          resetFields();
        } else {
          message.error(result.msg);
        }
      }
    });
  };

  changeModal = (name, isShow) => {
    return () => {
      if(name === 'isShowUpdateCategoryNameModal' && isShow === false)this.createUpdateForm.current.props.form.resetFields()
      this.setState({
        [name]: isShow
      })
    }
  }
  goBack = () => {
    this.setState({
      isShowSubCategories: false
    })
  }
  render() {
    const {
      categories,
      subCategories,
      isShowAddCategoryModal,
      isShowUpdateCategoryNameModal,
      category: { name },
      parentCategory,
      isShowSubCategories,
      isLoading
    } = this.state;

    return (
      <Card
        className="category"
        title={isShowSubCategories? <div><MyButton onClick={this.goBack}>一级分类</MyButton><Icon type='arrow-right'/><span>{parentCategory.name}</span></div>:'一级分类列表'}
        extra={
          <Button type="primary" onClick={this.changeModal('isShowAddCategoryModal',true)}>
            <Icon type="plus" />
            添加品类
          </Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={isShowSubCategories ? subCategories: categories}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["3", "6", "9", "12"],
            defaultPageSize: 3,
            showQuickJumper: true
          }}
          rowKey="_id"

          // loading={isShowSubCategories
          //   ? this.isLoading&& !subCategories.length 
          //   : this.isLoading && !categories.length}
          loading={isLoading}
        />

        <Modal
          title="添加分类"
          visible={isShowAddCategoryModal}
          onOk={this.addCategory}
          onCancel={this.changeModal("isShowAddCategoryModal", false)}
          okText="确认"
          cancelText="取消"
        >
          <AddCategoryForm
            categories={categories}
            wrappedComponentRef={this.createAddForm}
          />
        </Modal>

        <Modal
          title="修改分类名称"
          visible={isShowUpdateCategoryNameModal}
          onOk={this.updateCategoryName}
          onCancel={this.changeModal("isShowUpdateCategoryNameModal", false)}
          okText="确认"
          cancelText="取消"
          width={300}
        >
          <UpdateCategoryNameForm
            categoryName={name}
            wrappedComponentRef={this.createUpdateForm}
          />
        </Modal>
      </Card>
    );
  }
}
