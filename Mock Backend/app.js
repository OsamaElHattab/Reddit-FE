const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const port = 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const getAuthUsername = (req) => {
  const token = req.headers?.authorization;
  console.log("req.headers", req.headers);
  console.log("token", token.split(" ")[1]);

  if (!token) return null;
  const decodedToken = jwt.verify(token.split(" ")[1], "RedditToken@");
  const username = decodedToken.username;
  // console.log(token,'userrrrname');

  return username;
};

const whitelist = ["http://localhost:5174", "http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// app.use(
//   cors({
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Add PATCH method here
//   })
// );
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});
const accountSettings = {
  msg: "asdasd",
  content: {
    email: "ahmedkhaled1029@gmail.com",
    verified_email_flag: "string",
    country: "Egypt",
    gender: "Male",
    gmail: "ahmedkhaled1029@gmail.com",
    connected_google: true,
    hasPassword: true,
  },
};

app.get("/users/account-settings", (req, res) => {
  res.status(200).json(accountSettings);
});

let c = 0;
app.patch("/users/change-account-settings", (req, res) => {
  accountSettings.content = {
    ...accountSettings.content,
    ...req.body.account_settings,
  };

  console.log(req.body);
  if (c < 5) {
    c++;
    res.sendStatus(200);
  } else {
    res.status(404).send("Error");
  }
});
app.post("/users/disconnect-google", (req, res) => {
  const { password } = req.body;
  console.log(password);
  accountSettings.content.connected_google = false;
  console.log(accountSettings);
  res.sendStatus(200);
});

app.patch("/users/change-email", (req, res) => {
  const { password, new_email } = req.body;
  accountSettings.content.email = new_email;
  res.sendStatus(200);
});
app.patch("/users/change-password", (req, res) => {
  const { current_password, new_password, verified_new_password } = req.body;
  // accountSettings.account_settings.email = new_email;
  res.sendStatus(200);
});

app.post("/users/delete-account", (req, res) => {
  accountSettings.content = {};
  console.log(accountSettings);
  res.sendStatus(200);
});

let profileSettings = {
  msg: "adasd",
  content: {
    display_name: "string",
    about: "string",
    social_links: [
      { icon: "Instagram", username: "ahmedtoaima_" },
      {
        icon: "Facebook",
        username: "ahmedkhaled",
        displayName: "Ahmed Khaled",
      },
    ],
    country: "string",
    gender: "Male",
    profile_picture: "string",
    banner_picture: "string",
    nsfw_flag: false,
    allow_followers: true,
    content_visibility: true,
    active_communities_visibility: false,
  },
};

app.get("/users/profile-settings", (req, res) => {
  res.status(200).json(profileSettings);
});

app.patch("/users/change-profile-settings", (req, res) => {
  profileSettings.content = {
    ...profileSettings.content,
    ...req.body.profile_settings,
  };

  res.status(200).json(profileSettings);
});

app.post("/users/clear-history", (req, res) => {
  res.sendStatus(200);
});

let notificationSettings = {
  msg: "asda",
  content: {
    private_messages: false,
    chat_messages: false,
    chat_requests: false,
    mentions: false,
    comments: false,
    upvotes_posts: false,
    upvotes_comments: true,
    replies: true,
    new_followers: true,
    invitations: true,
    posts: true,
  },
};
app.get("/users/notification-settings", (req, res) => {
  res.status(200).json(notificationSettings);
});
app.patch("/users/change-notification-settings", (req, res) => {
  const updatedSettings = req.body;
  notificationSettings.content = {
    ...notificationSettings.content,
    ...updatedSettings.notifications_settings,
  };
  res.status(200).json(notificationSettings);
});

let emailSettings = {
  msg: "asdasd",
  content: {
    new_follower_email: true,
    chat_request_email: true,
    unsubscribe_from_all_emails: true,
  },
};
app.get("/users/email-settings", (req, res) => {
  res.status(200).json(emailSettings);
});
app.patch("/users/change-email-settings", (req, res) => {
  const updatedSettings = req.body;
  emailSettings.content = {
    ...emailSettings.content,
    ...updatedSettings.email_settings,
  };
  res.status(200).json(emailSettings);
});

let feedSettings = {
  msg: "asds",
  content: {
    Adult_content_flag: true,
    autoplay_media: true,
    community_content_sort: {
      type: "top",
      sort_remember_per_community: true,
    },
    global_content: {
      global_content_view: "classic",
      global_remember_per_community: true,
    },
    Open_posts_in_new_tab: true,
    community_themes: true,
  },
};
app.get("/users/feed-settings", (req, res) => {
  res.status(200).json(feedSettings);
});
app.patch("/users/change-feed-settings", (req, res) => {
  console.log(req.body);
  const updatedSettings = req.body;
  feedSettings.content = {
    ...feedSettings.content,
    ...updatedSettings.feed_settings,
  };
  res.sendStatus(200);
});

app.post("/users/add-social-link", (req, res) => {
  const { icon, username, displayName } = req.body;
  profileSettings.content.social_links.push({
    icon: icon,
    username: username,
    displayName: displayName,
  });
  res.sendStatus(200);
});

app.post("/users/delete-social-link", (req, res) => {
  const { icon, username, displayName } = req.body;
  profileSettings.content.social_links.pop({
    icon: icon,
    username: username,
    displayName: displayName,
  });
  res.sendStatus(200);
});

const safetySettings = {
  msg: "asda",
  content: {
    blocked_users: [
      {
        id: "1",
        username: "Ahmed",
        blocked_date: "2023/10/10",
        profile_picture: "firebase.com",
      },
      {
        id: "2",
        username: "Omar",
        blocked_date: "2023/5/5",
        profile_picture: "firebase.com",
      },
      {
        id: "3",
        username: "Karim",
        blocked_date: "2023/1/1",
        profile_picture: "firebase.com",
      },
    ],
    muted_communities: [
      {
        id: "1",
        "community-title": "Ahmed",
        muted_date: "2023/10/10",
        profile_picture: "firebase.com",
      },
      {
        id: "2",
        "community-title": "Omar",
        muted_date: "2023/5/5",
        profile_picture: "firebase.com",
      },
      {
        id: "3",
        "community-title": "Karim",
        muted_date: "2023/1/1",
        profile_picture: "firebase.com",
      },
    ],
  },
};
app.get("/users/safety-settings", (req, res) => {
  res.status(200).json(safetySettings);
});

app.post("/users/block-unblock-user", (req, res) => {
  const { blocked_username, block } = req.query;
  if (block === "false") {
    console.log(blocked_username, block);
    safetySettings.content.blocked_users =
      safetySettings.content.blocked_users.filter(
        (user) => user.username !== blocked_username
      );
  } else {
    safetySettings.content.blocked_users.push({
      username: blocked_username,
      blocked_date: new Date(),
    });
    postReplies = postReplies.filter(
      (rep) => rep.senderUsername !== blocked_username
    );
    usernameMentions = usernameMentions.filter(
      (rep) => rep.senderUsername !== blocked_username
    );
  }

  res.sendStatus(200);
});

// app.post("/users/mute-unmute-community", (req, res) => {
//   if (!req.body.mute) {
//     safetySettings.content.muted_communities =
//       safetySettings.content.muted_communities.filter(
//         (user) => user["community-title"] !== req.body["community-title"]
//       );
//   } else {
//     safetySettings.content.muted_communities.push({
//       "community-title": req.body["community-title"],
//       muted_date: new Date(),
//     });
//   }
//   res.sendStatus(200);
// });

let chatSettings = {
  msg: "asdad",
  content: {
    who_send_chat_request_flag: "Everyone",
    who_send_private_messages_flag: "Everyone",
  },
};
app.get("/users/chats-and-msgs-settings", (req, res) => {
  res.status(200).json(chatSettings);
});
app.patch("/users/change-chats-and-msgs-settings", (req, res) => {
  console.log(req.body);
  chatSettings.content = {
    ...chatSettings.content,
    ...req.body.chat_and_messaging_settings,
  };

  console.log(chatSettings);
  res.sendStatus(200);
});

let credentials = [{ username: "username", password: "password" }];
let users = [
  {
    _id: "661a2c3fab10a4b012e8f59a",
    username: "Osama",
    created_at: "2024-04-13T06:53:20.537Z",
    email: "me22@gmail.com",
    verified_email_flag: false,
    connected_google: false,
    display_name: "m",
    about: "",
    social_links: [],
    profile_picture:
      "https://conflictresolutionmn.org/wp-content/uploads/2020/01/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg",
    banner_picture: "",
    gender: "Male",
  },
  {
    _id: "661a2c3fab10a4b012e8f59b",
    username: "n",
    created_at: "2024-04-14T06:53:20.537Z",
    email: "ne22@gmail.com",
    verified_email_flag: false,
    connected_google: false,
    display_name: "n",
    about: "",
    social_links: [],
    profile_picture: "",
    banner_picture: "",
    gender: "Male",
  },
  {
    _id: "661a2c3fab10a4b012e8f59c",
    username: "o",
    created_at: "2024-04-15T06:53:20.537Z",
    email: "oe22@gmail.com",
    verified_email_flag: false,
    connected_google: false,
    display_name: "o",
    about: "",
    social_links: [],
    profile_picture: "",
    banner_picture: "",
    gender: "Female",
  },
];

