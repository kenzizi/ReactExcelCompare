import { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import readXlsxFile from "read-excel-file";

import { Container, Grid, Segment } from "semantic-ui-react";
import { Table, Button, Icon } from "semantic-ui-react";

const App = () => {
  const [File1, setFile1] = useState([]);
  const [File2, setFile2] = useState([]);
  const [Result, setResult] = useState([]);

  const handleFile = (e) => {
    const name = e.target.files[0].name;
    const ext = name.substring(name.lastIndexOf(".") + 1);
    let ReadFile = e.target.files[0];
    let a = [];
    if (
      !e ||
      !e.target ||
      !e.target.files ||
      e.target.files.length === 0 ||
      ext.toLowerCase() !== "xlsx"
    ) {
      console.log("invalide file");
    }

    if (e.target.id === "file1") {
      readXlsxFile(ReadFile).then((rows) => {
        a = rows.map((e) => {
          return e.map((j) => {
            return j === null ? "" : j;
          });
        });
        setFile1(a);
      });
    }
    if (e.target.id === "file2") {
      readXlsxFile(ReadFile).then((rows) => {
        setFile2(rows);
        a = rows.map((e) => {
          return e.map((j) => {
            return j === null ? "" : j;
          });
        });
        setFile2(a);
        console.log(File2.size);
      });
    }
  };
  const fillRows = () => {
    if (File1.length < File2.length) {
      setFile1((File1) => {
        return File1.concat(
          new Array(File2.length - File1.length).fill(
            new Array(File1[0].length).fill("")
          )
        );
      });
    } else {
      setFile2((File2) => {
        return File2.concat(
          new Array(File1.length - File2.length).fill(
            new Array(File2[0].length).fill("")
          )
        );
      });
    }
  };
  const fillColumns = () => {
    if (File1[0].length < File2[0].length) {
      setFile1((File1) => {
        return File1.map((e, i) => {
          return e.concat(
            new Array(File2[0].length - File1[0].length).fill("")
          );
        });
      });
    } else {
      setFile2((File2) => {
        return File2.map((e, i) => {
          return e.concat(
            new Array(File1[0].length - File2[0].length).fill("")
          );
        });
      });
    }
  };
  const handleCompare = () => {
    fillRows();
    fillColumns();
  };

  const ShowResult = () => {
    let result = File1.map((rows, rowInd) => {
      return rows.map((column, colInd) => {
        return File1[rowInd][colInd] === File2[rowInd][colInd]
          ? { value: File1[rowInd][colInd], isDiff: false }
          : { value: File1[rowInd][colInd], isDiff: true };
      });
    }).map((tab, i) => {
      return (
        <Table.Row key={i}>
          {tab.map((column, j) => {
            return (
              <Table.Cell error={column.isDiff ? true : false} key={i + "" + j}>
                {column.isDiff && <Icon name="attention" />}
                {column.value === "" ? "N/A" : column.value}
              </Table.Cell>
            );
          })}
        </Table.Row>
      );
    });

    setResult(result);
  };
  return (
    <Container>
      <Grid container doubling>
        <Grid.Row columns={3} divided stretched verticalAlign={"middle"}>
          <Grid.Column textAlign="center">
            <Segment>
              <div>
                <label htmlFor="file1" className="ui icon button">
                  <i className="file icon"></i>
                  Open File 1
                </label>
                <input
                  type="file"
                  id="file1"
                  name="File1"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>
            </Segment>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Segment className="segment-color"> Compare with</Segment>
            <Segment>
              <Button.Group>
                <Button onClick={handleCompare}>Compare</Button>
                <Button.Or text="&" />
                <Button positive onClick={ShowResult}>
                  Show Result
                </Button>
              </Button.Group>
            </Segment>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Segment>
              <div>
                <label htmlFor="file2" className="ui icon button">
                  <i className="file icon"></i>
                  Open File 2
                </label>
                <input
                  type="file"
                  id="file2"
                  name="File2"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table celled>
        <Table.Header>{Result}</Table.Header>
      </Table>
    </Container>
  );
};

export default App;
