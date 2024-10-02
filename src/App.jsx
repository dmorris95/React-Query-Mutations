import PostList from './components/PostList';
import PostForm from './components/PostForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

const queryClient = new QueryClient();

const App = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const resetSelectedPost = () => {
    setSelectedPost(null);
  };


  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <Row>
          <h1 className='text-center m-4'>The CRUD Post Application</h1>
          <Col>
            <PostList onPostClick={handlePostClick}/>
          </Col>
          <Col>
            <PostForm post={selectedPost} resetSelectedPost={resetSelectedPost}/>
          </Col>
        </Row>
      </Container>
    </QueryClientProvider>
  );
}

export default App