app.post("/users/signup", (req, res) => {
  const { username, email, password } = req.body;

  const newUser = {
    username,
    email,
    password,
  };
  users.push(newUser);
  const token = jwt.sign({ username }, "RedditToken@", { expiresIn: "1h" });
  res.setHeader("authorization", `Bearer ${token}`);

  console.log(res.getHeaderNames());
  res.sendStatus(201);
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.body;
  const user = credentials.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    const token = jwt.sign({ username }, "RedditToken@", { expiresIn: "1h" });
    res.setHeader("Authorization", `Bearer ${token}`);
    console.log(res.getHeaderNames());
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.post("/users/forget-username", (req, res) => {
  const { email } = req.body;
  res.status(200).json({ message: "Email sent successfully" });
});
app.post("/users/forget-password", (req, res) => {
  const { username, email } = req.body;
  res.status(200).json({ message: "Email sent successfully" });
});

app.post("/users/signup-google", (req, res) => {
  const { code } = req.body;
  name = "ahmed";
  username = "llllllllll";
  const token = jwt.sign({ username, name }, "RedditToken@", {
    expiresIn: "1h",
  });
  res
    .status(200)
    .header("Authorization", `Bearer ${token}`)
    .json({ message: "User logged in with Google successfully" });
});
const communitiesPost = [
  {
    id: "661732b95ef02bd2dddfde17",
    name: "programming",
    profile_picture: "",
    favorite_flag: true,
    members_count: 163,
  },
  {
    id: "661732b95ef02bd2dddfde1e",
    name: "Rowe, Heller and McKenzie",
    profile_picture: "",
    favorite_flag: false,
    members_count: 924,
  },
  {
    id: "661732b95ef02bd2dddfde1f",
    name: "announcements",
    profile_picture:
      "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
    favorite_flag: true,
    members_count: 50,
  },
  {
    id: "661732b95ef02bd2dddfde2e",
    name: "annou",
    profile_picture:
      "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
    favorite_flag: true,
    members_count: 60,
  },
  {
    id: "661732b95ef02bd2dddfde3e",
    name: "football",
    profile_picture:
      "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
    favorite_flag: true,
    members_count: 20,
  },
  {
    id: "661732b95ef02bd2dddfde4e",
    name: "redditGroup",
    profile_picture:
      "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
    favorite_flag: true,
    members_count: 40,
  },
  {
    id: "661732b95ef02bd2dddfde5e",
    name: "testcommunity",
    profile_picture:
      "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
    favorite_flag: true,
    members_count: 50,
  },
];

app.get("/users/communities", (req, res) => {
  res.status(200).json(communitiesPost);
});

// app.get("/users/communities2", (req, res) => {
//   res.status(200).json(communities);
// });
app.post("/posts/new-post", (req, res) => {
  // const {} = req.body;
  res.status(200).json({ message: "	post created successfully" });
});

module.exports = app;

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

let popularComunities = [
  {
    id: 1,
    src: "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
    name: "sports",
    membersNumber: 1234,
  },
  {
    id: 2,
    src: "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
    name: "programming",
    membersNumber: 2000,
  },
  {
    id: 3,
    src: "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
    name: "Music",
    membersNumber: 1500,
  },
  {
    id: 4,
    src: "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
    name: "sports",
    membersNumber: 1000,
  },
  {
    id: 5,
    src: "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
    name: "programming",
    membersNumber: 2000,
  },
  {
    id: 6,
    src: "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
    name: "Music",
    membersNumber: 1500,
  },
  {
    id: 7,
    src: "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
    name: "sports",
    membersNumber: 1000,
  },
  {
    id: 8,
    src: "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
    name: "programming",
    membersNumber: 2000,
  },
  {
    id: 9,
    src: "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
    name: "Music",
    membersNumber: 1500,
  },
];
app.get("/communities/get-popular-communities", (req, res) => {
  res.status(200).json(popularComunities);
});

// let communities = [
//   {
//     name: "Community2",
//     _id: "jdhdjsdb",
//     description:
//       "Sports News and Highlights from the NFL, NBA, NHL, MLB, MLS, and leagues around the world.",
//     members_count: 5000,
//     welcome_message: "",
//     type: "Private",
//     nsfw_flag: false,
//     profile_picture:
//       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
//     banner_picture:
//       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/373.jpg",
//     created_at: "2024-04-16T15:06:52.270Z",
//     rank: 5,
//     joined_flag: false,
//   },
//   {
//     name: "programming",
//     description: "Computer Programming",
//     members_count: 5000,
//     welcome_message: "",
//     type: "Private",
//     nsfw_flag: false,
//     profile_picture:
//       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
//     banner_picture:
//       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/373.jpg",
//     created_at: "2024-04-16T15:06:52.270Z",
//     rank: 1,
//     joined_flag: false,
//   },
//   {
//     name: "sports",
//     description: "The musical community of reddit",
//     members_count: 2000,
//     welcome_message: "",
//     type: "Private",
//     nsfw_flag: false,
//     profile_picture:
//       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
//     banner_picture:
//       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/373.jpg",
//     created_at: "2024-04-16T15:06:52.270Z",
//     rank: 3,
//     joined_flag: false,
//   },
// ];

let communities = [
  {
    name: "sports",
    description:
      "Sports News and Highlights from the NFL, NBA, NHL, MLB, MLS, and leagues around the world.",
    welcome_message: "",
    type: "Private",
    nsfw_flag: false,
    members_count: 5000,
    profile_picture:
      "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
    banner_picture:
      "https://wpimg.pixelied.com/blog/wp-content/uploads/2021/08/03132815/relevant-elements-reddit-banner-size.jpg",
    created_at: "2024-04-16T15:06:52.270Z",
    joined_flag: true,
    moderator_flag: true,
    muted_flag: true,
    favorite_flag: true,
  },
  {
    name: "programming",
    description:
      "programming news and discussion about programming culture and programming history",
    welcome_message: "",
    type: "Private",
    nsfw_flag: false,
    members_count: 1500,
    profile_picture:
      "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
    banner_picture:
      "https://wpimg.pixelied.com/blog/wp-content/uploads/2021/08/03132815/relevant-elements-reddit-banner-size.jpg",
    created_at: "2024-04-16T15:06:52.270Z",
    joined_flag: true,
    moderator_flag: false,
    muted_flag: false,
    favorite_flag: false,
  },
  {
    name: "musicFALSE",
    description: "The musical community of reddit",
    welcome_message: "",
    type: "Private",
    nsfw_flag: false,
    members_count: 2000,
    profile_picture:
      "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
    banner_picture:
      "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
    created_at: "2024-04-16T15:06:52.270Z",
    joined_flag: true,
    moderator_flag: false,
    muted_flag: false,
    favorite_flag: false,
  },
];

app.get("/communities/get-history-posts/", (req, res) => {
  res.status(200).json(recentPostsList);
});

//Added Request (doesn't exist in the API)
//(return the community details by passing the community name as a prameter in the path)
app.get("/communities/get-community-view/:communityname", (req, res) => {
  const { communityname } = req.params;

  const community = communitiesPost.find(
    (community) => community.name === communityname
  );
  if (community) {
    // console.log(community);
    res.status(200).json(community);
  } else {
    res.status(404).json({ error: "Community not found" });
  }
});

app.post("/communities/add-community", (req, res) => {
  const { name, description, type, nsfw_flag, category } = req.body;
  // console.log(
  //   "name",
  //   name,
  //   "description",
  //   description,
  //   "type",
  //   type,
  //   "nsfw_flag",
  //   nsfw_flag,
  //   "category",
  //   category
  // );
  const newCommunity = {
    name: name,
    description: description,
    welcome_message: "",
    type: type,
    nsfw_flag: nsfw_flag,
    members_count: 1,
    profile_picture: "",
    banner_picture: "",
    created_at: new Date().toISOString(),
    joined_flag: true,
    moderator_flag: true,
    muted_flag: false,
    favorite_flag: false,
  };

  communities.push(newCommunity);
  // console.log(communities);
  res.sendStatus(200);
});

app.get("/communities/get-community-names", (req, res) => {
  const communityDetails = communities.map((community) => {
    return {
      _id: community.description, // just to semulate the id
      name: community.name,
    };
  });
  console.log(communityDetails);
  res.status(200).json(communityDetails);
});

app.post("/users/mute-unmute-community", (req, res) => {
  const { community_name } = req.body;
  // console.log(community_name);
  communities = communities.map((community) => {
    if (community.name === community_name) {
      community.muted_flag = !community.muted_flag;
    }
    // console.log(community);
    return community;
  });
  res.sendStatus(200);
});

app.patch("/users/favorite-unfavorite-community", (req, res) => {
  const { community_name } = req.body;
  // console.log(community_name);
  communities = communities.map((community) => {
    if (community.name === community_name) {
      community.favorite_flag = !community.favorite_flag;
    }
    // console.log(community);
    return community;
  });
  res.sendStatus(200);
});

app.post("/communities/add-profile-picture", (req, res) => {
  const { community_name, profile_picture } = req.body;
  // console.log(
  //   "community_name",
  //   community_name,
  //   "profile_picture",
  //   profile_picture
  // );
  communities = communities.map((community) => {
    if (community.name === community_name) {
      community.profile_picture = profile_picture;
    }
    // console.log(community);
    return community;
  });
  res.sendStatus(200);
});

app.post("/communities/delete-profile-picture", (req, res) => {
  const { community_name } = req.body;
  // console.log(community_name);
  communities = communities.map((community) => {
    if (community.name === community_name) {
      community.profile_picture = null;
    }
    // console.log(community);
    return community;
  });
  res.sendStatus(200);
});

app.post("/communities/add-banner-picture", (req, res) => {
  const { community_name, banner_picture } = req.body;
  console.log(
    "community_name",
    community_name,
    "banner_picture",
    banner_picture
  );
  communities = communities.map((community) => {
    if (community.name === community_name) {
      community.banner_picture = banner_picture;
    }
    // console.log(community);
    return community;
  });
  res.sendStatus(200);
});

app.post("/communities/delete-banner-picture", (req, res) => {
  const { community_name } = req.body;
  // console.log(community_name);
  communities = communities.map((community) => {
    if (community.name === community_name) {
      community.banner_picture = null;
    }
    // console.log(community);
    return community;
  });
  res.sendStatus(200);
});

let recentPostsList = [
  {
    id: "1",
    user_id: "user123",
    username: "john_doe",
    title: "My First Post",
    description:
      "This is how Kellyn Acosta won it for the Chicago Fire in the 99th minute",
    created_at: "2024-03-29",
    edited_at: "2024-03-29",
    deleted_at: "2024-03-29",
    type: "image_and_videos",
    link_url: "https://example.com",
    images: [
      {
        path: "image1.jpg",
        caption: "Image caption 1",
        link: "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
      },
      {
        path: "image2.jpg",
        caption: "Image caption 2",
        link: "https://example.com/image2",
      },
    ],
    videos: [
      {
        path: "video1.mp4",
        caption: "Video caption 1",
        link: "https://example.com/video1",
      },
    ],
    poll: {
      options: ["Option 1", "Option 2", "Option 3"],
      votes: [10, 5, 7],
    },
    community_id: "community123",
    community_name: "sports",
    comments_count: 9,
    // added //
    // communityAvatarSrc:
    //   "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
    // communityCoverSrc:
    //   "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
    // joined: true,
    // communityDescription:
    //   "Sports news and discussion about sports culture and sports history",
    // communityMembers: 356,
    // communityOnline: 12,
    //
    views_count: 100,
    shares_count: 20,
    upvotes_count: 8,
    downvotes_count: 5,
    oc_flag: true,
    spoiler_flag: false,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "null (Recommended)",
    moderator_details: {
      approved_by: "moderator1",
      approved_date: "2024-03-29",
      removed_by: null,
      removed_date: null,
      spammed_by: null,
      spammed_type: null,
    },
    user_details: {
      total_views: 1000,
      upvote_rate: 0.5,
      total_shares: 30,
    },
  },
  {
    id: "2",
    user_id: "user123",
    username: "john_doe",
    title: "My First Post",
    description:
      "This is how Kellyn Acosta won it for the Chicago Fire in the 99th minute",
    created_at: "2024-03-29",
    edited_at: "2024-03-29",
    deleted_at: "2024-03-29",
    type: "image_and_videos",
    link_url: "https://example.com",
    images: [
      {
        path: "image1.jpg",
        caption: "Image caption 1",
        link: "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
      },
      {
        path: "image2.jpg",
        caption: "Image caption 2",
        link: "https://example.com/image2",
      },
    ],
    videos: [
      {
        path: "video1.mp4",
        caption: "Video caption 1",
        link: "https://example.com/video1",
      },
    ],
    poll: {
      options: ["Option 1", "Option 2", "Option 3"],
      votes: [10, 5, 7],
    },
    community_id: "community123",
    community_name: "programming",
    comments_count: 20,
    // // added //
    // communityAvatarSrc:
    //   "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
    // communityCoverSrc:
    //   "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
    // joined: false,
    // communityDescription:
    //   "programming news and discussion about programming culture and programming history",
    // communityMembers: 2114,
    // communityOnline: 63,
    // //
    views_count: 100,
    shares_count: 20,
    upvotes_count: 57,
    downvotes_count: 5,
    oc_flag: true,
    spoiler_flag: false,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "null (Recommended)",
    moderator_details: {
      approved_by: "moderator1",
      approved_date: "2024-03-29",
      removed_by: null,
      removed_date: null,
      spammed_by: null,
      spammed_type: null,
    },
    user_details: {
      total_views: 1000,
      upvote_rate: 0.5,
      total_shares: 30,
    },
  },
];

app.post("/users/join-community", (req, res) => {
  const { communityName } = req.body;
  // recentPostsList = recentPostsList.map((post) => {
  //   if (post.community_name === communityName) {
  //     post.joined = true;
  //     console.log(post);
  //   }
  //   return post;
  // });
  communities = communities.map((community) => {
    if (community.name === communityName) {
      community.joined_flag = true;
      console.log(community);
    }
    return community;
  });
  res.sendStatus(200);
});

app.post("/users/leave-community", (req, res) => {
  const { communityName } = req.body;
  // recentPostsList = recentPostsList.map((post) => {
  //   if (post.community_name === communityName) {
  //     post.joined_flag = false;
  //     post.moderator_flag = false;
  //     console.log(post);
  //   }
  // return post;
  // });

  communities = communities.map((community) => {
    if (community.name === communityName) {
      community.joined_flag = false;
      community.moderator_flag = false;
      console.log(community);
    }
    return community;
  });

  res.sendStatus(200);
});

// let notifications = [
//   {
//     id: "1",
//     created_at: new Date().toISOString().split("T")[0],
//     post_id: "post123",
//     comment_id: "comment456",
//     sending_user_username: "osama_youssef",
//     description:
//       "first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description",
//     unread_flag: true,
//     hidden_flag: false,
//     type: "message",
//     // added //
//     community_name: "sports",
//     communityAvatarSrc:
//       "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
//   },
//   {
//     id: "5",
//     created_at: new Date().toISOString().split("T")[0],
//     post_id: "post123",
//     comment_id: "comment456",
//     sending_user_username: "osama_youssef",
//     description:
//       "first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description",
//     unread_flag: true,
//     hidden_flag: false,
//     type: "message",
//     // added //
//     community_name: "sports",
//     communityAvatarSrc:
//       "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
//   },
//   {
//     id: "6",
//     created_at: new Date().toISOString().split("T")[0],
//     post_id: "post123",
//     comment_id: "comment456",
//     sending_user_username: "osama_youssef",
//     description:
//       "first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description first notification description",
//     unread_flag: true,
//     hidden_flag: false,
//     type: "message",
//     // added //
//     community_name: "sports",
//     communityAvatarSrc:
//       "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
//   },
//   {
//     id: "2",
//     created_at: "2024-03-25",
//     post_id: "post789",
//     comment_id: "comment012",
//     sending_user_username: "ahmed_tarek",
//     description: "You have a new comment",
//     unread_flag: false,
//     hidden_flag: false,
//     type: "comment",
//     // added //
//     community_name: "programming",
//     communityAvatarSrc:
//       "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
//   },
//   {
//     id: "3",
//     created_at: "2024-03-24",
//     post_id: "post345",
//     comment_id: "comment678",
//     sending_user_username: "osama_youssef",
//     description: "You have a new reply",
//     unread_flag: true,
//     hidden_flag: false,
//     type: "reply",
//     // added //
//     community_name: "sports",
//     communityAvatarSrc:
//       "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
//   },
//   {
//     id: "4",
//     created_at: "2024-03-24",
//     post_id: "post345",
//     comment_id: "comment678",
//     sending_user_username: "osama_youssef",
//     description: "You have a new reply",
//     unread_flag: true,
//     hidden_flag: false,
//     type: "reply",
//     // added //
//     community_name: "sports",
//     communityAvatarSrc:
//       "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
//   },
// ];

let notifications = {
  message: "Notifications retrieved successfully",
  content: [
    {
      id: "662a9de91132db0243d8c00c",
      created_at: "2024-04-25T18:16:09.907Z",
      post_id: "6629afd4dfd778944105aef8",
      sending_user_username: "malak",
      community_name: "Wehner___Rohan",
      unread_flag: false,
      hidden_flag: false,
      type: "upvotes_posts",
      profile_picture:
        "https://styles.redditmedia.com/t5_2fwo/styles/communityIcon_1bqa1ibfp8q11.png",
      is_in_community: true,
    },
    {
      id: "662aab84b84c27ffef962964",
      created_at: "2024-04-25T19:14:12.707Z",
      post_id: "6629afd4dfd778944105aef8",
      comment_id: "662aab84b84c27ffef962960",
      sending_user_username: "malak22",
      community_name: "Wehner___Ron",
      unread_flag: true,
      hidden_flag: false,
      type: "comments",
      profile_picture:
        "https://styles.redditmedia.com/t5_2qgzy/styles/communityIcon_rvt3zjh1fc551.png",
      is_in_community: true,
    },
    {
      id: "662aace0fd33b25b20528a6c",
      created_at: "2024-04-25T19:20:00.089Z",
      comment_id: "662aaaa43d96f655a0a28916",
      sending_user_username: "malak22",
      community_name: "Wehner___Rohan",
      unread_flag: true,
      hidden_flag: false,
      type: "replies",
      profile_picture: "",
      is_in_community: true,
    },
    {
      id: "662aad9e4349c05d95f23f4f",
      created_at: "2024-04-25T19:23:10.986Z",
      sending_user_username: "malak22",
      community_name: null,
      unread_flag: true,
      hidden_flag: false,
      type: "new_followers",
      profile_picture:
        "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
      is_in_community: false,
    },
    {
      id: "662d80576e741daa421029f0",
      created_at: "2024-04-27T22:46:47.010Z",
      post_id: "662998cb8dbe0ea1ff3bfa52",
      sending_user_username: "osss",
      community_name: "malaktest",
      unread_flag: true,
      hidden_flag: false,
      type: "upvotes_posts",
      profile_picture: "",
      is_in_community: true,
    },
  ],
};

app.get("/notifications", (req, res) => {
  res.status(200).json(notifications.content);
});

app.patch("/notifications/mark-all-as-read", (req, res) => {
  notifications = notifications.map((notification) => ({
    ...notification,
    unread_flag: false,
  }));
  res.sendStatus(200);
});

app.patch("/notifications/mark-as-read/:id", (req, res) => {
  const { id } = req.params;
  const { read_flag } = req.body;
  const notification = notifications.find((notif) => notif.id === id);
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }
  notification.unread_flag = read_flag;
  res.sendStatus(200);
});

app.patch("/notifications/hide/:id", (req, res) => {
  const { id } = req.params;
  const notificationIndex = notifications.findIndex((notif) => notif.id === id);
  if (notificationIndex === -1) {
    return res.status(404).json({ message: "Notification not found" });
  }
  notifications[notificationIndex].hidden_flag = true;
  notifications.splice(notificationIndex, 1);
  res.sendStatus(200);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
// let postsListings = [
//   {
//     deleted: false, //mtzwda
//     is_post: true,
//     _id: "15",
//     user_id: "user1",
//     // username: "john_doe",
//     title: "First Post",
//     description: "This is the first post",
//     created_at: "2024-03-29",
//     edited_at: "2024-03-29",
//     deleted_at: "2024-03-29",
//     type: "image_and_videos",
//     link_url: "https://example.com",
//     images: [
//       {
//         path: "image1.jpg",
//         caption: "Image 1",
//         link: "https://source.unsplash.com/random",
//         ////
//         _id: "asdasdasd",
//       },
//     ],
//     videos: [
//       {
//         path: "video1.mp4",
//         caption: "Video 1",
//         link: "https://example.com/video1.mp4",
//         _id: "qqqqqq",
//       },
//     ],
//     //metghyr
//     polls: [
//       {
//         options: "option 1",
//         votes: 0,
//         _id: "6617aec5023c99b0dcaf4399",
//       },
//       {
//         options: "option 2",
//         votes: 0,
//         _id: "6617aec5023c99b0dcaf439a",
//       },
//       {
//         options: "option 3",
//         votes: 4,
//         _id: "6817aec5023c99b0dcaf439a",
//       },
//     ],
//     polls_voting_length: 3, //mtzwd
//     polls_voting_is_expired_flag: false, ////mtzwd
//     post_in_community_flag: false,
//     // community_id: "community1", etshal
//     community_name: "Community 1",
//     comments_count: 0,
//     views_count: 0,
//     shares_count: 0,
//     upvotes_count: 0,
//     downvotes_count: 0,
//     oc_flag: true,
//     spoiler_flag: true,
//     nsfw_flag: true,
//     locked_flag: true,
//     allowreplies_flag: true,
//     scheduled_flag: false, //mtzwd
//     set_suggested_sort: "null (Recommended)",
//     moderator_details: {
//       approved_by: "moderator1",
//       approved_date: "2024-03-29",
//       removed_by: "moderator2",
//       removed_date: "2024-03-29",
//       spammed_by: "moderator3",
//       spammed_type: "spam",
//       spammed_flag: false,
//       approved_flag: false,
//       removed_flag: false,
//     },
//     user_details: {
//       total_views: 0,
//       upvote_rate: 0,
//       total_shares: 0,
//     },
//     is_reposted_flag: false, //mtzwd
//     reposted: [], // mtzwd
//     user_id: "661574f4faed34e05f91ded3", //mtzwd
//     __v: 0, //mtzwd
// },
// {
//   is_post: true,
//   id: "18",
//   avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
//   user_id: "user2",
//   username: "jane_smith",
//   title: "Second Post",
//   description: "This is the second post",
//   created_at: "2024-03-26",
//   edited_at: "2024-03-26",
//   deleted_at: "2024-03-26",
//   type: "image_and_videos",
//   link_url: "https://example.com",
//   images: [
//     {
//       path: "image2.jpg",
//       caption: "Image 2",
//       link: "https://source.unsplash.com/random",
//     },
//   ],
//   videos: [
//     {
//       path: "video2.mp4",
//       caption: "Video 2",
//       link: "https://example.com/video2.mp4",
//     },
//   ],
//   poll: {
//     options: ["Option 1", "Option 2", "Option 3"],
//     votes: [0, 0, 0],
//   },
//   community_id: "community2",
//   community_name: "programming",
//   comments_count: 0,
//   views_count: 0,
//   shares_count: 0,
//   upvotes_count: 0,
//   downvotes_count: 0,
//   oc_flag: true,
//   spoiler_flag: true,
//   nsfw_flag: true,
//   locked_flag: true,
//   allowreplies_flag: true,
//   set_suggested_sort: "null (Recommended)",
//   moderator_details: {
//     approved_flag: true,
//     approved_by: "moderator1",
//     approved_date: "2024-03-26",
//     removed_by: "moderator2",
//     removed_date: "2024-03-26",
//     spammed_by: "moderator3",
//     spammed_type: "spam",
//   },
//   user_details: {
//     total_views: 0,
//     upvote_rate: 0,
//     total_shares: 0,
//   },
// },
// {
//   is_post: true,
//   _id: "3",
//   user_id: "user3",
//   username: "username",
//   avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
//   title: "Third Post",
//   description: "This is the third post",
//   created_at: "2024-03-27",
//   edited_at: "2024-03-27",
//   deleted_at: "2024-03-27",
//   type: "image_and_videos",
//   link_url: "https://example.com",
//   images: [
//     {
//       path: "image3.jpg",
//       caption: "Image 3",
//       link: "https://source.unsplash.com/random",
//     },
//   ],
//   videos: [
//     {
//       path: "video3.mp4",
//       caption: "Video 3",
//       link: "https://example.com/video3.mp4",
//     },
//   ],
//   poll: {
//     options: ["Option 1", "Option 2", "Option 3"],
//     votes: [0, 0, 0],
//   },
//   community_id: "community3",
//   community_name: "programming",
//   comments_count: 0,
//   views_count: 0,
//   shares_count: 0,
//   upvotes_count: 0,
//   downvotes_count: 0,
//   oc_flag: true,
//   spoiler_flag: true,
//   nsfw_flag: true,
//   locked_flag: true,
//   allowreplies_flag: true,
//   set_suggested_sort: "null (Recommended)",
//   moderator_details: {
//     approved_flag: false,
//     approved_by: "moderator1",
//     approved_date: "2024-03-27",
//     removed_by: "moderator2",
//     removed_date: "2024-03-27",
//     spammed_by: "moderator3",
//     spammed_type: "spam",
//   },
//   user_details: {
//     total_views: 0,
//     upvote_rate: 0,
//     total_shares: 0,
//   },
// },
// {
//   is_post: true,
//   _id: "4",
//   user_id: "user4",
//   username: "john_doe",
//   avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
//   title: "First Post",
//   description: "This is the first post",
//   created_at: "2024-03-29",
//   edited_at: "2024-03-29",
//   deleted_at: "2024-03-29",
//   type: "image_and_videos",
//   link_url: "https://example.com",
//   images: [
//     {
//       path: "image4.jpg",
//       caption: "Image 4",
//       link: "https://source.unsplash.com/random",
//     },
//   ],
//   videos: [
//     {
//       path: "video4.mp4",
//       caption: "Video 4",
//       link: "https://example.com/video4.mp4",
//     },
//   ],
//   poll: {
//     options: ["Option 4", "Option 2", "Option 3"],
//     votes: [0, 0, 0],
//   },
//   community_id: "community4",
//   community_name: "Community2",
//   comments_count: 0,
//   views_count: 0,
//   shares_count: 0,
//   upvotes_count: 0,
//   downvotes_count: 0,
//   oc_flag: true,
//   spoiler_flag: true,
//   nsfw_flag: true,
//   locked_flag: true,
//   allowreplies_flag: true,
//   set_suggested_sort: "null (Recommended)",
//   moderator_details: {
//     approved_by: "moderator4",
//     approved_date: "2024-03-29",
//     removed_by: "moderator2",
//     removed_date: "2024-03-29",
//     spammed_by: "moderator3",
//     spammed_type: "spam",
//   },
//   user_details: {
//     total_views: 0,
//     upvote_rate: 0,
//     total_shares: 0,
//   },
// },
// {
//   is_post: true,
//   _id: "5",
//   user_id: "user5",
//   username: "joe_bloggs",
//   avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
//   title: "Third Post",
//   description: "This is the third post",
//   created_at: "2024-05-27",
//   edited_at: "2024-05-27",
//   deleted_at: "2024-05-27",
//   type: "image_and_videos",
//   link_url: "https://example.com",
//   images: [
//     {
//       path: "image5.jpg",
//       caption: "Image 5",
//       link: "https://source.unsplash.com/random",
//     },
//   ],
//   videos: [
//     {
//       path: "video5.mp4",
//       caption: "Video 5",
//       link: "https://example.com/video5.mp4",
//     },
//   ],
//   poll: {
//     options: ["Option 1", "Option 2", "Option 3"],
//     votes: [0, 0, 0],
//   },
//   community_id: "community3",
//   community_name: "Community2",
//   comments_count: 0,
//   views_count: 0,
//   shares_count: 0,
//   upvotes_count: 0,
//   downvotes_count: 0,
//   oc_flag: true,
//   spoiler_flag: true,
//   nsfw_flag: true,
//   locked_flag: true,
//   allowreplies_flag: true,
//   set_suggested_sort: "null (Recommended)",
//   moderator_details: {
//     approved_by: "moderator1",
//     approved_date: "2024-03-27",
//     removed_by: "moderator2",
//     removed_date: "2024-03-27",
//     spammed_by: "moderator3",
//     spammed_type: "spam",
//   },
//   user_details: {
//     total_views: 0,
//     upvote_rate: 0,
//     total_shares: 0,
//   },
// },
// {
//   is_post: true,
//   _id: "6",
//   user_id: "user6",
//   username: "jane_smith",
//   title: "Second Post",
//   avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
//   description: "This is the second post",
//   created_at: "2024-03-26",
//   edited_at: "2024-03-26",
//   deleted_at: "2024-03-26",
//   type: "image_and_videos",
//   link_url: "https://example.com",
//   images: [
//     {
//       path: "image2.jpg",
//       caption: "Image 2",
//       link: "https://source.unsplash.com/random",
//     },
//   ],
//   videos: [
//     {
//       path: "video2.mp4",
//       caption: "Video 2",
//       link: "https://example.com/video2.mp4",
//     },
//   ],
//   poll: {
//     options: ["Option 1", "Option 2", "Option 3"],
//     votes: [0, 0, 0],
//   },
//   community_id: "community2",
//   community_name: "Community2",
//   comments_count: 0,
//   views_count: 0,
//   shares_count: 0,
//   upvotes_count: 0,
//   downvotes_count: 0,
//   oc_flag: true,
//   spoiler_flag: true,
//   nsfw_flag: true,
//   locked_flag: true,
//   allowreplies_flag: true,
//   set_suggested_sort: "null (Recommended)",
//   moderator_details: {
//     approved_by: "moderator1",
//     approved_date: "2024-03-26",
//     removed_by: "moderator2",
//     removed_date: "2024-03-26",
//     spammed_by: "moderator3",
//     spammed_type: "spam",
//   },
//   user_details: {
//     total_views: 0,
//     upvote_rate: 0,
//     total_shares: 0,
//   },
// },
// ].concat(recentPostsList); // m3 haget osama

let postsListings = [
  {
    _id: "7",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1.jpg",
    saved: false,
    user_id: "8",
    username: "user101",
    title: "Post with Spoiler",
    description: "This post contains spoilers",
    created_at: new Date(),
    deleted: false,
    type: "polls",
    link_url: null,
    images: [
      {
        path: "https://images.pexels.com/photos/14616449/pexels-photo-14616449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        link: "https://images.pexels.com/photos/14616449/pexels-photo-14616449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        caption: "Image 1",
      },
      {
        path: "https://images.pexels.com/photos/14616449/pexels-photo-14616449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        link: "https://images.pexels.com/photos/14616449/pexels-photo-14616449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        caption: "Image 2",
      },
    ],
    videos: [],
    polls: [
      { options: "Option 1", votes: 10 },
      { options: "Option 2", votes: 5 },
    ],
    polls_voting_length: 7,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: false,
    community_id: "6",
    community_name: "programming",
    comments_count: 3,
    views_count: 15,
    shares_count: 2,
    upvotes_count: 7,
    downvotes_count: 1,
    oc_flag: true,
    spoiler_flag: true,
    nsfw_flag: true,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Top",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "john",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 15,
      upvote_rate: 0.7,
      total_shares: 2,
    },
    is_reposted_flag: false,
    reposted: null,
  },
  {
    _id: "8",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/2.jpg",
    saved: true,
    user_id: "9",
    username: "user202",
    title: "Video Post",
    description: "Check out this cool video",
    created_at: new Date(),
    deleted: false,
    type: "reposted",
    link_url: null,
    images: [],
    videos: [
      // { "path": "/videos/video2.mp4", "caption": "Cool Video", "link": "https://example.com/video2" }
    ],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: false,
    community_id: "6",
    community_name: "programming",
    comments_count: 5,
    views_count: 30,
    shares_count: 10,
    upvotes_count: 20,
    downvotes_count: 3,
    oc_flag: false,
    spoiler_flag: false,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "New",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "sara",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 30,
      upvote_rate: 0.75,
      total_shares: 10,
    },
    is_reposted_flag: true,
    reposted: "7",
  },
  {
    _id: "9",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/3.jpg",
    saved: false,
    user_id: "10",
    username: "user303",
    title: "URL Post",
    description: "This is a URL-based post",
    created_at: new Date(),
    deleted: false,
    type: "url",
    link_url: "https://example3.com",
    images: [],
    videos: [],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: true,
    community_id: "10",
    community_name: "Tech Community",
    comments_count: 6,
    views_count: 25,
    shares_count: 8,
    upvotes_count: 15,
    downvotes_count: 2,
    oc_flag: false,
    spoiler_flag: false,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Controversial",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "mohamed",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 25,
      upvote_rate: 0.6,
      total_shares: 8,
    },
    is_reposted_flag: false,
    reposted: null,
  },
  {
    _id: "1",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
    saved: true,
    user_id: "2",
    username: "user123",
    title: "A Random Post",
    description: "da description",
    created_at: new Date(),
    deleted: false,
    type: "text",
    link_url: null,
    images: [],
    videos: [],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: false,
    community_id: "6",
    community_name: "programming",
    comments_count: 2,
    views_count: 10,
    shares_count: 1,
    upvotes_count: 5,
    downvotes_count: 0,
    oc_flag: true,
    spoiler_flag: false,
    nsfw_flag: true,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Best",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "hazem",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 10,
      upvote_rate: 0.8,
      total_shares: 1,
    },
    is_reposted_flag: true,
    reposted: "9",
  },
  {
    _id: "4",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
    saved: true,
    user_id: "5",
    username: "user456",
    title: "Another Random Post",
    description: "description",
    created_at: new Date(),
    deleted: false,
    type: "image_and_videos",
    link_url: "https://example.com",
    images: [
      // { "path": "/images/img1.jpg", "caption": "First Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" },
      // { "path": "/images/img1.jpg", "caption": "sec Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" }
    ],
    videos: [
      {
        path: "/videos/video1.mp4",
        caption: "First Video",
        link: "https://example.com/video1",
      },
    ],
    polls: [
      { options: "Option 1", votes: 10 },
      { options: "Option 2", votes: 5 },
    ],
    polls_voting_length: 7,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: true,
    community_id: "6",
    community_name: "programming",
    comments_count: 10,
    views_count: 50,
    shares_count: 5,
    upvotes_count: 25,
    downvotes_count: 2,
    oc_flag: false,
    spoiler_flag: false,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "New",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: false,
      approved_by: "ahmed",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: new Date(),
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 50,
      upvote_rate: 0.9,
      total_shares: 5,
    },
    is_reposted_flag: false,
    reposted: null,
  },
  {
    _id: "6",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
    saved: true,
    user_id: "7",
    username: "user789",
    title: "Third Random Post",
    description: "",
    created_at: new Date(),
    deleted: false,
    type: "url",
    link_url: "https://example2.com",
    images: [
      // { "path": "/images/img1.jpg", "caption": "First Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" },
    ],
    videos: [],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: true,
    community_id: "8",
    community_name: "sports",
    comments_count: 2,
    comments_ids: [16, 13],
    followers_ids: [],
    views_count: 20,
    shares_count: 2,
    upvotes_count: 10,
    downvotes_count: 1,
    oc_flag: false,
    spoiler_flag: true,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Top",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "youssef",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 20,
      upvote_rate: 0.7,
      total_shares: 2,
    },
    is_reposted_flag: false,
    reposted: null,
  },
  {
    _id: "10",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
    saved: true,
    user_id: "7",
    username: "user789",
    title: "4th Random Post",
    description: "",
    created_at: new Date(),
    deleted: false,
    type: "url",
    link_url: "https://example2.com",
    images: [
      // { "path": "/images/img1.jpg", "caption": "First Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" },
    ],
    videos: [],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: true,
    community_id: "8",
    community_name: "TECH",
    comments_count: 5,
    views_count: 20,
    shares_count: 2,
    upvotes_count: 10,
    downvotes_count: 1,
    oc_flag: false,
    spoiler_flag: true,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Top",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "youssef",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 20,
      upvote_rate: 0.7,
      total_shares: 2,
    },
    is_reposted_flag: false,
    reposted: null,
  },
  {
    _id: "11",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
    saved: true,
    user_id: "7",
    username: "user789",
    title: "5th Random Post",
    description: "",
    created_at: new Date(),
    deleted: false,
    type: "url",
    link_url: "https://example2.com",
    images: [
      // { "path": "/images/img1.jpg", "caption": "First Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" },
    ],
    videos: [],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: true,
    community_id: "8",
    community_name: "TECH",
    comments_count: 5,
    views_count: 20,
    shares_count: 2,
    upvotes_count: 10,
    downvotes_count: 1,
    oc_flag: false,
    spoiler_flag: true,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Top",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "youssef",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 20,
      upvote_rate: 0.7,
      total_shares: 2,
    },
    is_reposted_flag: false,
    reposted: null,
  },
  {
    _id: "12",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
    saved: true,
    user_id: "7",
    username: "user789",
    title: "6th Random Post",
    description: "",
    created_at: new Date(),
    deleted: false,
    type: "url",
    link_url: "https://example2.com",
    images: [
      // { "path": "/images/img1.jpg", "caption": "First Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" },
    ],
    videos: [],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: true,
    community_id: "8",
    community_name: "TECH",
    comments_count: 5,
    views_count: 20,
    shares_count: 2,
    upvotes_count: 10,
    downvotes_count: 1,
    oc_flag: false,
    spoiler_flag: true,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Top",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "youssef",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 20,
      upvote_rate: 0.7,
      total_shares: 2,
    },
    is_reposted_flag: false,
    reposted: null,
  },
  {
    _id: "13",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
    saved: true,
    user_id: "7",
    username: "user789",
    title: "7th Random Post",
    description: "",
    created_at: new Date(),
    deleted: false,
    type: "url",
    link_url: "https://example2.com",
    images: [
      // { "path": "/images/img1.jpg", "caption": "First Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" },
    ],
    videos: [],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: true,
    community_id: "8",
    community_name: "TECH",
    comments_count: 5,
    views_count: 20,
    shares_count: 2,
    upvotes_count: 10,
    downvotes_count: 1,
    oc_flag: false,
    spoiler_flag: true,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Top",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "youssef",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 20,
      upvote_rate: 0.7,
      total_shares: 2,
    },
    is_reposted_flag: false,
    reposted: null,
  },
  {
    _id: "14",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
    saved: true,
    user_id: "7",
    username: "user789",
    title: "8th Random Post",
    description: "",
    created_at: new Date(),
    deleted: false,
    type: "url",
    link_url: "https://example2.com",
    images: [
      // { "path": "/images/img1.jpg", "caption": "First Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" },
    ],
    videos: [],
    polls: [],
    polls_voting_length: 3,
    polls_voting_is_expired_flag: false,
    post_in_community_flag: true,
    community_id: "8",
    community_name: "TECH",
    comments_count: 5,
    views_count: 20,
    shares_count: 2,
    upvotes_count: 10,
    downvotes_count: 1,
    oc_flag: false,
    spoiler_flag: true,
    nsfw_flag: false,
    locked_flag: false,
    allowreplies_flag: true,
    set_suggested_sort: "Top",
    scheduled_flag: false,
    moderator_details: {
      approved_flag: true,
      approved_by: "youssef",
      approved_date: new Date(),
      removed_flag: false,
      removed_by: null,
      removed_date: null,
      removed_removal_reason: null,
      spammed_flag: false,
      spammed_by: null,
      spammed_type: null,
      spammed_removal_reason: null,
      reported_flag: false,
      reported_by: null,
      reported_type: null,
    },
    user_details: {
      total_views: 20,
      upvote_rate: 0.7,
      total_shares: 2,
    },
    is_reposted_flag: false,
    reposted: null,
  },
];

