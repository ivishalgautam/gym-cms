import { CalendarDays, Crown, PieChart, Users } from "lucide-react";

const ROLES = {
  ADMIN: "admin",
  SALES_PERSON: "sales_person",
  PERSONAL_TRAINER: "personal_trainer",
  CUSTOMER: "customer",
};

const size = 18;

export const ALLROUTES = [
  {
    title: "Dashboard",
    path: "/",
    roles: [
      ROLES.ADMIN,
      ROLES.CUSTOMER,
      ROLES.PERSONAL_TRAINER,
      ROLES.SALES_PERSON,
    ],
    icon: <PieChart size={size} />,
  },
  {
    title: "Users",
    path: "/users",
    roles: [ROLES.ADMIN, ROLES.PERSONAL_TRAINER, ROLES.SALES_PERSON],
    icon: <Users size={size} />,
  },
  {
    title: "Users",
    path: "/users/create",
    roles: [ROLES.ADMIN, ROLES.PERSONAL_TRAINER, ROLES.SALES_PERSON],
    icon: <Users size={size} />,
  },
  {
    title: "Leads",
    path: "/leads",
    roles: [ROLES.SALES_PERSON],
    icon: <Users size={size} />,
  },
  {
    title: "Leads",
    path: "/leads/create",
    roles: [ROLES.SALES_PERSON],
    icon: <Users size={size} />,
  },
  {
    title: "Leads",
    path: "/leads/[id]",
    roles: [ROLES.SALES_PERSON],
    icon: <Users size={size} />,
  },
  {
    title: "Leads",
    path: "/leads/[id]/convert-to-member",
    roles: [ROLES.SALES_PERSON],
    icon: <Users size={size} />,
  },
  {
    title: "Memberships",
    path: "/memberships",
    roles: [ROLES.ADMIN, ROLES.CUSTOMER],
    icon: <CalendarDays size={size} />,
  },
  {
    title: "Membership perks",
    path: "/membership-perks",
    roles: [ROLES.ADMIN],
    icon: <Crown size={size} />,
  },
  {
    title: "Members",
    path: "/members",
    roles: [ROLES.ADMIN, ROLES.SALES_PERSON],
    icon: <Crown size={size} />,
  },
  {
    title: "Members",
    path: "/members/[id]/memberships",
    roles: [ROLES.ADMIN, ROLES.SALES_PERSON],
    icon: <Crown size={size} />,
  },
];
