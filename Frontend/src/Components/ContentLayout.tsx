import { Card, CardBody } from '@material-tailwind/react';
import { ReactNode } from 'react';
import SideBar from './SideBar';

const ContentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className='mx-8 grid grid-col-1 lg:grid-cols-layout gap-6'>
        <div className='lg-max:hidden'>
          <SideBar className='sticky top-[var(--navbar-height)] ' />
        </div>

        <div className='flex justify-center md:px-10 gap-6'>{children}</div>
      </div>
    </>
  );
};

const Main = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Card className='shadow-none w-full overflow-auto'>
        <CardBody className='px-0'>{children}</CardBody>
      </Card>
    </>
  );
};

const RightSideBar = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Card className='lg-max:hidden shadow-none w-80 min-w-80'>
        <CardBody className='sticky top-[var(--navbar-height)] space-y-4 px-0 overflow-auto h-[calc(100vh-var(--navbar-height))]'>
          {children}
        </CardBody>
      </Card>
    </>
  );
};

ContentLayout.Main = Main;
ContentLayout.RightSideBar = RightSideBar;

export default ContentLayout;