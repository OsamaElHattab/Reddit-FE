import LoadingProvider from '../../Components/LoadingProvider';
import { useQuery } from 'react-query';
import { fetchRequest } from '../../API/User';
import { PostType } from '../../types/types';

import PostPreview from '../../Components/Posts/PostPreview';

function UserContent(props: { endpoint: string; queryName: string }) {
  const { data, error, isLoading } = useQuery(
    [props.queryName, 'listings'],
    () => fetchRequest(props.endpoint)
  );
  console.log(data);
  return (
    <>
      <LoadingProvider error={error} isLoading={isLoading}>
        {data && (
          <>
            {data.data.map((post: PostType) => (
              <PostPreview page='profile' key={post._id} post={post} />
            ))}
          </>
        )}
      </LoadingProvider>
    </>
  );
}

export default UserContent;
