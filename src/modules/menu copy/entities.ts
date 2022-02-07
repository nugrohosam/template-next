export type Menu = {
  modul: string;
  items: ItemMenu[];
};

export type ItemMenu = {
  menu: string;
  slug: string;
  prefix: Prefix[];
  section: string[];
  extension: Extension[];
  extensionType: string;
};

export type Prefix = {
  access: boolean;
  name: string;
};

export type Extension = {
  name: string;
  prefix: Prefix[];
  section: string[];
  slug: string;
};