let comments = {
  message: "Comments Retrieved sucessfully",
  content: [
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorX",
        approved_date: "2024-04-22T08:15:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: true,
      parent_username: "User123",
      _id: "11",
      post_id: "1",
      user_id: "user456",
      username: "User789",
      parent_id: "parent456",
      replies_comments_ids: [],
      created_at: "2024-04-22T09:30:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "Great point! I completely agree.",
      comment_in_community_flag: true,
      community_id: "community123",
      community_name: "Example Community",
      upvotes_count: 10,
      downvotes_count: 2,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      saved: false,
      __v: 0,
    },
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorZ",
        approved_date: "2024-04-22T12:20:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: true,
      parent_username: "User789",
      _id: "12",
      post_id: "4",
      user_id: "user123",
      username: "User369",
      parent_id: "parent456",
      replies_comments_ids: [],
      created_at: "2024-04-22T13:00:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "I have a different perspective on this.",
      comment_in_community_flag: true,
      community_id: "community123",
      community_name: "Example Community",
      upvotes_count: 5,
      downvotes_count: 3,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      saved: true,
      __v: 0,
    },
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorX",
        approved_date: "2024-04-22T14:30:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: false,
      parent_username: "",
      _id: "13",
      post_id: "6",
      user_id: "user789",
      username: "User579",
      parent_id: "",
      replies_comments_ids: [],
      created_at: "2024-04-22T15:20:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "I think this topic needs more discussion.",
      comment_in_community_flag: true,
      community_id: "community123",
      community_name: "Example Community",
      upvotes_count: 12,
      downvotes_count: 0,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      saved: false,
      __v: 0,
    },
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorZ",
        approved_date: "2024-04-22T16:45:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: false,
      parent_username: "",
      _id: "14",
      post_id: "1",
      user_id: "user456",
      username: "User789",
      parent_id: "",
      replies_comments_ids: [],
      created_at: "2024-04-22T17:00:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "I found this post very insightful!",
      comment_in_community_flag: true,
      community_id: "community456",
      community_name: "Another Community",
      upvotes_count: 15,
      downvotes_count: 2,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      saved: true,
      __v: 0,
    },
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorA",
        approved_date: "2024-04-22T18:10:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: true,
      parent_username: "UserC",
      _id: "15",
      post_id: "4",
      user_id: "user123",
      username: "UserA",
      parent_id: "parentXYZ",
      replies_comments_ids: [],
      created_at: "2024-04-22T19:00:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "I have a question regarding your point.",
      comment_in_community_flag: true,
      community_id: "communityXYZ",
      community_name: "CommunityXYZ",
      upvotes_count: 6,
      downvotes_count: 1,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      saved: false,
      __v: 0,
    },
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorB",
        approved_date: "2024-04-22T20:30:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: false,
      parent_username: "",
      _id: "16",
      post_id: "6",
      user_id: "user456",
      username: "UserB",
      parent_id: "",
      replies_comments_ids: [],
      created_at: "2024-04-22T21:15:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "Interesting perspective, I hadn't considered that.",
      comment_in_community_flag: true,
      community_id: "communityLMN",
      community_name: "CommunityLMN",
      upvotes_count: 9,
      downvotes_count: 0,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      saved: true,
      __v: 0,
    },
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorC",
        approved_date: "2024-04-22T22:45:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: true,
      parent_username: "UserE",
      _id: "17",
      post_id: "1",
      user_id: "user789",
      username: "UserC",
      saved: false,
      parent_id: "parentOPQ",
      replies_comments_ids: [],
      created_at: "2024-04-22T23:30:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "I agree with your assessment.",
      comment_in_community_flag: true,
      community_id: "communityOPQ",
      community_name: "CommunityOPQ",
      upvotes_count: 7,
      downvotes_count: 2,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      __v: 0,
    },
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorC",
        approved_date: "2024-04-22T22:45:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: true,
      parent_username: "UserE",
      _id: "17",
      post_id: "7",
      user_id: "user789",
      username: "UserC",
      saved: false,
      parent_id: "parentOPQ",
      replies_comments_ids: [],
      created_at: "2024-04-22T23:30:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "I agree with your assessment. Gedan.",
      comment_in_community_flag: true,
      community_id: "communityOPQ",
      community_name: "CommunityOPQ",
      upvotes_count: 10,
      downvotes_count: 2,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      __v: 0,
    },
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorC",
        approved_date: "2024-04-22T22:45:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: false,
      parent_username: "UserE",
      _id: "17",
      post_id: "7",
      user_id: "user789",
      username: "UserC",
      saved: false,
      parent_id: "parentOPQ",
      replies_comments_ids: [],
      created_at: "2024-04-22T23:30:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      description: "I agree with your assessment.",
      comment_in_community_flag: true,
      community_id: "communityOPQ",
      community_name: "CommunityOPQ",
      upvotes_count: 7,
      downvotes_count: 2,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      __v: 0,
    },
  ],
};

