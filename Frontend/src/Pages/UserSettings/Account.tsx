import React from 'react';
import RoundedButton from '../../Components/RoundedButton';
import Section from './Containers/Section';
import Card from './Containers/Card';
import DropDownButton from './Containers/DropDownButton';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from 'react-query';
import { fetchRequest, patchRequest, postRequest } from '../../API/User';
import LoadingProvider from '../../Components/LoadingProvider';
import { useGoogleLogin } from '@react-oauth/google';
import {
  DeleteAccountModal,
  ChangeEmailModal,
  ChangeEmailModalError,
  DisconnectGoogleModal,
  ChangePasswordModal,
} from './Containers/AccountModals';
import { useAlert } from '../../Providers/AlertProvider';

function Account() {
  const { trigger, setTrigger, setAlertMessage, setIsError } = useAlert();
  const [deleteAccountModal, setDeleteAccountModal] = React.useState(false);
  const toggleDeleteAccountModal = () => {
    setDeleteAccountModal(!deleteAccountModal);
  };
  const [changeEmailModalError, setChangeEmailModalError] =
    React.useState(false);
  const toggleEmailModalError = () => {
    setChangeEmailModalError(!changeEmailModalError);
  };
  const [changeEmailModal, setChangeEmailModal] = React.useState(false);
  const toggleEmailModal = () => {
    setChangeEmailModal(!changeEmailModal);
  };
  const [changePasswordModal, setChangePasswordModal] = React.useState(false);
  const togglePasswordModal = () => {
    setChangePasswordModal(!changePasswordModal);
  };
  const [disconnectGoogleModal, setDisconnectGoogleModal] =
    React.useState(false);
  const toggleGoogleModal = () => {
    setDisconnectGoogleModal(!disconnectGoogleModal);
  };
  const { data, isError, isLoading, refetch } = useQuery(
    'accountSettings',
    () => fetchRequest('users/account-settings')
  );
  console.log(data, 'accountsettings');
  const getReq = useMutation(fetchRequest);
  const patchReq = useMutation(patchRequest, {
    onSuccess: () => {
      refetch();
      setTrigger(!trigger);
      setIsError(false);
      setAlertMessage('User Settings Updated Successfully');
    },
    onError: (error: string) => {
      setTrigger(!trigger);
      setIsError(true);
      setAlertMessage(error);
    },
  });
  const handleChange = (endPoint: string, newSettings: unknown) => {
    patchReq.mutate({ endPoint: endPoint, newSettings: newSettings });
  };
  const { email, connected_google, gender, country, hasPassword } =
    data?.data || {};
  const postReq = useMutation(postRequest);
  const connectToGoogle = useGoogleLogin({
    clientId:
      '178664293995-s6s92s28mme4eu54lg367sqhnj8bonff.apps.googleusercontent.com',
    onSuccess: async (tokenResponse) => {
      console.log('Google login successful', tokenResponse.access_token);
      postReq.mutate({
        endPoint: 'users/connect-to-google',
        data: {
          access_token: tokenResponse.access_token,
        },
      });
    },
  });
  return (
    <LoadingProvider error={isError} isLoading={isLoading}>
      <ChangeEmailModal
        handleOpen={toggleEmailModal}
        open={changeEmailModal}
        refetch={refetch}
        email={email}
      />
      <ChangeEmailModalError
        open={changeEmailModalError}
        handleOpen={toggleEmailModalError}
        email={email}
      />
      <h2 className='text-xl my-8 font-semibold'>Account Settings</h2>
      <Section sectionTitle='ACCOUNT PREFERENCES'>
        <Card title='Email address' description={email}>
          <RoundedButton
            buttonBorderColor='border-blue-light'
            buttonColor='bg-white'
            buttonText='Change'
            buttonTextColor='text-blue-light'
            onClick={hasPassword ? toggleEmailModal : toggleEmailModalError}
          />
        </Card>
        <ChangePasswordModal
          handleOpen={togglePasswordModal}
          open={changePasswordModal}
          refetch={refetch}
        />
        {hasPassword && (
          <Card
            title='Change password'
            description='Password must be at least 8 characters long'
          >
            <RoundedButton
              buttonBorderColor='border-blue-light'
              buttonColor='bg-white'
              buttonText='Change'
              buttonTextColor='text-blue-light'
              onClick={togglePasswordModal}
            />
          </Card>
        )}
        <Card
          title='Gender'
          description='This information may be used to improve your recommendations and ads.'
        >
          <DropDownButton
            buttonList={['Male', 'Female']}
            selected={gender}
            handleSelectionChange={(value) =>
              handleChange('users/change-account-settings', {
                account_settings: { gender: value },
              })
            }
          />
        </Card>
        <Card title='Country' description=''>
          <DropDownButton
            buttonList={[
              'Argentina',
              'Australia',
              'Brazil',
              'Canada',
              'China',
              'Egypt',
              'European Union',
              'France',
              'Germany',
              'India',
              'Indonesia',
              'Italy',
              'Japan',
              'Mexico',
              'Republic of Korea',
              'Russia',
              'Saudi Arabia',
              'South Africa',
              'Turkey',
              'United Kingdom',
              'United States',
            ]}
            selected={country}
            handleSelectionChange={(value) =>
              handleChange('users/change-account-settings', {
                account_settings: { country: value },
              })
            }
          />
        </Card>
      </Section>
      <Section sectionTitle='CONNECTED ACCOUNTS'>
        <Card
          title='Connect to Google'
          description='Connect account to log in to Reddit with Google'
        >
          {!connected_google ? (
            <RoundedButton
              buttonBorderColor='border-gray'
              buttonColor='bg-white'
              buttonText='Connect to Google'
              buttonTextColor='text-black'
              onClick={() => {
                connectToGoogle();
              }}
            >
              <img
                src='https://docs.material-tailwind.com/icons/google.svg'
                alt='metamask'
                className='h-4 w-4 mx-2'
              />
            </RoundedButton>
          ) : (
            <>
              <DisconnectGoogleModal
                handleOpen={toggleGoogleModal}
                open={disconnectGoogleModal}
                refetch={refetch}
              />
              <RoundedButton
                buttonText='(disconnect)'
                buttonTextColor='text-blue-light'
                buttonColor='bg-inherit'
                buttonBorderColor='border-none'
                onClick={toggleGoogleModal}
              />
            </>
          )}
        </Card>
      </Section>
      <Section sectionTitle='DELETE ACCOUNT'>
        <DeleteAccountModal
          open={deleteAccountModal}
          handleOpen={toggleDeleteAccountModal}
          refetch={refetch}
        />
        <Card title=' '>
          <RoundedButton
            buttonBorderColor='border-none'
            buttonColor='bg-white'
            buttonText='DELETE ACCOUNT'
            buttonTextColor='text-danger-red'
            onClick={toggleDeleteAccountModal}
          >
            <TrashIcon strokeWidth={1.5} className='h-4 w-4 mx-2' />
          </RoundedButton>
        </Card>
      </Section>
    </LoadingProvider>
  );
}

export default Account;
