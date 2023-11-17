import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table, Tooltip, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { ItemProps, EditableRowProps } from './index.d';
import { initDataSource, initDataItem, generatJsonFiles } from './configData';
import ExportModal from './components/ExportModal';
import { getIntlConfigData, addListConfigData } from '@/services/intlConfig/index';
import { PageContainer } from '@ant-design/pro-components';
import { useParams, useRequest } from '@umijs/max';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof ItemProps;
  record: ItemProps;
  handleSave: (record: ItemProps) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        // rules={[
        //   {
        //     required: true,
        //     message: `${title} is required.`,
        //   },
        // ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24, minWidth: 80, minHeight: 20 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const IntlConfigTable: React.FC = () => {
  const params = useParams();
  const {
    run,
    // data: configData,
    loading,
  } = useRequest(() => getIntlConfigData(params.id), {
    cacheKey: 'getIntlConfigData',
    manual: true,
  });

  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<ItemProps[]>(initDataSource);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [count, setCount] = useState(initDataSource.length);

  const handleLocalStorageSave = (data: ItemProps[]) => {
    localStorage.setItem('intl-data-config', JSON.stringify(data));
  };

  const handleSaveNewData = async (record: ItemProps) => {
    const { key, ...otherCurrentRowData } = record;
    console.log('key', key);
    try {
      const result = await addListConfigData(params?.id, otherCurrentRowData);
      console.log('result', result);
      if (result.success) {
        message.success('保存成功');
      }
    } catch (error) {
      message.warning('保存失败');
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleTranslte = async (record: ItemProps) => {
    console.log('record', record);
    // const result = await googleTranslate(record.desc, {
    //   to: 'en',
    //   proxy: {
    //     host: '192.168.201.4',
    //     port: 8000,
    //     auth: {
    //       username: 'mikeymike',
    //       password: 'rapunz3l',
    //     },
    //   },
    // });
    // console.log('result', result);
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    handleLocalStorageSave(newData);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: '翻译字段',
      dataIndex: 'languageField',
      editable: true,
      fixed: 'left',
      render: (val) => (
        <Tooltip placement="top" title={val}>
          <span style={{ cursor: 'pointer' }}>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '字段描述',
      dataIndex: 'desc',
      editable: true,
      width: 220,
      fixed: 'left',
      render: (val) => (
        <Tooltip placement="top" title={val}>
          <span style={{ cursor: 'pointer' }}>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '印尼语 id',
      dataIndex: 'id',
      editable: true,
    },
    {
      title: '法语 fr',
      dataIndex: 'fr',
      editable: true,
    },
    {
      title: '阿拉伯语 ar',
      dataIndex: 'ar',
      editable: true,
    },
    {
      title: '印地语 hi',
      dataIndex: 'hi',
      editable: true,
    },
    {
      title: '孟加拉语 bn',
      dataIndex: 'bn',
      editable: true,
    },
    {
      title: '老挝语 lo',
      dataIndex: 'lo',
      editable: true,
    },
    {
      title: '越南语 vi',
      dataIndex: 'vi',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: 180,
      render: (_, record: ItemProps) =>
        dataSource.length >= 1 ? (
          <>
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.key)}>
              <a style={{ color: '#dd5044' }}>删除</a>
            </Popconfirm>
            <span
              onClick={() => handleSaveNewData(record)}
              style={{
                display: 'inline-block',
                marginLeft: 8,
                color: '#40a9ff',
                cursor: 'pointer',
              }}
            >
              保存
            </span>
            <span
              onClick={() => handleTranslte(record)}
              style={{
                display: 'inline-block',
                marginLeft: 8,
                color: 'pink',
                cursor: 'pointer',
              }}
            >
              一键翻译
            </span>
          </>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: ItemProps = {
      key: count,
      ...initDataItem,
    };
    setDataSource([newData, ...dataSource]);
    setCount(count + 1);
  };

  const handleSave = (row: ItemProps) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    // const { key, ...otherRowData } = row;
    setDataSource(newData);
    // addListConfigData(params?.id, otherRowData);
    handleLocalStorageSave(newData);
  };

  const handleOpenExportModal = () => {
    setVisible(true);
    // generatJsonFiles(dataSource);
  };

  const hanldeModalOk = (languageVal: string) => {
    if (languageVal !== 'all') {
      let resultObj: any = {};
      dataSource.map((item) => {
        const key = item.languageField;
        return (resultObj[key] = {
          message: item[languageVal],
        });
      });
      generatJsonFiles(resultObj);
    }
    setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  useEffect(() => {
    run().then((res) => {
      const { list } = res;
      setDataSource(list);
    });
  }, [run]);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ItemProps) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <PageContainer>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        新增配置项
      </Button>
      <Button onClick={handleOpenExportModal} style={{ marginLeft: 16 }}>
        导出数据
      </Button>
      <Button
        onClick={() => localStorage.setItem('intl-data-config', '')}
        type="dashed"
        danger
        disabled
        style={{ marginLeft: 16 }}
      >
        清除storage数据
      </Button>
      <Table
        rowKey="_id"
        virtual
        rowSelection={rowSelection}
        loading={loading}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        scroll={{ x: 1200, y: 600 }}
        pagination={false}
      />
      <ExportModal visible={visible} onCancel={() => setVisible(false)} onOk={hanldeModalOk} />
    </PageContainer>
  );
};

export default IntlConfigTable;
