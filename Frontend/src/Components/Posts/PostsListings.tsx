import { useQuery } from 'react-query';
import SortOptions from '../SortOptions';
import { fetchRequest } from '../../API/User';
import { useEffect, useRef, useState } from 'react';
import { PostType } from '../../types/types';
import { useNavigate, useParams } from 'react-router-dom';
import { capitalizeString } from '../../utils/helper_functions';
import LoadingProvider from '../LoadingProvider';
import PostPreview from './PostPreview';

const PostsListings = () => {
  const { sortOption: initialSortOption } = useParams();

  const sortOptions = ['Best', 'Hot', 'New', 'Top'];
  const [sortOption, setSortOption] = useState(
    capitalizeString(initialSortOption || '') || sortOptions[0]
  );

  if (!sortOptions.includes(sortOption)) {
    setSortOption(sortOptions[0]);
  }

  const response = useQuery({
    queryKey: ['listings', sortOption],
    queryFn: () => {
      console.log('sortOption', sortOption);
      return fetchRequest(`listing/posts/${sortOption.toLowerCase()}`);
    },
  });
  console.log(response);

  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    navigate(`/${sortOption.toLowerCase()}`);
    response.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  return (
    <>
      {/* Sort by dropdown */}
      <SortOptions
        sortOptions={sortOptions}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <hr className='border-neutral-muted' />
      <LoadingProvider error={response.isError} isLoading={response.isLoading}>
        {response.isSuccess && (
          <>
            {response.data.data.map((post: PostType) => (
              <div key={post.id}>
                <PostPreview post={post} />
                <hr className='border-neutral-muted' />
              </div>
            ))}
          </>
        )}
      </LoadingProvider>
    </>
  );
};

export default PostsListings;
