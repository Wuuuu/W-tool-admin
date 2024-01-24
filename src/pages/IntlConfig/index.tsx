import {
  ModalForm,
  PageContainer,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Card, Col, Input, Row, message } from 'antd';
import { getIntlProjectList, addIntlProject } from '@/services/intlConfig';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { useRequest, history } from '@umijs/max';
import { IntlProjectListProps } from './index.d';
import { ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';

const { Meta } = Card;

const projectTypeList = [
  {
    label: '前端',
    value: 'fe',
  },
  {
    label: '后端',
    value: 'be',
  },
  {
    label: 'flutter',
    value: 'flutter',
  },
];

const handleAdd = async (fields: API.IntlProjectProps) => {
  const hide = message.loading('正在添加');
  try {
    await addIntlProject(fields);
    hide();
    message.success('项目添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试!');
    return false;
  }
};

const IntlProjectList = () => {
  const {
    run,
    data: projectList,
    loading,
  } = useRequest(getIntlProjectList, {
    cacheKey: 'getIntlProjectList',
  });

  const modalFormRef = useRef<ProFormInstance>();
  const [searchText, setSearchText] = useState<string>();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.IntlProjectProps>();
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
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCreateModalOpen(true);
              }}
            >
              <PlusOutlined /> 新建项目
            </Button>
          </div>
          <Row gutter={16}>
            {projectList?.map((item: IntlProjectListProps) => (
              <Col span={8} key={item._id} style={{ marginBottom: 24 }}>
                <Card
                  cover={
                    <img
                      alt="cover-img"
                      style={{ height: 220 }}
                      src={
                        item?.coverUrl ||
                        'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                      }
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
      <ModalForm
        title={`新建合集`}
        formRef={modalFormRef}
        layout="horizontal"
        width="500px"
        open={createModalOpen}
        onOpenChange={(open) => {
          if (!open && currentRow) {
            // 每次关闭Modal 清空currentRow 避免在新建时 数据污染
            setCurrentRow(undefined);
            modalFormRef.current?.resetFields();
          }
          setCreateModalOpen(open);
        }}
        onFinish={async (value) => {
          const { coverUrl, ...otherVal } = value;
          const success = await handleAdd({
            ...otherVal,
            coverUrl: coverUrl?.[0]?.response?.data?.url,
          });
          if (success) {
            setCreateModalOpen(false);
            modalFormRef.current?.resetFields();
            run();
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入项目名称',
            },
          ]}
          label="项目名字"
          width="md"
          name="projectName"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择项目类型',
            },
          ]}
          options={projectTypeList || []}
          width="md"
          name="projectType"
          label="项目类型"
        />
        <ProFormUploadButton
          accept=".png, .jpg, .jpeg"
          name="coverUrl"
          label="封面上传"
          rules={[
            {
              required: true,
              message: '请上传封面名称',
            },
          ]}
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` || '' },
          }}
          action="/api/upload/cosUpload"
        />
        <ProFormTextArea label="项目描述" width="md" name="description" />
      </ModalForm>
    </PageContainer>
  );
};

export default IntlProjectList;