let searchComments = [
  {
    moderator_details: {
      approved_flag: true,
      approved_by: "ModeratorX",
      approved_date: "2024-04-22T08:15:00Z",
      removed_flag: false,
      removed_by: "",
      removed_date: "",
      removed_removal_reason: "",
      spammed_flag: false,
      spammed_by: "",
      spammed_type: "",
      spammed_removal_reason: "",
      reported_flag: false,
      reported_by: "",
      reported_type: "",
    },
    is_post: false,
    is_reply: true,
    parent_username: "User123",
    _id: "11",
    post_id: {
      _id: "1",
      avatar:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
      saved: true,
      user_id: "2",
      username: "user123",
      title: "A Random Post",
      description: "da description",
      created_at: new Date(),
      deleted: false,
      type: "text",
      link_url: null,
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_id: "6",
      community_name: "programming",
      comments_count: 2,
      views_count: 10,
      shares_count: 1,
      upvotes_count: 5,
      downvotes_count: 0,
      oc_flag: true,
      spoiler_flag: false,
      nsfw_flag: true,
      locked_flag: false,
      allowreplies_flag: true,
      set_suggested_sort: "Best",
      scheduled_flag: false,
      moderator_details: {
        approved_flag: true,
        approved_by: "hazem",
        approved_date: new Date(),
        removed_flag: false,
        removed_by: null,
        removed_date: null,
        removed_removal_reason: null,
        spammed_flag: false,
        spammed_by: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_flag: false,
        reported_by: null,
        reported_type: null,
      },
      user_details: {
        total_views: 10,
        upvote_rate: 0.8,
        total_shares: 1,
      },
      is_reposted_flag: true,
      reposted: "9",
    },
    user_id: "user456",
    username: "User789",
    parent_id: "parent456",
    replies_comments_ids: [],
    created_at: "2024-04-22T09:30:00Z",
    edited_at: "",
    deleted_at: "",
    deleted: false,
    description: "Great point! I completely agree.",
    comment_in_community_flag: true,
    community_id: "community123",
    community_name: "Example Community",
    upvotes_count: 10,
    downvotes_count: 2,
    spam_flag: false,
    locked_flag: false,
    spoiler_flag: false,
    show_comment_flag: true,
    saved: false,
    __v: 0,
  },
  {
    moderator_details: {
      approved_flag: true,
      approved_by: "ModeratorZ",
      approved_date: "2024-04-22T12:20:00Z",
      removed_flag: false,
      removed_by: "",
      removed_date: "",
      removed_removal_reason: "",
      spammed_flag: false,
      spammed_by: "",
      spammed_type: "",
      spammed_removal_reason: "",
      reported_flag: false,
      reported_by: "",
      reported_type: "",
    },
    is_post: false,
    is_reply: true,
    parent_username: "User789",
    _id: "12",
    post_id: {
      _id: "4",
      avatar:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
      saved: true,
      user_id: "5",
      username: "user456",
      title: "Another Random Post",
      description: "description",
      created_at: new Date(),
      deleted: false,
      type: "image_and_videos",
      link_url: "https://example.com",
      images: [
        // { "path": "/images/img1.jpg", "caption": "First Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" },
        // { "path": "/images/img1.jpg", "caption": "sec Image", "link": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg" }
      ],
      videos: [
        {
          path: "/videos/video1.mp4",
          caption: "First Video",
          link: "https://example.com/video1",
        },
      ],
      polls: [
        { options: "Option 1", votes: 10 },
        { options: "Option 2", votes: 5 },
      ],
      polls_voting_length: 7,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: true,
      community_id: "6",
      community_name: "programming",
      comments_count: 10,
      views_count: 50,
      shares_count: 5,
      upvotes_count: 25,
      downvotes_count: 2,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      set_suggested_sort: "New",
      scheduled_flag: false,
      moderator_details: {
        approved_flag: false,
        approved_by: "ahmed",
        approved_date: new Date(),
        removed_flag: false,
        removed_by: null,
        removed_date: new Date(),
        removed_removal_reason: null,
        spammed_flag: false,
        spammed_by: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_flag: false,
        reported_by: null,
        reported_type: null,
      },
      user_details: {
        total_views: 50,
        upvote_rate: 0.9,
        total_shares: 5,
      },
      is_reposted_flag: false,
      reposted: null,
    },
    user_id: "user123",
    username: "User369",
    parent_id: "parent456",
    replies_comments_ids: [],
    created_at: "2024-04-22T13:00:00Z",
    edited_at: "",
    deleted_at: "",
    deleted: false,
    description: "I have a different perspective on this.",
    comment_in_community_flag: true,
    community_id: "community123",
    community_name: "Example Community",
    upvotes_count: 5,
    downvotes_count: 3,
    spam_flag: false,
    locked_flag: false,
    spoiler_flag: false,
    show_comment_flag: true,
    saved: true,
    __v: 0,
  },
];

function shuffleList(list) {
  let currentIndex = list.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [list[currentIndex], list[randomIndex]] = [
      list[randomIndex],
      list[currentIndex],
    ];
  }

  return list;
}

app.get("/posts/trending", (req, res) => {
  const { page, pageSize } = req.query;
  res.status(200).json({
    success: true,
    status: 200,
    // content: postsListings.slice(page * pageSize, page * pageSize + pageSize),
    content: postsListings.slice(0, 5),
  });
});

