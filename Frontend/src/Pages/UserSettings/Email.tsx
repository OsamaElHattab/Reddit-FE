import SwitchButton from '../../Components/SwitchButton';
import Card from './Containers/Card';
import Section from './Containers/Section';
import { fetchRequest, patchRequest } from '../../API/User';
import { useMutation, useQuery } from 'react-query';
import LoadingProvider from '../../Components/LoadingProvider';
import { useAlert } from '../../Providers/AlertProvider';

function Email() {
  const { data, isError, isLoading, refetch } = useQuery('email data', () =>
    fetchRequest('users/email-settings')
  );
  const { trigger, setTrigger, setAlertMessage, setIsError } = useAlert();

  console.log(data);
  const mutation = useMutation(patchRequest, {
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

  const handleToggleSwitch = (settingName: string, value: string | boolean) => {
    const notificationsSettings = data?.data || {};
    const newSettings = {
      email_settings: {
        ...notificationsSettings,
        [settingName]: value,
      },
    };

    mutation.mutate({
      endPoint: 'users/change-email-settings',
      newSettings: newSettings,
    });
  };
  const {
    new_follower_email,
    chat_request_email,
    unsubscribe_from_all_emails,
  } = data?.data || {};

  return (
    <LoadingProvider error={isError} isLoading={isLoading}>
      <div>
        <h2 className='text-xl my-8 font-semibold'>Manage Emails</h2>
        <Section sectionTitle='MESSAGES'>
          <Card title='Chat requests' description=''>
            <SwitchButton
              checked={chat_request_email}
              onChange={(value) =>
                handleToggleSwitch('chat_request_email', value)
              }
            />
          </Card>
        </Section>
        <Section sectionTitle='ACTIVITY'>
          <Card title='New followers' description=''>
            <SwitchButton
              checked={new_follower_email}
              onChange={(value) =>
                handleToggleSwitch('new_follower_email', value)
              }
            />
          </Card>
        </Section>
        <Section sectionTitle=''>
          <Card title='Unsubscribe from all emails' description=''>
            <SwitchButton
              checked={unsubscribe_from_all_emails}
              onChange={(value) =>
                handleToggleSwitch('unsubscribe_from_all_emails', value)
              }
            />
          </Card>
        </Section>
      </div>
    </LoadingProvider>
  );
}

export default Email;
