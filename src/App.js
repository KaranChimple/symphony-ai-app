/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { isEmpty, cloneDeep } from 'lodash';
import './App.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uploadedFile: null,
      uploadedFileData: null,
      tableListToBeShown: [],
      delimiter: ',',
      error: '',
      showError: false,
      noOfLines: 2,
    };
  }

  onImageDrop(files) {
    const { noOfLines } = this.state;
    files.length < 2 &&
      files[0].text().then(txt => {
        const textToBeInserted = txt.split(`\n`);
        this.setState({
          uploadedFile: files[0],
          uploadedFileData: textToBeInserted,
          tableListToBeShown: textToBeInserted,
        }, () => {
          if (noOfLines > 0 && !isEmpty(textToBeInserted) && noOfLines < textToBeInserted.length) {
            const textData = cloneDeep(textToBeInserted);
            textData.splice(noOfLines, textToBeInserted.length - noOfLines);
            this.setState({ tableListToBeShown: textData });
            textData.slice(0, textData.length);
          }
        })
      });
  }

  seperatedText = (text) => {
    const { delimiter } = this.state;
    // const splitText = text.split(/[.:;?!~,`"&|()<>{}\[\]\r\n/\\]+/);
    const splitText = text.split(delimiter);
    return splitText;
  };

  handleDelimiterChange = (event) => {
    if (event.target.value.length < 2) {
      this.setState({
        delimiter: event.target.value,
      });
    }
    else {
      this.setState({
        showError: true,
        error: 'Delimiter cannot be more than one character',
      }, () => {
        setTimeout(() => {
          this.setState({
            showError: false,
          })
        }, 800)
      })
    }
  }

  handleLineNumberChange = (event) => {
    const { uploadedFileData } = this.state;
    if (event.target.value > 0 && !isEmpty(event.target.value)) {
      const lineNumber = event.target.value;
      this.setState({ noOfLines: event.target.value }, () => {
        if (lineNumber < uploadedFileData.length) {
          const textData = cloneDeep(uploadedFileData);
          textData.splice(lineNumber, uploadedFileData.length - lineNumber);
          this.setState({ tableListToBeShown: textData });
          textData.slice(0, textData.length);
        } else {
          this.setState({ tableListToBeShown: uploadedFileData });
        }
      })
    } else {
      this.setState({
        showError: true,
        error: 'Number of Lines should be greater than 0',
        noOfLines: event.target.value,
      }, () => {
        setTimeout(() => {
          this.setState({ showError: false })
        }, 800)
      })
    }
  }

  render() {
    const { delimiter, error, showError, noOfLines, tableListToBeShown } = this.state;
    return (
      <form>
        <div className="FileUpload">
          <Dropzone
            multiple={false}
            onDrop={this.onImageDrop.bind(this)}
          >
            {({ getRootProps, getInputProps }) => {
              return (
                <div
                  style={{ textAlign: 'center', width: '100%' }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {
                    <p>Try dropping some files here, or click to select files to upload.</p>
                  }
                </div>
              )
            }}
          </Dropzone>
        </div>

        <div clasName="parameter-input parent-container">
          <div className="element-input">
            <div>
              Delimiter:
            </div>
            <div style={styles.inputBox}>
              <input type="text" onChange={this.handleDelimiterChange} value={delimiter} />
            </div>
          </div>
          <div className="element-input" style={styles.lowerButton}>
            <div>
              Lines:
            </div>
            <div style={styles.inputBox}>
              <input type="text" onChange={this.handleLineNumberChange} value={noOfLines} />
            </div>
          </div>
        </div>

        {showError && <div className="parent-container">
          {error}
        </div>}

        <div className="parent-container">
          {!isEmpty(this.state.uploadedFile) && !isEmpty(delimiter) &&
            <div style={{ alignItems: 'center', justifyContent: 'center' }}>
              <p>{this.state.uploadedFile.name}</p>
              {tableListToBeShown.map(item =>
                <table>
                  <tbody>
                    <tr>
                      {this.seperatedText(item).map(element => <td>{element}</td>)}
                    </tr>
                  </tbody>
                </table>
              )}
            </div>}
        </div>
      </form>
    )
  }
}

const styles = {
  inputBox: { borderWidth: 1, marginLeft: 5 },
  lowerButton: { marginTop: 10, }
}