let historyPosts = {
  success: true,
  status: 200,
  posts: [
    {
      _id: "1",
      title: "First Post in sports community",
      description: "This is the first post",
      created_at: "2024-03-29",
      edited_at: "2024-03-29",
      deleted_at: "2024-03-29",
      deleted: false,
      type: "image_and_videos",
      link_url: "https://example.com",
      images: [
        // {
        //   path: "image1.jpg",
        //   caption: "Image 1",
        //   link: "https://source.unsplash.com/random",
        // },
      ],
      videos: [
        {
          path: "video1.mp4",
          caption: "Video 1",
          link: "https://example.com/video1.mp4",
        },
      ],
      polls: [
        {
          options: "option 1",
          votes: 0,
        },
        {
          options: "option 2",
          votes: 0,
        },
        {
          options: "option 3",
          votes: 4,
        },
      ],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "sports",
      comments_count: 1,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 2,
      downvotes_count: 3,
      oc_flag: true,
      spoiler_flag: true,
      nsfw_flag: true,
      locked_flag: true,
      allowreplies_flag: true,
      scheduled_flag: false,
      set_suggested_sort: "null (Recommended)",
      moderator_details: {
        approved_by: "moderator1",
        approved_date: "2024-03-29",
        removed_by: "moderator2",
        removed_date: "2024-03-29",
        spammed_by: "moderator3",
        spammed_type: "spam",
        spammed_flag: false,
        approved_flag: false,
        removed_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      is_reposted_flag: false,
      reposted: [],
      user_id: "661574f4faed34e05f91ded3",
      username: "john_doe",
      __v: 0,
    },
    {
      is_post: true,
      id: "18",
      avatar:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
      user_id: "user2",
      username: "jane_smith",
      title: "Second Post",
      description: "This is the second post",
      created_at: "2024-03-26",
      edited_at: "2024-03-26",
      deleted_at: "2024-03-26",
      type: "image_and_videos",
      link_url: "https://example.com",
      images: [
        {
          path: "image2.jpg",
          caption: "Image 2",
          link: "https://source.unsplash.com/random",
        },
      ],
      videos: [
        {
          path: "video2.mp4",
          caption: "Video 2",
          link: "https://example.com/video2.mp4",
        },
      ],
      poll: {
        options: ["Option 1", "Option 2", "Option 3"],
        votes: [0, 0, 0],
      },
      community_id: "community2",
      community_name: "programming",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 0,
      downvotes_count: 0,
      oc_flag: true,
      spoiler_flag: true,
      nsfw_flag: true,
      locked_flag: true,
      allowreplies_flag: true,
      set_suggested_sort: "null (Recommended)",
      moderator_details: {
        approved_flag: true,
        approved_by: "moderator1",
        approved_date: "2024-03-26",
        removed_by: "moderator2",
        removed_date: "2024-03-26",
        spammed_by: "moderator3",
        spammed_type: "spam",
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
    },
    {
      is_post: true,
      _id: "3",
      user_id: "user3",
      username: "Osama",
      avatar:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
      title: "Third Post",
      description: "This is the third post",
      created_at: "2024-03-27",
      edited_at: "2024-03-27",
      deleted_at: "2024-03-27",
      type: "image_and_videos",
      link_url: "https://example.com",
      images: [
        {
          path: "image3.jpg",
          caption: "Image 3",
          link: "https://source.unsplash.com/random",
        },
      ],
      videos: [
        {
          path: "video3.mp4",
          caption: "Video 3",
          link: "https://example.com/video3.mp4",
        },
      ],
      poll: {
        options: ["Option 1", "Option 2", "Option 3"],
        votes: [0, 0, 0],
      },
      community_id: "community3",
      community_name: "music",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 0,
      downvotes_count: 0,
      oc_flag: true,
      spoiler_flag: true,
      nsfw_flag: true,
      locked_flag: true,
      allowreplies_flag: true,
      set_suggested_sort: "null (Recommended)",
      moderator_details: {
        approved_flag: false,
        approved_by: "moderator1",
        approved_date: "2024-03-27",
        removed_by: "moderator2",
        removed_date: "2024-03-27",
        spammed_by: "moderator3",
        spammed_type: "spam",
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
    },
    {
      _id: "15",
      title: "second Post in sports community",
      description: "This is the first post",
      created_at: "2024-03-29",
      edited_at: "2024-03-29",
      deleted_at: "2024-03-29",
      deleted: false,
      type: "image_and_videos",
      link_url: "https://example.com",
      images: [
        {
          path: "image1.jpg",
          caption: "Image 1",
          link: "https://source.unsplash.com/random",
        },
      ],
      videos: [
        {
          path: "video1.mp4",
          caption: "Video 1",
          link: "https://example.com/video1.mp4",
        },
      ],
      polls: [
        {
          options: "option 1",
          votes: 0,
        },
        {
          options: "option 2",
          votes: 0,
        },
        {
          options: "option 3",
          votes: 4,
        },
      ],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "sports",
      comments_count: 1,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 2,
      downvotes_count: 3,
      oc_flag: true,
      spoiler_flag: true,
      nsfw_flag: true,
      locked_flag: true,
      allowreplies_flag: true,
      scheduled_flag: false,
      set_suggested_sort: "null (Recommended)",
      moderator_details: {
        approved_by: "moderator1",
        approved_date: "2024-03-29",
        removed_by: "moderator2",
        removed_date: "2024-03-29",
        spammed_by: "moderator3",
        spammed_type: "spam",
        spammed_flag: false,
        approved_flag: false,
        removed_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      is_reposted_flag: false,
      reposted: [],
      user_id: "661574f4faed34e05f91ded3",
      username: "john_doe",
      __v: 0,
    },
    {
      is_post: true,
      id: "19",
      avatar:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
      user_id: "user2",
      username: "jane_smith",
      title: "Second Post",
      description: "This is the second post",
      created_at: "2024-03-26",
      edited_at: "2024-03-26",
      deleted_at: "2024-03-26",
      type: "image_and_videos",
      link_url: "https://example.com",
      images: [
        {
          path: "image2.jpg",
          caption: "Image 2",
          link: "https://source.unsplash.com/random",
        },
      ],
      videos: [
        {
          path: "video2.mp4",
          caption: "Video 2",
          link: "https://example.com/video2.mp4",
        },
      ],
      poll: {
        options: ["Option 1", "Option 2", "Option 3"],
        votes: [0, 0, 0],
      },
      community_id: "community2",
      community_name: "programming",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 0,
      downvotes_count: 0,
      oc_flag: true,
      spoiler_flag: true,
      nsfw_flag: true,
      locked_flag: true,
      allowreplies_flag: true,
      set_suggested_sort: "null (Recommended)",
      moderator_details: {
        approved_flag: true,
        approved_by: "moderator1",
        approved_date: "2024-03-26",
        removed_by: "moderator2",
        removed_date: "2024-03-26",
        spammed_by: "moderator3",
        spammed_type: "spam",
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
    },
    {
      is_post: true,
      _id: "5",
      user_id: "user3",
      username: "username",
      avatar:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg",
      title: "Third Post",
      description: "This is the third post",
      created_at: "2024-03-27",
      edited_at: "2024-03-27",
      deleted_at: "2024-03-27",
      type: "image_and_videos",
      link_url: "https://example.com",
      images: [
        {
          path: "image3.jpg",
          caption: "Image 3",
          link: "https://source.unsplash.com/random",
        },
      ],
      videos: [
        {
          path: "video3.mp4",
          caption: "Video 3",
          link: "https://example.com/video3.mp4",
        },
      ],
      poll: {
        options: ["Option 1", "Option 2", "Option 3"],
        votes: [0, 0, 0],
      },
      community_id: "community3",
      community_name: "music",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 0,
      downvotes_count: 0,
      oc_flag: true,
      spoiler_flag: true,
      nsfw_flag: true,
      locked_flag: true,
      allowreplies_flag: true,
      set_suggested_sort: "null (Recommended)",
      moderator_details: {
        approved_flag: false,
        approved_by: "moderator1",
        approved_date: "2024-03-27",
        removed_by: "moderator2",
        removed_date: "2024-03-27",
        spammed_by: "moderator3",
        spammed_type: "spam",
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
    },
  ],
  msg: "Posts retrieved successfully.",
};

app.get("/posts/:communityName", (req, res) => {
  const { communityName } = req.params;
  res.status(200).json({
    success: true,
    status: 200,
    content: historyPosts.posts.filter(
      (post) => post.community_name === communityName
    ),
  });
});

app.get("/users/history-posts", (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    content: historyPosts.posts,
  });
});

app.get("/listing/posts/random", (req, res) => {
  const { page, pageSize } = req.query;
  res.status(200).json({
    success: true,
    status: 200,
    content: postsListings.slice(page * pageSize, page * pageSize + pageSize),
  });
});

app.get("/listing/posts/best", (req, res) => {
  const { page, pageSize } = req.query;
  console.log(page, pageSize);

  res.status(200).json({
    success: true,
    status: 200,
    content: postsListings
      .slice(page * pageSize, page * pageSize + pageSize)
      .reverse(),
  });
  console.log(
    postsListings.slice(page * pageSize, page * pageSize + pageSize).reverse()
  );
});

app.get("/listing/posts/hot", (req, res) => {
  const { page, pageSize } = req.query;

  res.status(200).json({
    success: true,
    status: 200,
    content: shuffleList(
      postsListings.slice(page * pageSize, page * pageSize + pageSize)
    ),
  });

  // res.status(200).json(shuffleList(postsListings.slice(page * pageSize, page * pageSize + pageSize)));
});

app.get("/listing/posts/new", (req, res) => {
  const { page, pageSize } = req.query;

  res.status(200).json({
    success: true,
    status: 200,
    content: shuffleList(
      postsListings.slice(page * pageSize, page * pageSize + pageSize)
    ),
  });

  // res.status(200).json(shuffleList(postsListings.slice(page * pageSize, page * pageSize + pageSize)));
});

app.get("/listing/posts/top", (req, res) => {
  const { page, pageSize } = req.query;

  res.status(200).json({
    success: true,
    status: 200,
    content: shuffleList(
      postsListings.slice(page * pageSize, page * pageSize + pageSize)
    ),
  });
});

app.post("/posts-or-comments/vote", (req, res) => {
  const { id, is_post, vote } = req.body;
  console.log("id", id, "is_post", is_post, "rank", vote);
  if (is_post) {
    postsListings = postsListings.map((post) => {
      console.log(post._id);
      if (post._id === id) {
        if (vote === 1) {
          post.upvotes_count++;
        } else {
          post.downvotes_count++;
        }
      }
      return post;
    });
  } else {
    postReplies = postReplies.map((post) => {
      console.log(post._id, id, "cmp");
      if (post._id === id) {
        post.rank = vote;
        if (vote === 1) {
          post.upvotes_count++;
        } else {
          post.downvotes_count++;
        }
        console.log(post);
      }
      return post;
    });

    usernameMentions = usernameMentions.map((post) => {
      console.log(post._id, id, "cmp");
      if (post._id === id) {
        post.rank = vote;
        if (vote === 1) {
          post.upvotes_count++;
        } else {
          post.downvotes_count++;
        }
        console.log("reply");
      }
      return post;
    });
    // console.log(postReplies, req.body);
    comments.content = comments.content.map((comment) => {
      if (comment._id === id) {
        if (vote === 1) {
          comment.upvotes_count++;
        } else {
          comment.downvotes_count++;
        }
      }
      return comment;
    });
  }
  res.sendStatus(200);
});

app.post("/posts-or-comments/report", (req, res) => {
  const { id, is_post, reason } = req.body;
  if (is_post) {
  } else {
    postReplies = postReplies.filter((post) => post.id !== id);
    usernameMentions = usernameMentions.filter((post) => post.id !== id);

    // console.log(postReplies, 'postReplies');
    console.log(reason, "reason");
  }
  res.sendStatus(200);
});

app.post("/posts-or-comments/delete", (req, res) => {
  const { id, is_post } = req.body;
  if (is_post) {
  } else {
    postReplies = postReplies.filter((post) => post.id !== id);
    usernameMentions = usernameMentions.filter((post) => post.id !== id);
    // console.log(postReplies, 'postReplies');
  }
  res.sendStatus(200);
});

app.get("/search/:type", (req, res) => {
  const { type } = req.params;
  const { query, sort, page, pageSize } = req.query;
  // console.log(query, type, sort, pageSize, i);

  let pageIndex = page ?? 0;
  let page_size = pageSize ?? 10;

  if (type === "posts") {
    // posts
    res.status(200).json({
      success: true,
      status: 200,
      content: [
        ...new Set(
          postsListings
            .filter((post) =>
              post.title.toLowerCase().includes(query.toLowerCase())
            )
            .concat(
              postsListings.filter((post) =>
                post.description.toLowerCase().includes(query.toLowerCase())
              )
            )
            .slice(pageIndex * page_size, pageIndex * page_size + page_size)
        ),
      ],
    });
  } else if (type === "communities") {
    // communities
    res.status(200).json({
      success: true,
      status: 200,
      content: communitiesPost
        .filter((comm) => comm.name.toLowerCase().includes(query.toLowerCase()))
        .slice(pageIndex * page_size, pageIndex * page_size + page_size),
    });
  } else if (type === "comments") {
    // comments
    const comms = searchComments.filter((comment) =>
      comment.description.toLowerCase().includes(query.toLocaleString())
    );
    res.status(200).json({
      success: true,
      status: 200,
      content: comms.slice(
        pageIndex * page_size,
        pageIndex * page_size + page_size
      ),
    });
  } else if (type === "people") {
    // users
    res.status(200).json({
      success: true,
      status: 200,
      content: users
        .filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        )
        .slice(pageIndex * page_size, pageIndex * page_size + page_size),
    });
  }
});

// app.post("/comments/reply", (req, res) => {
//   const { id, description } = req.body;
//   console.log(req.body);
//   res.sendStatus(200);
// });

let sentMessages = [
  {
    _id: "5da454f4307b0a8b30838839",
    sender_username: "ahmed",
    sender_type: "user",
    receiver_username: "aww",
    receiver_type: "moderator",
    senderVia: "aww",
    message: "content 1",
    created_at: "10/15/2023",
    deleted_at: "15/10/2024",
    unread_flag: false,
    isSent: true,
    isReply: true,
    parentMessageId: "5da454f4307b0a8b30838830",
    subject: "header 2",
  },
  {
    _id: "5da454f4307b0a8b30838830",
    sender_username: "ahmed",
    sender_type: "user",
    receiver_username: "aww",
    receiver_type: "moderator",
    senderVia: "aww",
    subject: "header 2",
    message: "content 11",
    created_at: "09/15/2023",
    deleted_at: "15/10/2024",
    unread_flag: false,
    isSent: true,
    isReply: false,
    parentMessageId: null,
  },
  {
    _id: "5da454f4307b0a8b30838831",
    sender_username: "ahmed",
    sender_type: "moderator",
    senderVia: "subreddit",
    receiver_username: "reem",
    receiver_type: "user",
    subject: "header 3",
    message: "content 12",
    created_at: "01/01/2024",
    deleted_at: "15/10/2024",
    unread_flag: false,
    isSent: true,
    isReply: false,
    parentMessageId: null,
  },
  {
    _id: "5da456f4307b0a8b30838831",
    sender_username: "ahmed",
    sender_type: "moderator",
    senderVia: "subreddit",
    receiver_username: "reem",
    receiver_type: "user",
    message: "content 10",
    created_at: "01/01/2024",
    deleted_at: "15/10/2024",
    unread_flag: false,
    isSent: true,
    isReply: true,
    parentMessageId: "5da454f4307b0a8b30838831",
    subject: "header 3", //subject of parent message
  },
  {
    _id: "5da456f4307b0a8b30898831",
    sender_username: "ahmed",
    sender_type: "user",
    senderVia: "subreddit",
    receiver_username: "walid",
    receiver_type: "user",
    message: "content 60",
    created_at: "01/02/2024",
    deleted_at: "15/10/2024",
    unread_flag: false,
    isSent: true,
    isReply: true,
    parentMessageId: "5da454f430712430a8b308938830",
    subject: "header 5",
  },
];
let recievedMessages = [
  {
    _id: "5daqq4f4307b0a8b30838839",
    sender_username: "aww",
    sender_type: "moderator",
    senderVia: "aww",
    receiver_username: "ahmed",
    receiver_type: "user",
    subject: "header 2",
    message: "content 99",
    created_at: "10/15/2023",
    deleted_at: "15/10/2024",
    unread_flag: false,
    isSent: false,
    isReply: true,
    parentMessageId: "5da454f4307b0a8b30838830",
  },
  {
    _id: "5da454f430712430a8b308938830",
    sender_username: "walid",
    sender_type: "user",
    senderVia: "aww",
    receiver_username: "ahmed",
    receiver_type: "user",
    subject: "header 5",
    message: "content 2",
    created_at: "09/15/2023",
    deleted_at: "15/10/2024",
    unread_flag: false,
    isSent: false,
    isReply: false,
    parentMessageId: null,
  },
  {
    _id: "5da454f4323407b0a8b3760838831",
    sender_username: "subreddit",
    sender_type: "moderator",
    senderVia: "subreddit",
    receiver_username: "ahmed",
    receiver_type: "user",
    subject: "header 6",
    message: "content 3",
    created_at: "01/01/2024",
    deleted_at: "15/10/2024",
    unread_flag: true,
    isSent: false,
    isReply: false,
    parentMessageId: null,
  },
  {
    _id: "5da456f4307b0a8b308384k53831",
    sender_username: "reem",
    sender_type: "user",
    senderVia: "subreddit",
    receiver_username: "subreddit",
    receiver_type: "moderator",
    message: "content 4",
    created_at: "01/01/2024",
    deleted_at: "15/10/2024",
    unread_flag: false,
    isSent: false,
    isReply: true,
    parentMessageId: "5da454f4307b0a8b30838831",
    subject: "header 3",
  },
  {
    _id: "5da456f4307b0a8b35670898831",
    sender_username: "reem",
    sender_type: "user",
    senderVia: "subreddit",
    receiver_username: "subreddit",
    receiver_type: "moderator",
    message: "content 5",
    created_at: "01/01/2024",
    deleted_at: "15/10/2024",
    unread_flag: true,
    isSent: false,
    isReply: true,
    parentMessageId: "5da454f4307b0a8b30838831",
    subject: "header 3",
  },
];

app.get("/messages/sent/", (req, res) => {
  sentMessages.sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) {
      return 1;
    } else {
      return -1;
    }
  });
  res.status(200).json(sentMessages);
});

