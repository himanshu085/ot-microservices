import React from "react";
import { Page, Grid, Table } from "tabler-react";
import SiteWrapper from "./SiteWrapper.react";

class ListSalary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    fetch("http://np-dev-otms-alb-831114106.us-west-2.elb.amazonaws.com:8083/api/v1/salary/search/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        this.setState({ data, loading: false });
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        this.setState({ error: err.message, loading: false });
      });
  }

  render() {
    const { data, loading, error } = this.state;

    if (loading) {
      return (
        <SiteWrapper>
          <Page.Card title="Salary List">
            <div>Loading...</div>
          </Page.Card>
        </SiteWrapper>
      );
    }

    if (error) {
      return (
        <SiteWrapper>
          <Page.Card title="Salary List">
            <div>Error: {error}</div>
          </Page.Card>
        </SiteWrapper>
      );
    }

    return (
      <SiteWrapper>
        <Page.Card title="Salary List">
          <Grid.Col md={12}>
            <Table>
              <Table.Header>
                <Table.ColHeader>Employee ID</Table.ColHeader>
                <Table.ColHeader>Name</Table.ColHeader>
                <Table.ColHeader>Salary</Table.ColHeader>
                <Table.ColHeader>Process Date</Table.ColHeader>
                <Table.ColHeader>Status</Table.ColHeader>
              </Table.Header>
              <Table.Body>
                {data.map((item, i) => (
                  <Table.Row key={item.id || i}>
                    <Table.Col>{item.id}</Table.Col>
                    <Table.Col>{item.name}</Table.Col>
                    <Table.Col>{item.salary.toLocaleString()}</Table.Col>
                    <Table.Col>{item.processDate}</Table.Col>
                    <Table.Col>{item.status}</Table.Col>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Col>
        </Page.Card>
      </SiteWrapper>
    );
  }
}

export default ListSalary;
