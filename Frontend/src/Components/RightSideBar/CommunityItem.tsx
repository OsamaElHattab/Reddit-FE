import React from 'react';
import {
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
} from '@material-tailwind/react';
import { CommunityIcon } from '../../assets/icons/Icons';

interface CommunityItemProps {
  src: string;
  name: string;
  membersNumber: number;
}

const CommunityItem: React.FC<CommunityItemProps> = (props) => {
  return (
    <div>
      <ListItem className='rounded-none' data-testid='community-item'>
        <ListItemPrefix>
          {props.src ? (
            <Avatar
              variant='circular'
              alt='candice'
              src={props.src}
              style={{ width: '35px', height: '35px' }}
              data-testid='avatar'
            />
          ) : (
            <CommunityIcon className='h-8 w-8' />
          )}
        </ListItemPrefix>
        <div>
          <Typography
            variant='small'
            className='font-body font-thin -tracking-tight text-sm text-gray-900'
            data-testid='community-name'
          >
            r/{props.name}
          </Typography>
          <Typography
            variant='small'
            className='font-body font-thin -tracking-tight text-xs text-gray-600'
            data-testid='members-number'
          >
            {props.membersNumber} members
          </Typography>
        </div>
      </ListItem>
    </div>
  );
};

export default CommunityItem;