app.get("/messages/read-all-messages", (req, res) => {
  const allMessages = [...sentMessages, ...recievedMessages];
  allMessages.sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) {
      return 1;
    } else {
      return -1;
    }
  });
  console.log(allMessages);
  res.status(200).json(allMessages);
});

app.get("/messages/unread", (req, res) => {
  const unreadMessages = recievedMessages.filter(
    (val) => val.unread_flag == true
  );

  unreadMessages.sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) {
      return 1;
    } else {
      return -1;
    }
  });
  res.status(200).json(unreadMessages);
});
// createDate={new Date()}
// senderUsername='mido'
// postCreator='reem'
// postCreatorType='user'
// postSubject='da post reply'
// replyContent='post reply content'
// replyId='1212'
// unread={true}
// commentsCount={3}
// key={i}
// vote={0}
let postReplies = [
  {
    created_at: "09/15/2023",
    senderUsername: "reem",
    postCreator: "ahmed",
    postCreatorType: "user",
    postSubject: "post reply 1",
    replyContent: "<strong>reply content 1</strong>",
    id: "1",
    unread: false,
    commentsCount: 3,
    rank: -1,
    upvotes_count: 3,
    downvotes_count: 2,
  },
  {
    created_at: "10/15/2023",
    senderUsername: "walid",
    postCreator: "subreddit",
    postCreatorType: "moderator",
    postSubject: "post reply 2",
    replyContent:
      "<ul><li><i>list content 1</i></li><li>list content 2</li><li>list content 3</li></ul>",
    id: "2",
    unread: true,
    commentsCount: 15,
    rank: 0,
    upvotes_count: 100,
    downvotes_count: 3,
  },
  {
    created_at: "11/15/2023",
    senderUsername: "tarek",
    postCreator: "ahmed",
    postCreatorType: "user",
    postSubject: "post reply 3",
    replyContent: "reply content 3",
    id: "3",
    unread: false,
    commentsCount: 1,
    rank: 1,
    upvotes_count: 6,
    downvotes_count: 10,
  },
];

app.get("/messages/get-post-replies", (req, res) => {
  postReplies.sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) {
      return 1;
    } else {
      return -1;
    }
  });
  res.status(200).json(postReplies);
});

app.get("/messages/inbox", (req, res) => {
  const allInbox = [...postReplies, ...recievedMessages, ...usernameMentions];
  allInbox.sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) {
      return 1;
    } else {
      return -1;
    }
  });
  console.log(allInbox);
  res.status(200).json(allInbox);
});

app.post("/messages/compose/", (req, res) => {
  let c = 0;
  console.log(req.body, "compose");
  if (req.body.receiver_username != "mido") {
    sentMessages.push({
      ...req.body,
      isSent: true,
      isReply: false,
      parentMessageId: null,
      _id: c,
      // "subject": "header 5",
    });
    c++;

    res.sendStatus(200);
  } else {
    res
      .status(400)
      .send("Hmm, that user doesn't exist. Try checking the spelling.");
  }
});

app.post("/messages/reply", (req, res) => {
  let c = 100;
  console.log(req.body, "compose");
  sentMessages.push({
    ...req.body,
    _id: c,
    // "subject": "header 5",
  });
  c++;

  res.sendStatus(200);
});

app.post("/messages/del-msg", (req, res) => {
  console.log(req.body, "delmsg");
  recievedMessages = recievedMessages.filter(
    (message) =>
      message._id !== req.body["_id"] &&
      message.parentMessageId !== req.body["_id"]
  );
  sentMessages = sentMessages.filter(
    (message) => message.parentMessageId !== req.body["_id"]
  );

  res.sendStatus(200);
});
app.post("/messages/report-msg", (req, res) => {
  console.log(req.body, "repmsg");
  recievedMessages = recievedMessages.filter(
    (message) =>
      message._id !== req.body["_id"] &&
      message.parentMessageId !== req.body["_id"]
  );
  sentMessages = sentMessages.filter(
    (message) => message.parentMessageId !== req.body["_id"]
  );

  res.sendStatus(200);
});

let usernameMentions = [
  {
    created_at: "09/15/2023",
    senderUsername: "reem",
    postCreator: "ahmed",
    postCreatorType: "user",
    postSubject: "post 1",
    replyContent: "<a href='/user/ahmed'>u/ahmed</a><h1>content 1</h1>",
    id: "11",
    unread: false,
    commentsCount: 3,
    rank: -1,
    upvotes_count: 3,
    downvotes_count: 2,
  },
  {
    created_at: "10/15/2023",
    senderUsername: "walid",
    postCreator: "subreddit",
    postCreatorType: "moderator",
    postSubject: "post 2",
    replyContent: "<a href='/user/ahmed'>u/ahmed</a><h1>content 2</h1>",
    id: "21",
    unread: true,
    commentsCount: 15,
    rank: 0,
    upvotes_count: 100,
    downvotes_count: 3,
  },
  {
    created_at: "11/15/2023",
    senderUsername: "tarek",
    postCreator: "ahmed",
    postCreatorType: "user",
    postSubject: "post 3",
    replyContent: "<a href='/user/ahmed'>u/ahmed</a><h1>content 3</h1>",
    id: "31",
    unread: false,
    commentsCount: 1,
    vote: 1,
    upvotes_count: 6,
    downvotes_count: 10,
  },
];

app.get("/messages/get-user-mentions", (req, res) => {
  usernameMentions.sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) {
      return 1;
    } else {
      return -1;
    }
  });
  res.status(200).json(usernameMentions);
});

app.get("/user/about/:id", (req, res) => {
  const { id } = req.params;
  console.log(id, "hiiii");
  const user = users.find((user) => user.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(post);
});

// * Post
app.get("/posts/get-post", (req, res) => {
  const { id } = req.query;
  console.log(id);
  const post = postsListings.find((postt) => postt._id === id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json(post);
});

app.get("/posts/get-comments", (req, res) => {
  const { id } = req.query;
  const postComments = comments.content.filter(
    (comment) => comment.post_id === id
  );
  if (!postComments) {
    return res.status(404).json({ message: "Comments not found" });
  }
  res.status(200).json(postComments);
});
let userAbout = {
  message: "About retrieved successfully",
  content: {
    _id: "661a2c3fab10a4b012e8f59a",
    username: "u/Icy-Cry-5376",
    created_at: "2024-02-24T06:53:20.537Z",
    email: "me22@gmail.com",
    verified_email_flag: false,
    connected_google: false,
    display_name: "Icy-Cry-5376",
    about: "",
    social_links: [
      { icon: "Instagram", username: "ahmedtoaima_" },
      {
        icon: "Facebook",
        username: "ahmedkhaled",
        displayName: "Ahmed Khaled",
      },
    ],
    profile_picture:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    banner_picture:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    gender: "Female",
  },
};

let moderatedCommunities = {
  success: true,
  status: 200,
  msg: "Your moderated communities are retrieved successfully",
  content: [
    {
      id: "661732b95ef02bd2dddfde17",
      name: "r/programming",
      profile_picture:
        "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
      favorite_flag: true,
      members_count: 163,
      joined: true,
    },
    {
      id: "661732b95ef02bd2dddfde1e",
      name: "Rowe, Heller and McKenzie",
      profile_picture:
        "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
      favorite_flag: false,
      members_count: 924,
      joined: false,
    },
  ],
};

// let userAbout = {
//   id: "string",
//   created_at: "Feb 24, 2024",
//   username: "u/Icy-Cry-5376",
//   email: "string",
//   gmail: "string",
//   facebook_email: "string",
//   profile_settings: {
//     display_name: "Icy-Cry-5376",
//     about: "string",
//     social_links: [
//       { icon: "Instagram", username: "ahmedtoaima_" },
//       {
//         icon: "Facebook",
//         username: "ahmedkhaled",
//         displayName: "Ahmed Khaled",
//       },
//     ],
//     profile_picture:
//       "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
//     banner_picture:
//       "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
//     nsfw_flag: true,
//     allow_followers: true,
//     content_visibility: true,
//     active_communities_visibility: true,
//   },
//   country: "string",
//   gender: "Male",
//   connected_google: true,
//   connected_twitter: true,
//   connected_apple: true,
//   communities: [
//     {
//       id: "string",
//       name: "string",
//       favorite_flag: true,
//       disable_updates: true,
//     },
//   ],
//   moderated_communities: [
//     {
//       id: "string",
//       name: "ree's community",
//       src: "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
//       members_number: 1000,
//       joined: true,
//     },
//     {
//       id: "string",
//       name: "halla's community",
//       src: "https://styles.redditmedia.com/t5_2qh1u/styles/communityIcon_21ykcg22rm6c1.png",
//       members_number: 500,
//       joined: false,
//     },
//   ],
// };

let postsComments = [
  {
    is_post: true,
    id: "15",
    user_id: "user1",
    username: "john_doe",
    title: "First Post",
    description: "This is the first post",
    created_at: "2024-03-29",
    edited_at: "2024-03-29",
    deleted_at: "2024-03-29",
    type: "image_and_videos",
    link_url: "https://example.com",
    images: [
      {
        path: "image1.jpg",
        caption: "Image 1",
        link: "https://source.unsplash.com/random",
      },
    ],
    videos: [
      {
        path: "video1.mp4",
        caption: "Video 1",
        link: "https://example.com/video1.mp4",
      },
    ],
    poll: {
      options: ["Option 1", "Option 2", "Option 3"],
      votes: [0, 0, 0],
    },
    community_id: "community1",
    community_name: "Community 1",
    comments_count: 0,
    views_count: 0,
    shares_count: 0,
    upvotes_count: 0,
    downvotes_count: 0,
    oc_flag: true,
    spoiler_flag: true,
    nsfw_flag: true,
    locked_flag: true,
    allowreplies_flag: true,
    set_suggested_sort: "null (Recommended)",
    moderator_details: {
      approved_by: "moderator1",
      approved_date: "2024-03-29",
      removed_by: "moderator2",
      removed_date: "2024-03-29",
      spammed_by: "moderator3",
      spammed_type: "spam",
    },
    user_details: {
      total_views: 0,
      upvote_rate: 0,
      total_shares: 0,
    },
  },
  {
    is_post: true,
    id: "18",
    user_id: "user2",
    username: "jane_smith",
    title: "Second Post",
    description: "This is the second post",
    created_at: "2024-03-26",
    edited_at: "2024-03-26",
    deleted_at: "2024-03-26",
    type: "image_and_videos",
    link_url: "https://example.com",
    images: [
      {
        path: "image2.jpg",
        caption: "Image 2",
        link: "https://source.unsplash.com/random",
      },
    ],
    videos: [
      {
        path: "video2.mp4",
        caption: "Video 2",
        link: "https://example.com/video2.mp4",
      },
    ],
    poll: {
      options: ["Option 1", "Option 2", "Option 3"],
      votes: [0, 0, 0],
    },
    community_id: "community2",
    community_name: "Community 2",
    comments_count: 0,
    views_count: 0,
    shares_count: 0,
    upvotes_count: 0,
    downvotes_count: 0,
    oc_flag: true,
    spoiler_flag: true,
    nsfw_flag: true,
    locked_flag: true,
    allowreplies_flag: true,
    set_suggested_sort: "null (Recommended)",
    moderator_details: {
      approved_by: "moderator1",
      approved_date: "2024-03-26",
      removed_by: "moderator2",
      removed_date: "2024-03-26",
      spammed_by: "moderator3",
      spammed_type: "spam",
    },
    user_details: {
      total_views: 0,
      upvote_rate: 0,
      total_shares: 0,
    },
  },
  {
    moderator_details: {
      approved_flag: true,
      approved_by: "ModeratorC",
      approved_date: "2024-04-22T22:45:00Z",
      removed_flag: false,
      removed_by: "",
      removed_date: "",
      removed_removal_reason: "",
      spammed_flag: false,
      spammed_by: "",
      spammed_type: "",
      spammed_removal_reason: "",
      reported_flag: false,
      reported_by: "",
      reported_type: "",
    },
    is_post: false,
    is_reply: true,
    parent_username: "UserE",
    _id: "17",
    post_id: "8",
    user_id: "user789",
    username: "UserC",
    parent_id: "parentOPQ",
    replies_comments_ids: [],
    created_at: "2024-04-22T23:30:00Z",
    edited_at: "",
    deleted_at: "",
    deleted: false,
    description: "I agree with your assessment.",
    comment_in_community_flag: true,
    community_id: "communityOPQ",
    community_name: "CommunityOPQ",
    upvotes_count: 7,
    downvotes_count: 2,
    spam_flag: false,
    locked_flag: false,
    spoiler_flag: false,
    show_comment_flag: true,
    __v: 0,
  },
];
app.get("/users/about/:username", (req, res) => {
  res.status(200).json(userAbout);
});
app.get("/users/moderated-communities", (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    msg: "Your moderated communities are retrieved successfully",
    content: [
      {
        id: "661732b95ef02bd2dddfde17",
        name: "programming",
        profile_picture: "",
        favorite_flag: true,
        members_count: 163,
      },
      {
        id: "661732b95ef02bd2dddfde1e",
        name: "Rowe, Heller and McKenzie",
        profile_picture: "",
        favorite_flag: false,
        members_count: 924,
      },
    ],
  });
});
// app.get("/users/moderated-communities", (req, res) => {
//   res.status(200).json(moderatedCommunities);
// });
app.get("/users/downvoted-posts", (req, res) => {
  res.status(200).json(postsListings);
});
app.get("/users/upvoted-posts", (req, res) => {
  res.status(200).json(postsListings);
});
app.get("/users/hidden-and-reported-posts", (req, res) => {
  res.status(200).json(postsListings);
});
app.get("/users/saved-posts-and-comments", (req, res) => {
  res.status(200).json(postscom);
});

