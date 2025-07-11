import react, * as React from "react";
import { Page, Grid, Table, Button } from "tabler-react";
import SiteWrapper from "./SiteWrapper.react";
//import { withTransaction } from '@elastic/apm-rum-react';

class ListEmployee extends React.Component {
        constructor(props) {
                super(props)
                this.state = { data: [] }
        }

        loadData() {
                fetch('http://np-dev-otms-alb-831114106.us-west-2.elb.amazonaws.com:8080/api/v1/attendance/search/all')
                        .then(response => response.json())
                        .then(data => {
                                this.setState({data: data })
                })
                        .catch(err => console.error(this.props.url, err.toString()))
        }

        componentDidMount() {
                this.loadData()
        }

  render() {
      return (
          <SiteWrapper>
          <Page.Card
              title="Attendance List"
          ></Page.Card>
          <Grid.Col md={6} lg={10} className="align-self-center">
          <Table>
            <Table.Header>
                 <Table.ColHeader>Employee ID</Table.ColHeader>
<Table.ColHeader>Employee Name</Table.ColHeader>
     <Table.ColHeader>Status</Table.ColHeader>
                 <Table.ColHeader>Date</Table.ColHeader>
            </Table.Header>
            <Table.Body>
           { this.state.data.map((item, i) => {
                return (
                    <Table.Row>
                        <Table.Col>{item.id}</Table.Col>
<Table.Col>{item.name}</Table.Col>
  <Table.Col>{item.status}</Table.Col>
                        <Table.Col>{item.date}</Table.Col>
                    </Table.Row>
                );
                })
            }
            </Table.Body>
            </Table>
          </Grid.Col>
          </SiteWrapper>
      );
  }
}

export default ListEmployee
//export default withTransaction('ListEmployee', 'component')(ListEmployee)
