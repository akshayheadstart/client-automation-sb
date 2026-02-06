export const permissionNodeData = {
  name: "Permission",
  children: [
    {
      name: "Super Admin",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "SuperAdminMenu",
              menu: 0,
              userType: "super_admin",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "SuperAdminUserRole",
              role: 0,
              userType: "super_admin",
            },
          ],
        },
      ],
    },
    {
      name: "Client Manager",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "clientManagerMenu",
              menu: 1,
              userType: "client_manager",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "ClientManagerUserRole",
              role: 1,
              userType: "client_manager",
            },
          ],
        },
      ],
    },
    {
      name: "College Super Admin",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "CSAMenu",
              menu: 2,
              userType: "college_super_admin",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "CSAUserRole",
              role: 2,
              userType: "college_super_admin",
            },
          ],
        },
      ],
    },
    {
      name: "College Admin",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "CAMenu",
              menu: 3,
              userType: "college_admin",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "CAUserRole",
              role: 3,
              userType: "college_admin",
            },
          ],
        },
      ],
    },
    {
      name: "College Head Counsellor",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "CHCMenu",
              menu: 4,
              userType: "college_head_counselor",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "CHCUserRole",
              role: 4,
              userType: "college_head_counselor",
            },
          ],
        },
      ],
    },
    {
      name: "College Counsellor",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "CCMenu",
              menu: 5,
              userType: "college_counselor",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "CCUserRole",
              role: 5,
              userType: "college_counselor",
            },
          ],
        },
      ],
    },
    {
      name: "College Publisher Console",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "CPCMenu",
              menu: 6,
              userType: "college_publisher_console",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "CPCUserRole",
              role: 6,
              userType: "college_publisher_console",
            },
          ],
        },
      ],
    },
    {
      name: "Panelist",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "CHCMenu",
              menu: 7,
              userType: "panelist",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "CHCUserRole",
              role: 7,
              userType: "panelist",
            },
          ],
        },
      ],
    },

    {
      name: "Authorized Approver",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "CHCMenu",
              menu: 8,
              userType: "authorized_approver",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "CHCUserRole",
              role: 8,
              userType: "authorized_approver",
            },
          ],
        },
      ],
    },
    {
      name: "Moderator",

      children: [
        {
          name: "Menu",

          children: [
            {
              name: "Permissions",
              id: 1,
              permissionName: "CHCMenu",
              menu: 9,
              userType: "moderator",
            },
          ],
        },
        {
          name: "User Role",

          children: [
            {
              name: "Permissions",
              id: 2,
              permissionName: "CHCUserRole",
              role: 9,
              userType: "moderator",
            },
          ],
        },
      ],
    },
  ],
};