app.get("/users/posts/:username", (req, res) => {
  res.status(200).json(postsListings);
});

app.get("/users/comments/:username", (req, res) => {
  res.status(200).json(comments);
});
let postscom = {
  content: {
    posts: [
      {
        is_post: true,
        _id: "6",
        avatar:
          "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/9.jpg", //metzweda
        saved: true,
        user_id: "7",
        username: "user789",
        title: "Third Random Post",
        description: "Yet another random post with different details.",
        created_at: "2024-04-20T11:30:00",
        deleted: false,
        type: "url",
        link_url: "https://example2.com",
        images: [],
        videos: [],
        polls: [],
        polls_voting_length: 3,
        polls_voting_is_expired_flag: false,
        post_in_community_flag: true,
        community_id: "8",
        community_name: "Community B",
        comments_count: 5,
        views_count: 20,
        shares_count: 2,
        upvotes_count: 10,
        downvotes_count: 1,
        oc_flag: false,
        spoiler_flag: false,
        nsfw_flag: false,
        locked_flag: false,
        allowreplies_flag: true,
        set_suggested_sort: "Top",
        scheduled_flag: false,
        moderator_details: {
          approved_flag: true,
          approved_by: "youssef",
          approved_date: new Date(),
          removed_flag: false,
          removed_by: null,
          removed_date: null,
          removed_removal_reason: null,
          spammed_flag: false,
          spammed_by: null,
          spammed_type: null,
          spammed_removal_reason: null,
          reported_flag: false,
          reported_by: null,
          reported_type: null,
        },
        user_details: {
          total_views: 20,
          upvote_rate: 0.7,
          total_shares: 2,
        },
        is_reposted_flag: false,
        reposted: [],
      },
    ],
    comments: [
      {
        moderator_details: {
          approved_by: "",
          approved_date: "",
          removed_by: "",
          removed_date: "",
          spammed_by: "",
          spammed_type: "",
          removed_flag: false,
          spammed_flag: false,
        },
        is_post: false,
        votes_count: 0,
        _id: "11",
        post_id: "7",
        user_id: "567",
        username: "commenter567",
        parent_id: "",
        replies_comments_ids: [],
        created_at: "2024-03-30T11:30:00",
        edited_at: "",
        deleted_at: "",
        approved: false,
        deleted: false,
        description:
          "I found this post thought-provoking. It made me reconsider my own perspective.",
        upvotes_count: 14,
        downvotes_count: 1,
        allowreplies_flag: true,
        spam_flag: false,
        locked_flag: false,
        show_comment_flag: true,
        __v: 0,
      },
      {
        moderator_details: {
          approved_by: "",
          approved_date: "",
          removed_by: "",
          removed_date: "",
          spammed_by: "",
          spammed_type: "",
          removed_flag: false,
          spammed_flag: false,
        },
        is_post: false,
        votes_count: 0,
        _id: "12",
        post_id: "7",
        user_id: "678",
        username: "user678",
        parent_id: "",
        replies_comments_ids: [],
        created_at: "2023-03-29T14:45:00",
        edited_at: "",
        deleted_at: "",
        approved: false,
        deleted: false,
        description:
          "I have a question regarding one of the points you raised. Can you elaborate?",
        upvotes_count: 6,
        downvotes_count: 3,
        allowreplies_flag: true,
        spam_flag: false,
        locked_flag: false,
        show_comment_flag: true,
        __v: 0,
      },
    ],
  },
};
app.get("/users/overview/:username", (req, res) => {
  res.status(200).json(postscom);
});

