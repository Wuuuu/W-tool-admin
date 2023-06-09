import React from 'react';
import ReactMarkdown from 'react-markdown';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { List, Space, Anchor, Button } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import styles from './questionCard.less';

export type QuestionCardItemProps = {
  title: string;
  content: string;
  likeCount?: number;
};

type QuestionCardProps = {
  data?: QuestionCardItemProps[];
  onOpenContentModal: (type: 'update', values: QuestionCardItemProps) => void;
};

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const QuestionCard: React.FC<QuestionCardProps> = ({ data, onOpenContentModal }) => {
  const anchorList = data?.map((item, index) => ({
    key: item.title,
    href: `#${item.title}`,
    title: `${index + 1} ${item.title}`,
  }));
  return (
    <div className={styles.questionCardWarpper}>
      <List
        className={styles.questionCardList}
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          // pageSize: 3,
        }}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            id={item.title}
            key={item.title}
            actions={[
              <IconText icon={StarOutlined} text="999" key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
            ]}
            extra={
              <>
                <Button
                  type="primary"
                  style={{ marginBottom: 16, display: 'block' }}
                  onClick={() => onOpenContentModal('update', item)}
                >
                  更新
                </Button>
                <Button danger>删除</Button>
              </>
            }
          >
            <List.Item.Meta title={<ReactMarkdown>{`${index + 1}.${item.title}`}</ReactMarkdown>} />
            <ReactMarkdown
              // eslint-disable-next-line react/no-children-prop
              children={item.content}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      // eslint-disable-next-line react/no-children-prop
                      children={String(children).replace(/\n$/, '')}
                      // style={dark}
                      language={match[1]}
                      PreTag="div"
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </List.Item>
        )}
      />
      <Anchor offsetTop={65} className={styles.questionCardAnchor} items={anchorList} />
    </div>
  );
};

export default QuestionCard;
