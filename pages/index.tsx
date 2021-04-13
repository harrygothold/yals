import { useState } from 'react';
import Head from 'next/head';
import axios, { AxiosError } from 'axios';
import {
  Layout,
  Form,
  Button,
  Input,
  Typography,
  Alert,
  notification,
} from 'antd';
import styles from '../styles/Home.module.css';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

type ShortenLinkResponse = {
  short_link: string;
};

type ShortenLinkError = {
  error: string;
  error_description: string;
};

type FormValues = {
  link: string;
};

type Status = 'initial' | 'error' | 'success';

const Home = () => {
  const [status, setStatus] = useState<Status>('initial');
  const [message, setMessage] = useState('');
  const [form] = Form.useForm();
  const onFinishedFailed = () => {
    setStatus('error');
    const error = form.getFieldError('link').join(' ');
    setMessage(error);
  };

  const copyToClipboard = () => {
    if (status === 'success') {
      navigator.clipboard.writeText(message);
      return notification.success({
        message: 'Copied to Clipboard',
        placement: 'bottomLeft',
      });
    }
  };

  const onFinish = async ({ link }: FormValues) => {
    try {
      const response = await axios.post<ShortenLinkResponse>(
        '/api/shorten_link',
        { link }
      );
      setStatus('success');
      setMessage(response.data?.short_link);
    } catch (e) {
      const error = e as AxiosError<ShortenLinkError>;
      setStatus('error');
      setMessage(
        error.response.data?.error_description || 'Something went wrong'
      );
    }
  };

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div className={styles.logo}></div>
      </Header>
      <Content className={styles.content}>
        <div className={styles.shortener}>
          <Title level={5}>Copy &amp; Paste your lengthy link</Title>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishedFailed}
          >
            <div className={styles.linkField}>
              <div className={styles.linkFieldInput}>
                <Form.Item
                  name="link"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: 'Please paste a correct link',
                      type: 'url',
                    },
                  ]}
                >
                  <Input
                    placeholder="https://my-super-long-link.com/blah-blah-blah"
                    size="large"
                    type="link"
                  />
                </Form.Item>
              </div>
              <div className={styles.linkFieldButton}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                    size="large"
                  >
                    Shorten!
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          {['error', 'success'].includes(status) && (
            <Alert
              onClick={copyToClipboard}
              showIcon
              style={{ cursor: 'pointer' }}
              message={message}
              type={status as 'error' | 'success'}
            />
          )}
        </div>
      </Content>
      <Footer className={styles.footer}>
        Yet Another Link Shortener (YASL) &copy; 2021
      </Footer>
    </Layout>
  );
};

export default Home;