const CommunityModerators = [
  {
    community_name: "sports",
    moderators: [
      {
        username: "FirstModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
      {
        username: "SecondModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
      {
        username: "ThirdModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
      {
        username: "FourthModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
      {
        username: "FifthModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
      {
        username: "SixthModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
      {
        username: "SeventhModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
    ],
  },
  {
    community_name: "programming",
    moderators: [
      {
        username: "SixthModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
      {
        username: "SeventhModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
    ],
  },
  {
    community_name: "Community2",
    moderators: [
      {
        username: "SixthModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
      {
        username: "SeventhModerator",
        profile_picture:
          "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png",
        moderator_since: "2024-03-29T00:00:00.000Z",
      },
    ],
  },
];

app.get("/communities/about/moderators/:communityName", (req, res) => {
  const { communityName } = req.params;
  const community = CommunityModerators.find(
    (community) => community.community_name === communityName
  );
  if (community) {
    res.status(200).json(community.moderators);
  } else {
    res.status(404).json({ error: "Community not found" });
  }
});

const communityRules = [
  {
    community_name: "sports",
    rules: [
      {
        _id: "111",
        rule_title: "Civil Behavior",
        rule_order: 1,
        applies_to: "posts_and_comments",
        report_reason: "string",
        full_description:
          "Keep posts and comments civil at all times. Follow proper reddiquette. Please try to be respectful to everyone. Hateful or otherwise inappropriate behaviour will not be tolerated. No witch-hunting.",
        __v: 0,
      },
      {
        _id: "222",
        rule_title: "Self-Promotion",
        rule_order: 2,
        applies_to: "comments_only",
        report_reason: "string",
        full_description:
          "Self-promotion/original content is allowed in certain circumstances. Profile sharing is only permitted through setting your user flair to your Letterboxd Username, using our profile sharing mega-thread, or in other mod-approved threads. Original content (LB lists/reviews, third-party OC etc.) is generally only permitted within our weekly threads. If you feel your original content promotes discussion, is of relevance/importance to the sub, or is high-effort/high-quality, exceptions will be made pending mod discretion.",
        __v: 0,
      },
      {
        _id: "3333",
        rule_title: "Low-Effort Content",
        rule_order: 3,
        applies_to: "posts_and_comments",
        report_reason: "string",
        full_description:
          "Low-effort/low-quality posts will be removed. Low-effort questions, low-quality shared content, or any content deemed by mods to lack honest intent, will be removed. Shared content must be relevant to Letterboxd or Film, and must be of an acceptable standard. Content that pushes agendas, has excessive ads, or is otherwise deemed to be a negative contribution, will be removed at mod discretion. Image macros, screen-grabs or commonly used memes/image formats must make an honest attempt at humor.",
        __v: 0,
      },
      {
        _id: "444",
        rule_title: "No Wank/Circlejerking",
        rule_order: 4,
        applies_to: "comments_only",
        report_reason: "string",
        full_description:
          "No wank/circlejerking posts allowed. Standalone posts and/or comments that are considered to be bait and/or wank about specific or non-specific users or reviews on Letterboxd will be removed. These types of posts have been deemed to be low-effort and, most importantly, unwelcoming to all individuals who use both the subreddit and Letterboxd.",
        __v: 0,
      },
      {
        _id: "555",
        rule_title: "Duplicate Posts/Reposts",
        rule_order: 5,
        applies_to: "posts_and_comments",
        report_reason: "string",
        full_description:
          "Duplicate posts/reposts will be removed. Individual posts that belong in an existing masterthread will be removed.",
        __v: 0,
      },
    ],
  },
  {
    community_name: "programming",
    rules: [
      {
        _id: "666",
        rule_title: "No Vandalism",
        rule_order: 1,
        applies_to: "posts_and_comments",
        report_reason: "string",
        full_description:
          "TMDb/Letterboxd vandalism posts are not allowed. Screenshots/links to content vandalism on either TMDb and/or Letterboxd will be removed. These posts fall under low effort and do not encourage adequate discussion on the subreddit.",
        __v: 0,
      },
      {
        _id: "777",
        rule_title: "Suggestions for Letterboxd",
        rule_order: 2,
        applies_to: "comments_only",
        report_reason: "string",
        full_description:
          "Suggestions for additions to the Letterboxd site will be redirected. Standalone posts offering original and/or common suggestions for Letterboxd will be directed to the official Letterboxd feedback site (letterboxd.nolt.io). Posts discussing new updates to the website and/or app are allowed.",
        __v: 0,
      },
      {
        _id: "888",
        rule_title: "Miscellaneous Content",
        rule_order: 3,
        applies_to: "posts_and_comments",
        report_reason: "string",
        full_description:
          "Miscellaneous content that is addressed in the FAQ will be removed. Any posts or comments discussing or asking about issues that are addressed in the sub FAQ will be removed. The poster will be directed to the FAQ page.",
        __v: 0,
      },
      {
        _id: "999",
        rule_title: "Spoiler Policy",
        rule_order: 4,
        applies_to: "comments_only",
        report_reason: "string",
        full_description:
          "Spoiler posts/comments must be marked as such. Absolutely no spoilers, intentional or otherwise, in post titles. This will be considered a serious offense and could result in a permanent ban. All posts with spoilers INSIDE the body of said post must be marked with the spoiler flair. When commenting on a post that is NOT labelled with the spoiler flair, please use proper spoiler formatting. Comments containing spoilers are acceptable within posts marked with the spoiler flair.",
        __v: 0,
      },
    ],
  },
  {
    community_name: "Community2",
    rules: [
      {
        _id: "432",
        rule_title: "Civil Behavior",
        rule_order: 1,
        applies_to: "posts_and_comments",
        report_reason: "string",
        full_description:
          "Keep posts and comments civil at all times. Follow proper reddiquette. Please try to be respectful to everyone. Hateful or otherwise inappropriate behaviour will not be tolerated. No witch-hunting.",
        __v: 0,
      },
      {
        _id: "234",
        rule_title: "Self-Promotion",
        rule_order: 2,
        applies_to: "comments_only",
        report_reason: "string",
        full_description:
          "Self-promotion/original content is allowed in certain circumstances. Profile sharing is only permitted through setting your user flair to your Letterboxd Username, using our profile sharing mega-thread, or in other mod-approved threads. Original content (LB lists/reviews, third-party OC etc.) is generally only permitted within our weekly threads. If you feel your original content promotes discussion, is of relevance/importance to the sub, or is high-effort/high-quality, exceptions will be made pending mod discretion.",
        __v: 0,
      },
      {
        _id: "11",
        rule_title: "Low-Effort Content",
        rule_order: 3,
        applies_to: "posts_and_comments",
        report_reason: "string",
        full_description:
          "Low-effort/low-quality posts will be removed. Low-effort questions, low-quality shared content, or any content deemed by mods to lack honest intent, will be removed. Shared content must be relevant to Letterboxd or Film, and must be of an acceptable standard. Content that pushes agendas, has excessive ads, or is otherwise deemed to be a negative contribution, will be removed at mod discretion. Image macros, screen-grabs or commonly used memes/image formats must make an honest attempt at humor.",
        __v: 0,
      },
    ],
  },
];

app.get("/communities/rules/:communityName", (req, res) => {
  const { communityName } = req.params;
  const community = communityRules.find(
    (community) => community.community_name === communityName
  );
  if (community) {
    res.status(200).json(community.rules);
  } else {
    res.status(404).json({ error: "Community not found" });
  }
});

app.post("/comments/new-comment", (req, res) => {
  const { id, description } = req.body;

  const username = getAuthUsername(req);
  // console.log("username", username);
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const commentId = crypto.randomUUID();
  const post = postsListings.find((post) => post._id === id);
  post.comments_ids = post.comments_ids.concat(commentId);
  post.comments_count = post.comments_ids.length;
  //console.log("new count",post.comments_ids.length);
  comments.content = comments.content.concat([
    {
      moderator_details: {
        approved_flag: true,
        approved_by: "ModeratorC",
        approved_date: "2024-04-22T22:45:00Z",
        removed_flag: false,
        removed_by: "",
        removed_date: "",
        removed_removal_reason: "",
        spammed_flag: false,
        spammed_by: "",
        spammed_type: "",
        spammed_removal_reason: "",
        reported_flag: false,
        reported_by: "",
        reported_type: "",
      },
      is_post: false,
      is_reply: true,
      parent_username: "UserE",
      _id: commentId,
      post_id: id,
      user_id: "user789",
      username: username,
      parent_id: "parentOPQ",
      replies_comments_ids: [],
      created_at: "2024-04-22T23:30:00Z",
      edited_at: "",
      deleted_at: "",
      deleted: false,
      saved: false,
      description: description,
      comment_in_community_flag: true,
      community_id: "communityOPQ",
      community_name: "CommunityOPQ",
      upvotes_count: 7,
      downvotes_count: 2,
      spam_flag: false,
      locked_flag: false,
      spoiler_flag: false,
      show_comment_flag: true,
      __v: 0,
    },
  ]);

  // console.log(comments);

  res.status(200).json({ message: "Comment added successfully." });
});

app.post("/comments/reply", (req, res) => {
  const { id, description } = req.body;

  const username = getAuthUsername(req);

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("username", username);
  const commentId = crypto.randomUUID();
  const updatedComments = comments.content.map((comment) => {
    if (comment._id === id) {
      return {
        ...comment,
        replies_comments_ids: comment.replies_comments_ids.concat({
          moderator_details: {
            approved_flag: true,
            approved_by: "ModeratorC",
            approved_date: "2024-04-22T22:45:00Z",
            removed_flag: false,
            removed_by: "",
            removed_date: "",
            removed_removal_reason: "",
            spammed_flag: false,
            spammed_by: "",
            spammed_type: "",
            spammed_removal_reason: "",
            reported_flag: false,
            reported_by: "",
            reported_type: "",
          },
          is_post: false,
          is_reply: true,
          parent_username: "UserE",
          _id: commentId,
          post_id: "id",
          user_id: "user789",
          username: username,
          parent_id: id,
          replies_comments_ids: [],
          created_at: "2024-04-22T23:30:00Z",
          edited_at: "",
          deleted_at: "",
          deleted: false,
          saved: false,
          description: description,
          comment_in_community_flag: true,
          community_id: "communityOPQ",
          community_name: "CommunityOPQ",
          upvotes_count: 7,
          downvotes_count: 2,
          spam_flag: false,
          locked_flag: false,
          spoiler_flag: false,
          show_comment_flag: true,
          __v: 0,
        }),
      };
    }
    return comment;
  });

  comments.content = updatedComments;

  // console.log(comments.content);

  res.status(200).json({ message: "Comment added successfully." });
});

app.get("/communities/get-removal-reasons/:communityName", (req, res) => {
  // console.log("rem reasons");
  res.status(200).json([
    {
      removal_reason_title: "Spam",
      reason_message: "This post is spam",
      _id: "6618520b1135daf6066366ea",
    },
  ]);
});

app.get("/communities/about/unmoderated/:communityName", (req, res) => {
  // console.log("hi");
  res.status(200).json([
    {
      vote: 1,
      moderator_details: {
        approved_flag: false,
        approved_date: null,
        removed_flag: false,
        removed_date: null,
        removed_removal_reason: null,
        spammed_flag: false,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_flag: false,
        reported_type: null,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      _id: "6624e0ceb67f43e82ce56df5",
      title: "Test8",
      description: "ff",
      created_at: "2024-04-21T09:47:58.302Z",
      edited_at: null,
      deleted_at: null,
      deleted: false,
      type: "text",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      comment_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 4,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 1,
      downvotes_count: 0,
      oc_flag: false,
      spoiler_flag: true,
      nsfw_flag: true,
      locked_flag: false,
      allowreplies_flag: true,
      set_suggested_sort: "None (Recommended)",
      scheduled_flag: false,
      is_reposted_flag: false,
      upvote_users: [],
      downvote_users: [],
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 7,
    },
    {
      vote: 1,
      moderator_details: {
        approved_date: null,
        removed_date: null,
        removed_removal_reason: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_type: null,
        approved_flag: false,
        removed_flag: false,
        spammed_flag: false,
        reported_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      edited_at: null,
      deleted_at: null,
      _id: "662406de7380d06d8413baa0",
      title: "Test7 ",
      description: "ff",
      created_at: "2024-04-20T18:18:06.146Z",
      deleted: false,
      type: "url",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 2,
      downvotes_count: 0,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      scheduled_flag: false,
      is_reposted_flag: false,
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 0,
      set_suggested_sort: "None (Recommended)",
    },
    {
      vote: -1,

      moderator_details: {
        approved_date: null,
        removed_date: null,
        removed_removal_reason: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_type: null,
        approved_flag: false,
        removed_flag: false,
        spammed_flag: false,
        reported_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      edited_at: null,
      deleted_at: null,
      set_suggested_sort: "None (Recommended)",
      _id: "662405271a2be695b0767eaf",
      title: "Test6 ",
      description: "ff",
      created_at: "2024-04-20T18:10:47.134Z",
      deleted: false,
      type: "url",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 0,
      downvotes_count: 0,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      scheduled_flag: false,
      is_reposted_flag: false,
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 0,
    },
    {
      moderator_details: {
        approved_date: null,
        removed_date: null,
        removed_removal_reason: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_type: null,
        approved_flag: false,
        removed_flag: false,
        spammed_flag: false,
        reported_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      edited_at: null,
      deleted_at: null,
      _id: "662405211a2be695b0767eaa",
      title: "Test5 ",
      description: "ff",
      created_at: "2024-04-20T18:10:41.796Z",
      deleted: false,
      type: "url",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 1,
      downvotes_count: 1,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      scheduled_flag: false,
      is_reposted_flag: false,
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 0,
      set_suggested_sort: "None (Recommended)",
    },
    {
      moderator_details: {
        approved_date: null,
        removed_date: null,
        removed_removal_reason: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_type: null,
        approved_flag: false,
        removed_flag: false,
        spammed_flag: false,
        reported_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      edited_at: null,
      deleted_at: null,
      _id: "6624051a1a2be695b0767ea5",
      title: "Test4 ",
      description: "ff",
      created_at: "2024-04-20T18:10:34.830Z",
      deleted: false,
      type: "url",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 2,
      downvotes_count: 1,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      scheduled_flag: false,
      is_reposted_flag: false,
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 0,
      set_suggested_sort: "None (Recommended)",
    },
    {
      moderator_details: {
        approved_date: null,
        removed_date: null,
        removed_removal_reason: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_type: null,
        approved_flag: false,
        removed_flag: false,
        spammed_flag: false,
        reported_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      edited_at: null,
      deleted_at: null,
      _id: "662405121a2be695b0767e9d",
      title: "Test3 ",
      description: "ff",
      created_at: "2024-04-20T18:10:26.054Z",
      deleted: false,
      type: "url",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 1,
      downvotes_count: 2,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      scheduled_flag: false,
      is_reposted_flag: false,
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 0,
      set_suggested_sort: "None (Recommended)",
    },
    {
      moderator_details: {
        removed_date: null,
        removed_removal_reason: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_type: null,
        approved_flag: false,
        approved_by: null,
        approved_date: null,
        removed_flag: false,
        spammed_flag: false,
        reported_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      edited_at: null,
      deleted_at: null,
      set_suggested_sort: "None (Recommended)",
      _id: "6623c0956c9b7daa1bce58e9",
      title: "Test3 ",
      description: "ff",
      created_at: "2024-04-20T13:18:13.158Z",
      deleted: false,
      type: "url",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 2,
      downvotes_count: 0,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      scheduled_flag: false,
      is_reposted_flag: false,
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 0,
    },
    {
      moderator_details: {
        approved_date: null,
        removed_date: null,
        removed_removal_reason: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_type: null,
        approved_flag: false,
        removed_flag: false,
        spammed_flag: false,
        reported_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      edited_at: null,
      deleted_at: null,
      set_suggested_sort: "None (Recommended)",
      _id: "6623bfd46071f2b693c0a41a",
      title: "fvfvv vestigium voluntarius ater audax admitto ",
      description: "ff",
      created_at: "2024-04-20T13:15:00.256Z",
      deleted: false,
      type: "url",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 1,
      downvotes_count: 0,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      scheduled_flag: false,
      is_reposted_flag: false,
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 0,
    },
    {
      moderator_details: {
        approved_date: null,
        removed_date: null,
        removed_removal_reason: null,
        spammed_type: null,
        spammed_removal_reason: null,
        reported_type: null,
        approved_flag: false,
        removed_flag: false,
        spammed_flag: false,
        reported_flag: false,
      },
      user_details: {
        total_views: 0,
        upvote_rate: 0,
        total_shares: 0,
      },
      reposted: [],
      edited_at: null,
      deleted_at: null,
      set_suggested_sort: "None (Recommended)",
      _id: "6623a50bd5696cd5e6cfe3b8",
      title: "fvfvv vestigium voluntarius ater audax admitto ",
      description: "ff",
      created_at: "2024-04-20T11:20:43.384Z",
      deleted: false,
      type: "url",
      link_url: "https://www.youtuddbej.com",
      images: [],
      videos: [],
      polls: [],
      polls_voting_length: 3,
      polls_voting_is_expired_flag: false,
      post_in_community_flag: false,
      community_name: "Thiel___Wolff",
      comments_count: 0,
      views_count: 0,
      shares_count: 0,
      upvotes_count: 0,
      downvotes_count: 1,
      oc_flag: false,
      spoiler_flag: false,
      nsfw_flag: false,
      locked_flag: false,
      allowreplies_flag: true,
      scheduled_flag: false,
      is_reposted_flag: false,
      user_id: "661ed9a12b42f5ea45ed7f6e",
      username: "m",
      __v: 0,
    },
  ]);
});

let communityGeneralSettings = [
  {
    community_name: "reem",
    welcome_message: {
      send_welcome_message_flag: true,
      message:
        "Welcome to our community! We're excited to have you join us. Feel free to explore the discussions and share your thoughts.",
    },
    _id: "661d40f3481ae66a900fb918",
    title: "Cheese Lovers Club",
    description:
      "Are you passionate about all things cheese? Join our community to discuss your favorite cheeses, recipes, and more!",
    type: "Public",
    nsfw_flag: true,
    approved_users_have_the_ability_to: "Post Only (Default)",
    accepting_new_requests_to_post: true,
    accepting_requests_to_join: true,
    __v: 0,
  },
  {
    community_name: "habiba",
    welcome_message: {
      send_welcome_message_flag: true,
      message:
        "Welcome to the Grated Cheese Enthusiasts community! Get ready to dive into discussions about the world of grated cheese.",
    },
    _id: "661d40f3481ae66a900fb918",
    title: "Grated Cheese Enthusiasts",
    description:
      "Join our community of cheese lovers as we explore the world of grated cheese. Share your favorite recipes, tips, and more!",
    type: "Public",
    nsfw_flag: false,
    approved_users_have_the_ability_to: "Post Only (Default)",
    accepting_new_requests_to_post: false,
    accepting_requests_to_join: true,
    __v: 0,
  },
  {
    community_name: "halla",
    welcome_message: {
      send_welcome_message_flag: true,
      message:
        "Welcome to the Cheese Connoisseurs Club! Prepare to indulge in discussions about the finest cheeses from around the world.",
    },
    _id: "661d40f3481ae66a900fb918",
    title: "Cheese Connoisseurs Club",
    description:
      "Calling all cheese enthusiasts! Join us in exploring the art of cheese appreciation. From aged cheddars to creamy bries, there's something for every cheese lover here.",
    type: "Public",
    nsfw_flag: false,
    approved_users_have_the_ability_to: "Post Only (Default)",
    accepting_new_requests_to_post: false,
    accepting_requests_to_join: true,
    __v: 0,
  },
];

app.get("/communities/get-general-settings/:communityname", (req, res) => {
  const { communityname } = req.params;

  const community = communityGeneralSettings.find(
    (community) => community.community_name === communityname
  );
  if (community) {
    res.status(200).json(community);
  } else {
    res.status(404).json({ error: "Community not found" });
  }
});
app.patch("/communities/change-general-settings/:communityname", (req, res) => {
  const { communityname } = req.params;
  console.log(communityname);
  const {
    welcome_message,
    description,
    type,
    nsfw_flag,
    approved_users_have_the_ability_to,
    accepting_new_requests_to_post,
    accepting_requests_to_join,
    title,
  } = req.body;
  console.log("approved_users_have_the_ability_to", nsfw_flag);
  const setting = communityGeneralSettings.find(
    (sett) => sett.community_name === communityname
  );
  if (!setting) {
    return res.status(404).json({ message: "Notification not found" });
  }
  setting.welcome_message = welcome_message;
  setting.description = description;
  setting.type = type;
  setting.nsfw_flag = nsfw_flag;
  setting.approved_users_have_the_ability_to =
    approved_users_have_the_ability_to;
  setting.accepting_new_requests_to_post = accepting_new_requests_to_post;
  setting.accepting_requests_to_join = accepting_requests_to_join;
  setting.title = title;
  console.log("new general setting", setting);
  res.sendStatus(200);
});

let postandcommentsettings = [
  {
    community_name: "reem",
    posts: {
      spam_filter_strength: {
        posts: "High (default)",
        links: "All",
        comments: "High",
      },
      post_type_options: "Text Posts Only",
      allow_crossposting_of_posts: false,
      archive_posts: true,
      enable_spoiler_tag: false,
      allow_image_uploads_and_links_to_image_hosting_sites: true,
      allow_multiple_images_per_post: true,
      allow_polls: false,
      allow_videos: false,
    },
    comments: {
      media_in_comments: {
        gifs_from_giphy: false,
        collectible_expressions: true,
        images: true,
        gifs: false,
      },
      suggested_sort: "Best",
      collapse_deleted_and_removed_comments: false,
      minutes_to_hide_comment_scores: 59,
    },
    _id: "661d40f3481ae66a900fb942",
    __v: 0,
  },
];

app.get("/communities/get-posts-and-comments/:communityname", (req, res) => {
  const { communityname } = req.params;

  const community = postandcommentsettings.find(
    (community) => community.community_name === communityname
  );
  if (community) {
    res.status(200).json(community);
  } else {
    res.status(404).json({ error: "Community not found" });
  }
});
app.patch(
  "/communities/change-posts-and-comments/:communityname",
  (req, res) => {
    const { communityname } = req.params;
    console.log(communityname);
    console.log("patch", req.body);
  }
);

let contentcontrols = [
  {
    community_name: "reem",
    providing_members_with_posting_guidlines: {
      flag: true,
      guidline_text: "",
    },
    require_words_in_post_title: {
      flag: true,
      add_required_words: [
        "adaugeo",
        "expedita",
        "utilis",
        "adfero",
        "amaritudo",
      ],
    },
    ban_words_from_post_title: {
      flag: true,
      add_banned_words: ["tero", "spiculum", "advenio", "decumbo", "eum"],
    },
    ban_words_from_post_body: {
      flag: true,
      add_banned_words: ["abutor", "clibanus", "atque", "arx", "ultra"],
    },
    require_or_ban_links_from_specific_domains: {
      flag: false,
      restriction_type: "Required domains",
      require_or_block_link_posts_with_these_domains: ["reem"],
    },
    restrict_how_often_the_same_link_can_be_posted: {
      flag: false,
      number_of_days: 0,
    },
    _id: "661d40f3481ae66a900fb92d",
    __v: 0,
  },
];
app.get("/communities/get-content-controls/:communityname", (req, res) => {
  //console.log("weslt");
  const { communityname } = req.params;

  const community = contentcontrols.find(
    (community) => community.community_name === communityname
  );
  if (community) {
    res.status(200).json(community);
  } else {
    res.status(404).json({ error: "Community not found" });
  }
});
app.patch("/communities/change-content-controls/:communityname", (req, res) => {
  const { communityname } = req.params;
  console.log(communityname);
  console.log("patch content", req.body);
});
