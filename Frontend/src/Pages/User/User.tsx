import React, { useState } from 'react';
import SideBar from '../../Components/SideBar';
import { Avatar, Card, CardBody, CardHeader } from '@material-tailwind/react';
import UserRightSideBar from './UserRightSideBar';
import { Link, useParams } from 'react-router-dom';
import Overview from './Overview';
import Posts from './Posts';
import Comments from './Comments';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import UserContent from './UserContent';
import { fetchRequest } from '../../API/User';
import { useQuery } from 'react-query';
const NavButton = (props: {
  active?: boolean | undefined;
  buttonName: string;
  buttonLink: string;
}) => {
  return (
    <Link
      to={`/user/${props.buttonLink}`}
      className={`${props.active ? 'bg-neutral-500' : ''}  text-black rounded-full p-[10px] mx-[5px]  hover:underline`}
    >
      <div className='text-black text-sm'>{props.buttonName}</div>
    </Link>
  );
};

const SubNavBar = (props: {
  buttonArray: string[];
  active: string | undefined;
}) => {
  const pagesArray = [
    'overview',
    'posts',
    'comments',
    'saved',
    'hidden',
    'upvoted',
    'downvoted',
  ];
  return (
    <div className='flex mb-2'>
      {props.buttonArray.map((butt, i) => (
        <NavButton
          key={`${i}${butt}`}
          active={props.active == pagesArray[i]}
          buttonName={butt}
          buttonLink={pagesArray[i]}
        />
      ))}
    </div>
  );
};
function User() {
  const { page } = useParams();
  console.log(page, 'hi');
  const { data, error, isLoading, refetch } = useQuery('about data', () =>
    fetchRequest('users/about')
  );

  const {
    id,
    created_at,
    username,
    email,
    gmail,
    facebook_email,
    profile_settings,
    country,
    gender,
    connected_google,
    connected_twitter,
    connected_apple,
    communities,
    moderated_communities,
  } = data?.data || {};

  const display_name = profile_settings?.display_name || '';
  const profile_picture = profile_settings?.profile_picture || '';

  return (
    <>
      <div className=' grid grid-col-1 lg:grid-cols-16 gap-3'>
        <div className='lg-max:hidden col-span-3'>
          <SideBar />
        </div>
        <Card className='shadow-none col-span-8'>
          <CardBody className='px-0 h-[calc(100vh-3.5rem)] overflow-auto'>
            <div className='flex gap-2 mb-7'>
              <div className='flex flex-col relative '>
                <img
                  src={profile_picture}
                  alt='card-image'
                  className='w-[70px] h-[70px] object-cover rounded-full'
                />
                <div className='absolute bottom-0 right-0 '>
                  <Link
                    to={`/settings/profile`}
                    className='flex rounded-full border text-xs bg-white'
                  >
                    <div className=' text-black p-1'>
                      <PlusCircleIcon strokeWidth={2.5} className='h-4 w-4' />
                    </div>
                  </Link>
                </div>
              </div>
              <div className='text-2xl text-black font-semibold'>
                {display_name}
                <div className='text-base text-neutral-900'>{username}</div>
              </div>
            </div>
            <SubNavBar
              buttonArray={[
                'Overview',
                'Posts',
                'Comments',
                'Saved',
                'Hidden',
                'Upvoted',
                'Downvoted',
              ]}
              active={page}
            />

            {page == 'overview' ? (
              <Overview />
            ) : page == 'posts' ? (
              <Posts />
            ) : page == 'comments' ? (
              <Comments />
            ) : page == 'saved' ? (
              <UserContent
                endpoint='users/saved-posts-and-comments'
                queryName='saved'
              />
            ) : page == 'hidden' ? (
              <UserContent
                endpoint='users/hidden-and-reported-posts'
                queryName='hidden'
              />
            ) : page == 'upvoted' ? (
              <UserContent endpoint='users/upvoted-posts' queryName='upvoted' />
            ) : (
              <UserContent
                endpoint='users/downvoted-posts'
                queryName='downvoted'
              />
            )}
          </CardBody>
        </Card>
        <Card className='lg-max:hidden shadow-none col-span-5'>
          <CardBody className=' px-0 overflow-auto h-[calc(100vh-3.5rem)]'>
            <UserRightSideBar />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default User;