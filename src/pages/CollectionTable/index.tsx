import {
  addCollection,
  removeRule,
  knowledgeList,
  updateRule,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.CollectionListItem) => {
  const { coverUrl, ...otherFields } = fields;
  const hide = message.loading('正在添加');
  try {
    const params = { ...otherFields, coverUrl: coverUrl?.[0]?.response?.data?.url };
    console.log('params', params);
    await addCollection(params);
    hide();
    message.success('合集添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.collectionName,
      desc: fields.summary,
      key: fields._id,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.CollectionListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row._id),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const CollectionList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CollectionListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.CollectionListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.CollectionListItem>[] = [
    {
      title: <FormattedMessage id="合集名称" defaultMessage="合集名称" />,
      dataIndex: 'collectionName',
      // tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="合集概要" defaultMessage="合集概要" />,
      dataIndex: 'summary',
      // valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="点赞数" defaultMessage="合集点赞数" />,
      dataIndex: 'likeCount',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) =>
        // `${val || 0}${intl.formatMessage({
        //   id: 'pages.searchTable.tenThousand',
        //   defaultMessage: ' 万 ',
        // })}`,
        val ?? '--',
    },
    {
      title: <FormattedMessage id="合集创建时间" defaultMessage="合集创建时间" />,
      sorter: true,
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender }) => {
        return defaultRender(item);
      },
    },
    // {
    //   title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <a
    //       key="config"
    //       onClick={() => {
    //         handleUpdateModalOpen(true);
    //         setCurrentRow(record);
    //       }}
    //     >
    //       <FormattedMessage id="pages.searchTable.config" defaultMessage="Configuration" />
    //     </a>,
    //     <a key="subscribeAlert" href="https://procomponents.ant.design/">
    //       <FormattedMessage
    //         id="pages.searchTable.subscribeAlert"
    //         defaultMessage="Subscribe to alerts"
    //       />
    //     </a>,
    //   ],
    // },
  ];

  return (
    <PageContainer>
      <ProTable<API.CollectionListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        // request={knowledgeList}
        request={async (param) => {
          const res = await knowledgeList(param);
          return {
            ...res.data,
            success: res.success,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {/* {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '} */}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="新建合集"
        layout="horizontal"
        width="500px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.CollectionListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入合集名称',
            },
          ]}
          label="合集名字"
          width="md"
          name="collectionName"
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
        <ProFormTextArea label="合集概要" width="md" name="summary" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.collectionName && (
          <ProDescriptions<API.CollectionListItem>
            column={2}
            title={currentRow?.collectionName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.collectionName,
            }}
            columns={columns as ProDescriptionsItemProps<API.CollectionListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CollectionList;
