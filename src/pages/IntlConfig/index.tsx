import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Input, Row } from 'antd';
import { getIntlProjectList } from '@/services/intlConfig';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest, history } from '@umijs/max';
import { IntlProjectListProps } from './index.d';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Meta } = Card;

const IntlProjectList = () => {
  const { data: projectList, loading } = useRequest(getIntlProjectList, {
    cacheKey: 'getIntlProjectList',
  });

  const [searchText, setSearchText] = useState<string>();

  const onSearch = () => {};

  const handleGoToDetailPage = (id: string) => {
    history.push(`/intl-config/project-detail/${id}`);
  };

  useEffect(() => {}, []);

  return (
    <PageContainer>
      <Card loading={loading} className={styles.intlCardWrapper}>
        <div className={styles.serchFormWrapper}>
          <span className={styles.formLabelText}>项目名称:</span>
          <Input.Search
            placeholder="请输入"
            enterButton="搜索"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onSearch={onSearch}
            style={{ width: 320 }}
          />
        </div>
        <Card style={{ marginTop: 32 }}>
          <Row gutter={16}>
            {projectList?.map((item: IntlProjectListProps) => (
              <Col span={8} key={item._id}>
                <Card
                  cover={
                    <img
                      alt="example"
                      style={{ height: 220 }}
                      src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                    />
                  }
                  bordered
                >
                  <Meta
                    title={
                      <div
                        className={styles.projectCardItem}
                        onClick={() => handleGoToDetailPage(item._id)}
                      >
                        {item.projectName}
                        <ArrowRightOutlined />
                      </div>
                    }
                    description=""
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Card>
    </PageContainer>
  );
};

export default IntlProjectList;
