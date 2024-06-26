import { useEffect, useState } from 'react';
import DropDownButton from './components/DropDownButton';
import PostCard from './components/PostCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingProvider from '../../Components/LoadingProvider';
import { PostType } from '../../types/types';

const Removed = ({ page, postPerm }: { page: string; postPerm: boolean }) => {
  const [sortList, setSortList] = useState<string>('Newest First');
  const [selList, setSelList] = useState<string>('Posts and Comments');
  const { community_name } = useParams();
  console.log(community_name);

  // const { user } = useSession();
  // const { data, error, isLoading } = useQuery(['modQueue', 'removed'], () =>
  //   fetchRequest(`communities/about/removed-or-spammed/Thiel___Wolff`)
  // );

  const [response, setResponse] = useState<[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setResponse([]);
      try {
        const res = await axios.get(
          `${process.env.VITE_BASE_URL}communities/get-items-from-queue/${community_name}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('token'),
            },
            params: {
              posts_or_comments: selList,
              time_filter: sortList,
              queue_type: 'removed',
            },
          }
        );
        setResponse(res.data);
        console.log(res.data, 'resss');
        // Perform further actions with the response data, such as updating state
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(true); // Set error state
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Call the fetch function within the effect
  }, [sortList, selList]); // Effect will run whenever sortList or selList changes

  return (
    <div>
      <div className='flex gap-1 items-center'>
        <DropDownButton
          buttonList={['Newest First', 'Oldest First']}
          selected={sortList}
          handleSelectionChange={(selectedItem) => {
            setSortList(selectedItem);
          }}
        />
        <DropDownButton
          buttonList={['Posts and Comments', 'Posts', 'Comments']}
          selected={selList}
          handleSelectionChange={(selectedItem) => {
            setSelList(selectedItem);
          }}
        />
      </div>
      <LoadingProvider error={error} isLoading={isLoading}>
        <div className='flex flex-col gap-4'>
          {response && response.length > 0 ? (
            response.map((post: PostType) => (
              <PostCard
                key={post._id}
                post={post}
                page={page}
                postPerm={postPerm}
              />
            ))
          ) : (
            <div className='border-[1px] rounded-md flex items-center justify-center font-semibold text-xl text-gray-600 p-10'>
              {page + ' '} queue is empty
            </div>
          )}
        </div>
      </LoadingProvider>
    </div>
  );
};

export default Removed;
