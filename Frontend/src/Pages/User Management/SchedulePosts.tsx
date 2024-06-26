import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ModSideBar from '../Rules and Removal reasons/ModSidebar';
import axios from 'axios';
import RoundedButton from '../../Components/RoundedButton';

interface SchedulingDetails {
  repetition_option: string;
  schedule_date: string;
}

interface UserDetails {
  total_views: number;
  upvote_rate: number;
  total_shares: number;
}

interface PostDataType {
  scheduling_details: SchedulingDetails;
  user_details: UserDetails;
  _id: string;
  title: string;
  description: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  deleted: boolean;
  type: string;
  link_url: string | null;
  images: string[];
  videos: string[];
  polls: {
    options: string;
    votes: number;
    _id: string;
  }[];
  polls_voting_length: number;
  polls_voting_is_expired_flag: boolean;
  post_in_community_flag: boolean;
  community_name: string;
  comments_count: number;
  views_count: number;
  shares_count: number;
  upvotes_count: number;
  downvotes_count: number;
  oc_flag: boolean;
  spoiler_flag: boolean;
  nsfw_flag: boolean;
  locked_flag: boolean;
  allowreplies_flag: boolean;
  set_suggested_sort: string;
  scheduled_flag: boolean;
  is_reposted_flag: boolean;
  user_id: string;
  username: string;
  __v: number;
}
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  };
  return date.toLocaleString('en-US', options);
};

const SchedulePost = () => {
  const { community_name } = useParams();
  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [submitPost, setSubmitPost] = useState('');
  const [deletePost, setDeletePost] = useState('');
  const fetchPosts = async () => {
    // setIsLoading(true);
    // setIsError(false);
    setPosts([]);
    try {
      const res = await axios.get(
        `${process.env.VITE_BASE_URL}communities/get-scheduled-posts/${community_name}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      setPosts(res.data.non_recurring_posts);
      console.log(res.data.non_recurring_posts, 'resss');
    } catch (err) {
      // setIsError(true);
      console.error('Error fetching data:', err);
    } finally {
      // setIsLoading(false);
    }
  };
  const submitPostRequest = async () => {
    console.log(submitPost);
    try {
      await axios.post(
        `${process.env.VITE_BASE_URL}communities/submit-scheduled-post/${community_name}`,
        { post_id: submitPost },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      console.log(submitPost);
      fetchPosts();
    } catch (err) {
      // setIsError(true);
      console.error('Error fetching data:', err);
    } finally {
      // setIsLoading(false);
    }
  };
  const submitDeleteRequest = async () => {
    console.log(submitPost);
    try {
      await axios.post(
        `${process.env.VITE_BASE_URL}communities/cancel-scheduled-post/${community_name}`,
        { post_id: deletePost },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      console.log(submitPost);
      fetchPosts();
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    submitPostRequest();
  }, [submitPost]);
  useEffect(() => {
    console.log('sssssssssss', deletePost);
    submitDeleteRequest();
  }, [deletePost]);

  return (
    <div className='Container'>
      <div className='text-blue-light ps-4 ms-4 mt-4 font-bold border-b-2 pb-2 '>
        <span className='border rounded-full bg-blue-light text-white ps-1 pe-1 me-2'>
          r/
        </span>{' '}
        R/ {community_name}
        <span className='text-black ms-2 uppercase'>Schedule Posts</span>
      </div>
      <div className='grid grid-col-1 xl:grid-cols-layout'>
        <div className='hidden xl:block'>
          <ModSideBar />
        </div>

        <div className='mt-10 p-4 ms-4'>
          <div className='text-xl flex flex-row justify-between items-center'>
            <div>Schedule Posts</div>
            <Link to={`/r/${community_name}/submit`}>
              <RoundedButton
                buttonText='Create Post'
                buttonTextColor='text-white font-semibold text-[13px] text-xs'
                buttonBorderColor='border-white'
                buttonColor='bg-blue-light hover:!opacity-100'
                onClick={() => setSubmitPost(post._id)}
              />
            </Link>
          </div>
          {posts.map((post) => (
            <div key={post._id} className=''>
              <div className='border p-4 mt-2 flex flex-row space-x-2'>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6 '
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                </span>
                <div>
                  <div className='text-font text-xs'>
                    This post is scheduled for{' '}
                    {formatDate(post.scheduling_details.schedule_date)}
                  </div>
                  <div className=' text-xs'>Scheduled by {post.username}</div>
                </div>
              </div>
              <div className='border flex flex-row space-x-4 p-4 text-xs'>
                <div className='flex flex-col ms-4'>
                  <button className='text-gray-500 hover:text-blue-500 focus:outline-none'>
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 15l7-7 7 7'
                      />
                    </svg>
                  </button>
                  <span className='text-gray-600 font-semibold'>Vote</span>
                  <button className='text-gray-500 hover:text-red-500 focus:outline-none'>
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </button>
                </div>
                <div className='bg-gray-200 w-12 h-12 m-2 flex items-center justify-center'>
                  {' '}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5'
                    />
                  </svg>
                </div>
                <div className='flex flex-col font-bold'>
                  <span>{post.title}</span>
                  <span>{post.community_name}</span>
                  <div className='flex flex-row'>
                    <RoundedButton
                      buttonText='Submit now'
                      buttonTextColor='text-gray-800 font-semibold text-[13px] text-xs'
                      buttonBorderColor='border-white'
                      buttonColor='bg-inherit hover:bg-gray-200 hover:!opacity-100'
                      onClick={() => setSubmitPost(post._id)}
                    />
                    <button onClick={() => setDeletePost(post._id)}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-4 h-4 mt-2'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulePost;
