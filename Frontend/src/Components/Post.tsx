import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from '@material-tailwind/react';
import { dateDuration } from '../utils/helper_functions';
import CommunityBadge from './CommunityBadge';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  EyeIcon,
  EyeSlashIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import PostInteractionButtons from './PostInteractionButtons';
import { PostType } from '../types/types';

const Post = ({ post }: { post: PostType }) => {
  // TODO Fetch Community
  // const data = useQuery({
  //   queryKey: ['community', post.community_id],
  //   queryFn: () => fetchRequest('community', post.community_id),
  // });

  return (
    <>
      <Card
        className='w-full px-4 py-2 border-b-[1px] border-neutral-muted hover:bg-neutral-200'
        shadow={false}
      >
        <CardHeader
          shadow={false}
          floated={false}
          className='flex flex-row items-center justify-between gap-2 m-0 bg-inherit'
        >
          <div className='flex flex-row items-center justify-between gap-1 m-0'>
            <CommunityBadge
              name={post['community-name']}
              joined={post.joined}
              icon={post.communityAvatarSrc}
              coverImage={post.communityCoverSrc}
              members={post.communityMembers}
              online={post.communityOnline}
              description={post.description}
            />
            <span className='relative -top-0.5'>•</span>
            <Typography variant='small' className=''>
              {dateDuration(new Date(post.created_at))}
            </Typography>
          </div>
          <div>
            <PostOptions saved={post.saved} hidden={post.hidden} />
          </div>
        </CardHeader>
        <CardBody className='flex items-center justify-between gap-2 m-0 p-0'>
          <div className='flex flex-col justify-between space-y-2 overflow-hidden'>
            <Typography variant='h5' className='mb-2 font-normal text-black'>
              {post.title}
            </Typography>
            <PostInteractionButtons
              postId={post.id}
              upvotes={post.upvotes_count}
              downvotes={post.downvotes_count}
              comments={post.comments_count}
            />
          </div>
          {post.images?.[0] && (
            <img
              src={post.images?.[0].link}
              alt='post'
              className='object-cover rounded-md w-32 h-24'
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

type PostOptionsProps = {
  saved: boolean;
  hidden: boolean;
};

const PostOptions = ({ saved, hidden }: PostOptionsProps) => {
  return (
    <Menu placement='bottom-end'>
      <MenuHandler>
        <Button variant='text' className='p-2'>
          <HiEllipsisHorizontal size={20} />
        </Button>
      </MenuHandler>
      <MenuList className='p-0 text-foreground min-w-min w-max shadow-lg shadow-black/25'>
        <MenuItem className='py-3 flex gap-2 items-center'>
          {saved ? (
            <>
              <BookmarkSlashIcon className='w-5 h-5' />
              <a href='#'>Unsave</a>
            </>
          ) : (
            <>
              <BookmarkIcon className='w-5 h-5' />
              <a href='#'>Save</a>
            </>
          )}
        </MenuItem>
        <MenuItem className='py-3 flex gap-2 items-center'>
          {hidden ? (
            <>
              <EyeSlashIcon className='w-5 h-5' />
              <a href='#'>Unhide</a>
            </>
          ) : (
            <>
              <EyeIcon className='w-5 h-5' />
              <a href='#'>Hide</a>
            </>
          )}
        </MenuItem>
        <MenuItem className='py-3 flex gap-2 items-center'>
          <FlagIcon className='w-5 h-5' />
          <a href='#'>Report</a>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Post;
