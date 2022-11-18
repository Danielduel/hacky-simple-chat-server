import React from "react"
import { Frame, Page, Headline, Sidebar, SideNav, Divider, Layout, BodyText, Card, Form, ButtonGroup, Button, Stack, Icon, Table, TableColumn } from "@servicetitan/design-system";
import { MutationFunction, QueryFunction, useMutation, useQuery, useQueryClient } from "react-query";

const API_URL =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1"
  ? "http://localhost:25123"
  : "/";

const getMessages: QueryFunction<{ author: string; text: string; }[]> = async () => {
  const response = await fetch(`${API_URL}/getMessages`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

const getUsers: QueryFunction<{ name: string; }[]> = async () => {
  const response = await fetch(`${API_URL}/getUsers`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

const getAdminFakeMessages: MutationFunction = async () => {
  const response = await fetch(`${API_URL}/adminFakeMessages`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return;
};

const getAdminClearMessages: MutationFunction = async () => {
  const response = await fetch(`${API_URL}/adminClearMessages`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return;
};

const getAdminRestart: MutationFunction = async () => {
  const response = await fetch(`${API_URL}/adminRestart`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return;
};


const ChatHistory = () => {
  const queryClient = useQueryClient()
  const { isLoading, data, dataUpdatedAt } = useQuery("getMessages", getMessages);

  return (
    <>
      <Layout
        type="support"
        direction="left"
      >
        <Layout.Section>
          <Headline size="medium">Chat history</Headline>

          { dataUpdatedAt ? <BodyText size="small" subdued>Updated at {new Date(dataUpdatedAt).toLocaleTimeString()}</BodyText> : "" }          <br />
          <Button primary loading={isLoading} onClick={() => queryClient.invalidateQueries("getMessages")}>Refresh</Button>
        </Layout.Section>
        <Layout.Section>
          <Table
            data={data}
            scrollable="scrollable"
            style={{ maxHeight: "400px" }}
            loading={isLoading}
          >
            <TableColumn field="author" title="Author" width="200px" />
            <TableColumn field="text" title="Message text" />
          </Table>
        </Layout.Section>
      </Layout>
    </>
  );
};

const UserList = () => {
  const queryClient = useQueryClient()
  const { isLoading, data, dataUpdatedAt } = useQuery("getUsers", getUsers);

  return (
    <>
      <Layout
        type="support"
        direction="left"
      >
        <Layout.Section>
          <Headline size="medium">User list</Headline>
          { dataUpdatedAt ? <BodyText size="small" subdued>Updated at {new Date(dataUpdatedAt).toLocaleTimeString()}</BodyText> : "" }
          <br />
          <Button primary loading={isLoading} onClick={() => queryClient.invalidateQueries("getUsers")}>Refresh</Button>
        </Layout.Section>
        <Layout.Section>
          <Table
            data={data}
            scrollable="scrollable"
            style={{ maxHeight: "400px" }}
            loading={isLoading}
          >
            <TableColumn field="name" title="User name" />
          </Table>
        </Layout.Section>
      </Layout>
    </>
  );
}

const AdminSection = () => {
  const adminFakeMessages = useMutation(getAdminFakeMessages);
  const adminClearMessages = useMutation(getAdminClearMessages);
  const adminRestart = useMutation(getAdminRestart);

  console.log(adminFakeMessages.isError)

  return (
    <Layout
      type="support"
      direction="left"
    >
      <Layout.Section>
        <Headline size="medium">Admin section</Headline>
        <BodyText size="small" subdued>
          Those actions require authorization of the client to use them.
        </BodyText>
      </Layout.Section>
      <Layout.Section>
        <Card className="m-b-1">
          <Stack alignItems='center' spacing={2}>
            <div className="bg-blue-grey-100 d-f align-items-center justify-content-center" style={{ borderRadius: '100%', width: 40, height: 40 }}>
              <Icon name="data_usage" className="c-blue-grey-600" />
            </div>
            <Stack.Item fill>
              <BodyText bold>Add chat messages</BodyText>
              <BodyText subdued>Populates chat with fake messages.</BodyText>
              {adminFakeMessages.isError && <BodyText bold subdued>Something went wrong</BodyText>}
            </Stack.Item>
            <Button fill="subtle" primary iconName="add" loading={adminFakeMessages.isLoading} onClick={() => adminFakeMessages.mutate(null)}/>
          </Stack>
        </Card>
        <Card className="m-b-1">
          <Stack alignItems='center' spacing={2}>
            <div className="bg-blue-grey-100 d-f align-items-center justify-content-center" style={{ borderRadius: '100%', width: 40, height: 40 }}>
              <Icon name="data_usage" className="c-blue-grey-600" />
            </div>
            <Stack.Item fill>
              <BodyText bold>Clear messages</BodyText>
              <BodyText subdued>Removes serverside chat history.</BodyText>
              {adminClearMessages.isError && <BodyText bold subdued>Something went wrong</BodyText>}
            </Stack.Item>
            <Button fill="subtle" primary iconName="add" loading={adminClearMessages.isLoading} onClick={() => adminClearMessages.mutate(null)} />
          </Stack>
        </Card>
        <Card className="m-b-1">
          <Stack alignItems='center' spacing={2}>
            <div className="bg-blue-grey-100 d-f align-items-center justify-content-center" style={{ borderRadius: '100%', width: 40, height: 40 }}>
              <Icon name="redo" className="c-blue-grey-600" />
            </div>
            <Stack.Item fill>
              <BodyText bold>Restart</BodyText>
              <BodyText subdued>Closes all websocket connections, then recreates main manager.</BodyText>
              {adminRestart.isError && <BodyText bold subdued>Something went wrong</BodyText>}
            </Stack.Item>
            <Button fill="subtle" primary iconName="add" loading={adminRestart.isLoading} onClick={() => adminRestart.mutate(null)} />
          </Stack>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

function App() {
  const [active, setActive] = React.useState(0);

  return (
    <>
      <Frame>
        <Page
          header={
            <Headline size="large">
              {
                active === 0 ? "Public panel" : "Admin panel"
              }
            </Headline>
          }
          sidebar={
            <Sidebar localStorageKey="page-layout__settings-page">
              <SideNav title="Control Panel">
                <SideNav.Item onClick={() => setActive(0)} active={active === 0}>Public</SideNav.Item>
                <SideNav.Item onClick={() => setActive(1)} active={active === 1}>Admin</SideNav.Item>
              </SideNav>
            </Sidebar>
          }
        >
          <Divider spacing={2} />
          <ChatHistory />
          <Divider spacing={2} />
          <UserList />
          {
            active === 1 ? (
              <>
                <Divider spacing={2} />
                <AdminSection />
              </>
            ) : <></>
          }
        </Page>
      </Frame>
    </>
  );
}

export default App;
