import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { List, Space, Anchor } from 'antd';
import rehypeHighlight from 'rehype-highlight';

import styles from './questionCard.less';

type QuestionCardItem = {
  title: string;
  content: string;
  likeCount?: number;
};
type QuestionCardProps = {
  data?: QuestionCardItem[];
};

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const QuestionCard: React.FC<QuestionCardProps> = ({ data }) => {
  const listDomRef = useRef<any>();
  const anchorList = data?.map((item, index) => ({
    key: item.title,
    href: `#${item.title}`,
    title: `${index + 1} ${item.title}`,
  }));
  return (
    <div className={styles.questionCardWarpper} ref={listDomRef}>
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
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
            ]}
            // extra={
            //   <img
            //     width={272}
            //     alt="logo"
            //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            //   />
            // }
          >
            <List.Item.Meta
              // avatar={<Avatar src={item.avatar} />}
              title={<ReactMarkdown>{`${index + 1}.${item.title}`}</ReactMarkdown>}
              // description={item.description}
            />
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{item.content}</ReactMarkdown>
          </List.Item>
        )}
      />
      {/* <Affix offsetTop={10}> */}
      <Anchor
        className={styles.questionCardAnchor}
        getContainer={() => {
          return listDomRef.current;
        }}
        items={anchorList}
      />
      {/* </Affix> */}
    </div>
  );
};

export default QuestionCard;
