import React from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'

export default class RichTextEditor extends React.Component {

    state = {
        editorState: BraftEditor.createEditorState(null)
    }
  
    componentDidMount () {
      // 假设此处从服务端获取html格式的编辑器内容
      const htmlContent = "aaaaaa"
      // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
      this.setState({
        editorState: BraftEditor.createEditorState(htmlContent)
      })
    }
  
    handleEditorChange = (editorState) => {
      this.setState({ editorState })
    }
  
    render () {
  
      const { editorState } = this.state
  
      return (
        <div style={{border: '1px solid #d9d9d9', height: 400,borderRadius: 4}}>
          <BraftEditor
            value={editorState}
            onChange={this.handleEditorChange}
            
          />
        </div>
      )
  
    }
  
  }