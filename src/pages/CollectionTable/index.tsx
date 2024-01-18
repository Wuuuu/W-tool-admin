import {
  addCollection,
  removeCollection,
  knowledgeList,
  updateCollection,
} from '@/services/ant-design-pro/api';
import { getCollectionTypeList } from '@/services/collection/collectionType';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProTable,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { FormattedMessage, Link, useRequest } from '@umijs/max';
import { Button, Drawer, Image, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
// import type { FormValueType } from './components/UpdateForm';
// import UpdateForm from './components/UpdateForm';

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
    await addCollection(params);
    hide();
    message.success('合集添加成功');
    return true;
  } catch (error) {
    hide();
    // message.error('添加失败，请重试!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.CollectionListItem) => {
  const hide = message.loading('Configuring');
  try {
    const res = await updateCollection({
      collectionName: fields.collectionName,
      summary: fields.summary,
      coverUrl: fields.coverUrl?.[0]?.response?.data?.url,
      id: fields._id,
    });
    hide();
    message.success(res?.data || '更新成功');
    return true;
  } catch (error) {
    hide();
    // message.error('Configuration failed, please try again!');
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
    await removeCollection({
      id: selectedRows.map((row) => row._id),
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

const CollectionTable: React.FC = () => {
  const modalFormRef = useRef<ProFormInstance>();

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CollectionListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.CollectionListItem[]>([]);

  const { data: collectionTypeList, loading } = useRequest(getCollectionTypeList, {
    cacheKey: 'collectionTypeList',
  });
  const handleOk = async (
    e: React.MouseEvent<HTMLElement> | undefined,
    row: API.CollectionListItem,
  ) => {
    setConfirmLoading(true);
    try {
      const res = await removeCollection({
        id: row._id,
      });
      message.success(res.data || '删除成功');
      actionRef.current?.reloadAndRest?.();
    } catch (error) {
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns: ProColumns<API.CollectionListItem>[] = [
    {
      title: '合集名称',
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
      title: '合集类型',
      dataIndex: 'collectionType',
    },
    {
      title: '封面',
      dataIndex: 'coverUrl',
      renderText: (val: string) => {
        return <Image src={val} width={60} />;
      },
    },
    {
      title: '合集概要',
      dataIndex: 'summary',
      // valueType: 'textarea',
    },
    {
      title: '点赞数',
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
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender }) => {
        return defaultRender(item);
      },
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender }) => {
        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="删除该合集？"
          description="删除该合集前，请清空合集内容?"
          onConfirm={(e) => handleOk(e, record)}
          // onCancel={handleCancel}
          okButtonProps={{ loading: confirmLoading }}
          okText="是"
          cancelText="否"
        >
          <a key="config" style={{ color: '#FF4D4F' }}>
            删除
          </a>
        </Popconfirm>,
        <a
          key="update"
          onClick={async () => {
            await setCreateModalOpen(true);
            setCurrentRow(record);
            modalFormRef.current?.setFieldsValue({
              ...record,
              coverUrl: [{ response: { data: { url: record.coverUrl } }, url: record.coverUrl }],
            });
          }}
        >
          更新
        </a>,
        <Link key="detail" to={`/collection/sub-knowledgeCategory/${record._id}`}>
          查看
        </Link>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.CollectionListItem, API.PageParams>
        headerTitle="知识合集列表"
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
              setCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
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
        title={`${currentRow ? '更新' : '新建'}合集`}
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
          const success = !currentRow
            ? await handleAdd(value as API.CollectionListItem)
            : await handleUpdate({ ...value, _id: currentRow._id } as API.CollectionListItem);
          if (success) {
            setCreateModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
              // 数据创建完成时，清空表单数据
              modalFormRef.current?.resetFields();
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
        <ProFormSelect
          disabled={loading}
          rules={[
            {
              required: true,
              message: '请选择合集类型',
            },
          ]}
          options={collectionTypeList || []}
          width="md"
          name="collectionType"
          label="合集类型"
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
      {/* <UpdateForm
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
      /> */}

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

export default CollectionTable;
