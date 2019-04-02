import React, { Component } from 'react';
import {getItem} from '../../utils/storage-utils'
import memory from '../../utils/memory-utils'
export default class Admin extends Component {
  constructor(props){
    super(props);
    const user = getItem();
    if(!user || !user._id) {
      return this.props.history.replace('/login')
    }
    memory.user = user;
  }
  render(){
    return(
        <div>
            Admin
        </div>
    )
  }
}
