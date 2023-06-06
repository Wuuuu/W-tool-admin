import {
  getSubCategory,
  addSubCategory,
  addSubCategoryContent,
  removeSubCategory,
} from '@/services/ant-design-pro/subCollectionList';
import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';

import { Button, Card, Modal, Tabs, message } from 'antd';
import { useParams } from '@umijs/max';
import EmptyPage from '@/components/Empty';
import AddSubCategoryModal from './components/AddModal';
import { ExclamationCircleFilled } from '@ant-design/icons';
import AddContentModal from './components/AddContentModal';
import QuestionCard from './components/QuestionCard';

import styles from './index.less';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const { confirm } = Modal;

const SubCollectionList = () => {
  const { categoryId } = useParams();
  const [activeKey, setActiveKey] = useState<string>();

  // 添加子类别 弹窗状态字段
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [createContentModalOpen, setCreateContentModalOpen] = useState<boolean>(false);
  const [subCategoryData, setSubCategoryData] = useState<API.SubCategoryItem[]>();

  const handleRefresh = () => {
    getSubCategory({ categoryId }).then(({ data, code }) => {
      if (data && code === 200) {
        setSubCategoryData(data);
      }
    });
  };

  // 新增子类别/内容数据
  const handleAdd = async (type: string, value: Record<string, any>) => {
    const typeMap = new Map([
      ['subCategroy', () => addSubCategory({ ...value, categoryId })],
      ['subCategroyContent', () => addSubCategoryContent({ ...value, subCategoryId: activeKey })],
    ]);
    const hide = message.loading('正在添加');
    try {
      await typeMap.get(type)?.();
      hide();
      setCreateModalOpen(false);
      setCreateContentModalOpen(false);
      message.success('合集子类别添加成功');
      handleRefresh();
    } catch (error) {
      hide();
    }
  };

  // 删除子类别数据
  const handleDelSubCategory = async (currentId: string) => {
    const hide = message.loading('正在删除');
    console.log(subCategoryData, currentId);
    const { list } = subCategoryData?.find((item) => item._id === currentId) || {};
    if (list?.length) {
      message.warning('删除前，请清空子类别的内～');
      return false;
    }
    try {
      await removeSubCategory(currentId);
      hide();
      message.success('合集子类别删除成功');
      handleRefresh();
    } catch (error) {
      hide();
    }
  };

  const showPromiseConfirm = (targetKey: TargetKey) => {
    confirm({
      title: '您是否想要删除当前子类别?',
      icon: <ExclamationCircleFilled />,
      content: '在删除之前，请确保子类别的数据为空',
      onOk() {
        handleDelSubCategory(String(targetKey));
        // return new Promise((resolve, reject) => {
        //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        // }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  };

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    console.log(targetKey);
    console.log('action', action);
    if (action === 'add') {
      // add();
    } else {
      // remove(targetKey);
      showPromiseConfirm(targetKey);
    }
  };

  useEffect(() => {
    getSubCategory({ categoryId }).then(({ data, code }) => {
      if (data && code === 200) {
        setSubCategoryData(data);
      }
    });
  }, []);

  const isEmptyStatus = !subCategoryData || subCategoryData.length === 0;
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
      >
        {isEmptyStatus ? (
          <EmptyPage
            imageStyle={{ height: 280 }}
            buttonText="新建子类别"
            buttonClick={() => setCreateModalOpen(true)}
          />
        ) : (
          <>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                新增子类别
              </Button>
              <Button type="primary" onClick={() => setCreateContentModalOpen(true)}>
                新增内容
              </Button>
            </div>
            <Tabs
              type="editable-card"
              // onChange={onChange}
              className={styles.questionsTab}
              tabPosition="left"
              activeKey={activeKey}
              onChange={(activeKey) => setActiveKey(activeKey)}
              hideAdd
              // style={{ height: 'calc(100vh - 220px)' }}
              size="large"
              onEdit={onEdit}
              items={subCategoryData?.map(({ subCategoryName, _id, list }) => {
                return {
                  label: subCategoryName,
                  key: _id,
                  children: <QuestionCard data={list} />,
                };
              })}
            />
          </>
        )}
      </Card>
      <AddSubCategoryModal
        visible={createModalOpen}
        onOk={(value) => handleAdd('subCategroy', value)}
        onOpenChange={(open: boolean) => setCreateModalOpen(open)}
        // onCancel={() => setCreateModalOpen(false)}
      />
      <AddContentModal
        visible={createContentModalOpen}
        onOk={(value) => handleAdd('subCategroyContent', value)}
        onOpenChange={(open: boolean) => setCreateContentModalOpen(open)}
      />
    </PageContainer>
  );
};

export default SubCollectionList;
