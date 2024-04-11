import * as yup from 'yup';
import { validationSchema } from './validateSchema';

type FormSchema = {
  login: {
    username: yup.Schema<string>;
    password: yup.Schema<string>;
  };
  signup: {
    username: yup.Schema<string>;
    password: yup.Schema<string>;
    email: yup.Schema<string>;
  };
  recoverUsername: {
    email: yup.Schema<string>;
  };
  resetPassword: {
    username: yup.Schema<string>;
    email: yup.Schema<string>;
  };
  changePassword: {
    password: yup.Schema<string>;
    newPassword: yup.Schema<string>;
    confirmNewPassword: yup.Schema<string>;
  };
  createPost: {
    title: yup.Schema<string>;
    type: yup.Schema<string>;
    description: yup.Schema<string | undefined>;
    community_name: yup.Schema<string>;
    community_id: yup.Schema<string>;
    oc_flag: yup.Schema<boolean>;
    spoiler_flag: yup.Schema<boolean>;
    nsfw_flag: yup.Schema<boolean>;
  };
  createPostImageAndVideo: {
    title: yup.Schema<string>;
    community_name: yup.Schema<string>;
    community_id: yup.Schema<string>;
    images: yup.Schema<any>;
    oc_flag: yup.Schema<boolean>;
    spoiler_flag: yup.Schema<boolean>;
    nsfw_flag: yup.Schema<boolean>;
  };
  createPostLink: {
    title: yup.Schema<string>;
    type: yup.Schema<string>;
    community_name: yup.Schema<string>;
    community_id: yup.Schema<string>;
    link_url: yup.Schema<string>;
    oc_flag: yup.Schema<boolean>;
    spoiler_flag: yup.Schema<boolean>;
    nsfw_flag: yup.Schema<boolean>;
  };
  createPostPoll: {
    title: yup.Schema<string>;
    type: yup.Schema<string>;
    oc_flag: yup.Schema<boolean>;
    spoiler_flag: yup.Schema<boolean>;
    nsfw_flag: yup.Schema<boolean>;
    polls_voting_length: yup.Schema<number>;
    polls: yup.Schema<any>;
    community_name: yup.Schema<string>;
    community_id: yup.Schema<string>;
  };
};

const Validation = (type: keyof FormSchema) => {
  const formSchema: FormSchema = {
    login: {
      username: validationSchema['username'],
      password: validationSchema['password'],
    },
    signup: {
      username: validationSchema['username'],
      password: validationSchema['password'],
      email: validationSchema['email'],
    },
    recoverUsername: {
      email: validationSchema['email'],
    },
    resetPassword: {
      username: validationSchema['username'],
      email: validationSchema['email'],
    },
    changePassword: {
      password: validationSchema['password'],
      newPassword: validationSchema['newPassword'],
      confirmNewPassword: validationSchema['confirmNewPassword'],
    },
    createPost: {
      title: validationSchema['title'],
      description: validationSchema['description'],
      community_name: validationSchema['community_name'],
      community_id: validationSchema['community_id'],
      type: validationSchema['type'],
      oc_flag: validationSchema['oc_flag'],
      spoiler_flag: validationSchema['spoiler_flag'],
      nsfw_flag: validationSchema['nsfw_flag'],
    },
    createPostLink: {
      title: validationSchema['title'],
      community_name: validationSchema['community_name'],
      community_id: validationSchema['community_id'],
      link_url: validationSchema['link_url'],
      type: validationSchema['type'],
      oc_flag: validationSchema['oc_flag'],
      spoiler_flag: validationSchema['spoiler_flag'],
      nsfw_flag: validationSchema['nsfw_flag'],
    },
    createPostImageAndVideo: {
      title: validationSchema['title'],
      community_name: validationSchema['community_name'],
      community_id: validationSchema['community_id'],
      images: validationSchema['images'],
      oc_flag: validationSchema['oc_flag'],
      spoiler_flag: validationSchema['spoiler_flag'],
      nsfw_flag: validationSchema['nsfw_flag'],
    },
    createPostPoll: {
      title: validationSchema['title'],
      type: validationSchema['type'],
      spoiler_flag: validationSchema['spoiler_flag'],
      nsfw_flag: validationSchema['nsfw_flag'],
      polls_voting_length: validationSchema['polls_voting_length'],
      polls: validationSchema['polls'],
      oc_flag: validationSchema['oc_flag'],
      community_name: validationSchema['community_name'],
      community_id: validationSchema['community_id'],
    },
  };

  const schema = yup.object().shape(formSchema[type]);
  return schema;
};
export default Validation;
