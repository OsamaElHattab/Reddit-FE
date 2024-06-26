import { useParams } from 'react-router-dom';
import ContentLayout from '../Components/ContentLayout';
import PostDetails from '../Components/Posts/PostDetails';
import { CommunityRSB } from '../Components/RightSideBar/CommunityRSB';
import { useQuery } from 'react-query';
import { fetchRequest } from '../API/User';
import LoadingProvider from '../Components/LoadingProvider';

const Post = () => {
  const { id: postId } = useParams();
  const { prefix } = useParams();

  console.log(postId);
  // const [community, setCommunity] = useState<PostType | undefined>();
  // const [post, setPost] = useState<PostType | undefined>();
  const url = window.location.href;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', postId, url],
    queryFn: () => fetchRequest(`posts/get-post?id=${postId}`),
  });

  return (
    <>
      <ContentLayout>
        <LoadingProvider error={isError} isLoading={isLoading}>
          {data?.data && (
            <>
              <ContentLayout.Main>
                <PostDetails post={data.data} />
              </ContentLayout.Main>
              <ContentLayout.RightSideBar>
                {prefix == 'r' && (
                  <CommunityRSB name={data.data.community_name} />
                )}
              </ContentLayout.RightSideBar>
            </>
          )}
        </LoadingProvider>
      </ContentLayout>
    </>
  );
};

export default Post;
