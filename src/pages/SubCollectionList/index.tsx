import { PageContainer } from '@ant-design/pro-components';
import { Card, Tabs } from 'antd';
const SubCollectionList = () => {
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
      >
        <Tabs
          // onChange={onChange}
          tabPosition="left"
          style={{ height: 'calc(100vh - 220px)' }}
          size="large"
          items={new Array(30).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: `Tab ${id}`,
              key: id,
              children: `Content of Tab Pane ${id}`,
            };
          })}
        />
      </Card>
    </PageContainer>
  );
};

export default SubCollectionList;
