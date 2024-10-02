import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Card, Button, Spinner, Alert } from "react-bootstrap";

const fetchPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
        throw new Error('Network response was not good');
    }
    return response.json();
};

const deletePost = async (postId) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
    return response.json();
};

const PostList = ({ onPostClick }) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, 
        cahceTime: 15 * 60 * 1000
    });

    const delPost = useMutation({
        mutationFn: deletePost,
        onSuccess: (data, postId) => {
            console.log('Post deleted successfully')
            queryClient.setQueryData(['posts'], (existingPosts) => {
                return existingPosts.filter(post => post.id !== postId);
            });
        },
    });

    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    if (error) return <Alert variant="danger">Error fetching data</Alert>;

    return (
        <div>
            {isSuccess && data.map(post => (
                <Card key={post.id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.body}</Card.Text>
                        <Button variant="primary" onClick={() => onPostClick(post)}>Edit</Button>
                        <Button variant="danger" onClick={() => delPost.mutate(post.id)}>Delete</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default PostList