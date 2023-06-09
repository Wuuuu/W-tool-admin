import {
  getSubCategory,
  addSubCategory,
  addQuestionContent,
  removeSubCategory,
  updateQuestionContent,
} from '@/services/ant-design-pro/subCollectionList';
import { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';

import { Button, Card, Modal, Tabs, message } from 'antd';
import { useParams } from '@umijs/max';
import EmptyPage from '@/components/Empty';
import AddSubCategoryModal from './components/AddModal';
import { ExclamationCircleFilled } from '@ant-design/icons';
import AddContentModal from './components/AddContentModal';
import QuestionCard, { QuestionCardItemProps } from './components/QuestionCard';

import styles from './index.less';
// import isEmpty from 'lodash/isEmpty';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
const { confirm } = Modal;

const SubCollectionList = () => {
  const { categoryId } = useParams();
  const contentModalRef = useRef<any>();

  const [activeKey, setActiveKey] = useState<string>();

  // contentModal状态；默认: add 可选值 'add' | 'update'
  const [contentModalType, setContentModalType] = useState<'add' | 'update'>('add');

  // 添加子类别 弹窗状态字段
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [createContentModalOpen, setCreateContentModalOpen] = useState<boolean>(false);
  const [subCategoryData, setSubCategoryData] = useState<API.SubCategoryItem[]>([]);

  const handleRefresh = () => {
    getSubCategory({ categoryId }).then(({ data, code }) => {
      if (data && code === 200) {
        setSubCategoryData(data);
      }
    });
  };

  // 新增子类别/内容数据
  const handleAdd = async (type: string, values: Record<string, any>) => {
    const typeMap = new Map([
      [
        'subCategroy',
        async () => {
          await addSubCategory({ ...values, categoryId });
          message.success('合集子类别添加成功');
          setCreateModalOpen(false);
        },
      ],
      [
        'subCategroyContent-add',
        async () => {
          await addQuestionContent({ ...values, subCategoryId: activeKey });
          message.success('问答内容添加成功');
          setCreateContentModalOpen(false);
        },
      ],
      [
        'subCategroyContent-update',
        async () => {
          await updateQuestionContent(values);
          setCreateContentModalOpen(false);
          message.success('问答内容更新成功');
        },
      ],
    ]);
    const hide = message.loading('正在添加');
    try {
      await typeMap.get(type)?.();
      await handleRefresh();
    } catch (error) {
      console.log('err', error);
    } finally {
      hide();
    }
  };

  const onOpenContentModal = (type: 'add' | 'update') => {
    setContentModalType(type);
    setCreateContentModalOpen(true);
  };

  const onUpdateContentModal = async (type: 'add' | 'update', values?: QuestionCardItemProps) => {
    await onOpenContentModal(type);
    if (type === 'update') {
      await contentModalRef?.current?.onFill(values);
    }
  };

  const updateDataAndActiveKey = async (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    subCategoryData.forEach((item, i) => {
      if (item.subCategoryId === targetKey) {
        lastIndex = i - 1;
      }
    });
    try {
      const { data } = await getSubCategory({ categoryId });
      if (data.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
          newActiveKey = data[lastIndex].subCategoryId;
        } else {
          newActiveKey = data[0].subCategoryId;
        }
      }
      setActiveKey(newActiveKey);
      setSubCategoryData(data);
    } catch (error) {}
  };

  // 删除子类别数据
  const handleDelSubCategory = async (targetSubCategoryId: string) => {
    const hide = message.loading('正在删除');
    try {
      await removeSubCategory(targetSubCategoryId);
      hide();
      message.success('合集子类别删除成功');
      await updateDataAndActiveKey(targetSubCategoryId);
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
        const { list } = subCategoryData?.find((item) => item.categoryId === targetKey) || {};
        if (list?.length) {
          message.warning('问答内容不为空，请清空后重试!');
          return false;
        }
        return handleDelSubCategory(String(targetKey));
      },
      onCancel() {},
    });
  };

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    console.log(targetKey);
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
        // 手动设置初始的activeKey，避免在添加问答项时，拿不到subCategoryId
        setActiveKey(data?.[0]?.subCategoryId);
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
              <Button type="primary" onClick={() => onUpdateContentModal('add')}>
                新增内容
              </Button>
            </div>
            <Tabs
              type="editable-card"
              className={styles.questionsTab}
              tabPosition="left"
              activeKey={activeKey}
              onChange={(activeKey) => setActiveKey(activeKey)}
              hideAdd
              size="large"
              onEdit={onEdit}
              items={subCategoryData?.map(({ subCategoryName, subCategoryId, list }) => {
                return {
                  label: subCategoryName,
                  key: subCategoryId,
                  children: (
                    <>
                      {list && list?.length ? (
                        <QuestionCard data={list} onOpenContentModal={onUpdateContentModal} />
                      ) : (
                        <EmptyPage
                          imageStyle={{ height: 280 }}
                          buttonText="新增问题内容"
                          buttonClick={() => onUpdateContentModal('add')}
                        />
                      )}
                    </>
                  ),
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
      />
      <AddContentModal
        type={contentModalType}
        ref={contentModalRef}
        visible={createContentModalOpen}
        onOk={(value) => handleAdd(`subCategroyContent-${contentModalType}`, value)}
        onOpenChange={(open: boolean) => setCreateContentModalOpen(open)}
      />
    </PageContainer>
  );
};

export default SubCollectionList;
